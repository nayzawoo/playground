import { useRef, useCallback, useEffect } from "react";

const EDGE_ZONE = 30; // px from left edge to start detecting
const OPEN_THRESHOLD = 100; // px swipe distance to fully open

interface SwipeGestureOptions {
  drawerWidth: number;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onDrag: (translateX: number) => void;
  onDragEnd: () => void;
  enabled?: boolean;
}

export function useSwipeGesture({
  drawerWidth,
  isOpen,
  onOpen,
  onClose,
  onDrag,
  onDragEnd,
  enabled = true,
}: SwipeGestureOptions) {
  const tracking = useRef(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isEdgeSwipe = useRef(false);
  const directionLocked = useRef<"horizontal" | "vertical" | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled) return;
      const touch = e.touches[0];
      startX.current = touch.clientX;
      startY.current = touch.clientY;
      currentX.current = touch.clientX;
      directionLocked.current = null;

      // Opening: must start from left edge
      // Closing: can start anywhere (when sidebar is open)
      if (!isOpen && touch.clientX <= EDGE_ZONE) {
        isEdgeSwipe.current = true;
        tracking.current = true;
      } else if (isOpen) {
        isEdgeSwipe.current = false;
        tracking.current = true;
      }
    },
    [isOpen, enabled],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!tracking.current) return;
      const touch = e.touches[0];
      const dx = touch.clientX - startX.current;
      const dy = touch.clientY - startY.current;

      // Lock direction after 10px of movement
      if (!directionLocked.current && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
        directionLocked.current =
          Math.abs(dx) > Math.abs(dy) ? "horizontal" : "vertical";
      }

      // If vertical scroll, stop tracking
      if (directionLocked.current === "vertical") {
        tracking.current = false;
        onDragEnd();
        return;
      }

      // Prevent browser back swipe on iOS when we're handling it
      if (directionLocked.current === "horizontal" && isEdgeSwipe.current) {
        e.preventDefault();
      }

      currentX.current = touch.clientX;
      
      if (directionLocked.current === "horizontal") {
        if (!isOpen) {
          // Opening gesture: clamp between 0 and drawerWidth
          const translateX = Math.max(0, Math.min(dx, drawerWidth));
          onDrag(translateX);
        } else {
          // Closing gesture: clamp between 0 and drawerWidth (left swipe)
          const translateX = Math.max(0, drawerWidth + Math.min(0, dx));
          onDrag(translateX);
        }
      }
    },
    [isOpen, drawerWidth, onDrag, onDragEnd],
  );

  const handleTouchEnd = useCallback(() => {
    if (!tracking.current) return;
    tracking.current = false;
    isEdgeSwipe.current = false;

    const dx = currentX.current - startX.current;

    if (!isOpen) {
      // Opening: if swiped past threshold, open
      if (dx >= OPEN_THRESHOLD) {
        onOpen();
      } else {
        onDragEnd();
      }
    } else {
      // Closing: if swiped left past threshold, close
      if (dx <= -OPEN_THRESHOLD) {
        onClose();
      } else {
        onDragEnd();
      }
    }
  }, [isOpen, onOpen, onClose, onDragEnd]);

  useEffect(() => {
    if (!enabled) return;
    const opts: AddEventListenerOptions = { passive: false };
    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, opts);
    document.addEventListener("touchend", handleTouchEnd, { passive: true });
    document.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);
}
