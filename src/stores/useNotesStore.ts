import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NoteTab {
  id: string;
  title: string;
  content: string;
}

export type SyncStatus =
  | "idle"
  | "saved-locally"
  | "syncing"
  | "synced"
  | "offline"
  | "error";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createTab(title: string): NoteTab {
  return { id: generateId(), title, content: "" };
}

interface NotesState {
  tabs: NoteTab[];
  activeId: string;
  lastModified: number;
  syncStatus: SyncStatus;
  syncError: string | null;
  password: string;

  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  renameTab: (id: string, title: string) => void;
  setPassword: (pw: string) => void;
  setSyncStatus: (status: SyncStatus, error?: string | null) => void;
  syncToCloud: () => Promise<void>;
  fetchFromCloud: () => Promise<void>;
}

const defaultTab = createTab("Untitled 1");

const API_BASE = "/api/notes";

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      tabs: [defaultTab],
      activeId: defaultTab.id,
      lastModified: Date.now(),
      syncStatus: "idle" as SyncStatus,
      syncError: null,
      password: "",

      addTab: () => {
        const { tabs } = get();
        const count = tabs.filter((t) => t.title.startsWith("Untitled")).length;
        const newTab = createTab(`Untitled ${count + 1}`);
        set({
          tabs: [...tabs, newTab],
          activeId: newTab.id,
          lastModified: Date.now(),
          syncStatus: "saved-locally",
        });
      },

      closeTab: (id) => {
        const { tabs, activeId } = get();
        const next = tabs.filter((t) => t.id !== id);
        if (next.length === 0) {
          const fallback = createTab("Untitled 1");
          set({
            tabs: [fallback],
            activeId: fallback.id,
            lastModified: Date.now(),
            syncStatus: "saved-locally",
          });
          return;
        }
        if (activeId === id) {
          const closedIdx = tabs.findIndex((t) => t.id === id);
          const newActive = next[Math.min(closedIdx, next.length - 1)];
          set({
            tabs: next,
            activeId: newActive.id,
            lastModified: Date.now(),
            syncStatus: "saved-locally",
          });
        } else {
          set({ tabs: next, lastModified: Date.now(), syncStatus: "saved-locally" });
        }
      },

      setActiveTab: (id) => set({ activeId: id }),

      updateContent: (id, content) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, content } : t)),
          lastModified: Date.now(),
          syncStatus: "saved-locally" as SyncStatus,
        })),

      renameTab: (id, title) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)),
          lastModified: Date.now(),
          syncStatus: "saved-locally" as SyncStatus,
        })),

      setPassword: (pw) => set({ password: pw }),

      setSyncStatus: (status, error = null) =>
        set({ syncStatus: status, syncError: error }),

      syncToCloud: async () => {
        const { tabs, activeId, lastModified, password } = get();
        if (!password) {
          set({ syncStatus: "error", syncError: "Password required" });
          return;
        }
        if (!navigator.onLine) {
          set({ syncStatus: "offline", syncError: null });
          return;
        }

        set({ syncStatus: "syncing", syncError: null });
        try {
          const res = await fetch(API_BASE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Edit-Password": password,
            },
            body: JSON.stringify({ tabs, activeId, lastModified }),
          });
          const json = await res.json();
          if (!res.ok) {
            set({ syncStatus: "error", syncError: json.error || "Sync failed" });
            return;
          }
          set({ syncStatus: "synced", syncError: null });
        } catch {
          set({
            syncStatus: navigator.onLine ? "error" : "offline",
            syncError: navigator.onLine ? "Network error" : null,
          });
        }
      },

      fetchFromCloud: async () => {
        if (!navigator.onLine) {
          set({ syncStatus: "offline" });
          return;
        }

        try {
          const res = await fetch(API_BASE);
          const json = await res.json();
          if (!res.ok || !json.success || !json.data) return;

          const remote =
            typeof json.data === "string" ? JSON.parse(json.data) : json.data;
          if (!remote.tabs || !Array.isArray(remote.tabs)) return;

          const local = get();
          const remoteTime = remote.lastModified || 0;
          const localTime = local.lastModified || 0;

          // Only overwrite if remote is newer
          if (remoteTime > localTime) {
            set({
              tabs: remote.tabs,
              activeId: remote.activeId || remote.tabs[0]?.id,
              lastModified: remoteTime,
              syncStatus: "synced",
            });
          }
        } catch {
          // Silently fail — offline-first means local data wins
        }
      },
    }),
    {
      name: "tools_notes",
      partialize: (state) => ({
        tabs: state.tabs,
        activeId: state.activeId,
        lastModified: state.lastModified,
        password: state.password,
      }),
    },
  ),
);
