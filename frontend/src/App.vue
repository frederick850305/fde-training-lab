<template>
  <main class="app-shell">
    <AppHeader />

    <nav class="main-tabs" aria-label="主导航">
      <button
        :class="{ active: activeMainTab === 'method' }"
        @click="activeMainTab = 'method'"
      >🔧 方法工作台</button>
      <button
        :class="{ active: activeMainTab === 'prototypeCenter' }"
        @click="activeMainTab = 'prototypeCenter'"
      >🏗️ 原型中心</button>
      <button
        :class="{ active: activeMainTab === 'proposal' }"
        @click="activeMainTab = 'proposal'"
      >📄 方案输出</button>
    </nav>

    <template v-if="activeMainTab === 'method'">
      <FactoryWorkbenchView
        :project-context="projectContext"
        :steps="methodWizardSteps"
        :active-step-key="activeMethodStepKey"
        :step-output="activeStepResult"
        @select-step="selectMethodStep"
        @revision-applied="handleStepRevisionApplied"
        @runtime-update="handleRuntimeUpdate"
        @restart-workflow="startNewMethodWorkflow"
      >
        <RequirementInputView
          v-if="activeMethodStepKey === 'requirementInput'"
          :project-context="projectContext"
          @analysis-complete="handleRequirementAnalysisComplete"
          @analysis-draft-update="handleRequirementAnalysisDraftUpdate"
          @context-update="handleProjectContextUpdate"
        />
        <ScenarioPageDesignView
          v-else-if="activeMethodStepKey === 'scenarioPageDesign'"
          :project-context="projectContext"
          @scenario-page-draft-update="handleScenarioPageDraftUpdate"
          @scenario-page-confirm="handleScenarioPageConfirm"
        />
        <InteractionApiView
          v-else-if="activeMethodStepKey === 'interactionApi'"
          :project-context="projectContext"
          @interaction-api-draft-update="handleInteractionApiDraftUpdate"
          @interaction-api-confirm="handleInteractionApiConfirm"
        />
        <FrontendPrototypeSuggestionView
          v-else
          :project-context="projectContext"
          @prototype-draft-update="handlePrototypeDraftUpdate"
        />
      </FactoryWorkbenchView>
    </template>

    <PrototypeCenterView
      v-else-if="activeMainTab === 'prototypeCenter'"
      :project-context="projectContext"
    />

    <ProposalOutputView
      v-else-if="activeMainTab === 'proposal'"
      :project-context="projectContext"
    />

    <template v-else>
      <section class="section-block" aria-label="方法工作台">
        <div class="section-heading">
          <p class="eyebrow">Method Workspace</p>
          <h2>FDE 自助式原型工厂</h2>
        </div>
        <p>请从上方导航选择「方法工作台」开始需求拆解，或选择「练习进展」查看当前进度。</p>
      </section>
    </template>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import FactoryWorkbenchView from './views/FactoryWorkbenchView.vue'
import FrontendPrototypeSuggestionView from './views/FrontendPrototypeSuggestionView.vue'
import PrototypeCenterView from './views/PrototypeCenterView.vue'
import ProposalOutputView from './views/ProposalOutputView.vue'
import InteractionApiView from './views/InteractionApiView.vue'
import RequirementInputView from './views/RequirementInputView.vue'
import ScenarioPageDesignView from './views/ScenarioPageDesignView.vue'

const LOCAL_SESSION_KEY = 'fde-prototype-factory-session:v1'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const activeWorkspace = ref('requirementInput')
const activeMainTab = ref('method')
const isRestoringLocalSession = ref(false)
const savedSessionSummary = ref(null)
const deepSeekConfigStatus = ref({
  configured: false,
  maskedApiKey: '',
  model: 'deepseek-v4-flash',
  baseUrl: 'https://api.deepseek.com',
})

const createEmptyStepResults = () => ({
  requirement: null,
  scenarioPageDesign: null,
  interactionApi: null,
  prototype: null,
})

const downstreamStepMap = {
  requirement: ['scenarioPageDesign', 'interactionApi', 'prototype'],
  scenarioPageDesign: ['interactionApi', 'prototype'],
  interactionApi: ['prototype'],
  prototype: [],
}

const createInvalidatedStepResult = (stepKey, invalidatedBy, reason) => ({
  invalidated: true,
  invalidatedBy,
  invalidatedAt: new Date().toISOString(),
  reason,
  stepKey,
  roles: [],
  scenarios: [],
  availableScenarios: [],
  modulesByScenarioKey: {},
  scenarioDetailReadyByKey: {},
  pageDesignsByScenarioKey: {},
  generatedPagesByKey: {},
  generatedApiByPageKey: {},
  scenarioPageGroups: [],
  pages: [],
  viewFiles: [],
  pageDetailSpecs: [],
  pageApiMapping: [],
  navigationRoutes: [],
  componentFiles: [],
  mockDataFiles: [],
  stepPrompts: [],
  generationPlan: [],
  summary: reason,
})

const createDefaultProjectContext = () => ({
  projectName: '海工生产运营示范项目',
  customerName: '示范客户',
  projectStage: '需求分析准备',
  currentStepLabel: '客户需求输入',
  contextStatus: 'DeepSeek 服务已选择',
  summary: '默认使用大模型生成；DeepSeek Key 保存后，将通过本地 FastAPI 调用真实服务。',
  executionMode: 'llm-ready',
  llmProvider: 'deepseek',
  llmConfigured: false,
  llmModel: 'deepseek-v4-flash',
  llmBaseUrl: 'https://api.deepseek.com',
  currentMethodStep: 'requirement',
  stepResults: createEmptyStepResults(),
})

const projectContext = ref(createDefaultProjectContext())

const mergeDeepSeekConfigStatus = (context) => ({
  ...context,
  llmConfigured: deepSeekConfigStatus.value.configured,
  llmModel: deepSeekConfigStatus.value.model || context.llmModel,
  llmBaseUrl: deepSeekConfigStatus.value.baseUrl || context.llmBaseUrl,
})

const updateDeepSeekConfigStatus = ({ configured, maskedApiKey, model, baseUrl }) => {
  deepSeekConfigStatus.value = {
    configured: Boolean(configured),
    maskedApiKey: maskedApiKey || deepSeekConfigStatus.value.maskedApiKey,
    model: model || deepSeekConfigStatus.value.model,
    baseUrl: baseUrl || deepSeekConfigStatus.value.baseUrl,
  }

  projectContext.value = mergeDeepSeekConfigStatus(projectContext.value)
}

const loadGlobalDeepSeekConfigStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/llm/config`)
    if (!response.ok) {
      throw new Error(`读取 DeepSeek 配置失败：${response.status}`)
    }

    const payload = await response.json()
    const data = payload.data || {}
    updateDeepSeekConfigStatus({
      configured: data.configured,
      maskedApiKey: data.masked_api_key,
      model: data.model,
      baseUrl: data.base_url,
    })
  } catch (error) {
    console.warn('Failed to read global DeepSeek config', error)
  }
}

const hasConfirmedStepResult = (context) => {
  return Object.values(context.stepResults || {}).some(Boolean)
}

const buildSavedSessionSummary = (snapshot) => {
  const context = snapshot?.projectContext

  if (!context || !hasConfirmedStepResult(context)) {
    return null
  }

  const savedAt = snapshot.savedAt ? new Date(snapshot.savedAt) : null
  const completedCount = Object.values(context.stepResults || {}).filter(Boolean).length

  return {
    savedAt: snapshot.savedAt || '',
    savedAtLabel: savedAt ? savedAt.toLocaleString('zh-CN') : '未知时间',
    projectName: context.projectName || '未命名项目',
    currentStepLabel: context.currentStepLabel || '客户需求输入',
    completedCount,
    summary: context.summary || '已保存本地方法链上下文。',
    projectContext: context,
    activeWorkspace: snapshot.activeWorkspace || 'requirementInput',
    activeMainTab: snapshot.activeMainTab || 'method',
  }
}

const readLocalSessionSnapshot = () => {
  try {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY)

    if (!raw) {
      return null
    }

    return JSON.parse(raw)
  } catch (error) {
    localStorage.removeItem(LOCAL_SESSION_KEY)
    return null
  }
}

const buildMarkdownSessionSummary = (payload) => {
  const completedCount = payload?.completed_count || 0
  if (!completedCount) {
    return null
  }

  const savedAt = payload.latest_saved_at ? new Date(payload.latest_saved_at) : null
  const latestFile = payload.files?.[payload.files.length - 1]

  return {
    source: 'markdown',
    savedAt: payload.latest_saved_at || '',
    savedAtLabel: savedAt && !Number.isNaN(savedAt.getTime()) ? savedAt.toLocaleString('zh-CN') : '本地 Markdown',
    projectName: projectContext.value.projectName || '本地 FDE 项目',
    currentStepLabel: latestFile?.title || '本地版本',
    completedCount,
    summary: '已发现项目目录中的 Markdown 本地版本。',
    outputDir: payload.output_dir || '',
    files: payload.files || [],
    activeWorkspace: 'requirementInput',
    activeMainTab: 'method',
  }
}

const readMarkdownSessionSummary = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/method-files`)
    if (!response.ok) {
      return null
    }

    return buildMarkdownSessionSummary(await response.json())
  } catch (error) {
    console.warn('Failed to read Markdown session summary', error)
    return null
  }
}

const refreshSavedSessionSummary = async () => {
  savedSessionSummary.value = await readMarkdownSessionSummary() || buildSavedSessionSummary(readLocalSessionSnapshot())
}

const persistLocalSession = () => {
  if (isRestoringLocalSession.value || !hasConfirmedStepResult(projectContext.value)) {
    return
  }

  const snapshot = {
    savedAt: new Date().toISOString(),
    projectContext: projectContext.value,
    activeWorkspace: activeWorkspace.value,
    activeMainTab: activeMainTab.value,
  }

  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(snapshot))
  savedSessionSummary.value = buildSavedSessionSummary(snapshot)
}

watch(projectContext, persistLocalSession, { deep: true })

watch([activeWorkspace, activeMainTab], persistLocalSession)

onMounted(async () => {
  refreshSavedSessionSummary()
  loadGlobalDeepSeekConfigStatus()
  await hydrateRequiredMethodInputs(activeMethodStepKey.value, { preferSaved: true })
})

const methodStepDefinitions = [
  {
    key: 'requirementInput',
    resultKey: 'requirement',
    step: '01',
    title: '需求拆解',
    input: '客户原始需求',
    output: '业务背景、痛点、目标、角色和待确认问题',
  },
  {
    key: 'scenarioPageDesign',
    resultKey: 'scenarioPageDesign',
    step: '02',
    title: '场景→页面',
    input: '需求拆解结果',
    output: '角色、场景、功能模块、页面清单、导航结构',
  },
  {
    key: 'interactionApi',
    resultKey: 'interactionApi',
    step: '03',
    title: '交互与API',
    input: '页面清单',
    output: '字段、按钮、状态、API 路径、参数、响应和错误码',
  },
  {
    key: 'frontendSuggestion',
    resultKey: 'prototype',
    step: '04',
    title: '前端原型方案',
    input: '页面、交互和 API 契约',
    output: '页面规格、组件契约、Mock 数据、路由和生成任务包',
  },
]

const methodStepKeyMap = Object.fromEntries(methodStepDefinitions.map((item) => [item.key, item.resultKey]))
const methodStepResultDefinitions = Object.fromEntries(methodStepDefinitions.map((item) => [item.resultKey, item]))

const activeMethodStepKey = computed(() => {
  return methodStepDefinitions.some((item) => item.key === activeWorkspace.value)
    ? activeWorkspace.value
    : 'requirementInput'
})

const methodWizardSteps = computed(() => {
  const results = projectContext.value.stepResults || createEmptyStepResults()

  return methodStepDefinitions.map((item, index) => {
    const isActive = item.key === activeMethodStepKey.value
    const isDone = Boolean(results[item.resultKey])
    const previousDone = index === 0 || Boolean(results[methodStepDefinitions[index - 1].resultKey])

    return {
      ...item,
      isActive,
      isDone,
      canOpen: isActive || isDone || previousDone,
      statusLabel: isActive ? '当前' : isDone ? '已确认' : previousDone ? '可生成' : '未开始',
      statusType: isActive ? 'running' : isDone ? 'done' : previousDone ? 'warning' : 'normal',
    }
  })
})

const activeStepResult = computed(() => {
  const resultKey = methodStepKeyMap[activeMethodStepKey.value]
  return resultKey ? projectContext.value.stepResults?.[resultKey] || null : null
})

function stableSerialize(value) {
  if (Array.isArray(value)) {
    return `[${value.map(stableSerialize).join(',')}]`
  }
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableSerialize(value[key])}`).join(',')}}`
  }
  return JSON.stringify(value ?? null)
}

function createSnapshotKey(value) {
  if (!value) return ''
  const text = stableSerialize(value)
  let hash = 0x811c9dc5
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index)
    hash = Math.imul(hash, 0x01000193)
  }
  return `v1:${(hash >>> 0).toString(16).padStart(8, '0')}:${text.length}`
}

function compactRequirementAnalysisForSnapshot(analysis) {
  if (!analysis) return null
  const {
    sourceText,
    sourceRequirement,
    manualRequirement,
    attachmentText,
    importedMarkdown,
    ...rest
  } = analysis
  return rest
}

function normalizeRequirementResult(result) {
  if (!result) return result
  const analysis = result.analysis || null
  const sourceRequirement = result.sourceRequirement || analysis?.sourceText || ''
  const manualRequirement = result.manualRequirement && result.manualRequirement !== sourceRequirement
    ? result.manualRequirement
    : ''
  const attachmentText = result.attachmentText && !String(sourceRequirement || '').includes(result.attachmentText)
    ? result.attachmentText
    : ''

  return {
    ...result,
    sourceRequirement,
    manualRequirement,
    attachmentText,
    analysis: compactRequirementAnalysisForSnapshot(analysis),
  }
}

function createRequirementSnapshotKey(result) {
  if (!result) return ''
  const normalized = normalizeRequirementResult(result)
  return createSnapshotKey({
    sourceRequirement: normalized.sourceRequirement || '',
    manualRequirement: normalized.manualRequirement || '',
    attachmentText: normalized.attachmentText || '',
    analysis: normalized.analysis,
  })
}

function createScenarioPageSnapshotKey(result) {
  if (!result) return ''
  return createSnapshotKey({
    scenarios: result.scenarios || result.availableScenarios || [],
    modulesByScenarioKey: result.modulesByScenarioKey || {},
    pageDesignsByScenarioKey: result.pageDesignsByScenarioKey || {},
  })
}

function createInteractionApiSnapshotKey(result) {
  if (!result) return ''
  return createSnapshotKey({
    generatedPagesByKey: result.generatedPagesByKey || {},
    generatedApiByPageKey: result.generatedApiByPageKey || {},
    scenarioPageGroups: result.scenarioPageGroups || [],
  })
}

function enrichStepResultWithSourceKeys(stepKey, result) {
  if (!result || result.invalidated) return result
  const stepResults = projectContext.value.stepResults || createEmptyStepResults()
  if (stepKey === 'scenarioPageDesign') {
    return {
      ...result,
      requirementSnapshotKey: createRequirementSnapshotKey(stepResults.requirement),
    }
  }
  if (stepKey === 'interactionApi') {
    return {
      ...result,
      scenarioPageSnapshotKey: createScenarioPageSnapshotKey(stepResults.scenarioPageDesign),
    }
  }
  if (stepKey === 'prototype') {
    return {
      ...result,
      scenarioPageSnapshotKey: createScenarioPageSnapshotKey(stepResults.scenarioPageDesign),
      interactionApiSnapshotKey: createInteractionApiSnapshotKey(stepResults.interactionApi),
    }
  }
  return result
}

function isStepResultCompatible(stepKey, result) {
  if (!result || result.invalidated) return false
  const stepResults = projectContext.value.stepResults || createEmptyStepResults()
  if (stepKey === 'scenarioPageDesign') {
    return Boolean(result.requirementSnapshotKey) &&
      result.requirementSnapshotKey === createRequirementSnapshotKey(stepResults.requirement)
  }
  if (stepKey === 'interactionApi') {
    return Boolean(result.scenarioPageSnapshotKey) &&
      result.scenarioPageSnapshotKey === createScenarioPageSnapshotKey(stepResults.scenarioPageDesign)
  }
  if (stepKey === 'prototype') {
    return Boolean(result.scenarioPageSnapshotKey && result.interactionApiSnapshotKey) &&
      result.scenarioPageSnapshotKey === createScenarioPageSnapshotKey(stepResults.scenarioPageDesign) &&
      result.interactionApiSnapshotKey === createInteractionApiSnapshotKey(stepResults.interactionApi)
  }
  return true
}

const selectWorkspace = async (key) => {
  const targetKey = key === 'factoryWorkbench' ? 'requirementInput' : key
  await hydrateRequiredMethodInputs(targetKey, { preferSaved: true })
  activeWorkspace.value = targetKey

  const resultKey = methodStepKeyMap[targetKey]
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: workspaceStepLabelMap[targetKey] || '原型工厂操作台总览',
    currentMethodStep: resultKey || projectContext.value.currentMethodStep,
  }

  activeMainTab.value = 'method'
}

const selectMethodStep = async (key) => {
  const step = methodWizardSteps.value.find((item) => item.key === key)
  if (!step?.canOpen) {
    return
  }

  await selectWorkspace(key)
}

const writeStepResult = (stepKey, result, options = {}) => {
  const normalizedResult = stepKey === 'requirement' ? normalizeRequirementResult(result) : result
  const nextResult = enrichStepResultWithSourceKeys(stepKey, normalizedResult)
  projectContext.value = {
    ...projectContext.value,
    stepResults: {
      ...(projectContext.value.stepResults || createEmptyStepResults()),
      [stepKey]: nextResult,
    },
  }

  if (options.persistMarkdown !== false) {
    return saveStepResultToMarkdown(stepKey, nextResult)
  }

  return Promise.resolve(null)
}

const saveStepResultToMarkdown = async (stepKey, result) => {
  if (!stepKey || !result) {
    return null
  }

  const definition = methodStepResultDefinitions[stepKey]
  try {
    const response = await fetch(`${API_BASE_URL}/method-files/${stepKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_key: stepKey,
        title: definition ? `${definition.step} ${definition.title}` : stepKey,
        result,
      }),
    })

    if (!response.ok) {
      throw new Error(`保存 Markdown 失败：${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.warn('Failed to save method step Markdown', error)
    return null
  }
}

const readStepResultFromMarkdown = async (stepKey) => {
  try {
    const response = await fetch(`${API_BASE_URL}/method-files/${stepKey}`)

    if (response.status === 404) {
      return null
    }

    if (!response.ok) {
      throw new Error(`读取 Markdown 失败：${response.status}`)
    }

    const payload = await response.json()
    const result = payload.result || null
    return result?.invalidated ? null : result
  } catch (error) {
    console.warn('Failed to read method step Markdown', error)
    return null
  }
}

const invalidateDownstreamStepResults = async (stepKey, reason) => {
  const downstreamKeys = downstreamStepMap[stepKey] || []
  if (!downstreamKeys.length) {
    return
  }

  const invalidatedResults = Object.fromEntries(
    downstreamKeys.map((key) => [key, createInvalidatedStepResult(key, stepKey, reason)])
  )

  projectContext.value = {
    ...projectContext.value,
    stepResults: {
      ...(projectContext.value.stepResults || createEmptyStepResults()),
      ...Object.fromEntries(downstreamKeys.map((key) => [key, null])),
    },
    selectedScenario: downstreamKeys.includes('scenarioPageDesign') ? null : projectContext.value.selectedScenario,
    scenarioPageDesignResult: downstreamKeys.includes('scenarioPageDesign') ? null : projectContext.value.scenarioPageDesignResult,
    selectedInteractionPage: downstreamKeys.includes('interactionApi') ? null : projectContext.value.selectedInteractionPage,
    selectedApiContract: downstreamKeys.includes('interactionApi') ? null : projectContext.value.selectedApiContract,
    interactionApiResult: downstreamKeys.includes('interactionApi') ? null : projectContext.value.interactionApiResult,
    selectedPrototypeSuggestion: downstreamKeys.includes('prototype') ? null : projectContext.value.selectedPrototypeSuggestion,
  }

  await Promise.all(downstreamKeys.map((key) => saveStepResultToMarkdown(key, invalidatedResults[key])))
}

const clearStepResultFromContext = (stepKey) => {
  projectContext.value = {
    ...projectContext.value,
    stepResults: {
      ...(projectContext.value.stepResults || createEmptyStepResults()),
      [stepKey]: null,
    },
    selectedScenario: stepKey === 'scenarioPageDesign' ? null : projectContext.value.selectedScenario,
    scenarioPageDesignResult: stepKey === 'scenarioPageDesign' ? null : projectContext.value.scenarioPageDesignResult,
    selectedInteractionPage: stepKey === 'interactionApi' ? null : projectContext.value.selectedInteractionPage,
    selectedApiContract: stepKey === 'interactionApi' ? null : projectContext.value.selectedApiContract,
    interactionApiResult: stepKey === 'interactionApi' ? null : projectContext.value.interactionApiResult,
    selectedPrototypeSuggestion: stepKey === 'prototype' ? null : projectContext.value.selectedPrototypeSuggestion,
  }
}

const hydrateRequiredMethodInputs = async (targetWorkspaceKey, options = {}) => {
  const targetIndex = methodStepDefinitions.findIndex((item) => item.key === targetWorkspaceKey)

  if (targetIndex < 0) {
    return
  }

  const existingResults = projectContext.value.stepResults || createEmptyStepResults()
  for (const definition of methodStepDefinitions.slice(0, targetIndex + 1)) {
    if (existingResults[definition.resultKey] && !options.preferSaved) {
      continue
    }

    const savedResult = await readStepResultFromMarkdown(definition.resultKey)
    if (savedResult && isStepResultCompatible(definition.resultKey, savedResult)) {
      applyStoredStepResult(definition.resultKey, savedResult)
    } else if (savedResult && !isStepResultCompatible(definition.resultKey, savedResult)) {
      clearStepResultFromContext(definition.resultKey)
    } else if (existingResults[definition.resultKey] && options.preferSaved) {
      clearStepResultFromContext(definition.resultKey)
    }
  }
}

const applyStoredStepResult = (stepKey, result) => {
  const storedResult = stepKey === 'requirement' ? normalizeRequirementResult(result) : result
  writeStepResult(stepKey, storedResult, { persistMarkdown: false })

  const nextContext = {
    ...projectContext.value,
    contextStatus: '已从本地 Markdown 读取步骤结果',
  }

  if (stepKey === 'requirement') {
    nextContext.projectName = storedResult.projectName || nextContext.projectName
    nextContext.customerName = storedResult.customerName || nextContext.customerName
    nextContext.projectStage = storedResult.projectStage || nextContext.projectStage
    nextContext.sourceRequirement = Object.prototype.hasOwnProperty.call(storedResult, 'sourceRequirement') ? storedResult.sourceRequirement : nextContext.sourceRequirement
    nextContext.manualRequirement = Object.prototype.hasOwnProperty.call(storedResult, 'manualRequirement') ? storedResult.manualRequirement : nextContext.manualRequirement
    nextContext.attachmentText = Object.prototype.hasOwnProperty.call(storedResult, 'attachmentText') ? storedResult.attachmentText : nextContext.attachmentText
    nextContext.requirementAttachments = storedResult.attachments || nextContext.requirementAttachments
    nextContext.requirementAnalysis = storedResult.analysis || storedResult
  }

  if (stepKey === 'scenarioPageDesign') {
    nextContext.selectedScenario = storedResult.scenarios?.[0] || storedResult
    nextContext.scenarioPageDesignResult = storedResult
  }

  if (stepKey === 'interactionApi') {
    nextContext.selectedInteractionPage = storedResult.page || storedResult
    nextContext.selectedApiContract = storedResult.apiContract || storedResult
    nextContext.interactionApiResult = storedResult
  }

  if (stepKey === 'prototype') {
    nextContext.selectedPrototypeSuggestion = storedResult.suggestion || storedResult
  }

  projectContext.value = nextContext
}

const applyStepResultToContext = (stepKey, result) => {
  const normalizedResult = stepKey === 'requirement' ? normalizeRequirementResult(result) : result
  const nextResult = enrichStepResultWithSourceKeys(stepKey, normalizedResult)
  const nextContext = {
    ...projectContext.value,
    contextStatus: '已保存大模型修改结果',
    stepResults: {
      ...(projectContext.value.stepResults || createEmptyStepResults()),
      [stepKey]: nextResult,
    },
  }

  if (stepKey === 'requirement') {
    nextContext.sourceRequirement = Object.prototype.hasOwnProperty.call(nextResult, 'sourceRequirement') ? nextResult.sourceRequirement : nextContext.sourceRequirement
    nextContext.manualRequirement = Object.prototype.hasOwnProperty.call(nextResult, 'manualRequirement') ? nextResult.manualRequirement : nextContext.manualRequirement
    nextContext.attachmentText = Object.prototype.hasOwnProperty.call(nextResult, 'attachmentText') ? nextResult.attachmentText : nextContext.attachmentText
    nextContext.requirementAttachments = nextResult.attachments || nextContext.requirementAttachments
    nextContext.requirementAnalysis = nextResult.analysis || nextResult
    nextContext.summary = '需求拆解结果已由大模型修改并保存到本地版本。'
  }

  if (stepKey === 'scenarioPageDesign') {
    nextContext.selectedScenario = nextResult.scenarios?.[0] || nextResult
    nextContext.scenarioPageDesignResult = nextResult
    nextContext.summary = `场景→页面设计结果已由大模型修改并保存：${nextResult.scenarios?.length || 0} 个场景。`
  }

  if (stepKey === 'interactionApi') {
    nextContext.selectedInteractionPage = nextResult.page || nextResult
    nextContext.selectedApiContract = nextResult.apiContract || nextResult
    nextContext.interactionApiResult = nextResult
    nextContext.summary = `交互与API设计结果已由大模型修改并保存：${nextContext.selectedInteractionPage?.name || '未命名页面'}。`
  }

  if (stepKey === 'prototype') {
    nextContext.selectedPrototypeSuggestion = nextResult.suggestion || nextResult
    nextContext.summary = '前端原型方案已由大模型修改并保存到本地版本。'
  }

  projectContext.value = nextContext
  saveStepResultToMarkdown(stepKey, nextResult)
}

const handleStepRevisionApplied = ({ stepKey, revisedOutput, revisionInstruction }) => {
  const result = {
    ...revisedOutput,
    llmRevision: {
      instruction: revisionInstruction,
      revisedAt: new Date().toISOString(),
    },
  }

  applyStepResultToContext(stepKey, result)
}

const handleRuntimeUpdate = ({ executionMode, llmProvider, llmConfigured, llmModel, llmBaseUrl }) => {
  const isLocalRule = executionMode === 'local'
  const nextProvider = isLocalRule ? 'none' : llmProvider
  updateDeepSeekConfigStatus({
    configured: typeof llmConfigured === 'boolean' ? llmConfigured : deepSeekConfigStatus.value.configured,
    model: llmModel,
    baseUrl: llmBaseUrl,
  })

  projectContext.value = {
    ...projectContext.value,
    executionMode,
    llmProvider: nextProvider,
    llmConfigured: deepSeekConfigStatus.value.configured,
    llmModel: llmModel || projectContext.value.llmModel,
    llmBaseUrl: llmBaseUrl || projectContext.value.llmBaseUrl,
    contextStatus: isLocalRule ? '本地规则生成' : nextProvider === 'deepseek' ? 'DeepSeek 服务已选择' : '大模型生成配置已选择',
    summary: isLocalRule
      ? '当前使用本地规则生成需求拆解草案，确认后进入下一步。'
      : '当前已切换为大模型生成；DeepSeek 配置保存后，第 01 步会通过后端调用真实服务。',
  }
}

const getWorkspaceForLastSavedStep = (stepResults) => {
  const savedDefinitions = methodStepDefinitions.filter((item) => Boolean(stepResults[item.resultKey]))
  if (!savedDefinitions.length) {
    return 'requirementInput'
  }

  const lastDefinition = savedDefinitions[savedDefinitions.length - 1]
  const lastIndex = methodStepDefinitions.findIndex((item) => item.resultKey === lastDefinition.resultKey)
  return methodStepDefinitions[Math.min(lastIndex + 1, methodStepDefinitions.length - 1)]?.key || lastDefinition.key
}

const restoreMarkdownSession = async () => {
  isRestoringLocalSession.value = true
  projectContext.value = mergeDeepSeekConfigStatus({
    ...createDefaultProjectContext(),
    contextStatus: '正在读取本地 Markdown 版本',
  })

  const loadedResults = createEmptyStepResults()
  for (const definition of methodStepDefinitions) {
    const result = await readStepResultFromMarkdown(definition.resultKey)
    if (result && isStepResultCompatible(definition.resultKey, result)) {
      loadedResults[definition.resultKey] = result
      applyStoredStepResult(definition.resultKey, result)
    } else if (result) {
      clearStepResultFromContext(definition.resultKey)
    }
  }

  activeWorkspace.value = getWorkspaceForLastSavedStep(loadedResults)
  activeMainTab.value = 'method'
  projectContext.value = mergeDeepSeekConfigStatus({
    ...projectContext.value,
    contextStatus: '已接续本地 Markdown 版本',
    summary: '已从项目本地 Markdown 文件读取此前保存的步骤结果。',
  })
  isRestoringLocalSession.value = false
  await refreshSavedSessionSummary()
}

const restoreLocalSession = async () => {
  const markdownSummary = await readMarkdownSessionSummary()
  if (markdownSummary) {
    await restoreMarkdownSession()
    return
  }

  const snapshot = readLocalSessionSnapshot()
  const summary = buildSavedSessionSummary(snapshot)

  if (!summary) {
    await refreshSavedSessionSummary()
    return
  }

  isRestoringLocalSession.value = true
  projectContext.value = mergeDeepSeekConfigStatus({
    ...createDefaultProjectContext(),
    ...summary.projectContext,
    stepResults: {
      ...createEmptyStepResults(),
      ...(summary.projectContext.stepResults || {}),
    },
    contextStatus: '已恢复浏览器本地版本',
  })
  activeWorkspace.value = summary.activeWorkspace
  activeMainTab.value = summary.activeMainTab
  isRestoringLocalSession.value = false
}

const resetMethodWorkflow = () => {
  hydrateProjectContext()
  selectWorkspace('requirementInput')
}

const startNewMethodWorkflow = () => {
  localStorage.removeItem(LOCAL_SESSION_KEY)
  savedSessionSummary.value = null
  hydrateProjectContext()
  selectWorkspace('requirementInput')
}

const hydrateProjectContext = () => {
  projectContext.value = mergeDeepSeekConfigStatus({
    ...createDefaultProjectContext(),
    customerName: '华东海工制造客户',
    projectStage: '客户需求调研阶段',
    summary: '客户希望通过前台原型先验证项目进度、现场调度、物料到货和异常闭环，再逐步接入 FastAPI 与 DeepSeek。',
    sourceRequirement: '',
    requirementAnalysis: null,
  })
}


const handleProjectContextUpdate = (nextContext) => {
  projectContext.value = {
    ...projectContext.value,
    projectName: nextContext.projectName,
    customerName: nextContext.customerName,
    projectStage: nextContext.projectStage,
  }
}

const handleRequirementAnalysisComplete = async ({ projectName = '', customerName = '', projectStage = '', sourceRequirement, manualRequirement = '', attachmentText = '', attachments = [], analysis }) => {
  const savePromise = writeStepResult('requirement', { projectName, customerName, projectStage, sourceRequirement, manualRequirement, attachmentText, attachments, analysis })
  projectContext.value = {
    ...projectContext.value,
    projectName: projectName || projectContext.value.projectName,
    customerName: customerName || projectContext.value.customerName,
    projectStage: projectStage || '需求拆解已确认',
    currentStepLabel: '客户需求输入',
    contextStatus: '已写入需求拆解结果',
    sourceRequirement,
    manualRequirement,
    attachmentText,
    requirementAttachments: attachments,
    requirementAnalysis: analysis,
    summary: '需求拆解结果已确认并进入统一项目上下文，下一步可以继续传给场景识别。',
  }

  await savePromise
  await invalidateDownstreamStepResults(
    'requirement',
    '需求拆解已重新确认，下游场景、交互/API 和前端原型方案需要重新生成。'
  )
  await selectWorkspace('scenarioPageDesign')
}

const handleRequirementAnalysisDraftUpdate = (result) => {
  if (result?.invalidated) {
    saveStepResultToMarkdown('requirement', result)
    projectContext.value = {
      ...projectContext.value,
      currentStepLabel: '客户需求输入',
      contextStatus: '需求拆解正在重新生成',
      stepResults: {
        ...(projectContext.value.stepResults || createEmptyStepResults()),
        requirement: null,
      },
      sourceRequirement: result.sourceRequirement || '',
      manualRequirement: result.manualRequirement || '',
      attachmentText: result.attachmentText || '',
      requirementAttachments: result.attachments || [],
      requirementAnalysis: null,
      summary: result.reason || '正在重新生成需求拆解草案，旧 requirement.md 已失效。',
    }
    invalidateDownstreamStepResults(
      'requirement',
      '需求拆解正在重新生成，下游场景、交互/API 和前端原型方案需要重新生成。'
    )
    return
  }

  writeStepResult('requirement', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '客户需求输入',
    contextStatus: '已覆盖保存需求拆解草稿到本地 Markdown',
    sourceRequirement: result.sourceRequirement,
    manualRequirement: result.manualRequirement,
    attachmentText: result.attachmentText,
    requirementAttachments: result.attachments,
    requirementAnalysis: result.analysis,
    summary: '需求拆解草稿已覆盖保存，requirement.md 保持唯一最新版本。',
  }
  invalidateDownstreamStepResults(
    'requirement',
    '需求拆解草稿已更新，下游场景、交互/API 和前端原型方案需要重新生成。'
  )
}

const handleScenarioPageConfirm = async (result) => {
  const savePromise = writeStepResult('scenarioPageDesign', result)
  projectContext.value = {
    ...projectContext.value,
    projectStage: '场景→页面设计已确认',
    currentStepLabel: '场景→页面设计',
    contextStatus: '已写入场景→页面设计结果',
    selectedScenario: result.scenarios?.[0] || null,
    scenarioPageDesignResult: result,
    summary: `已确认 ${result.scenarios?.length || 0} 个场景的方案，下一步进入交互与API设计。`,
  }
  await savePromise
  await invalidateDownstreamStepResults(
    'scenarioPageDesign',
    '场景与页面设计已重新确认，下游交互/API 和前端原型方案需要重新生成。'
  )
  await selectWorkspace('interactionApi')
}

const handleScenarioPageDraftUpdate = (result) => {
  writeStepResult('scenarioPageDesign', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '场景→页面设计',
    contextStatus: '已覆盖保存场景→页面设计草稿',
    scenarioPageDesignResult: result,
    summary: `已覆盖保存 ${result.scenarios?.length || 0} 个场景的方案到本地 scenarioPageDesign.md。`,
  }
  invalidateDownstreamStepResults(
    'scenarioPageDesign',
    '场景与页面设计草稿已更新，下游交互/API 和前端原型方案需要重新生成。'
  )
}

const handleInteractionApiConfirm = async ({ page, apiContract, design }) => {
  const result = design || { pages: page ? [page] : [], selectedPage: page, selectedApiContract: apiContract }
  const savePromise = writeStepResult('interactionApi', result)
  projectContext.value = {
    ...projectContext.value,
    projectStage: '交互与API设计已确认',
    currentStepLabel: '交互与API设计',
    contextStatus: '已写入交互与API结果',
    selectedInteractionPage: page,
    selectedApiContract: apiContract,
    interactionApiResult: result,
    summary: `已确认「${page?.name || '未命名页面'}」的交互设计与 API 契约，下一步进入前端原型建议。`,
  }

  await savePromise
  await invalidateDownstreamStepResults(
    'interactionApi',
    '交互与 API 设计已重新确认，前端原型方案需要重新生成。'
  )
  await selectWorkspace('frontendSuggestion')
}

const handleInteractionApiDraftUpdate = (result) => {
  writeStepResult('interactionApi', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '交互与API设计',
    contextStatus: '已覆盖保存交互与API草稿',
    selectedInteractionPage: result.selectedPage,
    selectedApiContract: result.selectedApiContract,
    interactionApiResult: result,
    summary: `已覆盖保存「${result.selectedPage?.name || '未命名页面'}」的交互与 API 设计草稿到本地 interactionApi.md。`,
  }
  invalidateDownstreamStepResults(
    'interactionApi',
    '交互与 API 设计草稿已更新，前端原型方案需要重新生成。'
  )
}

const handlePrototypeDraftUpdate = (result) => {
  writeStepResult('prototype', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '前端原型建议',
    contextStatus: '已覆盖保存前端原型草案',
    summary: `前端原型方案已更新：${result?.pageDetailSpecs?.length || 0} 个页面规格、${result?.pageApiMapping?.length || 0} 个 API 映射、${result?.navigationRoutes?.length || 0} 个导航分组。`,
  }
}

const workspaceStepLabelMap = {
  factoryWorkbench: '客户需求输入',
  requirementInput: '客户需求输入',
  scenarioPageDesign: '场景→页面设计',
  interactionApi: '交互与API设计',
  frontendSuggestion: '前端原型建议',
  prototypeWorkflow: '原型生成流程总览',
  requirementSummary: '客户需求分析',
}
</script>
