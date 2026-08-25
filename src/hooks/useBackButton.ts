import { useEffect, useRef } from "react";

/**
 * Manages the Android hardware back button inside a standalone PWA.
 *
 * ### How the history stack works
 * ┌─────────────────────────────────────────────────────────────┐
 * │  Normal state:  [...real entries]                           │
 * │  Sidebar open:  [...real entries] + { overlay: true }  ←── │
 * └─────────────────────────────────────────────────────────────┘
 *
 * When `isActive` becomes true  → pushState adds a sentinel entry.
 * Hardware back button fires    → popstate fires; we close the overlay
 *                                 and consume the event (sentinel is
 *                                 already popped by the browser).
 * User closes overlay manually  → we call history.back() to pop the
 *                                 sentinel ourselves so the stack stays
 *                                 clean.
 *
 * ### Stale-closure safety
 * Both the push/pop logic and the popstate handler share a single
 * `isActiveRef` that is synced after every commit.  This avoids the
 * classic React stale-closure pitfall where a popstate handler captures
 * an old value of `isOpen`.
 *
 * ### iOS compatibility
 * This hook only manipulates `history.pushState` / `history.back()`.
 * It does NOT call `e.preventDefault()` on touchmove events, so it
 * cannot interfere with the iOS swipe-to-back gesture prevention that
 * `useSwipeGesture` already handles.
 *
 * @param isActive - Whether the overlay (sidebar, modal, …) is open.
 * @param onClose  - Callback to close the overlay when back is pressed.
 */
export function useBackButton(isActive: boolean, onClose: () => void) {
  // ── Refs ─────────────────────────────────────────────────────────
  // Always reflect the latest props without re-registering listeners.
  const isActiveRef = useRef(isActive);
  const onCloseRef = useRef(onClose);
  const pushedRef = useRef(false); // did WE push a sentinel?
  const handlingPopRef = useRef(false); // are we inside the popstate callback?

  // Sync after every commit rather than during render; popstate only fires
  // from user interaction, which is always after the commit has flushed.
  useEffect(() => {
    isActiveRef.current = isActive;
    onCloseRef.current = onClose;
  });

  // ── Push / pop sentinel when overlay opens / closes ──────────────
  useEffect(() => {
    if (isActive) {
      // Overlay just opened → push sentinel.
      window.history.pushState({ overlay: true }, "");
      pushedRef.current = true;
    } else if (pushedRef.current && !handlingPopRef.current) {
      // Overlay was closed MANUALLY (not via hardware back).
      // Pop the sentinel so the history stack stays clean.
      pushedRef.current = false;
      window.history.back();
    }
  }, [isActive]);

  // ── Listen for hardware back button ──────────────────────────────
  useEffect(() => {
    const handlePopState = () => {
      if (isActiveRef.current && pushedRef.current) {
        // The browser already popped our sentinel entry.
        // Just close the overlay; don't call history.back() again.
        handlingPopRef.current = true;
        pushedRef.current = false;
        onCloseRef.current();
        // Reset the flag after React has had a chance to update state.
        requestAnimationFrame(() => {
          handlingPopRef.current = false;
        });
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []); // intentionally empty – refs keep values fresh
}
