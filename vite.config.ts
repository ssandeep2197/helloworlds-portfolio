import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Site is served from the root of helloworlds.co.in on the VPS.
  // (Previously '/helloworlds-portfolio/' for GitHub Pages.)
  base: '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})
