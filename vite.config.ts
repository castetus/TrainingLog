// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/TrainingLog/',                     // <— GH Pages subpath
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'generateSW',
      // IMPORTANT: no leading slash here for GH Pages
      workbox: {
        navigateFallback: 'index.html',
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
      manifest: {
        name: 'Training Log',
        short_name: 'TrainingLog',
        description: 'Workout tracker PWA',
        start_url: '/TrainingLog/',          // <— align with base
        scope: '/TrainingLog/',              // <— align with base
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0ea5e9',
        // TIP: keep icon srcs RELATIVE (no leading /) so they resolve under /TrainingLog/
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable any' }
        ],
      },
    }),
  ],
})
