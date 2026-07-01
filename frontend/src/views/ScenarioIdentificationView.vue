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
      <button class="secondary-button" type="button" :disabled="isLlmGenerating" @click="generateScenarioDraftFromRequirement">
        {{ isLlmGenerating ? '拆解中...' : '重新拆解' }}
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
          <div v-if="!editableRoles.length" class="empty-placeholder compact">
            暂无用户角色。点击“重新拆解”后，系统会先基于第 01 步结果调用大模型拆分用户角色。
          </div>
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
            <button class="secondary-button small" type="button" :disabled="isLlmGenerating" @click="rebuildScenariosFromCurrentRoles">
              {{ isLlmGenerating ? '生成中...' : '根据角色生成场景' }}
            </button>
            <button class="secondary-button small" type="button" @click="addScenario">新增场景</button>
          </div>
          <p v-if="llmGenerateMessage" class="llm-generate-message">{{ llmGenerateMessage }}</p>
        </div>

        <div class="scenario-list" aria-label="业务场景列表">
          <div v-if="!editableScenarios.length" class="empty-placeholder compact">
            暂无业务场景。确认用户角色后，系统会再调用大模型生成业务场景、任务流程和页面映射。
          </div>
          <section
            v-for="(item, index) in editableScenarios"
            :key="item.key"
            class="scenario-card"
            :class="{ active: item.key === selectedKey }"
            @click="selectedKey = item.key"
          >
            <div class="scenario-card-head">
              <input v-model.trim="item.priority" type="text" aria-label="优先级" />
              <div class="card-head-actions">
                <button class="secondary-button tiny" type="button" @click.stop="removeScenario(index)">移除</button>
              </div>
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
          <div class="detail-head-actions">
            <button class="secondary-button small" type="button" @click="addWorkflowStep">新增步骤</button>
          </div>
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
          <div class="detail-head-actions">
            <button class="secondary-button small" type="button" @click="addPageModule">新增模块</button>
          </div>
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

    <div v-if="pendingRoleDialogOpen" class="dialog-backdrop" role="dialog" aria-modal="true" aria-labelledby="role-confirm-title">
      <article class="role-confirm-dialog">
        <div class="dialog-heading">
          <span>用户角色确认</span>
          <h3 id="role-confirm-title">大模型已完成用户角色拆分</h3>
          <p>确认后，将基于这些用户角色继续调用大模型生成业务场景、任务流程和页面映射。</p>
        </div>
        <div class="pending-role-list">
          <section v-for="role in pendingRoles" :key="role.id" class="pending-role-card">
            <strong>{{ role.name }}</strong>
            <p>{{ role.focus || '暂无职责说明' }}</p>
            <small>{{ role.tagText || '暂无场景标签' }}</small>
          </section>
        </div>
        <div class="dialog-actions">
          <button class="secondary-button" type="button" @click="cancelPendingRoles">取消</button>
          <button class="primary-button" type="button" @click="confirmPendingRolesAndGenerateScenarios">确认并生成业务场景</button>
        </div>
      </article>
    </div>

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
        确认并进入下一步
      </button>
    </section>
  </section>
</template>

<script setup>
import { computed, onUnmounted, ref, watch } from 'vue'
import LlmStepRevisionPanel from '../components/LlmStepRevisionPanel.vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['scenario-confirm', 'scenario-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'
const LLM_REQUEST_TIMEOUT_MS = 30000

const scenarioRevisionStep = {
  key: 'scenarioIdentification',
  resultKey: 'scenario',
  title: '场景识别：用户角色、业务场景、任务流程和页面映射',
}

const editableRoles = ref([])
const editableScenarios = ref([])
const pendingRoles = ref([])
const pendingRoleDialogOpen = ref(false)
const selectedKey = ref('')
const isRequirementSummaryOpen = ref(false)
const isLlmGenerating = ref(false)
const llmGenerateMessage = ref('')
let activeScenarioGenerationController = null

onUnmounted(() => {
  if (messageClearTimer) {
    clearTimeout(messageClearTimer)
  }
  if (activeScenarioGenerationController) {
    activeScenarioGenerationController.abort()
  }
})

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

const requirementGenerationSignature = computed(() => JSON.stringify({
  sourceRequirement: props.projectContext.sourceRequirement || '',
  requirementAnalysis: props.projectContext.requirementAnalysis || null,
  attachmentText: props.projectContext.attachmentText || '',
}))

watch(
  () => requirementGenerationSignature.value,
  () => {
    const saved = props.projectContext.stepResults?.scenario || props.projectContext.selectedScenario
    if (hasSavedScenarioData(saved)) {
      applyScenarioOutput(saved)
      return
    }

    resetScenarioPlaceholders()
  },
  { immediate: true },
)

function hasSavedScenarioData(saved) {
  return Boolean(
    saved
      && (
        saved.sourceRoles?.length
        || saved.availableScenarios?.length
        || saved.selectedScenario
        || saved.scenario
        || saved.name
      ),
  )
}

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

function resetScenarioPlaceholders() {
  editableRoles.value = []
  editableScenarios.value = []
  pendingRoles.value = []
  pendingRoleDialogOpen.value = false
  selectedKey.value = ''
  llmGenerateMessage.value = ''
}

function regenerateDraft() {
  const roles = buildRolesFromRequirement()
  editableRoles.value = roles
  editableScenarios.value = buildScenariosFromRoles(roles)
  selectedKey.value = editableScenarios.value[0]?.key || ''
}

function buildRequirementInputForLlm() {
  const analysis = props.projectContext.requirementAnalysis || {}
  return {
    projectName: props.projectContext.projectName,
    customerName: props.projectContext.customerName,
    sourceRequirement: props.projectContext.sourceRequirement || '',
    manualRequirement: props.projectContext.manualRequirement || '',
    attachmentText: props.projectContext.attachmentText || analysis.attachmentText || '',
    businessBackground: analysis.businessBackground || '',
    painPoints: analysis.painPoints || [],
    businessGoals: analysis.businessGoals || analysis.goals || [],
    userRoles: analysis.userRoles || [],
    questions: analysis.questions || [],
    questionResponses: analysis.questionResponses || [],
  }
}

async function requestLlmRevision({ stepKey, stepTitle, instruction, currentOutput, signal }) {
  const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      step_key: stepKey,
      step_title: stepTitle,
      instruction,
      current_output: currentOutput,
      project_context: {
        projectName: props.projectContext.projectName,
        customerName: props.projectContext.customerName,
        sourceRequirement: props.projectContext.sourceRequirement,
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) {
    throw new Error(payload?.detail?.message || payload?.message || '大模型调用失败')
  }

  return payload.data?.revised_output
}

async function withLlmTimeout(task) {
  if (activeScenarioGenerationController) {
    activeScenarioGenerationController.abort()
  }

  const controller = new AbortController()
  activeScenarioGenerationController = controller
  const timeoutId = setTimeout(() => controller.abort(), LLM_REQUEST_TIMEOUT_MS)

  try {
    return await task(controller.signal)
  } finally {
    clearTimeout(timeoutId)
    if (activeScenarioGenerationController === controller) {
      activeScenarioGenerationController = null
    }
  }
}

async function generateScenarioDraftFromRequirement() {
  if (isLlmGenerating.value) {
    return
  }

  if (!props.projectContext.requirementAnalysis) {
    setLlmMessage('请先完成第 01 步需求拆解', false)
    return
  }

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    setLlmMessage('请先切换到大模型生成并配置 DeepSeek Key', false)
    return
  }

  isLlmGenerating.value = true
  setLlmMessage('正在基于第 01 步结果拆分用户角色...', false)

  try {
    const revised = await withLlmTimeout((signal) => requestLlmRevision({
      signal,
      stepKey: 'scenarioRoleAutoGenerate',
      stepTitle: '基于第 01 步需求拆解生成用户角色',
      instruction: `请基于第 01 步传来的客户原始需求、附件解析文本、业务背景、痛点、目标和待确认问题回复，只拆分将使用该系统的用户角色。必须只输出严格 JSON 对象，不要 Markdown，不要解释。JSON 结构必须为 {"roles":[{"name":"角色名","focus":"职责说明","tagText":"该角色可能使用的场景标签，用顿号分隔"}]}。要求：角色必须来自需求信息或由需求合理推导；不要生成泛化职位；一般生成 3-6 个角色。`,
      currentOutput: buildRequirementInputForLlm(),
    }))

    const roles = revised?.roles || revised?.sourceRoles || []
    if (!Array.isArray(roles) || !roles.length) {
      throw new Error('大模型没有返回可用的用户角色')
    }

    pendingRoles.value = roles.map(normalizeEditableRole)
    pendingRoleDialogOpen.value = true
    emitScenarioDraftUpdate({ roles: pendingRoles.value, scenarios: editableScenarios.value, selectedScenario: selectedScenario.value })
    setLlmMessage('用户角色已生成，请在弹窗中确认')
  } catch (error) {
    const message = error.name === 'AbortError'
      ? '大模型拆分用户角色超过 30 秒未返回'
      : error.message || '大模型拆分用户角色失败'
    setLlmMessage(message, false)
  } finally {
    isLlmGenerating.value = false
  }
}

function cancelPendingRoles() {
  pendingRoleDialogOpen.value = false
  pendingRoles.value = []
  setLlmMessage('已取消本次用户角色拆分')
}

async function confirmPendingRolesAndGenerateScenarios() {
  if (!pendingRoles.value.length || isLlmGenerating.value) {
    return
  }

  editableRoles.value = pendingRoles.value.map((role, index) => normalizeEditableRole(role, index))
  pendingRoleDialogOpen.value = false
  pendingRoles.value = []
  await rebuildScenariosFromCurrentRoles()
}


let messageClearTimer = null

function setLlmMessage(msg, isSuccess = true) {
  llmGenerateMessage.value = msg
  if (messageClearTimer) {
    clearTimeout(messageClearTimer)
  }
  if (isSuccess) {
    messageClearTimer = setTimeout(() => {
      llmGenerateMessage.value = ''
    }, 3000)
  }
}

async function rebuildScenariosFromCurrentRoles() {
  const currentRoles = editableRoles.value.map((r) => ({
    name: r.name,
    focus: r.focus,
    tags: splitTags(r.tagText),
  }))

  if (!currentRoles.length) {
    setLlmMessage('请先生成或新增用户角色，再生成业务场景', false)
    return
  }

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    editableScenarios.value = buildScenariosFromRoles(editableRoles.value)
    selectedKey.value = editableScenarios.value[0]?.key || ''
    emitScenarioDraftUpdate()
    setLlmMessage(`未启用大模型，已使用本地规则生成 ${editableScenarios.value.length} 个业务场景`, false)
    return
  }

  isLlmGenerating.value = true
  setLlmMessage('正在根据已确认用户角色生成业务场景...', false)

  try {
    const revised = await withLlmTimeout((signal) => requestLlmRevision({
      signal,
      stepKey: 'scenarioGenerationFromRoles',
      stepTitle: '根据已确认用户角色生成业务场景',
      instruction: `请根据已确认的用户角色列表和第 01 步需求摘要，生成合理的业务场景、任务流程和页面映射。必须只输出严格 JSON 对象，不要 Markdown，不要解释。JSON 结构必须为 {"scenarios":[{"priority":"P0/P1","name":"场景名称","description":"场景说明","role":"关联角色名","workflow":["步骤1","步骤2"],"pageMapping":{"role":"关联角色名","page":"VuePageNameView.vue","modules":["模块1","模块2"]}}]}。场景名称格式建议为“角色名+核心动作”，如“调度员现场调度”。P0 场景给最重要角色，P1 给其他关键角色。一般生成 3-6 个场景。`,
      currentOutput: {
        roles: currentRoles,
        requirementSummary: requirementSummaryPreview.value,
        requirementPainPoints: requirementPainPointsPreview.value,
        requirementGoals: requirementGoalsPreview.value,
        questionsAndAnswers: requirementQuestionsPreview.value,
      },
    }))

    const scenarios = revised?.scenarios || revised?.availableScenarios || []
    if (!Array.isArray(scenarios) || !scenarios.length) {
      throw new Error('大模型没有返回可用的业务场景')
    }

    const newScenarios = scenarios.map((item, index) => ({
      key: item.key || `scenario-${Date.now()}-${index}`,
      name: item.name || `业务场景 ${index + 1}`,
      priority: item.priority || 'P1',
      description: item.description || '',
      workflow: Array.isArray(item.workflow) && item.workflow.length
        ? item.workflow
        : [
            `进入${item.name || '业务'}页面`,
            `查看${item.role || item.pageMapping?.role || '角色'}关注的业务状态`,
            '处理关键动作',
            '补充处理说明或异常反馈',
            '确认结果并同步给相关角色',
          ],
      pageMapping: {
        role: item.pageMapping?.role || item.role || editableRoles.value[0]?.name || '业务角色',
        page: item.pageMapping?.page || `${getDomainPrefixForScenario({ name: item.name, description: item.description })}${toBusinessPageName(item.name || '')}View.vue`,
        modules: Array.isArray(item.pageMapping?.modules) && item.pageMapping.modules.length
          ? item.pageMapping.modules
          : [`${item.name || '业务'}列表`, '状态筛选', '详情查看', '处理反馈'],
      },
    }))

    editableScenarios.value = newScenarios
    selectedKey.value = newScenarios[0]?.key || ''
    emitScenarioDraftUpdate()
    setLlmMessage(`已根据用户角色生成 ${newScenarios.length} 个业务场景`)
  } catch (error) {
    const message = error.name === 'AbortError'
      ? '大模型生成业务场景超过 30 秒未返回'
      : error.message || '大模型生成业务场景失败'
    setLlmMessage(message, false)
  } finally {
    isLlmGenerating.value = false
  }
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
  emitScenarioDraftUpdate()
}

function buildScenarioDraftResult({ roles = editableRoles.value, scenarios = editableScenarios.value, selectedScenario: activeScenario = selectedScenario.value } = {}) {
  const normalizedRoles = roles.map((role) => {
    const normalizedRole = normalizeRole(role)
    return {
      name: normalizedRole.name,
      focus: normalizedRole.focus,
      tags: normalizedRole.tags,
    }
  })
  const normalizedScenarios = scenarios.map((scenario, index) => {
    const normalizedScenario = normalizeEditableScenario(scenario, index)
    return {
      ...normalizedScenario,
      workflow: normalizedScenario.workflow.map((step) => step.trim()).filter(Boolean),
      pageMapping: {
        ...normalizedScenario.pageMapping,
        modules: normalizedScenario.pageMapping.modules.map((module) => module.trim()).filter(Boolean),
      },
    }
  })
  const matchedSelectedScenario = activeScenario
    ? normalizedScenarios.find((scenario) => scenario.key === activeScenario.key) || normalizeEditableScenario(activeScenario, 0)
    : normalizedScenarios[0] || null

  return {
    ...(matchedSelectedScenario || {}),
    generatedFromRequirementSignature: requirementGenerationSignature.value,
    sourceRoles: normalizedRoles,
    availableScenarios: normalizedScenarios,
    selectedScenarioKey: matchedSelectedScenario?.key || '',
    selectedScenario: matchedSelectedScenario,
  }
}

function emitScenarioDraftUpdate(options) {
  emit('scenario-draft-update', buildScenarioDraftResult(options))
}

function normalizeScenarioForSubmit(scenario) {
  return {
    ...scenario,
    generatedFromRequirementSignature: requirementGenerationSignature.value,
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

function getDomainPrefixForScenario(scenario) {
  const text = [
    scenario.name || '',
    scenario.description || '',
    props.projectContext.sourceRequirement || '',
  ].join(' ')

  if (text.includes('车辆') || text.includes('司机') || text.includes('车队') || text.includes('门岗')) {
    return 'Vehicle'
  }
  if (text.includes('物料') || text.includes('库存') || text.includes('仓储')) {
    return 'Material'
  }
  if (text.includes('计划') || text.includes('工序') || text.includes('任务') || text.includes('进度')) {
    return 'Schedule'
  }
  return 'Business'
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

.card-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.detail-head-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tiny {
  padding: 4px 8px;
  font-size: 11px;
  line-height: 1.2;
}

.llm-generate-message {
  margin-top: 8px;
  color: #6366f1;
  font-size: 13px;
  font-weight: 700;
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

.empty-placeholder.compact {
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 18px;
  background: #f8fafc;
  color: #64748b;
  line-height: 1.7;
  font-weight: 800;
}

.dialog-backdrop {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.32);
}

.role-confirm-dialog {
  display: grid;
  gap: 16px;
  width: min(760px, 100%);
  max-height: min(760px, 90vh);
  overflow: auto;
  border-radius: 8px;
  padding: 22px;
  background: #ffffff;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.24);
}

.dialog-heading {
  display: grid;
  gap: 8px;
}

.dialog-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.dialog-heading h3,
.dialog-heading p {
  margin: 0;
}

.dialog-heading h3 {
  color: #0f172a;
  font-size: 22px;
}

.dialog-heading p {
  color: #64748b;
  line-height: 1.65;
}

.pending-role-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.pending-role-card {
  display: grid;
  gap: 8px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.pending-role-card strong {
  color: #0f172a;
}

.pending-role-card p,
.pending-role-card small {
  margin: 0;
  color: #526174;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

</style>
