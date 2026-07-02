<template>
  <section class="interaction-api-view" aria-labelledby="interaction-api-title">
    <ViewHeading
      eyebrow="Interaction & API"
      title="交互与API一体化设计工作台"
      title-id="interaction-api-title"
      description="选择一个页面，一次性生成字段、按钮、校验、状态和对应的 API 契约（路径、参数、响应、错误码）。"
    />

    <!-- Scenario Page Overview (compact cards) -->
    <section v-if="scenarioPageGroups.length" class="scenario-strip" aria-label="场景选择">
      <button
        v-for="scenario in scenarioPageGroups"
        :key="scenario.key"
        type="button"
        class="scenario-chip"
        :class="{ active: scenario.key === selectedScenarioKey }"
        @click="selectScenario(scenario.key)"
      >
        <span class="chip-priority">{{ scenario.priority }}</span>
        <span class="chip-name">{{ scenario.name }}</span>
        <span class="chip-count">{{ scenario.pages.length }}页</span>
      </button>
    </section>

    <!-- Page Tabs + Generate (compact horizontal) -->
    <div class="page-toolbar">
      <nav class="page-tabs" aria-label="页面选择">
        <button
          v-for="page in recommendedPages"
          :key="page.key"
          type="button"
          class="page-tab"
          :class="{ active: page.key === selectedKey }"
          @click="selectedKey = page.key"
        >
          <strong>{{ page.name }}</strong>
          <small v-if="page.vueFile">{{ page.vueFile }}</small>
        </button>
      </nav>

      <div class="toolbar-actions">
        <button
          class="gen-btn"
          type="button"
          :disabled="isGenerating || !selectedPageDesign"
          @click="generateForSelectedPage"
        >
          {{ isGenerating ? '⏳ 生成中...' : hasGeneratedCurrent ? '🔄 重新生成' : '⚡ 生成交互与API' }}
        </button>
      </div>
    </div>

    <!-- Current page info + status -->
    <div class="page-context" v-if="selectedPageDesign">
      <p class="page-goal" v-if="selectedPageDesign.goal">{{ selectedPageDesign.goal }}</p>
      <p v-if="generationMessage" class="gen-status" :class="{ error: generationError }">{{ generationMessage }}</p>
    </div>

    <!-- Side-by-side panels (always visible) -->
    <div class="dual-panels">
      <!-- Left: Interaction Design -->
      <article class="result-panel interaction-panel">
        <div class="panel-heading">
          <span>📋 交互设计</span>
          <strong>{{ currentGeneratedPage.name || '选择页面' }}</strong>
        </div>

        <template v-if="hasGeneratedCurrent">
          <section class="card-section" aria-label="字段设计">
            <h4>字段设计</h4>
            <div class="field-row header">
              <span>字段</span><span>类型</span><span>必填</span><span>说明</span>
            </div>
            <div v-for="field in currentGeneratedPage.fields" :key="field.name" class="field-row">
              <span>{{ field.label }}</span>
              <span class="field-type">{{ field.type }}</span>
              <span>{{ field.required ? '✓' : '-' }}</span>
              <span>{{ field.description }}</span>
            </div>
          </section>

          <section class="card-section" aria-label="按钮与动作">
            <h4>按钮与动作</h4>
            <div v-for="action in currentGeneratedPage.actions" :key="action.label" class="action-chip">
              <strong>{{ action.label }}</strong>
              <span>触发：{{ action.trigger }}</span>
              <span>反馈：{{ action.feedback }}</span>
            </div>
          </section>

          <section class="card-section" aria-label="校验规则">
            <h4>校验规则</h4>
            <ul class="rule-list">
              <li v-for="rule in currentGeneratedPage.validations" :key="rule">{{ rule }}</li>
            </ul>
          </section>

          <section class="card-section" aria-label="页面状态">
            <h4>页面状态</h4>
            <div class="state-grid">
              <div v-for="(value, key) in currentGeneratedPage.states" :key="key" class="state-chip">
                <dt>{{ stateLabels[key] || key }}</dt>
                <dd>{{ value }}</dd>
              </div>
            </div>
          </section>
        </template>

        <div v-else class="panel-placeholder">
          <span>📝</span>
          <p>点击上方「生成交互与API」后，<br>字段、按钮、校验和状态会在这里展示。</p>
        </div>
      </article>

      <!-- Right: API Contract -->
      <article class="result-panel api-panel">
        <div class="panel-heading">
          <span>🔌 API 契约</span>
          <strong>{{ hasGeneratedCurrent ? currentApiContract.name : '待生成' }}</strong>
        </div>

        <template v-if="hasGeneratedCurrent">
          <section class="card-section" aria-label="基础信息">
            <h4>基础信息</h4>
            <div class="api-meta-strip">
              <span class="method-tag">{{ currentApiContract.method }}</span>
              <code>{{ currentApiContract.path }}</code>
            </div>
            <dl class="meta-list">
              <div><dt>调用时机</dt><dd>{{ currentApiContract.trigger }}</dd></div>
              <div><dt>接口目标</dt><dd>{{ currentApiContract.goal }}</dd></div>
            </dl>
          </section>

          <section class="card-section" aria-label="请求参数">
            <h4>请求参数</h4>
            <div class="param-row header">
              <strong>参数</strong><strong>类型</strong><strong>必填</strong><strong>说明</strong>
            </div>
            <div v-for="param in currentApiContract.requestParams" :key="param.name" class="param-row">
              <span>{{ param.name }}</span>
              <span class="param-type">{{ param.type }}</span>
              <span>{{ param.required ? '✓' : '-' }}</span>
              <span>{{ param.description }}</span>
            </div>
          </section>

          <section class="card-section" aria-label="成功响应">
            <h4>成功响应</h4>
            <pre>{{ formatJson(currentApiContract.successResponse) }}</pre>
          </section>

          <section class="card-section" aria-label="失败响应">
            <h4>失败响应</h4>
            <pre class="error-pre">{{ formatJson(currentApiContract.errorResponse) }}</pre>
          </section>

          <section class="card-section" aria-label="错误码">
            <h4>错误码</h4>
            <div v-for="item in currentApiContract.errorCodes" :key="item.code" class="error-chip">
              <strong>{{ item.code }}</strong>
              <p>{{ item.meaning }}</p>
              <small>{{ item.frontendAdvice }}</small>
            </div>
          </section>
        </template>

        <div v-else class="panel-placeholder">
          <span>🔧</span>
          <p>点击上方「生成交互与API」后，<br>API 方法、路径、参数、响应和错误码会在这里展示。</p>
        </div>
      </article>
    </div>

    <!-- Confirm -->
    <div class="next-action">
      <button class="primary-button" type="button" :disabled="!hasGeneratedCurrent" @click="confirmAndNext">
        确认并进入下一步 →
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['interaction-api-confirm', 'interaction-api-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

// --- State ---
const generatedPagesByKey = ref({})
const generatedApiByPageKey = ref({})
const selectedScenarioKey = ref('')
const selectedKey = ref('')
const isGenerating = ref(false)
const generationMessage = ref('')
const generationError = ref(false)

// --- Computed: Read scenario→page design result (Phase 2 merged) ---
const scenarioPageResult = computed(() =>
  props.projectContext.scenarioPageDesignResult || props.projectContext.stepResults?.scenarioPageDesign || null
)

const scenarioPageGroups = computed(() => {
  if (!scenarioPageResult.value) return []

  const scenarios = scenarioPageResult.value.scenarios || scenarioPageResult.value.availableScenarios || []
  const designsByKey = scenarioPageResult.value.pageDesignsByScenarioKey || scenarioPageResult.value.pagesByKey || {}

  return scenarios.map((scenario) => {
    const design = designsByKey[scenario.key] || {}
    return {
      key: scenario.key,
      name: scenario.name,
      priority: scenario.priority || 'P1',
      pages: (design.pages || []).map((page, index) =>
        withScenarioPageKey(page, scenario, index)
      ),
    }
  })
})

const savedPageList = computed(() =>
  scenarioPageGroups.value.flatMap((g) => g.pages)
)

const savedPagesByOriginalKey = computed(() => {
  return savedPageList.value.reduce((result, page) => {
    if (page.originalPageKey) result[page.originalPageKey] = page
    if (page.key) result[page.key] = page
    return result
  }, {})
})

const selectedScenario = computed(
  () => scenarioPageGroups.value.find((s) => s.key === selectedScenarioKey.value) || scenarioPageGroups.value[0] || null
)

const selectedScenarioPages = computed(() => selectedScenario.value?.pages || [])

const recommendedPages = computed(() =>
  selectedScenarioPages.value.length ? selectedScenarioPages.value : []
)

const selectedPageDesign = computed(
  () => recommendedPages.value.find((item) => item.key === selectedKey.value) || recommendedPages.value[0] || null
)

// --- Computed: Generated results ---
const currentGeneratedPage = computed(() => {
  const gen = generatedPagesByKey.value[selectedKey.value]
  if (gen) return mergeGeneratedWithPageDesign(gen, selectedPageDesign.value)
  return createEmptyInteractionPage(selectedPageDesign.value || { key: '', name: '未选择', goal: '' })
})

const currentApiContract = computed(() => {
  const api = generatedApiByPageKey.value[selectedKey.value]
  if (api) return api
  return createEmptyApiContract(selectedPageDesign.value || { key: '', name: '未选择' })
})

const hasGeneratedCurrent = computed(() => Boolean(generatedPagesByKey.value[selectedKey.value]))

const stateLabels = { empty: '空状态', loading: '加载中', success: '成功', error: '失败' }

// --- Watchers ---
watch(scenarioPageGroups, (groups) => {
  if (!groups.some((s) => s.key === selectedScenarioKey.value)) {
    selectedScenarioKey.value = groups[0]?.key || ''
  }
}, { immediate: true })

watch(recommendedPages, (items) => {
  if (!items.some((item) => item.key === selectedKey.value)) {
    selectedKey.value = items[0]?.key || ''
  }
}, { immediate: true })

watch(
  () => props.projectContext.interactionApiResult || props.projectContext.stepResults?.interactionApi,
  (result) => {
    if (result?.generatedPagesByKey) generatedPagesByKey.value = result.generatedPagesByKey
    if (result?.generatedApiByPageKey) generatedApiByPageKey.value = result.generatedApiByPageKey
  },
  { immediate: true }
)

// --- Methods ---
function selectScenario(key) {
  selectedScenarioKey.value = key
}

function formatJson(value) {
  return JSON.stringify(value || {}, null, 2)
}

function confirmAndNext() {
  const draft = buildDraft()
  emit('interaction-api-confirm', {
    page: currentGeneratedPage.value,
    apiContract: currentApiContract.value,
    design: draft,
  })
}

// --- Build helpers ---
function buildDraft() {
  return {
    generatedPagesByKey: generatedPagesByKey.value,
    generatedApiByPageKey: generatedApiByPageKey.value,
    scenarioPageGroups: scenarioPageGroups.value,
    pageDesign: scenarioPageResult.value,
    selectedPage: currentGeneratedPage.value,
    selectedApiContract: currentApiContract.value,
    savedAt: new Date().toISOString(),
  }
}

function createEmptyInteractionPage(page) {
  return {
    key: page.key,
    name: page.name,
    vueFile: page.vueFile,
    goal: page.goal,
    features: page.features || [],
    sections: page.sections || [],
    fields: [],
    actions: [],
    validations: [],
    states: {},
  }
}

function createEmptyApiContract(page) {
  return {
    key: `api-${page.key || 'page'}`,
    name: `${page.name || '未命名'} API`,
    method: 'GET',
    path: '/api/placeholder',
    goal: '',
    trigger: '',
    requestParams: [],
    successResponse: {},
    errorResponse: {},
    errorCodes: [],
    sourcePageKey: page.key,
  }
}

function mergeGeneratedWithPageDesign(generatedPage, pageDesign) {
  return {
    ...generatedPage,
    key: pageDesign?.key || generatedPage.key,
    name: pageDesign?.name || generatedPage.name,
    vueFile: pageDesign?.vueFile || generatedPage.vueFile,
    goal: pageDesign?.goal || generatedPage.goal,
    features: pageDesign?.features || generatedPage.features || [],
    sections: pageDesign?.sections || generatedPage.sections || [],
  }
}

// --- Page identity helpers (from PageInteractionView) ---
function mergeSavedPageIdentity(page, scenario, index = 0) {
  const matched = savedPagesByOriginalKey.value[page.key] || savedPagesByOriginalKey.value[page.originalPageKey]
  const merged = { ...page, ...matched }
  return { ...merged, name: resolvePageDesignTitle(merged, scenario, index) }
}

function isTechnicalPageTitle(value) {
  const text = String(value || '').trim()
  return !text || /\.vue\b/i.test(text) || /^[A-Z][A-Za-z0-9]+$/.test(text)
}

function resolvePageDesignTitle(page, scenario, index = 0) {
  if (!isTechnicalPageTitle(page?.name)) return page.name
  if (index === 0 && scenario?.name) return `${scenario.name}工作台`
  const sourceText = [page?.goal || '', page?.featureText || '', ...(page?.features || []), ...(page?.sections || []), page?.vueFile || '', page?.name || ''].join(' ')
  const rules = [
    { keys: ['导航', '路线', '前往'], title: '导航路线指引页面' },
    { keys: ['到达', '拍照', '签到', '确认'], title: '到达拍照确认页面' },
    { keys: ['完成', '关闭', '装卸', '作业'], title: '任务完成关闭页面' },
    { keys: ['智能', '匹配', '派车', '下发'], title: '智能派车页面' },
    { keys: ['任务状态', '任务列表', '进度', '跟踪'], title: '任务跟踪页面' },
    { keys: ['异常', '告警', '处理'], title: '异常处理页面' },
    { keys: ['效率', '利用率', '完成率', '等待时长'], title: '效率分析页面' },
    { keys: ['费用', '外协'], title: '费用分析页面' },
    { keys: ['报表', '导出'], title: '报表导出页面' },
    { keys: ['入场', '核验', '门岗'], title: '门岗入场核验页面' },
    { keys: ['预约', '申请'], title: '预约申请页面' },
  ]
  const matched = rules.find((r) => r.keys.some((k) => sourceText.includes(k)))
  if (matched) return matched.title
  const feature = page?.features?.[0] || splitTextList(page?.featureText)[0]
  if (feature) return `${feature.replace(/^展示|^提供|^支持/, '')}页面`
  return `${scenario?.name || page?.scenarioName || '业务'}页面${index + 1}`
}

function withScenarioPageKey(page, scenario, index) {
  const rawKey = page.key || page.vueFile || `page-${index + 1}`
  return { ...page, originalPageKey: rawKey, scenarioKey: scenario.key, scenarioName: scenario.name, key: `${scenario.key}-${rawKey}-${index}` }
}

function splitTextList(value) {
  return String(value || '').split(/[、,，;；\n]/).map((s) => s.trim()).filter(Boolean)
}

// --- Field/Action/Validation/State builders (fallbacks) ---
function buildFallbackFields(page, featureItems, sectionItems) {
  const source = sectionItems.length ? sectionItems : featureItems
  const fields = source.slice(0, 5).map((item, i) => ({
    name: `field${i + 1}`, label: item, type: i === 0 ? '状态/摘要' : '文本/选择', required: i < 2,
    description: `支撑「${page.name}」中的${item}展示或录入。`,
  }))
  return fields.length ? fields : [{ name: 'pageGoal', label: '页面目标', type: '文本', required: true, description: page.goal || `说明「${page.name}」的核心业务目标。` }]
}

function buildFallbackActions(page) {
  return [
    { label: '查询/刷新', trigger: '进入页面或点击刷新按钮', feedback: `更新「${page.name}」的最新业务数据。` },
    { label: '保存当前处理结果', trigger: '点击主操作按钮', feedback: '校验必填信息后保存，并提示同步成功或失败原因。' },
  ]
}

function buildFallbackValidations(page) {
  return [`${page.name} 的关键筛选或处理字段不能为空。`, '提交前校验状态流转是否合法，并给出明确错误提示。']
}

function buildFallbackStates(page) {
  return {
    empty: `${page.name} 暂无符合条件的数据。`,
    loading: `正在加载 ${page.vueFile} 所需数据。`,
    success: '数据加载完成，可继续处理业务动作。',
    error: '接口或本地数据读取失败，保留重试入口。',
  }
}

// --- LLM Generation ---
async function generateForSelectedPage() {
  if (!selectedPageDesign.value) {
    setGenError('请先选择一个页面。')
    return
  }
  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    setGenError('请先确认 DeepSeek 已配置，再生成。')
    return
  }

  isGenerating.value = true
  generationError.value = false
  generationMessage.value = `正在生成「${selectedPageDesign.value.name}」的交互设计...`

  // Step 1: Generate interaction
  let interactionResult
  try {
    interactionResult = await callLlmForInteraction()
    generatedPagesByKey.value = {
      ...generatedPagesByKey.value,
      [interactionResult.key]: interactionResult,
    }
    generationMessage.value = `交互设计完成，正在生成 API 契约...`
  } catch (err) {
    setGenError(err.message || '交互设计生成失败。')
    isGenerating.value = false
    return
  }

  // Step 2: Generate API contract based on interaction
  try {
    const apiResult = await callLlmForApiContract(interactionResult)
    generatedApiByPageKey.value = {
      ...generatedApiByPageKey.value,
      [selectedPageDesign.value.key]: apiResult,
    }
    emitDraftUpdate()
    generationMessage.value = `「${interactionResult.name}」的交互设计与 API 契约已生成。`
  } catch (err) {
    generationError.value = true
    generationMessage.value = `交互已生成，但 API 契约生成失败：${err.message || '请重试。'}`
    emitDraftUpdate()
  }

  isGenerating.value = false
}

async function callLlmForInteraction() {
  const page = selectedPageDesign.value
  const featureItems = page.features?.length ? page.features : splitTextList(page.featureText)
  const sectionItems = page.sections?.length ? page.sections : featureItems

  const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      step_key: 'interactionApi',
      step_title: '交互与API一体化：交互设计',
      instruction: '请根据当前页面的页面目标、承载功能、页面区域，生成当前页面的交互设计。只返回严格 JSON：{"interactionDesign":{"fields":[],"actions":[],"validations":[],"states":{}}}。fields 每项含 name,label,type,required,description。actions 每项含 label,trigger,feedback。validations 为字符串数组。states 含 empty,loading,success,error。',
      current_output: {
        scenario: selectedScenario.value ? { key: selectedScenario.value.key, name: selectedScenario.value.name } : null,
        page,
        pageGoal: page.goal,
        features: featureItems,
        sections: sectionItems,
      },
      project_context: buildProjectContext(),
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) throw new Error(getApiErrorMessage(payload, '交互设计生成失败。'))

  const output = payload.data?.revised_output?.interactionDesign || payload.data?.revised_output || {}
  return normalizeInteraction(output, page, featureItems, sectionItems)
}

async function callLlmForApiContract(interactionPage) {
  const page = selectedPageDesign.value
  const requestParams = (interactionPage.fields || []).map((f) => ({
    name: f.name, type: mapFieldTypeToApi(f.type), required: Boolean(f.required), description: f.description,
  }))

  const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      step_key: 'interactionApiContract',
      step_title: '交互与API一体化：API契约',
      instruction: [
        '请根据当前页面的交互设计（字段、按钮、状态），生成该页面对应的核心 API 契约。',
        '只返回严格 JSON：{"apiContract":{"method":"GET|POST|PUT","name":"接口名称","path":"/api/...","goal":"接口目标","trigger":"调用时机","requestParams":[],"successResponse":{},"errorResponse":{},"errorCodes":[]}}。',
        'requestParams 每项含 name,type,required,description；errorCodes 每项含 code,meaning,frontendAdvice。',
        'successResponse 和 errorResponse 符合统一结构：{code,message,data,traceId}。',
        '接口路径按业务资源归类，如 /api/vehicles、/api/tasks、/api/issues。',
        '如果有多个核心操作（查询+保存+状态变更），可以生成 1-3 个接口，合并到 apiContract 对象中，name 用中文，path 用 /api/xxx。',
        '本次只生成 1 个核心接口，选择页面最重要的操作。',
      ].join('\n'),
      current_output: {
        page: { key: page.key, name: page.name, goal: page.goal, vueFile: page.vueFile },
        interaction: {
          fields: interactionPage.fields,
          actions: interactionPage.actions,
          validations: interactionPage.validations,
          states: interactionPage.states,
        },
        suggestedParams: requestParams,
      },
      project_context: buildProjectContext(),
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) throw new Error(getApiErrorMessage(payload, 'API 契约生成失败。'))

  const output = payload.data?.revised_output?.apiContract || payload.data?.revised_output || {}
  return normalizeApiContract(output, page, requestParams)
}

function normalizeInteraction(output, page, featureItems, sectionItems) {
  return {
    key: page.key,
    name: page.name,
    vueFile: page.vueFile,
    goal: page.goal,
    features: featureItems,
    sections: sectionItems,
    fields: Array.isArray(output.fields) && output.fields.length
      ? output.fields.map((f, i) => ({
          name: f.name || `field${i + 1}`, label: f.label || f.name || `字段${i + 1}`,
          type: f.type || '文本', required: Boolean(f.required), description: f.description || '',
        }))
      : buildFallbackFields(page, featureItems, sectionItems),
    actions: Array.isArray(output.actions) && output.actions.length
      ? output.actions.map((a) => ({ label: a.label || a.name || '操作', trigger: a.trigger || '点击按钮', feedback: a.feedback || '完成后反馈。' }))
      : buildFallbackActions(page),
    validations: Array.isArray(output.validations) && output.validations.length
      ? output.validations.map((v) => String(v).trim()).filter(Boolean)
      : buildFallbackValidations(page),
    states: output.states && typeof output.states === 'object' ? output.states : buildFallbackStates(page),
    generatedAt: new Date().toISOString(),
  }
}

function normalizeApiContract(output, page, fallbackParams) {
  const path = normalizePath(output.path, page)
  return {
    key: `api-${page.key}`,
    method: output.method || 'GET',
    name: output.name || `${page.name}接口`,
    path,
    goal: output.goal || `支撑「${page.name}」的数据读取与状态反馈。`,
    trigger: output.trigger || '页面初始化或用户操作',
    requestParams: Array.isArray(output.requestParams) && output.requestParams.length
      ? output.requestParams.map((p) => ({ name: p.name, type: p.type || 'string', required: Boolean(p.required), description: p.description || '' }))
      : fallbackParams,
    successResponse: output.successResponse || { code: 0, message: 'success', data: {}, traceId: 'trace-id' },
    errorResponse: output.errorResponse || { code: 500, message: '处理失败', data: null, traceId: 'trace-id' },
    errorCodes: Array.isArray(output.errorCodes) && output.errorCodes.length
      ? output.errorCodes.map((e) => ({ code: e.code, meaning: e.meaning, frontendAdvice: e.frontendAdvice }))
      : [{ code: 'VALIDATION_FAILED', meaning: '参数校验失败', frontendAdvice: '检查输入内容后重试。' }],
    sourcePageKey: page.key,
  }
}

function normalizePath(rawPath, page) {
  const p = String(rawPath || '').trim()
  if (p.startsWith('/api/')) return p
  const text = [page.name, page.goal, ...(page.features || [])].join(' ')
  if (/车辆|调度|派车|地图/.test(text)) return '/api/vehicles/dispatch'
  if (/任务|计划/.test(text)) return '/api/tasks'
  if (/异常|告警/.test(text)) return '/api/issues'
  if (/统计|报表|分析/.test(text)) return '/api/analytics'
  if (/门岗|入场|核验/.test(text)) return '/api/gate-check'
  if (/预约|申请/.test(text)) return '/api/reservations'
  return '/api/business'
}

function mapFieldTypeToApi(type) {
  const t = String(type || '').toLowerCase()
  if (/数字|number|int|float/.test(t)) return 'number'
  if (/开关|boolean|bool/.test(t)) return 'boolean'
  if (/日期|date/.test(t)) return 'string'
  return 'string'
}

function buildProjectContext() {
  return {
    projectName: props.projectContext.projectName,
    customerName: props.projectContext.customerName,
    projectStage: props.projectContext.projectStage,
  }
}

function emitDraftUpdate() {
  emit('interaction-api-draft-update', buildDraft())
}

function setGenError(msg) {
  generationError.value = true
  generationMessage.value = msg
}

function getApiErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') return payload.detail
  return payload?.detail?.message || payload?.message || fallback
}
</script>

<style scoped>
.interaction-api-view {
  margin-top: 16px;
}

/* ======== Scenario Strip (compact chips) ======== */
.scenario-strip {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.scenario-chip {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 999px;
  padding: 6px 16px;
  background: #f8fafc;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}

.scenario-chip.active {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: inset 0 0 0 1px #93c5fd;
}

.chip-priority {
  border-radius: 999px;
  padding: 1px 7px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 900;
}

.chip-name {
  color: #0f172a;
  font-weight: 700;
}

.chip-count {
  color: #94a3b8;
  font-size: 12px;
}

/* ======== Page Toolbar (tabs + generate button) ======== */
.page-toolbar {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 8px;
}

.page-tabs {
  display: flex;
  gap: 0;
  flex: 1;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
}

.page-tab {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 14px;
  border: none;
  border-right: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  transition: background 0.15s;
}

.page-tab:last-child {
  border-right: none;
}

.page-tab.active {
  background: #eff6ff;
  box-shadow: inset 0 -2px 0 #2563eb;
}

.page-tab strong {
  font-size: 13px;
  color: #0f172a;
}

.page-tab small {
  font-size: 11px;
  color: #94a3b8;
}

.page-tab.active strong {
  color: #1d4ed8;
}

.toolbar-actions {
  flex-shrink: 0;
}

/* ======== Page Context ======== */
.page-context {
  margin-bottom: 14px;
  padding: 0 4px;
}

.page-goal {
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 6px;
}

.gen-status {
  font-size: 12px;
  color: #2563eb;
  font-weight: 600;
}

.gen-status.error {
  color: #dc2626;
}

/* ======== Dual Panels ======== */
.dual-panels {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
  min-height: 360px;
}

.result-panel {
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #fff;
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 380px);
}

/* ======== Panel Heading ======== */
.panel-heading {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-heading span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 16px;
}

/* ======== Card Sections ======== */
.card-section {
  margin-bottom: 18px;
}

.card-section h4 {
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

/* ======== Field Table ======== */
.field-row {
  display: grid;
  grid-template-columns: 2fr 0.8fr 0.5fr 2.5fr;
  gap: 6px;
  padding: 7px 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 12px;
  align-items: center;
}

.field-row.header {
  color: #94a3b8;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.field-type,
.param-type {
  background: #f1f5f9;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  color: #64748b;
  width: max-content;
}

/* ======== Action Chips ======== */
.action-chip {
  display: grid;
  gap: 3px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 6px;
  background: #f8fafc;
}

.action-chip strong {
  color: #2563eb;
  font-size: 13px;
}

.action-chip span {
  font-size: 12px;
  color: #64748b;
}

/* ======== Rule List ======== */
.rule-list {
  list-style: disc;
  padding-left: 18px;
  margin: 0;
}

.rule-list li {
  font-size: 12px;
  color: #475569;
  margin-bottom: 4px;
  line-height: 1.4;
}

/* ======== State Grid ======== */
.state-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.state-chip {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 8px 10px;
  background: #f8fafc;
}

.state-chip dt {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 3px;
}

.state-chip dd {
  font-size: 12px;
  color: #475569;
  margin: 0;
  line-height: 1.4;
}

/* ======== API Meta ======== */
.api-meta-strip {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.method-tag {
  background: #2563eb;
  color: #fff;
  border-radius: 4px;
  padding: 3px 10px;
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.api-panel code,
.api-meta-strip code {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: #0f172a;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.meta-list {
  display: grid;
  gap: 6px;
}

.meta-list div {
  display: grid;
  grid-template-columns: 64px 1fr;
  gap: 8px;
  align-items: baseline;
}

.meta-list dt {
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
}

.meta-list dd {
  font-size: 12px;
  color: #475569;
  margin: 0;
}

/* ======== Param Row ======== */
.param-row {
  display: grid;
  grid-template-columns: 1.5fr 0.7fr 0.5fr 2fr;
  gap: 6px;
  padding: 7px 0;
  border-bottom: 1px solid #f8fafc;
  font-size: 12px;
  align-items: center;
}

.param-row.header {
  color: #94a3b8;
  font-weight: 800;
  font-size: 11px;
  text-transform: uppercase;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

/* ======== Code blocks ======== */
.result-panel pre {
  background: #1e293b;
  color: #e2e8f0;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 11px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  line-height: 1.5;
}

.error-pre {
  border-left: 3px solid #dc2626;
}

/* ======== Error Chips ======== */
.error-chip {
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 6px;
  background: #fef2f2;
}

.error-chip strong {
  display: block;
  color: #dc2626;
  font-size: 12px;
  margin-bottom: 3px;
  font-family: 'SF Mono', 'Fira Code', monospace;
}

.error-chip p {
  font-size: 12px;
  color: #475569;
  margin: 2px 0;
}

.error-chip small {
  color: #94a3b8;
  font-size: 11px;
}

/* ======== Panel Placeholder ======== */
.panel-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 48px 20px;
  color: #94a3b8;
}

.panel-placeholder span {
  font-size: 32px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.panel-placeholder p {
  font-size: 13px;
  color: #94a3b8;
  line-height: 1.6;
  margin: 0;
}

/* ======== Generate Button ======== */
.gen-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 22px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s;
}

.gen-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.gen-btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

/* ======== Next Action ======== */
.next-action {
  display: flex;
  justify-content: flex-end;
  padding: 12px 0;
}

.primary-button {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 28px;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;
  transition: background 0.15s;
}

.primary-button:hover:not(:disabled) {
  background: #1d4ed8;
}

.primary-button:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}
</style>
