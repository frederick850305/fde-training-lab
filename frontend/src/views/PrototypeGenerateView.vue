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

      <!-- ====== Contract ====== -->
      <div class="section-label">📐 运行契约</div>
      <ItemCard :item="contractItem" :busy="isBusy" :disable="!skelDone" :disableHint="skelDone?'':'请先生成骨架'" @gen="genContract" @retry="genContract" />

      <!-- ====== Mock ====== -->
      <div class="section-label">📦 Mock 数据</div>
      <ItemCard :item="mockItem" :busy="isBusy" :disable="!contractDone" :disableHint="contractDone?'':'请先生成运行契约'" @gen="genMock" @retry="genMock" />

      <!-- ====== Components ====== -->
      <div class="section-label">🧩 通用组件（每个一次调用）</div>
      <div class="item-grid">
        <ItemCard v-for="ci in compItems" :key="ci.key" :item="ci" :busy="isBusy" :disable="!skelDone" :disableHint="skelDone?'':'请先生成骨架'" @gen="genComp(ci)" @retry="genComp(ci)" />
      </div>

      <!-- ====== Pages ====== -->
      <div class="section-label">📄 页面文件（每页一次调用）</div>
      <div class="item-grid">
        <ItemCard v-for="pi in pageItems" :key="pi.key" :item="pi" :busy="isBusy" :disable="!contractDone" :disableHint="contractDone?'':'请先生成运行契约'" @gen="genPage(pi)" @retry="genPage(pi)" />
      </div>

      <!-- ====== App Shell ====== -->
      <div class="section-label">🧭 应用壳与导航</div>
      <ItemCard :item="appItem" :busy="isBusy" :disable="!coreDone" :disableHint="coreDone?'':'请先生成 Mock、组件和页面'" @gen="genAppShell" @retry="genAppShell" />

      <!-- ====== Action ====== -->
      <p v-if="writeStatus" class="write-msg" :class="{ err: writeStatus.includes('❌') }">{{ writeStatus }}</p>
      <div class="action-bar">
        <button class="gen-all-btn" :disabled="isBusy" @click="handleGenerateChoice">{{ isBusy ? '⏳ 生成中' : '⚡ 生成 / 重新生成' }}</button>
        <button v-if="hasFailed" class="write-btn" :disabled="isBusy" @click="retryFailed">重试失败项（{{ failedItems.length }}）</button>
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
const isBatchGenerating = ref(false)

const prevOk  = computed(() => Boolean(props.projectContext.stepResults?.prototype))
const llmOk   = computed(() => props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured)
const sug     = computed(() => props.projectContext.stepResults?.prototype || props.projectContext.selectedPrototypeSuggestion || null)
const slug    = computed(() => (props.projectContext.projectName || 'prototype').replace(/[^\w\u4e00-\u9fff-]/g, '-').toLowerCase())

/* ── Items ── */
function mkItem(key, label, desc, n) { return { key, label, desc, n, st: 'idle', msg: '', err: '', files: [] } }

const skelItems = ref([
  mkItem('skel_config', '① 项目配置', 'package.json、vite.config.js、index.html、main.js 和兼容 shim', 8),
  mkItem('skel_app',    '② 全局样式', '固定高度布局、角色选择器、手风琴导航和基础组件样式', 1),
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

const contractItem = ref(mkItem('contract', 'Prototype Contract', '统一角色、导航、页面和 mock 入口契约', 1))
const contractDone = computed(() => contractItem.value.st === 'done')

const appItem = ref(mkItem('app_shell', 'App.vue 应用壳', '本地模板生成角色选择和手风琴导航', 1))
const coreDone = computed(() => contractDone.value && mockItem.value.st === 'done' && pageItems.value.every(i => i.st === 'done') && compItems.value.every(i => i.st === 'done'))

const allItems = computed(() => [...skelItems.value, contractItem.value, mockItem.value, ...compItems.value, ...pageItems.value, appItem.value])
const total = computed(() => allItems.value.length)
const done  = computed(() => allItems.value.filter(i => i.st === 'done').length)
const pct   = computed(() => total.value ? Math.round(done.value / total.value * 100) : 0)
const allDone = computed(() => total.value > 0 && allItems.value.every(i => i.st === 'done'))
const hasFailed = computed(() => allItems.value.some(i => i.st === 'fail'))
const failedItems = computed(() => allItems.value.filter(i => i.st === 'fail'))
const hasGenerated = computed(() => allItems.value.some(i => i.st === 'done' || i.files?.length))

/* ================================================================
   从已保存状态恢复（切换步骤后回到本页不丢失进度）
   ================================================================ */
function restoreSavedState() {
  if (isBatchGenerating.value) return
  const saved = props.projectContext.stepResults?.prototypeGenerate
  if (!saved?.items?.length) return
  const savedMap = Object.fromEntries(saved.items.map(it => [it.key, it]))

  function restore(arr) {
    for (const it of arr) {
      const s = savedMap[it.key]
      if (!s) continue
      if (s.st === 'done' && s.signature !== getItemSignature(it)) {
        resetItem(it, `生成输入已变化，需要重新生成 ${it.label}`)
        continue
      }
      it.st = s.st || it.st
      it.files = (s.files || []).map(f => typeof f === 'string' ? { path: f, content: '' } : f)
      it._rawFiles = it.files
      it.signature = s.signature || ''
      it.validation = s.validation || null
      it.msg = s.st === 'done' ? `✅ ${it.files.length} 文件` : (s.msg || it.msg)
      it.err = s.err || it.err
    }
  }

  restore(skelItems.value)
  restore(pageItems.value)
  restore(compItems.value)
  restore([contractItem.value, mockItem.value, appItem.value])
}

function expectedFilesForItem(item) {
  if (item.key === 'skel_config') return buildProjectConfigFiles().map(f => f.path)
  if (item.key === 'skel_app') return buildBaseStyleFiles().map(f => f.path)
  if (item.key === contractItem.value.key) return [projectPath('src/prototypeContract.js')]
  if (item.key === mockItem.value.key) {
    const mockFiles = (sug.value?.mockDataFiles || []).map(m => projectPath(`src/data/${m.file}`))
    return [...mockFiles, projectPath('src/api/index.js')]
  }
  if (item.key === appItem.value.key) return [projectPath('src/App.vue')]
  if (compItems.value.includes(item)) return [projectPath(`src/components/${item.label}`)]
  if (pageItems.value.includes(item)) return [projectPath(`src/views/${item.label}`)]
  return []
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue)
  if (value && typeof value === 'object') {
    return Object.keys(value).sort().reduce((acc, key) => {
      acc[key] = stableValue(value[key])
      return acc
    }, {})
  }
  return value
}

function stableStringify(value) {
  return JSON.stringify(stableValue(value))
}

function hashText(text = '') {
  let hash = 5381
  for (let i = 0; i < text.length; i += 1) hash = ((hash << 5) + hash) ^ text.charCodeAt(i)
  return (hash >>> 0).toString(36)
}

function itemInputPayload(item) {
  const contract = buildPrototypeContract()
  const base = {
    generatorVersion: 'prototype-generate-v3',
    key: item.key,
    outputFiles: expectedFilesForItem(item),
    projectName: props.projectContext.projectName || '',
    customerName: props.projectContext.customerName || '',
  }

  if (item.key === 'skel_config') return { ...base, slug: slug.value, type: 'project-config' }
  if (item.key === 'skel_app') return { ...base, type: 'base-style' }
  if (item.key === contractItem.value.key) return { ...base, type: 'contract', contract }
  if (item.key === mockItem.value.key) return { ...base, type: 'mock', mocks: contract.mocks, pages: contract.pages }
  if (item.key === appItem.value.key) return { ...base, type: 'app-shell', navigationGroups: contract.navigationGroups, pages: contract.pages, roles: contract.roles }
  if (compItems.value.includes(item)) {
    const component = (sug.value?.componentFiles || []).find(c => c.file === item.label)
    return { ...base, type: 'component', component }
  }
  if (pageItems.value.includes(item)) {
    const page = (sug.value?.viewFiles || []).find(v => v.file === item.label)
    const pageSpec = (sug.value?.pageDetailSpecs || []).find(spec => spec.file === item.label)
    const apiMapping = (sug.value?.pageApiMapping || []).find(mapping => mapping.page === item.label)
    const pageContract = contract.pages.find(candidate => candidate.file === item.label)
    return { ...base, type: 'page', page, pageSpec, apiMapping, pageContract }
  }
  return base
}

function getItemSignature(item) {
  return hashText(stableStringify(itemInputPayload(item)))
}

function normalizeGeneratedPath(rawPath = '') {
  const cleaned = String(rawPath).trim().replace(/\\/g, '/').replace(/^\/+/, '')
  const prefix = `prototypes/${slug.value}/`
  if (cleaned.startsWith(prefix)) return cleaned
  if (/^(package\.json|vite\.config\.js|index\.html|src\/)/.test(cleaned)) return projectPath(cleaned)
  return cleaned
}

function validateFilesForItem(item, files) {
  const expected = expectedFilesForItem(item)
  const expectedSet = new Set(expected)
  const normalizedFiles = (files || []).map(file => ({
    ...file,
    path: normalizeGeneratedPath(file.path),
    content: typeof file.content === 'string' ? file.content : '',
  }))
  const actualSet = new Set(normalizedFiles.map(file => file.path))
  const issues = []

  for (const path of expected) {
    if (!actualSet.has(path)) issues.push(`缺少目标文件 ${path}`)
  }
  for (const file of normalizedFiles) {
    if (!expectedSet.has(file.path)) issues.push(`返回了非本生成项目标文件 ${file.path}`)
    if (!file.content.trim()) issues.push(`${file.path} 内容为空`)
  }

  return { files: normalizedFiles, issues }
}

function validateGeneratedCodeOutput(files) {
  const issues = []
  const filePaths = new Set([...(diskFiles.value || []), ...currentGeneratedFiles().map(file => file.path), ...files.map(file => file.path)])
  const assetPattern = /(?:src|href)=["'](\.{1,2}\/[^"']+\.(?:svg|png|jpe?g|gif|webp))["']|url\(["']?(\.{1,2}\/[^"')]+\.(?:svg|png|jpe?g|gif|webp))["']?\)/g

  for (const file of files) {
    if (!/\.(vue|js|css)$/.test(file.path)) continue
    const content = file.content || ''
    if (file.path.endsWith('.vue') && content.includes('withDefaults(defineProps({')) {
      issues.push(`${file.path} 使用了会导致 Vue 编译失败的 withDefaults(defineProps({ ... })) 写法`)
    }
    if (file.path.endsWith('.vue') && /<script\s+setup[^>]*>[\s\S]*\bexport\s+(?:function|const|let|var|default)\b/.test(content)) {
      issues.push(`${file.path} 在 <script setup> 中包含 export 声明`)
    }

    let assetMatch = assetPattern.exec(content)
    while (assetMatch) {
      const asset = assetMatch[1] || assetMatch[2]
      const resolved = resolveRelativeProjectPath(file.path, asset)
      if (resolved && !filePaths.has(resolved)) issues.push(`${file.path} 引用了不存在的静态资源 ${asset}`)
      assetMatch = assetPattern.exec(content)
    }
  }

  return issues
}

function resolveRelativeProjectPath(ownerPath, rawSource) {
  if (!rawSource?.startsWith('.')) return ''
  const ownerParts = ownerPath.split('/')
  ownerParts.pop()
  for (const part of rawSource.split('/')) {
    if (!part || part === '.') continue
    if (part === '..') ownerParts.pop()
    else ownerParts.push(part)
  }
  return ownerParts.join('/')
}

function reconcileDiskState() {
  if (isBatchGenerating.value || isBusy.value) return false
  if (!diskFiles.value.size) return false
  let changed = false

  for (const item of allItems.value) {
    const paths = expectedFilesForItem(item)
    if (!paths.length || !paths.every(path => diskFiles.value.has(path))) continue
    const signature = getItemSignature(item)
    if (item.signature !== signature) {
      if (item.st === 'done') {
        resetItem(item, `文件存在，但生成输入已变化，需要重新生成 ${item.label}`)
        changed = true
      }
      continue
    }

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
  if (!prevOk.value || isBatchGenerating.value) return
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
  return out.files.map(f => ({ path: normalizeGeneratedPath(f.path || f), content: f.content || '' }))
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
function setRun(it) { it.st = 'running'; it.msg = '正在请求 LLM 生成...'; it.err = ''; it.files = []; it.signature = ''; it.validation = null }
function setDone(it, files) { it.st = 'done'; it.files = files; it._rawFiles = files; it.signature = getItemSignature(it); it.validation = { signature: it.signature, checkedAt: new Date().toISOString() }; it.msg = '✅ ' + files.length + ' 文件'; it.err = '' }
function setFail(it, e) { it.st = 'fail'; it.err = e.name==='AbortError'?'⏱ LLM 超时（120s），Prompt 可能太长，请重试':e.message?.includes('Failed to fetch')?'无法连接后端':e.message||'失败'; it.msg = ''; it.files = []; it.signature = ''; it.validation = null }

async function run(it, title, instruction, currentOutput) {
  if (isBusy.value) return; isBusy.value = true; setRun(it)
  try {
    const llmFiles = await callLLM(it.key, title, instruction, currentOutput)
    const { files, issues: targetIssues } = validateFilesForItem(it, llmFiles)
    const codeIssues = validateGeneratedCodeOutput(files)
    const issues = [...targetIssues, ...codeIssues]
    if (issues.length) throw new Error(`生成结果预检失败：${issues.slice(0, 4).join('；')}${issues.length > 4 ? `；另有 ${issues.length - 4} 项` : ''}`)
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
    const { files: normalizedFiles, issues: targetIssues } = validateFilesForItem(it, files)
    const codeIssues = validateGeneratedCodeOutput(normalizedFiles)
    const issues = [...targetIssues, ...codeIssues]
    if (issues.length) throw new Error(`静态文件预检失败：${issues.slice(0, 4).join('；')}${issues.length > 4 ? `；另有 ${issues.length - 4} 项` : ''}`)
    await writeFilesToDisk(normalizedFiles)
    setDone(it, normalizedFiles)
    writeStatus.value = `✅ 已写入 ${normalizedFiles.length} 个文件到 prototypes/${slug.value}/`
  } catch (e) {
    setFail(it, e)
  } finally {
    isBusy.value = false
    emitDraft()
  }
}

function currentGeneratedFiles() {
  return allItems.value.flatMap(item => item._rawFiles || item.files || [])
    .filter(file => file?.path && typeof file.content === 'string')
}

function fileContentMap(files = currentGeneratedFiles()) {
  return Object.fromEntries(files.filter(file => file.content).map(file => [file.path, file.content]))
}

function extractNamedImports(content = '') {
  const imports = []
  const pattern = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g
  let match = pattern.exec(content)
  while (match) {
    imports.push({
      names: match[1].split(',').map(name => name.trim().split(/\s+as\s+/)[0]).filter(Boolean),
      source: match[2],
    })
    match = pattern.exec(content)
  }
  return imports
}

function validateGeneratedFiles() {
  const generatedFiles = currentGeneratedFiles()
  const filePaths = new Set(generatedFiles.map(file => file.path))
  const files = fileContentMap(generatedFiles)
  const contract = buildPrototypeContract()
  const issues = []

  const contractPath = projectPath('src/prototypeContract.js')
  if (!filePaths.has(contractPath)) issues.push('缺少 src/prototypeContract.js 运行契约文件')

  const indexContent = files[projectPath('index.html')]
  if (indexContent && !/charset=["']?UTF-8/i.test(indexContent)) issues.push('index.html 缺少 UTF-8 charset')

  const appContent = files[projectPath('src/App.vue')]
  if (appContent) {
    if (!appContent.includes('currentRoleKey') || !appContent.includes('role-panel')) issues.push('App.vue 缺少角色选择运行时')
    if (!appContent.includes('expandedGroups') || !appContent.includes('toggleGroup')) issues.push('App.vue 缺少手风琴导航状态')
    for (const page of contract.pages) {
      if (!appContent.includes(`./views/${page.file}`)) issues.push(`App.vue 未导入页面 ${page.file}`)
    }
  }

  for (const mock of contract.mocks) {
    const content = files[projectPath(`src/data/${mock.file}`)]
    if (!content) continue
    if (!new RegExp(`export\\s+(const|let|var)\\s+${mock.dataExport}\\b`).test(content)) {
      issues.push(`${mock.file} 缺少数据导出 ${mock.dataExport}`)
    }
    if (!new RegExp(`export\\s+(async\\s+)?function\\s+${mock.readFunction}\\b`).test(content)
      && !new RegExp(`export\\s+const\\s+${mock.readFunction}\\b`).test(content)) {
      issues.push(`${mock.file} 缺少读取函数 ${mock.readFunction}`)
    }
  }

  const allowedDataImports = new Map()
  for (const page of contract.pages) {
    allowedDataImports.set(page.file, new Set((page.mocks || []).map(mock => mock.importPath)))
  }

  for (const page of contract.pages) {
    const content = files[projectPath(`src/views/${page.file}`)]
    if (!content) continue
    const imports = extractNamedImports(content)
    const dataImports = imports.filter(item => item.source.includes('/data/') || item.source.startsWith('../data/'))
    const allowed = allowedDataImports.get(page.file) || new Set()
    for (const item of dataImports) {
      if (!allowed.has(item.source)) issues.push(`${page.file} 使用了 contract 未声明的数据源 ${item.source}`)
    }
    if ((page.mocks || []).length && !content.includes('prototypeContract')) {
      issues.push(`${page.file} 未导入 prototypeContract，角色上下文和 mock 契约可能失效`)
    }
  }

  return issues
}

function updateValidationStatus() {
  const hasContent = currentGeneratedFiles().some(file => file.content)
  const issues = validateGeneratedFiles()
  if (issues.length) {
    writeStatus.value = `❌ 原型静态校验未通过：${issues.slice(0, 4).join('；')}${issues.length > 4 ? `；另有 ${issues.length - 4} 项` : ''}`
    return false
  }
  if (!hasContent) {
    writeStatus.value = `⚠️ 已恢复生成状态；文件内容未保存在草稿中，跳过内容级静态校验`
    return true
  }
  writeStatus.value = `✅ 原型静态校验通过：角色、导航、mock 契约和页面导入一致`
  return true
}

async function validateProjectOnDisk() {
  writeStatus.value = '正在执行原型磁盘级校验和 npm run build...'
  const response = await fetch(`${API}/prototype-projects/${encodeURIComponent(slug.value)}/validate`, {
    method: 'POST',
  })
  const payload = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(payload.detail || `原型校验接口失败：${response.status}`)
  if (!payload.ok) {
    const staticIssues = (payload.static_issues || []).map(issue => `${issue.file}: ${issue.message}`)
    const buildMessage = payload.build?.stderr_tail || payload.build?.stdout_tail || ''
    const details = [...staticIssues, buildMessage].filter(Boolean)
    throw new Error(`原型磁盘级校验未通过：${details.slice(0, 3).join('；') || 'npm run build 失败'}`)
  }
  writeStatus.value = '✅ 原型磁盘级校验通过：静态检查和 npm run build 均成功'
  return payload
}

function projectPath(path) {
  return `prototypes/${slug.value}/${path}`
}

function stripVueExt(file = '') {
  return file.replace(/\.vue$/i, '')
}

function stripJsExt(file = '') {
  return file.replace(/\.js$/i, '')
}

function toPascalName(text = 'Prototype') {
  const cleaned = String(text).replace(/\.(vue|js)$/i, '').replace(/[^a-zA-Z0-9\u4e00-\u9fff]+/g, ' ')
  const ascii = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return ascii || 'Prototype'
}

function toCamelName(text = 'prototype') {
  const pascal = toPascalName(text)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function uniq(arr) {
  return [...new Set((arr || []).filter(Boolean))]
}

function inferRouteRoles(route = {}, groupName = '') {
  const source = `${route.title || ''} ${route.path || ''} ${route.component || ''} ${groupName}`.toLowerCase()
  const roles = []
  if (/司机|driver|task\/list|task\/execute/.test(source)) roles.push('driver')
  if (/门岗|gate|入场|核验/.test(source)) roles.push('gate')
  if (/外协|预约|授权|审批|reservation|access-code|external/.test(source)) roles.push('approver')
  if (/调度|dispatch|告警|monitor|调整/.test(source)) roles.push('dispatcher')
  if (/管理|报表|档案|report|vehicle-archive|management/.test(source)) roles.push('manager', 'admin')
  return uniq(roles.length ? roles : ['admin'])
}

function inferPrimaryRole(group = {}, routes = []) {
  const counts = new Map()
  for (const route of routes) {
    for (const role of route.roles || inferRouteRoles(route, group.group)) {
      counts.set(role, (counts.get(role) || 0) + 1)
    }
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || 'admin'
}

function roleCatalog() {
  return [
    { key: 'dispatcher', label: '调度员', userName: '调度员-王敏', description: '处理派车、监控告警和任务调整' },
    { key: 'driver', label: '司机', userName: '司机-李师傅', description: '查看并执行本人运输任务' },
    { key: 'gate', label: '门岗', userName: '门岗-赵工', description: '车辆入场核验与放行记录处理' },
    { key: 'approver', label: '审批人员', userName: '审批-陈主管', description: '审批外协预约和授权码同步' },
    { key: 'manager', label: '管理层', userName: '管理层-刘总', description: '查看运营报表和管理分析' },
    { key: 'admin', label: '系统管理员', userName: '管理员-周工', description: '维护车辆档案和系统配置' },
  ]
}

function fallbackNavigationGroups() {
  const pages = sug.value?.viewFiles || []
  return [{
    group: '原型页面',
    icon: '📄',
    routes: pages.map((page, index) => ({
      path: `/${stripVueExt(page.file).replace(/View$/i, '').replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}`,
      component: page.file,
      title: page.title || page.name || stripVueExt(page.file),
      default: index === 0,
    })),
  }]
}

function buildPrototypeContract() {
  const groupsSource = sug.value?.navigationRoutes?.length ? sug.value.navigationRoutes : fallbackNavigationGroups()
  const mockFiles = sug.value?.mockDataFiles || []
  const pageSpecs = sug.value?.pageDetailSpecs || []
  const apiMappings = sug.value?.pageApiMapping || []

  const mockContracts = mockFiles.map(mock => {
    const base = stripJsExt(mock.file)
    const domain = base.replace(/^mock/i, '') || base
    const dataExport = `${toCamelName(domain)}Records`
    const readFunction = `fetch${toPascalName(domain)}Data`
    return {
      file: mock.file,
      domain,
      dataExport,
      readFunction,
      usedBy: mock.usedBy || [],
      schema: mock.schema || [],
      description: mock.content || '',
    }
  })

  const routeGroups = groupsSource.map((group, groupIndex) => {
    const routes = (group.routes || []).map((route, routeIndex) => {
      const componentFile = route.component?.endsWith('.vue') ? route.component : `${route.component || ''}.vue`
      const roles = inferRouteRoles({ ...route, component: componentFile }, group.group)
      return {
        path: route.path || `/${stripVueExt(componentFile).toLowerCase()}`,
        component: toPascalName(componentFile),
        file: componentFile,
        title: route.title || stripVueExt(componentFile),
        default: Boolean(route.default || (groupIndex === 0 && routeIndex === 0)),
        roles,
      }
    })
    return {
      group: group.group || `分组 ${groupIndex + 1}`,
      icon: group.icon || '▸',
      defaultRole: inferPrimaryRole(group, routes),
      routes,
    }
  })

  const pages = (sug.value?.viewFiles || []).map(page => {
    const relatedMocks = mockContracts.filter(mock => (mock.usedBy || []).includes(page.file))
    return {
      file: page.file,
      component: toPascalName(page.file),
      title: page.title || page.name || stripVueExt(page.file),
      responsibility: pageSpecs.find(spec => spec.file === page.file)?.responsibility || page.responsibility || '',
      mocks: relatedMocks.map(mock => ({
        file: mock.file,
        importPath: `../data/${mock.file}`,
        dataExport: mock.dataExport,
        readFunction: mock.readFunction,
        schema: mock.schema || [],
        description: mock.description || '',
      })),
      apis: apiMappings.find(mapping => mapping.page === page.file)?.apis || [],
    }
  })

  const routeRoles = uniq(routeGroups.flatMap(group => group.routes.flatMap(route => route.roles || [])))
  const roles = roleCatalog().filter(role => routeRoles.includes(role.key) || role.key === 'admin')
  const defaultRoute = routeGroups.flatMap(group => group.routes).find(route => route.default) || routeGroups[0]?.routes?.[0]

  return {
    version: 1,
    projectName: props.projectContext.projectName || sug.value?.projectName || '原型系统',
    customerName: props.projectContext.customerName || sug.value?.customerName || '',
    defaultRole: defaultRoute?.roles?.[0] || roles[0]?.key || 'admin',
    roles,
    navigationGroups: routeGroups,
    pages,
    mocks: mockContracts,
  }
}

function buildPrototypeContractFiles() {
  const contract = buildPrototypeContract()
  return [{
    path: projectPath('src/prototypeContract.js'),
    content: `export const prototypeContract = ${JSON.stringify(contract, null, 2)}\n\nexport default prototypeContract\n`,
  }]
}

function buildAppShellFiles() {
  const contract = buildPrototypeContract()
  const pages = contract.pages || []
  const imports = pages
    .map(page => `import ${page.component} from './views/${page.file}'`)
    .join('\n')
  const componentEntries = pages
    .map(page => `  ${page.component},`)
    .join('\n')

  return [{
    path: projectPath('src/App.vue'),
    content: `<` + `script setup>\nimport { computed, provide, ref, watch } from 'vue'\n${imports}\nimport { installPrototypeRouter } from './routerShim.js'\nimport { prototypeContract } from './prototypeContract.js'\n\nconst components = {\n${componentEntries}\n}\n\nconst navigationGroups = prototypeContract.navigationGroups || []\nconst roles = prototypeContract.roles || []\nconst currentRoleKey = ref(prototypeContract.defaultRole || roles[0]?.key || 'admin')\nconst currentRoute = ref(findDefaultRoute(currentRoleKey.value)?.path || navigationGroups[0]?.routes?.[0]?.path || '/')\nconst routeHistory = ref([currentRoute.value])\nconst expandedGroups = ref(new Set())\n\nconst currentRole = computed(() => roles.find(role => role.key === currentRoleKey.value) || roles[0] || { key: 'admin', label: '系统管理员', userName: '演示用户' })\nconst visibleGroups = computed(() => navigationGroups\n  .map(group => ({\n    ...group,\n    routes: (group.routes || []).filter(route => canAccess(route, currentRoleKey.value)),\n  }))\n  .filter(group => group.routes.length))\nconst currentRouteMeta = computed(() => findRouteByPath(currentRoute.value) || findDefaultRoute(currentRoleKey.value))\nconst currentComponent = computed(() => components[currentRouteMeta.value?.component] || Object.values(components)[0])\n\nprovide('prototypeContext', {\n  currentRole,\n  currentRoleKey,\n  currentRoute,\n  contract: prototypeContract,\n})\n\nfunction canAccess(route, roleKey) {\n  return !route.roles?.length || route.roles.includes(roleKey) || roleKey === 'admin'\n}\n\nfunction findRouteByPath(path) {\n  return navigationGroups.flatMap(group => group.routes || []).find(route => route.path === path)\n}\n\nfunction findDefaultRoute(roleKey) {\n  return navigationGroups.flatMap(group => group.routes || []).find(route => route.default && canAccess(route, roleKey))\n    || navigationGroups.flatMap(group => group.routes || []).find(route => canAccess(route, roleKey))\n}\n\nfunction groupKey(group) {\n  return group.group\n}\n\nfunction groupHasRoute(group, path) {\n  return (group.routes || []).some(route => route.path === path)\n}\n\nfunction ensureExpandedForRoute(path) {\n  const group = navigationGroups.find(item => groupHasRoute(item, path))\n  if (!group) return\n  expandedGroups.value = new Set([...expandedGroups.value, groupKey(group)])\n}\n\nfunction toggleGroup(group) {\n  const next = new Set(expandedGroups.value)\n  const key = groupKey(group)\n  if (next.has(key)) next.delete(key)\n  else next.add(key)\n  expandedGroups.value = next\n}\n\nfunction isGroupExpanded(group) {\n  return expandedGroups.value.has(groupKey(group))\n}\n\nfunction switchRoute(route) {\n  currentRoute.value = route.path\n  if (routeHistory.value[routeHistory.value.length - 1] !== route.path) routeHistory.value.push(route.path)\n  ensureExpandedForRoute(route.path)\n}\n\nfunction navigateRoute(target) {\n  if (target.path === '__back__') {\n    routeHistory.value.pop()\n    const previous = routeHistory.value[routeHistory.value.length - 1] || findDefaultRoute(currentRoleKey.value)?.path\n    const route = findRouteByPath(previous)\n    if (route && canAccess(route, currentRoleKey.value)) switchRoute(route)\n    return\n  }\n  const route = findRouteByPath(target.path)\n  if (route && canAccess(route, currentRoleKey.value)) switchRoute(route)\n}\n\nwatch(currentRoleKey, roleKey => {\n  const active = findRouteByPath(currentRoute.value)\n  if (!active || !canAccess(active, roleKey)) {\n    const nextRoute = findDefaultRoute(roleKey)\n    if (nextRoute) switchRoute(nextRoute)\n  }\n}, { immediate: true })\n\nwatch(currentRoute, path => ensureExpandedForRoute(path), { immediate: true })\n\ninstallPrototypeRouter(navigateRoute)\n</` + `script>\n\n<template>\n  <div class=\"app-shell\">\n    <nav class=\"side-nav\" aria-label=\"原型导航\">\n      <div class=\"brand\">\n        <strong>{{ prototypeContract.projectName }}</strong>\n        <span>{{ prototypeContract.customerName || 'Prototype Demo' }}</span>\n      </div>\n\n      <section class=\"role-panel\" aria-label=\"演示角色\">\n        <label for=\"prototype-role\">当前角色</label>\n        <select id=\"prototype-role\" v-model=\"currentRoleKey\">\n          <option v-for=\"role in roles\" :key=\"role.key\" :value=\"role.key\">{{ role.label }}</option>\n        </select>\n        <div class=\"role-user\">\n          <span>{{ currentRole.userName }}</span>\n          <span>{{ currentRole.label }}</span>\n        </div>\n      </section>\n\n      <div class=\"nav-scroll\">\n        <section v-for=\"group in visibleGroups\" :key=\"group.group\" class=\"nav-group\">\n          <button class=\"nav-group-title\" type=\"button\" @click=\"toggleGroup(group)\">\n            <span class=\"nav-group-title-main\">\n              <span>{{ group.icon }}</span>\n              <span>{{ group.group }}</span>\n            </span>\n            <span class=\"nav-group-count\">{{ isGroupExpanded(group) ? '收起' : group.routes.length + '项' }}</span>\n          </button>\n          <ul v-if=\"isGroupExpanded(group)\" class=\"nav-group-routes\">\n            <li v-for=\"route in group.routes\" :key=\"route.path\">\n              <button class=\"nav-button\" :class=\"{ active: currentRoute === route.path }\" type=\"button\" @click=\"switchRoute(route)\">\n                {{ route.title }}\n              </button>\n            </li>\n          </ul>\n        </section>\n      </div>\n    </nav>\n\n    <main class=\"main-panel\">\n      <component :is=\"currentComponent\" />\n    </main>\n  </div>\n</template>\n`,
  }]
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
      content: `<!doctype html>\n<html lang="zh-CN">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${projectName}</title>\n  </head>\n  <body>\n    <div id="app"></div>\n    <script type="module" src="/src/main.js"></` + `script>\n  </body>\n</html>\n`,
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
      content: `let currentRoute = {\n  query: {},\n  params: {},\n  path: '/',\n  name: '',\n}\n\nlet navigator = null\n\nexport function installPrototypeRouter(handler) {\n  navigator = handler\n}\n\nfunction resolveTarget(target) {\n  if (typeof target === 'string') {\n    return { path: target, query: {}, params: {}, name: '' }\n  }\n  return {\n    path: target?.path || '',\n    name: target?.name || '',\n    query: target?.query || {},\n    params: target?.params || {},\n  }\n}\n\nexport function useRouter() {\n  return {\n    push(target) {\n      const route = resolveTarget(target)\n      currentRoute = route\n      if (navigator) navigator(route)\n    },\n    back() {\n      if (navigator) navigator({ path: '__back__' })\n    },\n    replace(target) {\n      const route = resolveTarget(target)\n      currentRoute = route\n      if (navigator) navigator(route)\n    },\n  }\n}\n\nexport function useRoute() {\n  return currentRoute\n}\n`,
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
      content: `:root {\n  color: #0f172a;\n  background: #eef3f8;\n  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;\n}\n* { box-sizing: border-box; }\nhtml, body, #app { margin: 0; min-width: 320px; height: 100%; background: #eef3f8; }\nbutton, input, select, textarea { font: inherit; }\nbutton { cursor: pointer; }\n.app-shell { height: 100vh; min-height: 0; display: grid; grid-template-columns: 280px minmax(0, 1fr); overflow: hidden; }\n.side-nav { min-height: 0; background: #0f172a; color: #e2e8f0; padding: 18px 16px; display: flex; flex-direction: column; gap: 14px; box-shadow: 12px 0 30px rgba(15, 23, 42, 0.12); }\n.brand { display: grid; gap: 4px; color: #fff; }\n.brand strong { font-size: 18px; font-weight: 900; }\n.brand span { color: #94a3b8; font-size: 12px; }\n.role-panel { display: grid; gap: 8px; padding: 10px; border: 1px solid rgba(148, 163, 184, .28); border-radius: 8px; background: rgba(15, 23, 42, .32); }\n.role-panel label { font-size: 12px; color: #94a3b8; font-weight: 800; }\n.role-panel select { width: 100%; border: 1px solid rgba(148, 163, 184, .38); border-radius: 7px; padding: 8px 10px; background: #111827; color: #fff; }\n.role-user { display: flex; justify-content: space-between; gap: 8px; color: #cbd5e1; font-size: 12px; }\n.nav-scroll { min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 8px; padding-right: 2px; }\n.nav-group { display: grid; gap: 6px; }\n.nav-group-title { width: 100%; border: 0; border-radius: 8px; padding: 9px 10px; display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #cbd5e1; background: transparent; font-size: 12px; font-weight: 900; text-align: left; }\n.nav-group-title:hover { background: rgba(255, 255, 255, .07); color: #fff; }\n.nav-group-title-main { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }\n.nav-group-title-main span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.nav-group-count { color: #94a3b8; font-size: 11px; font-weight: 800; }\n.nav-group-routes { list-style: none; margin: 0; padding: 0 0 0 8px; display: grid; gap: 5px; }\n.nav-button { width: 100%; border: 1px solid transparent; border-radius: 8px; padding: 9px 10px; background: transparent; color: #cbd5e1; text-align: left; font-size: 13px; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }\n.nav-button.active, .nav-button:hover { background: #1d4ed8; color: #fff; }\n.main-panel { min-width: 0; min-height: 0; padding: 22px; overflow: auto; }\n.page-card { background: #fff; border: 1px solid #dbe3ef; border-radius: 8px; padding: 18px; box-shadow: 0 12px 30px rgb(15 23 42 / 0.06); }\n.page-title { margin: 0 0 6px; font-size: 24px; font-weight: 900; }\n.page-desc { margin: 0 0 18px; color: #64748b; line-height: 1.6; }\n.grid { display: grid; gap: 14px; }\n.grid.cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }\n.grid.cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }\n.panel { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #f8fafc; }\n.panel h3 { margin: 0 0 10px; font-size: 15px; }\n.metric { display: flex; align-items: center; justify-content: space-between; gap: 12px; }\n.metric strong { font-size: 24px; }\n.table { width: 100%; border-collapse: collapse; font-size: 13px; }\n.table th, .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: left; }\n.status { display: inline-flex; border-radius: 999px; padding: 3px 9px; background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800; }\n.actions { display: flex; flex-wrap: wrap; gap: 8px; }\n.primary { border: 0; border-radius: 7px; padding: 8px 12px; background: #2563eb; color: #fff; font-weight: 800; }\n.secondary { border: 1px solid #cbd5e1; border-radius: 7px; padding: 8px 12px; background: #fff; color: #334155; font-weight: 800; }\n@media (max-width: 900px) { .app-shell { grid-template-columns: 1fr; height: auto; min-height: 100vh; overflow: visible; } .side-nav { max-height: none; } .nav-scroll { max-height: 48vh; } .grid.cols-2, .grid.cols-3 { grid-template-columns: 1fr; } }\n`,
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

async function genContract() {
  await writeStaticTask(contractItem.value, buildPrototypeContractFiles())
}

/* ── Page ── */
async function genPage(pi) {
  const vf = (sug.value?.viewFiles || []).find(v => v.file === pi.label)
  const sp = (sug.value?.pageDetailSpecs || []).find(s => s.file === pi.label)
  const apiMapping = (sug.value?.pageApiMapping || []).find(m => m.page === pi.label)
  const contract = buildPrototypeContract()
  const pageContract = contract.pages.find(page => page.file === pi.label)
  const relatedComponents = (sug.value?.componentFiles || [])
    .filter(c => (c.reusedBy || []).includes(pi.label))
    .map(c => ({ file: c.file, responsibility: c.responsibility, props: (c.props || []).slice(0, 6) }))
  await run(pi, pi.label, [
    `生成 Vue3 页面组件：prototypes/${slug.value}/src/views/${vf?.file || pi.label}`,
    `职责：${sp?.responsibility || vf?.responsibility || pi.label}`,
    `只生成这一个页面文件，不要生成其他文件。`,
    `必须从 ../prototypeContract.js 导入 prototypeContract，并可 inject('prototypeContext') 读取 currentRole/currentRoleKey；不同角色看到的数据或默认筛选要有差异。`,
    `必须严格使用 pageContract.mocks 中列出的 mock 入口；只允许从指定 importPath 导入 readFunction/dataExport，禁止新增未在 contract 中出现的 mock 文件。`,
    `可以用相对路径导入 ../components 和 ../data 下的文件；禁止使用 @ 别名。`,
    `禁止导入 vue-router、element-plus、vuedraggable 或任何未在 package.json 声明的外部库。`,
    `页面展示字段必须来自 pageContract.mocks.schema 或在页面内做 normalize 映射；禁止直接渲染可能不存在的字段导致空白内容。`,
    `禁止在页面内定义超过 3 条记录的大块业务 mock 数组；演示数据必须来自 contract 指定的 mock 读取函数。`,
    `列表、卡片、详情区必须展示可见业务文本和关键字段，至少包含标题、状态、时间/地点/人员中的两类信息。`,
    `要求：script setup + scoped CSS，包含 loading/empty/error 状态，适合原型演示；<script setup> 内禁止出现 export function/export const。`,
    `输出 JSON：{"files":[{"path":"prototypes/${slug.value}/src/views/${vf?.file||'Page.vue'}","content":"..."}]}`,
  ].filter(Boolean).join('\n'), {
    page: vf,
    pageSpec: sp,
    apiMapping,
    relatedComponents,
    pageContract,
    prototypeContract: contract,
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
  const contract = buildPrototypeContract()
  await run(mockItem.value, 'Mock 数据', [
    `生成 mock 数据和 API 客户端，写入 prototypes/${slug.value}/src/data/ 和 src/api/：`,
    `必须严格按照 prototypeContract.mocks 生成文件和导出：每个 mock.file 都必须导出 dataExport 和 readFunction。`,
    `readFunction 必须返回 Promise，支持可选参数 { roleKey, currentUser, filters }，并按角色做轻量过滤或标记，保证角色切换后演示有差异。`,
    `只生成 mock 和 api 文件，不要生成页面或组件。`,
    `禁止导入外部库，文件之间用相对路径导入。`,
    `要求：数据字段要同时兼容页面语义字段和原始业务字段，例如车辆同时提供 id/plate/driver/status 与 vehicleId/plateNo/driverName。`,
    `src/api/index.js 必须导入 prototypeContract，并提供 requestMock(path, params) 与 listPrototypeApis() 两个具名函数，返回 Promise 模拟异步。`,
    `输出 JSON：{"files":[{"path":"...","content":"..."}]}`,
  ].join('\n'), {
    prototypeContract: contract,
  })
}

async function genAppShell() {
  await writeStaticTask(appItem.value, buildAppShellFiles())
}

/* ── All ── */
function resetItem(item, msg = '') {
  item.st = 'idle'
  item.msg = msg
  item.err = ''
  item.files = []
  item._rawFiles = []
  item.signature = ''
  item.validation = null
}

function resetGeneratedState() {
  for (const item of allItems.value) resetItem(item)
  curTask.value = ''
  writeStatus.value = '已重置本页生成状态，接下来会按新流程覆盖写入目标文件。'
  emitDraft()
}

async function handleGenerateChoice() {
  if (!hasGenerated.value) {
    await genAll()
    return
  }

  const expectedFileCount = allItems.value.reduce((sum, item) => sum + expectedFilesForItem(item).length, 0)
  const expectedTaskCount = allItems.value.length
  const shouldRegenerate = window.confirm([
    `当前 prototypes/${slug.value}/ 已有生成状态。`,
    `确定要从 0 开始重新生成 ${expectedTaskCount} 个生成项，并覆盖本页管理的约 ${expectedFileCount} 个目标文件吗？`,
    `进度条显示的是生成项数量；目标文件数包含一个生成项内写入的多个文件。`,
    '此操作不会删除目录或清空未列出的文件；取消则只生成缺失项。',
  ].join('\n'))

  if (shouldRegenerate) {
    resetGeneratedState()
    await nextTick()
    await genAll()
    return
  }

  if (allDone.value) {
    writeStatus.value = '已保留当前生成结果；没有缺失项需要生成。'
    return
  }
  await genAll()
}

async function genAll() {
  isBatchGenerating.value = true
  try {
    curTask.value = '🏗 项目骨架'
    for (const sk of skelItems.value) { if (sk.st !== 'done') { await genSkel(sk); if (sk.st !== 'done') { curTask.value = ''; return } } }
    curTask.value = '📐 运行契约'
    if (contractItem.value.st !== 'done') { await genContract(); if (contractItem.value.st !== 'done') { curTask.value = ''; return } }
    curTask.value = '📦 Mock 数据'
    if (mockItem.value.st !== 'done') { await genMock(); if (mockItem.value.st !== 'done') { curTask.value = ''; return } }
    curTask.value = '🧩 通用组件'
    for (const ci of compItems.value) { if (ci.st !== 'done') { await genComp(ci); if (ci.st !== 'done') { curTask.value = ''; return } } }
    curTask.value = '📄 页面文件'
    for (const pi of pageItems.value) { if (pi.st !== 'done') { curTask.value = '📄 ' + pi.label; await genPage(pi); if (pi.st !== 'done') { curTask.value = ''; return } } }
    curTask.value = '🧭 App.vue'
    if (appItem.value.st !== 'done') await genAppShell()
    if (appItem.value.st === 'done' && updateValidationStatus()) {
      try {
        await validateProjectOnDisk()
      } catch (e) {
        setFail(appItem.value, e)
      }
    }
  } finally {
    isBatchGenerating.value = false
    curTask.value = ''
  }
}

async function ensureRetryPrerequisites(item) {
  if (item.key === 'skel_config' || item.key === 'skel_app') return true

  for (const sk of skelItems.value) {
    if (sk.st !== 'done') {
      curTask.value = `补齐前置：${sk.label}`
      await genSkel(sk)
      if (sk.st !== 'done') return false
    }
  }

  if (item.key === contractItem.value.key) return true

  if (contractItem.value.st !== 'done') {
    curTask.value = `补齐前置：${contractItem.value.label}`
    await genContract()
    if (contractItem.value.st !== 'done') return false
  }

  if (pageItems.value.includes(item) && mockItem.value.st !== 'done') {
    curTask.value = `补齐前置：${mockItem.value.label}`
    await genMock()
    if (mockItem.value.st !== 'done') return false
  }

  if (item.key === appItem.value.key) {
    if (mockItem.value.st !== 'done') {
      curTask.value = `补齐前置：${mockItem.value.label}`
      await genMock()
      if (mockItem.value.st !== 'done') return false
    }
    for (const ci of compItems.value) {
      if (ci.st !== 'done') {
        curTask.value = `补齐前置：${ci.label}`
        await genComp(ci)
        if (ci.st !== 'done') return false
      }
    }
    for (const pi of pageItems.value) {
      if (pi.st !== 'done') {
        curTask.value = `补齐前置：${pi.label}`
        await genPage(pi)
        if (pi.st !== 'done') return false
      }
    }
  }

  return true
}

async function retryFailed() {
  if (isBusy.value) {
    writeStatus.value = '当前已有生成任务在执行，请等待完成后再重试失败项。'
    return
  }

  const targets = failedItems.value
  if (!targets.length) {
    writeStatus.value = '当前没有失败项需要重试。'
    return
  }

  isBatchGenerating.value = true
  writeStatus.value = `开始重试 ${targets.length} 个失败项...`
  try {
    for (const item of targets) {
      curTask.value = `重试失败项：${item.label}`
      const ready = await ensureRetryPrerequisites(item)
      if (!ready) {
        writeStatus.value = `❌ 重试前置步骤失败：${item.label}`
        return
      }
      if (item.st !== 'fail') continue

      if (skelItems.value.includes(item)) await genSkel(item)
      else if (item.key === contractItem.value.key) await genContract()
      else if (item.key === mockItem.value.key) await genMock()
      else if (compItems.value.includes(item)) await genComp(item)
      else if (pageItems.value.includes(item)) await genPage(item)
      else if (item.key === appItem.value.key) await genAppShell()

      if (item.st !== 'done') {
        writeStatus.value = `❌ 仍有失败项：${item.label}。${item.err || '请查看该项错误信息'}`
        return
      }
    }

    writeStatus.value = hasFailed.value
      ? `❌ 部分失败项仍未完成：${failedItems.value.map(item => item.label).join('、')}`
      : '✅ 失败项已全部重试完成'
    if (!hasFailed.value && allDone.value && updateValidationStatus()) {
      try {
        await validateProjectOnDisk()
      } catch (e) {
        setFail(appItem.value, e)
      }
    }
  } finally {
    isBatchGenerating.value = false
    curTask.value = ''
  }
}

async function confirmAndFinish() {
  if (!updateValidationStatus()) return
  try {
    const validation = await validateProjectOnDisk()
    emit('prototype-generated', {
      outputDir: `prototypes/${slug.value}`,
      generatedFiles: allItems.value.flatMap(i=>i.files||[]),
      suggestion: sug.value,
      validation,
    })
  } catch (e) {
    writeStatus.value = `❌ ${e.message || '原型磁盘级校验失败'}`
  }
}

function emitDraft() {
  emit('prototype-draft-update', {
    outputDir: `prototypes/${slug.value}`,
    items: allItems.value.map(i => ({
      key: i.key, st: i.st, msg: i.msg, err: i.err,
      signature: i.signature || '',
      validation: i.validation || null,
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
