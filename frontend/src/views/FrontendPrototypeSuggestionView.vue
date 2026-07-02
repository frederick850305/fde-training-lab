<template>
  <section class="prototype-suggestion-view" aria-labelledby="prototype-suggestion-title">
    <ViewHeading
      eyebrow="Frontend Prototype"
      title="前端原型建议模拟工作台"
      title-id="prototype-suggestion-title"
      description="汇总页面、组件、mock 数据、生成顺序和代码生成 Prompt，为后续 Codex/Copilot 生成 Vue3 原型做准备。"
    />

    <p v-if="generationStatusMessage" class="gen-status" :class="{ error: generationStatusMessage.includes('失败') }">{{ generationStatusMessage }}</p>

    <div class="suggestion-tabs" aria-label="建议类型切换">
      <button
        v-for="item in suggestionTabs"
        :key="item.key"
        type="button"
        :class="{ active: item.key === activeTab }"
        @click="activeTab = item.key"
      >
        {{ item.label }}
      </button>
    </div>

    <section class="suggestion-panel">
      <template v-if="activeTab === 'views'">
        <div class="panel-heading">
          <span>Vue 页面文件建议</span>
          <strong>共 {{ recommendedViewFiles.length }} 个页面，按优先级折叠</strong>
        </div>
        <div class="priority-accordion">
          <div
            v-for="group in groupedViewFiles"
            :key="group.key"
            class="priority-group"
          >
            <button
              type="button"
              class="priority-toggle"
              :class="{ open: openPriorities.includes(group.key) }"
              @click="togglePriority(group.key)"
            >
              <span class="priority-badge" :class="'priority-' + group.key.toLowerCase()">{{ group.key }}</span>
              <span class="priority-label">{{ group.label }}</span>
              <span class="priority-count">{{ group.files.length }} 个页面</span>
              <span class="toggle-icon">{{ openPriorities.includes(group.key) ? '▾' : '▸' }}</span>
            </button>
            <div v-if="openPriorities.includes(group.key)" class="priority-files">
              <article v-for="item in group.files" :key="item.file" class="suggestion-card">
                <h3>{{ item.file }}</h3>
                <p>{{ item.responsibility }}</p>
                <small>{{ item.source }}</small>
              </article>
            </div>
          </div>
        </div>
      </template>

      <template v-else-if="activeTab === 'apiMapping'">
        <div class="panel-heading inline-heading">
          <div>
            <span>页面 → API 映射</span>
            <strong>每个页面调用的接口清单</strong>
          </div>
          <button
            class="gen-btn"
            type="button"
            :disabled="isGenerating.apiMapping"
            @click="generatePageApiMapping"
          >
            {{ isGenerating.apiMapping ? '生成中...' : '🤖 生成' }}
          </button>
        </div>
        <div class="mapping-table-wrap">
          <table class="mapping-table">
            <thead>
              <tr>
                <th>页面文件</th>
                <th>方法</th>
                <th>接口路径</th>
                <th>调用说明</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in pageApiMapping" :key="item.page">
                <tr
                  v-for="(api, apiIndex) in item.apis"
                  :key="`${item.page}-${apiIndex}`"
                  :class="{ 'first-row': apiIndex === 0 }"
                >
                  <td v-if="apiIndex === 0" :rowspan="item.apis.length" class="page-cell">
                    <strong>{{ item.page }}</strong>
                  </td>
                  <td>
                    <span class="method-tag" :class="'method-' + api.method.toLowerCase()">{{ api.method }}</span>
                  </td>
                  <td><code>{{ api.path }}</code></td>
                  <td class="usage-cell">{{ api.usage }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </template>

      <template v-else-if="activeTab === 'navigation'">
        <div class="panel-heading inline-heading">
          <div>
            <span>导航与路由设计</span>
            <strong>侧边栏分组 + vue-router 路由表</strong>
          </div>
          <button
            class="gen-btn"
            type="button"
            :disabled="isGenerating.navigation"
            @click="generateNavigationRoutes"
          >
            {{ isGenerating.navigation ? '生成中...' : '🤖 生成' }}
          </button>
        </div>
        <div class="nav-groups">
          <article
            v-for="group in navigationRoutes"
            :key="group.group"
            class="nav-group-card"
          >
            <div class="nav-group-header">
              <span class="nav-group-icon">{{ group.icon }}</span>
              <h3>{{ group.group }}</h3>
              <small>{{ group.routes.length }} 个页面</small>
            </div>
            <table class="route-table">
              <thead>
                <tr>
                  <th>路由 Path</th>
                  <th>页面组件</th>
                  <th>标题</th>
                  <th>默认</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="route in group.routes" :key="route.path">
                  <td><code>{{ route.path }}</code></td>
                  <td><strong>{{ route.component }}</strong></td>
                  <td>{{ route.title }}</td>
                  <td>
                    <span v-if="route.default" class="default-badge">默认页</span>
                    <span v-else class="text-muted">—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'components'">
        <div class="panel-heading inline-heading">
          <div>
            <span>组件拆分建议</span>
            <strong>通用组件 Props / Events / Slots 接口契约</strong>
          </div>
          <button
            class="gen-btn"
            type="button"
            :disabled="isGenerating.components"
            @click="generateComponentContracts"
          >
            {{ isGenerating.components ? '生成中...' : '🤖 生成' }}
          </button>
        </div>
        <div class="component-specs">
          <article v-for="item in recommendedComponentFiles" :key="item.file" class="component-spec-card">
            <div class="comp-header">
              <h3>{{ item.file }}</h3>
              <small>{{ item.responsibility }}</small>
            </div>
            <div v-if="item.props?.length" class="comp-section">
              <span class="comp-section-label">Props</span>
              <table class="comp-table">
                <thead><tr><th>名称</th><th>类型</th><th>必填</th><th>默认值</th><th>说明</th></tr></thead>
                <tbody>
                  <tr v-for="p in item.props" :key="p.name">
                    <td><code>{{ p.name }}</code></td>
                    <td><code class="type-code">{{ p.type }}</code></td>
                    <td>{{ p.required ? '✓' : '—' }}</td>
                    <td><code>{{ p.default }}</code></td>
                    <td>{{ p.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="item.events?.length" class="comp-section">
              <span class="comp-section-label">Events</span>
              <table class="comp-table">
                <thead><tr><th>事件名</th><th>Payload</th><th>说明</th></tr></thead>
                <tbody>
                  <tr v-for="e in item.events" :key="e.name">
                    <td><code>{{ e.name }}</code></td>
                    <td><code>{{ e.payload }}</code></td>
                    <td>{{ e.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="item.slots?.length" class="comp-section">
              <span class="comp-section-label">Slots</span>
              <table class="comp-table">
                <thead><tr><th>插槽名</th><th>说明</th></tr></thead>
                <tbody>
                  <tr v-for="s in item.slots" :key="s.name">
                    <td><code>{{ s.name || 'default' }}</code></td>
                    <td>{{ s.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="item.usage" class="comp-section">
              <span class="comp-section-label">使用方式</span>
              <p>{{ item.usage }}</p>
            </div>
            <div class="comp-footer">
              <small>复用页面：{{ item.reusedBy.join('、') }}</small>
            </div>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'mockData'">
        <div class="panel-heading inline-heading">
          <div>
            <span>Mock 数据建议</span>
            <strong>每个 Mock 文件的数据结构定义</strong>
          </div>
          <button
            class="gen-btn"
            type="button"
            :disabled="isGenerating.mockData"
            @click="generateMockDataSchemas"
          >
            {{ isGenerating.mockData ? '生成中...' : '🤖 生成' }}
          </button>
        </div>
        <div class="mock-specs">
          <article v-for="item in recommendedMockDataFiles" :key="item.file" class="mock-spec-card">
            <div class="comp-header">
              <h3>{{ item.file }}</h3>
              <small>{{ item.content }}</small>
            </div>
            <div v-if="item.schema?.length" class="comp-section">
              <table class="comp-table">
                <thead><tr><th>字段</th><th>类型</th><th>说明</th></tr></thead>
                <tbody>
                  <tr v-for="s in item.schema" :key="s.field">
                    <td><code>{{ s.field }}</code></td>
                    <td><code class="type-code">{{ s.type }}</code></td>
                    <td>{{ s.description }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="comp-footer">
              <small>服务对象：{{ item.usedBy.join('、') }}</small>
            </div>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'pageSpecs'">
        <div class="panel-heading inline-heading">
          <div>
            <span>页面规格详情</span>
            <strong>每个页面的布局区域、UI 状态和关键交互</strong>
          </div>
          <button
            class="gen-btn"
            type="button"
            :disabled="isGenerating.pageSpecs"
            @click="generatePageSpecs"
          >
            {{ isGenerating.pageSpecs ? '生成中...' : '🤖 生成' }}
          </button>
        </div>
        <div class="page-specs">
          <article v-for="(spec, specIndex) in pageDetailSpecs" :key="spec.file" class="page-spec-card">
            <button
              type="button"
              class="spec-toggle"
              :class="{ open: isPageSpecOpen(specIndex) }"
              @click="togglePageSpec(specIndex)"
            >
              <span class="spec-toggle-icon">{{ isPageSpecOpen(specIndex) ? '▾' : '▸' }}</span>
              <h3>{{ spec.file }}</h3>
            </button>
            <div v-if="isPageSpecOpen(specIndex)" class="spec-body">
              <div class="comp-section">
              <span class="comp-section-label">布局区域</span>
              <div class="zone-list">
                <div v-for="zone in spec.layoutZones" :key="zone.zone" class="zone-item">
                  <strong>{{ zone.zone }}</strong>
                  <p>{{ zone.content }}</p>
                </div>
              </div>
            </div>
            <div class="comp-section">
              <span class="comp-section-label">UI 状态</span>
              <div class="state-tags">
                <span v-for="s in spec.uiStates" :key="s.state" class="state-tag-item" :class="'state-' + s.state">
                  {{ s.state }}
                </span>
              </div>
              <ul class="state-desc-list">
                <li v-for="s in spec.uiStates" :key="s.state">
                  <strong>{{ s.state }}</strong>：{{ s.content }}
                </li>
              </ul>
            </div>
            <div class="comp-section">
              <span class="comp-section-label">关键交互</span>
              <ul class="interaction-list">
                <li v-for="(interaction, i) in spec.keyInteractions" :key="i">{{ interaction }}</li>
              </ul>
            </div>
            </div>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'background'">
        <div class="panel-heading">
          <span>业务背景摘要</span>
          <strong>汇总前序步骤的项目信息、需求、角色和场景，LLM 据此理解系统边界</strong>
        </div>
        <div class="bg-layout">
          <article class="bg-card">
            <span class="bg-label">项目信息</span>
            <h3>{{ projectBackground.projectName }}</h3>
            <p>客户：{{ projectBackground.customerName }}</p>
            <p>业务域：{{ projectBackground.businessDomain }}</p>
          </article>
          <article class="bg-card">
            <span class="bg-label">需求摘要</span>
            <p>{{ projectBackground.requirementSummary }}</p>
          </article>
          <article class="bg-card">
            <span class="bg-label">用户角色（{{ projectBackground.userRoles.length }} 个）</span>
            <table class="comp-table">
              <thead><tr><th>角色</th><th>职责</th></tr></thead>
              <tbody>
                <tr v-for="ur in projectBackground.userRoles" :key="ur.role">
                  <td><strong>{{ ur.role }}</strong></td>
                  <td>{{ ur.description }}</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article class="bg-card">
            <span class="bg-label">场景摘要</span>
            <p>{{ projectBackground.scenarioSummary }}</p>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'projectStructure'">
        <div class="panel-heading">
          <span>目录结构建议</span>
          <strong>{{ projectStructure.description }}</strong>
        </div>
        <pre class="tree-pre">{{ projectStructure.tree.join('\n') }}</pre>
      </template>

      <template v-else-if="activeTab === 'styleGuide'">
        <div class="panel-heading">
          <span>样式规范</span>
          <strong>CSS 变量、间距、字体和命名约定</strong>
        </div>
        <div class="style-guide-grid">
          <article class="bg-card">
            <span class="bg-label">颜色 Token</span>
            <div class="color-swatches">
              <div v-for="c in styleGuide.colorTokens" :key="c.name" class="color-swatch">
                <span class="swatch-block" :style="{ background: c.value }"></span>
                <div>
                  <code>{{ c.name }}</code>
                  <small>{{ c.value }}</small>
                  <p>{{ c.usage }}</p>
                </div>
              </div>
            </div>
          </article>
          <article class="bg-card">
            <span class="bg-label">排版与间距</span>
            <p><strong>间距：</strong>{{ styleGuide.spacing }}</p>
            <p><strong>字号：</strong>{{ styleGuide.fontSize }}</p>
          </article>
          <article class="bg-card">
            <span class="bg-label">响应式断点</span>
            <table class="comp-table">
              <thead><tr><th>名称</th><th>宽度</th></tr></thead>
              <tbody>
                <tr v-for="bp in styleGuide.breakpoints" :key="bp.name">
                  <td>{{ bp.name }}</td>
                  <td>{{ bp.value }}</td>
                </tr>
              </tbody>
            </table>
          </article>
          <article class="bg-card">
            <span class="bg-label">命名约定</span>
            <p><strong>组件命名：</strong>{{ styleGuide.componentNaming }}</p>
            <p><strong>Vue 约定：</strong>{{ styleGuide.vueConvention }}</p>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'stepPrompts'">
        <div class="panel-heading inline-heading">
          <div>
            <span>分步骤生成 Prompt</span>
            <strong>按生成顺序拆分的独立 Prompt，每个步骤可直接复制给 LLM</strong>
          </div>
          <button
            class="gen-btn"
            type="button"
            :disabled="isGenerating.stepPrompts"
            @click="generateStepPrompts"
          >
            {{ isGenerating.stepPrompts ? '生成中...' : '🤖 生成' }}
          </button>
        </div>
        <div class="step-prompts-accordion">
          <div v-for="(sp, index) in stepPrompts" :key="sp.step" class="sp-group">
            <button
              type="button"
              class="sp-toggle"
              :class="{ open: activePromptStep === index }"
              @click="togglePromptStep(index)"
            >
              <span class="sp-step-num">{{ sp.step }}</span>
              <span class="sp-title">{{ sp.title }}</span>
              <span class="toggle-icon">{{ activePromptStep === index ? '▾' : '▸' }}</span>
            </button>
            <div v-if="activePromptStep === index" class="sp-body">
              <div class="sp-actions">
                <button class="copy-btn" type="button" @click="copyPrompt(sp.prompt)">📋 复制 Prompt</button>
              </div>
              <pre>{{ sp.prompt }}</pre>
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="panel-heading">
          <span>生成顺序建议</span>
          <strong>降低一次性生成失败概率</strong>
        </div>
        <ol class="generation-list">
          <li v-for="item in recommendedSteps" :key="item.step">
            <span>{{ item.step }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </li>
        </ol>
      </template>
    </section>

    <div class="next-action">
      <button class="primary-button" type="button" @click="confirmAndNext">
        确认前端原型方案
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['suggestion-confirm', 'prototype-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const activeTab = ref('views')

/* ===== 从 projectContext 恢复已保存的 LLM 生成数据 ===== */
const initialProto = props.projectContext.stepResults?.prototype || null

const generatedPageSpecs = ref(initialProto?.pageDetailSpecs || null)
const generatedPageApiMapping = ref(initialProto?.pageApiMapping || null)
const generatedNavigationRoutes = ref(initialProto?.navigationRoutes || null)
const generatedComponentFiles = ref(initialProto?.componentFiles || null)
const generatedMockDataFiles = ref(initialProto?.mockDataFiles || null)
const generatedStepPrompts = ref(initialProto?.stepPrompts || null)

const generationStatusMessage = ref('')

const isGenerating = ref({
  pageSpecs: false,
  apiMapping: false,
  navigation: false,
  components: false,
  mockData: false,
  stepPrompts: false,
})

/* ===== Data Sources (Phase 2 merged keys) ===== */
const requirementResult = computed(() => props.projectContext.stepResults?.requirement || null)
const scenarioPageResult = computed(() => props.projectContext.scenarioPageDesignResult || props.projectContext.stepResults?.scenarioPageDesign || null)
const interactionApiResult = computed(() => props.projectContext.interactionApiResult || props.projectContext.stepResults?.interactionApi || null)

/* ===== 从 interactionApiResult 提取所有 API 契约（兼容 Phase 2 generatedApiByPageKey） ===== */
const allApiContracts = computed(() => {
  var result = interactionApiResult.value
  if (!result) return []

  // Phase 2 格式：generatedApiByPageKey（按页面 key 索引的 API 契约 map）
  if (result.generatedApiByPageKey) {
    var contracts = []
    var keys = Object.keys(result.generatedApiByPageKey)
    for (var i = 0; i < keys.length; i++) {
      var val = result.generatedApiByPageKey[keys[i]]
      if (Array.isArray(val)) {
        contracts.push.apply(contracts, val)
      } else if (val && val.method) {
        contracts.push(val)
      }
    }
    return contracts
  }

  // 旧格式：扁平 contracts 数组
  if (Array.isArray(result.contracts) && result.contracts.length) {
    return result.contracts
  }

  return []
})

/* ===== LLM Helper ===== */
const LLM_FETCH_TIMEOUT_MS = 120_000

async function requestLlmGeneration(stepKey, instruction, currentOutput) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), LLM_FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_key: 'prototype',
        step_title: stepKey,
        instruction,
        current_output: currentOutput,
        project_context: {
          projectName: props.projectContext.projectName,
          customerName: props.projectContext.customerName,
          projectStage: props.projectContext.projectStage,
        },
      }),
      signal: controller.signal,
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.success === false) {
      throw new Error(payload.detail || payload.message || `${stepKey} 生成失败，请检查后端服务和 DeepSeek 配置。`)
    }

    return payload.data?.revised_output
  } catch (e) {
    if (e.name === 'AbortError') {
      throw new Error(`${stepKey} 请求超时（${LLM_FETCH_TIMEOUT_MS / 1000}秒），请减少单次生成数量后重试。`)
    }
    throw e
  } finally {
    clearTimeout(timeoutId)
  }
}

/* ===== 保存当前结果到父组件 → 持久化到 MD ===== */
function persistPrototypeResult() {
  emit('prototype-draft-update', {
    viewFiles: recommendedViewFiles.value,
    pageDetailSpecs: generatedPageSpecs.value || [],
    pageApiMapping: generatedPageApiMapping.value || [],
    navigationRoutes: generatedNavigationRoutes.value || [],
    componentFiles: generatedComponentFiles.value || [],
    mockDataFiles: generatedMockDataFiles.value || [],
    stepPrompts: generatedStepPrompts.value || [],
    savedAt: new Date().toISOString(),
  })
}

function parseMaybeJson(raw) {
  if (!raw) return null
  if (typeof raw === 'object') return raw
  try {
    const str = String(raw).replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
    return JSON.parse(str)
  } catch {
    try { return JSON.parse(String(raw)) } catch { return null }
  }
}

/* ===== 1. 业务背景（纯读取前序步骤，无需 LLM） ===== */
const projectBackground = computed(() => {
  const requirementAnalysis = requirementResult.value?.analysis || requirementResult.value || {}
  const scenario = scenarioPageResult.value?.scenarios?.[0] || {}
  const scenarioName = scenario.name || ''
  const scenarioDesc = scenario.description || scenario.goal || ''

  return {
    projectName: props.projectContext.projectName || '未命名项目',
    customerName: props.projectContext.customerName || '未指定客户',
    businessDomain: '运营调度系统',
    requirementSummary: props.projectContext.sourceRequirement
      || requirementAnalysis.businessBackground
      || requirementAnalysis.sourceText
      || '',
    userRoles: requirementAnalysis.userRoles?.length
      ? requirementAnalysis.userRoles.map((r) => ({ role: r.name || r.role, description: r.responsibility || r.description }))
      : [],
    scenarioSummary: scenarioName
      ? `${scenarioName}${scenarioDesc ? '：' + scenarioDesc : ''}`
      : '',
  }
})

/* ===== 2. 页面规格 - 增量生成：只生成缺失的页面，跳过已有规格 ===== */
const PAGE_SPEC_BATCH_SIZE = 3
const PAGE_SPEC_MAX_RETRIES = 1
const pageDetailSpecs = computed(() => generatedPageSpecs.value || [])

async function generatePageSpecs() {
  if (!scenarioPageResult.value) {
    generationStatusMessage.value = '请先完成步骤 04 页面设计。'
    return
  }

  const allPages = buildPageSpecPagesInput()
  if (!allPages.length) {
    generationStatusMessage.value = '页面清单为空，请先在步骤 04 中确认页面设计。'
    return
  }

  const existing = generatedPageSpecs.value || []
  let accumulated = [...existing]

  // 如果已有生成内容，弹出确认对话框
  if (existing.length) {
    const coveredSet = new Set(existing.map((a) => a.file))
    const missing = allPages.filter((p) => !coveredSet.has(p.file))
    const allCovered = missing.length === 0

    let doIncremental = false
    let shouldProceed = false

    if (allCovered) {
      // 全部已生成 → 确认是否全部重新生成
      shouldProceed = window.confirm(
        `已生成全部 ${allPages.length} 个页面规格。\n\n` +
        `点击「确定」将全部 ${allPages.length} 个页面重新生成。\n` +
        `点击「取消」放弃本次操作。`
      )
      if (!shouldProceed) return
      // 全部重新生成
      accumulated = []
    } else {
      // 有遗漏 → 选择增量还是全部重新生成
      doIncremental = window.confirm(
        `已生成 ${existing.length}/${allPages.length} 个页面规格，` +
        `还差 ${missing.length} 个：\n${missing.map((p) => p.file).join('\n')}\n\n` +
        `点击「确定」仅补充遗漏的 ${missing.length} 个页面。\n` +
        `点击「取消」将全部 ${allPages.length} 个页面重新生成。`
      )

      if (doIncremental) {
        await doGeneratePageSpecs(allPages, missing, accumulated)
        return
      }
      accumulated = []
    }
  }

  await doGeneratePageSpecs(allPages, allPages, accumulated)
}

async function doGeneratePageSpecs(allPages, pending, accumulated) {

  isGenerating.value.pageSpecs = true
  const totalBatches = Math.ceil(pending.length / PAGE_SPEC_BATCH_SIZE)

  try {
    for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
      const start = batchIdx * PAGE_SPEC_BATCH_SIZE
      const end = Math.min(start + PAGE_SPEC_BATCH_SIZE, pending.length)
      const batch = pending.slice(start, end)
      const batchFiles = new Set(batch.map((p) => p.file))
      const batchLabel = `${start + 1}-${end}/${pending.length}（共 ${allPages.length} 页）`

      let items = []
      for (let retry = 0; retry <= PAGE_SPEC_MAX_RETRIES; retry++) {
        generationStatusMessage.value = retry === 0
          ? `正在生成页面规格 ${batchLabel}...`
          : `重试生成 ${batchLabel}（第 ${retry} 次）...`

        const instruction = [
          `请根据以下 ${batch.length} 个页面的设计信息，生成每个页面的详细规格。`,
          '只返回 JSON，不要 Markdown。JSON 结构为数组：[{ "file": "页面文件名.vue", "layoutZones": [{ "zone": "区域名", "content": "该区域的内容描述" }], "uiStates": [{ "state": "状态标识", "content": "该状态下的 UI 表现" }], "keyInteractions": ["交互描述1", "交互描述2"] }]。',
          '重要：file 字段必须严格使用上面提供的文件名，不要修改。',
        ].join('\n')

        try {
          const raw = await requestLlmGeneration(`页面规格详情(${batchLabel})`, instruction, { pages: batch })
          const parsed = parseMaybeJson(raw)
          items = Array.isArray(parsed) ? parsed : (parsed?.pageSpecs || parsed?.specs || [])

          const coveredFiles = new Set(items.map((it) => it.file))
          const missingInBatch = [...batchFiles].filter((f) => !coveredFiles.has(f))
          if (missingInBatch.length === 0) break
        } catch {
          // 单批次失败，继续重试
        }
      }

      for (const item of items) {
        if (!batchFiles.has(item.file)) continue
        const existingIdx = accumulated.findIndex((a) => a.file === item.file)
        if (existingIdx >= 0) {
          accumulated[existingIdx] = item
        } else {
          accumulated.push(item)
        }
      }

      generatedPageSpecs.value = [...accumulated]
      persistPrototypeResult()
    }

    // 检查最终遗漏
    const finalCovered = new Set(accumulated.map((a) => a.file))
    const finalMissing = allPages.filter((p) => !finalCovered.has(p.file))

    if (finalMissing.length) {
      generationStatusMessage.value = `已生成 ${accumulated.length}/${allPages.length} 个页面规格，${finalMissing.length} 个未生成：${finalMissing.map((p) => p.file).join('、')}。可再次点击补充。`
    } else {
      generationStatusMessage.value = `已生成全部 ${accumulated.length} 个页面规格。`
    }
  } catch (e) {
    generationStatusMessage.value = `生成失败：${e.message}`
    if (accumulated.length) {
      generatedPageSpecs.value = [...accumulated]
      persistPrototypeResult()
    }
  } finally {
    isGenerating.value.pageSpecs = false
  }
}

function buildPageSpecPagesInput() {
  var unified = extractAllPageDesigns(scenarioPageResult.value)
  var pages = unified.pages.length ? unified.pages : recommendedViewFiles.value

  return pages.map(function (p, i) {
    return {
      file: p.vueFile || p.file,
      name: p.name || `页面 ${i + 1}`,
      goal: p.goal || p.responsibility || '',
      priority: p.priority || assignPriority(i, pages.length),
    }
  })
}

/* ===== 3. 页面-API映射 (步骤5+6) - 增量生成 ===== */
const API_MAPPING_BATCH_SIZE = 5
const pageApiMapping = computed(() => generatedPageApiMapping.value || [])

async function generatePageApiMapping() {
  var contracts = allApiContracts.value
  if (!contracts.length) {
    generationStatusMessage.value = '请先完成步骤 03 交互与API（需生成 API 契约）。'
    return
  }

  const allPages = recommendedViewFiles.value
  if (!allPages.length) {
    generationStatusMessage.value = '页面清单为空，请先在步骤 02 中生成页面设计。'
    return
  }

  const apiContracts = contracts
  const existing = generatedPageApiMapping.value || []
  let accumulated = [...existing]

  if (existing.length) {
    const coveredSet = new Set(existing.map((a) => a.page))
    const missing = allPages.filter((p) => !coveredSet.has(p.file))
    const allCovered = missing.length === 0

    if (allCovered) {
      const shouldProceed = window.confirm(
        `已生成全部 ${allPages.length} 个页面的 API 映射。\n\n` +
        `点击「确定」将全部 ${allPages.length} 个页面重新生成 API 映射。\n` +
        `点击「取消」放弃本次操作。`
      )
      if (!shouldProceed) return
      accumulated = []
    } else {
      const doIncremental = window.confirm(
        `已生成 ${existing.length}/${allPages.length} 个页面的 API 映射，` +
        `还差 ${missing.length} 个：\n${missing.map((p) => p.file).join('\n')}\n\n` +
        `点击「确定」仅补充遗漏的 ${missing.length} 个页面。\n` +
        `点击「取消」将全部 ${allPages.length} 个页面重新生成。`
      )

      if (doIncremental) {
        await doGenerateApiMapping(allPages, missing, apiContracts, accumulated)
        return
      }
      accumulated = []
    }
  }

  await doGenerateApiMapping(allPages, allPages, apiContracts, accumulated)
}

async function doGenerateApiMapping(allPages, pending, apiContracts, accumulated) {
  isGenerating.value.apiMapping = true
  const totalBatches = Math.ceil(pending.length / API_MAPPING_BATCH_SIZE)

  try {
    for (let batchIdx = 0; batchIdx < totalBatches; batchIdx++) {
      const start = batchIdx * API_MAPPING_BATCH_SIZE
      const end = Math.min(start + API_MAPPING_BATCH_SIZE, pending.length)
      const batch = pending.slice(start, end)
      const batchFiles = new Set(batch.map((p) => p.file))
      const batchLabel = `${start + 1}-${end}/${pending.length}（共 ${allPages.length} 页）`

      generationStatusMessage.value = `正在生成页面-API 映射 ${batchLabel}...`

      const input = {
        pages: batch.map((p) => ({ file: p.file, responsibility: p.responsibility })),
        apiContracts: apiContracts.map((c) => ({ method: c.method, path: c.path, name: c.name, goal: c.goal, resourceGroupLabel: c.resourceGroupLabel })),
      }
      const instruction = [
        `请根据 ${input.pages.length} 个页面和 ${input.apiContracts.length} 个 API 契约，建立页面到 API 的映射关系。`,
        '只返回 JSON，不要 Markdown。JSON 结构为数组：[{ "page": "页面文件名", "apis": [{ "method": "GET/POST/PUT", "path": "/api/xxx", "usage": "调用说明" }] }]。',
        '每个页面映射 1-4 个最相关的 API，usage 用中文描述调用的业务时机。',
        '优先匹配 resourceGroupLabel 与页面职责相关的 API。',
      ].join('\n')

      const raw = await requestLlmGeneration(`页面-API映射(${batchLabel})`, instruction, input)
      const parsed = parseMaybeJson(raw)
      const items = Array.isArray(parsed) ? parsed : (parsed?.mappings || parsed?.pageApiMapping || [])

      for (const item of items) {
        if (!batchFiles.has(item.page)) continue
        const existingIdx = accumulated.findIndex((a) => a.page === item.page)
        if (existingIdx >= 0) {
          accumulated[existingIdx] = item
        } else {
          accumulated.push(item)
        }
      }

      generatedPageApiMapping.value = [...accumulated]
      persistPrototypeResult()
    }

    const finalCovered = new Set(accumulated.map((a) => a.page))
    const finalMissing = allPages.filter((p) => !finalCovered.has(p.file))

    if (finalMissing.length) {
      generationStatusMessage.value = `已生成 ${accumulated.length}/${allPages.length} 个页面的 API 映射，${finalMissing.length} 个未生成：${finalMissing.map((p) => p.file).join('、')}。可再次点击补充。`
    } else {
      generationStatusMessage.value = `已生成全部 ${accumulated.length} 个页面的 API 映射。`
    }
  } catch (e) {
    generationStatusMessage.value = `生成失败：${e.message}`
    if (accumulated.length) {
      generatedPageApiMapping.value = [...accumulated]
      persistPrototypeResult()
    }
  } finally {
    isGenerating.value.apiMapping = false
  }
}

/* ===== 4. 导航路由 (步骤4) ===== */
const navigationRoutes = computed(() => generatedNavigationRoutes.value || [])

async function generateNavigationRoutes() {
  if (!scenarioPageResult.value) {
    generationStatusMessage.value = '请先完成步骤 04 页面设计。'
    return
  }

  isGenerating.value.navigation = true
  generationStatusMessage.value = '正在生成导航路由设计...'

  try {
    const pages = recommendedViewFiles.value
    const input = {
      pages: pages.map((p) => ({ file: p.file, responsibility: p.responsibility, priority: p.priority })),
    }
    const instruction = [
      `请根据 ${input.pages.length} 个页面清单，设计导航路由结构。`,
      '只返回 JSON，不要 Markdown。JSON 结构为数组：[{ "group": "分组名", "icon": "emoji图标", "routes": [{ "path": "/xxx/yyy", "component": "组件名.vue", "title": "中文标题", "default": true/false }] }]。',
      '按业务语义分为 3-5 个导航分组（如调度指挥、任务执行、场地管理等）。',
      '每个分组标记一个默认页（default: true）。',
      '路由 path 用小写 kebab-case，按分组前缀归类。',
    ].join('\n')

    const raw = await requestLlmGeneration('导航路由设计', instruction, input)
    const parsed = parseMaybeJson(raw)
    const items = Array.isArray(parsed) ? parsed : (parsed?.routes || parsed?.navigationRoutes || [])
    generatedNavigationRoutes.value = items.length ? items : null
    if (items.length) {
      generationStatusMessage.value = `已生成 ${items.length} 个导航分组。`
      persistPrototypeResult()
    } else {
      generationStatusMessage.value = 'LLM 未返回有效路由，请重试。'
    }
  } catch (e) {
    generationStatusMessage.value = `生成失败：${e.message}`
  } finally {
    isGenerating.value.navigation = false
  }
}

/* ===== 5. 组件契约 (步骤4 + 页面规格) ===== */
/* ===== 5. 组件契约 (步骤4 + 页面规格) ===== */
const recommendedComponentFiles = computed(() => {
  if (generatedComponentFiles.value?.length) return generatedComponentFiles.value

  if (savedFileStructure.value.components?.length) {
    return savedFileStructure.value.components.map((file) => ({
      file,
      responsibility: inferComponentResponsibility(file),
      reusedBy: recommendedViewFiles.value.map((view) => view.file),
    }))
  }

  return []
})

async function generateComponentContracts() {
  if (!recommendedViewFiles.value.length) {
    generationStatusMessage.value = '请先确保页面文件清单已加载。'
    return
  }

  isGenerating.value.components = true
  generationStatusMessage.value = '正在生成组件接口契约...'

  try {
    const specs = pageDetailSpecs.value
    const input = {
      pages: recommendedViewFiles.value.map((p) => ({ file: p.file, responsibility: p.responsibility })),
      pageSpecs: specs.slice(0, 4),
    }
    const instruction = [
      `请根据 ${input.pages.length} 个页面和页面规格，设计通用组件及其 Props/Events/Slots 接口契约。`,
      '只返回 JSON，不要 Markdown。JSON 结构为数组：[{ "file": "组件名.vue", "responsibility": "职责描述", "reusedBy": ["页面1.vue"], "props": [{ "name": "", "type": "", "required": true/false, "default": "", "description": "" }], "events": [{ "name": "", "payload": "", "description": "" }], "slots": [{ "name": "default", "description": "" }] }]。',
      '设计 5-8 个通用组件，优先提取跨页面共享的 UI 模式。',
      '每个组件的 props 定义包含 name、type、required、default、description。',
      'events 和 slots 按需定义，没有则为空数组。',
    ].join('\n')

    const raw = await requestLlmGeneration('组件接口契约', instruction, input)
    const parsed = parseMaybeJson(raw)
    const items = Array.isArray(parsed) ? parsed : (parsed?.components || parsed?.componentFiles || [])
    generatedComponentFiles.value = items.length ? items : null
    if (items.length) {
      generationStatusMessage.value = `已生成 ${items.length} 个组件契约。`
      persistPrototypeResult()
    } else {
      generationStatusMessage.value = 'LLM 未返回有效组件，请重试。'
    }
  } catch (e) {
    generationStatusMessage.value = `生成失败：${e.message}`
  } finally {
    isGenerating.value.components = false
  }
}

/* ===== 6. Mock 数据 Schema (步骤6 + 组件契约) ===== */
/* ===== 6. Mock 数据 Schema (步骤6 + 组件契约) ===== */
const recommendedMockDataFiles = computed(() => {
  if (generatedMockDataFiles.value?.length) return generatedMockDataFiles.value

  if (savedFileStructure.value.data?.length) {
    return savedFileStructure.value.data.map((file) => ({
      file,
      content: '承载页面设计阶段确认的页面清单、导航结构、页面区域和示例业务数据。',
      usedBy: recommendedViewFiles.value.map((view) => view.file),
    }))
  }

  return []
})

async function generateMockDataSchemas() {
  var contracts = allApiContracts.value
  if (!contracts.length) {
    generationStatusMessage.value = '请先完成步骤 03 交互与API（需生成 API 契约）。'
    return
  }

  isGenerating.value.mockData = true
  generationStatusMessage.value = '正在生成 Mock 数据 Schema...'

  try {
    const apiContracts = contracts
    const input = {
      apiContracts: apiContracts.slice(0, 15).map((c) => ({
        method: c.method,
        path: c.path,
        name: c.name,
        requestParams: c.requestParams || [],
        successResponse: c.successResponse || {},
      })),
      pages: recommendedViewFiles.value.map((p) => p.file),
    }
    const instruction = [
      `请根据 API 契约和页面清单，设计 Mock 数据文件及其数据结构。`,
      '只返回 JSON，不要 Markdown。JSON 结构为数组：[{ "file": "mockXxx.js", "content": "文件用途描述", "usedBy": ["页面.vue"], "schema": [{ "field": "字段名", "type": "类型", "description": "说明" }] }]。',
      '按业务域拆分 4-6 个 mock 文件（如 mockDispatch、mockTasks、mockAlerts 等）。',
      '每个 mock 文件的 schema 列出 3-8 个核心字段。',
      '字段类型与 API 契约的 requestParams 和 successResponse 保持一致。',
    ].join('\n')

    const raw = await requestLlmGeneration('Mock 数据 Schema', instruction, input)
    const parsed = parseMaybeJson(raw)
    const items = Array.isArray(parsed) ? parsed : (parsed?.mockDataFiles || parsed?.mocks || [])
    generatedMockDataFiles.value = items.length ? items : null
    if (items.length) {
      generationStatusMessage.value = `已生成 ${items.length} 个 Mock 数据 Schema。`
      persistPrototypeResult()
    } else {
      generationStatusMessage.value = 'LLM 未返回有效 Schema，请重试。'
    }
  } catch (e) {
    generationStatusMessage.value = `生成失败：${e.message}`
  } finally {
    isGenerating.value.mockData = false
  }
}

/* ===== 7. 分步 Prompt (全部产物汇总) - 增量生成 ===== */
const EXPECTED_PROMPT_STEPS = [1, 2, 3, 4]
const stepPrompts = computed(() => generatedStepPrompts.value || [])

async function generateStepPrompts() {
  if (!recommendedViewFiles.value.length) {
    generationStatusMessage.value = '请先确保页面文件清单已加载。'
    return
  }

  const existing = generatedStepPrompts.value || []
  let accumulated = [...existing]

  if (existing.length) {
    const coveredSteps = new Set(existing.map((s) => s.step))
    const missing = EXPECTED_PROMPT_STEPS.filter((s) => !coveredSteps.has(s))
    const allCovered = missing.length === 0

    if (allCovered) {
      const shouldProceed = window.confirm(
        `已生成全部 ${EXPECTED_PROMPT_STEPS.length} 个分步 Prompt。\n\n` +
        `点击「确定」将全部重新生成。\n` +
        `点击「取消」放弃本次操作。`
      )
      if (!shouldProceed) return
      accumulated = []
    } else {
      const doIncremental = window.confirm(
        `已生成 ${existing.length}/${EXPECTED_PROMPT_STEPS.length} 个分步 Prompt，` +
        `还差步骤：${missing.join('、')}。\n\n` +
        `点击「确定」仅补充遗漏的步骤。\n` +
        `点击「取消」将全部重新生成。`
      )

      if (doIncremental) {
        await doGenerateStepPrompts(missing, accumulated)
        return
      }
      accumulated = []
    }
  }

  await doGenerateStepPrompts(EXPECTED_PROMPT_STEPS, accumulated)
}

async function doGenerateStepPrompts(pendingSteps, accumulated) {
  isGenerating.value.stepPrompts = true
  generationStatusMessage.value = `正在生成分步骤 Prompt（步骤 ${pendingSteps.join('、')}）...`

  try {
    const input = {
      projectBackground: projectBackground.value,
      pages: recommendedViewFiles.value,
      pageSpecs: pageDetailSpecs.value.slice(0, 4),
      apiMapping: pageApiMapping.value.slice(0, 6),
      navigationRoutes: navigationRoutes.value,
      componentFiles: recommendedComponentFiles.value.slice(0, 5),
      mockDataFiles: recommendedMockDataFiles.value.slice(0, 4),
    }
    const instruction = [
      `请根据完整的原型设计方案，生成 ${pendingSteps.length} 个分步骤的代码生成 Prompt。只需生成步骤：${pendingSteps.join('、')}。`,
      '只返回 JSON，不要 Markdown。JSON 结构为数组：[{ "step": 1, "title": "步骤标题", "prompt": "可直接复制给 LLM 的 Prompt 文本" }]。',
      `步骤定义：1) 生成 Mock 数据和枚举常量、2) 生成通用组件、3) 生成页面（按优先级 P0→P1→P2）、4) 生成路由配置和 API 调用层。`,
      '每个 Prompt 要包含具体的文件名、组件名、页面名、关键技术约束和验收标准。',
      'Prompt 用中文编写，技术术语保留英文。',
      '重要：step 字段必须是整数，且必须是要求生成的步骤之一。',
    ].join('\n')

    const raw = await requestLlmGeneration('分步骤 Prompt', instruction, input)
    const parsed = parseMaybeJson(raw)
    const items = Array.isArray(parsed) ? parsed : (parsed?.prompts || parsed?.stepPrompts || [])

    if (items.length) {
      const pendingSet = new Set(pendingSteps)
      for (const item of items) {
        if (!pendingSet.has(item.step)) continue
        const existingIdx = accumulated.findIndex((a) => a.step === item.step)
        if (existingIdx >= 0) {
          accumulated[existingIdx] = item
        } else {
          accumulated.push(item)
        }
      }
      accumulated.sort((a, b) => a.step - b.step)
      generatedStepPrompts.value = [...accumulated]
      persistPrototypeResult()
    }

    const coveredSteps = new Set(accumulated.map((s) => s.step))
    const finalMissing = EXPECTED_PROMPT_STEPS.filter((s) => !coveredSteps.has(s))

    if (finalMissing.length) {
      generationStatusMessage.value = `已生成 ${accumulated.length}/${EXPECTED_PROMPT_STEPS.length} 个分步 Prompt，缺少步骤：${finalMissing.join('、')}。可再次点击补充。`
    } else {
      generationStatusMessage.value = `已生成全部 ${EXPECTED_PROMPT_STEPS.length} 个分步骤 Prompt。`
    }
  } catch (e) {
    generationStatusMessage.value = `生成失败：${e.message}`
    if (accumulated.length) {
      generatedStepPrompts.value = [...accumulated]
      persistPrototypeResult()
    }
  } finally {
    isGenerating.value.stepPrompts = false
  }
}

/* ===== 保留的现有逻辑 ===== */
const openPriorities = ref(['P0'])

function togglePriority(key) {
  const idx = openPriorities.value.indexOf(key)
  if (idx >= 0) { openPriorities.value.splice(idx, 1) }
  else { openPriorities.value.push(key) }
}

const PRIORITY_ORDER = ['P0', 'P1', 'P2']

function assignPriority(index, total) {
  if (index < 6) return 'P0'
  if (index < 11) return 'P1'
  return 'P2'
}

function getPriorityLabel(key) {
  return { P0: '核心页面 - 优先生成', P1: '重要页面 - 核心完成后再生成', P2: '辅助页面 - 最后生成' }[key] || key
}

/* ===== 从 scenarioPageResult 提取统一的页面设计（兼容 Phase 2 pageDesignsByScenarioKey） ===== */
const extractAllPageDesigns = (result) => {
  if (!result) return { pages: [], fileStructure: {}, navigation: [] }

  // Phase 2 格式：pageDesignsByScenarioKey（按场景 key 索引的页面设计 map）
  if (result.pageDesignsByScenarioKey) {
    const allPages = []
    let fileStructure = {}
    let navigation = []
    const keys = Object.keys(result.pageDesignsByScenarioKey)
    for (var i = 0; i < keys.length; i++) {
      var design = result.pageDesignsByScenarioKey[keys[i]]
      if (design && design.pages) allPages.push.apply(allPages, design.pages)
      if (design && design.fileStructure && !fileStructure.views) fileStructure = design.fileStructure
      if (design && design.navigation) navigation = navigation.concat(design.navigation)
    }
    return { pages: allPages, fileStructure: fileStructure, navigation: navigation }
  }

  // 旧格式：扁平 pageDesign
  if (result.pageDesign && result.pageDesign.pages && result.pageDesign.pages.length) {
    return result.pageDesign
  }

  return { pages: [], fileStructure: {}, navigation: [] }
}

const savedPageDesign = computed(() => {
  var extracted = extractAllPageDesigns(scenarioPageResult.value)
  return extracted.pages.length ? extracted : null
})
const savedFileStructure = computed(() => savedPageDesign.value?.fileStructure || {})

const savedPageList = computed(() => {
  if (savedPageDesign.value?.pages?.length) return savedPageDesign.value.pages
  return props.projectContext.selectedPageDesign ? [props.projectContext.selectedPageDesign] : []
})

const recommendedViewFiles = computed(() => {
  if (savedPageList.value.length) {
    return savedPageList.value.map((page, index) => ({
      file: page.vueFile,
      responsibility: page.goal || `实现「${page.name}」页面的业务查看、处理和反馈。`,
      source: '页面设计：页面清单 + 页面详情',
      priority: page.priority || assignPriority(index, savedPageList.value.length),
    }))
  }
  return []
})

const groupedViewFiles = computed(() => {
  const groups = { P0: [], P1: [], P2: [] }
  for (const file of recommendedViewFiles.value) {
    const p = file.priority || 'P2'
    if (groups[p]) groups[p].push(file)
  }
  return PRIORITY_ORDER.map((key) => ({ key, label: getPriorityLabel(key), files: groups[key] })).filter((g) => g.files.length)
})

/* ===== 生成顺序建议（固定内容） ===== */
const recommendedSteps = [
  { step: 1, title: '生成 Mock 数据', description: '先生成所有页面的 mock 数据文件和枚举常量，确保后续组件有数据可展示。' },
  { step: 2, title: '生成通用组件', description: '按组件接口契约生成 StatusTag、DataTable、MetricCard 等可复用组件。' },
  { step: 3, title: '生成页面（按优先级）', description: '先 P0 核心页面（调度看板、任务列表），再 P1 重要页面（入场核验、统计分析），最后 P2 辅助页面。' },
  { step: 4, title: '生成路由和 API 层', description: '配置 vue-router 路由表，创建 api/ 目录下的请求封装。' },
]

/* ===== 目录结构建议（固定内容） ===== */
const projectStructure = {
  description: '基于 Vue3 + Vite 的前端项目目录结构',
  tree: [
    'frontend/',
    '├── index.html',
    '├── package.json',
    '├── vite.config.js',
    '└── src/',
    '    ├── App.vue                    # 根组件 + 路由出口',
    '    ├── main.js                   # createApp + router + 全局样式',
    '    ├── style.css                 # 全局样式变量和基础重置',
    '    ├── router/',
    '    │   └── index.js              # vue-router 路由配置',
    '    ├── views/                    # 页面组件（按业务场景组织）',
    '    ├── components/               # 通用组件（按功能类型组织）',
    '    └── data/                     # Mock 数据 + 常量枚举',
  ],
}

/* ===== 样式规范（固定内容） ===== */
const styleGuide = {
  colorTokens: [
    { name: '--color-primary', value: '#1a73e8', usage: '主色：按钮、链接、选中态' },
    { name: '--color-success', value: '#0d904f', usage: '成功状态：完成、通过' },
    { name: '--color-warning', value: '#f5a623', usage: '警告状态：待处理、注意' },
    { name: '--color-danger', value: '#d93025', usage: '危险/错误：告警、拒绝、异常' },
    { name: '--color-bg', value: '#f5f6fa', usage: '页面背景色' },
    { name: '--color-surface', value: '#ffffff', usage: '卡片/面板背景色' },
    { name: '--color-text', value: '#1f1f1f', usage: '主要文字' },
    { name: '--color-text-secondary', value: '#5f6368', usage: '次要文字/说明' },
    { name: '--color-border', value: '#e0e0e0', usage: '边框/分割线' },
  ],
  spacing: '4px 步长，常用 8px / 12px / 16px / 24px / 32px',
  fontSize: '12px 说明文字 / 14px 正文 / 16px 标题 / 20px 大标题',
  breakpoints: [
    { name: 'mobile', value: '< 768px' },
    { name: 'tablet', value: '768px - 1024px' },
    { name: 'desktop', value: '> 1024px' },
  ],
  componentNaming: 'PascalCase 文件名，kebab-case 路由路径',
  vueConvention: '单文件组件 .vue，Options API 或 Composition API（推荐 <script setup>）',
}

const activePromptStep = ref(null)
const expandedPageSpecs = ref([0])

function isPageSpecOpen(index) {
  return expandedPageSpecs.value.includes(index)
}

function togglePageSpec(index) {
  const idx = expandedPageSpecs.value.indexOf(index)
  if (idx >= 0) {
    expandedPageSpecs.value.splice(idx, 1)
  } else {
    expandedPageSpecs.value.push(index)
  }
}

function togglePromptStep(index) {
  activePromptStep.value = activePromptStep.value === index ? null : index
}

function copyPrompt(prompt) {
  navigator.clipboard?.writeText(prompt)
}

const suggestionTabs = [
  { key: 'views', label: '页面文件' },
  { key: 'background', label: '业务背景' },
  { key: 'pageSpecs', label: '页面规格' },
  { key: 'apiMapping', label: '页面-API映射' },
  { key: 'navigation', label: '导航路由' },
  { key: 'components', label: '组件拆分' },
  { key: 'mockData', label: 'Mock 数据' },
  { key: 'projectStructure', label: '目录结构' },
  { key: 'styleGuide', label: '样式规范' },
  { key: 'steps', label: '生成顺序' },
  { key: 'stepPrompts', label: '分步 Prompt' },
]

function confirmAndNext() {
  emit('suggestion-confirm', {
    suggestion: {
      viewFiles: recommendedViewFiles.value,
      pageDetailSpecs: pageDetailSpecs.value,
      componentFiles: recommendedComponentFiles.value,
      mockDataFiles: recommendedMockDataFiles.value,
      generationSteps: recommendedSteps,
      stepPrompts: stepPrompts.value,
      pageApiMapping: pageApiMapping.value,
      navigationRoutes: navigationRoutes.value,
      projectBackground: projectBackground.value,
      projectStructure,
      styleGuide,
      pageDesign: extractAllPageDesigns(scenarioPageResult.value),
      apiContract: interactionApiResult.value || props.projectContext.selectedApiContract || null,
    },
  })
}

function inferComponentResponsibility(file) {
  if (file.includes('Header')) return '承载页面标题、状态摘要和主操作入口。'
  if (file.includes('Filter')) return '承载筛选条件、查询和重置动作。'
  if (file.includes('Detail')) return '承载当前记录详情、处理表单和状态反馈。'
  if (file.includes('Table')) return '承载列表展示、分页和行级操作。'
  return '根据页面设计阶段的文件建议拆分出的可复用组件。'
}
</script>

<style scoped>
.prototype-suggestion-view {
  margin-top: 16px;
}

.gen-status {
  margin: 0 0 12px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 700;
}

.gen-status.error {
  background: #fef2f2;
  color: #dc2626;
}

.inline-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.gen-btn {
  flex-shrink: 0;
  border: 1px solid #1d4ed8;
  border-radius: 6px;
  padding: 6px 14px;
  background: #ffffff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.gen-btn:hover:not(:disabled) {
  background: #1d4ed8;
  color: #ffffff;
}

.gen-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.suggestion-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.suggestion-tabs button {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  background: #ffffff;
  color: #1e293b;
  font-weight: 800;
}

.suggestion-tabs button.active {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}

.suggestion-panel,
.prompt-panel {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 22px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.suggestion-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.suggestion-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

/* 优先级折叠手风琴 */
.priority-accordion {
  display: grid;
  gap: 10px;
}

.priority-group {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.priority-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: none;
  padding: 12px 16px;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.15s;
}

.priority-toggle:hover {
  background: #f1f5f9;
}

.priority-toggle.open {
  background: #eff6ff;
  border-bottom: 1px solid #e2e8f0;
}

.priority-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 26px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.5px;
}

.priority-badge.priority-p0 {
  background: #fee2e2;
  color: #dc2626;
}

.priority-badge.priority-p1 {
  background: #fef3c7;
  color: #d97706;
}

.priority-badge.priority-p2 {
  background: #e0e7ff;
  color: #4f46e5;
}

.priority-label {
  flex: 1;
  color: #334155;
  font-weight: 700;
}

.priority-count {
  color: #94a3b8;
  font-size: 13px;
  font-weight: 600;
}

.toggle-icon {
  color: #94a3b8;
  font-size: 14px;
  width: 20px;
  text-align: center;
  transition: transform 0.15s;
}

.priority-files {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  padding: 12px 16px 16px;
  background: #ffffff;
}

/* 页面-API 映射表格 */
.mapping-table-wrap {
  overflow-x: auto;
}

.mapping-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.mapping-table th {
  padding: 10px 12px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 800;
  text-align: left;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.mapping-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.mapping-table tr.first-row td {
  border-top: 2px solid #e2e8f0;
}

.mapping-table tr:hover td {
  background: #f8fafc;
}

.mapping-table .page-cell {
  background: #f8fafc;
  font-weight: 700;
  color: #0f172a;
  min-width: 180px;
}

.mapping-table .page-cell strong {
  color: #0f172a;
  font-size: 13px;
}

.mapping-table code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #1d4ed8;
  white-space: nowrap;
}

.mapping-table .usage-cell {
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.method-tag {
  display: inline-block;
  min-width: 48px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 900;
  text-align: center;
  letter-spacing: 0.5px;
}

.method-tag.method-get {
  background: #dcfce7;
  color: #16a34a;
}

.method-tag.method-post {
  background: #dbeafe;
  color: #2563eb;
}

.method-tag.method-put {
  background: #fef3c7;
  color: #d97706;
}

.method-tag.method-delete {
  background: #fee2e2;
  color: #dc2626;
}

/* 导航路由 */
.nav-groups {
  display: grid;
  gap: 14px;
}

.nav-group-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.nav-group-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.nav-group-icon {
  font-size: 18px;
}

.nav-group-header h3 {
  flex: 1;
  margin: 0;
  color: #0f172a;
  font-size: 15px;
  font-weight: 800;
}

.nav-group-header small {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 600;
}

.route-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.route-table th {
  padding: 8px 14px;
  background: #ffffff;
  color: #94a3b8;
  font-weight: 700;
  font-size: 11px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f1f5f9;
}

.route-table td {
  padding: 8px 14px;
  border-bottom: 1px solid #f8fafc;
  color: #334155;
}

.route-table code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  color: #1d4ed8;
}

.route-table strong {
  color: #0f172a;
}

.default-badge {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 4px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 11px;
  font-weight: 800;
}

.text-muted {
  color: #cbd5e1;
}

.suggestion-card h3 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 18px;
}

.suggestion-card p {
  margin: 0 0 10px;
  color: #526174;
  line-height: 1.65;
}

.suggestion-card small {
  color: #2563eb;
  line-height: 1.55;
  font-weight: 800;
}

.generation-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.generation-list li {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.generation-list span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 900;
}

.generation-list strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
}

.generation-list p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.prompt-panel {
  margin-top: 16px;
}

.next-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

pre {
  overflow-x: auto;
  margin: 0;
  border-radius: 8px;
  padding: 16px;
  background: #0f172a;
  color: #e2e8f0;
  line-height: 1.65;
  white-space: pre-wrap;
}

@media (max-width: 920px) {
  .suggestion-list {
    grid-template-columns: 1fr;
  }

  .priority-files {
    grid-template-columns: 1fr;
  }

  .component-specs,
  .mock-specs,
  .page-specs,
  .bg-layout {
    grid-template-columns: 1fr;
  }

  .style-guide-grid {
    grid-template-columns: 1fr;
  }
}

/* ===== 组件规格 / Mock 规格 / 页面规格 通用样式 ===== */
.component-specs,
.mock-specs,
.page-specs {
  display: grid;
  gap: 14px;
}

.component-spec-card,
.mock-spec-card,
.page-spec-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.comp-header {
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.comp-header h3 {
  margin: 0 0 4px;
  color: #0f172a;
  font-size: 16px;
}

.comp-header small {
  color: #64748b;
  font-size: 12px;
}

.spec-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  border: none;
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 16px;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.15s;
}

.spec-toggle:hover {
  background: #f1f5f9;
}

.spec-toggle.open {
  background: #eff6ff;
}

.spec-toggle h3 {
  margin: 0;
  color: #0f172a;
  font-size: 16px;
}

.spec-toggle-icon {
  color: #94a3b8;
  font-size: 14px;
  width: 18px;
  text-align: center;
  flex-shrink: 0;
  transition: transform 0.15s;
}

.spec-body {
  background: #ffffff;
}

.comp-section {
  padding: 14px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.comp-section:last-child {
  border-bottom: none;
}

.comp-section-label {
  display: block;
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.comp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.comp-table th {
  padding: 6px 10px;
  background: #f8fafc;
  color: #94a3b8;
  font-weight: 700;
  font-size: 10px;
  text-align: left;
  text-transform: uppercase;
  border-bottom: 1px solid #e2e8f0;
}

.comp-table td {
  padding: 6px 10px;
  border-bottom: 1px solid #f8fafc;
  color: #334155;
  vertical-align: top;
}

.comp-table code {
  background: #f1f5f9;
  padding: 1px 5px;
  border-radius: 3px;
  font-size: 11px;
  color: #1d4ed8;
}

.type-code {
  color: #7c3aed !important;
}

.comp-footer {
  padding: 10px 16px;
  background: #fafbfc;
  border-top: 1px solid #f1f5f9;
}

.comp-footer small {
  color: #64748b;
  font-size: 12px;
}

/* ===== 页面规格 ===== */
.zone-list {
  display: grid;
  gap: 8px;
}

.zone-item {
  border: 1px dashed #e2e8f0;
  border-radius: 6px;
  padding: 10px 12px;
}

.zone-item strong {
  display: block;
  margin-bottom: 4px;
  color: #0f172a;
  font-size: 13px;
}

.zone-item p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.state-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.state-tag-item {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
}

.state-tag-item.state-loading { background: #f1f5f9; color: #64748b; }
.state-tag-item.state-empty { background: #fef3c7; color: #d97706; }
.state-tag-item.state-error { background: #fee2e2; color: #dc2626; }
.state-tag-item.state-success { background: #dcfce7; color: #16a34a; }
.state-tag-item.state-pending { background: #e0e7ff; color: #4f46e5; }
.state-tag-item.state-inProgress { background: #dbeafe; color: #2563eb; }
.state-tag-item.state-completed { background: #dcfce7; color: #16a34a; }
.state-tag-item.state-validating { background: #fef3c7; color: #d97706; }

.state-desc-list,
.interaction-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.state-desc-list li,
.interaction-list li {
  padding: 4px 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.5;
}

.state-desc-list strong {
  color: #0f172a;
}

/* ===== 业务背景 ===== */
.bg-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.bg-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.bg-label {
  display: block;
  margin-bottom: 8px;
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bg-card h3 {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 18px;
}

.bg-card p {
  margin: 0 0 6px;
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
}

/* ===== 目录结构 ===== */
.tree-pre {
  background: #0f172a;
  color: #e2e8f0;
  padding: 16px;
  border-radius: 8px;
  font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 12px;
  line-height: 1.8;
  overflow-x: auto;
  white-space: pre;
}

/* ===== 样式规范 ===== */
.style-guide-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.color-swatches {
  display: grid;
  gap: 8px;
}

.color-swatch {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.swatch-block {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.color-swatch code {
  display: block;
  font-size: 11px;
  color: #1d4ed8;
}

.color-swatch small {
  display: block;
  color: #94a3b8;
  font-size: 11px;
}

.color-swatch p {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 11px;
}

/* ===== 分步骤 Prompt ===== */
.step-prompts-accordion {
  display: grid;
  gap: 8px;
}

.sp-group {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.sp-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  border: none;
  padding: 10px 14px;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  transition: background 0.15s;
}

.sp-toggle:hover {
  background: #f1f5f9;
}

.sp-toggle.open {
  background: #eff6ff;
  border-bottom: 1px solid #e2e8f0;
}

.sp-step-num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 900;
  font-size: 13px;
  flex-shrink: 0;
}

.sp-title {
  flex: 1;
  color: #0f172a;
  font-weight: 700;
}

.sp-body {
  padding: 12px 14px 14px;
}

.sp-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.copy-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 4px 12px;
  background: #ffffff;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.15s;
}

.copy-btn:hover {
  border-color: #1d4ed8;
  color: #1d4ed8;
  background: #eff6ff;
}
</style>
