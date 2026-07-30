import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  // This example points at a deliberately missing SVG. Vite's default SPA
  // fallback would answer that with index.html and a 200, so the injector
  // would neither inject nor error, and the fallback would never render.
  appType: 'mpa',
  plugins: [react()],
})
