import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Power Zero Sentinel',
        short_name: 'Zhero',
        description: 'Privacy-first wealth leak sentinel',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'https://labs.aura360studio.com/favicon.ico',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
