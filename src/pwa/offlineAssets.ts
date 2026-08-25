/**
 * Everything the app needs while offline, plus the routines that get it onto
 * the device before the network disappears.
 *
 * The service worker precaches the shell (scripts, styles, fonts, icons).
 * Audio is handled here instead, because precached responses are always full
 * 200s and Safari refuses to play media that cannot answer a Range request.
 */

/** Keep in sync with AUDIO_CACHE in vite.config.ts. */
const AUDIO_CACHE = "audio-cache";

/** Resolves a `public/` file against the deploy base (`/` or `/playground/`). */
export function asset(path: string): string {
  return `${import.meta.env.BASE_URL}${path}`;
}

export const DHAMMA_AUDIO = {
  mangala: asset("dhamma/01MinGaLa-Thoat.mp3"),
  metta: asset("dhamma/03Mitta-Thoat.mp3"),
  mora: asset("dhamma/05MawRa-Thoat.mp3"),
} as const;

/**
 * Downloads the audio the service worker deliberately leaves out of the
 * precache. A plain `fetch` has no `audio` destination, so it bypasses the
 * worker's range handler and yields a complete response — which is exactly
 * what that handler needs in the cache to slice partials out of later.
 */
async function cacheAudio(): Promise<void> {
  if (!("caches" in window) || !navigator.onLine) return;

  try {
    const cache = await caches.open(AUDIO_CACHE);

    await Promise.all(
      Object.values(DHAMMA_AUDIO).map(async (url) => {
        if (await cache.match(url)) return;
        const response = await fetch(url);
        if (response.ok) await cache.put(url, response);
      }),
    );
  } catch {
    // Retried on the next `online` event; the rest of the app is unaffected.
  }
}

/**
 * Asks the browser to exempt the app from storage eviction. iOS otherwise
 * clears script-writable storage for apps left unused, which wipes the
 * precache and leaves an offline launch with nothing to load.
 */
async function requestPersistentStorage(): Promise<void> {
  try {
    if (!navigator.storage?.persist) return;
    if (await navigator.storage.persisted()) return;
    await navigator.storage.persist();
  } catch {
    // Unsupported or denied — caching still works, it is just evictable.
  }
}

export function prepareOfflineAssets(): void {
  void requestPersistentStorage();
  void cacheAudio();
  window.addEventListener("online", () => void cacheAudio());
}
