import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Use a relative base so the built app can be hosted from GitHub Pages
  // or any subpath / custom domain without absolute asset paths breaking.
  base: './',
})
