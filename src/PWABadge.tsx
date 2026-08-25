import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Alert, Button, Snackbar, Stack } from "@mui/material";

/** How often to look for a new deployment while the app stays open. */
const UPDATE_CHECK_INTERVAL = 60 * 60 * 1000;

/**
 * Keeps the installed app up to date without ever getting in the way.
 *
 * The service worker downloads and precaches new scripts, styles and assets on
 * its own as soon as it finds them. All this component decides is *when* the
 * page swaps over to them, since the plugin would otherwise reload mid-use.
 */
function PWABadge() {
  const [updateReady, setUpdateReady] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useRegisterSW({
    onNeedReload() {
      if (document.visibilityState === "hidden") {
        window.location.reload();
        return;
      }
      setUpdateReady(true);
    },
    onRegisteredSW(swUrl, registration) {
      if (registration) watchForUpdates(swUrl, registration);
    },
  });

  // Swapping over while the app sits in the background means the user simply
  // returns to the new version, with no reload to notice or dismiss.
  useEffect(() => {
    if (!updateReady) return;

    const reloadWhenHidden = () => {
      if (document.visibilityState === "hidden") window.location.reload();
    };

    document.addEventListener("visibilitychange", reloadWhenHidden);
    return () =>
      document.removeEventListener("visibilitychange", reloadWhenHidden);
  }, [updateReady]);

  return (
    <Snackbar
      open={updateReady && !dismissed}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ mb: { xs: 10, md: 2 } }}
    >
      <Alert
        severity="info"
        variant="filled"
        role="alert"
        aria-labelledby="pwa-update-message"
        sx={{ width: "100%", maxWidth: 360, alignItems: "center" }}
        action={
          <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
            <Button
              color="inherit"
              size="small"
              onClick={() => window.location.reload()}
            >
              Reload
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => setDismissed(true)}
            >
              Later
            </Button>
          </Stack>
        }
      >
        <span id="pwa-update-message">A new version is ready.</span>
      </Alert>
    </Snackbar>
  );
}

export default PWABadge;

let watching = false;

/**
 * Polls for a newer service worker. iOS suspends timers while an installed PWA
 * is backgrounded, so coming back to the foreground — not the interval — is
 * what actually catches most new versions.
 */
function watchForUpdates(swUrl: string, registration: ServiceWorkerRegistration) {
  if (watching) return;
  watching = true;

  const check = async () => {
    if (!navigator.onLine || registration.installing) return;

    try {
      // Bypass the HTTP cache so a stale sw.js cannot mask a new deployment.
      const response = await fetch(swUrl, {
        cache: "no-store",
        headers: { "cache-control": "no-cache" },
      });
      if (response.ok) await registration.update();
    } catch {
      // Unreachable right now; the next trigger tries again.
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void check();
  });
  window.addEventListener("online", () => void check());
  setInterval(() => void check(), UPDATE_CHECK_INTERVAL);
}
