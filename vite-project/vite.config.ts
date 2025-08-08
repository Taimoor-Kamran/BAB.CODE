import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: "./", // ✅ This ensures correct asset resolution on Vercel
  plugins: [tailwindcss()],
})
