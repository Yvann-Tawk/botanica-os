import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Cross-origin isolation lets the Python worker block on input() (SharedArrayBuffer + Atomics)
// and be interrupted cleanly. Production hosting must send the same two headers (see vercel.json).
const isolation = {
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Embedder-Policy': 'require-corp',
};

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Ask before swapping in a new version, so nobody loses an unsaved run mid-lesson.
      registerType: 'prompt',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Botanica OS',
        short_name: 'Botanica',
        description: 'Learn Python by exploring a botanical cosmos. Runs real Python in your browser.',
        theme_color: '#efe8d6',
        background_color: '#efe8d6',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        // The app shell, fonts and code chunks (Monaco included) are precached: the app opens offline.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png,webmanifest,json}'],
        globIgnores: ['pyodide/**'],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: 'index.html',
        // Python (~10 MB) is cached the first time it loads, or on request from Settings.
        runtimeCaching: [{
          urlPattern: ({ url }) => url.pathname.includes('/pyodide/'),
          handler: 'CacheFirst',
          // ignoreVary: servers often send `Vary: Origin`, and module imports carry an Origin header, so a strict
          // match would miss the cached copy offline.
          options: { cacheName: 'pyodide', cacheableResponse: { statuses: [200] }, matchOptions: { ignoreVary: true } },
        }],
      },
    }),
  ],
  build: { target: 'es2022' },
  worker: { format: 'es' },
  server: { headers: isolation },
  preview: { headers: isolation },
  optimizeDeps: { exclude: ['pyodide'] },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    testTimeout: 30000,
  },
});
