import { useEffect, useRef } from "react";

/**
 * Manages the Android hardware back button inside a standalone PWA.
 *
 * When the sidebar (or any overlay) opens, a dummy history entry is pushed.
 * Pressing the hardware back button fires `popstate`, which closes the overlay
 * instead of navigating away / exiting the app.
 *
 * If the overlay is closed manually (tap overlay, swipe, etc.) we call
 * `history.back()` to pop the dummy entry so the stack stays clean.
 */
export function useBackButton(isOpen: boolean, onClose: () => void) {
  // Track whether WE pushed the dummy entry so we don't double-pop.
  const pushedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      // Push a dummy history entry when the overlay opens.
      window.history.pushState({ overlay: true }, "");
      pushedRef.current = true;
    } else if (pushedRef.current) {
      // Overlay was closed manually (not via back button).
      // Pop the dummy entry we pushed earlier.
      pushedRef.current = false;
      window.history.back();
    }
  }, [isOpen]);

  useEffect(() => {
    const handlePopState = (_e: PopStateEvent) => {
      if (isOpen) {
        // Back button pressed while overlay is open → close it.
        pushedRef.current = false;
        onClose();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);
}
