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
        <ScenarioIdentificationView
          v-else-if="activeMethodStepKey === 'scenarioIdentification'"
          :project-context="projectContext"
          @scenario-confirm="handleScenarioConfirm"
          @scenario-draft-update="handleScenarioDraftUpdate"
        />
        <FeatureDesignView
          v-else-if="activeMethodStepKey === 'featureDesign'"
          :project-context="projectContext"
          @feature-draft-update="handleFeatureDraftUpdate"
          @feature-confirm="handleFeatureConfirm"
        />
        <PageDesignView
          v-else-if="activeMethodStepKey === 'pageDesign'"
          :project-context="projectContext"
          @page-design-draft-update="handlePageDesignDraftUpdate"
          @page-design-confirm="handlePageDesignConfirm"
        />
        <PageInteractionView
          v-else-if="activeMethodStepKey === 'pageInteraction'"
          :project-context="projectContext"
          @interaction-draft-update="handleInteractionDraftUpdate"
          @interaction-confirm="handleInteractionConfirm"
        />
        <ApiContractView
          v-else-if="activeMethodStepKey === 'apiContract'"
          :project-context="projectContext"
          @api-contract-draft-update="handleApiContractDraftUpdate"
          @api-contract-confirm="handleApiContractConfirm"
        />
        <FrontendPrototypeSuggestionView
          v-else
          :project-context="projectContext"
          @suggestion-confirm="handleSuggestionConfirm"
        />
      </FactoryWorkbenchView>
    </template>

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
      <PrototypeNav
        :items="activePrototypeNavItems"
        :active-key="activeWorkspace"
        @select="selectWorkspace"
      />

      <ProjectOverviewView v-if="activeWorkspace === 'projectOverview'" :project-context="projectContext" />
      <ScheduleTrackingView v-else-if="activeWorkspace === 'scheduleTracking'" :project-context="projectContext" />
      <IssueTrackingView v-else-if="activeWorkspace === 'issueTracking'" :project-context="projectContext" />
      <OnsiteDispatchView v-else-if="activeWorkspace === 'onsiteDispatch'" :project-context="projectContext" />
      <MaterialTrackingView v-else :project-context="projectContext" />
    </template>
  </main>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ApiContractView from './views/ApiContractView.vue'
import FeatureDesignView from './views/FeatureDesignView.vue'
import FactoryWorkbenchView from './views/FactoryWorkbenchView.vue'
import FrontendPrototypeSuggestionView from './views/FrontendPrototypeSuggestionView.vue'
import IssueTrackingView from './views/IssueTrackingView.vue'
import MaterialTrackingView from './views/MaterialTrackingView.vue'
import OnsiteDispatchView from './views/OnsiteDispatchView.vue'
import PageDesignView from './views/PageDesignView.vue'
import PageInteractionView from './views/PageInteractionView.vue'
import ProjectOverviewView from './views/ProjectOverviewView.vue'
import PrototypeNav from './components/PrototypeNav.vue'
import RequirementInputView from './views/RequirementInputView.vue'
import ScheduleTrackingView from './views/ScheduleTrackingView.vue'
import ScenarioIdentificationView from './views/ScenarioIdentificationView.vue'

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
  scenario: null,
  feature: null,
  page: null,
  interaction: null,
  api: null,
  prototype: null,
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

const prototypeNavItems = [
  { key: 'projectOverview', label: '项目总览', stage: 'P0' },
  { key: 'scheduleTracking', label: '计划任务', stage: 'P0' },
  { key: 'issueTracking', label: '异常闭环', stage: 'P0' },
  { key: 'onsiteDispatch', label: '现场调度', stage: 'P0' },
  { key: 'materialTracking', label: '物料到货', stage: 'P0' },
]

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
    key: 'scenarioIdentification',
    resultKey: 'scenario',
    step: '02',
    title: '场景识别',
    input: '需求拆解结果',
    output: '业务场景、任务流程和页面映射',
  },
  {
    key: 'featureDesign',
    resultKey: 'feature',
    step: '03',
    title: '功能设计',
    input: '场景与角色任务',
    output: '功能模块、功能点、优先级和 API 方向',
  },
  {
    key: 'pageDesign',
    resultKey: 'page',
    step: '04',
    title: '页面设计',
    input: '功能模块',
    output: '页面清单、导航结构和文件建议',
  },
  {
    key: 'pageInteraction',
    resultKey: 'interaction',
    step: '05',
    title: '交互设计',
    input: '页面清单',
    output: '字段、按钮、校验和状态',
  },
  {
    key: 'apiContract',
    resultKey: 'api',
    step: '06',
    title: 'API 契约',
    input: '页面交互',
    output: '接口路径、参数、响应和错误码',
  },
  {
    key: 'frontendSuggestion',
    resultKey: 'prototype',
    step: '07',
    title: '前端原型方案',
    input: '页面、交互和 API 契约',
    output: '页面、组件、测试数据、API 和 Prompt 建议',
  },
]

const methodStepKeyMap = Object.fromEntries(methodStepDefinitions.map((item) => [item.key, item.resultKey]))
const methodStepResultDefinitions = Object.fromEntries(methodStepDefinitions.map((item) => [item.resultKey, item]))


const activePrototypeNavItems = computed(() => {
  const selectedModuleKey = projectContext.value.selectedFeatureModule?.key

  if (!selectedModuleKey) {
    return prototypeNavItems
  }

  // 排序：将选中的模块对应页面排在“项目总览”之后，或者直接作为重点
  const items = [...prototypeNavItems]
  const moduleIndex = items.findIndex((item) => item.key === selectedModuleKey)

  if (moduleIndex > -1) {
    const [target] = items.splice(moduleIndex, 1)
    // 始终让项目总览在第一位，选中的在第二位
    items.splice(1, 0, { ...target, label: `✨ ${target.label}` })
  }

  return items
})

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

  if (prototypeNavItems.some((item) => item.key === targetKey)) {
    activeMainTab.value = 'prototypeSystem'
    return
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
    nextContext.sourceRequirement = result.sourceRequirement || nextContext.sourceRequirement
    nextContext.manualRequirement = result.manualRequirement || nextContext.manualRequirement
    nextContext.attachmentText = result.attachmentText || nextContext.attachmentText
    nextContext.requirementAttachments = result.attachments || nextContext.requirementAttachments
    nextContext.requirementAnalysis = result.analysis || result
  }

  if (stepKey === 'scenario') {
    nextContext.selectedScenario = result.scenario || result
  }

  if (stepKey === 'feature') {
    nextContext.selectedFeatureModule = result.module || result.selectedFeatureModule || result.allMappings?.[0]?.modules?.[0]
    nextContext.allFeatureMappings = result.allMappings || nextContext.allFeatureMappings
    nextContext.revisedModulesByScenarioKey = result.revisedModulesByScenarioKey || nextContext.revisedModulesByScenarioKey
  }

  if (stepKey === 'page') {
    nextContext.selectedPageDesign = result.page || result.currentPage || result
    nextContext.selectedPageSections = result.currentPageSections || result.page?.sections || result.currentPage?.sections || []
    nextContext.selectedPageScenario = result.scenario || nextContext.selectedPageScenario
    nextContext.allPageDesigns = result.scenarioDesigns || nextContext.allPageDesigns
    nextContext.pageDesignResult = result
  }

  if (stepKey === 'interaction') {
    nextContext.selectedInteractionPage = result.page || result
  }

  if (stepKey === 'api') {
    nextContext.selectedApiContract = result.contract || result
  }

  if (stepKey === 'prototype') {
    nextContext.selectedPrototypeSuggestion = result.suggestion || result
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

  if (stepKey === 'scenario') {
    nextContext.selectedScenario = result.scenario || result
    nextContext.summary = `场景识别结果已由大模型修改并保存：${nextContext.selectedScenario?.name || '未命名场景'}。`
  }

  if (stepKey === 'feature') {
    nextContext.selectedFeatureModule = result.module || result.selectedFeatureModule || result.allMappings?.[0]?.modules?.[0]
    nextContext.allFeatureMappings = result.allMappings || nextContext.allFeatureMappings
    nextContext.revisedModulesByScenarioKey = result.revisedModulesByScenarioKey || nextContext.revisedModulesByScenarioKey
    nextContext.summary = `功能设计结果已由大模型修改并保存：${nextContext.selectedFeatureModule?.name || '未命名模块'}。`
  }

  if (stepKey === 'page') {
    nextContext.selectedPageDesign = result.page || result
    nextContext.summary = `页面设计结果已由大模型修改并保存：${nextContext.selectedPageDesign?.name || '未命名页面'}。`
  }

  if (stepKey === 'interaction') {
    nextContext.selectedInteractionPage = result.page || result
    nextContext.summary = `交互设计结果已由大模型修改并保存：${nextContext.selectedInteractionPage?.name || '未命名页面'}。`
  }

  if (stepKey === 'api') {
    nextContext.selectedApiContract = result.contract || result
    nextContext.summary = `API 契约结果已由大模型修改并保存：${nextContext.selectedApiContract?.name || '未命名接口'}。`
  }

  if (stepKey === 'prototype') {
    nextContext.selectedPrototypeSuggestion = result.suggestion || result
    nextContext.summary = '前端原型方案已由大模型修改并保存到本地版本。'
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

const handleRequirementAnalysisComplete = async ({ sourceRequirement, manualRequirement = '', attachmentText = '', attachments = [], analysis }) => {
  const savePromise = writeStepResult('requirement', { sourceRequirement, manualRequirement, attachmentText, attachments, analysis })
  projectContext.value = {
    ...projectContext.value,
    projectStage: '需求拆解已确认',
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
  await selectWorkspace('scenarioIdentification')
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

const handleScenarioConfirm = async ({ scenario }) => {
  const savePromise = writeStepResult('scenario', scenario)
  projectContext.value = {
    ...projectContext.value,
    projectStage: '场景识别已确认',
    currentStepLabel: '场景识别',
    contextStatus: '已写入场景识别结果',
    selectedScenario: scenario,
    summary: `已确认场景：${scenario.name}，下一步进入功能设计。`,
  }

  await savePromise
  await selectWorkspace('featureDesign')
}

const handleScenarioDraftUpdate = (result) => {
  writeStepResult('scenario', result)
  const scenarioName = result.selectedScenario?.name || result.name || '场景识别草稿'
  projectContext.value = {
    ...projectContext.value,
    contextStatus: '已覆盖保存场景识别草稿到本地 Markdown',
    selectedScenario: result,
    summary: `已覆盖保存「${scenarioName}」到 prototype_factory/local_step_outputs/scenario.md，文件保持唯一最新版本。`,
  }
}

const handleFeatureConfirm = async (result) => {
  const savePromise = writeStepResult('feature', result)
  const selectedModule = result.module || result.allMappings?.find((mapping) => mapping.modules?.length)?.modules?.[0] || null
  projectContext.value = {
    ...projectContext.value,
    projectStage: '功能设计已确认',
    currentStepLabel: '功能设计',
    contextStatus: '正在保存功能模块结果',
    selectedFeatureModule: selectedModule,
    allFeatureMappings: result.allMappings,
    revisedModulesByScenarioKey: result.revisedModulesByScenarioKey,
    summary: `正在保存功能设计结果：${selectedModule?.name || '未命名模块'}，保存完成后进入页面设计。`,
  }

  await savePromise
  projectContext.value = {
    ...projectContext.value,
    contextStatus: '已写入功能模块结果',
    summary: `已确认功能模块：${selectedModule?.name || '未命名模块'}，同步保存全部场景映射结果，下一步进入页面设计。`,
  }
  await selectWorkspace('pageDesign')
}

const handleFeatureDraftUpdate = (result) => {
  writeStepResult('feature', result)
  projectContext.value = {
    ...projectContext.value,
    contextStatus: '已覆盖保存功能设计草稿到本地 Markdown',
    selectedFeatureModule: result.module,
    allFeatureMappings: result.allMappings,
    revisedModulesByScenarioKey: result.revisedModulesByScenarioKey,
    summary: `已覆盖保存当前功能设计结果：${result.module?.name || '已生成模块映射'}，feature.md 保持唯一最新版本。`,
  }
}

const applyPageDesignResult = (result, statusText = '已覆盖保存页面设计草稿到本地 Markdown') => {
  const savePromise = writeStepResult('page', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '页面设计',
    contextStatus: statusText,
    selectedPageDesign: result.page,
    selectedPageSections: result.currentPageSections || result.page?.sections || [],
    selectedPageScenario: result.scenario,
    allPageDesigns: result.scenarioDesigns,
    pageDesignResult: result,
    summary: `页面设计成果已保存，包含 ${Object.keys(result.scenarioDesigns || {}).length} 个场景的页面清单、导航结构、文件建议和页面区域。`,
  }

  return savePromise
}

const handlePageDesignDraftUpdate = (result) => {
  applyPageDesignResult(result)
}

const handlePageDesignConfirm = async (result) => {
  const savePromise = applyPageDesignResult(result, '已写入页面设计结果')
  projectContext.value = {
    ...projectContext.value,
    projectStage: '页面设计已确认',
    summary: `已确认页面：${result.page?.name || '未命名页面'}，下一步进入交互设计。`,
  }

  await savePromise
  await selectWorkspace('pageInteraction')
}

const handleInteractionConfirm = async ({ page, interactionDesign }) => {
  const result = interactionDesign || { pages: page ? [page] : [], selectedPage: page }
  const savePromise = writeStepResult('interaction', result)
  projectContext.value = {
    ...projectContext.value,
    projectStage: '交互设计已确认',
    currentStepLabel: '交互设计',
    contextStatus: '已写入交互设计结果',
    selectedInteractionPage: page,
    interactionDesignResult: result,
    summary: `已确认 ${result.pages?.length || 1} 个页面的交互设计，下一步进入 API 契约设计。`,
  }

  await savePromise
  await selectWorkspace('apiContract')
}

const handleInteractionDraftUpdate = (result) => {
  writeStepResult('interaction', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: '交互设计',
    contextStatus: '已覆盖保存当前页面交互设计草稿',
    selectedInteractionPage: result.selectedPage,
    interactionDesignResult: result,
    summary: `已覆盖保存 ${result.pages?.length || 1} 个页面的交互设计草稿到本地 interaction.md，文件保持唯一最新版本。`,
  }
}

const handleApiContractDraftUpdate = (result) => {
  const selectedContract = result?.selectedContract || result?.contracts?.[0] || null
  writeStepResult('api', result)
  projectContext.value = {
    ...projectContext.value,
    currentStepLabel: 'API 契约设计',
    contextStatus: '已覆盖保存 API 契约草稿',
    selectedApiContract: selectedContract,
    apiContractResult: result,
    summary: `已生成并保存 ${result?.contracts?.length || 0} 个接口契约到本地 api.md。`,
  }
}

const handleApiContractConfirm = async ({ contract, apiContractDesign }) => {
  const result = apiContractDesign || { contracts: contract ? [contract] : [], selectedContract: contract }
  const savePromise = writeStepResult('api', result)
  projectContext.value = {
    ...projectContext.value,
    projectStage: 'API 契约已确认',
    currentStepLabel: 'API 契约设计',
    contextStatus: '已写入 API 契约结果',
    selectedApiContract: contract,
    apiContractResult: result,
    summary: `已确认 ${result.contracts?.length || 1} 个接口契约，下一步进入前端原型建议。`,
  }

  await savePromise
  await selectWorkspace('frontendSuggestion')
}

const handleSuggestionConfirm = async ({ suggestion } = {}) => {
  const savePromise = writeStepResult('prototype', suggestion || { confirmed: true })
  projectContext.value = {
    ...projectContext.value,
    projectStage: '前端原型方案已确认',
    currentStepLabel: '前端原型建议',
    contextStatus: 'FDE 自助式方法链路已闭环',
    summary: '已完成需求输入、场景识别、功能设计、页面设计、交互设计、API 契约和前端原型方案输出。',
    selectedPrototypeSuggestion: suggestion || { confirmed: true },
  }

  await savePromise
}

const workspaceStepLabelMap = {
  factoryWorkbench: '客户需求输入',
  requirementInput: '客户需求输入',
  scenarioIdentification: '场景识别',
  featureDesign: '功能设计',
  pageDesign: '页面设计',
  pageInteraction: '交互设计',
  apiContract: 'API 契约设计',
  frontendSuggestion: '前端原型建议',
  prototypeWorkflow: '原型生成流程总览',
  requirementSummary: '客户需求分析',
  projectOverview: '业务原型系统',
  scheduleTracking: '业务原型系统',
  issueTracking: '业务原型系统',
  onsiteDispatch: '业务原型系统',
  materialTracking: '业务原型系统',
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
  { name: '2-42：本地版本保存与接续', status: '当前', statusClass: 'active' },
]
</script>