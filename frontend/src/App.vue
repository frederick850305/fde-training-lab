<template>
  <main class="app-shell">
    <AppHeader />


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
          v-else-if="activeMethodStepKey === 'frontendSuggestion'"
          :project-context="projectContext"
          @suggestion-confirm="handleSuggestionConfirm"
          @prototype-draft-update="handlePrototypeDraftUpdate"
        />
        <PrototypeGenerateView
          v-else
          :project-context="projectContext"
          @prototype-generated="handlePrototypeGenerated"
          @prototype-draft-update="handlePrototypeGenerateDraftUpdate"
        />
      </FactoryWorkbenchView>
    </template>

    <PrototypeCenterView
      v-else-if="activeMainTab === 'prototypeCenter'"
      :project-context="projectContext"
    />

    <section v-else-if="activeMainTab === 'progress'" class="section-block progress-panel" aria-labelledby="progress-title">
      <div class="section-heading">
        <p class="eyebrow">Training Progress</p>
        <h2 id="progress-title">第二阶段练习进展</h2>
      </div>
      <ul class="progress-list">
        <li v-for="item in progressItems" :key="item.name">
          <span class="progress-status" :class="item.statusClass">{{ item.status }}</span>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </section>

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
import PrototypeGenerateView from './views/PrototypeGenerateView.vue'
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
  prototypeGenerate: null,
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
  {
    key: 'prototypeGenerate',
    resultKey: 'prototypeGenerate',
    step: '05',
    title: '生成原型',
    input: '前端原型方案',
    output: 'Vue3 原型项目文件和目录结构',
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
  projectContext.value = {
    ...projectContext.value,
    stepResults: {
      ...(projectContext.value.stepResults || createEmptyStepResults()),
      [stepKey]: result,
    },
  }

  if (options.persistMarkdown !== false) {
    return saveStepResultToMarkdown(stepKey, result)
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
    return payload.result || null
  } catch (error) {
    console.warn('Failed to read method step Markdown', error)
    return null
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
    if (savedResult) {
      applyStoredStepResult(definition.resultKey, savedResult)
    }
  }
}

const applyStoredStepResult = (stepKey, result) => {
  writeStepResult(stepKey, result, { persistMarkdown: false })

  const nextContext = {
    ...projectContext.value,
    contextStatus: '已从本地 Markdown 读取步骤结果',
  }

  if (stepKey === 'requirement') {
    nextContext.projectName = result.projectName || nextContext.projectName
    nextContext.customerName = result.customerName || nextContext.customerName
    nextContext.projectStage = result.projectStage || nextContext.projectStage
    nextContext.sourceRequirement = result.sourceRequirement || nextContext.sourceRequirement
    nextContext.manualRequirement = result.manualRequirement || nextContext.manualRequirement
    nextContext.attachmentText = result.attachmentText || nextContext.attachmentText
    nextContext.requirementAttachments = result.attachments || nextContext.requirementAttachments
    nextContext.requirementAnalysis = result.analysis || result
  }

  if (stepKey === 'scenarioPageDesign') {
    nextContext.selectedScenario = result.scenarios?.[0] || result
    nextContext.scenarioPageDesignResult = result
  }

  if (stepKey === 'interactionApi') {
    nextContext.selectedInteractionPage = result.page || result
    nextContext.selectedApiContract = result.apiContract || result
    nextContext.interactionApiResult = result
  }

  if (stepKey === 'prototype') {
    nextContext.selectedPrototypeSuggestion = result.suggestion || result
  }

  if (stepKey === 'prototypeGenerate') {
    nextContext.prototypeGenerateResult = result
  }

  projectContext.value = nextContext
}

const applyStepResultToContext = (stepKey, result) => {
  const nextContext = {
    ...projectContext.value,
    contextStatus: '已保存大模型修改结果',
    stepResults: {
      ...(projectContext.value.stepResults || createEmptyStepResults()),
      [stepKey]: result,
    },
  }

  if (stepKey === 'requirement') {
    nextContext.sourceRequirement = result.sourceRequirement || nextContext.sourceRequirement
    nextContext.manualRequirement = result.manualRequirement || nextContext.manualRequirement
    nextContext.attachmentText = result.attachmentText || nextContext.attachmentText
    nextContext.requirementAttachments = result.attachments || nextContext.requirementAttachments
    nextContext.requirementAnalysis = result.analysis || result
    nextContext.summary = '需求拆解结果已由大模型修改并保存到本地版本。'
  }

  if (stepKey === 'scenarioPageDesign') {
    nextContext.selectedScenario = result.scenarios?.[0] || result
    nextContext.scenarioPageDesignResult = result
    nextContext.summary = `场景→页面设计结果已由大模型修改并保存：${result.scenarios?.length || 0} 个场景。`
  }

  if (stepKey === 'interactionApi') {
    nextContext.selectedInteractionPage = result.page || result
    nextContext.selectedApiContract = result.apiContract || result
    nextContext.interactionApiResult = result
    nextContext.summary = `交互与API设计结果已由大模型修改并保存：${nextContext.selectedInteractionPage?.name || '未命名页面'}。`
  }

  if (stepKey === 'prototype') {
    nextContext.selectedPrototypeSuggestion = result.suggestion || result
    nextContext.summary = '前端原型方案已由大模型修改并保存到本地版本。'
  }

  if (stepKey === 'prototypeGenerate') {
    nextContext.prototypeGenerateResult = result
    nextContext.summary = `原型生成结果已保存：${result?.generatedFiles?.length || 0} 个文件。`
  }

  projectContext.value = nextContext
  saveStepResultToMarkdown(stepKey, result)
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
    if (result) {
      loadedResults[definition.resultKey] = result
      applyStoredStepResult(definition.resultKey, result)
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
  await selectWorkspace('scenarioPageDesign')
}

const handleRequirementAnalysisDraftUpdate = (result) => {
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

const handleSuggestionConfirm = async ({ suggestion } = {}) => {
  const payload = suggestion || { confirmed: true }
  projectContext.value = {
    ...projectContext.value,
    projectStage: '正在保存前端原型方案...',
    currentStepLabel: '前端原型建议',
    contextStatus: '保存中',
    summary: '正在将前端原型方案写入本地 prototyp.md...',
  }

  try {
    await writeStepResult('prototype', payload)
    projectContext.value = {
      ...projectContext.value,
      projectStage: '前端原型方案已确认',
      currentStepLabel: '前端原型建议',
      contextStatus: '原型已保存',
      summary: '✅ 前端原型方案已保存到本地 prototype.md。方法链路已闭环。',
      selectedPrototypeSuggestion: payload,
    }
  } catch (err) {
    projectContext.value = {
      ...projectContext.value,
      projectStage: '前端原型方案保存失败',
      currentStepLabel: '前端原型建议',
      contextStatus: '保存失败',
      summary: '❌ 保存失败：' + ((err && err.message) || '未知错误，请确认 FastAPI 后端是否已启动（bash scripts/start_api.sh）。'),
    }
    return
  }

  activeMainTab.value = 'method'
  await selectWorkspace('prototypeGenerate')
}

const handlePrototypeGenerateDraftUpdate = (result) => {
  writeStepResult('prototypeGenerate', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '生成原型',
    contextStatus: '已覆盖保存原型生成草稿',
    summary: `原型生成草稿已更新：${result?.generatedFiles?.length || 0} 个文件。`,
  }
}

const handlePrototypeGenerated = async (result) => {
  const payload = result || { confirmed: true }
  projectContext.value = {
    ...projectContext.value,
    projectStage: '正在保存原型生成结果...',
    currentStepLabel: '生成原型',
    contextStatus: '保存中',
    summary: '正在将原型生成结果写入本地...',
  }

  try {
    await writeStepResult('prototypeGenerate', payload)
    projectContext.value = {
      ...projectContext.value,
      projectStage: '原型已生成',
      currentStepLabel: '生成原型',
      contextStatus: '原型已生成',
      summary: '✅ 原型项目已生成，已进入原型中心。',
      prototypeGenerateResult: payload,
    }
    activeMainTab.value = 'prototypeCenter'
  } catch (err) {
    projectContext.value = {
      ...projectContext.value,
      projectStage: '原型生成保存失败',
      currentStepLabel: '生成原型',
      contextStatus: '保存失败',
      summary: '❌ 保存失败：' + ((err && err.message) || '请确认 FastAPI 后端已启动。'),
    }
  }
}

const workspaceStepLabelMap = {
  factoryWorkbench: '客户需求输入',
  requirementInput: '客户需求输入',
  scenarioPageDesign: '场景→页面设计',
  interactionApi: '交互与API设计',
  frontendSuggestion: '前端原型建议',
  prototypeGenerate: '生成原型',
  prototypeWorkflow: '原型生成流程总览',
  requirementSummary: '客户需求分析',
}

const progressItems = [
  { name: '2-1 到 2-7：原型设计方法资产', status: '完成', statusClass: 'done' },
  { name: '2-8：Vue3 项目初始化', status: '完成', statusClass: 'done' },
  { name: '2-9：工作台首页生成', status: '完成', statusClass: 'done' },
  { name: '2-10：客户需求分析页生成', status: '完成', statusClass: 'done' },
  { name: '2-11：Vue3 组件拆分', status: '完成', statusClass: 'done' },
  { name: '2-12：原型生成流程设计', status: '完成', statusClass: 'done' },
  { name: '2-13：需求输入工作台', status: '完成', statusClass: 'done' },
  { name: '2-14：需求拆解结果生成', status: '完成', statusClass: 'done' },
  { name: '2-15：工作台页面切换与状态修正', status: '完成', statusClass: 'done' },
  { name: '2-16：场景识别工作台', status: '完成', statusClass: 'done' },
  { name: '2-17：功能模块设计工作台', status: '完成', statusClass: 'done' },
  { name: '2-18：页面清单设计工作台', status: '完成', statusClass: 'done' },
  { name: '2-19：页面字段与交互设计工作台', status: '完成', statusClass: 'done' },
  { name: '2-20：API 契约设计工作台', status: '完成', statusClass: 'done' },
  { name: '2-21：前端原型建议工作台', status: '完成', statusClass: 'done' },
  { name: '2-22：原型测试数据与通用组件准备', status: '完成', statusClass: 'done' },
  { name: '2-23：项目总览原型页', status: '完成', statusClass: 'done' },
  { name: '2-24：计划任务跟踪原型页', status: '完成', statusClass: 'done' },
  { name: '2-25：异常问题闭环原型页', status: '完成', statusClass: 'done' },
  { name: '2-26：现场调度看板原型页', status: '完成', statusClass: 'done' },
  { name: '2-27：物料到货跟踪原型页', status: '完成', statusClass: 'done' },
  { name: '2-28：原型页面统一导航优化', status: '完成', statusClass: 'done' },
  { name: '2-29：工作台一级 Tab 结构重组', status: '完成', statusClass: 'done' },
  { name: '2-30：原型工厂操作台总览', status: '完成', statusClass: 'done' },
  { name: '2-31：项目上下文流转打通', status: '完成', statusClass: 'done' },
  { name: '2-32：需求结果写回并传递到场景识别', status: '完成', statusClass: 'done' },
  { name: '2-33：场景结果写回并传递到功能设计', status: '完成', statusClass: 'done' },
  { name: '2-34：步骤连续 Next 导航与上下文贯通', status: '完成', statusClass: 'done' },
  { name: '2-35：方法链路闭环到原型流程总览', status: '完成', statusClass: 'done' },
  { name: '2-36：业务原型系统动态集成', status: '完成', statusClass: 'done' },
  { name: '2-37：功能模块设计动态集成', status: '完成', statusClass: 'done' },
  { name: '2-38：API 契约动态路径推荐', status: '完成', statusClass: 'done' },
  { name: '2-39：FDE 自助式单页向导方法', status: '完成', statusClass: 'done' },
  { name: '2-40：需求输入正式化与问题回复流转', status: '完成', statusClass: 'done' },
  { name: '2-42：本地版本保存与接续', status: '完成', statusClass: 'done' },
  { name: '2-43：方法链路闭环后自动跳转原型系统', status: '完成', statusClass: 'done' },
  { name: '2-44：生成 P0 核心页面 DispatchMapView', status: '完成', statusClass: 'done' },
  { name: '2-45：独立原型系统架构与打包发布', status: '完成', statusClass: 'done' },
  { name: '2-46：生成 P0 页面 TaskListView', status: '完成', statusClass: 'done' },
  { name: '2-47：生成 P1 页面 OnsiteVehicleFilter', status: '完成', statusClass: 'done' },
  { name: '2-48：生成 P1 页面 OnsiteDispatchDialog', status: '完成', statusClass: 'done' },
  { name: '2-49：生成 P1 页面 OnsiteExceptionAlert', status: '完成', statusClass: 'done' },
  { name: '2-50：生成 P1 页面 EntryCheckPanel', status: '完成', statusClass: 'done' },
  { name: '2-51：补齐遗漏的 8 个 P1 页面', status: '当前', statusClass: 'active' },
  { name: '2-52：交互与API一体化设计合并（Phase 1）', status: '完成', statusClass: 'done' },
  { name: '2-53：场景→页面一体化工作台（Phase 2）', status: '当前', statusClass: 'active' },
]
</script>
