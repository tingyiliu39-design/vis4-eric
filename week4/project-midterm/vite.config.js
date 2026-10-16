import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' makes the built site work from any folder (GitHub Pages, a shared link, ...)
export default defineConfig({
  plugins: [react()],
  base: './',
})
