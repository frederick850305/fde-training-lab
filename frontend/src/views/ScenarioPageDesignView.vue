<template>
  <section class="spd-view" aria-labelledby="spd-title">
    <ViewHeading
      eyebrow="Scenario → Page"
      title="场景→页面一体化设计工作台"
      title-id="spd-title"
      description="从需求直接生成用户角色、业务场景、功能模块和页面设计，在一个视图中完成原 02-04 三步的全部工作。"
    />

    <!-- Requirement Summary (collapsible) -->
    <article v-if="projectContext.requirementAnalysis" class="req-summary" :class="{ collapsed: !isReqOpen }">
      <button class="summary-toggle" type="button" :aria-expanded="isReqOpen" @click="isReqOpen = !isReqOpen">
        <span>上一步：需求拆解摘要</span>
        <strong>{{ isReqOpen ? '收起' : '展开查看' }}</strong>
      </button>
      <div v-if="isReqOpen" class="summary-body">
        <p>{{ requirementSummary }}</p>
        <div class="summary-tags">
          <span v-for="role in analysisRoles" :key="role.name">{{ role.name }}</span>
        </div>
      </div>
    </article>

    <!-- Generate Button -->
    <div class="gen-bar">
      <div>
        <strong>{{ editableScenarios.length ? editableScenarios.length + ' 个场景' : '尚未生成场景' }}</strong>
        <p>基于第一步的用户角色和需求信息，为每个角色生成一个贴合业务的具体场景。</p>
      </div>
      <button class="gen-btn" type="button" :disabled="isGenBusy" @click="generateAllScenarios">
        {{ isGenBusy ? '⏳ 生成中...' : '⚡ 生成场景' }}
      </button>
    </div>
    <p v-if="genMessage" class="gen-msg" :class="{ error: genError }">{{ genMessage }}</p>

    <!-- Main Layout -->
    <div v-if="editableScenarios.length" class="spd-layout">
      <!-- Left: Scenario List -->
      <nav class="scenario-nav" aria-label="场景列表">
        <div class="nav-heading">
          <span>业务场景</span>
          <strong>{{ editableScenarios.length }} 个</strong>
        </div>
        <button
          v-for="s in editableScenarios"
          :key="s.key"
          type="button"
          class="scenario-nav-item"
          :class="{ active: s.key === activeKey }"
          @click="selectScenario(s.key)"
        >
          <span class="s-priority">{{ s.priority }}</span>
          <div>
            <strong>{{ s.name }}</strong>
            <small>{{ s.pageMapping?.role || '未指定' }} · {{ activeModules(s).length }}模块 · {{ activePages(s).length }}页</small>
          </div>
          <button
            class="mini-gen"
            type="button"
            :disabled="genModulesKey === s.key"
            @click.stop="generateScenarioModules(s)"
            :title="'调用大模型为此场景生成功能模块'"
          >
            {{ genModulesKey === s.key ? '⏳' : '⚡' }}
          </button>
        </button>
      </nav>

      <!-- Right: Tabs -->
      <section class="detail-area" v-if="activeScenario">
        <div class="tab-bar" role="tablist">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            role="tab"
            class="tab-btn"
            :class="{ active: activeTab === tab.key }"
            :aria-selected="activeTab === tab.key"
            @click="activeTab = tab.key"
          >{{ tab.label }}</button>
        </div>

        <!-- Tab: 场景详情 -->
        <article v-if="activeTab === 'scenario'" class="tab-content">
          <div class="edit-grid two-col">
            <label><span>场景名称</span><input v-model.trim="activeScenario.name" type="text" @input="markDirty" /></label>
            <label><span>优先级</span><input v-model.trim="activeScenario.priority" type="text" @input="markDirty" /></label>
            <label class="full"><span>场景说明</span><textarea v-model.trim="activeScenario.description" rows="3" @input="markDirty"></textarea></label>
            <label><span>关联角色</span>
              <select v-model="activeScenario.pageMapping.role" @change="markDirty">
                <option v-for="r in editableRoles" :key="r.id" :value="r.name">{{ r.name }}</option>
              </select>
            </label>
            <label><span>建议页面文件</span><input v-model.trim="activeScenario.pageMapping.page" type="text" @input="markDirty" /></label>
            <label class="full"><span>页面模块（顿号分隔）</span><input v-model.trim="moduleText" type="text" placeholder="模块1、模块2" @input="onModuleTextChange" /></label>
          </div>
          <h4>任务流程</h4>
          <div class="editable-list">
            <label v-for="(step, i) in (activeScenario.workflow || [])" :key="i">
              <span>{{ i + 1 }}</span>
              <input v-model.trim="activeScenario.workflow[i]" type="text" @input="markDirty" />
              <button class="text-btn" type="button" @click="removeWorkflowStep(i)">×</button>
            </label>
          </div>
          <button class="secondary-btn small" type="button" @click="addWorkflowStep">+ 新增步骤</button>
        </article>

        <!-- Tab: 功能模块 -->
        <article v-if="activeTab === 'modules'" class="tab-content">
          <div v-if="!activeModules(activeScenario).length" class="empty-hint">
            <strong>暂无功能模块</strong>
            <p>点击左侧场景旁的 ⚡ 按钮，根据场景详情调用大模型生成功能模块。</p>
          </div>
          <template v-else>
            <div class="module-grid">
              <div v-for="m in activeModules(activeScenario)" :key="m.key" class="module-card">
                <div class="module-head">
                  <span class="m-priority">{{ m.priority }}</span>
                  <strong>{{ m.name }}</strong>
                </div>
                <p>{{ m.description }}</p>
                <ul v-if="m.features?.length">
                  <li v-for="f in m.features" :key="f">{{ f }}</li>
                </ul>
                <div class="module-meta">
                  <span>页面：{{ m.pageSuggestion || m.pageTitleSuggestion }}</span>
                  <span>API：{{ m.apiSuggestion }}</span>
                </div>
              </div>
            </div>
            <div class="module-next-action">
              <p v-if="genPagesKey === activeScenario.key" class="gen-msg">⏳ 正在根据功能模块生成页面设计...</p>
              <button
                v-else
                class="gen-btn"
                type="button"
                @click="generatePageDesignForScenario(activeScenario)"
              >
                → 根据功能模块生成页面设计
              </button>
            </div>
          </template>
        </article>

        <!-- Tab: 页面设计 -->
        <article v-if="activeTab === 'pages'" class="tab-content">
          <div class="page-layout">
            <div class="page-list-panel">
              <strong>页面清单 ({{ activePages(activeScenario).length }})</strong>
              <button
                v-for="p in activePages(activeScenario)"
                :key="p.key"
                type="button"
                class="page-item"
                :class="{ active: p.key === selectedPageKey }"
                @click="selectedPageKey = p.key"
              >
                <span v-if="p.key === selectedPageKey" class="s-priority">{{ p.priority }}</span>
                <strong>{{ p.name }}</strong>
                <small>{{ p.type }} / {{ p.vueFile }}</small>
              </button>
              <div v-if="!activePages(activeScenario).length" class="empty-hint">
                <p>请先在「功能模块」标签页生成模块，再点击底部按钮生成页面设计。</p>
              </div>
            </div>
            <div v-if="selectedPage" class="page-detail">
              <div class="detail-head">
                <strong>{{ selectedPage.name }}</strong>
                <span class="saved-badge">{{ dirty ? '已修改' : '已加载' }}</span>
              </div>
              <div class="edit-grid two-col">
                <label><span>页面名称</span><input v-model.trim="selectedPage.name" type="text" @input="markDirty" /></label>
                <label><span>页面类型</span><input v-model.trim="selectedPage.type" type="text" @input="markDirty" /></label>
                <label><span>Vue 文件</span><input v-model.trim="selectedPage.vueFile" type="text" @input="markDirty" /></label>
                <label><span>优先级</span><input v-model.trim="selectedPage.priority" type="text" @input="markDirty" /></label>
              </div>
              <label class="full"><span>页面目标</span><textarea v-model.trim="selectedPage.goal" rows="2" @input="markDirty"></textarea></label>
              <label class="full"><span>承载功能</span><input v-model.trim="selectedPage.featureText" type="text" @input="markDirty" /></label>
              <div class="section-area">
                <div class="section-head">
                  <h4>页面区域</h4>
                  <button class="secondary-btn small" type="button" @click="addPageSection">+</button>
                </div>
                <div v-if="selectedPage.sections?.length" class="editable-list">
                  <label v-for="(sec, i) in selectedPage.sections" :key="i">
                    <span>{{ i + 1 }}</span>
                    <input v-model.trim="selectedPage.sections[i]" type="text" @input="markDirty" />
                    <button class="text-btn" type="button" @click="removePageSection(i)">×</button>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <!-- Empty state -->
      <section v-else class="detail-area empty-area">
        <span>📋</span>
        <strong>选择一个场景</strong>
        <p>从左侧场景列表中点击一个场景，查看和编辑其详情、功能模块和页面设计。</p>
      </section>
    </div>

    <!-- No scenarios yet -->
    <div v-else class="empty-hero">
      <span>🚀</span>
      <strong>点击「生成场景」开始</strong>
      <p>系统将基于第一步的用户角色和需求信息，为每个角色生成一个贴合业务的具体场景。</p>
    </div>

    <!-- Confirm -->
    <div class="next-action" v-if="editableScenarios.length">
      <button class="primary-btn" type="button" @click="confirmAndNext">确认并进入下一步 →</button>
    </div>
  </section>
</template>

<script setup>
/**
 * ScenarioPageDesignView — 场景→页面一体化设计工作台 (Phase 2)
 *
 * 合并原 ScenarioIdentificationView + FeatureDesignView + PageDesignView
 * 保留原始三步的数据结构与生成逻辑，统一为一个四步骤流程：
 *   1. 读取需求拆解结果（step 01）
 *   2. 生成用户角色 → 确认 → 生成业务场景
 *   3. 逐场景生成功能模块 + 页面设计
 *   4. 确认全部结果并进入下一步
 */
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({ projectContext: { type: Object, required: true } })
const emit = defineEmits(['scenario-page-confirm', 'scenario-page-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'
const LLM_TIMEOUT_MS = 60000

// ============================================================
// State
// ============================================================
const isReqOpen = ref(false)
const isGenBusy = ref(false)
const genMessage = ref('')
const genError = ref(false)
const genModulesKey = ref('')
const genPagesKey = ref('')

// Core data (mirrors original components' state)
const editableRoles = ref([])          // same as ScenarioIdentificationView
const editableScenarios = ref([])      // same as ScenarioIdentificationView
const pendingRoles = ref([])           // LLM role generation pending dialog
const pendingRoleDialogOpen = ref(false)

// Feature design state (mirrors FeatureDesignView.revisedModulesByScenarioKey)
const modulesByScenarioKey = ref({})

// Page design state (mirrors PageDesignView.revisedDesignsByScenarioKey)
const pageDesignsByScenarioKey = ref({})

// UI state
const activeKey = ref('')
const activeTab = ref('scenario')
const selectedPageKey = ref('')
const dirty = ref(false)

let messageClearTimer = null
let activeGenController = null

onUnmounted(() => {
  if (messageClearTimer) clearTimeout(messageClearTimer)
  if (activeGenController) activeGenController.abort('component unmounted')
})

const tabs = [
  { key: 'scenario', label: '📝 场景详情' },
  { key: 'modules', label: '🧩 功能模块' },
  { key: 'pages', label: '📄 页面设计' },
]

// ============================================================
// Computed: Read from step 01 (requirement)
// ============================================================
const requirementText = computed(() => {
  const a = props.projectContext.requirementAnalysis || {}
  return [
    props.projectContext.sourceRequirement || '',
    a.businessBackground || '',
    (a.painPoints || []).map((p) => p.description || p).join(' '),
    (a.businessGoals || a.goals || []).join(' '),
    (a.userRoles || []).map((r) => `${r.name}:${r.responsibility}`).join(' '),
  ].join(' ')
})

const requirementSummary = computed(() => {
  const a = props.projectContext.requirementAnalysis || {}
  return a.businessBackground || '暂无业务背景摘要'
})

const analysisRoles = computed(() => props.projectContext.requirementAnalysis?.userRoles || [])

const requirementSignature = computed(() => JSON.stringify({
  sourceRequirement: props.projectContext.sourceRequirement || '',
  requirementAnalysis: props.projectContext.requirementAnalysis || null,
}))

// ============================================================
// Restore from saved data
// ============================================================
function hasSavedData(saved) {
  return Boolean(
    saved && (
      saved.roles?.length || saved.sourceRoles?.length ||
      saved.scenarios?.length || saved.availableScenarios?.length
    )
  )
}

function applySavedOutput(output) {
  // Restore roles
  const roles = output.roles || output.sourceRoles || []
  if (roles.length) {
    editableRoles.value = roles.map(normalizeRoleInput)
  }

  // Restore scenarios
  const scenarios = output.scenarios || output.availableScenarios || []
  if (scenarios.length) {
    editableScenarios.value = scenarios.map(normalizeScenarioInput)
  }

  // Restore modules
  if (output.modulesByScenarioKey) {
    modulesByScenarioKey.value = output.modulesByScenarioKey
  }

  // Restore page designs
  if (output.pageDesignsByScenarioKey) {
    pageDesignsByScenarioKey.value = output.pageDesignsByScenarioKey
  }

  // Restore active key
  const key = output.selectedScenarioKey || output.activeKey || editableScenarios.value[0]?.key
  if (key && editableScenarios.value.some((s) => s.key === key)) {
    activeKey.value = key
  } else if (editableScenarios.value.length) {
    activeKey.value = editableScenarios.value[0].key
  }
}

function normalizeRoleInput(role, index = 0) {
  return {
    id: role.id || `role-${Date.now()}-${index}`,
    name: role.name || '',
    focus: role.focus || role.responsibility || '',
    tagText: role.tagText || (Array.isArray(role.tags) ? role.tags.join('、') : ''),
  }
}

function normalizeScenarioInput(scenario, index = 0) {
  const pm = scenario.pageMapping || {}
  return {
    key: scenario.key || `scenario-${Date.now()}-${index}`,
    name: scenario.name || '',
    priority: scenario.priority || 'P1',
    description: scenario.description || '',
    workflow: Array.isArray(scenario.workflow) ? scenario.workflow.filter(Boolean) : ['进入页面', '查看信息', '处理任务'],
    pageMapping: {
      role: pm.role || editableRoles.value[0]?.name || '',
      page: pm.page || 'WorkspaceView.vue',
      modules: Array.isArray(pm.modules) ? pm.modules.filter(Boolean) : ['列表区', '详情区', '操作区'],
    },
  }
}

// Watch for saved data restore
watch(
  () => props.projectContext.stepResults?.scenarioPageDesign,
  (saved) => {
    if (hasSavedData(saved)) {
      applySavedOutput(saved)
      return
    }
    // Clear everything if no saved data
    editableRoles.value = []
    editableScenarios.value = []
    modulesByScenarioKey.value = {}
    pageDesignsByScenarioKey.value = {}
    activeKey.value = ''
    pendingRoles.value = []
    pendingRoleDialogOpen.value = false
  },
  { immediate: true }
)

// Auto-select first scenario
watch(editableScenarios, (list) => {
  if (!list.some((s) => s.key === activeKey.value)) {
    activeKey.value = list[0]?.key || ''
  }
})

watch(activeKey, () => {
  dirty.value = false
  selectedPageKey.value = activePages(activeScenario.value)[0]?.key || ''
})

// ============================================================
// Computed: Active scenario details
// ============================================================
const activeScenario = computed(() =>
  editableScenarios.value.find((s) => s.key === activeKey.value) || null
)

const moduleText = computed({
  get: () => (activeScenario.value?.pageMapping?.modules || []).join('、'),
  set: () => {},
})

function activeModules(scenario) {
  if (!scenario) return []
  return modulesByScenarioKey.value[scenario.key] || []
}

function activePages(scenario) {
  if (!scenario) return []
  return pageDesignsByScenarioKey.value[scenario.key]?.pages || []
}

function hasModules(scenario) {
  return activeModules(scenario).length > 0
}

const selectedPage = computed(() => {
  const pages = activePages(activeScenario.value)
  return pages.find((p) => p.key === selectedPageKey.value) || pages[0] || null
})

// ============================================================
// Domain detection (from original ScenarioIdentificationView)
// ============================================================
function detectDomain(text) {
  const t = text.toLowerCase()
  if (/车辆|车队|司机|入场|调度/.test(t)) return { item: '车辆', process: '车辆运营', pagePrefix: 'Vehicle' }
  if (/物料|库存|仓储/.test(t)) return { item: '物料', process: '物料流转', pagePrefix: 'Material' }
  if (/计划|工序|任务|进度/.test(t)) return { item: '项目', process: '计划执行', pagePrefix: 'Schedule' }
  return { item: '业务', process: '业务协同', pagePrefix: 'Business' }
}

function getRoleTags(roleName, domain) {
  if (/经理|负责人/.test(roleName)) return [`${domain.item}总览`, '风险查看', '关键决策']
  if (/计划/.test(roleName)) return ['任务跟踪', '进度调整', '异常协调']
  if (/调度|现场/.test(roleName)) return ['现场调度', '资源协调', '异常闭环']
  if (/司机|车队/.test(roleName)) return ['任务接收', '状态回传', '异常反馈']
  if (/仓储|物料/.test(roleName)) return ['库存查看', '到货确认', '缺料反馈']
  if (/门岗/.test(roleName)) return ['入场核验', '车辆放行', '异常登记']
  return ['查看业务状态', '处理待办事项', '跟踪执行进展']
}

function splitTags(value) {
  return String(value || '').split(/[、,，;；\n]/).map((s) => s.trim()).filter(Boolean)
}

// ============================================================
// Build helpers (local generation fallback)
// ============================================================
function buildRolesFromRequirement() {
  const domain = detectDomain(requirementText.value)
  const analysis = analysisRoles.value
  const base = analysis.length
    ? analysis
    : [{ name: `${domain.item}业务负责人`, responsibility: `确认${domain.process}目标与验收标准。` },
       { name: `${domain.item}执行人员`, responsibility: `处理${domain.process}日常任务与异常反馈。` }]

  return base.map((r, i) => ({
    id: `role-${Date.now()}-${i}`,
    name: r.name,
    focus: r.responsibility || r.focus || '',
    tagText: getRoleTags(r.name, domain).join('、'),
  }))
}

function buildScenariosFromRoles(roles) {
  const domain = detectDomain(requirementText.value)
  var list = roles.length ? roles : buildRolesFromRequirement()

  return list.slice(0, 5).map(function (role, i) {
    var tags = splitTags(role.tagText)
    var mainTag = tags[0] || domain.item + '处理'
    return {
      key: 'scenario-' + Date.now() + '-' + i,
      name: role.name + mainTag,
      priority: i < 2 ? 'P0' : 'P1',
      description: role.name + '在' + domain.process + '中负责' + mainTag + '。',
      workflow: ['查看' + mainTag + '概览', '处理核心任务', '确认结果并同步'],
      pageMapping: {
        role: role.name,
        page: domain.pagePrefix + toBusinessPageName(role.name + mainTag) + 'View.vue',
        modules: [mainTag + '总览', '任务处理', '结果确认'],
      },
    }
  })
}

function toBusinessPageName(value) {
  var s = String(value || '')
  var map = [
    { keys: ['现场调度', '调度'], name: 'OnsiteDispatch' },
    { keys: ['任务接收', '接收'], name: 'TaskReceiving' },
    { keys: ['门岗', '入场', '核验'], name: 'GateAccessCheck' },
    { keys: ['总览', '业务状态'], name: 'BusinessStatus' },
    { keys: ['异常', '问题', '反馈'], name: 'IssueHandling' },
    { keys: ['资源', '协调'], name: 'ResourceCoordination' },
    { keys: ['进度', '跟踪'], name: 'ProgressTracking' },
    { keys: ['报表', '分析'], name: 'AnalyticsDashboard' },
  ]
  var m = map.find(function (item) { return item.keys.some(function (k) { return s.includes(k) }) })
  return m ? m.name : 'ScenarioWorkspace'
}

function buildModules(scenario) {
  var pm = scenario.pageMapping || {}
  return (pm.modules || []).map(function (mod, i) {
    return {
      key: scenario.key + '-mod-' + i,
      priority: 'P0',
      name: mod,
      sourceScenario: scenario.name,
      description: '支撑「' + scenario.name + '」中' + mod + '的业务操作。',
      features: ['展示' + mod + '数据', '支持' + mod + '操作', '反馈处理结果'],
      pageTitleSuggestion: scenario.name + '工作台',
      pageSuggestion: pm.page || 'WorkspaceView.vue',
      apiSuggestion: 'GET/POST /api/' + (scenario.key.split('-')[1] || 'business'),
      scopeNote: '基于场景「' + scenario.name + '」生成',
    }
  })
}

function buildPageDesign(scenario) {
  var pm = scenario.pageMapping || {}
  var pages = [{
    key: scenario.key + '-page-1',
    priority: scenario.priority || 'P1',
    type: '工作台页',
    name: scenario.name + '工作台',
    vueFile: pm.page || 'WorkspaceView.vue',
    goal: scenario.description || '',
    featureText: (pm.modules || []).join('、'),
    features: pm.modules || [],
    sections: ['主操作区', '状态筛选栏', '结果展示区'],
  }]
  return {
    pages: pages,
    navigation: [{ label: scenario.name, target: pm.page || '', default: true }],
    fileStructure: {
      views: pages.map(function (p) { return p.vueFile }).filter(Boolean),
      components: ['StatusTag.vue', 'DataTable.vue'],
      data: ['scenarioMockData.js'],
    },
  }
}

// ============================================================
// LLM helpers
// ============================================================
function createAbortController(timeoutMs) {
  if (activeGenController) activeGenController.abort('new request started')
  var ctrl = new AbortController()
  activeGenController = ctrl
  var timer = setTimeout(function () {
    ctrl.abort('LLM 请求超时（' + (timeoutMs || LLM_TIMEOUT_MS) + 'ms）')
  }, timeoutMs || LLM_TIMEOUT_MS)
  return { controller: ctrl, clearTimer: function () { clearTimeout(timer) } }
}

async function requestLlm(stepKey, stepTitle, instruction, currentOutput, timeoutMs) {
  var _a = createAbortController(timeoutMs || 60000), controller = _a.controller, clearTimer = _a.clearTimer
  var resp
  try {
    resp = await fetch(API_BASE_URL + '/llm/revise-step', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        step_key: stepKey,
        step_title: stepTitle,
        instruction: instruction,
        current_output: currentOutput,
        project_context: {
          projectName: props.projectContext.projectName,
          customerName: props.projectContext.customerName,
        },
      }),
    })
  } finally {
    clearTimer()
    if (activeGenController === controller) activeGenController = null
  }
  var payload = await resp.json().catch(function () { return {} })
  if (!resp.ok || payload.success === false) {
    throw new Error((payload && payload.detail && payload.detail.message) || (payload && payload.message) || '大模型调用失败')
  }
  return (payload.data && payload.data.revised_output) || {}
}

// ============================================================
// Main generation flow
// ============================================================
function setGenMsg(msg, isError) {
  genMessage.value = msg
  genError.value = Boolean(isError)
  if (messageClearTimer) clearTimeout(messageClearTimer)
  if (!isError) {
    messageClearTimer = setTimeout(function () { genMessage.value = '' }, 5000)
  }
}

async function generateAllScenarios() {
  if (isGenBusy.value) return
  isGenBusy.value = true
  genError.value = false

  // Step 1: 使用第一步已生成的用户角色（不再重复生成）
  var inputRoles = analysisRoles.value
  if (!inputRoles.length) {
    // 兜底：如果第一步没有角色，用本地规则生成
    editableRoles.value = buildRolesFromRequirement()
  } else {
    editableRoles.value = inputRoles.map(function (r, i) { return normalizeRoleInput(r, i) })
    // 本地补全 tagText
    var domain = detectDomain(requirementText.value)
    editableRoles.value.forEach(function (r) {
      if (!r.tagText) r.tagText = getRoleTags(r.name, domain).join('、')
    })
  }
  setGenMsg('已读取第一步的 ' + editableRoles.value.length + ' 个角色，正在为每个角色生成业务场景...')

  // Step 2: 基于第一步的角色和需求信息，生成每个业务场景
  if (props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured) {
    try {
      var sResult = await requestLlm(
        'scenarioPageDesignScenarios',
        '场景→页面一体化：基于角色与需求生成业务场景',
        [
          '[全新生成] 忽略当前输出结构，直接返回以下全新JSON。',
          '根据左侧的用户角色列表和第一步传来的需求信息，为每个角色生成一个贴合业务的具体场景。',
          '返回严格JSON：{"scenarios":[{"key":"sc-序号","name":"场景名称（要具体，如"调度员现场调度派车"而非"调度员车辆处理"）","priority":"P0或P1","description":"详细场景说明（20字以上，描述该角色在什么情况下做什么）","workflow":["步骤1","步骤2","步骤3"],"pageMapping":{"role":"对应的角色名","page":"建议的Vue文件名.vue","modules":["页面模块1","页面模块2"]}}]}',
          '场景必须紧密结合需求原文中的业务背景、痛点、目标。一般每个角色一个场景。',
        ].join('\n'),
        {
          roles: editableRoles.value.map(function (r) { return { name: r.name, focus: r.focus, tags: splitTags(r.tagText) } }),
          requirement: requirementText.value.substring(0, 3000),
          existingScenarios: buildScenariosFromRoles(editableRoles.value),
        },
        90000
      )
      var llmScenarios = (sResult.scenarios || []).map(normalizeScenarioInput)
      if (llmScenarios.length) {
        editableScenarios.value = llmScenarios
        setGenMsg('已生成 ' + llmScenarios.length + ' 个场景。点击左侧场景旁的 ⚡ 为该场景生成功能模块。')
      } else {
        throw new Error('大模型未返回有效场景')
      }
    } catch (err) {
      genError.value = true
      setGenMsg('LLM 场景生成失败，使用本地规则：' + (err.message || ''), true)
      editableScenarios.value = buildScenariosFromRoles(editableRoles.value)
    }
  } else {
    editableScenarios.value = buildScenariosFromRoles(editableRoles.value)
    setGenMsg('已使用本地规则生成 ' + editableScenarios.value.length + ' 个场景。点击左侧场景旁的 ⚡ 为该场景生成功能模块。')
  }

  activeKey.value = editableScenarios.value[0] && editableScenarios.value[0].key || ''
  emitDraft()
  isGenBusy.value = false
}

// ============================================================
// Per-scenario: generate function modules via LLM (Button 2)
// ============================================================
async function generateScenarioModules(scenario) {
  if (!scenario || genModulesKey.value) return
  genModulesKey.value = scenario.key
  setGenMsg('正在为「' + scenario.name + '」生成功能模块...')

  if (props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured) {
    try {
      var result = await requestLlm(
        'scenarioPageDesignModules',
        '场景→页面：根据场景详情生成功能模块',
        [
          '[全新生成] 忽略当前输出结构，直接返回以下全新JSON。',
          '当前目标场景：' + scenario.name + '（角色：' + (scenario.pageMapping && scenario.pageMapping.role || '未指定') + '）',
          '场景说明：' + (scenario.description || ''),
          '任务流程：' + (scenario.workflow || []).join(' → '),
          '请根据以上场景详情，生成该场景对应的功能模块列表。返回严格JSON：',
          '{"modules":[{"key":"mod-序号","priority":"P0/P1","name":"模块名","description":"模块说明（这个模块做什么）","features":["功能点1","功能点2"],"pageSuggestion":"建议的Vue页面文件名","apiSuggestion":"建议的API方向"}]}',
          '重要要求：',
          '1. 模块数量不要固定，根据该角色的职责复杂度决定：',
          '   - 简单角色（职责单一，如只看报表）→ 1-2 个模块',
          '   - 中等角色（有查看+操作两种行为）→ 2-4 个模块',
          '   - 复杂角色（多子流程、跨系统交互、异常处理分支多）→ 3-6 个模块',
          '2. 模块名要具体（如"车辆实时地图监控"而非"地图"）。',
          '3. 每个模块的 features 列出 2-4 个具体功能点，描述该模块实际要完成的操作。',
          '4. pageSuggestion 给出该模块适合放在哪个 Vue 页面中，不同模块可以放在同一页面。',
          '5. 如果该角色职责确实简单，不要为了凑数而编造不必要的模块。',
        ].join('\n'),
        {
          scenario: scenario,
          requirement: requirementText.value.substring(0, 2000),
          existingModules: buildModules(scenario),
        }
      )

      if (result.modules && result.modules.length) {
        modulesByScenarioKey.value = Object.assign({}, modulesByScenarioKey.value, (_a = {}, _a[scenario.key] = result.modules, _a))
        setGenMsg('「' + scenario.name + '」的功能模块已生成，共 ' + result.modules.length + ' 个模块。可在功能模块标签页查看，并点击底部按钮生成页面设计。')
      } else {
        throw new Error('大模型未返回有效模块')
      }
    } catch (err) {
      genError.value = true
      setGenMsg('LLM 模块生成失败，使用本地规则：' + (err.message || ''), true)
      modulesByScenarioKey.value = Object.assign({}, modulesByScenarioKey.value, (_b = {}, _b[scenario.key] = buildModules(scenario), _b))
    }
    var _a, _b
  } else {
    modulesByScenarioKey.value = Object.assign({}, modulesByScenarioKey.value, (_c = {}, _c[scenario.key] = buildModules(scenario), _c))
    setGenMsg('已使用本地规则生成「' + scenario.name + '」的功能模块。')
    var _c
  }

  activeTab.value = 'modules'
  dirty.value = false
  emitDraft()
  genModulesKey.value = ''
}

// ============================================================
// Generate page design from modules (button in 功能模块 tab)
// ============================================================
async function generatePageDesignForScenario(scenario) {
  if (!scenario || genPagesKey.value) return
  var modules = activeModules(scenario)
  if (!modules.length) {
    setGenMsg('请先生成功能模块，再生成页面设计。', true)
    return
  }
  genPagesKey.value = scenario.key
  setGenMsg('正在为「' + scenario.name + '」根据功能模块生成页面设计...')

  if (props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured) {
    try {
      var result = await requestLlm(
        'scenarioPageDesignPages',
        '场景→页面：根据功能模块生成页面设计',
        [
          '[全新生成] 忽略当前输出结构，直接返回以下全新JSON。',
          '当前目标场景：' + scenario.name + '（角色：' + (scenario.pageMapping && scenario.pageMapping.role || '未指定') + '）',
          '已生成的功能模块：' + JSON.stringify(modules.map(function (m) { return { name: m.name, description: m.description, features: m.features } })),
          '请根据以上功能模块，为该场景生成页面设计方案。返回严格JSON：',
          '{"pageDesign":{"pages":[{"key":"page-序号","priority":"P0/P1","type":"工作台页|列表页|详情页|看板页","name":"页面名","vueFile":"xxx.vue","goal":"页面目标（一句话）","features":["承载的功能模块名"],"sections":["页面布局区域"]}],"navigation":[{"label":"导航标签","target":"vue文件","default":true}],"fileStructure":{"views":["vue文件"],"components":["组件"],"data":["mock数据文件"]}}}',
          '重要要求：',
          '1. 页面数量由模块复杂度决定，不要固定为1个：',
          '   - 如果所有模块功能紧密相关、可在同一视图完成 → 1 个主工作台页',
          '   - 如果模块之间有明显的流程分界或角色切换 → 拆为 2-3 个页面',
          '   - 每个页面承载的模块数不宜超过 4 个',
          '2. page.features 列出该页面承载的功能模块名称（与上一步模块名对应）。',
          '3. page.sections 列出页面主要 UI 布局区域，数量取决于该页面承载的模块数（2-6个为宜）。',
          '4. page.goal 用一句话描述页面目标，说明使用者在这个页面能完成什么。',
          '5. page.type 根据页面用途选择：工作台页（综合操作）、列表页（查询浏览）、详情页（单对象详情）、看板页（图表监控）。',
        ].join('\n'),
        {
          scenario: scenario,
          modules: modules,
          existingPageDesign: buildPageDesign(scenario),
        }
      )

      if (result.pageDesign) {
        pageDesignsByScenarioKey.value = Object.assign({}, pageDesignsByScenarioKey.value, (_a = {}, _a[scenario.key] = result.pageDesign, _a))
        setGenMsg('「' + scenario.name + '」的页面设计已生成。')
      } else {
        throw new Error('大模型未返回有效页面设计')
      }
    } catch (err) {
      genError.value = true
      setGenMsg('LLM 页面设计生成失败，使用本地规则：' + (err.message || ''), true)
      pageDesignsByScenarioKey.value = Object.assign({}, pageDesignsByScenarioKey.value, (_b = {}, _b[scenario.key] = buildPageDesign(scenario), _b))
    }
    var _a, _b
  } else {
    pageDesignsByScenarioKey.value = Object.assign({}, pageDesignsByScenarioKey.value, (_c = {}, _c[scenario.key] = buildPageDesign(scenario), _c))
    setGenMsg('已使用本地规则生成「' + scenario.name + '」的页面设计。')
    var _c
  }

  activeTab.value = 'pages'
  selectedPageKey.value = (pageDesignsByScenarioKey.value[scenario.key] && pageDesignsByScenarioKey.value[scenario.key].pages || [])[0] && (pageDesignsByScenarioKey.value[scenario.key].pages[0].key) || ''
  dirty.value = false
  emitDraft()
  genPagesKey.value = ''
}

// ============================================================
// UI actions
// ============================================================
function selectScenario(key) { activeKey.value = key }
function markDirty() { dirty.value = true }

function onModuleTextChange(e) {
  if (!activeScenario.value || !activeScenario.value.pageMapping) return
  activeScenario.value.pageMapping.modules = String(e.target.value || '').split(/[、,，]/).map(function (s) { return s.trim() }).filter(Boolean)
  markDirty()
}

function addWorkflowStep() {
  if (!activeScenario.value) return
  activeScenario.value.workflow = activeScenario.value.workflow.concat(['新步骤'])
  markDirty()
}

function removeWorkflowStep(i) {
  if (!activeScenario.value) return
  activeScenario.value.workflow = activeScenario.value.workflow.filter(function (_, idx) { return idx !== i })
  markDirty()
}

function addPageSection() {
  if (!selectedPage.value) return
  updateSelectedPage(function (p) {
    return Object.assign({}, p, { sections: (p.sections || []).concat(['新区域']) })
  })
}

function removePageSection(i) {
  if (!selectedPage.value) return
  updateSelectedPage(function (p) {
    return Object.assign({}, p, { sections: p.sections.filter(function (_, idx) { return idx !== i }) })
  })
}

function updateSelectedPage(updater) {
  if (!activeScenario.value) return
  var key = activeScenario.value.key
  var design = pageDesignsByScenarioKey.value[key] || { pages: [] }
  var pages = design.pages.map(function (p) {
    return p.key === selectedPageKey.value
      ? updater(Object.assign({}, p, { sections: (p.sections || []).slice() }))
      : p
  })
  pageDesignsByScenarioKey.value = Object.assign({}, pageDesignsByScenarioKey.value, (_g = {}, _g[key] = Object.assign({}, design, { pages: pages }), _g))
  markDirty()
  var _g
}

// ============================================================
// Save & Confirm
// ============================================================
function buildDraft() {
  return {
    roles: editableRoles.value,
    sourceRoles: editableRoles.value.map(function (r) { return { name: r.name, focus: r.focus, tags: splitTags(r.tagText) } }),
    scenarios: editableScenarios.value,
    availableScenarios: editableScenarios.value,
    selectedScenarioKey: activeKey.value,
    modulesByScenarioKey: modulesByScenarioKey.value,
    pageDesignsByScenarioKey: pageDesignsByScenarioKey.value,
    activeKey: activeKey.value,
    savedAt: new Date().toISOString(),
  }
}

function emitDraft() {
  emit('scenario-page-draft-update', buildDraft())
}

function confirmAndNext() {
  var draft = buildDraft()
  emit('scenario-page-confirm', draft)
}
</script>

<style scoped>
.spd-view { margin-top: 16px; }

/* --- Req Summary --- */
.req-summary { border: 1px solid #e2e8f0; border-radius: 8px; background: #f8fafc; margin-bottom: 12px; }
.summary-toggle { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 12px 16px; border: none; background: none; cursor: pointer; font-size: 13px; color: #475569; }
.summary-toggle strong { color: #2563eb; font-size: 12px; }
.summary-body { padding: 0 16px 14px; }
.summary-body p { font-size: 13px; color: #475569; margin-bottom: 8px; }
.summary-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.summary-tags span { background: #dbeafe; color: #1d4ed8; border-radius: 999px; padding: 2px 10px; font-size: 12px; font-weight: 700; }

/* --- Gen Bar --- */
.gen-bar { display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; margin-bottom: 8px; }
.gen-bar strong { color: #0f172a; font-size: 14px; }
.gen-bar p { font-size: 12px; color: #94a3b8; margin: 3px 0 0; }
.gen-btn { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-size: 14px; font-weight: 800; cursor: pointer; white-space: nowrap; }
.gen-btn:disabled { background: #94a3b8; cursor: not-allowed; }
.gen-msg { font-size: 12px; color: #2563eb; margin-bottom: 10px; font-weight: 600; }
.gen-msg.error { color: #dc2626; }

/* --- Layout --- */
.spd-layout { display: grid; grid-template-columns: 260px 1fr; gap: 16px; margin-bottom: 16px; min-height: 420px; }

/* --- Scenario Nav --- */
.scenario-nav { border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; padding: 12px; }
.nav-heading { margin-bottom: 10px; }
.nav-heading span { font-size: 11px; color: #2563eb; font-weight: 900; text-transform: uppercase; }
.nav-heading strong { display: block; color: #0f172a; font-size: 14px; }
.scenario-nav-item { display: flex; align-items: center; gap: 8px; width: 100%; padding: 10px; border: 1px solid transparent; border-radius: 8px; background: #f8fafc; cursor: pointer; text-align: left; margin-bottom: 6px; transition: all 0.15s; }
.scenario-nav-item.active { border-color: #2563eb; background: #eff6ff; }
.scenario-nav-item div { flex: 1; min-width: 0; }
.scenario-nav-item strong { display: block; font-size: 13px; color: #0f172a; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.scenario-nav-item small { font-size: 11px; color: #94a3b8; }
.s-priority { border-radius: 999px; padding: 2px 7px; background: #dbeafe; color: #1d4ed8; font-size: 10px; font-weight: 900; flex-shrink: 0; }
.mini-gen { flex-shrink: 0; border: 1px solid #2563eb; border-radius: 6px; padding: 3px 8px; background: #fff; color: #2563eb; font-size: 12px; cursor: pointer; }
.mini-gen:disabled { opacity: 0.5; cursor: not-allowed; }

/* --- Detail Area --- */
.detail-area { border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; }
.empty-area { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: #94a3b8; }
.empty-area span { font-size: 36px; margin-bottom: 12px; }
.empty-area strong { font-size: 16px; color: #64748b; }

/* --- Tabs --- */
.tab-bar { display: flex; border-bottom: 1px solid #e2e8f0; }
.tab-btn { flex: 1; padding: 12px; border: none; background: #f8fafc; font-size: 13px; font-weight: 700; color: #64748b; cursor: pointer; border-bottom: 2px solid transparent; }
.tab-btn.active { color: #2563eb; background: #fff; border-bottom-color: #2563eb; }

/* --- Tab Content --- */
.tab-content { padding: 16px; }

/* --- Edit Grid --- */
.edit-grid { display: grid; gap: 12px; margin-bottom: 16px; }
.edit-grid.two-col { grid-template-columns: 1fr 1fr; }
.edit-grid label { display: flex; flex-direction: column; gap: 4px; }
.edit-grid label.full { grid-column: 1 / -1; }
.edit-grid span { font-size: 12px; color: #64748b; font-weight: 700; }
.edit-grid input, .edit-grid textarea, .edit-grid select { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 13px; }

/* --- Editable List --- */
.editable-list { display: grid; gap: 6px; margin-bottom: 8px; }
.editable-list label { display: flex; align-items: center; gap: 8px; }
.editable-list span { width: 20px; text-align: center; font-size: 12px; color: #94a3b8; font-weight: 700; }
.editable-list input { flex: 1; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 10px; font-size: 13px; }
.text-btn { border: none; background: none; color: #dc2626; font-size: 16px; cursor: pointer; padding: 0 4px; }

/* --- Module Grid --- */
.module-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.module-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; background: #f8fafc; }
.module-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.module-head strong { font-size: 14px; color: #0f172a; }
.m-priority { border-radius: 999px; padding: 2px 7px; background: #dbeafe; color: #1d4ed8; font-size: 10px; font-weight: 900; }
.module-card p { font-size: 12px; color: #64748b; margin-bottom: 8px; }
.module-card ul { list-style: disc; padding-left: 16px; margin-bottom: 8px; }
.module-card li { font-size: 12px; color: #475569; }
.module-meta { display: flex; flex-wrap: wrap; gap: 8px; }
.module-meta span { font-size: 11px; color: #94a3b8; background: #f1f5f9; border-radius: 4px; padding: 2px 6px; }

.module-next-action { margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0; text-align: center; }
.module-next-action .gen-btn { background: #059669; }
.module-next-action .gen-btn:hover { background: #047857; }

/* --- Page Layout (sub-layout within tab) --- */
.page-layout { display: grid; grid-template-columns: 200px 1fr; gap: 16px; }
.page-list-panel strong { display: block; font-size: 13px; color: #0f172a; margin-bottom: 8px; }
.page-item { display: block; width: 100%; text-align: left; padding: 8px 10px; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; cursor: pointer; margin-bottom: 4px; }
.page-item.active { border-color: #2563eb; background: #eff6ff; }
.page-item strong { font-size: 12px; }
.page-item small { font-size: 10px; color: #94a3b8; }
.page-detail { min-width: 0; }
.detail-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.detail-head strong { font-size: 15px; color: #0f172a; }
.saved-badge { font-size: 12px; color: #2563eb; font-weight: 800; }
.section-area { margin-top: 12px; }
.section-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.section-head h4 { font-size: 13px; color: #0f172a; margin: 0; }
h4 { font-size: 13px; color: #0f172a; margin: 14px 0 8px; }
.full { display: flex; flex-direction: column; gap: 4px; margin-bottom: 10px; }
.full span { font-size: 12px; color: #64748b; font-weight: 700; }
.full textarea, .full input { border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; font-size: 13px; }

/* --- Empty Hero --- */
.empty-hero { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 20px; border: 1px dashed #cbd5e1; border-radius: 8px; background: #f8fafc; text-align: center; }
.empty-hero span { font-size: 48px; margin-bottom: 16px; }
.empty-hero strong { font-size: 18px; color: #0f172a; }
.empty-hero p { font-size: 14px; color: #64748b; margin-top: 8px; max-width: 400px; }

.empty-hint { border: 1px dashed #e2e8f0; border-radius: 8px; padding: 32px; text-align: center; color: #94a3b8; }
.empty-hint strong { display: block; font-size: 14px; margin-bottom: 6px; }

/* --- Next Action --- */
.next-action { display: flex; justify-content: flex-end; padding: 12px 0; }
.primary-btn { background: #2563eb; color: #fff; border: none; border-radius: 8px; padding: 12px 28px; font-size: 14px; font-weight: 800; cursor: pointer; }
.primary-btn:hover:not(:disabled) { background: #1d4ed8; }

.secondary-btn { background: #fff; color: #2563eb; border: 1px solid #2563eb; border-radius: 6px; padding: 6px 14px; font-size: 12px; font-weight: 700; cursor: pointer; }
.secondary-btn.small { padding: 4px 10px; font-size: 11px; }
</style>
