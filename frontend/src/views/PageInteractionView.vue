<template>
  <section class="interaction-view" aria-labelledby="interaction-title">
    <ViewHeading
      eyebrow="Page Interaction"
      title="页面字段与交互设计模拟工作台"
      title-id="interaction-title"
      description="基于页面清单设计结果，继续细化字段、按钮、校验规则和页面状态。当前仍为前端模拟数据。"
    />

    <section v-if="scenarioPageGroups.length" class="scenario-page-overview" aria-label="页面设计全量场景页面">
      <div class="panel-heading">
        <span>页面设计输出</span>
        <strong>{{ scenarioPageGroups.length }} 个场景 / {{ savedPageList.length }} 个页面</strong>
      </div>
      <div class="scenario-page-grid">
        <article
          v-for="scenario in scenarioPageGroups"
          :key="scenario.key"
          class="scenario-page-card"
          :class="{ active: scenario.key === selectedScenarioKey }"
          tabindex="0"
          @click="selectScenario(scenario.key)"
          @keydown.enter.prevent="selectScenario(scenario.key)"
          @keydown.space.prevent="selectScenario(scenario.key)"
        >
          <div>
            <span>{{ scenario.priority }}</span>
            <strong>{{ scenario.name }}</strong>
            <small>{{ scenario.pages.length }} 个页面</small>
          </div>
        </article>
      </div>
    </section>

    <div class="interaction-layout">
      <article class="page-selector">
        <div class="panel-heading">
          <span>页面选择</span>
          <strong>{{ selectedScenario?.name || '选择一个场景' }}</strong>
        </div>

        <div class="page-options">
          <button
            v-for="page in recommendedPages"
            :key="page.key"
            type="button"
            class="page-option"
            :class="{ active: page.key === selectedPage.key }"
            @click="selectedKey = page.key"
          >
            <strong>{{ page.name }}</strong>
          </button>
        </div>
      </article>

      <article class="interaction-detail">
        <div class="interaction-detail-head">
          <div>
            <span class="detail-label">当前页面</span>
            <h3>{{ selectedPage.name }}</h3>
            <p v-if="selectedPageDesign?.goal">{{ selectedPageDesign.goal }}</p>
          </div>
          <button class="gen-btn" type="button" :disabled="isGeneratingInteraction || !selectedPageDesign" @click="generateInteractionForSelectedPage">
            {{ isGeneratingInteraction ? '生成中...' : hasGeneratedInteraction ? '重新生成' : '生成' }}
          </button>
        </div>
        <p v-if="interactionMessage" class="interaction-message" :class="{ error: interactionError }">{{ interactionMessage }}</p>

        <div v-if="!hasGeneratedInteraction" class="empty-placeholder interaction-placeholder">
          <strong>待生成当前页面交互设计</strong>
          <p>点击“生成”后，系统会根据当前页面的页面目标、承载功能、页面区域和文件建议调用大模型，生成字段设计、按钮与动作、校验规则和页面状态。</p>
        </div>

        <section v-else class="field-table" aria-label="字段设计">
          <h4>字段设计</h4>
          <div class="field-row header">
            <span>字段</span>
            <span>类型</span>
            <span>必填</span>
            <span>说明</span>
          </div>
          <div v-for="field in selectedPage.fields" :key="field.name" class="field-row">
            <span>{{ field.label }}</span>
            <span>{{ field.type }}</span>
            <span>{{ field.required ? '是' : '否' }}</span>
            <span>{{ field.description }}</span>
          </div>
        </section>
      </article>
    </div>

    <div v-if="hasGeneratedInteraction" class="interaction-grid">
      <article class="interaction-card">
        <span>按钮与动作</span>
        <div class="action-list">
          <section v-for="action in selectedPage.actions" :key="action.label" class="action-item">
            <h4>{{ action.label }}</h4>
            <p><strong>触发：</strong>{{ action.trigger }}</p>
            <p><strong>反馈：</strong>{{ action.feedback }}</p>
          </section>
        </div>
      </article>

      <article class="interaction-card">
        <span>校验规则</span>
        <ul>
          <li v-for="rule in selectedPage.validations" :key="rule">{{ rule }}</li>
        </ul>
      </article>

      <article class="interaction-card">
        <span>页面状态</span>
        <dl>
          <div v-for="(value, key) in selectedPage.states" :key="key">
            <dt>{{ stateLabels[key] || key }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
      </article>
    </div>

    <section class="common-rules" aria-labelledby="common-rules-title">
      <div class="panel-heading">
        <span>通用交互规范</span>
        <strong id="common-rules-title">后续页面生成都要遵守</strong>
      </div>
      <ul>
        <li v-for="rule in interactionData.commonRules" :key="rule">{{ rule }}</li>
      </ul>
    </section>

    <div class="next-action">
      <button class="primary-button" type="button" @click="confirmAndNext">
        确认并进入下一步
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { pageInteractionMock } from '../data/pageInteractionMock'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['interaction-confirm', 'interaction-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const interactionData = pageInteractionMock
const generatedPagesByKey = ref({})
const selectedScenarioKey = ref('')
const isGeneratingInteraction = ref(false)
const interactionMessage = ref('')
const interactionError = ref(false)

const savedPageDesignResult = computed(() => props.projectContext.pageDesignResult || props.projectContext.stepResults?.page || null)

const savedPageDesign = computed(() => savedPageDesignResult.value?.pageDesign || null)

const savedPageList = computed(() => {
  if (savedPageDesign.value?.pages?.length) {
    return savedPageDesign.value.pages
  }

  return props.projectContext.selectedPageDesign ? [props.projectContext.selectedPageDesign] : []
})

const savedPagesByOriginalKey = computed(() => {
  return savedPageList.value.reduce((result, page) => {
    if (page.originalPageKey) {
      result[page.originalPageKey] = page
    }
    if (page.key) {
      result[page.key] = page
    }
    return result
  }, {})
})

const scenarioPageGroups = computed(() => {
  const summaries = savedPageDesignResult.value?.scenarioSummaries || []
  if (summaries.length) {
    return summaries.map((scenario) => ({
      ...scenario,
      pages: (scenario.pages || []).map((page, index) => withScenarioPageKey(mergeSavedPageIdentity(page, scenario, index), scenario, index)),
    }))
  }

  if (!savedPageList.value.length) {
    return []
  }

  return [
    {
      key: 'all-pages',
      name: '全部页面',
      priority: 'ALL',
      pages: savedPageList.value.map((page, index) => withScenarioPageKey(mergeSavedPageIdentity(page, { key: 'all-pages', name: '全部页面' }, index), { key: 'all-pages', name: '全部页面' }, index)),
    },
  ]
})

const selectedScenario = computed(() => scenarioPageGroups.value.find((scenario) => scenario.key === selectedScenarioKey.value) || scenarioPageGroups.value[0] || null)

const selectedScenarioPages = computed(() => selectedScenario.value?.pages || [])

const recommendedPages = computed(() => {
  if (selectedScenarioPages.value.length) {
    return selectedScenarioPages.value
  }

  return []
})

const selectedKey = ref(recommendedPages.value[0]?.key || '')

const stateLabels = {
  empty: '空状态',
  loading: '加载中',
  success: '成功',
  error: '失败',
}

const selectedPage = computed(() => {
  const generatedPage = generatedPagesByKey.value[selectedKey.value]
  if (selectedPageDesign.value) {
    if (generatedPage) {
      return mergeGeneratedInteractionWithPageDesign(generatedPage, selectedPageDesign.value)
    }

    return createEmptyInteractionPage(selectedPageDesign.value)
  }

  if (generatedPage) {
    return generatedPage
  }

  return createEmptyInteractionPage({
    key: '',
    name: '请先完成页面设计',
    goal: '交互设计需要先读取页面设计已确认的场景和页面。',
  })
})

const selectedPageDesign = computed(() => recommendedPages.value.find((item) => item.key === selectedKey.value) || recommendedPages.value[0] || null)

const hasGeneratedInteraction = computed(() => Boolean(generatedPagesByKey.value[selectedKey.value]))

watch(
  scenarioPageGroups,
  (groups) => {
    if (!groups.some((scenario) => scenario.key === selectedScenarioKey.value)) {
      selectedScenarioKey.value = groups[0]?.key || ''
    }
  },
  { immediate: true },
)

watch(
  recommendedPages,
  (items) => {
    if (!items.some((item) => item.key === selectedKey.value)) {
      selectedKey.value = items[0]?.key || ''
    }
  },
  { immediate: true },
)

watch(
  () => props.projectContext.interactionDesignResult || props.projectContext.stepResults?.interaction,
  (result) => {
    const storedPages = result?.generatedPagesByKey || Object.fromEntries((result?.pages || []).map((page) => [page.key, page]))
    generatedPagesByKey.value = storedPages || {}
  },
  { immediate: true },
)

function selectScenario(scenarioKey) {
  selectedScenarioKey.value = scenarioKey
}

function mergeSavedPageIdentity(page, scenario, index = 0) {
  const matched = savedPagesByOriginalKey.value[page.key] || savedPagesByOriginalKey.value[page.originalPageKey]
  const mergedPage = {
    ...page,
    ...matched,
  }

  return {
    ...mergedPage,
    name: resolvePageDesignTitle(mergedPage, scenario, index),
  }
}

function isTechnicalPageTitle(value) {
  const text = String(value || '').trim()
  return !text
    || /\.vue\b/i.test(text)
    || /^[A-Z][A-Za-z0-9]+$/.test(text)
    || /^(VehicleDispatch|StatisticsDashboard|DriverTask|GateCheck|VehicleReservation|NavigationOverlay|ArrivalConfirmModal|TaskCompletionForm)$/.test(text)
}

function resolvePageDesignTitle(page, scenario, index = 0) {
  if (!isTechnicalPageTitle(page?.name)) {
    return page.name
  }

  if (index === 0 && scenario?.name) {
    return `${scenario.name}工作台`
  }

  const sourceText = [
    page?.goal || '',
    page?.featureText || '',
    ...(page?.features || []),
    ...(page?.sections || []),
    page?.vueFile || '',
    page?.name || '',
  ].join(' ')
  const titleRules = [
    { keys: ['导航', '路线', '前往', 'NavigationOverlay'], title: '导航路线指引页面' },
    { keys: ['到达', '拍照', '签到', '确认', 'ArrivalConfirm'], title: '到达拍照确认页面' },
    { keys: ['完成', '关闭', '装卸', '作业', 'TaskCompletion'], title: '任务完成关闭页面' },
    { keys: ['智能', '匹配', '派车', '下发', 'VehicleDispatch'], title: '智能派车页面' },
    { keys: ['任务状态', '任务列表', '进度', '跟踪', 'DriverTask'], title: '任务跟踪页面' },
    { keys: ['异常', '告警', '处理'], title: '异常处理页面' },
    { keys: ['效率', '利用率', '完成率', '等待时长'], title: '效率分析页面' },
    { keys: ['费用', '外协'], title: '费用分析页面' },
    { keys: ['报表', '导出'], title: '报表导出页面' },
    { keys: ['下钻', '明细'], title: '数据下钻页面' },
    { keys: ['入场', '核验', '门岗', 'GateCheck'], title: '门岗入场核验页面' },
    { keys: ['预约', '申请', 'VehicleReservation'], title: '预约申请页面' },
  ]
  const matchedRule = titleRules.find((rule) => rule.keys.some((key) => sourceText.includes(key)))

  if (matchedRule) {
    return matchedRule.title
  }

  const feature = page?.features?.[0] || splitTextList(page?.featureText)[0]
  if (feature) {
    return `${feature.replace(/^展示|^提供|^支持/, '')}页面`
  }

  return `${scenario?.name || page?.scenarioName || '业务'}页面${index + 1}`
}

function withScenarioPageKey(page, scenario, index) {
  const rawKey = page.key || page.vueFile || `page-${index + 1}`
  return {
    ...page,
    originalPageKey: rawKey,
    scenarioKey: scenario.key,
    scenarioName: scenario.name,
    key: `${scenario.key}-${rawKey}-${index}`,
  }
}

function confirmAndNext() {
  const draft = buildInteractionDraft()
  emit('interaction-confirm', {
    page: selectedPage.value,
    interactionDesign: draft,
  })
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

function mergeGeneratedInteractionWithPageDesign(generatedPage, pageDesign) {
  return {
    ...generatedPage,
    key: pageDesign.key,
    name: pageDesign.name,
    vueFile: pageDesign.vueFile,
    goal: pageDesign.goal,
    features: pageDesign.features || generatedPage.features || [],
    sections: pageDesign.sections || generatedPage.sections || [],
    sourcePageDesign: pageDesign,
  }
}

function buildInteractionDraft() {
  const pages = Object.values(generatedPagesByKey.value)
  return {
    pages,
    generatedPagesByKey: generatedPagesByKey.value,
    scenarioPageGroups: scenarioPageGroups.value,
    pageDesign: savedPageDesignResult.value,
    selectedPage: selectedPage.value,
    savedAt: new Date().toISOString(),
  }
}

function splitTextList(value) {
  return String(value || '')
    .split(/[、,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildFieldsFromPage(page, featureItems, sectionItems) {
  const sourceItems = sectionItems.length ? sectionItems : featureItems
  const fields = sourceItems.slice(0, 5).map((item, index) => ({
    name: `field${index + 1}`,
    label: item,
    type: index === 0 ? '状态/摘要' : '文本/选择',
    required: index < 2,
    description: `支撑「${page.name}」中的${item}展示或录入。`,
  }))

  return fields.length ? fields : [
    {
      name: 'pageGoal',
      label: '页面目标',
      type: '文本',
      required: true,
      description: page.goal || `说明「${page.name}」的核心业务目标。`,
    },
  ]
}

function buildActionsFromPage(page) {
  return [
    {
      label: '查询/刷新',
      trigger: '进入页面或点击刷新按钮',
      feedback: `更新「${page.name}」的最新业务数据。`,
    },
    {
      label: '保存当前处理结果',
      trigger: '点击主操作按钮',
      feedback: '校验必填信息后保存，并提示同步成功或失败原因。',
    },
  ]
}

function buildValidationsFromPage(page) {
  return [
    `${page.name} 的关键筛选或处理字段不能为空。`,
    '提交前校验状态流转是否合法，并给出明确错误提示。',
  ]
}

function buildStatesFromPage(page) {
  return {
    empty: `${page.name} 暂无符合条件的数据。`,
    loading: `正在加载 ${page.vueFile} 所需数据。`,
    success: '数据加载完成，可继续处理业务动作。',
    error: '接口或本地数据读取失败，保留重试入口。',
  }
}

function normalizeGeneratedInteraction(revisedOutput) {
  const output = revisedOutput?.interactionDesign || revisedOutput?.pageInteraction || revisedOutput || {}
  const page = selectedPageDesign.value || {}
  const featureItems = page.features?.length ? page.features : splitTextList(page.featureText)
  const sectionItems = page.sections?.length ? page.sections : featureItems

  return {
    key: page.key,
    name: page.name,
    vueFile: page.vueFile,
    fields: Array.isArray(output.fields) && output.fields.length
      ? output.fields.map((field, index) => ({
          name: field.name || `field${index + 1}`,
          label: field.label || field.name || `字段 ${index + 1}`,
          type: field.type || '文本',
          required: Boolean(field.required),
          description: field.description || '由大模型根据当前页面设计生成。',
        }))
      : buildFieldsFromPage(page, featureItems, sectionItems),
    actions: Array.isArray(output.actions) && output.actions.length
      ? output.actions.map((action) => ({
          label: action.label || action.name || '页面操作',
          trigger: action.trigger || '点击按钮',
          feedback: action.feedback || '完成后给出状态反馈。',
        }))
      : buildActionsFromPage(page),
    validations: Array.isArray(output.validations) && output.validations.length
      ? output.validations.map((item) => String(item).trim()).filter(Boolean)
      : buildValidationsFromPage(page),
    states: output.states && typeof output.states === 'object' ? output.states : buildStatesFromPage(page),
    sourcePageDesign: page,
    generatedAt: new Date().toISOString(),
  }
}

function getApiErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') {
    return payload.detail
  }

  return payload?.detail?.message || payload?.message || fallback
}

function getFetchFailureMessage(error) {
  if (error?.name === 'TypeError' || error?.message === 'Failed to fetch') {
    return `未连接到本地 FastAPI。请确认后端运行在 ${API_BASE_URL}。`
  }

  return error?.message || '当前页面交互设计生成失败。'
}

async function generateInteractionForSelectedPage() {
  if (!selectedPageDesign.value) {
    interactionError.value = true
    interactionMessage.value = '请先选择一个页面。'
    return
  }

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    interactionError.value = true
    interactionMessage.value = '请先确认 DeepSeek 已配置，再生成当前页面交互设计。'
    return
  }

  isGeneratingInteraction.value = true
  interactionError.value = false
  interactionMessage.value = `正在生成「${selectedPageDesign.value.name}」的交互设计。`

  try {
    const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_key: 'pageInteractionCurrentPage',
        step_title: '根据当前页面设计生成字段与交互设计',
        instruction: '请根据当前页面的页面目标、承载功能、页面区域、导航结构和文件建议，生成当前页面的交互设计。只返回严格 JSON，字段为 {"interactionDesign":{"fields":[],"actions":[],"validations":[],"states":{}}}。fields 每项包含 name、label、type、required、description；actions 每项包含 label、trigger、feedback；validations 为字符串数组；states 包含 empty、loading、success、error。',
        current_output: {
          scenario: selectedScenario.value ? {
            key: selectedScenario.value.key,
            name: selectedScenario.value.name,
            priority: selectedScenario.value.priority,
          } : null,
          page: selectedPageDesign.value,
          pageGoal: selectedPageDesign.value.goal,
          features: selectedPageDesign.value.features || splitTextList(selectedPageDesign.value.featureText),
          sections: selectedPageDesign.value.sections || [],
          navigation: savedPageDesign.value?.navigation || [],
          fileStructure: savedPageDesign.value?.fileStructure || {},
        },
        project_context: {
          projectName: props.projectContext.projectName,
          customerName: props.projectContext.customerName,
          projectStage: props.projectContext.projectStage,
          sourceRequirement: props.projectContext.sourceRequirement,
        },
      }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.success === false) {
      throw new Error(getApiErrorMessage(payload, '当前页面交互设计生成失败，请检查后端服务和 DeepSeek 配置。'))
    }

    const generatedPage = normalizeGeneratedInteraction(payload.data?.revised_output)
    generatedPagesByKey.value = {
      ...generatedPagesByKey.value,
      [generatedPage.key]: generatedPage,
    }
    emit('interaction-draft-update', buildInteractionDraft())
    interactionMessage.value = `已生成并保存「${generatedPage.name}」的交互设计到本地 interaction.md。`
  } catch (error) {
    interactionError.value = true
    interactionMessage.value = getFetchFailureMessage(error)
  } finally {
    isGeneratingInteraction.value = false
  }
}

</script>

<style scoped>
.interaction-view {
  margin-top: 16px;
}

.interaction-layout {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;
}

.page-selector,
.interaction-detail,
.interaction-card,
.scenario-page-overview,
.common-rules {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.page-selector,
.interaction-detail,
.interaction-card,
.scenario-page-overview,
.common-rules {
  padding: 22px;
}

.scenario-page-overview {
  margin-bottom: 16px;
}

.scenario-page-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.scenario-page-card {
  display: grid;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  cursor: pointer;
}

.scenario-page-card.active {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: inset 0 0 0 1px #93c5fd;
}

.scenario-page-card div {
  display: grid;
  gap: 5px;
}

.scenario-page-card span {
  width: max-content;
  border-radius: 999px;
  padding: 3px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.scenario-page-card strong {
  color: #0f172a;
}

.scenario-page-card small {
  color: #64748b;
  font-weight: 800;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-label,
.interaction-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.page-options {
  display: grid;
  gap: 10px;
}

.page-option {
  display: grid;
  gap: 6px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.page-option.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.page-option strong {
  color: #0f172a;
  font-size: 16px;
}

.page-option small,
.interaction-detail p,
.action-item p,
.interaction-card dd {
  color: #526174;
  line-height: 1.65;
}

.interaction-detail h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 26px;
}

.interaction-detail-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.interaction-generate-button {
  flex: 0 0 104px;
  width: 104px;
  min-width: 104px;
  height: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1;
  white-space: nowrap;
}

.interaction-message {
  margin: 6px 0 0;
  color: #166534;
  font-weight: 900;
}

.interaction-message.error {
  color: #dc2626;
}

.interaction-placeholder {
  margin-top: 18px;
}

.field-table {
  margin-top: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.field-table h4 {
  margin: 0;
  padding: 14px;
  background: #f8fafc;
  color: #0f172a;
}

.field-row {
  display: grid;
  grid-template-columns: 0.75fr 0.75fr 0.55fr minmax(0, 1.7fr);
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding: 12px 14px;
  color: #263244;
  line-height: 1.55;
}

.field-row.header {
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.interaction-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.8fr) minmax(0, 1.1fr);
  gap: 16px;
  margin-top: 16px;
}

.action-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.action-item {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.action-item h4 {
  margin: 0 0 8px;
  color: #0f172a;
}

.action-item p {
  margin: 0 0 6px;
}

.interaction-card ul,
.common-rules ul {
  display: grid;
  gap: 9px;
  margin: 14px 0 0;
  padding-left: 20px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.interaction-card dl {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
}

.interaction-card dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.interaction-card dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.interaction-card dd {
  margin: 0;
}

.common-rules {
  margin-top: 16px;
}

.next-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 920px) {
  .interaction-layout,
  .interaction-grid,
  .scenario-page-grid {
    grid-template-columns: 1fr;
  }

  .interaction-detail-head {
    display: grid;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
