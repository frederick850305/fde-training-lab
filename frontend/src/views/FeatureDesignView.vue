<template>
  <section class="feature-design-view" aria-labelledby="feature-design-title">
    <ViewHeading
      eyebrow="Feature Design"
      title="功能模块设计工作台"
      title-id="feature-design-title"
      description="基于场景识别结果，整理功能模块、功能点、优先级、页面建议和 API 方向。"
    />

    <div class="feature-layout">
      <article class="scenario-panel">
        <div class="panel-heading horizontal-heading">
          <div>
            <span>业务场景</span>
            <strong>共 {{ availableScenarios.length }} 个场景</strong>
          </div>
        </div>

        <div class="scenario-list">
          <button
            v-for="item in availableScenarios"
            :key="item.key"
            type="button"
            class="scenario-nav-button"
            :class="{ active: item.key === activeScenarioKey }"
            @click="activeScenarioKey = item.key"
          >
            <div class="scenario-nav-head">
              <span class="priority-tag">{{ item.priority }}</span>
              <strong>{{ item.name }}</strong>
            </div>
            <small>{{ item.description }}</small>
          </button>
        </div>
      </article>

      <article v-if="activeScenario" class="current-scenario-panel compact">
        <div class="scenario-facts">
          <div v-for="item in activeScenarioHandoffItems" :key="item.label" class="scenario-fact">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
      </article>

      <article class="feature-detail">
        <div class="detail-heading horizontal-heading">
          <div>
            <span>功能模块映射</span>
            <strong>基于该场景推荐的功能模块</strong>
          </div>
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
              <span>建议页面：{{ module.pageSuggestion }}</span>
              <span>API 方向：{{ module.apiSuggestion }}</span>
            </div>
          </div>
          <div v-if="!activeScenarioModules.length" class="empty-placeholder">
            未发现与该场景直接关联的功能模块，建议优先检查场景名称与角色的匹配度。
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
      <button class="primary-button" type="button" @click="confirmAndNext">
        确认并进入下一步
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

const featureData = featureDesignMock
const activeScenarioKey = ref('')
const revisedModulesByScenarioKey = ref({})

const featureScenarioRevisionStep = {
  key: 'featureDesignScenarioModules',
  resultKey: 'feature',
  title: '基于当前场景推荐功能模块',
}

const availableScenarios = computed(() => {
  const selectedScenario = props.projectContext.selectedScenario

  if (selectedScenario?.availableScenarios?.length) {
    return selectedScenario.availableScenarios
  }

  return selectedScenario ? [selectedScenario] : []
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

  const matchedModuleKeys = getMatchedModuleKeys(scenario)
  const matchedModules = dynamicModules.value.filter((module) => matchedModuleKeys.has(module.key))
  const scenarioModule = createScenarioModule(scenario)

  return [scenarioModule, ...matchedModules].slice(0, 4)
}

const activeScenarioModules = computed(() => getModulesForScenario(activeScenario.value))

const activeScenarioFeatureOutput = computed(() => ({
  scenario: activeScenario.value,
  modules: activeScenarioModules.value,
  instructionTarget: '请只修改 modules 字段，也就是“基于该场景推荐的功能模块”列表。',
}))

const activeScenarioHandoffItems = computed(() => [
  {
    label: '关联角色',
    value: activeScenario.value?.pageMapping?.role || '暂无角色',
  },
  {
    label: '任务流程',
    value: (activeScenario.value?.workflow || []).join(' -> ') || '暂无流程',
  },
  {
    label: '建议页面',
    value: activeScenario.value?.pageMapping?.page || '暂无建议页面',
  },
])

function confirmAndNext() {
  const allMappings = availableScenarios.value.map((scenario) => ({
    scenario,
    modules: getModulesForScenario(scenario),
  }))

  emit('feature-confirm', {
    allMappings,
    module: activeScenarioModules.value[0] || dynamicModules.value[0],
    revisedModulesByScenarioKey: revisedModulesByScenarioKey.value,
  })
}

function normalizeRevisedModules(revisedOutput) {
  const modules = Array.isArray(revisedOutput)
    ? revisedOutput
    : Array.isArray(revisedOutput?.modules)
      ? revisedOutput.modules
      : []

  return modules
    .filter((module) => module && typeof module === 'object')
    .map((module, index) => ({
      key: module.key || `${activeScenarioKey.value}-revised-module-${index + 1}`,
      priority: module.priority || activeScenario.value?.priority || 'P1',
      name: module.name || `推荐功能模块 ${index + 1}`,
      sourceScenario: module.sourceScenario || activeScenario.value?.name || '',
      description: module.description || '由大模型根据当前场景修改生成。',
      features: Array.isArray(module.features) ? module.features : [],
      pageSuggestion: module.pageSuggestion || activeScenario.value?.pageMapping?.page || 'ScenarioWorkspaceView.vue',
      apiSuggestion: module.apiSuggestion || `GET /api/scenarios/${activeScenarioKey.value}`,
      scopeNote: module.scopeNote || '由大模型修改当前场景推荐模块后生成。',
    }))
}

function buildFeatureDraft() {
  const allMappings = availableScenarios.value.map((scenario) => ({
    scenario,
    modules: getModulesForScenario(scenario),
  }))

  return {
    allMappings,
    module: activeScenarioModules.value[0] || dynamicModules.value[0],
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
  margin-top: 10px;
}

.scenario-nav-button {
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

.scenario-nav-button.active {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.1);
}

.scenario-nav-head,
.module-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.scenario-nav-button strong {
  color: #0f172a;
  font-size: 16px;
  line-height: 1.35;
}

.scenario-nav-button small {
  color: #64748b;
  line-height: 1.5;
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
  padding: 16px;
}

.scenario-facts {
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 12px;
}

.scenario-fact {
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.scenario-fact strong {
  display: block;
  margin-top: 8px;
  color: #172033;
  line-height: 1.65;
  overflow-wrap: anywhere;
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

  .current-scenario-panel,
  .scenario-facts {
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
