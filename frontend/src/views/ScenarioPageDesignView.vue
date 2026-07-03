<template>
  <section class="spd-view" aria-labelledby="spd-title">
    <ViewHeading
      eyebrow="Scenario → Page"
      title="场景→页面一体化设计工作台"
      title-id="spd-title"
      description="分阶段调用 LLM：先基于 requirement.md 生成业务场景，再逐个场景生成功能模块，最后按模块生成页面设计，避免单次输出过大。"
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
        <p>仅读取 requirement.md 完整内容生成业务场景数量、场景详情和建议页面模块；功能模块与页面设计在场景内逐个生成。</p>
      </div>
      <button class="gen-btn" type="button" :disabled="isGenBusy" @click="generateAllScenarios">
        {{ isGenBusy ? '⏳ 生成中...' : '⚡ 生成业务场景' }}
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
            :disabled="genScenarioKey === s.key"
            @click.stop="generateScenarioDetail(s)"
            :title="'调用大模型生成/更新此场景详情'"
          >
            {{ genScenarioKey === s.key ? '⏳' : '⚡' }}
          </button>
          <button
            class="mini-delete"
            type="button"
            @click.stop="deleteScenario(s)"
            title="删除此业务场景及其功能模块、页面设计"
          >
            ×
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
          <div v-if="!isScenarioDetailReady(activeScenario)" class="stage-action">
            <p>先点击左侧当前业务场景右侧的 ⚡，生成/更新「场景详情」页内容。详情写入成功后，才可继续生成功能模块。</p>
            <button
              class="gen-btn"
              type="button"
              :disabled="genScenarioKey === activeScenario.key"
              @click="generateScenarioDetail(activeScenario)"
            >
              {{ genScenarioKey === activeScenario.key ? '⏳ 生成中...' : '⚡ 生成/更新场景详情' }}
            </button>
          </div>
          <div v-else class="stage-action">
            <p>下一步：基于当前场景详情，单独调用 LLM 生成功能模块设计。</p>
            <button
              class="gen-btn"
              type="button"
              :disabled="genModulesKey === activeScenario.key"
              @click="generateScenarioModules(activeScenario)"
            >
              {{ genModulesKey === activeScenario.key ? '⏳ 生成中...' : '⚡ 生成此场景功能模块' }}
            </button>
          </div>
        </article>

        <!-- Tab: 功能模块 -->
        <article v-if="activeTab === 'modules'" class="tab-content">
          <div v-if="!activeModules(activeScenario).length" class="empty-hint">
            <strong>暂无功能模块</strong>
            <p v-if="!isScenarioDetailReady(activeScenario)">请先在「场景详情」中生成/更新场景详情，再生成功能模块。</p>
            <p v-else>根据当前场景详情单独调用 LLM 生成功能模块，避免和其他场景混在一次请求里导致超时。</p>
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
                  <span v-if="resolveModuleApiHint(m)">接口线索：{{ resolveModuleApiHint(m) }}</span>
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
          <div v-if="!activePages(activeScenario).length" class="empty-hint">
            <strong>暂无页面设计</strong>
            <p>请先在「功能模块」标签页生成模块，再点击底部按钮生成页面设计。</p>
          </div>
          <div v-else class="page-layout">
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

              <div class="full feature-area">
                <span>承载功能</span>
                <p class="feature-summary">{{ derivedFeatureText || '尚未关联功能模块' }}</p>
                <div v-if="mappedModules.length" class="mapped-modules">
                  <div v-for="m in mappedModules" :key="m.key" class="mapped-chip">
                    <strong>{{ m.name }}</strong>
                    <small v-if="m.features?.length">{{ m.features.slice(0, 3).join(' · ') }}{{ m.features.length > 3 ? '…' : '' }}</small>
                  </div>
                </div>
                <input
                  v-if="showFeatureTextInput"
                  v-model.trim="selectedPage.featureText"
                  type="text"
                  class="mt-xs"
                  placeholder="自定义摘要（留空则自动生成）"
                  @input="markDirty"
                />
                <button v-else class="text-btn mt-xs" type="button" @click="showFeatureTextInput = true">✎ 手动编辑摘要</button>
              </div>
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
      <strong>点击「生成业务场景」开始</strong>
      <p>系统将读取 requirement.md 的完整结构化输入，只规划业务场景，不在这一步生成全部模块和页面。</p>
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
const genScenarioKey = ref('')
const genModulesKey = ref('')
const genPagesKey = ref('')

// Core data (mirrors original components' state)
const editableRoles = ref([])          // same as ScenarioIdentificationView
const editableScenarios = ref([])      // same as ScenarioIdentificationView
const pendingRoles = ref([])           // LLM role generation pending dialog
const pendingRoleDialogOpen = ref(false)

// Feature design state (mirrors FeatureDesignView.revisedModulesByScenarioKey)
const modulesByScenarioKey = ref({})
const scenarioDetailReadyByKey = ref({})

// Page design state (mirrors PageDesignView.revisedDesignsByScenarioKey)
const pageDesignsByScenarioKey = ref({})
const scenarioGenerationMeta = ref(null)

// UI state
const activeKey = ref('')
const activeTab = ref('scenario')
const selectedPageKey = ref('')
const dirty = ref(false)
const showFeatureTextInput = ref(false)

let messageClearTimer = null
let activeGenController = null
let draftSaveTimer = null

onUnmounted(() => {
  if (messageClearTimer) clearTimeout(messageClearTimer)
  if (draftSaveTimer) clearTimeout(draftSaveTimer)
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
const requirementStepResult = computed(() =>
  props.projectContext.stepResults?.requirement || {
    projectName: props.projectContext.projectName || '',
    customerName: props.projectContext.customerName || '',
    projectStage: props.projectContext.projectStage || '',
    sourceRequirement: props.projectContext.sourceRequirement || '',
    manualRequirement: props.projectContext.manualRequirement || '',
    attachmentText: props.projectContext.attachmentText || '',
    attachments: props.projectContext.requirementAttachments || [],
    analysis: props.projectContext.requirementAnalysis || null,
  }
)

const requirementAnalysis = computed(() =>
  requirementStepResult.value?.analysis || props.projectContext.requirementAnalysis || {}
)

const requirementText = computed(() => {
  const a = requirementAnalysis.value || {}
  const questionResponses = (a.questionResponses || [])
    .map((item) => `${item.question || '问题'}：${item.answer || ''}`)
    .join(' ')
  const clarificationInsights = (a.clarificationInsights || [])
    .map((item) => `${item.category || '业务补充'}：${item.title || ''}，${item.detail || ''}，场景价值：${item.scenarioValue || ''}`)
    .join(' ')
  return [
    requirementStepResult.value?.sourceRequirement || props.projectContext.sourceRequirement || '',
    requirementStepResult.value?.manualRequirement || '',
    requirementStepResult.value?.attachmentText || '',
    a.businessBackground || '',
    (a.painPoints || []).map((p) => p.description || p).join(' '),
    (a.businessGoals || a.goals || []).join(' '),
    (a.userRoles || []).map((r) => `${r.name}:${r.responsibility}`).join(' '),
    questionResponses,
    clarificationInsights,
  ].join(' ')
})

const requirementSummary = computed(() => {
  const a = requirementAnalysis.value || {}
  return a.businessBackground || '暂无业务背景摘要'
})

const analysisRoles = computed(() => requirementAnalysis.value?.userRoles || [])

const requirementSignature = computed(() => JSON.stringify({
  requirementResult: requirementStepResult.value || null,
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
  scenarioDetailReadyByKey.value = output.scenarioDetailReadyByKey || {}

  // Restore page designs
  if (output.pageDesignsByScenarioKey) {
    pageDesignsByScenarioKey.value = output.pageDesignsByScenarioKey
  }
  scenarioGenerationMeta.value = output.scenarioGenerationMeta || null

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
    scenarioDetailReadyByKey.value = {}
    pageDesignsByScenarioKey.value = {}
    scenarioGenerationMeta.value = null
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

function isScenarioDetailReady(scenario) {
  return Boolean(scenario && scenarioDetailReadyByKey.value[scenario.key])
}

const selectedPage = computed(() => {
  const pages = activePages(activeScenario.value)
  return pages.find((p) => p.key === selectedPageKey.value) || pages[0] || null
})

// Derived: modules that map to this page (by name matching)
const mappedModules = computed(() => {
  const page = selectedPage.value
  if (!page || !activeScenario.value) return []
  const allModules = activeModules(activeScenario.value)
  const featureNames = (page.features || []).map((f) => (f.name || f).toString().trim())
  return allModules.filter((m) => featureNames.includes(m.name.toString().trim()))
})

const derivedFeatureText = computed(() => {
  const page = selectedPage.value
  if (!page) return ''
  // If user has edited manually, prefer that
  if (showFeatureTextInput.value && page.featureText) return page.featureText
  const mods = mappedModules.value
  if (!mods.length) return page.featureText || ''
  // Auto-generate: module names + key descriptions
  return mods.map((m) => {
    const desc = m.description ? `（${m.description.slice(0, 40)}${m.description.length > 40 ? '…' : ''}）` : ''
    return `${m.name}${desc}`
  }).join('；')
})

// Reset feature text input when switching pages
watch(selectedPageKey, () => { showFeatureTextInput.value = false })

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
      apiHint: 'GET/POST /api/' + (scenario.key.split('-')[1] || 'business'),
      apiSuggestion: 'GET/POST /api/' + (scenario.key.split('-')[1] || 'business'),
      scopeNote: '基于场景「' + scenario.name + '」生成',
    }
  })
}

function resolveModuleApiHint(module) {
  return module && (module.apiHint || module.apiSuggestion || module.interfaceHint || '')
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
  const requirementPayload = requirementStepResult.value || {}
  const hasRequirementPayload = Boolean(requirementPayload.analysis || requirementPayload.sourceRequirement || requirementPayload.manualRequirement)

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

  if (!hasRequirementPayload) {
    genError.value = true
    setGenMsg('未读取到 requirement.md 的完整需求拆解结果，请先完成并确认「需求拆解」。', true)
    isGenBusy.value = false
    return
  }

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    genError.value = true
    setGenMsg('生成场景需要调用 LLM。请在顶部切换「大模型生成」并保存 DeepSeek Key 后重试。', true)
    isGenBusy.value = false
    return
  }

  // Step 2: 基于 requirement.md 的完整结构化内容，生成每个业务场景
  try {
    var sResult = await requestLlm(
      'scenarioPageDesignScenarios',
      '场景→页面一体化：基于 requirement.md 完整内容生成业务场景',
      [
        '[全新生成] 忽略当前输出结构，直接返回以下全新JSON。',
        '你将收到上一阶段写入 requirement.md 的完整结构化结果，包括原始需求、附件文本、需求拆解草案、待确认问题回复，以及业务澄清对话整理出的补充信息。',
        '请基于这些完整输入，完成业务场景规划和页面前置设计，不要只按角色机械生成。',
        '必须充分使用 analysis.questionResponses 与 analysis.clarificationInsights 中的补充信息，把接口方式、弱网/移动端、异常阈值、费用口径、系统集成等内容转化为具体场景、流程步骤和页面模块。',
        '返回严格JSON：{"roles":[{"name":"角色名","focus":"职责边界","tags":["标签1"]}],"scenarios":[{"key":"sc-序号","name":"场景名称（要具体，如\\"调度员现场调度派车与异常处理\\"）","priority":"P0或P1","description":"详细场景说明（30字以上，描述该角色在什么业务触发条件下完成什么目标）","workflow":["触发/进入","查看/判断","操作/协同","确认/留痕"],"pageMapping":{"role":"对应角色名","page":"建议的Vue文件名.vue","modules":["页面模块1","页面模块2","异常处理模块"]}}],"planningNotes":["规划依据1"]}',
        '场景数量由业务复杂度决定：每个核心角色至少一个 P0/P1 场景；如果同一角色存在明显不同闭环，可拆成多个场景。',
        '页面模块名要能直接指导下一步页面设计，避免“管理模块”“查询模块”这类泛化名称。',
        '不要编造 requirement.md 中没有依据的外部系统或规则；推断项要在 description 或 planningNotes 中说明需确认。',
      ].join('\n'),
      {
        requirementMarkdownResult: requirementPayload,
        normalizedRequirementText: requirementText.value.substring(0, 8000),
        rolesFromRequirement: editableRoles.value.map(function (r) { return { name: r.name, focus: r.focus, tags: splitTags(r.tagText) } }),
        existingScenarios: buildScenariosFromRoles(editableRoles.value),
      },
      90000
    )
    if (Array.isArray(sResult.roles) && sResult.roles.length) {
      editableRoles.value = sResult.roles.map(normalizeRoleInput)
    }
    var llmScenarios = (sResult.scenarios || []).map(normalizeScenarioInput)
    if (llmScenarios.length) {
      editableScenarios.value = llmScenarios
      scenarioDetailReadyByKey.value = Object.fromEntries(llmScenarios.map(function (scenario) { return [scenario.key, false] }))
      scenarioGenerationMeta.value = {
        source: 'llm',
        basedOn: 'prototype_factory/local_step_outputs/requirement.md',
        generatedAt: new Date().toISOString(),
        planningNotes: Array.isArray(sResult.planningNotes) ? sResult.planningNotes : [],
        requirementSavedAt: requirementPayload?.savedAt || requirementPayload?.analysis?.savedAt || '',
        requirementProjectName: requirementPayload?.projectName || props.projectContext.projectName || '',
      }
      setGenMsg('已基于 requirement.md 完整内容生成 ' + llmScenarios.length + ' 个场景，并写入 scenariopagedesign.md。')
    } else {
      throw new Error('大模型未返回有效场景')
    }
  } catch (err) {
    genError.value = true
    setGenMsg('LLM 场景生成失败，未更新场景草稿：' + (err.message || ''), true)
    isGenBusy.value = false
    return
  }

  activeKey.value = editableScenarios.value[0] && editableScenarios.value[0].key || ''
  emitDraft()
  isGenBusy.value = false
}

// ============================================================
// Per-scenario: generate/update scenario detail via LLM (Button 2)
// ============================================================
async function generateScenarioDetail(scenario) {
  if (!scenario || genScenarioKey.value) return
  genScenarioKey.value = scenario.key
  genError.value = false
  setGenMsg('正在生成/更新「' + scenario.name + '」的场景详情...')

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    genError.value = true
    setGenMsg('生成场景详情需要调用 LLM。请先配置 DeepSeek Key。', true)
    genScenarioKey.value = ''
    return
  }

  try {
    var result = await requestLlm(
      'scenarioPageDesignScenarioDetail',
      '场景→页面：生成/更新单个业务场景详情',
      [
        '[更新当前场景] 只返回当前目标场景的完整详情 JSON，不要返回功能模块或页面设计。',
        '你将收到 requirement.md 完整输入、全部业务场景摘要，以及当前目标场景草稿。',
        '请基于 requirement.md 中的业务背景、痛点、角色、待确认问题回复、业务澄清补充，生成/更新当前场景详情页内容。',
        '返回严格JSON：',
        '{"scenario":{"key":"保持原key","name":"具体场景名称","priority":"P0或P1","description":"详细场景说明，说明触发条件、角色目标、关键判断和闭环结果","workflow":["步骤1","步骤2","步骤3","步骤4"],"pageMapping":{"role":"对应角色名","page":"建议Vue文件名.vue","modules":["建议页面模块1","建议页面模块2"]}}}',
        '要求：',
        '1. key 必须保持 currentScenario.key，不要改成新 key。',
        '2. description 要比场景列表摘要更具体，能直接支撑后续功能模块设计。',
        '3. workflow 必须体现业务触发、查看判断、操作协同、结果同步/留痕。',
        '4. pageMapping.modules 只是页面模块建议，不要生成详细功能模块字段。',
        '5. 不要生成 pageDesign，不要生成 components，不要生成 API 细节。',
      ].join('\n'),
      {
        requirementMarkdownResult: requirementStepResult.value,
        normalizedRequirementText: requirementText.value.substring(0, 8000),
        allScenarios: editableScenarios.value,
        currentScenario: scenario,
      },
      90000
    )

    var nextScenario = normalizeScenarioInput(Object.assign({}, result.scenario || {}, { key: scenario.key }))
    editableScenarios.value = editableScenarios.value.map(function (item) {
      return item.key === scenario.key ? nextScenario : item
    })
    scenarioDetailReadyByKey.value = Object.assign({}, scenarioDetailReadyByKey.value, (_a = {}, _a[scenario.key] = true, _a))
    modulesByScenarioKey.value = Object.assign({}, modulesByScenarioKey.value, (_b = {}, _b[scenario.key] = [], _b))
    pageDesignsByScenarioKey.value = Object.assign({}, pageDesignsByScenarioKey.value, (_c = {}, _c[scenario.key] = { pages: [] }, _c))
    activeKey.value = scenario.key
    activeTab.value = 'scenario'
    setGenMsg('「' + nextScenario.name + '」的场景详情已生成并写入 scenariopagedesign.md，可继续生成功能模块。')
    emitDraft()
    var _a, _b, _c
  } catch (err) {
    genError.value = true
    setGenMsg('LLM 场景详情生成失败，未更新场景草稿：' + (err.message || ''), true)
  } finally {
    genScenarioKey.value = ''
  }
}

// ============================================================
// Per-scenario: generate function modules via LLM (Button 3)
// ============================================================
async function generateScenarioModules(scenario) {
  if (!scenario || genModulesKey.value) return
  if (!isScenarioDetailReady(scenario)) {
    setGenMsg('请先生成/更新该业务场景的「场景详情」，再生成功能模块。', true)
    return
  }
  genModulesKey.value = scenario.key
  setGenMsg('正在为「' + scenario.name + '」生成功能模块...')

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    genError.value = true
    setGenMsg('生成功能模块需要调用 LLM。请先配置 DeepSeek Key。', true)
    genModulesKey.value = ''
    return
  }

  try {
    var result = await requestLlm(
      'scenarioPageDesignModules',
      '场景→页面：根据单个场景详情生成功能模块',
      [
        '[全新生成] 忽略当前输出结构，直接返回以下全新JSON。',
        '你将收到 requirement.md 完整输入、全部业务场景摘要，以及当前目标场景详情。',
        '请只为当前目标场景生成功能模块，不要生成其他场景的模块，也不要生成页面设计。',
        '当前目标场景：' + scenario.name + '（角色：' + (scenario.pageMapping && scenario.pageMapping.role || '未指定') + '）',
        '场景说明：' + (scenario.description || ''),
        '任务流程：' + (scenario.workflow || []).join(' → '),
        '返回严格JSON：',
        '{"modules":[{"key":"mod-序号","priority":"P0/P1","name":"模块名","description":"模块说明（这个模块做什么）","features":["功能点1","功能点2"],"pageSuggestion":"建议的Vue页面文件名","apiHint":"接口线索，如 GET /api/vehicles 查询车辆列表，不要展开完整请求响应契约","dataNeeds":["需要的数据1"],"stateRules":["状态/异常规则1"]}]}',
        '重要要求：',
        '1. 模块数量不要固定，根据该场景职责复杂度决定。',
        '2. 模块名要具体，如“车辆实时地图监控”“异常告警分级处理”。',
        '3. 每个模块 features 列出 2-4 个真实操作能力。',
        '4. dataNeeds/stateRules 要吸收 requirement.md 中的待确认回复和业务澄清补充。',
        '5. apiHint 只输出接口方向或候选路径，正式字段、参数、响应和错误码由下一步“交互与API”生成。',
        '6. 如果某些规则来自推断，请在 description 或 stateRules 中标注“建议确认”。',
      ].join('\n'),
      {
        requirementMarkdownResult: requirementStepResult.value,
        normalizedRequirementText: requirementText.value.substring(0, 6000),
        allScenarios: editableScenarios.value,
        targetScenario: scenario,
        existingModules: buildModules(scenario),
      },
      90000
    )

    if (result.modules && result.modules.length) {
      var normalizedModules = result.modules.map(normalizeGeneratedModule)
      modulesByScenarioKey.value = Object.assign({}, modulesByScenarioKey.value, (_a = {}, _a[scenario.key] = normalizedModules, _a))
      setGenMsg('「' + scenario.name + '」的功能模块已生成，共 ' + result.modules.length + ' 个模块，并写入 scenariopagedesign.md。')
    } else {
      throw new Error('大模型未返回有效模块')
    }
    var _a
  } catch (err) {
    genError.value = true
    setGenMsg('LLM 模块生成失败，未更新场景草稿：' + (err.message || ''), true)
    genModulesKey.value = ''
    return
  }

  activeTab.value = 'modules'
  dirty.value = false
  emitDraft()
  genModulesKey.value = ''
}

function normalizeGeneratedModule(module, index) {
  var apiHint = resolveModuleApiHint(module)
  return Object.assign({}, module, {
    key: module.key || 'mod-' + (index + 1),
    priority: module.priority || 'P1',
    features: Array.isArray(module.features) ? module.features : splitTags(module.features),
    dataNeeds: Array.isArray(module.dataNeeds) ? module.dataNeeds : splitTags(module.dataNeeds),
    stateRules: Array.isArray(module.stateRules) ? module.stateRules : splitTags(module.stateRules),
    apiHint: apiHint,
    apiSuggestion: module.apiSuggestion || apiHint,
  })
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

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    genError.value = true
    setGenMsg('生成页面设计需要调用 LLM。请先配置 DeepSeek Key。', true)
    genPagesKey.value = ''
    return
  }

  try {
    var result = await requestLlm(
      'scenarioPageDesignPages',
      '场景→页面：根据单个场景功能模块生成页面设计',
      [
        '[全新生成] 忽略当前输出结构，直接返回以下全新JSON。',
        '你将收到 requirement.md 完整输入、当前目标场景，以及该场景已经生成的功能模块。',
        '请只为当前场景生成详细页面设计，不要生成代码，不要生成其他场景页面。',
        '当前目标场景：' + scenario.name + '（角色：' + (scenario.pageMapping && scenario.pageMapping.role || '未指定') + '）',
        '已生成的功能模块：' + JSON.stringify(modules.map(function (m) { return { name: m.name, description: m.description, features: m.features, apiHint: resolveModuleApiHint(m), dataNeeds: m.dataNeeds, stateRules: m.stateRules } })),
        '返回严格JSON：',
        '{"pageDesign":{"pages":[{"key":"page-序号","priority":"P0/P1","type":"工作台页|列表页|详情页|看板页","name":"页面名","vueFile":"xxx.vue","goal":"页面目标（一句话）","features":["承载的功能模块名"],"sections":["页面布局区域"],"states":["正常态","空态","加载态","异常态"],"keyInteractions":["关键交互1"],"dataInputs":["数据输入1"]}],"navigation":[{"label":"导航标签","target":"vue文件","default":true}],"fileStructure":{"views":["vue文件"],"components":["组件"],"data":["mock数据文件"]}}}',
        '重要要求：',
        '1. 页面数量由模块复杂度决定，不要固定为1个。',
        '2. page.features 必须对应上一步功能模块名称。',
        '3. sections/states/keyInteractions/dataInputs 要足够具体，能支撑下一步交互与 API 设计。',
        '4. 每个页面承载的模块不宜超过 4 个；模块流程分界明显时拆页。',
      ].join('\n'),
      {
        requirementMarkdownResult: requirementStepResult.value,
        targetScenario: scenario,
        modules: modules,
        existingPageDesign: buildPageDesign(scenario),
      },
      90000
    )

    if (result.pageDesign) {
      pageDesignsByScenarioKey.value = Object.assign({}, pageDesignsByScenarioKey.value, (_a = {}, _a[scenario.key] = result.pageDesign, _a))
      setGenMsg('「' + scenario.name + '」的页面设计已生成，并写入 scenariopagedesign.md。')
    } else {
      throw new Error('大模型未返回有效页面设计')
    }
    var _a
  } catch (err) {
    genError.value = true
    setGenMsg('LLM 页面设计生成失败，未更新场景草稿：' + (err.message || ''), true)
    genPagesKey.value = ''
    return
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
function selectScenario(key) { activeKey.value = key; activeTab.value = 'scenario' }
function scheduleDraftSave() {
  if (draftSaveTimer) clearTimeout(draftSaveTimer)
  draftSaveTimer = setTimeout(function () {
    emitDraft()
    draftSaveTimer = null
  }, 600)
}

function markDirty() {
  dirty.value = true
  scheduleDraftSave()
}

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

function deleteScenario(scenario) {
  if (!scenario) return
  var ok = window.confirm('确认删除「' + scenario.name + '」吗？该场景的场景详情、功能模块和页面设计会一并删除，并同步更新 scenariopagedesign.md。')
  if (!ok) return

  editableScenarios.value = editableScenarios.value.filter(function (item) { return item.key !== scenario.key })

  var nextModules = Object.assign({}, modulesByScenarioKey.value)
  var nextPages = Object.assign({}, pageDesignsByScenarioKey.value)
  var nextReady = Object.assign({}, scenarioDetailReadyByKey.value)
  delete nextModules[scenario.key]
  delete nextPages[scenario.key]
  delete nextReady[scenario.key]
  modulesByScenarioKey.value = nextModules
  pageDesignsByScenarioKey.value = nextPages
  scenarioDetailReadyByKey.value = nextReady

  if (activeKey.value === scenario.key) {
    activeKey.value = editableScenarios.value[0]?.key || ''
    selectedPageKey.value = activePages(activeScenario.value)[0]?.key || ''
    activeTab.value = activeKey.value ? 'scenario' : 'scenario'
  }

  dirty.value = false
  emitDraft()
  setGenMsg('已删除「' + scenario.name + '」，并同步更新 scenariopagedesign.md。')
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
    scenarioDetailReadyByKey: scenarioDetailReadyByKey.value,
    pageDesignsByScenarioKey: pageDesignsByScenarioKey.value,
    requirementInputSnapshot: requirementStepResult.value,
    scenarioGenerationMeta: scenarioGenerationMeta.value,
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
.mini-delete { flex-shrink: 0; border: 1px solid #fecaca; border-radius: 6px; padding: 3px 8px; background: #fff; color: #dc2626; font-size: 13px; font-weight: 900; cursor: pointer; }
.mini-delete:hover { background: #fef2f2; }

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

.stage-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 14px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 12px;
  background: #f8fbff;
}

.stage-action p {
  margin: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.55;
}

/* --- Feature Area --- */
.feature-area { display: flex; flex-direction: column; gap: 6px; }
.feature-area > span { color: #2563eb; font-size: 12px; font-weight: 900; }

.feature-summary {
  margin: 0;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #334155;
  font-size: 13px;
  line-height: 1.6;
}

.mapped-modules {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.mapped-chip {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 6px 10px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 6px;
  max-width: 260px;
}

.mapped-chip strong {
  color: #1d4ed8;
  font-size: 12px;
}

.mapped-chip small {
  color: #64748b;
  font-size: 11px;
  line-height: 1.3;
}

.mt-xs { margin-top: 6px; }
.text-btn { background: none; border: none; color: #2563eb; font-size: 12px; font-weight: 600; cursor: pointer; padding: 0; }
.text-btn:hover { text-decoration: underline; }
</style>
