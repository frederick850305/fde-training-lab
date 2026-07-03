<template>
  <section class="prototype-generate-view" aria-labelledby="pg-title">
    <ViewHeading eyebrow="Generate Prototype" title="生成原型" title-id="pg-title"
      description="每个文件/组件独立调用 LLM，单次输出不超过 ~200 行，避免超时。失败项可单独重试。" />

    <div v-if="!prevOk" class="empty-hint">
      <span>📋</span><strong>请先完成前四步</strong>
      <p>需要先确认「需求拆解 → 场景→页面 → 交互与API → 前端原型方案」。</p>
    </div>

    <template v-else>
      <div v-if="!llmOk" class="warn-banner">
        <span>⚠️</span><div><strong>需要 LLM 服务</strong><p>请在顶部切换「大模型生成」，保存 Key，启动后端。</p></div>
      </div>

      <div class="project-info">
        <div class="info-card"><span class="info-label">目标</span><code class="info-path">prototypes/{{ slug }}/</code></div>
        <div class="info-card"><span class="info-label">规模</span><span class="info-value">{{ pageItems.length }} 页 + {{ compItems.length }} 组件</span></div>
      </div>

      <div class="progress-overview">
        <div class="progress-bar-track"><div class="progress-bar-fill" :style="{ width: pct + '%' }"></div></div>
        <span class="progress-text">{{ done }} / {{ total }} 完成</span>
      </div>
      <div v-if="curTask" class="cur-task">
        <span class="ct-dot"></span>
        <span>正在生成：<strong>{{ curTask }}</strong></span>
      </div>

      <!-- ====== Skeleton ====== -->
      <div class="section-label">🏗 项目骨架</div>
      <ItemCard v-for="sk in skelItems" :key="sk.key" :item="sk" :busy="isBusy" @gen="genSkel(sk)" @retry="genSkel(sk)" />

      <!-- ====== Pages ====== -->
      <div class="section-label">📄 页面文件（每页一次调用）</div>
      <div class="item-grid">
        <ItemCard v-for="pi in pageItems" :key="pi.key" :item="pi" :busy="isBusy" :disable="!skelDone" :disableHint="skelDone?'':'请先生成骨架'" @gen="genPage(pi)" @retry="genPage(pi)" />
      </div>

      <!-- ====== Components ====== -->
      <div class="section-label">🧩 通用组件（每个一次调用）</div>
      <div class="item-grid">
        <ItemCard v-for="ci in compItems" :key="ci.key" :item="ci" :busy="isBusy" :disable="!skelDone" :disableHint="skelDone?'':'请先生成骨架'" @gen="genComp(ci)" @retry="genComp(ci)" />
      </div>

      <!-- ====== Mock ====== -->
      <div class="section-label">📦 Mock 数据</div>
      <ItemCard :item="mockItem" :busy="isBusy" :disable="!skelDone" :disableHint="skelDone?'':'请先生成骨架'" @gen="genMock" @retry="genMock" />

      <!-- ====== App Shell ====== -->
      <div class="section-label">🧭 应用壳与导航</div>
      <ItemCard :item="appItem" :busy="isBusy" :disable="!coreDone" :disableHint="coreDone?'':'请先生成 Mock、组件和页面'" @gen="genAppShell" @retry="genAppShell" />

      <!-- ====== Action ====== -->
      <p v-if="writeStatus" class="write-msg" :class="{ err: writeStatus.includes('❌') }">{{ writeStatus }}</p>
      <div class="action-bar">
        <button class="gen-all-btn" :disabled="isBusy || allDone" @click="genAll">{{ isBusy ? '⏳' : allDone ? '✅ 完成' : '⚡ 生成缺失项' }}</button>
        <button v-if="hasFailed" class="write-btn" :disabled="isBusy" @click="retryFailed">重试失败项</button>
        <button v-if="allDone" class="primary-btn" @click="confirmAndFinish">确认并完成 →</button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

/* ── ItemCard 子组件 ── */
const ItemCard = { props: ['item','busy','disable','disableHint'], emits: ['gen','retry'],
  template: `
    <article class="item-card" :class="{ running: item.st === 'running', done: item.st === 'done', fail: item.st === 'fail' }">
      <div class="ic-head">
        <span class="ic-icon">{{ icon[item.st] || '⬜' }}</span>
        <div class="ic-body"><strong>{{ item.label }}</strong><small>{{ item.desc }}</small></div>
        <span class="ic-count">{{ item.n }} 文件</span>
      </div>
      <div v-if="item.st === 'running'" class="ic-detail"><p class="ic-msg">{{ item.msg }}</p></div>
      <div v-if="item.st === 'fail'" class="ic-detail"><p class="ic-err">{{ item.err }}</p><button class="rbtn" :disabled="busy" @click="$emit('retry')">🔄 重试</button></div>
      <div v-if="item.st === 'done' && item.files?.length" class="ic-files"><ul><li v-for="f in item.files" :key="f.path"><span>📄</span><code>{{ f.path }}</code></li></ul><button class="rbtn o" :disabled="busy" @click="$emit('retry')">🔄 重生成</button></div>
      <div v-if="item.st === 'idle' && !disable" class="ic-detail"><button class="gbtn" @click="$emit('gen')">⚡ 生成</button></div>
      <div v-if="item.st === 'idle' && disable" class="ic-detail"><p class="hint">{{ disableHint || '等待前置' }}</p></div>
    </article>`,
  data: () => ({ icon: { done:'✅', running:'⏳', fail:'❌' } }),
}

/* ================================================================ */
const props = defineProps({ projectContext: { type: Object, required: true } })
const emit = defineEmits(['prototype-generated', 'prototype-draft-update'])
const isBusy = ref(false)
const curTask = ref('')
const diskFiles = ref(new Set())
const isCheckingDisk = ref(false)

const prevOk  = computed(() => Boolean(props.projectContext.stepResults?.prototype))
const llmOk   = computed(() => props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured)
const sug     = computed(() => props.projectContext.stepResults?.prototype || props.projectContext.selectedPrototypeSuggestion || null)
const slug    = computed(() => (props.projectContext.projectName || 'prototype').replace(/[^\w\u4e00-\u9fff-]/g, '-').toLowerCase())

/* ── Items ── */
function mkItem(key, label, desc, n) { return { key, label, desc, n, st: 'idle', msg: '', err: '', files: [] } }

const skelItems = ref([
  mkItem('skel_config', '① 项目配置', 'package.json、vite.config.js、index.html、main.js 和兼容 shim', 8),
  mkItem('skel_app',    '② App.vue + CSS', '根组件 App.vue 和全局样式 style.css — 骨架核心', 2),
])
const skelDone = computed(() => skelItems.value.every(s => s.st === 'done'))

const pageItems = ref([])
watch(sug, s => {
  if (!s) { pageItems.value = []; return }
  const vf = s.viewFiles || []; const sp = s.pageDetailSpecs || []
  pageItems.value = vf.map((v, i) => mkItem('pg_'+i, v.file, (sp[i]?.responsibility || v.responsibility || '').slice(0, 60), 1))
}, { immediate: true })

const compItems = ref([])
watch(sug, s => {
  if (!s) { compItems.value = []; return }
  compItems.value = (s.componentFiles || []).map((c, i) => mkItem('cmp_'+i, c.file, c.responsibility?.slice(0,60) || '共享组件', 1))
  if (!compItems.value.length) compItems.value = [
    mkItem('cmp_0', 'DataTable.vue', '通用表格组件', 1),
    mkItem('cmp_1', 'StatusTag.vue', '状态标签组件', 1),
    mkItem('cmp_2', 'MetricCard.vue', '指标卡片组件', 1),
  ]
}, { immediate: true })

const mockItem = ref(mkItem('mock', 'Mock 数据与 API', '各页面 mock 数据 + api/index.js', 2))
watch(sug, s => { if (s) { const mf = s.mockDataFiles || []; mockItem.value.n = mf.length + (s.pageApiMapping?.length ? 1 : 0); mockItem.value.desc = mockItem.value.n + ' 个文件' } })

const appItem = ref(mkItem('app_shell', 'App.vue 应用壳', '根据导航结构接入所有页面组件', 1))
const coreDone = computed(() => skelDone.value && mockItem.value.st === 'done' && pageItems.value.every(i => i.st === 'done') && compItems.value.every(i => i.st === 'done'))

const allItems = computed(() => [...skelItems.value, mockItem.value, ...compItems.value, ...pageItems.value, appItem.value])
const total = computed(() => allItems.value.length)
const done  = computed(() => allItems.value.filter(i => i.st === 'done').length)
const pct   = computed(() => total.value ? Math.round(done.value / total.value * 100) : 0)
const allDone = computed(() => total.value > 0 && allItems.value.every(i => i.st === 'done'))
const hasFailed = computed(() => allItems.value.some(i => i.st === 'fail'))

/* ================================================================
   从已保存状态恢复（切换步骤后回到本页不丢失进度）
   ================================================================ */
function restoreSavedState() {
  const saved = props.projectContext.stepResults?.prototypeGenerate
  if (!saved?.items?.length) return
  const savedMap = Object.fromEntries(saved.items.map(it => [it.key, it]))

  function restore(arr) {
    for (const it of arr) {
      const s = savedMap[it.key]
      if (!s) continue
      it.st = s.st || it.st
      it.files = (s.files || []).map(f => typeof f === 'string' ? { path: f, content: '' } : f)
      it._rawFiles = it.files
      it.msg = s.st === 'done' ? `✅ ${it.files.length} 文件` : (s.msg || it.msg)
      it.err = s.err || it.err
    }
  }

  restore(skelItems.value)
  restore(pageItems.value)
  restore(compItems.value)
  restore([mockItem.value, appItem.value])
}

function expectedFilesForItem(item) {
  if (item.key === 'skel_config') return buildProjectConfigFiles().map(f => f.path)
  if (item.key === 'skel_app') return buildBaseStyleFiles().map(f => f.path)
  if (item.key === mockItem.value.key) {
    const mockFiles = (sug.value?.mockDataFiles || []).map(m => projectPath(`src/data/${m.file}`))
    return [...mockFiles, projectPath('src/api/index.js')]
  }
  if (item.key === appItem.value.key) return [projectPath('src/App.vue')]
  if (compItems.value.includes(item)) return [projectPath(`src/components/${item.label}`)]
  if (pageItems.value.includes(item)) return [projectPath(`src/views/${item.label}`)]
  return []
}

function reconcileDiskState() {
  if (!diskFiles.value.size) return false
  let changed = false

  for (const item of allItems.value) {
    const paths = expectedFilesForItem(item)
    if (!paths.length || !paths.every(path => diskFiles.value.has(path))) continue

    const files = paths.map(path => ({ path, content: '' }))
    if (item.st !== 'done' || item.files?.length !== files.length) {
      setDone(item, files)
      changed = true
    }
  }

  if (changed) {
    writeStatus.value = `✅ 已从 prototypes/${slug.value}/ 恢复已生成文件状态`
    emitDraft()
  }
  return changed
}

async function loadDiskState() {
  if (!prevOk.value) return
  isCheckingDisk.value = true
  try {
    const response = await fetch(`${API}/prototype-projects/${encodeURIComponent(slug.value)}/status`)
    const payload = await response.json().catch(() => ({}))
    if (response.ok && payload.exists) {
      diskFiles.value = new Set(payload.files || [])
      reconcileDiskState()
    }
  } catch {
    // 本地后端不可用时仍使用 Markdown/localStorage 状态恢复。
  } finally {
    isCheckingDisk.value = false
  }
}

async function hydrateGeneratedState() {
  restoreSavedState()
  await loadDiskState()
}

// 延迟恢复，确保 sug watcher 已初始化 items
watch([() => props.projectContext.stepResults?.prototypeGenerate, sug], () => {
  nextTick(() => hydrateGeneratedState())
}, { immediate: true })

onMounted(() => {
  hydrateGeneratedState()
})

/* ================================================================
   LLM helper
   ================================================================ */
const API = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

async function callLLM(key, title, instruction, currentOutput) {
  if (!llmOk.value) throw new Error('请先配置 LLM')

  // 快速健康检查
  try {
    const hc = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) })
    if (!hc.ok) throw new Error('后端异常')
  } catch {
    throw new Error('无法连接后端。请先执行 bash scripts/start_api.sh 启动 FastAPI')
  }

  const r = await fetch(`${API}/llm/revise-step`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ step_key: 'protogen_'+key, step_title: title, instruction,
      current_output: currentOutput,
      project_context: { projectName: props.projectContext.projectName, customerName: props.projectContext.customerName },
    }),
    signal: AbortSignal.timeout(120000),
  })
  const p = await r.json().catch(() => ({}))
  if (!r.ok || p.success === false) throw new Error(p?.detail?.message || p?.detail || p?.message || `后端 ${r.status}`)
  const out = p?.data?.revised_output
  if (!out?.files?.length) throw new Error('LLM 返回空文件列表，请重试')
  return out.files.map(f => ({ path: f.path || f, content: f.content || '' }))
}

async function writeFilesToDisk(files) {
  const validFiles = (files || []).filter(f => f.path && typeof f.content === 'string')
  if (!validFiles.length) throw new Error('没有可写入的文件')

  const r = await fetch(`${API}/prototype-projects/${encodeURIComponent(slug.value)}/files`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ files: validFiles }),
  })
  const payload = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(payload.detail || `写入文件失败：${r.status}`)
  return payload.files || validFiles.map(f => f.path)
}

/* ================================================================
   写入磁盘
   ================================================================ */
const writeStatus = ref('')

async function writeAllToDisk() {
  const r = await fetch(`${API}/prototype-projects/${encodeURIComponent(slug.value)}/status`)
  const payload = await r.json().catch(() => ({}))
  writeStatus.value = payload.exists
    ? `✅ 已写入 ${payload.files?.length || 0} 个文件到 prototypes/${slug.value}/`
    : `⚠️ prototypes/${slug.value}/ 尚未创建`
  emitDraft()
}
function setRun(it) { it.st = 'running'; it.msg = '正在请求 LLM 生成...'; it.err = ''; it.files = [] }
function setDone(it, files) { it.st = 'done'; it.files = files; it._rawFiles = files; it.msg = '✅ ' + files.length + ' 文件'; it.err = '' }
function setFail(it, e) { it.st = 'fail'; it.err = e.name==='AbortError'?'⏱ LLM 超时（120s），Prompt 可能太长，请重试':e.message?.includes('Failed to fetch')?'无法连接后端':e.message||'失败'; it.msg = ''; it.files = [] }

async function run(it, title, instruction, currentOutput) {
  if (isBusy.value) return; isBusy.value = true; setRun(it)
  try {
    const files = await callLLM(it.key, title, instruction, currentOutput)
    await writeFilesToDisk(files)
    setDone(it, files)
    writeStatus.value = `✅ 已写入 ${files.length} 个文件到 prototypes/${slug.value}/`
  } catch (e) {
    setFail(it, e)
    curTask.value = ''
  } finally {
    isBusy.value = false
    emitDraft()
  }
}

async function writeStaticTask(it, files) {
  if (isBusy.value) return
  isBusy.value = true
  setRun(it)
  try {
    await writeFilesToDisk(files)
    setDone(it, files)
    writeStatus.value = `✅ 已写入 ${files.length} 个文件到 prototypes/${slug.value}/`
  } catch (e) {
    setFail(it, e)
  } finally {
    isBusy.value = false
    emitDraft()
  }
}

function projectPath(path) {
  return `prototypes/${slug.value}/${path}`
}

function buildProjectConfigFiles() {
  const projectName = props.projectContext.projectName || '原型系统'
  return [
    {
      path: projectPath('package.json'),
      content: JSON.stringify({
        name: slug.value,
        version: '0.1.0',
        private: true,
        type: 'module',
        scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
        dependencies: { '@vitejs/plugin-vue': '^6.0.1', vite: '^7.2.7', vue: '^3.5.26' },
        devDependencies: {},
      }, null, 2) + '\n',
    },
    {
      path: projectPath('index.html'),
      content: `<div id="app"></div>\n<script type="module" src="/src/main.js"></` + `script>\n<title>${projectName}</title>\n`,
    },
    {
      path: projectPath('vite.config.js'),
      content: `import { defineConfig } from 'vite'\nimport vue from '@vitejs/plugin-vue'\nimport { fileURLToPath, URL } from 'node:url'\n\nexport default defineConfig({\n  plugins: [vue()],\n  resolve: {\n    alias: {\n      '@': fileURLToPath(new URL('./src', import.meta.url)),\n      'vue-router': fileURLToPath(new URL('./src/routerShim.js', import.meta.url)),\n      'element-plus': fileURLToPath(new URL('./src/elementPlusShim.js', import.meta.url)),\n      '@element-plus/icons-vue': fileURLToPath(new URL('./src/elementPlusIconsShim.js', import.meta.url)),\n      'vuedraggable': fileURLToPath(new URL('./src/draggableShim.js', import.meta.url)),\n    },\n  },\n})\n`,
    },
    {
      path: projectPath('src/main.js'),
      content: `import { createApp } from 'vue'\nimport App from './App.vue'\nimport './style.css'\n\ncreateApp(App).mount('#app')\n`,
    },
    {
      path: projectPath('src/routerShim.js'),
      content: `export function useRouter() {\n  return {\n    push(target) { console.log('[prototype router.push]', target) },\n    back() { console.log('[prototype router.back]') },\n    replace(target) { console.log('[prototype router.replace]', target) },\n  }\n}\n\nexport function useRoute() {\n  return { query: {}, params: {}, path: '/', name: '' }\n}\n`,
    },
    {
      path: projectPath('src/elementPlusShim.js'),
      content: `function show(type, message) { console.log('[' + type + ']', message) }\nexport const ElMessage = {\n  success(message) { show('success', message) },\n  warning(message) { show('warning', message) },\n  error(message) { show('error', message) },\n  info(message) { show('info', message) },\n}\nexport const ElMessageBox = { confirm(message) { return Promise.resolve(window.confirm(message)) } }\n`,
    },
    {
      path: projectPath('src/elementPlusIconsShim.js'),
      content: `export const Search = { name: 'SearchIcon', template: '<span>⌕</span>' }\n`,
    },
    {
      path: projectPath('src/draggableShim.js'),
      content: `export default {\n  name: 'DraggableShim',\n  props: { modelValue: { type: Array, default: () => [] } },\n  emits: ['update:modelValue', 'change'],\n  template: '<div><slot v-for=\"(element, index) in modelValue\" name=\"item\" :element=\"element\" :index=\"index\" /></div>',\n}\n`,
    },
  ]
}

function buildBaseStyleFiles() {
  return [
    {
      path: projectPath('src/style.css'),
      content: `:root {\n  color: #0f172a;\n  background: #eef3f8;\n  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n}\n* { box-sizing: border-box; }\nbody { margin: 0; min-width: 320px; min-height: 100vh; background: #eef3f8; }\nbutton, input, select, textarea { font: inherit; }\nbutton { cursor: pointer; }\n.app-shell { min-height: 100vh; display: grid; grid-template-columns: 260px minmax(0, 1fr); }\n.side-nav { background: #0f172a; color: #e2e8f0; padding: 20px; display: flex; flex-direction: column; gap: 18px; }\n.brand { font-size: 18px; font-weight: 900; color: #fff; }\n.nav-group { display: grid; gap: 8px; }\n.nav-group-title { margin: 14px 0 4px; color: #94a3b8; font-size: 12px; font-weight: 800; }\n.nav-button { border: 1px solid transparent; border-radius: 8px; padding: 10px 12px; background: transparent; color: #cbd5e1; text-align: left; font-weight: 800; }\n.nav-button.active, .nav-button:hover { background: #1d4ed8; color: #fff; }\n.main-panel { padding: 24px; overflow: auto; }\n.page-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; padding: 18px; box-shadow: 0 12px 30px rgb(15 23 42 / 0.06); }\n.page-title { margin: 0 0 6px; font-size: 24px; font-weight: 900; }\n.page-desc { margin: 0 0 18px; color: #64748b; line-height: 1.6; }\n.grid { display: grid; gap: 14px; }\n.grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.panel { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #f8fafc; }\n.panel h3 { margin: 0 0 10px; font-size: 15px; }\n.metric { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n.metric strong { font-size: 24px; }\n.table { width: 100%; border-collapse: collapse; font-size: 13px; }\n.table th, .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }\n.status { display: inline-flex; border-radius: 999px; padding: 3px 9px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; }\n.actions { display: flex; flex-wrap: wrap; gap: 8px; }\n.primary { border: 0; border-radius: 7px; padding: 8px 12px; background: #2563eb; color: #fff; font-weight: 800; }\n.secondary { border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 12px; background: #fff; color: #334155; font-weight: 800; }\n@media (max-width: 900px) { .app-shell { grid-template-columns: 1fr; } .side-nav { position: static; } .grid.cols-2, .grid.cols-3 { grid-template-columns: 1fr; } }\n`,
    },
  ]
}

/* ── Skeleton ── */
async function genSkel(sk) {
  if (sk.key === 'skel_config') {
    await writeStaticTask(sk, buildProjectConfigFiles())
  } else {
    await writeStaticTask(sk, buildBaseStyleFiles())
  }
}

/* ── Page ── */
async function genPage(pi) {
  const vf = (sug.value?.viewFiles || []).find(v => v.file === pi.label)
  const sp = (sug.value?.pageDetailSpecs || []).find(s => s.file === pi.label)
  const apiMapping = (sug.value?.pageApiMapping || []).find(m => m.page === pi.label)
  const relatedComponents = (sug.value?.componentFiles || [])
    .filter(c => (c.reusedBy || []).includes(pi.label))
    .map(c => ({ file: c.file, responsibility: c.responsibility, props: (c.props || []).slice(0, 6) }))
  const relatedMocks = (sug.value?.mockDataFiles || [])
    .filter(m => (m.usedBy || []).includes(pi.label))
    .map(m => ({ file: m.file, content: m.content, schema: (m.schema || []).slice(0, 6) }))
  await run(pi, pi.label, [
    `生成 Vue3 页面组件：prototypes/${slug.value}/src/views/${vf?.file || pi.label}`,
    `职责：${sp?.responsibility || vf?.responsibility || pi.label}`,
    `只生成这一个页面文件，不要生成其他文件。`,
    `可以用相对路径导入 ../components 和 ../data 下的文件；禁止使用 @ 别名。`,
    `禁止导入 vue-router、element-plus、vuedraggable 或任何未在 package.json 声明的外部库。`,
    `页面展示字段必须来自 relatedMocks.schema 或在页面内做 normalize 映射；禁止直接渲染可能不存在的字段导致空白内容。`,
    `列表、卡片、详情区必须展示可见业务文本和关键字段，至少包含标题、状态、时间/地点/人员中的两类信息。`,
    `要求：script setup + scoped CSS，包含 loading/empty/error 状态，适合原型演示；<script setup> 内禁止出现 export function/export const。`,
    `输出 JSON：{"files":[{"path":"prototypes/${slug.value}/src/views/${vf?.file||'Page.vue'}","content":"..."}]}`,
  ].filter(Boolean).join('\n'), {
    page: vf,
    pageSpec: sp,
    apiMapping,
    relatedComponents,
    relatedMocks,
  })
}

/* ── Component ── */
async function genComp(ci) {
  const comp = (sug.value?.componentFiles || []).find(c => c.file === ci.label)
  await run(ci, ci.label, [
    `生成 Vue3 组件：prototypes/${slug.value}/src/components/${ci.label}`,
    `职责：${ci.desc}`,
    `禁止导入 element-plus、vuedraggable 或任何未在 package.json 声明的外部库；禁止使用 @ 别名。`,
    `要求：纯展示组件，通过 props 接收数据，无业务逻辑。script setup + scoped CSS；<script setup> 内禁止出现 export function/export const。`,
    `输出 JSON：{"files":[{"path":"prototypes/${slug.value}/src/components/${ci.label}","content":"..."}]}`,
  ].join('\n'), { component: comp })
}

/* ── Mock ── */
async function genMock() {
  await run(mockItem.value, 'Mock 数据', [
    `生成 mock 数据和 API 客户端，写入 prototypes/${slug.value}/src/data/ 和 src/api/：`,
    `每个 mock 文件必须 export 具名数据和具名读取函数；如果页面会按 mockXxx() 调用，mock 文件必须导出同名函数而不是数组常量。`,
    `只生成 mock 和 api 文件，不要生成页面或组件。`,
    `禁止导入外部库，文件之间用相对路径导入。`,
    `要求：数据字段要同时兼容页面语义字段和原始业务字段，例如车辆同时提供 id/plate/driver/status 与 vehicleId/plateNo/driverName。api/index.js 返回 Promise 模拟异步。`,
    `输出 JSON：{"files":[{"path":"...","content":"..."}]}`,
  ].join('\n'), {
    mockDataFiles: sug.value?.mockDataFiles || [],
    pageApiMapping: sug.value?.pageApiMapping || [],
    pages: (sug.value?.viewFiles || []).map(p => ({ file: p.file, responsibility: p.responsibility })),
  })
}

async function genAppShell() {
  await run(appItem.value, 'App.vue 应用壳', [
    `生成 Vue3 应用壳文件：prototypes/${slug.value}/src/App.vue`,
    `只生成 App.vue 一个文件。`,
    `要求：script setup；导入所有 src/views 页面；使用左侧导航和 ref 切换当前页面；不使用 vue-router；禁止使用 @ 别名。`,
    `页面容器使用全局样式中的 app-shell、side-nav、main-panel。`,
    `输出 JSON：{"files":[{"path":"prototypes/${slug.value}/src/App.vue","content":"..."}]}`,
  ].join('\n'), {
    projectName: props.projectContext.projectName || '原型系统',
    pages: sug.value?.viewFiles || [],
    navigationRoutes: sug.value?.navigationRoutes || [],
  })
}

/* ── All ── */
async function genAll() {
  curTask.value = '🏗 项目骨架'
  for (const sk of skelItems.value) { if (sk.st !== 'done') { await genSkel(sk); if (sk.st !== 'done') { curTask.value = ''; return } } }
  curTask.value = '📦 Mock 数据'
  if (mockItem.value.st !== 'done') { await genMock(); if (mockItem.value.st !== 'done') { curTask.value = ''; return } }
  curTask.value = '🧩 通用组件'
  for (const ci of compItems.value) { if (ci.st !== 'done') { await genComp(ci); if (ci.st !== 'done') { curTask.value = ''; return } } }
  curTask.value = '📄 页面文件'
  for (const pi of pageItems.value) { if (pi.st !== 'done') { curTask.value = '📄 ' + pi.label; await genPage(pi); if (pi.st !== 'done') { curTask.value = ''; return } } }
  curTask.value = '🧭 App.vue'
  if (appItem.value.st !== 'done') await genAppShell()
  curTask.value = ''
}

async function retryFailed() {
  for (const item of allItems.value) {
    if (item.st !== 'fail') continue
    if (skelItems.value.includes(item)) await genSkel(item)
    else if (item.key === mockItem.value.key) await genMock()
    else if (compItems.value.includes(item)) await genComp(item)
    else if (pageItems.value.includes(item)) await genPage(item)
    else if (item.key === appItem.value.key) await genAppShell()
    if (item.st !== 'done') return
  }
}

function confirmAndFinish() {
  emit('prototype-generated', { outputDir: `prototypes/${slug.value}`, generatedFiles: allItems.value.flatMap(i=>i.files||[]), suggestion: sug.value })
}

function emitDraft() {
  emit('prototype-draft-update', {
    outputDir: `prototypes/${slug.value}`,
    items: allItems.value.map(i => ({
      key: i.key, st: i.st, msg: i.msg, err: i.err,
      files: (i.files || []).map(f => ({ path: f.path, content: '' })),
    })),
  })
}
</script>

<style scoped>
.prototype-generate-view { display: grid; gap: 14px; }
.empty-hint { display: flex; flex-direction: column; align-items: center; gap: 6px; border: 1px dashed #e2e8f0; border-radius: 8px; padding: 36px; text-align: center; color: #94a3b8; }
.empty-hint span { font-size: 28px; } .empty-hint strong { font-size: 15px; color: #475569; }
.warn-banner { display: flex; align-items: flex-start; gap: 10px; padding: 10px 14px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; }
.warn-banner span { font-size: 18px; } .warn-banner strong { font-size: 13px; color: #92400e; } .warn-banner p { margin: 3px 0 0; font-size: 12px; color: #a16207; }
.project-info { display: flex; gap: 12px; flex-wrap: wrap; }
.info-card { display: flex; flex-direction: column; gap: 4px; padding: 10px 14px; background: #f8fafc; border:1px solid #e2e8f0; border-radius:8px; flex:1; min-width:160px; }
.info-label { font-size:11px; color:#64748b; font-weight:700; } .info-path { font-size:14px; color:#1d4ed8; font-weight:800; background:#eff6ff; padding:2px 8px; border-radius:4px; } .info-value { font-size:14px; color:#334155; font-weight:600; }
.progress-overview { display:flex; align-items:center; gap:10px; padding:6px 0; }
.progress-bar-track { flex:1; height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.progress-bar-fill { height:100%; background:linear-gradient(90deg,#2563eb,#16a34a); border-radius:3px; transition:width .4s; }
.progress-text { font-size:12px; color:#64748b; font-weight:700; white-space:nowrap; }
.cur-task { display:flex; align-items:center; gap:8px; padding:6px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:13px; color:#1d4ed8; }
.ct-dot { width:8px; height:8px; border-radius:50%; background:#2563eb; animation:pulse 1s ease infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.cur-task strong { color:#0f172a; }
.section-label { font-size:12px; font-weight:800; color:#64748b; padding-top:6px; }
.item-grid { display:grid; gap:8px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }

.item-card { border:1px solid #e2e8f0; border-radius:10px; padding:12px 14px; background:#fff; transition:border-color .2s,box-shadow .2s; }
.item-card.running { border-color:#93c5fd; box-shadow:0 0 0 3px rgba(37,99,235,.06); }
.item-card.done    { border-color:#bbf7d0; background:#f9fefb; }
.item-card.fail    { border-color:#fecaca; background:#fef9f9; }
.ic-head { display:flex; align-items:center; gap:8px; } .ic-icon { font-size:16px; flex-shrink:0; }
.ic-body { flex:1; min-width:0; } .ic-body strong { display:block; font-size:13px; color:#0f172a; } .ic-body small { display:block; font-size:11px; color:#64748b; margin-top:1px; line-height:1.3; }
.ic-count { font-size:11px; color:#94a3b8; font-weight:700; white-space:nowrap; }
.ic-detail { margin-top:10px; padding-top:10px; border-top:1px solid #f1f5f9; }
.ic-msg { margin:0; font-size:12px; color:#2563eb; font-weight:600; } .ic-err { margin:0 0 6px; font-size:12px; color:#dc2626; font-weight:600; }
.ic-files { margin-top:10px; padding-top:10px; border-top:1px solid #dcfce7; } .ic-files ul { list-style:none; margin:0 0 6px; padding:0; display:grid; gap:2px; } .ic-files li { display:flex; align-items:center; gap:5px; font-size:11px; } .ic-files code { color:#15803d; font-weight:600; font-size:10px; }
.rbtn { background:#fef2f2; color:#dc2626; border:1px solid #fecaca; border-radius:5px; padding:4px 10px; font-size:11px; font-weight:700; cursor:pointer; } .rbtn.o { background:#fff; color:#2563eb; border-color:#bfdbfe; } .rbtn:disabled { opacity:.5; cursor:not-allowed; }
.gbtn { background:#2563eb; color:#fff; border:none; border-radius:5px; padding:4px 14px; font-size:11px; font-weight:700; cursor:pointer; } .gbtn:hover { background:#1d4ed8; }
.hint { margin:0; font-size:11px; color:#94a3b8; }
.action-bar { display:flex; align-items:center; justify-content:flex-end; gap:10px; padding-top:8px; border-top:1px solid #f1f5f9; }
.gen-all-btn { background:#2563eb; color:#fff; border:none; border-radius:8px; padding:10px 22px; font-size:13px; font-weight:800; cursor:pointer; }
.gen-all-btn:disabled { opacity:.5; cursor:not-allowed; }
.write-btn { background:#0f172a; color:#fff; border:none; border-radius:8px; padding:10px 22px; font-size:13px; font-weight:800; cursor:pointer; }
.write-btn:disabled { opacity:.5; cursor:not-allowed; }
.write-btn:hover:not(:disabled) { background:#1e293b; }
.write-msg { margin:0; font-size:13px; font-weight:700; color:#166534; }
.write-msg.err { color:#dc2626; }
.primary-btn { background:#16a34a; color:#fff; border:none; border-radius:8px; padding:10px 22px; font-size:13px; font-weight:800; cursor:pointer; }
</style>
