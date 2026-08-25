import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Self-hosted so the app never reaches out to a font CDN.
import "@fontsource-variable/inter/index.css";
import App from "./App.tsx";
import { prepareOfflineAssets } from "./pwa/offlineAssets.ts";

// Prevent pinch-to-zoom on iOS (Safari ignores viewport meta since iOS 10)
document.addEventListener(
  "gesturestart",
  (e) => e.preventDefault(),
  { passive: false },
);
document.addEventListener(
  "gesturechange",
  (e) => e.preventDefault(),
  { passive: false },
);
document.addEventListener(
  "gestureend",
  (e) => e.preventDefault(),
  { passive: false },
);
// Prevent pinch-to-zoom on Android (multi-touch)
document.addEventListener(
  "touchmove",
  (e) => {
    if (e.touches.length > 1) e.preventDefault();
  },
  { passive: false },
);
// Prevent double-tap zoom
let lastTouchEnd = 0;
document.addEventListener(
  "touchend",
  (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  },
  { passive: false },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

prepareOfflineAssets();
