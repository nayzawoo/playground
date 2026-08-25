import { VitePWA } from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isGhPages = process.env.DEPLOY_TARGET === "gh-pages";
const base = isGhPages ? "/playground/" : "/";

/** Keep in sync with AUDIO_CACHE in src/pwa/offlineAssets.ts. */
const AUDIO_CACHE = "audio-cache";

// https://vitejs.dev/config/
export default defineConfig({
  base,
  build: {
    outDir: "build",
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: false,

      // Icons are generated once into public/ by `pnpm generate:pwa-assets`.
      // Regenerating them through sharp on every build adds significant latency.
      pwaAssets: {
        disabled: true,
      },

      manifest: {
        id: base,
        name: "Tools",
        short_name: "Tools",
        description: "Tools",
        display: "standalone",
        start_url: base,
        scope: base,
        theme_color: "#0a0c12",
        background_color: "#0a0c12",
        icons: [
          {
            src: "pwa-64x64.png",
            sizes: "64x64",
            type: "image/png",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },

      workbox: {
        // The entire shell — scripts, styles, fonts and icons — is precached,
        // so a cold launch never touches the network. There are no CDN
        // resources; anything not precached is deliberately network-only.
        globPatterns: [
          "**/*.{js,css,html,svg,png,ico,webp,jpg,jpeg,woff,woff2,ttf,webmanifest}",
        ],
        maximumFileSizeToCacheInBytes: 6 * 1024 * 1024,
        navigateFallback: "index.html",
        navigateFallbackDenylist: [/^\/api\//],
        skipWaiting: true,
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            // Audio stays out of the precache: the precache strategy answers
            // every request with a full 200, but Safari needs a 206 for media.
            // rangeRequests slices the cached file to satisfy Range headers.
            urlPattern: ({ request }) => request.destination === "audio",
            handler: "CacheFirst",
            options: {
              cacheName: AUDIO_CACHE,
              rangeRequests: true,
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },

      devOptions: {
        enabled: false,
        navigateFallback: "index.html",
        suppressWarnings: true,
        type: "module",
      },
    }),
  ],
});
