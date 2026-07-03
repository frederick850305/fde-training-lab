import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'vue-router': fileURLToPath(new URL('./src/routerShim.js', import.meta.url)),
      'element-plus': fileURLToPath(new URL('./src/elementPlusShim.js', import.meta.url)),
      '@element-plus/icons-vue': fileURLToPath(new URL('./src/elementPlusIconsShim.js', import.meta.url)),
      'vuedraggable': fileURLToPath(new URL('./src/draggableShim.js', import.meta.url)),
    },
  },
})
