import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
