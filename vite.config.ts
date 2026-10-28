import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            if (id.includes('@monaco-editor') || id.includes('monaco-editor')) {
              return 'vendor-monaco';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
            return 'vendor-misc';
          }
          if (id.includes('src/data/')) {
            if (id.includes('quizQuestions')) {
              return 'data-quiz';
            }
            if (id.includes('algoPatterns')) {
              return 'data-patterns';
            }
            if (id.includes('cheatsheetData')) {
              return 'data-cheatsheet';
            }
            if (id.includes('src/data/questions/')) {
              return 'data-questions';
            }
          }
        }
      }
    }
  }
})

