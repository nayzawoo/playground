import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface NoteTab {
  id: string;
  title: string;
  content: string;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function createTab(title: string): NoteTab {
  return { id: generateId(), title, content: "" };
}

interface NotesState {
  tabs: NoteTab[];
  activeId: string;
  addTab: () => void;
  closeTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  updateContent: (id: string, content: string) => void;
  renameTab: (id: string, title: string) => void;
}

const defaultTab = createTab("Untitled 1");

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      tabs: [defaultTab],
      activeId: defaultTab.id,

      addTab: () => {
        const { tabs } = get();
        const count = tabs.filter((t) => t.title.startsWith("Untitled")).length;
        const newTab = createTab(`Untitled ${count + 1}`);
        set({ tabs: [...tabs, newTab], activeId: newTab.id });
      },

      closeTab: (id) => {
        const { tabs, activeId } = get();
        const next = tabs.filter((t) => t.id !== id);
        if (next.length === 0) {
          const fallback = createTab("Untitled 1");
          set({ tabs: [fallback], activeId: fallback.id });
          return;
        }
        if (activeId === id) {
          const closedIdx = tabs.findIndex((t) => t.id === id);
          const newActive = next[Math.min(closedIdx, next.length - 1)];
          set({ tabs: next, activeId: newActive.id });
        } else {
          set({ tabs: next });
        }
      },

      setActiveTab: (id) => set({ activeId: id }),

      updateContent: (id, content) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, content } : t)),
        })),

      renameTab: (id, title) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, title } : t)),
        })),
    }),
    { name: "tools_notes" },
  ),
);
