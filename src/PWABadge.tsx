import { useRegisterSW } from "virtual:pwa-register/react";
import {
  Alert,
  AlertTitle,
  Button,
  Snackbar,
  Stack,
} from "@mui/material";

function PWABadge() {
  const period = 60 * 60 * 1000;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0) return;
      if (r?.active?.state === "activated") {
        registerPeriodicSync(period, swUrl, r);
      } else if (r?.installing) {
        r.installing.addEventListener("statechange", (e) => {
          const sw = e.target as ServiceWorker;
          if (sw.state === "activated") registerPeriodicSync(period, swUrl, r);
        });
      }
    },
  });

  return (
    <Snackbar
      open={needRefresh}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={{ mb: { xs: 10, md: 2 } }}
    >
      <Alert
        severity="info"
        variant="filled"
        role="alert"
        aria-labelledby="pwa-update-message"
        sx={{ width: "100%", maxWidth: 360, alignItems: "flex-start" }}
        action={
          <Stack direction="row" spacing={0.5} sx={{ ml: 1 }}>
            <Button
              color="inherit"
              size="small"
              onClick={() => updateServiceWorker(true)}
            >
              Reload
            </Button>
            <Button
              color="inherit"
              size="small"
              onClick={() => setNeedRefresh(false)}
            >
              Close
            </Button>
          </Stack>
        }
      >
        <AlertTitle sx={{ mb: 0.5 }}>Update available</AlertTitle>
        <span id="pwa-update-message">
          New content is ready. Reload to get the latest version.
        </span>
      </Alert>
    </Snackbar>
  );
}

export default PWABadge;

function registerPeriodicSync(
  period: number,
  swUrl: string,
  r: ServiceWorkerRegistration,
) {
  if (period <= 0) return;

  setInterval(async () => {
    if ("onLine" in navigator && !navigator.onLine) return;

    const resp = await fetch(swUrl, {
      cache: "no-store",
      headers: {
        cache: "no-store",
        "cache-control": "no-cache",
      },
    });

    if (resp?.status === 200) await r.update();
  }, period);
}
