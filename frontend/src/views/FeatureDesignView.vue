<template>
  <section class="feature-design-view" aria-labelledby="feature-design-title">
    <ViewHeading
      eyebrow="Feature Design"
      title="功能模块设计工作台"
      title-id="feature-design-title"
      description="基于场景识别结果，整理功能模块、功能点、优先级、页面建议和 API 方向。"
    />

    <div class="feature-layout">
      <article class="scenario-panel collapsible-panel">
        <button class="collapse-toggle" type="button" :aria-expanded="isScenarioListOpen" @click="isScenarioListOpen = !isScenarioListOpen">
          <div>
            <span>上一步结果 · 业务场景</span>
            <strong>来自场景识别阶段，共 {{ availableScenarios.length }} 个场景</strong>
          </div>
          <small>{{ isScenarioListOpen ? '收起' : '展开查看' }}</small>
        </button>

        <div v-if="isScenarioListOpen" class="scenario-list">
          <section
            v-for="item in availableScenarios"
            :key="item.key"
            role="button"
            tabindex="0"
            class="scenario-nav-card"
            :class="{ active: item.key === activeScenarioKey }"
            @click="selectScenario(item.key)"
            @keydown.enter.prevent="selectScenario(item.key)"
            @keydown.space.prevent="selectScenario(item.key)"
          >
            <div class="scenario-nav-head">
              <div class="scenario-title-line">
                <span class="priority-tag">{{ item.priority }}</span>
                <strong>{{ item.name }}</strong>
              </div>
              <button
                class="gen-btn"
                type="button"
                :disabled="generatingScenarioKey === item.key"
                @click.stop="generateModulesForScenario(item)"
              >
                {{ generatingScenarioKey === item.key ? '生成中' : '生成' }}
              </button>
            </div>
            <small>{{ item.description }}</small>
            <em v-if="generatedScenarioKeys[item.key]" class="generated-badge">已保存</em>
          </section>
        </div>
      </article>

      <article v-if="activeScenario" class="current-scenario-panel compact collapsible-panel">
        <button class="collapse-toggle" type="button" :aria-expanded="isScenarioDetailOpen" @click="isScenarioDetailOpen = !isScenarioDetailOpen">
          <div>
            <span>上一步结果 · 当前场景详情</span>
            <strong>{{ activeScenario.name || '未命名场景' }}</strong>
          </div>
          <small>{{ isScenarioDetailOpen ? '收起' : '展开查看' }}</small>
        </button>

        <div v-if="isScenarioDetailOpen" class="scenario-detail-strip">
          <div class="scenario-side-facts">
            <div class="scenario-fact compact-fact">
              <span>关联角色</span>
              <strong>{{ activeScenario.pageMapping?.role || '暂无角色' }}</strong>
            </div>
            <div class="scenario-fact compact-fact">
              <span>建议页面</span>
              <strong>{{ activeScenario.pageMapping?.page || '暂无建议页面' }}</strong>
            </div>
          </div>

          <div class="workflow-track-card">
            <span>任务流程</span>
            <div class="workflow-track">
              <div v-for="(step, index) in activeScenarioWorkflowSteps" :key="`${index}-${step}`" class="workflow-step">
                <em>{{ index + 1 }}</em>
                <strong>{{ step }}</strong>
              </div>
            </div>
          </div>
        </div>
      </article>

      <article class="feature-detail">
        <div class="detail-heading horizontal-heading with-status">
          <div>
            <span>功能模块映射</span>
            <strong>基于该场景推荐的功能模块</strong>
          </div>
          <p v-if="generationMessage" class="generation-message" :class="{ error: generationHasError }">{{ generationMessage }}</p>
        </div>

        <div class="mapped-modules-grid">
          <div v-for="module in activeScenarioModules" :key="module.key" class="module-card">
            <div class="module-card-head">
              <span class="priority-tag">{{ module.priority }}</span>
              <strong>{{ module.name }}</strong>
            </div>
            <p>{{ module.description }}</p>
            <div class="module-features">
              <h6>功能点预览</h6>
              <ul>
                <li v-for="feature in module.features" :key="feature">{{ feature }}</li>
              </ul>
            </div>
            <div class="module-meta">
              <span>建议页面：{{ module.pageTitleSuggestion || inferModulePageTitle(module, activeScenario, 0) }}</span>
              <span>API 方向：{{ module.apiSuggestion }}</span>
            </div>
          </div>
          <div v-if="!activeScenarioModules.length" class="empty-placeholder feature-generation-placeholder">
            <span>等待生成</span>
            <strong>当前场景尚未生成功能模块映射</strong>
            <p>请在上方业务场景卡片中点击“生成”，系统会调用大模型生成该场景对应的功能模块，并自动保存到本地 Markdown。</p>
          </div>
        </div>
      </article>
    </div>

    <LlmStepRevisionPanel
      v-if="activeScenario"
      class="feature-revision-panel"
      :step="featureScenarioRevisionStep"
      :step-output="activeScenarioFeatureOutput"
      :project-context="projectContext"
      @revision-applied="handleFeatureRevisionApplied"
    />

    <div class="next-action">
      <button class="primary-button" type="button" :disabled="Boolean(generatingScenarioKey)" @click="confirmAndNext">
        {{ generatingScenarioKey ? '生成中...' : '确认并进入下一步' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import LlmStepRevisionPanel from '../components/LlmStepRevisionPanel.vue'
import ViewHeading from '../components/ViewHeading.vue'
import { featureDesignMock } from '../data/featureDesignMock'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['feature-confirm', 'feature-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'
const LLM_REQUEST_TIMEOUT_MS = 30000

const featureData = featureDesignMock
const activeScenarioKey = ref('')
const revisedModulesByScenarioKey = ref({})
const isScenarioListOpen = ref(false)
const isScenarioDetailOpen = ref(false)
const generatingScenarioKey = ref('')
const generatedScenarioKeys = ref({})
const generationMessage = ref('')
const generationHasError = ref(false)

const featureScenarioRevisionStep = {
  key: 'featureDesignScenarioModules',
  resultKey: 'feature',
  title: '基于当前场景推荐功能模块',
}

const scenarioStepResult = computed(() => props.projectContext.stepResults?.scenario || props.projectContext.selectedScenario || null)

const availableScenarios = computed(() => {
  const savedScenario = scenarioStepResult.value

  if (savedScenario?.availableScenarios?.length) {
    return savedScenario.availableScenarios
  }

  return savedScenario ? [savedScenario] : []
})

watch(
  availableScenarios,
  (scenarios) => {
    if (!scenarios.length) {
      activeScenarioKey.value = ''
      return
    }

    if (!scenarios.some((scenario) => scenario.key === activeScenarioKey.value)) {
      activeScenarioKey.value = scenarios[0].key
    }
  },
  { immediate: true },
)

const activeScenario = computed(() => {
  return availableScenarios.value.find((scenario) => scenario.key === activeScenarioKey.value) || null
})

const activeScenarioWorkflowSteps = computed(() => {
  return Array.isArray(activeScenario.value?.workflow) && activeScenario.value.workflow.length
    ? activeScenario.value.workflow
    : ['暂无任务流程']
})

function hydrateRevisedModulesFromSavedFeature(savedFeature) {
  if (!savedFeature) {
    return
  }

  if (savedFeature.revisedModulesByScenarioKey && typeof savedFeature.revisedModulesByScenarioKey === 'object') {
    revisedModulesByScenarioKey.value = { ...savedFeature.revisedModulesByScenarioKey }
    return
  }

  if (Array.isArray(savedFeature.allMappings)) {
    revisedModulesByScenarioKey.value = savedFeature.allMappings.reduce((result, mapping) => {
      const scenarioKey = mapping?.scenario?.key
      if (scenarioKey && Array.isArray(mapping.modules)) {
        result[scenarioKey] = mapping.modules
      }
      return result
    }, {})
  }
}

watch(
  () => props.projectContext.stepResults?.feature,
  (savedFeature) => {
    hydrateRevisedModulesFromSavedFeature(savedFeature)
  },
  { immediate: true, deep: true },
)

const requirementText = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const painPoints = (analysis.painPoints || [])
    .map((item) => item.description || item)
    .filter(Boolean)
  const userRoles = (analysis.userRoles || [])
    .map((item) => `${item.name} ${item.responsibility || ''}`.trim())
    .filter(Boolean)

  return [
    props.projectContext.sourceRequirement || '',
    analysis.businessBackground || '',
    ...painPoints,
    ...userRoles,
    ...(analysis.questions || []),
  ].join(' ')
})

function detectDomainLabel(text) {
  const source = text.toLowerCase()

  if (source.includes('车辆') || source.includes('车队') || source.includes('司机')) {
    return { item: '车辆' }
  }

  if (source.includes('物料') || source.includes('库存') || source.includes('仓储')) {
    return { item: '物料' }
  }

  if (source.includes('计划') || source.includes('工序') || source.includes('任务') || source.includes('进度')) {
    return { item: '项目' }
  }

  return { item: '业务' }
}

const dynamicModules = computed(() => {
  const domain = detectDomainLabel(requirementText.value)

  return featureData.modules.map((item) => {
    if (item.key === 'projectOverview') {
      return {
        ...item,
        name: `${domain.item}总览`,
        description: `为管理者提供${domain.item}进度、关键节点、风险异常和资源占用的一屏式总览。`,
        features: [
          `展示${domain.item}总体进度与完成率`,
          '展示关键节点状态',
          '展示延期任务和异常问题数量',
          `支持按${domain.item}和状态筛选风险事项`,
        ],
      }
    }

    if (item.key === 'scheduleTracking') {
      return {
        ...item,
        name: `${domain.item}任务跟踪`,
        description: `为执行人员提供${domain.item}计划任务、工序状态、延期标记和调整建议的操作入口。`,
        features: [
          `展示${domain.item}计划任务列表`,
          `支持按${domain.item}、区域、工序状态筛选`,
          '标记延期、阻塞和已完成任务',
          `展示${domain.item}计划调整建议`,
        ],
      }
    }

    if (item.key === 'issueTracking') {
      return {
        ...item,
        name: `${domain.item}异常反馈`,
        description: `支撑${domain.item}日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。`,
        features: [
          `新增${domain.item}异常问题记录`,
          '设置责任人和处理时限',
          '更新异常处理状态',
          '查看异常问题处理历史',
        ],
      }
    }

    if (item.key === 'siteResourceBoard') {
      const resourceName = domain.item === '车辆' ? '车辆和司机' : '人员和设备'

      return {
        ...item,
        name: `${domain.item}现场资源看板`,
        description: `展示${resourceName}、作业面和关键资源占用情况，辅助现场调度。`,
        features: [
          '展示当日作业面',
          `展示${resourceName}占用`,
          '提示资源冲突',
          '查看资源使用明细',
        ],
      }
    }

    if (item.key === 'materialArrival') {
      return {
        ...item,
        name: `${domain.item}到货/就绪跟踪`,
        description: `跟踪关键${domain.item}状态，帮助执行人员判断任务是否具备开工条件。`,
        features: [
          `展示关键${domain.item}清单`,
          '展示到货、缺料和延期状态',
          '关联受影响任务',
          `提示${domain.item}风险`,
        ],
      }
    }

    return item
  })
})

function scenarioSearchText(scenario) {
  return [
    scenario.name,
    scenario.description,
    scenario.pageMapping?.role,
    scenario.pageMapping?.page,
    ...(scenario.workflow || []),
    ...(scenario.pageMapping?.modules || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

const scenarioModuleRules = [
  { keys: ['任务接收', '接收', '司机', '车队', '状态回传'], moduleKeys: ['scheduleTracking', 'issueTracking'] },
  { keys: ['调度', '现场', '资源', '派单', '作业面'], moduleKeys: ['siteResourceBoard', 'scheduleTracking', 'issueTracking'] },
  { keys: ['异常', '问题', '告警', '风险', '反馈'], moduleKeys: ['issueTracking'] },
  { keys: ['物料', '到货', '库存', '仓储', '缺料'], moduleKeys: ['materialArrival', 'issueTracking'] },
  { keys: ['总览', '查看业务状态', '管理', '负责人', '门岗'], moduleKeys: ['projectOverview', 'scheduleTracking'] },
]

function createScenarioModule(scenario) {
  const pageModules = scenario.pageMapping?.modules || []
  const workflow = scenario.workflow || []
  const role = scenario.pageMapping?.role || '业务角色'

  return {
    key: `${scenario.key}-scenario-module`,
    priority: scenario.priority || 'P1',
    name: `${scenario.name}工作台`,
    sourceScenario: scenario.name,
    description: `围绕「${scenario.name}」生成的场景专属功能模块，支撑${role}完成当前任务流程。`,
    features: [
      ...pageModules.map((item) => `提供${item}`),
      ...workflow.slice(0, 3).map((item) => `支持${item}`),
    ].slice(0, 5),
    pageTitleSuggestion: `${scenario.name}工作台`,
    pageSuggestion: scenario.pageMapping?.page || 'ScenarioWorkspaceView.vue',
    apiSuggestion: `GET /api/scenarios/${scenario.key}`,
    scopeNote: '由当前业务场景动态生成，用于承接左侧选中场景。',
  }
}

function getMatchedModuleKeys(scenario) {
  const scenarioText = scenarioSearchText(scenario)
  const keys = new Set()

  if (scenario.priority === 'P0') {
    keys.add('projectOverview')
  }

  scenarioModuleRules.forEach((rule) => {
    if (rule.keys.some((keyword) => scenarioText.includes(keyword))) {
      rule.moduleKeys.forEach((moduleKey) => keys.add(moduleKey))
    }
  })

  return keys
}

function getModulesForScenario(scenario) {
  if (!scenario) {
    return []
  }

  if (Object.prototype.hasOwnProperty.call(revisedModulesByScenarioKey.value, scenario.key)) {
    return revisedModulesByScenarioKey.value[scenario.key]
  }

  return []
}

const activeScenarioModules = computed(() => getModulesForScenario(activeScenario.value))

const activeScenarioFeatureOutput = computed(() => ({
  scenario: activeScenario.value,
  modules: activeScenarioModules.value,
  instructionTarget: '请只修改 modules 字段，也就是“基于该场景推荐的功能模块”列表。',
}))

function selectScenario(key) {
  activeScenarioKey.value = key
}

function setGenerationMessage(message, isError = false) {
  generationMessage.value = message
  generationHasError.value = isError
}

function buildScenarioModuleGenerationInput(scenario) {
  return {
    scenario,
    requirement: {
      sourceRequirement: props.projectContext.sourceRequirement || '',
      businessBackground: props.projectContext.requirementAnalysis?.businessBackground || '',
      painPoints: props.projectContext.requirementAnalysis?.painPoints || [],
      businessGoals: props.projectContext.requirementAnalysis?.businessGoals || props.projectContext.requirementAnalysis?.goals || [],
    },
    previousScenarioResult: scenarioStepResult.value,
    currentModules: getModulesForScenario(scenario),
  }
}

async function requestModuleGeneration(scenario, signal) {
  const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      step_key: 'featureModuleGenerationForScenario',
      step_title: '根据当前业务场景生成功能模块映射',
      instruction: `请根据当前业务场景上下文，生成该场景对应的功能模块映射。必须只输出严格 JSON 对象，不要 Markdown，不要解释。JSON 结构必须为 {"modules":[{"key":"稳定英文或拼音标识","priority":"P0/P1/P2","name":"功能模块名称","sourceScenario":"来源场景名称","description":"模块说明","features":["功能点1","功能点2"],"pageTitleSuggestion":"中文页面标题，说明页面定位/主要功能","pageSuggestion":"建议 Vue 页面文件名","apiSuggestion":"RESTful API 方向","scopeNote":"生成依据"}]}。要求：模块必须服务于当前场景的角色、任务流程和页面映射；一般生成 2-5 个模块；页面标题必须使用简体中文，不要用 VehicleDispatch、StatisticsDashboard 这类英文组件名充当页面标题。`,
      current_output: buildScenarioModuleGenerationInput(scenario),
      project_context: {
        projectName: props.projectContext.projectName,
        customerName: props.projectContext.customerName,
        sourceRequirement: props.projectContext.sourceRequirement,
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) {
    throw new Error(payload?.detail?.message || payload?.message || '大模型生成功能模块失败')
  }

  return payload.data?.revised_output
}

async function generateModulesForScenario(scenario) {
  if (!scenario || generatingScenarioKey.value) {
    return
  }

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    setGenerationMessage('请先切换到大模型生成并配置 DeepSeek Key，再生成功能模块映射。', true)
    return
  }

  activeScenarioKey.value = scenario.key
  generatingScenarioKey.value = scenario.key
  setGenerationMessage(`正在为「${scenario.name}」生成功能模块映射...`)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), LLM_REQUEST_TIMEOUT_MS)

  try {
    const revisedOutput = await requestModuleGeneration(scenario, controller.signal)
    const modules = normalizeRevisedModulesForScenario(revisedOutput, scenario)

    if (!modules.length) {
      throw new Error('大模型没有返回可用的功能模块')
    }

    revisedModulesByScenarioKey.value = {
      ...revisedModulesByScenarioKey.value,
      [scenario.key]: modules,
    }
    generatedScenarioKeys.value = {
      ...generatedScenarioKeys.value,
      [scenario.key]: true,
    }

    emit('feature-draft-update', {
      ...buildFeatureDraft(),
      llmRevision: {
        instruction: '根据当前业务场景主动生成功能模块映射',
        scenarioKey: scenario.key,
        revisedAt: new Date().toISOString(),
      },
    })

    setGenerationMessage(`已生成并保存「${scenario.name}」的功能模块映射。`)
  } catch (error) {
    const message = error.name === 'AbortError'
      ? '大模型生成超过 30 秒未返回'
      : error.message || '大模型生成功能模块失败'
    setGenerationMessage(message, true)
  } finally {
    clearTimeout(timeoutId)
    generatingScenarioKey.value = ''
  }
}

function buildAllFeatureMappings() {
  return availableScenarios.value.map((scenario) => ({
    scenario,
    modules: getModulesForScenario(scenario),
  }))
}

function getFirstGeneratedModule(allMappings) {
  return allMappings.find((mapping) => mapping.modules?.length)?.modules?.[0] || null
}

function getMissingGeneratedScenarios(allMappings) {
  return allMappings
    .filter((mapping) => !mapping.modules?.length)
    .map((mapping) => mapping.scenario?.name || '未命名场景')
}

function confirmAndNext() {
  const allMappings = buildAllFeatureMappings()
  const missingScenarios = getMissingGeneratedScenarios(allMappings)

  if (missingScenarios.length) {
    setGenerationMessage(`还有 ${missingScenarios.length} 个业务场景未生成功能模块：${missingScenarios.join('、')}。请逐个点击场景卡片上的“生成”后再进入页面设计。`, true)
    return
  }

  const selectedModule = activeScenarioModules.value[0] || getFirstGeneratedModule(allMappings)

  emit('feature-confirm', {
    allMappings,
    module: selectedModule,
    revisedModulesByScenarioKey: revisedModulesByScenarioKey.value,
    confirmedAt: new Date().toISOString(),
  })
}

function normalizeRevisedModulesForScenario(revisedOutput, scenario) {
  const modules = Array.isArray(revisedOutput)
    ? revisedOutput
    : Array.isArray(revisedOutput?.modules)
      ? revisedOutput.modules
      : []

  return modules
    .filter((module) => module && typeof module === 'object')
    .map((module, index) => ({
      key: module.key || `${scenario.key}-revised-module-${index + 1}`,
      priority: module.priority || scenario.priority || 'P1',
      name: module.name || `推荐功能模块 ${index + 1}`,
      sourceScenario: module.sourceScenario || scenario.name || '',
      description: module.description || '由大模型根据当前场景修改生成。',
      features: Array.isArray(module.features) ? module.features : [],
      pageTitleSuggestion: module.pageTitleSuggestion || inferModulePageTitle(module, scenario, index),
      pageSuggestion: module.pageSuggestion || scenario.pageMapping?.page || 'ScenarioWorkspaceView.vue',
      apiSuggestion: module.apiSuggestion || `GET /api/scenarios/${scenario.key}`,
      scopeNote: module.scopeNote || '由大模型修改当前场景推荐模块后生成。',
    }))
}

function inferModulePageTitle(module, scenario, index = 0) {
  const moduleName = String(module?.name || '').replace(/模块$/, '')
  if (index === 0 && scenario?.name) {
    return `${scenario.name}工作台`
  }

  if (moduleName) {
    return `${moduleName}页面`
  }

  return `${scenario?.name || '业务场景'}页面${index + 1}`
}

function normalizeRevisedModules(revisedOutput) {
  return normalizeRevisedModulesForScenario(revisedOutput, activeScenario.value || { key: activeScenarioKey.value, priority: 'P1', name: '', pageMapping: {} })
}

function buildFeatureDraft() {
  const allMappings = buildAllFeatureMappings()

  return {
    allMappings,
    module: activeScenarioModules.value[0] || getFirstGeneratedModule(allMappings),
    revisedModulesByScenarioKey: revisedModulesByScenarioKey.value,
  }
}

function handleFeatureRevisionApplied({ revisedOutput, revisionInstruction }) {
  const modules = normalizeRevisedModules(revisedOutput)

  if (!activeScenario.value) {
    return
  }

  revisedModulesByScenarioKey.value = {
    ...revisedModulesByScenarioKey.value,
    [activeScenario.value.key]: modules,
  }

  emit('feature-draft-update', {
    ...buildFeatureDraft(),
    llmRevision: {
      instruction: revisionInstruction,
      scenarioKey: activeScenario.value.key,
      revisedAt: new Date().toISOString(),
    },
  })
}
</script>

<style scoped>
.feature-design-view {
  margin-top: 16px;
}

.feature-layout {
  display: grid;
  gap: 16px;
}

.scenario-panel,
.current-scenario-panel,
.feature-detail {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
  padding: 22px;
}

.collapsible-panel {
  padding: 0;
  overflow: hidden;
}

.collapse-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  border: 0;
  padding: 18px 22px;
  background: #ffffff;
  text-align: left;
}

.collapse-toggle span,
.collapse-toggle small {
  display: block;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.collapse-toggle strong {
  display: block;
  margin-top: 6px;
  color: #0f172a;
  font-size: 18px;
}

.panel-heading,
.detail-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.horizontal-heading {
  align-items: center;
}

.panel-heading span,
.detail-heading span,
.current-scenario-main > span,
.scenario-fact span {
  display: block;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong,
.detail-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.scenario-list {
  display: grid;
  grid-template-columns: repeat(4, minmax(180px, 1fr));
  gap: 12px;
  border-top: 1px solid #eef2f7;
  padding: 18px 22px 22px;
}

.scenario-nav-card {
  display: grid;
  align-content: start;
  gap: 8px;
  min-height: 132px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
  text-align: left;
  transition: all 0.2s;
}

.scenario-nav-card.active {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.scenario-nav-head,
.module-card-head,
.scenario-title-line {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scenario-nav-head {
  justify-content: space-between;
  align-items: flex-start;
}

.scenario-title-line {
  min-width: 0;
}

.scenario-nav-card strong {
  color: #0f172a;
  font-size: 16px;
  line-height: 1.35;
}

.scenario-nav-card small {
  color: #64748b;
  line-height: 1.5;
}

.generate-button {
  flex: 0 0 auto;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  padding: 6px 12px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.generate-button:disabled {
  opacity: 0.7;
  cursor: wait;
}

.generated-badge {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}

.detail-heading.with-status {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.generation-message {
  max-width: 520px;
  margin: 0;
  color: #166534;
  line-height: 1.5;
  text-align: right;
  font-size: 13px;
  font-weight: 800;
}

.generation-message.error {
  color: #dc2626;
}

.priority-tag {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 2px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

.current-scenario-panel.compact {
  padding: 0;
}

.scenario-detail-strip {
  display: grid;
  grid-template-columns: minmax(220px, 0.42fr) minmax(0, 1fr);
  gap: 14px;
  border-top: 1px solid #eef2f7;
  padding: 18px 22px 22px;
}

.scenario-side-facts {
  display: grid;
  gap: 12px;
}

.scenario-fact {
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.scenario-fact span,
.workflow-track-card > span {
  display: block;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.scenario-fact strong {
  display: block;
  margin-top: 8px;
  color: #172033;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.workflow-track-card {
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.workflow-track {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 28px 16px;
  margin-top: 14px;
}

.workflow-step {
  position: relative;
  display: grid;
  gap: 8px;
  align-content: start;
  min-height: 96px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 14px;
  background: #ffffff;
}

.workflow-step::after {
  content: '';
  position: absolute;
  top: 28px;
  right: -22px;
  width: 24px;
  height: 2px;
  background: #93c5fd;
}

.workflow-step:last-child::after {
  display: none;
}

.workflow-step em {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-style: normal;
  font-weight: 900;
}

.workflow-step strong {
  color: #172033;
  line-height: 1.55;
}

.detail-heading {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 12px;
}

.detail-heading span {
  margin-bottom: 4px;
}

.mapped-modules-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.module-card {
  flex: 1 1 300px;
  min-width: 280px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
}

.module-card-head {
  margin-bottom: 12px;
}

.module-card-head strong {
  color: #1e293b;
  font-size: 17px;
  line-height: 1.4;
}

.module-card p {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 16px;
}

.module-features {
  margin-bottom: 16px;
}

.module-features h6 {
  margin: 0 0 8px;
  color: #475569;
  font-size: 13px;
  font-weight: 800;
}

.module-features ul {
  margin: 0;
  padding-left: 18px;
  color: #1e293b;
  font-size: 13px;
  line-height: 1.5;
}

.module-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 14px;
  border-top: 1px solid #f1f5f9;
  padding-top: 12px;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 700;
}

.empty-placeholder {
  flex: 1 1 100%;
  padding: 40px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  background: #f8fafc;
  color: #94a3b8;
  text-align: center;
}

.feature-generation-placeholder {
  display: grid;
  justify-items: center;
  gap: 10px;
  min-height: 220px;
  align-content: center;
}

.feature-generation-placeholder span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.feature-generation-placeholder strong {
  color: #0f172a;
  font-size: 20px;
}

.feature-generation-placeholder p {
  max-width: 560px;
  margin: 0;
  color: #64748b;
  line-height: 1.7;
}

.feature-revision-panel {
  margin-top: 16px;
}

.next-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 1280px) {
  .scenario-list {
    grid-template-columns: repeat(2, minmax(220px, 1fr));
  }

  .scenario-detail-strip {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .scenario-list {
    grid-template-columns: 1fr;
  }

  .next-action {
    display: grid;
  }
}
</style>
