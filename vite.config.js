import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative paths so the site works at any address,
  // e.g. https://pranjaliprasai.github.io/portfolio/
  base: './',
  build: {
    rollupOptions: {
      output: {
        // Ship the PDF worker as .js — some hosts serve .mjs with the wrong file type
        assetFileNames: (asset) =>
          (asset.names?.[0] || asset.name || '').endsWith('.mjs')
            ? 'assets/[name]-[hash].js'
            : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
