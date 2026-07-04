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

      <section class="package-panel" aria-label="Codex 原型生成包">
        <div>
          <strong>推荐：导出 Codex 生成包</strong>
          <p>把前四步 Markdown 和 prototype JSON 契约打成 zip，并生成独立 Codex 会话可用的说明 README。</p>
          <code v-if="packageResult?.zip_path">{{ packageResult.zip_path }}</code>
        </div>
        <button class="package-btn" type="button" :disabled="isPackaging" @click="exportCodexPackage">
          {{ isPackaging ? '正在导出...' : '导出 zip + README' }}
        </button>
      </section>
      <p v-if="packageStatus" class="write-msg" :class="{ err: packageStatus.includes('❌') }">{{ packageStatus }}</p>

      <div class="progress-overview">
        <div class="progress-bar-track"><div class="progress-bar-fill" :style="{ width: pct + '%' }"></div></div>
        <span class="progress-text">{{ done }} / {{ total }} 完成</span>
      </div>
      <div v-if="curTask" class="cur-task">
        <span class="ct-dot"></span>
        <span>正在生成：<strong>{{ curTask }}</strong></span>
      </div>
      <div v-if="hasFailed" class="fail-summary" role="alert">
        <strong>当前失败项</strong>
        <ul>
          <li v-for="item in failedItems" :key="item.key">
            <span>{{ item.label }}</span>
            <small>{{ item.err || '生成失败，请重试或查看后端日志' }}</small>
          </li>
        </ul>
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
import { buildAppShellFiles as createAppShellFiles } from '../generators/appShellGenerator'
import { buildMockFiles as createMockFiles } from '../generators/mockGenerator'
import { buildComponentGenerationPrompt, buildPageGenerationPrompt } from '../generators/pagePromptGenerator'
import {
  buildProjectPath,
  buildPrototypeContract as createPrototypeContract,
  buildPrototypeContractFiles as createPrototypeContractFiles,
} from '../generators/prototypeContract'
import {
  buildBaseStyleFiles as createBaseStyleFiles,
  buildProjectConfigFiles as createProjectConfigFiles,
} from '../generators/projectSkeletonGenerator'
import { validatePrototypeFiles } from '../generators/validation'

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
const isCommitDeferred = ref(false)
const stagedFiles = ref(new Map())
const isPackaging = ref(false)
const packageStatus = ref('')
const packageResult = ref(null)
const generationRunId = ref(createGenerationRunId())

const prevOk  = computed(() => Boolean(props.projectContext.stepResults?.prototype))
const llmOk   = computed(() => props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured)
const sug     = computed(() => props.projectContext.stepResults?.prototype || props.projectContext.selectedPrototypeSuggestion || null)
const slug    = computed(() => (props.projectContext.projectName || 'prototype').replace(/[^\w\u4e00-\u9fff-]/g, '-').toLowerCase())

/* ── Items ── */
function mkItem(key, label, desc, n) { return { key, label, desc, n, st: 'idle', msg: '', err: '', files: [] } }

const skelItems = ref([
  mkItem('skel_config', '① 项目配置', 'package.json、vite.config.js、index.html、main.js、兼容 shim 和默认资源', 9),
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
  if (saved.generationRunId) generationRunId.value = saved.generationRunId
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

function createGenerationRunId() {
  return `run-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
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

function resetRestoredItemsMissingDiskFiles() {
  if (isBatchGenerating.value || isBusy.value || !diskFiles.value.size) return false
  let changed = false

  for (const item of allItems.value) {
    if (item.st !== 'done') continue
    const paths = expectedFilesForItem(item)
    if (!paths.length || paths.every(path => diskFiles.value.has(path))) continue
    const files = item._rawFiles || item.files || []
    const hasInMemoryContent = files.some(file => typeof file.content === 'string' && file.content.trim())
    if (hasInMemoryContent) continue
    resetItem(item, `文件尚未写入磁盘，需要重新生成 ${item.label}`)
    changed = true
  }

  if (changed) emitDraft()
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
      resetRestoredItemsMissingDiskFiles()
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

async function exportCodexPackage() {
  if (isPackaging.value) return
  isPackaging.value = true
  packageStatus.value = '正在生成 Codex 原型生成包...'
  try {
    const response = await fetch(`${API}/method-files/prototype-package`, { method: 'POST' })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.detail || `生成包接口失败：${response.status}`)
    packageResult.value = payload
    packageStatus.value = `✅ 已生成 zip 和 README：${payload.package_dir}`
    emit('prototype-draft-update', {
      outputDir: `prototypes/${slug.value}`,
      generationRunId: generationRunId.value,
      package: payload,
      items: allItems.value.map(i => ({
        key: i.key, st: i.st, msg: i.msg, err: i.err,
        signature: i.signature || '',
        validation: i.validation || null,
        files: (i.files || []).map(f => ({ path: f.path, content: '' })),
      })),
    })
  } catch (error) {
    packageStatus.value = `❌ ${error.message || 'Codex 原型生成包生成失败'}`
  } finally {
    isPackaging.value = false
  }
}

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

async function commitFilesToDisk(files) {
  const validFiles = (files || []).filter(f => f.path && typeof f.content === 'string')
  if (!validFiles.length) throw new Error('没有可提交的文件')

  const r = await fetch(`${API}/prototype-projects/${encodeURIComponent(slug.value)}/files/commit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ run_id: generationRunId.value, files: validFiles }),
  })
  const payload = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(payload.detail || `提交文件失败：${r.status}`)
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
function setRun(it) { it.st = 'running'; it.msg = isCommitDeferred.value ? '正在生成并暂存，全部完成后统一写入...' : '正在请求 LLM 生成...'; it.err = ''; it.files = []; it.signature = ''; it.validation = null }
function setDone(it, files) { it.st = 'done'; it.files = files; it._rawFiles = files; it.signature = getItemSignature(it); it.validation = { signature: it.signature, runId: generationRunId.value, checkedAt: new Date().toISOString() }; it.msg = '✅ ' + files.length + ' 文件'; it.err = '' }
function setFail(it, e) { it.st = 'fail'; it.err = e.name==='AbortError'?'⏱ LLM 超时（120s），Prompt 可能太长，请重试':e.message?.includes('Failed to fetch')?'无法连接后端':e.message||'失败'; it.msg = ''; it.files = []; it.signature = ''; it.validation = null }

async function run(it, title, instruction, currentOutput) {
  if (isBusy.value) return; isBusy.value = true; setRun(it)
  try {
    const llmFiles = await callLLM(it.key, title, instruction, currentOutput)
    const { files, issues: targetIssues } = validateFilesForItem(it, llmFiles)
    const codeIssues = validateGeneratedCodeOutput(files)
    const issues = [...targetIssues, ...codeIssues]
    if (issues.length) throw new Error(`生成结果预检失败：${issues.slice(0, 4).join('；')}${issues.length > 4 ? `；另有 ${issues.length - 4} 项` : ''}`)
    if (isCommitDeferred.value) stageFiles(files)
    else await writeFilesToDisk(files)
    setDone(it, files)
    writeStatus.value = isCommitDeferred.value
      ? `✅ 已暂存 ${files.length} 个文件，等待本轮全部完成后统一写入`
      : `✅ 已写入 ${files.length} 个文件到 prototypes/${slug.value}/`
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
    if (isCommitDeferred.value) stageFiles(normalizedFiles)
    else await writeFilesToDisk(normalizedFiles)
    setDone(it, normalizedFiles)
    writeStatus.value = isCommitDeferred.value
      ? `✅ 已暂存 ${normalizedFiles.length} 个文件，等待本轮全部完成后统一写入`
      : `✅ 已写入 ${normalizedFiles.length} 个文件到 prototypes/${slug.value}/`
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

function stageFiles(files = []) {
  const next = new Map(stagedFiles.value)
  for (const file of files) {
    if (!file?.path || typeof file.content !== 'string' || !file.content.trim()) continue
    next.set(file.path, file)
  }
  stagedFiles.value = next
}

function currentStagedFiles() {
  return [...stagedFiles.value.values()]
}

function restageGeneratedFilesWithContent() {
  stageFiles(currentGeneratedFiles().filter(file => typeof file.content === 'string' && file.content.trim()))
}

function validateGeneratedFiles() {
  const generatedFiles = currentGeneratedFiles()
  return validatePrototypeFiles({
    slug: slug.value,
    generatedFiles,
    contract: buildPrototypeContract(),
  })
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
  return buildProjectPath(slug.value, path)
}

function buildPrototypeContract() {
  return createPrototypeContract({
    suggestion: sug.value,
    projectName: props.projectContext.projectName,
    customerName: props.projectContext.customerName,
  })
}

function buildPrototypeContractFiles() {
  return createPrototypeContractFiles({
    slug: slug.value,
    contract: buildPrototypeContract(),
  })
}

function buildAppShellFiles() {
  return createAppShellFiles({
    slug: slug.value,
    contract: buildPrototypeContract(),
  })
}

function buildProjectConfigFiles() {
  return createProjectConfigFiles({
    slug: slug.value,
    projectName: props.projectContext.projectName || '原型系统',
  })
}

function buildBaseStyleFiles() {
  return createBaseStyleFiles({ slug: slug.value })
}

function buildMockFiles() {
  return createMockFiles({
    slug: slug.value,
    contract: buildPrototypeContract(),
  })
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
  await run(pi, pi.label, buildPageGenerationPrompt({
    slug: slug.value,
    file: vf?.file || pi.label,
    responsibility: sp?.responsibility || vf?.responsibility || pi.label,
  }), {
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
  await run(ci, ci.label, buildComponentGenerationPrompt({
    slug: slug.value,
    file: ci.label,
    description: ci.desc,
  }), { component: comp })
}

/* ── Mock ── */
async function genMock() {
  await writeStaticTask(mockItem.value, buildMockFiles())
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
  generationRunId.value = createGenerationRunId()
  stagedFiles.value = new Map()
  for (const item of allItems.value) resetItem(item)
  curTask.value = ''
  writeStatus.value = '已重置本页生成状态，接下来会先暂存生成结果，全部通过校验后再统一写入目标文件。'
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
  isCommitDeferred.value = true
  try {
    if (!hasGenerated.value) {
      generationRunId.value = createGenerationRunId()
      stagedFiles.value = new Map()
    } else {
      restageGeneratedFilesWithContent()
    }
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
        const files = currentStagedFiles()
        if (!files.length) {
          writeStatus.value = '没有新的暂存文件需要提交，直接执行磁盘级校验。'
          await validateProjectOnDisk()
          return
        }
        curTask.value = '统一提交文件'
        writeStatus.value = `正在统一提交 ${files.length} 个文件到 prototypes/${slug.value}/...`
        await commitFilesToDisk(files)
        writeStatus.value = `✅ 已统一提交 ${files.length} 个文件到 prototypes/${slug.value}/`
        await validateProjectOnDisk()
      } catch (e) {
        setFail(appItem.value, e)
      }
    }
  } finally {
    isCommitDeferred.value = false
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
  isCommitDeferred.value = true
  restageGeneratedFilesWithContent()
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
    if (!hasFailed.value && !allDone.value) {
      writeStatus.value = '✅ 失败项已修复，继续生成剩余缺失项...'
      await genAll()
      return
    }
    if (!hasFailed.value && allDone.value && updateValidationStatus()) {
      try {
        const files = currentStagedFiles()
        if (files.length) {
          curTask.value = '统一提交文件'
          writeStatus.value = `正在统一提交 ${files.length} 个文件到 prototypes/${slug.value}/...`
          await commitFilesToDisk(files)
          writeStatus.value = `✅ 已统一提交 ${files.length} 个文件到 prototypes/${slug.value}/`
        }
        await validateProjectOnDisk()
      } catch (e) {
        setFail(appItem.value, e)
      }
    }
  } finally {
    isCommitDeferred.value = false
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
    generationRunId: generationRunId.value,
    items: allItems.value.map(i => ({
      key: i.key, st: i.st, msg: i.msg, err: i.err,
      runId: generationRunId.value,
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
.package-panel { display:flex; align-items:center; justify-content:space-between; gap:14px; border:1px solid #bfdbfe; border-radius:8px; padding:14px; background:#eff6ff; }
.package-panel strong { display:block; margin-bottom:4px; font-size:14px; color:#1e3a8a; }
.package-panel p { margin:0 0 8px; color:#475569; font-size:13px; line-height:1.5; }
.package-panel code { display:block; max-width:100%; padding:6px 8px; border-radius:6px; background:#dbeafe; color:#1d4ed8; font-size:12px; font-weight:800; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.package-btn { flex:0 0 auto; border:0; border-radius:8px; padding:10px 16px; background:#0f172a; color:#fff; font-size:13px; font-weight:900; cursor:pointer; }
.package-btn:disabled { opacity:.55; cursor:not-allowed; }
.progress-overview { display:flex; align-items:center; gap:10px; padding:6px 0; }
.progress-bar-track { flex:1; height:5px; background:#e2e8f0; border-radius:3px; overflow:hidden; }
.progress-bar-fill { height:100%; background:linear-gradient(90deg,#2563eb,#16a34a); border-radius:3px; transition:width .4s; }
.progress-text { font-size:12px; color:#64748b; font-weight:700; white-space:nowrap; }
.cur-task { display:flex; align-items:center; gap:8px; padding:6px 12px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; font-size:13px; color:#1d4ed8; }
.ct-dot { width:8px; height:8px; border-radius:50%; background:#2563eb; animation:pulse 1s ease infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.3} }
.cur-task strong { color:#0f172a; }
.fail-summary { border:1px solid #fecaca; border-radius:8px; padding:12px 14px; background:#fff7f7; color:#991b1b; display:grid; gap:8px; }
.fail-summary strong { font-size:14px; }
.fail-summary ul { margin:0; padding:0; list-style:none; display:grid; gap:6px; }
.fail-summary li { display:grid; gap:3px; }
.fail-summary span { font-size:13px; font-weight:900; color:#7f1d1d; }
.fail-summary small { color:#b91c1c; line-height:1.5; word-break:break-word; }
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
