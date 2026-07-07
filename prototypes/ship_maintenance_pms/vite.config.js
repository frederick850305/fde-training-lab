import vue from '../../frontend/node_modules/@vitejs/plugin-vue/dist/index.mjs'
import { fileURLToPath, URL } from 'node:url'

export default {
  plugins: [vue()],
  server: {
    port: 5175,
    strictPort: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      vue: fileURLToPath(new URL('../../frontend/node_modules/vue/dist/vue.runtime.esm-bundler.js', import.meta.url)),
    },
  },
}
