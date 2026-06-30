<template>
  <section class="scenario-view" aria-labelledby="scenario-title">
    <ViewHeading
      eyebrow="Scenario Identification"
      title="场景识别工作台"
      title-id="scenario-title"
      description="基于需求拆解结果和问题回复，生成并修订用户角色、业务场景、任务流程和页面映射。"
    />

    <article v-if="projectContext.requirementAnalysis" class="context-summary-card" :class="{ collapsed: !isRequirementSummaryOpen }">
      <button class="summary-toggle" type="button" :aria-expanded="isRequirementSummaryOpen" @click="isRequirementSummaryOpen = !isRequirementSummaryOpen">
        <span>上一步结果</span>
        <strong>来自需求输入阶段的拆解摘要</strong>
        <small>{{ isRequirementSummaryOpen ? '收起' : '展开查看' }}</small>
      </button>

      <div v-if="isRequirementSummaryOpen" class="summary-content">
        <section class="summary-brief">
          <span>业务背景</span>
          <p>{{ requirementSummaryPreview }}</p>
        </section>

        <dl class="summary-metrics">
          <div>
            <dt>客户痛点</dt>
            <dd>{{ requirementPainPointsPreview }}</dd>
          </div>
          <div>
            <dt>业务目标</dt>
            <dd>{{ requirementGoalsPreview }}</dd>
          </div>
          <div class="wide">
            <dt>用户角色</dt>
            <dd>{{ requirementRolesPreview }}</dd>
          </div>
          <div class="wide">
            <dt>待确认问题与回复</dt>
            <dd>{{ requirementQuestionsPreview }}</dd>
          </div>
        </dl>
      </div>
    </article>

    <section class="generation-panel" aria-label="场景自动拆解">
      <div>
        <span>生成顺序</span>
        <strong>先生成用户角色，再生成业务场景、任务流程和页面映射</strong>
        <p>当前草案基于第 01 步的需求文本、附件解析内容、需求拆解结果和你的问题回复生成；可在写入前逐项修订。</p>
      </div>
      <button class="secondary-button" type="button" @click="regenerateDraft">
        重新拆解
      </button>
    </section>

    <div class="scenario-layout">
      <article class="scenario-panel">
        <div class="panel-heading with-action">
          <div>
            <span>用户角色</span>
            <strong>先确认谁会使用这个系统</strong>
          </div>
          <button class="secondary-button small" type="button" @click="addRole">新增角色</button>
        </div>

        <div class="role-list">
          <section v-for="(role, roleIndex) in editableRoles" :key="role.id" class="role-card">
            <label>
              <span>角色名称</span>
              <input v-model.trim="role.name" type="text" placeholder="例如：调度员" />
            </label>
            <label>
              <span>职责说明</span>
              <textarea v-model.trim="role.focus" rows="3" placeholder="说明这个角色关注的业务对象和任务"></textarea>
            </label>
            <label>
              <span>使用的场景标签</span>
              <input v-model.trim="role.tagText" type="text" placeholder="用顿号或逗号分隔，例如：派车、入场、异常闭环" />
            </label>
            <button class="text-button" type="button" @click="removeRole(roleIndex)">移除角色</button>
          </section>
        </div>
      </article>

      <article class="scenario-panel">
        <div class="panel-heading with-action">
          <div>
            <span>业务场景</span>
            <strong>由用户角色推导出的关键使用场景</strong>
          </div>
          <div class="panel-actions">
            <button class="secondary-button small" type="button" @click="rebuildScenariosFromCurrentRoles">根据角色生成场景</button>
            <button class="secondary-button small" type="button" @click="addScenario">新增场景</button>
          </div>
        </div>

        <div class="scenario-list" aria-label="业务场景列表">
          <section
            v-for="(item, index) in editableScenarios"
            :key="item.key"
            class="scenario-card"
            :class="{ active: item.key === selectedKey }"
            @click="selectedKey = item.key"
          >
            <div class="scenario-card-head">
              <input v-model.trim="item.priority" type="text" aria-label="优先级" />
              <button class="text-button" type="button" @click.stop="removeScenario(index)">移除</button>
            </div>
            <label>
              <span>场景名称</span>
              <input v-model.trim="item.name" type="text" placeholder="请输入场景名称" />
            </label>
            <label>
              <span>场景说明</span>
              <textarea v-model.trim="item.description" rows="3" placeholder="请输入场景说明"></textarea>
            </label>
            <label>
              <span>关联角色</span>
              <select v-model="item.pageMapping.role">
                <option v-for="role in editableRoles" :key="role.id" :value="role.name">{{ role.name }}</option>
              </select>
            </label>
          </section>
        </div>
      </article>
    </div>

    <section v-if="selectedScenario" class="scenario-detail" aria-label="当前场景详情">
      <article class="detail-card">
        <span>当前场景</span>
        <h3>{{ selectedScenario.name || '未命名场景' }}</h3>
        <p>{{ selectedScenario.description || '请补充场景说明。' }}</p>
      </article>

      <article class="detail-card editable-detail">
        <div class="detail-heading">
          <span>任务流程</span>
          <button class="secondary-button small" type="button" @click="addWorkflowStep">新增步骤</button>
        </div>
        <div class="editable-list">
          <label v-for="(step, index) in selectedScenario.workflow" :key="index">
            <span>{{ index + 1 }}</span>
            <input v-model.trim="selectedScenario.workflow[index]" type="text" placeholder="请输入任务步骤" />
            <button class="text-button" type="button" @click="removeWorkflowStep(index)">移除</button>
          </label>
        </div>
      </article>

      <article class="detail-card editable-detail">
        <div class="detail-heading">
          <span>页面映射</span>
          <button class="secondary-button small" type="button" @click="addPageModule">新增模块</button>
        </div>
        <label>
          <span>建议页面</span>
          <input v-model.trim="selectedScenario.pageMapping.page" type="text" placeholder="例如：VehicleDispatchView.vue" />
        </label>
        <div class="editable-list module-list">
          <label v-for="(module, index) in selectedScenario.pageMapping.modules" :key="index">
            <span>模块</span>
            <input v-model.trim="selectedScenario.pageMapping.modules[index]" type="text" placeholder="请输入页面模块" />
            <button class="text-button" type="button" @click="removePageModule(index)">移除</button>
          </label>
        </div>
      </article>
    </section>

    <LlmStepRevisionPanel
      class="scenario-revision-panel"
      :step="scenarioRevisionStep"
      :step-output="currentScenarioOutput"
      :project-context="projectContext"
      @revision-applied="handleScenarioRevisionApplied"
    />

    <section class="context-handoff" aria-label="场景结果写回">
      <div>
        <span>上下文写回</span>
        <strong>阅读并修订完成后，将当前选中的场景写入项目上下文</strong>
      </div>
      <button class="primary-button" type="button" @click="confirmScenario">
        写入场景并进入功能设计
      </button>
    </section>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import LlmStepRevisionPanel from '../components/LlmStepRevisionPanel.vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['scenario-confirm'])

const scenarioRevisionStep = {
  key: 'scenarioIdentification',
  resultKey: 'scenario',
  title: '场景识别：用户角色、业务场景、任务流程和页面映射',
}

const editableRoles = ref([])
const editableScenarios = ref([])
const selectedKey = ref('')
const isRequirementSummaryOpen = ref(false)

const requirementText = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const painPoints = (analysis.painPoints || [])
    .map((item) => item.description || item)
    .filter(Boolean)
  const goals = (analysis.businessGoals || analysis.goals || [])
    .map((item) => item.description || item)
    .filter(Boolean)
  const userRoles = (analysis.userRoles || [])
    .map((item) => `${item.name} ${item.responsibility || ''}`.trim())
    .filter(Boolean)
  const questionResponses = (analysis.questionResponses || [])
    .map((item) => `${item.question || ''} ${item.answer || ''}`.trim())
    .filter(Boolean)
  const attachments = (analysis.attachments || props.projectContext.requirementAttachments || [])
    .map((item) => item.name || '')
    .filter(Boolean)

  return [
    props.projectContext.sourceRequirement || '',
    analysis.sourceText || '',
    analysis.attachmentText || props.projectContext.attachmentText || '',
    analysis.businessBackground || '',
    ...painPoints,
    ...goals,
    ...userRoles,
    ...(analysis.questions || []),
    ...questionResponses,
    ...attachments,
  ].join(' ')
})

const requirementSummaryPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  return analysis.businessBackground || '暂无业务背景'
})

const requirementPainPointsPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const painPoints = analysis.painPoints || []
  return painPoints.map((item) => item.description || item).filter(Boolean).join('；') || '暂无客户痛点'
})

const requirementGoalsPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const goals = analysis.businessGoals || analysis.goals || []
  return goals.map((item) => item.description || item).filter(Boolean).join('；') || '暂无业务目标'
})

const requirementRolesPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const roles = analysis.userRoles || []
  return roles.map((item) => `${item.name}：${item.responsibility}`).filter(Boolean).join('；') || '暂无用户角色'
})

const requirementQuestionsPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const responses = analysis.questionResponses || []

  if (responses.length) {
    return responses
      .map((item) => `${item.question}${item.answer ? ` 回复：${item.answer}` : ' 暂未回复'}`)
      .join('；')
  }

  return analysis.questions?.filter(Boolean).join('；') || '暂无待确认问题'
})

const selectedScenario = computed(() => {
  return editableScenarios.value.find((item) => item.key === selectedKey.value) || editableScenarios.value[0] || null
})

const currentScenarioOutput = computed(() => ({
  roles: editableRoles.value.map(normalizeRole),
  scenarios: editableScenarios.value.map(normalizeScenarioForSubmit),
  selectedScenarioKey: selectedScenario.value?.key || '',
  selectedScenario: selectedScenario.value ? normalizeScenarioForSubmit(selectedScenario.value) : null,
  requirementInput: {
    summary: requirementSummaryPreview.value,
    painPoints: requirementPainPointsPreview.value,
    goals: requirementGoalsPreview.value,
    roles: requirementRolesPreview.value,
    questionsAndAnswers: requirementQuestionsPreview.value,
  },
}))

watch(
  () => props.projectContext.requirementAnalysis,
  () => {
    regenerateDraft()
  },
  { immediate: true },
)

function detectDomainLabel(text) {
  const source = text.toLowerCase()

  if (source.includes('车辆') || source.includes('车队') || source.includes('司机') || source.includes('入场')) {
    return {
      item: '车辆',
      process: '车辆运营',
      pagePrefix: 'Vehicle',
    }
  }

  if (source.includes('物料') || source.includes('库存') || source.includes('仓储')) {
    return {
      item: '物料',
      process: '物料流转',
      pagePrefix: 'Material',
    }
  }

  if (source.includes('计划') || source.includes('工序') || source.includes('任务') || source.includes('进度')) {
    return {
      item: '项目',
      process: '计划执行',
      pagePrefix: 'Schedule',
    }
  }

  return {
    item: '业务',
    process: '业务协同',
    pagePrefix: 'Business',
  }
}

function getRoleTags(roleName, domain) {
  if (roleName.includes('经理') || roleName.includes('负责人')) {
    return [`${domain.item}总览`, '风险查看', '关键决策']
  }

  if (roleName.includes('计划')) {
    return ['任务跟踪', '进度调整', '异常协调']
  }

  if (roleName.includes('调度') || roleName.includes('现场')) {
    return ['现场调度', '资源协调', '异常闭环']
  }

  if (roleName.includes('司机') || roleName.includes('车队')) {
    return ['任务接收', '状态回传', '异常反馈']
  }

  if (roleName.includes('仓储') || roleName.includes('物料')) {
    return ['库存查看', '到货确认', '缺料反馈']
  }

  return ['查看业务状态', '处理待办事项', '跟踪执行进展']
}

function buildRolesFromRequirement() {
  const domain = detectDomainLabel(requirementText.value)
  const analysisRoles = props.projectContext.requirementAnalysis?.userRoles || []
  const baseRoles = analysisRoles.length
    ? analysisRoles
    : [
        {
          name: `${domain.item}业务负责人`,
          responsibility: `确认${domain.process}目标、流程边界和原型验收标准。`,
        },
        {
          name: `${domain.item}执行人员`,
          responsibility: `处理${domain.process}中的任务、状态反馈和异常问题。`,
        },
      ]

  return baseRoles.map((role, index) => ({
    id: `role-${Date.now()}-${index}`,
    name: role.name || `角色 ${index + 1}`,
    focus: role.responsibility || role.focus || '',
    tagText: getRoleTags(role.name || '', domain).join('、'),
  }))
}

function buildScenariosFromRoles(roles) {
  const domain = detectDomainLabel(requirementText.value)
  const normalizedRoles = roles.length ? roles : buildRolesFromRequirement()

  return normalizedRoles.slice(0, 4).map((role, index) => {
    const tags = splitTags(role.tagText)
    const mainTag = tags[0] || `${domain.item}处理`
    const name = `${role.name}${mainTag}`

    return {
      key: `scenario-${Date.now()}-${index}`,
      name,
      priority: index === 0 ? 'P0' : 'P1',
      description: `${role.name}在${domain.process}过程中，需要围绕“${mainTag}”完成信息查看、状态处理和异常反馈。`,
      workflow: [
        `进入${mainTag}页面`,
        `查看${domain.item}状态和待处理事项`,
        `处理${role.name}负责的关键动作`,
        '补充处理说明或异常反馈',
        '确认结果并同步给相关角色',
      ],
      pageMapping: {
        role: role.name,
        page: `${domain.pagePrefix}${toBusinessPageName(`${role.name}${mainTag}`)}View.vue`,
        modules: [`${mainTag}列表`, '状态筛选', '详情查看', '处理反馈'],
      },
    }
  })
}

function splitTags(value) {
  return String(value || '')
    .split(/[、,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function toPascalCase(value) {
  const text = String(value || 'Scenario').replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ' ')
  const ascii = text.match(/[a-zA-Z0-9]+/g)
  if (ascii?.length) {
    return ascii.map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join('')
  }

  return 'Scenario'
}

function toBusinessPageName(value) {
  const source = String(value || '')
  const mappings = [
    { keys: ['现场调度', '调度'], name: 'OnsiteDispatch' },
    { keys: ['任务接收', '接收'], name: 'TaskReceiving' },
    { keys: ['门岗', '出入', '入场', '核验'], name: 'GateAccessCheck' },
    { keys: ['查看业务状态', '业务状态', '总览'], name: 'BusinessStatus' },
    { keys: ['异常', '问题', '反馈', '闭环'], name: 'IssueHandling' },
    { keys: ['资源', '协调'], name: 'ResourceCoordination' },
    { keys: ['进度', '跟踪'], name: 'ProgressTracking' },
    { keys: ['到货', '库存', '物料'], name: 'MaterialTracking' },
    { keys: ['审批', '预约', '登记'], name: 'ReservationApproval' },
  ]

  const matched = mappings.find((item) => item.keys.some((key) => source.includes(key)))
  if (matched) {
    return matched.name
  }

  const pascal = toPascalCase(source)
  return pascal === 'Scenario' ? 'ScenarioWorkspace' : pascal
}

function regenerateDraft() {
  const roles = buildRolesFromRequirement()
  editableRoles.value = roles
  editableScenarios.value = buildScenariosFromRoles(roles)
  selectedKey.value = editableScenarios.value[0]?.key || ''
}

function rebuildScenariosFromCurrentRoles() {
  editableScenarios.value = buildScenariosFromRoles(editableRoles.value)
  selectedKey.value = editableScenarios.value[0]?.key || ''
}

function addRole() {
  const domain = detectDomainLabel(requirementText.value)
  editableRoles.value.push({
    id: `role-${Date.now()}`,
    name: `${domain.item}相关角色`,
    focus: '',
    tagText: '',
  })
}

function removeRole(index) {
  if (editableRoles.value.length <= 1) {
    return
  }

  editableRoles.value.splice(index, 1)
}

function addScenario() {
  const role = editableRoles.value[0]
  const domain = detectDomainLabel(requirementText.value)
  const scenario = {
    key: `scenario-${Date.now()}`,
    name: `${domain.item}新业务场景`,
    priority: 'P1',
    description: '',
    workflow: ['进入页面', '查看业务信息', '处理业务动作', '保存处理结果'],
    pageMapping: {
      role: role?.name || `${domain.item}相关角色`,
      page: `${domain.pagePrefix}${toBusinessPageName(`${domain.item}新业务场景`)}View.vue`,
      modules: ['列表区', '详情区', '操作区'],
    },
  }

  editableScenarios.value.push(scenario)
  selectedKey.value = scenario.key
}

function removeScenario(index) {
  if (editableScenarios.value.length <= 1) {
    return
  }

  const removed = editableScenarios.value[index]
  editableScenarios.value.splice(index, 1)

  if (removed.key === selectedKey.value) {
    selectedKey.value = editableScenarios.value[0]?.key || ''
  }
}

function addWorkflowStep() {
  selectedScenario.value?.workflow.push('')
}

function removeWorkflowStep(index) {
  if (!selectedScenario.value || selectedScenario.value.workflow.length <= 1) {
    return
  }

  selectedScenario.value.workflow.splice(index, 1)
}

function addPageModule() {
  selectedScenario.value?.pageMapping.modules.push('')
}

function removePageModule(index) {
  if (!selectedScenario.value || selectedScenario.value.pageMapping.modules.length <= 1) {
    return
  }

  selectedScenario.value.pageMapping.modules.splice(index, 1)
}

function normalizeRole(role) {
  return {
    id: role.id || `role-${Date.now()}`,
    name: role.name || '未命名角色',
    focus: role.focus || role.responsibility || '',
    tagText: role.tagText || (Array.isArray(role.tags) ? role.tags.join('、') : ''),
    tags: splitTags(role.tagText || (Array.isArray(role.tags) ? role.tags.join('、') : '')),
  }
}

function normalizeEditableRole(role, index) {
  const normalized = normalizeRole(role)
  return {
    id: normalized.id || `role-${Date.now()}-${index}`,
    name: normalized.name,
    focus: normalized.focus,
    tagText: normalized.tagText || normalized.tags.join('、'),
  }
}

function normalizeEditableScenario(scenario, index) {
  const pageMapping = scenario.pageMapping || {}
  return {
    key: scenario.key || `scenario-${Date.now()}-${index}`,
    name: scenario.name || `业务场景 ${index + 1}`,
    priority: scenario.priority || 'P1',
    description: scenario.description || '',
    workflow: Array.isArray(scenario.workflow) && scenario.workflow.length ? scenario.workflow : ['进入页面', '查看业务信息', '处理业务动作', '保存处理结果'],
    pageMapping: {
      role: pageMapping.role || editableRoles.value[0]?.name || '业务角色',
      page: pageMapping.page || 'BusinessScenarioView.vue',
      modules: Array.isArray(pageMapping.modules) && pageMapping.modules.length ? pageMapping.modules : ['列表区', '详情区', '操作区'],
    },
  }
}

function applyScenarioOutput(output) {
  const nextRoles = output.roles || output.sourceRoles || output.selectedScenario?.sourceRoles || []
  const nextScenarios = output.scenarios || output.availableScenarios || output.selectedScenario?.availableScenarios || []

  if (nextRoles.length) {
    editableRoles.value = nextRoles.map(normalizeEditableRole)
  }

  if (nextScenarios.length) {
    editableScenarios.value = nextScenarios.map(normalizeEditableScenario)
  } else if (output.selectedScenario || output.scenario) {
    editableScenarios.value = [normalizeEditableScenario(output.selectedScenario || output.scenario, 0)]
  }

  const nextSelectedKey = output.selectedScenarioKey || output.selectedScenario?.key || output.scenario?.key
  selectedKey.value = editableScenarios.value.some((item) => item.key === nextSelectedKey)
    ? nextSelectedKey
    : editableScenarios.value[0]?.key || ''
}

function handleScenarioRevisionApplied({ revisedOutput }) {
  if (!revisedOutput) {
    return
  }

  applyScenarioOutput(revisedOutput)
}

function normalizeScenarioForSubmit(scenario) {
  return {
    ...scenario,
    workflow: scenario.workflow.map((item) => item.trim()).filter(Boolean),
    pageMapping: {
      ...scenario.pageMapping,
      modules: scenario.pageMapping.modules.map((item) => item.trim()).filter(Boolean),
    },
    sourceRoles: editableRoles.value.map((role) => ({
      name: role.name,
      focus: role.focus,
      tags: splitTags(role.tagText),
    })),
    availableScenarios: editableScenarios.value.map((item) => ({
      ...item,
      workflow: item.workflow.map((step) => step.trim()).filter(Boolean),
      pageMapping: {
        ...item.pageMapping,
        modules: item.pageMapping.modules.map((module) => module.trim()).filter(Boolean),
      },
    })),
  }
}

function confirmScenario() {
  if (!selectedScenario.value) {
    return
  }

  emit('scenario-confirm', {
    scenario: normalizeScenarioForSubmit(selectedScenario.value),
  })
}
</script>

<style scoped>
.scenario-view {
  margin-top: 16px;
}

.context-handoff,
.context-summary-card,
.generation-panel,
.scenario-panel,
.detail-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.context-summary-card,
.generation-panel {
  margin-bottom: 16px;
  padding: 20px;
}

.context-summary-card.collapsed {
  padding: 0;
}

.summary-toggle {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 14px;
  align-items: center;
  width: 100%;
  border: 0;
  padding: 18px 20px;
  background: transparent;
  text-align: left;
}

.summary-toggle span,
.summary-toggle small {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.summary-toggle strong {
  color: #0f172a;
  font-size: 16px;
}

.summary-content {
  display: grid;
  gap: 14px;
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.summary-brief {
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 16px 18px;
  background: linear-gradient(180deg, #f8fbff 0%, #ffffff 100%);
}

.summary-brief span,
.context-summary-card dt {
  display: block;
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.summary-brief p,
.generation-panel p {
  margin: 0;
  color: #526174;
  line-height: 1.75;
}

.summary-metrics {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin: 0;
}

.summary-metrics div {
  position: relative;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px 18px;
  background: #ffffff;
}

.summary-metrics div::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #bfdbfe;
}

.summary-metrics .wide {
  grid-column: 1 / -1;
}

.context-summary-card dd {
  margin: 0;
  color: #172033;
  line-height: 1.7;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.scenario-revision-panel {
  margin-top: 16px;
}

.generation-panel,
.context-handoff {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.generation-panel span,
.context-handoff span,
.panel-heading span,
.detail-card > span,
.detail-heading span,
.editable-detail label > span,
.role-card label > span,
.scenario-card label > span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.generation-panel strong,
.context-handoff strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
  font-size: 16px;
}

.scenario-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
  gap: 16px;
}

.scenario-panel {
  padding: 22px;
}

.panel-heading,
.detail-heading,
.panel-actions {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.panel-actions {
  flex-wrap: wrap;
  justify-content: flex-end;
}

.panel-heading strong {
  display: block;
  margin-top: 6px;
  color: #0f172a;
  font-size: 18px;
}

.small {
  padding: 8px 10px;
  font-size: 13px;
}

.role-list,
.scenario-list,
.editable-list {
  display: grid;
  gap: 12px;
}

.role-card,
.scenario-card {
  display: grid;
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.scenario-card {
  cursor: pointer;
}

.scenario-card.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.scenario-card-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.scenario-card-head input {
  width: 70px;
  border-radius: 999px;
  text-align: center;
}

label {
  display: grid;
  gap: 8px;
}

input,
textarea,
select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  color: #172033;
  background: #ffffff;
  font-weight: 800;
}

textarea {
  resize: vertical;
  line-height: 1.6;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

.text-button {
  width: max-content;
  border: 0;
  padding: 0;
  background: transparent;
  color: #2563eb;
  font-weight: 900;
}

.scenario-detail {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.05fr) minmax(0, 1.05fr);
  gap: 16px;
  margin-top: 16px;
}

.detail-card {
  padding: 22px;
}

.detail-card h3 {
  margin: 12px 0;
  color: #0f172a;
  font-size: 24px;
}

.detail-card p {
  color: #526174;
  line-height: 1.75;
}

.editable-list label {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
}

.module-list {
  margin-top: 12px;
}

.context-handoff {
  margin-top: 16px;
  padding: 16px;
}

@media (max-width: 1080px) {
  .summary-metrics {
    grid-template-columns: 1fr;
  }

  .scenario-layout,
  .scenario-detail {
    grid-template-columns: 1fr;
  }

  .generation-panel,
  .context-handoff,
  .panel-heading,
  .detail-heading,
  .panel-actions {
    display: grid;
  }
}
</style>
