import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  // 单文件打包：所有 JS/CSS 内联进一个 HTML，可双击直接用浏览器打开
  base: './',
  plugins: [vue(), viteSingleFile()],
  server: {
    port: 5180,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
