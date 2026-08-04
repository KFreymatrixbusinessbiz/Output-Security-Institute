import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        doctrine: resolve(import.meta.dirname, 'doctrine.html'),
        controls: resolve(import.meta.dirname, 'controls.html'),
        standards: resolve(import.meta.dirname, 'standards.html'),
        industries: resolve(import.meta.dirname, 'industries.html'),
        evidence: resolve(import.meta.dirname, 'evidence.html'),
        resources: resolve(import.meta.dirname, 'resources.html'),
        pathways: resolve(import.meta.dirname, 'pathways.html'),
        briefings: resolve(import.meta.dirname, 'briefings.html'),
        methodology: resolve(import.meta.dirname, 'methodology.html'),
        governance: resolve(import.meta.dirname, 'governance.html'),
        maturity: resolve(import.meta.dirname, 'maturity.html'),
        profiles: resolve(import.meta.dirname, 'profiles.html'),
        tools: resolve(import.meta.dirname, 'tools.html'),
        about: resolve(import.meta.dirname, 'about.html')
      }
    }
  }
})
