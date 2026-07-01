<template>
  <section class="page-design-view" aria-labelledby="page-design-title">
    <ViewHeading
      eyebrow="Page Design"
      title="页面设计工作台"
      title-id="page-design-title"
      description="基于已确认的业务场景和功能模块，生成、查看并修订页面清单、导航结构、文件结构建议和当前页面详情。"
    />

    <section class="scenario-tabs-panel" aria-label="上一步结果业务场景">
      <div class="panel-heading compact">
        <span>上一步结果</span>
        <strong>全部业务场景</strong>
      </div>

      <div class="scenario-tabs" role="tablist" aria-label="业务场景 tabs">
        <article
          v-for="scenario in visibleScenarioTabs"
          :key="scenario.key"
          role="tab"
          tabindex="0"
          class="scenario-tab"
          :aria-selected="scenario.key === activeScenarioKey"
          :class="{ active: scenario.key === activeScenarioKey }"
          @click="selectScenario(scenario.key)"
          @keydown.enter.prevent="selectScenario(scenario.key)"
          @keydown.space.prevent="selectScenario(scenario.key)"
        >
          <button
            class="scenario-generate-button"
            type="button"
            :disabled="generatingScenarioKey === scenario.key"
            @click.stop="generateScenarioPageDesign(scenario)"
          >
            {{ generatingScenarioKey === scenario.key ? '生成中' : '生成' }}
          </button>
          <span class="priority-tag">{{ scenario.priority || 'P1' }}</span>
          <strong>{{ scenario.name }}</strong>
          <small>{{ scenario.pageMapping?.role || '未指定角色' }}</small>
        </article>
      </div>
      <p v-if="scenarioGenerationMessage" class="scenario-generation-message" :class="{ error: scenarioGenerationError }">
        {{ scenarioGenerationMessage }}
      </p>
    </section>

    <div class="page-layout">
      <article class="page-list-panel">
        <div class="panel-heading page-list-heading">
          <span>页面清单 <b>{{ currentScenarioDesign.pages.length }}</b></span>
        </div>

        <div v-if="currentScenarioDesign.pages.length" class="page-list">
          <button
            v-for="page in currentScenarioDesign.pages"
            :key="page.key"
            type="button"
            class="page-button accordion-page"
            :class="{ active: page.key === selectedPageKey }"
            @click="selectedPageKey = page.key"
          >
            <span class="accordion-head">
              <span v-if="page.key === selectedPageKey" class="priority-tag">{{ page.priority }}</span>
              <strong>{{ page.name }}</strong>
            </span>
            <small v-if="page.key === selectedPageKey">{{ page.type }} / {{ page.vueFile }}</small>
          </button>
        </div>
        <div v-else class="empty-placeholder">
          <strong>待生成页面清单</strong>
          <p>点击上方当前业务场景卡片的“生成”后，页面清单会在这里展示。</p>
        </div>
      </article>

      <article v-if="selectedPage" class="page-detail-panel">
        <div class="panel-heading with-action">
          <div>
            <span>当前页面</span>
            <strong>{{ selectedPage.name }}</strong>
          </div>
          <span class="saved-status">{{ savedMessage }}</span>
        </div>

        <div class="edit-grid">
          <label>
            <span>页面名称</span>
            <input v-model.trim="selectedPage.name" type="text" @input="markUnsaved" />
          </label>
          <label>
            <span>页面类型</span>
            <input v-model.trim="selectedPage.type" type="text" @input="markUnsaved" />
          </label>
          <label>
            <span>Vue 文件</span>
            <input v-model.trim="selectedPage.vueFile" type="text" @input="markUnsaved" />
          </label>
          <label>
            <span>优先级</span>
            <input v-model.trim="selectedPage.priority" type="text" @input="markUnsaved" />
          </label>
        </div>

        <label class="full-field">
          <span>页面目标</span>
          <textarea v-model.trim="selectedPage.goal" rows="3" @input="markUnsaved"></textarea>
        </label>

        <label class="full-field">
          <span>承载功能</span>
          <input v-model.trim="selectedPage.featureText" type="text" placeholder="用顿号或逗号分隔" @input="markUnsaved" />
        </label>

        <section class="section-list" aria-label="页面区域">
          <div class="section-list-head">
            <div>
              <h4>页面区域</h4>
              <p>根据左侧当前选中页面生成，并自动更新到本页 Markdown。</p>
            </div>
            <div class="section-actions">
              <button class="secondary-button small" type="button" :disabled="isGeneratingSections" @click="generateSectionsForSelectedPage">
                {{ isGeneratingSections ? '生成中...' : '调用大模型生成' }}
              </button>
              <button class="secondary-button small" type="button" @click="addSection">新增区域</button>
            </div>
          </div>
          <p v-if="sectionMessage" class="section-message" :class="{ error: sectionError }">{{ sectionMessage }}</p>
          <div v-if="selectedPage.sections?.length" class="editable-list">
            <label v-for="(section, index) in selectedPage.sections" :key="index">
              <span>{{ index + 1 }}</span>
              <input v-model.trim="selectedPage.sections[index]" type="text" @input="markUnsaved" />
              <button class="text-button" type="button" @click="removeSection(index)">移除</button>
            </label>
          </div>
          <div v-else class="empty-placeholder compact-placeholder">
            <strong>待生成页面区域</strong>
            <p>点击“调用大模型生成”后，当前页面的区域设计会在这里展示。</p>
          </div>
        </section>
      </article>
      <article v-else class="page-detail-panel empty-detail-panel">
        <div class="empty-placeholder">
          <strong>待生成当前页面</strong>
          <p>先在上方选择业务场景并点击“生成”，系统会基于第 03 步功能模块映射生成页面清单和当前页面基础信息。</p>
        </div>
      </article>
    </div>

    <section class="design-context-panel" aria-label="页面设计上下文输出">
      <article class="output-box">
        <div class="panel-heading compact">
          <span>导航结构</span>
          <strong>供后续页面跳转和原型导航使用</strong>
        </div>
        <ol v-if="currentScenarioDesign.navigation.length" class="navigation-list">
          <li v-for="item in currentScenarioDesign.navigation" :key="`${item.label}-${item.target}`">
            <strong>{{ item.label }}</strong>
            <span>{{ item.target }}</span>
            <small v-if="item.default">默认入口</small>
          </li>
        </ol>
        <div v-else class="empty-placeholder compact-placeholder">
          <strong>待生成导航结构</strong>
          <p>点击上方业务场景卡片的“生成”后，系统会根据页面清单生成导航入口。</p>
        </div>
      </article>

      <article class="output-box">
        <div class="panel-heading compact">
          <span>文件建议</span>
          <strong>供前端原型方案生成 Vue 文件、组件和 mock 数据</strong>
        </div>
        <div v-if="fileStructureGroups.some((group) => group.items.length)" class="file-structure-grid">
          <section v-for="group in fileStructureGroups" :key="group.key">
            <span>{{ group.label }}</span>
            <ul>
              <li v-for="item in group.items" :key="item">{{ item }}</li>
            </ul>
          </section>
        </div>
        <div v-else class="empty-placeholder compact-placeholder">
          <strong>待生成文件建议</strong>
          <p>生成页面方案后，这里会展示 views、components 和 data 文件建议。</p>
        </div>
      </article>
    </section>

    <LlmStepRevisionPanel
      class="bottom-revision-panel"
      :step="pageRevisionStep"
      :step-output="currentRevisionOutput"
      :project-context="projectContext"
      @revision-applied="handlePageRevisionApplied"
    />

    <section class="context-handoff" aria-label="页面设计结果保存">
      <div>
        <span>本地保存</span>
        <strong>保存页面设计成果，供下一步交互设计导入</strong>
        <p>确认时会自动保存本页全部关键内容，包括业务场景、页面清单、导航结构、文件建议和页面区域。</p>
        <p v-if="localSaveMessage" class="local-save-message">{{ localSaveMessage }}</p>
      </div>
      <div class="action-row">
        <button class="primary-button" type="button" @click="confirmAndNext">
          确认并进入下一步
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import LlmStepRevisionPanel from '../components/LlmStepRevisionPanel.vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['page-design-confirm', 'page-design-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const pageRevisionStep = {
  key: 'pageDesignScenarioPages',
  resultKey: 'page',
  title: '基于当前业务场景修改页面设计结果',
}

const activeScenarioKey = ref('')
const selectedPageKey = ref('')
const revisedDesignsByScenarioKey = ref({})
const savedMessage = ref('尚未保存')
const isGeneratingSections = ref(false)
const generatingScenarioKey = ref('')
const sectionMessage = ref('')
const sectionError = ref(false)
const localSaveMessage = ref('')
const sectionGenerationSource = ref('initial')
const scenarioGenerationMessage = ref('')
const scenarioGenerationError = ref(false)

const availableScenarios = computed(() => {
  const selectedScenario = props.projectContext.selectedScenario

  if (selectedScenario?.availableScenarios?.length) {
    return selectedScenario.availableScenarios
  }

  const featureMappings = getAllFeatureMappings()

  if (featureMappings.length) {
    return featureMappings.map((item) => item.scenario).filter(Boolean)
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

const visibleScenarioTabs = computed(() => availableScenarios.value)

const activeScenario = computed(() => {
  return availableScenarios.value.find((scenario) => scenario.key === activeScenarioKey.value) || availableScenarios.value[0] || null
})

const activeFeatureModules = computed(() => {
  const mapping = getFeatureMappingForScenario(activeScenario.value)

  if (mapping?.modules?.length) {
    return mapping.modules
  }

  return props.projectContext.selectedFeatureModule ? [props.projectContext.selectedFeatureModule] : []
})

const currentScenarioDesign = computed(() => {
  if (!activeScenario.value) {
    return createEmptyDesign()
  }

  const design = revisedDesignsByScenarioKey.value[activeScenario.value.key]
    || getStoredScenarioDesign(activeScenario.value.key)
    || createEmptyDesign()

  return normalizeScenarioDesignNames(design, activeScenario.value)
})

const selectedPage = computed(() => currentScenarioDesign.value.pages.find((page) => page.key === selectedPageKey.value) || currentScenarioDesign.value.pages[0] || null)

const currentRevisionOutput = computed(() => ({
  scenario: activeScenario.value,
  featureModules: activeFeatureModules.value,
  pageDesign: currentScenarioDesign.value,
  instructionTarget: '请修改 pageDesign 字段，保持 JSON 结构包含 pages、navigation、fileStructure。pages 中每个页面需包含 key、priority、type、name、vueFile、goal、features、sections。',
}))

const fileStructureGroups = computed(() => {
  const fileStructure = currentScenarioDesign.value.fileStructure || {}
  return [
    { key: 'views', label: '页面文件', items: fileStructure.views || [] },
    { key: 'components', label: '组件文件', items: fileStructure.components || [] },
    { key: 'data', label: 'Mock 数据', items: fileStructure.data || [] },
  ]
})

watch(
  currentScenarioDesign,
  (design) => {
    if (!design.pages.some((page) => page.key === selectedPageKey.value)) {
      selectedPageKey.value = design.pages[0]?.key || ''
    }
  },
  { immediate: true },
)

watch(activeScenarioKey, () => {
  savedMessage.value = '尚未保存'
  localSaveMessage.value = ''
  sectionMessage.value = ''
  sectionError.value = false
})

watch(selectedPageKey, () => {
  localSaveMessage.value = ''
  sectionMessage.value = ''
  sectionError.value = false
})

function selectScenario(scenarioKey) {
  activeScenarioKey.value = scenarioKey
}


function createEmptyDesign() {
  return {
    pages: [],
    navigation: [],
    fileStructure: {
      views: [],
      components: [],
      data: [],
    },
  }
}

function getAllFeatureMappings() {
  const directMappings = props.projectContext.allFeatureMappings || []
  const featureResultMappings = props.projectContext.stepResults?.feature?.allMappings || []
  const featureResultScenarioMappings = props.projectContext.stepResults?.feature?.scenarioMappings || []

  if (directMappings.length) {
    return directMappings
  }

  if (featureResultMappings.length) {
    return featureResultMappings
  }

  if (featureResultScenarioMappings.length) {
    return featureResultScenarioMappings
  }

  return []
}

function getFeatureMappingForScenario(scenario) {
  if (!scenario) {
    return null
  }

  return getAllFeatureMappings().find((item) => item.scenario?.key === scenario.key) || null
}

function getStoredScenarioDesign(scenarioKey) {
  if (!scenarioKey) {
    return null
  }

  const savedPageResult = props.projectContext.pageDesignResult || props.projectContext.stepResults?.page || {}
  const savedDesigns = props.projectContext.allPageDesigns
    || savedPageResult.scenarioDesigns
    || {}

  const design = savedDesigns[scenarioKey] || null
  if (!design) {
    return null
  }

  const savedPage = savedPageResult.currentPage || savedPageResult.page
  const savedSections = savedPageResult.currentPageSections || savedPage?.sections || []
  const savedScenarioKey = savedPageResult.currentScenarioKey || savedPageResult.scenario?.key || savedPage?.scenarioKey || ''
  if (!savedPage || !savedSections.length || (savedScenarioKey && savedScenarioKey !== scenarioKey)) {
    return design
  }

  const pages = (design.pages || []).map((page) => {
    const isSamePage = (savedPage.key && page.key === savedPage.key)
      || (savedPage.vueFile && page.vueFile === savedPage.vueFile)
      || (savedPage.name && page.name === savedPage.name)

    if (!isSamePage || page.sections?.length) {
      return page
    }

    return {
      ...page,
      sections: savedSections,
    }
  })

  return {
    ...design,
    pages,
  }
}

function ensureActiveScenarioDesign() {
  if (!activeScenario.value) {
    return
  }

  if (revisedDesignsByScenarioKey.value[activeScenario.value.key] || getStoredScenarioDesign(activeScenario.value.key)) {
    return
  }

  revisedDesignsByScenarioKey.value = {
    ...revisedDesignsByScenarioKey.value,
    [activeScenario.value.key]: buildScenarioDesign(activeScenario.value, activeFeatureModules.value),
  }
}

function getActiveScenarioDesignSource() {
  if (!activeScenario.value) {
    return createEmptyDesign()
  }

  return revisedDesignsByScenarioKey.value[activeScenario.value.key]
    || getStoredScenarioDesign(activeScenario.value.key)
    || buildScenarioDesign(activeScenario.value, activeFeatureModules.value)
}

function updateSelectedPageInActiveDesign(updater) {
  if (!activeScenario.value) {
    return null
  }

  const design = normalizeScenarioDesignNames(getActiveScenarioDesignSource(), activeScenario.value)
  const targetPageKey = selectedPageKey.value || design.pages[0]?.key || ''
  let updatedPage = null
  const pages = design.pages.map((page) => {
    if (page.key !== targetPageKey) {
      return page
    }

    updatedPage = syncPageFeatures(updater({
      ...page,
      sections: [...(page.sections || [])],
    }))
    return updatedPage
  })

  if (!updatedPage) {
    return null
  }

  revisedDesignsByScenarioKey.value = {
    ...revisedDesignsByScenarioKey.value,
    [activeScenario.value.key]: {
      ...design,
      pages,
    },
  }

  selectedPageKey.value = updatedPage.key
  return updatedPage
}

function toPascalCase(value) {
  const text = String(value || 'Scenario').replace(/[^a-zA-Z0-9一-龥]/g, ' ')
  const ascii = text.match(/[a-zA-Z0-9]+/g)

  if (ascii?.length) {
    return ascii.map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join('')
  }

  return 'Scenario'
}

function getDomainPrefix() {
  const text = [
    props.projectContext.sourceRequirement || '',
    props.projectContext.requirementAnalysis?.businessBackground || '',
    activeScenario.value?.name || '',
    activeScenario.value?.description || '',
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

function createScenarioVueFile(scenario, module, index = 0) {
  const rawSuggestion = module?.pageSuggestion || scenario?.pageMapping?.page || ''
  const genericSuggestions = new Set([
    'VehicleScenarioView.vue',
    'MaterialScenarioView.vue',
    'ScheduleScenarioView.vue',
    'BusinessScenarioView.vue',
    'ScenarioWorkspaceView.vue',
  ])

  if (rawSuggestion.endsWith('.vue') && !genericSuggestions.has(rawSuggestion)) {
    return rawSuggestion
  }

  const source = [
    scenario?.name || '',
    scenario?.description || '',
    scenario?.pageMapping?.role || '',
    ...(scenario?.workflow || []),
    ...(scenario?.pageMapping?.modules || []),
    ...(module?.features || []),
  ].join(' ')
  const pageName = toBusinessPageName(source)
  const suffix = index > 0 ? `${index + 1}` : ''
  return `${getDomainPrefix()}${pageName}${suffix}View.vue`
}

function isGenericEnglishPageName(value) {
  const text = String(value || '').trim()
  return /\.vue\b/i.test(text)
    || /^[A-Z][A-Za-z0-9]+$/.test(text)
    || /^(VehicleDispatch|StatisticsDashboard|DriverTask|GateCheck|VehicleReservation|NavigationOverlay|ArrivalConfirmModal|TaskCompletionForm)$/.test(text)
}

function inferChinesePageTitle(page, scenario, module, index = 0) {
  if (module?.pageTitleSuggestion) {
    return module.pageTitleSuggestion
  }

  const moduleName = String(module?.name || '').replace(/模块$/, '')
  if (index === 0 && scenario?.name) {
    return `${scenario.name}工作台`
  }

  if (moduleName) {
    return `${moduleName}页面`
  }

  const sourceText = [
    page?.goal || '',
    page?.featureText || '',
    ...(page?.features || []),
    ...(page?.sections || []),
  ].join(' ')
  const titleRules = [
    { keys: ['导航', '路线', '前往'], title: '导航路线指引页面' },
    { keys: ['到达', '拍照', '签到', '确认'], title: '到达拍照确认页面' },
    { keys: ['完成', '关闭', '装卸', '作业'], title: '任务完成关闭页面' },
    { keys: ['智能', '匹配', '派车', '下发'], title: '智能派车页面' },
    { keys: ['任务状态', '任务列表', '进度', '跟踪'], title: '任务跟踪页面' },
    { keys: ['异常', '告警', '处理'], title: '异常处理页面' },
    { keys: ['效率', '利用率', '完成率', '等待时长'], title: '效率分析页面' },
    { keys: ['费用', '外协'], title: '费用分析页面' },
    { keys: ['报表', '导出'], title: '报表导出页面' },
    { keys: ['下钻', '明细'], title: '数据下钻页面' },
    { keys: ['入场', '核验', '门岗'], title: '门岗入场核验页面' },
    { keys: ['预约', '申请'], title: '预约申请页面' },
  ]
  const matchedRule = titleRules.find((rule) => rule.keys.some((key) => sourceText.includes(key)))

  if (matchedRule) {
    return matchedRule.title
  }

  const feature = page?.features?.[0] || splitTextList(page?.featureText)[0]
  if (feature) {
    return `${feature.replace(/^展示|^提供|^支持/, '')}页面`
  }

  return `${scenario?.name || '业务'}页面${index + 1}`
}

function normalizePageTitle(page, scenario, module, index = 0) {
  if (!page?.name || isGenericEnglishPageName(page.name)) {
    return inferChinesePageTitle(page, scenario, module, index)
  }

  return page.name
}

function normalizeScenarioDesignNames(design, scenario) {
  const mapping = getFeatureMappingForScenario(scenario)
  const modules = mapping?.modules || []
  const pages = (design.pages || []).map((page, index) => {
    const module = modules[index]
    return syncPageFeatures({
      ...page,
      name: normalizePageTitle(page, scenario, module, index),
    })
  })

  return {
    ...design,
    pages,
    navigation: (design.navigation || []).map((item, index) => ({
      ...item,
      label: normalizePageTitle(pages[index] || { name: item.label }, scenario, modules[index], index).replace(/页$/, ''),
    })),
  }
}

function normalizeFeatureText(features) {
  return (features || []).filter(Boolean).join('、')
}

function syncPageFeatures(page) {
  return {
    ...page,
    features: splitTextList(page.featureText || normalizeFeatureText(page.features)),
    featureText: page.featureText || normalizeFeatureText(page.features),
  }
}

function splitTextList(value) {
  return String(value || '')
    .split(/[、,，;；\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function createPageFromModule(module, scenario, index) {
  const vueFile = createScenarioVueFile(scenario, module, index)
  const features = module?.features?.length ? module.features : scenario.pageMapping?.modules || []

  return syncPageFeatures({
    key: `${scenario.key}-page-${index + 1}`,
    priority: index === 0 ? scenario.priority || 'P0' : 'P1',
    type: index === 0 ? '工作台页' : '辅助页',
    name: inferChinesePageTitle(null, scenario, module, index),
    vueFile,
    goal: module?.description || `支撑「${scenario.name}」场景下的查看、处理、反馈和闭环操作。`,
    features,
    featureText: normalizeFeatureText(features),
    sections: [],
  })
}

function buildScenarioDesign(scenario, modules) {
  const modulePages = (modules || []).slice(0, 4).map((module, index) => createPageFromModule(module, scenario, index))
  const fallbackPage = syncPageFeatures({
    key: `${scenario.key}-scenario-main`,
    priority: scenario.priority || 'P0',
    type: '场景工作台',
    name: `${scenario.name}工作台`,
    vueFile: createScenarioVueFile(scenario, null, 0),
    goal: scenario.description || `支撑「${scenario.name}」业务场景。`,
    features: scenario.pageMapping?.modules || [],
    featureText: normalizeFeatureText(scenario.pageMapping?.modules || []),
    sections: [],
  })
  const pages = modulePages.length ? modulePages : [fallbackPage]

  return {
    pages,
    navigation: pages.map((page, index) => ({
      label: page.name.replace(/页$/, ''),
      target: page.vueFile,
      default: index === 0,
    })),
    fileStructure: {
      views: pages.map((page) => page.vueFile),
      components: [
        `${toPascalCase(scenario.name)}Header.vue`,
        `${toPascalCase(scenario.name)}FilterBar.vue`,
        `${toPascalCase(scenario.name)}DetailPanel.vue`,
        'StatusTag.vue',
        'DataTable.vue',
      ],
      data: [`${toPascalCase(scenario.name)}MockData.js`],
    },
  }
}

function normalizePageDesign(output) {
  const design = output?.pageDesign || output
  const pages = Array.isArray(design?.pages) ? design.pages : []

  if (!pages.length || !activeScenario.value) {
    return currentScenarioDesign.value
  }

  const normalizedPages = pages.map((page, index) => syncPageFeatures({
    key: page.key || `${activeScenario.value.key}-revised-page-${index + 1}`,
    priority: page.priority || (index === 0 ? activeScenario.value.priority || 'P0' : 'P1'),
    type: page.type || '业务页',
    name: normalizePageTitle(page, activeScenario.value, null, index),
    vueFile: createScenarioVueFile(activeScenario.value, { pageSuggestion: page.vueFile, features: page.features || [] }, index),
    goal: page.goal || '由大模型根据当前场景修改生成。',
    features: Array.isArray(page.features) ? page.features : splitTextList(page.featureText),
    featureText: page.featureText || normalizeFeatureText(page.features || []),
    sections: Array.isArray(page.sections) ? page.sections : [],
  }))

  return {
    pages: normalizedPages,
    navigation: Array.isArray(design.navigation) && design.navigation.length
      ? design.navigation
      : normalizedPages.map((page, index) => ({ label: page.name, target: page.vueFile, default: index === 0 })),
    fileStructure: {
      views: design.fileStructure?.views?.length ? design.fileStructure.views : normalizedPages.map((page) => page.vueFile),
      components: design.fileStructure?.components?.length ? design.fileStructure.components : currentScenarioDesign.value.fileStructure.components,
      data: design.fileStructure?.data?.length ? design.fileStructure.data : currentScenarioDesign.value.fileStructure.data,
    },
  }
}

function stripGeneratedPageSections(design) {
  return {
    ...design,
    pages: (design.pages || []).map((page) => ({
      ...page,
      sections: [],
    })),
  }
}

async function regenerateActiveScenarioDesign() {
  if (!activeScenario.value) {
    return
  }

  generatingScenarioKey.value = activeScenario.value.key
  scenarioGenerationMessage.value = `正在根据「${activeScenario.value.name}」的功能模块映射生成页面方案。`
  scenarioGenerationError.value = false
  const localDesign = buildScenarioDesign(activeScenario.value, activeFeatureModules.value)

  if (props.projectContext.executionMode !== 'llm-ready' || !props.projectContext.llmConfigured) {
    revisedDesignsByScenarioKey.value = {
      ...revisedDesignsByScenarioKey.value,
      [activeScenario.value.key]: localDesign,
    }
    saveLocalDraft('页面方案已重新生成并覆盖保存')
    scenarioGenerationMessage.value = `已根据「${activeScenario.value.name}」生成页面清单和当前页面基础信息。`
    generatingScenarioKey.value = ''
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_key: 'pageDesignScenarioPages',
        step_title: '根据当前业务场景生成合理页面方案',
        instruction: '请根据当前业务场景、任务流程、页面映射和功能模块，重新生成合理的页面设计。返回严格 JSON，字段为 {"pageDesign":{"pages":[],"navigation":[],"fileStructure":{"views":[],"components":[],"data":[]}}}。不要让所有场景共用同一个泛化页面名，页面名和 Vue 文件必须贴合当前场景。',
        current_output: {
          scenario: activeScenario.value,
          featureMapping: getFeatureMappingForScenario(activeScenario.value),
          featureModules: activeFeatureModules.value,
          pageDesign: localDesign,
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
      throw new Error(getApiErrorMessage(payload, '页面方案生成失败。'))
    }

    const generatedDesign = stripGeneratedPageSections(normalizePageDesign(payload.data?.revised_output))
    revisedDesignsByScenarioKey.value = {
      ...revisedDesignsByScenarioKey.value,
      [activeScenario.value.key]: generatedDesign,
    }
    saveLocalDraft('大模型页面方案已重新生成并覆盖保存')
    scenarioGenerationMessage.value = `已根据「${activeScenario.value.name}」生成页面清单和当前页面基础信息。`
  } catch (error) {
    revisedDesignsByScenarioKey.value = {
      ...revisedDesignsByScenarioKey.value,
      [activeScenario.value.key]: localDesign,
    }
    saveLocalDraft('本地页面方案已重新生成并覆盖保存')
    sectionMessage.value = getFetchFailureMessage(error)
    sectionError.value = true
    scenarioGenerationMessage.value = getFetchFailureMessage(error)
    scenarioGenerationError.value = true
  } finally {
    generatingScenarioKey.value = ''
  }
}

async function generateScenarioPageDesign(scenario) {
  if (!scenario?.key) {
    return
  }

  activeScenarioKey.value = scenario.key
  await nextTick()
  await regenerateActiveScenarioDesign()
}


function handlePageRevisionApplied({ revisedOutput, revisionInstruction }) {
  if (!activeScenario.value) {
    return
  }

  revisedDesignsByScenarioKey.value = {
    ...revisedDesignsByScenarioKey.value,
    [activeScenario.value.key]: {
      ...normalizePageDesign(revisedOutput),
      llmRevision: {
        instruction: revisionInstruction,
        revisedAt: new Date().toISOString(),
      },
    },
  }
  savedMessage.value = '大模型修改已应用，待保存'
  saveLocalDraft()
}

function markUnsaved() {
  savedMessage.value = '已修改，待保存'
  localSaveMessage.value = ''
}

function getApiErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') {
    return payload.detail
  }

  return payload?.detail?.message || payload?.message || fallback
}

function extractGeneratedSections(revisedOutput) {
  if (Array.isArray(revisedOutput)) {
    return revisedOutput
  }

  if (Array.isArray(revisedOutput?.sections)) {
    return revisedOutput.sections
  }

  if (Array.isArray(revisedOutput?.page?.sections)) {
    return revisedOutput.page.sections
  }

  if (Array.isArray(revisedOutput?.currentPage?.sections)) {
    return revisedOutput.currentPage.sections
  }

  return []
}

function buildLocalSectionsForSelectedPage() {
  if (!selectedPage.value || !activeScenario.value) {
    return []
  }

  const page = syncPageFeatures(selectedPage.value)
  const featureSections = page.features.slice(0, 4)
  const workflowSections = (activeScenario.value.workflow || [])
    .slice(0, 3)
    .map((item) => `${item}操作区`)

  return [
    `${page.name}状态概览`,
    ...featureSections,
    ...workflowSections,
    '异常反馈与处理记录',
    '保存与同步操作区',
  ]
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 8)
}

function applyGeneratedSections(sections, message, source = 'llm') {
  updateSelectedPageInActiveDesign((page) => ({
    ...page,
    sections,
  }))
  sectionGenerationSource.value = source
  saveCurrentPageSections('页面区域已生成并覆盖保存')
  sectionError.value = false
  sectionMessage.value = message
}

function getFetchFailureMessage(error) {
  if (error?.name === 'TypeError' || error?.message === 'Failed to fetch') {
    return '未连接到本地 FastAPI。请确认已执行 bash scripts/start_api.sh，且后端运行在 http://127.0.0.1:8001。'
  }

  return error?.message || '页面区域生成失败。'
}

async function generateSectionsForSelectedPage() {
  if (!selectedPage.value || !activeScenario.value) {
    sectionError.value = true
    sectionMessage.value = '请先点击上方业务场景卡片的“生成”，生成页面清单和当前页面后，再生成页面区域。'
    return
  }

  isGeneratingSections.value = true
  sectionMessage.value = ''
  sectionError.value = false

  try {
    const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_key: 'pageDesignCurrentPageSections',
        step_title: '根据当前页面生成页面区域',
        instruction: '请根据上一步保存到本页的输入信息生成当前页面的页面区域。只返回严格 JSON，字段为 {"sections": ["区域1", "区域2"]}，不要返回 Markdown。页面区域必须贴合当前业务场景、页面清单中的当前页面、页面目标、承载功能和功能模块。',
        current_output: {
          scenario: activeScenario.value,
          allScenarios: availableScenarios.value,
          featureModules: activeFeatureModules.value,
          pageList: currentScenarioDesign.value.pages.map((page) => syncPageFeatures(page)),
          navigation: currentScenarioDesign.value.navigation,
          fileStructure: currentScenarioDesign.value.fileStructure,
          currentPage: syncPageFeatures(selectedPage.value),
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
      throw new Error(getApiErrorMessage(payload, '页面区域生成失败，请检查后端服务和 DeepSeek 配置。'))
    }

    const nextSections = extractGeneratedSections(payload.data?.revised_output)
      .map((item) => String(item).trim())
      .filter(Boolean)

    if (!nextSections.length) {
      throw new Error('大模型未返回可用的页面区域。')
    }

    applyGeneratedSections(nextSections, '已根据当前页面调用大模型生成页面区域，并覆盖保存到本地 page.md。', 'llm')
  } catch (error) {
    sectionError.value = true
    sectionMessage.value = getFetchFailureMessage(error)
  } finally {
    isGeneratingSections.value = false
  }
}

function addSection() {
  if (!selectedPage.value) {
    return
  }

  updateSelectedPageInActiveDesign((page) => ({
    ...page,
    sections: [...(page.sections || []), '新增页面区域'],
  }))
  sectionGenerationSource.value = 'manual'
  markUnsaved()
}

function removeSection(index) {
  if (!selectedPage.value || selectedPage.value.sections.length <= 1) {
    return
  }

  updateSelectedPageInActiveDesign((page) => ({
    ...page,
    sections: page.sections.filter((_, itemIndex) => itemIndex !== index),
  }))
  sectionGenerationSource.value = 'manual'
  markUnsaved()
}

function buildSavedPageDesign() {
  const scenarioDesigns = Object.fromEntries(
    availableScenarios.value.map((scenario) => [
      scenario.key,
      normalizeScenarioDesignNames(revisedDesignsByScenarioKey.value[scenario.key]
        || getStoredScenarioDesign(scenario.key)
        || buildScenarioDesign(scenario, getModulesForScenario(scenario)), scenario),
    ]),
  )
  const activeDesign = normalizePageDesign(scenarioDesigns[activeScenario.value?.key] || currentScenarioDesign.value)
  const currentPage = selectedPage.value ? syncPageFeatures(selectedPage.value) : activeDesign.pages[0]
  const scenarioSummaries = availableScenarios.value.map((scenario) => {
    const design = scenarioDesigns[scenario.key] || createEmptyDesign()
    return {
      key: scenario.key,
      name: scenario.name,
      priority: scenario.priority || 'P1',
      pageCount: design.pages?.length || 0,
      pages: (design.pages || []).map((page) => syncPageFeatures(page)),
    }
  })
  const allPages = scenarioSummaries.flatMap((scenario) =>
    scenario.pages.map((page) => ({
      ...page,
      scenarioKey: scenario.key,
      scenarioName: scenario.name,
    })),
  )
  const aggregateNavigation = availableScenarios.value.flatMap((scenario) => {
    const design = scenarioDesigns[scenario.key] || createEmptyDesign()
    return (design.navigation || []).map((item) => ({
      ...item,
      scenarioKey: scenario.key,
      scenarioName: scenario.name,
    }))
  })
  const aggregateFileStructure = {
    views: [...new Set(allPages.map((page) => page.vueFile).filter(Boolean))],
    components: [...new Set(availableScenarios.value.flatMap((scenario) => scenarioDesigns[scenario.key]?.fileStructure?.components || []))],
    data: [...new Set(availableScenarios.value.flatMap((scenario) => scenarioDesigns[scenario.key]?.fileStructure?.data || []))],
  }
  const savedAt = new Date().toISOString()

  return {
    scenario: activeScenario.value,
    currentScenarioKey: activeScenario.value?.key || '',
    selectedPageKey: currentPage?.key || '',
    page: currentPage,
    currentPage,
    currentPageSections: currentPage?.sections || [],
    pageDesign: {
      pages: allPages,
      navigation: aggregateNavigation,
      fileStructure: aggregateFileStructure,
    },
    scenarioSummaries,
    scenarioDesigns,
    sectionGenerationSource: sectionGenerationSource.value,
    savedAt,
  }
}

function getModulesForScenario(scenario) {
  if (!scenario) {
    return []
  }

  const mapping = getFeatureMappingForScenario(scenario)
  return mapping?.modules || []
}

function saveCurrentPageSections(statusText = '当前页面区域已保存') {
  if (!selectedPage.value) {
    return
  }

  const draft = buildSavedPageDesign()
  emit('page-design-draft-update', draft)
  savedMessage.value = statusText
  const savedTime = new Date(draft.savedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  sectionError.value = false
  sectionMessage.value = `已保存当前页面区域：${draft.currentPage?.name || '当前页面'} / ${draft.currentPageSections.length} 个区域（${savedTime}）。`
  localSaveMessage.value = `已保存当前页面区域：${draft.currentPage?.name || '当前页面'}（${savedTime}）。`
}

function saveLocalDraft(statusText = '已保存') {
  const draft = buildSavedPageDesign()
  emit('page-design-draft-update', draft)
  savedMessage.value = statusText
  const savedTime = new Date(draft.savedAt).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  localSaveMessage.value = `页面设计成果已保存（${savedTime}）。`
  return draft
}

function confirmAndNext() {
  const draft = buildSavedPageDesign()
  savedMessage.value = '已确认保存'
  localSaveMessage.value = '页面设计成果已保存，正在进入交互设计。'
  emit('page-design-confirm', draft)
}
</script>

<style scoped>
.page-design-view {
  margin-top: 16px;
}

.scenario-tabs-panel,
.scenario-output-panel,
.page-list-panel,
.page-detail-panel,
.output-box,
.context-handoff {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.scenario-tabs-panel,
.scenario-output-panel,
.page-list-panel,
.page-detail-panel,
.output-box,
.context-handoff {
  padding: 18px;
}

.scenario-tabs-panel,
.scenario-output-panel,
.page-layout,
.design-context-panel,
.context-handoff {
  margin-top: 16px;
}

.panel-heading,
.page-list-panel,
.page-detail-panel {
  display: grid;
  gap: 12px;
}

.page-list-panel {
  align-content: start;
}

.panel-heading.compact {
  margin-bottom: 12px;
}

.page-list-heading {
  margin-bottom: 8px;
}

.page-list-heading span {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.page-list-heading b {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.panel-heading.with-action,
.context-handoff {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: start;
  gap: 12px;
}

.panel-heading span,
.output-box span,
.context-handoff span,
.edit-grid span,
.full-field span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong,
.context-handoff strong {
  color: #0f172a;
  font-size: 18px;
}

.scenario-tabs {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.scenario-tab,
.page-button {
  display: grid;
  gap: 6px;
  width: 100%;
  min-height: 104px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
  text-align: left;
}

.scenario-tab {
  position: relative;
  cursor: pointer;
  padding-right: 80px;
}

.scenario-generate-button {
  position: absolute;
  top: 10px;
  right: 10px;
  min-width: 54px;
  min-height: 30px;
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  background: #ffffff;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;
}

.scenario-generate-button:hover:not(:disabled) {
  border-color: #2563eb;
  background: #eff6ff;
}

.scenario-generate-button:disabled {
  cursor: wait;
  color: #64748b;
  background: #f1f5f9;
}

.scenario-generation-message {
  margin: 12px 0 0;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
}

.scenario-generation-message.error {
  color: #dc2626;
}

.empty-placeholder {
  display: grid;
  align-content: center;
  min-height: 180px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  padding: 20px;
  background: #f8fafc;
  color: #64748b;
}

.empty-placeholder strong {
  color: #0f172a;
  font-size: 16px;
}

.empty-placeholder p {
  margin: 6px 0 0;
  line-height: 1.6;
}

.compact-placeholder {
  min-height: 120px;
}

.empty-detail-panel {
  min-height: 320px;
}

.scenario-tab.active,
.page-button.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.scenario-tab strong,
.page-button strong {
  overflow: hidden;
  color: #0f172a;
  font-size: 15px;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.accordion-page:not(.active) strong {
  -webkit-line-clamp: 1;
}

.scenario-tab small,
.page-button small,
.scenario-output-panel p,
.context-handoff p,
.output-box li,
.output-box dd,
.section-list-head p {
  margin: 0;
  color: #526174;
  line-height: 1.55;
}

.priority-tag {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.scenario-output-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-top: 14px;
}

.design-context-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
}

.navigation-list,
.file-structure-grid ul {
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.navigation-list li,
.file-structure-grid section {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.navigation-list li {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.navigation-list strong {
  color: #0f172a;
}

.navigation-list span,
.file-structure-grid li {
  color: #526174;
  overflow-wrap: anywhere;
  line-height: 1.5;
}

.navigation-list small {
  border-radius: 999px;
  padding: 4px 8px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 900;
}

.file-structure-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.file-structure-grid section > span {
  display: block;
  margin-bottom: 8px;
}

.output-box ul,
.output-box dl {
  display: grid;
  gap: 8px;
  margin: 10px 0 0;
  padding: 0;
  list-style: none;
}

.output-box dt {
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.page-layout {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 16px;
}

.page-list {
  display: grid;
  gap: 8px;
}

.accordion-page {
  min-height: 0;
  padding: 0;
  overflow: hidden;
}

.accordion-page .accordion-head {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-height: 38px;
  padding: 8px 10px;
}

.accordion-page:not(.active) .accordion-head {
  grid-template-columns: 1fr;
}

.accordion-page small {
  display: block;
  border-top: 1px solid #dbeafe;
  padding: 8px 10px 10px;
  background: #f8fbff;
  overflow-wrap: anywhere;
}

.edit-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.edit-grid label,
.full-field {
  display: grid;
  gap: 6px;
}

input,
textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  color: #172033;
  line-height: 1.6;
}

textarea {
  resize: vertical;
}

.section-list {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.section-list-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-list h4 {
  margin: 0 0 4px;
  color: #0f172a;
}

.section-actions,
.action-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.editable-list {
  display: grid;
  gap: 10px;
}

.editable-list label {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.editable-list label span {
  color: #64748b;
  font-weight: 900;
}

.saved-status,
.section-message {
  color: #166534;
  font-size: 13px;
  font-weight: 900;
}

.section-message.error {
  color: #dc2626;
}

.bottom-revision-panel {
  margin-top: 16px;
  margin-bottom: 0;
}

.small {
  padding: 8px 10px;
  font-size: 13px;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

@media (max-width: 1180px) {
  .scenario-tabs,
  .scenario-output-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 980px) {
  .page-layout,
  .design-context-panel,
  .file-structure-grid,
  .panel-heading.with-action,
  .context-handoff,
  .edit-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .scenario-tabs,
  .scenario-output-grid,
  .navigation-list li,
  .editable-list label {
    grid-template-columns: 1fr;
  }
}
</style>
