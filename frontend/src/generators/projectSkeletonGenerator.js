import { buildProjectPath } from './prototypeContract'

export function buildProjectConfigFiles({ slug, projectName = '原型系统' }) {
  return [
    {
      path: buildProjectPath(slug, 'package.json'),
      content: JSON.stringify({
        name: slug,
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies: { '@vitejs/plugin-vue': '^6.0.1', vite: '^7.2.7', vue: '^3.5.26' },
        devDependencies: {},
      }, null, 2) + '\n',
    },
    {
      path: buildProjectPath(slug, 'index.html'),
      content: `<!doctype html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${projectName}</title>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.js"></` + `script>\n  </body>\n</html>\n`,
    },
    {
      path: buildProjectPath(slug, 'vite.config.js'),
      content: `import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\nimport { fileURLToPath, URL } from 'node:url'\n\nexport default defineConfig({\n  plugins: [vue()],\n  resolve: {\n    alias: {\n      '@': fileURLToPath(new URL('./src', import.meta.url)),\n      'vue-router': fileURLToPath(new URL('./src/routerShim.js', import.meta.url)),\n      'element-plus': fileURLToPath(new URL('./src/elementPlusShim.js', import.meta.url)),\n      '@element-plus/icons-vue': fileURLToPath(new URL('./src/elementPlusIconsShim.js', import.meta.url)),\n      'vuedraggable': fileURLToPath(new URL('./src/draggableShim.js', import.meta.url)),\n    },\n  },\n})\n`,
    },
    {
      path: buildProjectPath(slug, 'src/main.js'),
      content: `import { createApp } from 'vue'\nimport App from './App.vue'\nimport './style.css'\n\ncreateApp(App).mount('#app')\n`,
    },
    {
      path: buildProjectPath(slug, 'src/routerShim.js'),
      content: `let currentRoute = {\n  query: {},\n  params: {},\n  path: '/',\n  name: '',\n}\n\nlet navigator = null\n\nexport function installPrototypeRouter(handler) {\n  navigator = handler\n}\n\nfunction resolveTarget(target) {\n  if (typeof target === 'string') {\n    return { path: target, query: {}, params: {}, name: '' }\n  }\n  return {\n    path: target?.path || '',\n    name: target?.name || '',\n    query: target?.query || {},\n    params: target?.params || {},\n  }\n}\n\nexport function useRouter() {\n  return {\n    push(target) {\n      const route = resolveTarget(target)\n      currentRoute = route\n      if (navigator) navigator(route)\n    },\n    back() {\n      if (navigator) navigator({ path: '__back__' })\n    },\n    replace(target) {\n      const route = resolveTarget(target)\n      currentRoute = route\n      if (navigator) navigator(route)\n    },\n  }\n}\n\nexport function useRoute() {\n  return currentRoute\n}\n`,
    },
    {
      path: buildProjectPath(slug, 'src/elementPlusShim.js'),
      content: `function show(type, message) { console.log('[' + type + ']', message) }\nexport const ElMessage = {\n  success(message) { show('success', message) },\n  warning(message) { show('warning', message) },\n  error(message) { show('error', message) },\n  info(message) { show('info', message) },\n}\nexport const ElMessageBox = { confirm(message) { return Promise.resolve(window.confirm(message)) } }\n`,
    },
    {
      path: buildProjectPath(slug, 'src/elementPlusIconsShim.js'),
      content: `export const Search = { name: 'SearchIcon', template: '<span>⌕</span>' }\n`,
    },
    {
      path: buildProjectPath(slug, 'src/draggableShim.js'),
      content: `export default {\n  name: 'DraggableShim',\n  props: { modelValue: { type: Array, default: () => [] } },\n  emits: ['update:modelValue', 'change'],\n  template: '<div><slot v-for=\"(element, index) in modelValue\" name=\"item\" :element=\"element\" :index=\"index\" /></div>',\n}\n`,
    },
    {
      path: buildProjectPath(slug, 'src/assets/empty.svg'),
      content: `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="160" viewBox="0 0 240 160" role="img" aria-label="empty state">
  <rect width="240" height="160" rx="12" fill="#f1f5f9"/>
  <rect x="52" y="48" width="136" height="72" rx="10" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
  <path d="M76 80h88M76 99h56" stroke="#94a3b8" stroke-width="8" stroke-linecap="round"/>
  <circle cx="170" cy="61" r="10" fill="#dbeafe"/>
</svg>
`,
    },
  ]
}

export function buildBaseStyleFiles({ slug }) {
  return [
    {
      path: buildProjectPath(slug, 'src/style.css'),
      content: `:root {\n  color: #0f172a;\n  background: #eef3f8;\n  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n}\n* { box-sizing: border-box; }\nhtml, body, #app { margin: 0; min-width: 320px; height: 100%; background: #eef3f8; }\nbutton, input, select, textarea { font: inherit; }\nbutton { cursor: pointer; }\n.app-shell { height: 100vh; min-height: 0; display: grid; grid-template-columns: 280px minmax(0, 1fr); overflow: hidden; }\n.side-nav { min-height: 0; background: #0f172a; color: #e2e8f0; padding: 18px 16px; display: flex; flex-direction: column; gap: 14px; box-shadow: 12px 0 30px rgba(15, 23, 42, 0.12); }\n.brand { display: grid; gap: 4px; color: #fff; }\n.brand strong { font-size: 18px; font-weight: 900; }\n.brand span { color: #94a3b8; font-size: 12px; }\n.role-panel { display: grid; gap: 8px; padding: 10px; border: 1px solid rgba(148, 163, 184, .28); border-radius: 8px; background: rgba(15, 23, 42, .32); }\n.role-panel label { font-size: 12px; color: #94a3b8; font-weight: 800; }\n.role-panel select { width: 100%; border: 1px solid rgba(148, 163, 184, .38); border-radius: 7px; padding: 8px 10px; background: #111827; color: #fff; }\n.role-user { display: flex; justify-content: space-between; gap: 8px; color: #cbd5e1; font-size: 12px; }\n.nav-scroll { min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 8px; padding-right: 2px; }\n.nav-group { display: grid; gap: 6px; }\n.nav-group-title { width: 100%; border: 0; border-radius: 8px; padding: 9px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #cbd5e1; background: transparent; font-size: 12px; font-weight: 900; text-align: left; }\n.nav-group-title:hover { background: rgba(255, 255, 255, .07); color: #fff; }\n.nav-group-title-main { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }\n.nav-group-title-main span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.nav-group-count { color: #94a3b8; font-size: 11px; font-weight: 800; }\n.nav-group-routes { list-style: none; margin: 0; padding: 0 0 0 8px; display: grid; gap: 5px; }\n.nav-button { width: 100%; border: 1px solid transparent; border-radius: 8px; padding: 9px 10px; background: transparent; color: #cbd5e1; text-align: left; font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.nav-button.active, .nav-button:hover { background: #1d4ed8; color: #fff; }\n.main-panel { min-width: 0; min-height: 0; padding: 22px; overflow: auto; }\n.page-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; padding: 18px; box-shadow: 0 12px 30px rgb(15 23 42 / 0.06); }\n.page-title { margin: 0 0 6px; font-size: 24px; font-weight: 900; }\n.page-desc { margin: 0 0 18px; color: #64748b; line-height: 1.6; }\n.grid { display: grid; gap: 14px; }\n.grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.panel { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #f8fafc; }\n.panel h3 { margin: 0 0 10px; font-size: 15px; }\n.metric { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n.metric strong { font-size: 24px; }\n.table { width: 100%; border-collapse: collapse; font-size: 13px; }\n.table th, .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }\n.status { display: inline-flex; border-radius: 999px; padding: 3px 9px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; }\n.actions { display: flex; flex-wrap: wrap; gap: 8px; }\n.primary { border: 0; border-radius: 7px; padding: 8px 12px; background: #2563eb; color: #fff; font-weight: 800; }\n.secondary { border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 12px; background: #fff; color: #334155; font-weight: 800; }\n@media (max-width: 900px) { .app-shell { grid-template-columns: 1fr; height: auto; min-height: 100vh; overflow: visible; } .side-nav { max-height: none; } .nav-scroll { max-height: 48vh; } .grid.cols-2, .grid.cols-3 { grid-template-columns: 1fr; } }\n`,
    },
  ]
}
