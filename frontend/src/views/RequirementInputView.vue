<template>
  <section class="requirement-input-view" aria-labelledby="requirement-input-title">
    <ViewHeading
      eyebrow="Requirement Intake"
      title="需求输入工作台"
      title-id="requirement-input-title"
      description="直接输入客户需求，或导入外部 AI 已整理的 Markdown，系统先形成需求拆解草案；你回复待确认问题后，再提交给场景识别。"
    />

    <ProjectContextCard :context="projectContext" @context-update="emit('context-update', $event)" />

    <form class="intake-panel" @submit.prevent="handleAnalyze">
      <section class="md-import-block" aria-labelledby="md-import-title">
        <div class="field-head">
          <label id="md-import-title" for="requirement-md-file">导入已整理 MD</label>
          <span>{{ pendingMarkdownImport?.fileName || importedMarkdownName || '可选' }}</span>
        </div>
        <input
          id="requirement-md-file"
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
          @change="handleMarkdownImport"
        />
        <p>适合先用 Gemini、Codex、WorkBuddy 在系统外整理材料后导入。系统会按标题解析为需求拆解草案，并保留原始 Markdown 供后续步骤溯源。</p>
        <p v-if="importMessage" class="import-message">{{ importMessage }}</p>
        <div v-if="pendingMarkdownImport" class="md-import-preview">
          <div class="panel-head">
            <strong>待应用：{{ pendingMarkdownImport.fileName }}</strong>
            <span>{{ pendingMarkdownImport.markdown.length }} 字</span>
          </div>
          <p class="section-desc">当前只是预览，尚未覆盖下方客户原始需求和需求拆解草案。点击应用后会替换当前草案并保存为最新需求拆解草稿。</p>
          <dl>
            <div>
              <dt>业务背景</dt>
              <dd>{{ pendingMarkdownImport.analysis.businessBackground }}</dd>
            </div>
            <div>
              <dt>解析结果</dt>
              <dd>
                {{ pendingMarkdownImport.analysis.painPoints.length }} 个痛点，
                {{ pendingMarkdownImport.analysis.businessGoals.length }} 个目标，
                {{ pendingMarkdownImport.analysis.userRoles.length }} 个角色，
                {{ pendingMarkdownImport.analysis.questions.length }} 个待确认问题
              </dd>
            </div>
          </dl>
          <div class="button-row">
            <button class="secondary-button" type="button" @click="cancelMarkdownImport">取消导入</button>
            <button class="gen-btn" type="button" @click="applyMarkdownImport">应用为当前需求拆解</button>
          </div>
        </div>
      </section>

      <section class="text-block" aria-labelledby="requirement-text-title">
        <div class="field-head">
          <label id="requirement-text-title" for="customer-requirement">客户原始需求</label>
          <span>{{ requirementLength }} 字</span>
        </div>

        <textarea
          id="customer-requirement"
          v-model.trim="requirementText"
          rows="3"
          placeholder="可以直接粘贴客户需求、会议纪要、招标片段、方案描述；如材料较多，建议先用外部 AI 整理为 Markdown 后导入。"
          :aria-invalid="Boolean(errorMessage)"
        ></textarea>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      </section>

      <div class="button-row">
        <button class="secondary-button" type="button" :disabled="isLoading" @click="clearInput">
          清空
        </button>
        <button class="gen-btn" type="submit" :disabled="isLoading">
          {{ isLoading ? '正在生成草案...' : '生成草案' }}
        </button>
      </div>
    </form>

    <section v-if="analysisResult" class="analysis-preview" :class="{ collapsed: !isAnalysisOpen }" aria-labelledby="analysis-preview-title">
      <button class="analysis-toggle" type="button" :aria-expanded="isAnalysisOpen" @click="isAnalysisOpen = !isAnalysisOpen">
        <div class="analysis-heading">
          <p class="eyebrow">Requirement Analysis</p>
          <h3 id="analysis-preview-title">需求拆解草案</h3>
        </div>
        <small>{{ isAnalysisOpen ? '收起 ▲' : '展开 ▼' }}</small>
      </button>

      <div v-if="isAnalysisOpen" class="analysis-body">
        <section class="analysis-editor" aria-labelledby="analysis-editor-title">
          <div class="panel-head">
            <strong id="analysis-editor-title">可视化修改</strong>
            <span>修改后会同步到需求拆解草案</span>
          </div>

          <label>
            <span>业务背景</span>
            <textarea v-model="editableAnalysis.businessBackground" rows="3" @input="syncEditableAnalysis"></textarea>
          </label>

          <div class="editor-grid">
            <label>
              <span>客户痛点（每行一项）</span>
              <textarea v-model="editableAnalysis.painPointsText" rows="5" @input="syncEditableAnalysis"></textarea>
            </label>
            <label>
              <span>业务目标（每行一项）</span>
              <textarea v-model="editableAnalysis.businessGoalsText" rows="5" @input="syncEditableAnalysis"></textarea>
            </label>
          </div>

          <label>
            <span>用户角色（每行：角色 | 职责）</span>
            <textarea v-model="editableAnalysis.userRolesText" rows="5" @input="syncEditableAnalysis"></textarea>
          </label>

          <label>
            <span>待确认问题（每行一项）</span>
            <textarea v-model="editableAnalysis.questionsText" rows="5" @input="syncEditableAnalysis"></textarea>
          </label>
        </section>

        <article class="analysis-card wide">
          <span>业务背景</span>
          <p>{{ analysisResult.businessBackground }}</p>
        </article>

        <article class="analysis-card">
          <span>客户痛点</span>
          <ul>
            <li v-for="item in analysisResult.painPoints" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="analysis-card">
          <span>业务目标</span>
          <ul>
            <li v-for="item in analysisResult.businessGoals" :key="item">{{ item }}</li>
          </ul>
        </article>

        <article class="analysis-card">
          <span>用户角色</span>
          <dl>
            <div v-for="role in analysisResult.userRoles" :key="role.name">
              <dt>{{ role.name }}</dt>
              <dd>{{ role.responsibility }}</dd>
            </div>
          </dl>
        </article>

      <section class="question-replies" aria-labelledby="question-replies-title">
        <div class="analysis-heading compact">
          <p class="eyebrow">Questions</p>
          <h3 id="question-replies-title">业务澄清对话</h3>
          <p class="section-desc">基于上方需求拆解草案补充业务细节，LLM 会整理成可传给「场景→页面」的角色边界、流程、异常、集成和指标信息。</p>
        </div>

        <div class="clarification-layout">
          <aside class="question-list" aria-label="待澄清问题">
            <button
              v-for="(question, index) in analysisResult.questions"
              :key="question"
              type="button"
              :class="{ active: activeQuestionIndex === index }"
              @click="activeQuestionIndex = index"
            >
              <strong>{{ index + 1 }}</strong>
              <span>{{ question }}</span>
            </button>
            <button
              type="button"
              :class="{ active: activeQuestionIndex === analysisResult.questions.length }"
              @click="activeQuestionIndex = analysisResult.questions.length"
            >
              <strong>+</strong>
              <span>其他补充</span>
            </button>
          </aside>

          <div class="chat-panel">
            <div class="chat-thread" aria-live="polite">
              <article class="chat-message assistant">
                <span>LLM</span>
                <p>{{ activeQuestionText }}</p>
              </article>
              <article v-for="message in clarificationMessages" :key="message.id" class="chat-message" :class="message.role">
                <span>{{ message.role === 'user' ? '你' : 'LLM' }}</span>
                <p>{{ message.content }}</p>
              </article>
              <article v-if="clarificationError" class="chat-message assistant error">
                <span>错误</span>
                <p>{{ clarificationError }}</p>
              </article>
            </div>

            <label class="chat-input">
              <span>补充回复</span>
              <textarea
                v-model.trim="clarificationInput"
                rows="4"
                placeholder="例如：门禁系统通过车牌识别和预约号核验；司机移动端弱网时需缓存任务和照片；超速阈值按厂区道路分级..."
                @keydown.meta.enter.prevent="sendClarification"
                @keydown.ctrl.enter.prevent="sendClarification"
              ></textarea>
            </label>

            <div class="chat-actions">
              <button class="secondary-button" type="button" :disabled="isClarifying || !activeQuestionText" @click="insertQuestionHint">
                带入当前问题
              </button>
              <button class="gen-btn" type="button" :disabled="isClarifying || !clarificationInput" @click="sendClarification">
                {{ isClarifying ? 'LLM 整理中...' : '发送给 LLM 补充拆解' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="clarificationInsights.length" class="insight-panel">
          <div class="panel-head">
            <strong>已整理的业务拆解补充</strong>
            <span>{{ clarificationInsights.length }} 条，将随确认结果传给下一步</span>
          </div>
          <article v-for="item in clarificationInsights" :key="item.id" class="insight-card">
            <span>{{ item.category }}</span>
            <strong>{{ item.title }}</strong>
            <p>{{ item.detail }}</p>
            <small v-if="item.scenarioValue">场景价值：{{ item.scenarioValue }}</small>
          </article>
        </div>
      </section>

      </div>

      <div class="next-action">
        <button class="primary-button" type="button" @click="goNext">
          确认并进入下一步
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ProjectContextCard from '../components/ProjectContextCard.vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['analysis-complete', 'analysis-draft-update', 'context-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const requirementText = ref('')
const questionReplies = ref([])
const activeQuestionIndex = ref(0)
const clarificationInput = ref('')
const clarificationMessages = ref([])
const clarificationInsights = ref([])
const clarificationError = ref('')
const isClarifying = ref(false)
const errorMessage = ref('')
const isLoading = ref(false)
const analysisResult = ref(null)
const isAnalysisOpen = ref(true)
const importedMarkdownName = ref('')
const importedMarkdownText = ref('')
const pendingMarkdownImport = ref(null)
const importMessage = ref('')
const editableAnalysis = ref({
  businessBackground: '',
  painPointsText: '',
  businessGoalsText: '',
  userRolesText: '',
  questionsText: '',
})
const isSyncingEditableAnalysis = ref(false)

const requirementLength = computed(() => requirementText.value.length)
const activeQuestionText = computed(() => {
  const questions = analysisResult.value?.questions || []
  return questions[activeQuestionIndex.value] || '其他补充：请补充任何会影响场景识别、页面拆解、流程边界、异常规则或系统对接的信息。'
})

watch(
  () => props.projectContext.stepResults?.requirement,
  (savedRequirement) => {
    if (!savedRequirement?.analysis) {
      return
    }

    requirementText.value = savedRequirement.manualRequirement || savedRequirement.sourceRequirement || ''
    analysisResult.value = savedRequirement.analysis
    importedMarkdownText.value = savedRequirement.analysis.importedMarkdown || ''
    importedMarkdownName.value = savedRequirement.analysis.importedMarkdownName || ''
    questionReplies.value = (savedRequirement.analysis.questionResponses || savedRequirement.analysis.questions || [])
      .map((item) => item.answer || '')
    clarificationMessages.value = savedRequirement.analysis.clarificationMessages || []
    clarificationInsights.value = savedRequirement.analysis.clarificationInsights || []
    hydrateEditableAnalysis(savedRequirement.analysis)
  },
  { immediate: true },
)

watch(analysisResult, (nextAnalysis) => {
  const questionCount = nextAnalysis?.questions?.length || 0
  if (activeQuestionIndex.value >= questionCount) activeQuestionIndex.value = 0
})

const defaultAnalysis = {
  businessBackground: '请补充客户业务背景或导入已整理的需求材料。',
  painPoints: ['需进一步识别客户当前流程中的痛点、约束和人工处理环节。'],
  businessGoals: ['明确本轮 FDE 原型要验证的核心业务流程和页面范围。'],
  userRoles: [
    {
      name: '业务负责人',
      responsibility: '确认业务目标、流程边界和原型验收标准。',
    },
  ],
  questions: ['本轮原型最需要优先验证的业务闭环是什么？'],
}

const combinedRequirementInput = computed(() => {
  const parts = [requirementText.value]
  if (importedMarkdownText.value && importedMarkdownText.value !== requirementText.value) {
    parts.push(importedMarkdownText.value)
  }
  return parts.filter(Boolean).join('\n\n')
})

function listToText(items) {
  return (items || []).map((item) => String(item || '').trim()).filter(Boolean).join('\n')
}

function textToList(text) {
  return String(text || '')
    .split('\n')
    .map((item) => item.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean)
}

function hydrateEditableAnalysis(analysis) {
  isSyncingEditableAnalysis.value = true
  editableAnalysis.value = {
    businessBackground: analysis?.businessBackground || '',
    painPointsText: listToText(analysis?.painPoints || []),
    businessGoalsText: listToText(analysis?.businessGoals || []),
    userRolesText: (analysis?.userRoles || [])
      .map((role) => `${role.name || ''} | ${role.responsibility || ''}`.trim())
      .filter(Boolean)
      .join('\n'),
    questionsText: listToText(analysis?.questions || []),
  }
  isSyncingEditableAnalysis.value = false
}

function parseRoleLine(line) {
  const [name, ...rest] = String(line || '').split('|')
  const roleName = name.trim()
  const responsibility = rest.join('|').trim()
  if (!roleName && !responsibility) return null
  return {
    name: roleName || '未命名角色',
    responsibility,
  }
}

function syncEditableAnalysis() {
  if (!analysisResult.value || isSyncingEditableAnalysis.value) return
  analysisResult.value = enrichAnalysis({
    ...analysisResult.value,
    businessBackground: editableAnalysis.value.businessBackground.trim(),
    painPoints: textToList(editableAnalysis.value.painPointsText),
    businessGoals: textToList(editableAnalysis.value.businessGoalsText),
    userRoles: textToList(editableAnalysis.value.userRolesText).map(parseRoleLine).filter(Boolean),
    questions: textToList(editableAnalysis.value.questionsText),
  }, analysisResult.value.generationSource || 'manual')
  questionReplies.value = (analysisResult.value.questions || []).map((_, index) => questionReplies.value[index] || '')
}

function splitSentences(text) {
  return text
    .split(/[。！？!?.\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function normalizeMarkdownHeading(text) {
  return String(text || '')
    .replace(/^\s*\d+[.、]\s*/, '')
    .replace(/[：:]\s*$/, '')
    .trim()
}

function parseMarkdownSections(markdown) {
  const sections = []
  let current = null

  for (const line of String(markdown || '').split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/)
    if (heading) {
      current = {
        level: heading[1].length,
        title: normalizeMarkdownHeading(heading[2]),
        lines: [],
      }
      sections.push(current)
      continue
    }

    if (current) current.lines.push(line)
  }

  return sections
    .map((section) => ({
      ...section,
      content: section.lines.join('\n').trim(),
    }))
    .filter((section) => section.title || section.content)
}

function getSectionsByKeywords(sections, keywords) {
  return sections.filter((section) => keywords.some((keyword) => section.title.includes(keyword)))
}

function extractBulletItems(content) {
  const lines = String(content || '').split(/\r?\n/)
  const bulletItems = lines
    .map((line) => line.match(/^\s*(?:[-*+]|\d+[.、])\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean)

  if (bulletItems.length) return bulletItems
  return String(content || '')
    .split(/[。；;\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function stripMarkdownTableCell(cell) {
  return String(cell || '').replace(/\*\*/g, '').trim()
}

function extractRoles(content) {
  const lines = String(content || '').split(/\r?\n/)
  const tableRows = lines
    .filter((line) => line.trim().startsWith('|') && line.trim().endsWith('|'))
    .filter((line) => !/^\s*\|?\s*:?-{2,}:?/.test(line.replace(/\|/g, '')))
    .map((line) => line.split('|').slice(1, -1).map(stripMarkdownTableCell))
    .filter((cells) => cells.length >= 2 && !cells[0].includes('角色'))

  if (tableRows.length) {
    return tableRows.map((cells) => ({
      name: cells[0] || '未命名角色',
      responsibility: cells[1] || cells.slice(1).join('；'),
    }))
  }

  return extractBulletItems(content).map((item) => {
    const [name, ...rest] = item.split(/[：:|-]/)
    return {
      name: name.trim() || '未命名角色',
      responsibility: rest.join(' ').trim() || item,
    }
  })
}

function firstContent(sections, keywords) {
  return getSectionsByKeywords(sections, keywords)[0]?.content || ''
}

function sectionItems(sections, keywords) {
  return getSectionsByKeywords(sections, keywords).flatMap((section) => extractBulletItems(section.content))
}

function buildInsightsFromSections(sections) {
  const mappedTitles = ['项目背景', '客户目标', '业务目标', '当前痛点', '客户痛点', '用户角色', '角色', '待客户确认问题', '待确认问题']
  return sections
    .filter((section) => section.content && !mappedTitles.some((title) => section.title.includes(title)))
    .map((section, index) => ({
      id: `md-${Date.now()}-${index}`,
      category: section.title || '导入补充',
      title: section.title || 'Markdown 补充内容',
      detail: section.content.slice(0, 1200),
      scenarioValue: '来自导入 Markdown，可用于下一步补充场景、流程、页面和接口设计。',
    }))
}

function parseMarkdownRequirement(markdown, fileName) {
  const sections = parseMarkdownSections(markdown)
  const background = firstContent(sections, ['项目背景', '业务背景', '背景'])
  const goals = sectionItems(sections, ['客户目标', '业务目标', '目标'])
  const painPoints = sectionItems(sections, ['当前痛点', '客户痛点', '痛点'])
  const roleSection = getSectionsByKeywords(sections, ['用户角色', '角色与职责', '角色'])[0]
  const questions = sectionItems(sections, ['待客户确认问题', '待确认问题', '待确认'])

  return enrichAnalysis({
    businessBackground: background || '已导入外部 AI 整理的 Markdown，请在可视化区域补充业务背景。',
    painPoints: painPoints.length ? painPoints : defaultAnalysis.painPoints,
    businessGoals: goals.length ? goals : defaultAnalysis.businessGoals,
    userRoles: roleSection ? extractRoles(roleSection.content) : defaultAnalysis.userRoles,
    questions: questions.length ? questions : defaultAnalysis.questions,
    clarificationInsights: buildInsightsFromSections(sections),
    importedMarkdown: markdown,
    importedMarkdownName: fileName,
  }, 'markdown-import')
}

async function handleMarkdownImport(event) {
  const file = event.target.files?.[0]
  importMessage.value = ''

  if (!file) return
  if (!/\.(md|markdown|txt)$/i.test(file.name)) {
    importMessage.value = '请选择 Markdown 文件。'
    event.target.value = ''
    return
  }

  try {
    const markdown = await file.text()
    const parsedAnalysis = parseMarkdownRequirement(markdown, file.name)
    pendingMarkdownImport.value = {
      fileName: file.name,
      markdown,
      analysis: parsedAnalysis,
    }
    importMessage.value = `已读取 ${file.name}，请预览后决定是否应用。`
  } catch (error) {
    importMessage.value = 'Markdown 导入失败，请检查文件内容。'
  } finally {
    event.target.value = ''
  }
}

function cancelMarkdownImport() {
  pendingMarkdownImport.value = null
  importMessage.value = '已取消本次 Markdown 导入，当前内容未改变。'
}

function applyMarkdownImport() {
  if (!pendingMarkdownImport.value) return

  const hasExistingDraft = Boolean(requirementText.value || analysisResult.value)
  if (hasExistingDraft && !window.confirm('应用导入 Markdown 会覆盖当前客户原始需求和需求拆解草案，是否继续？')) {
    return
  }

  const pending = pendingMarkdownImport.value
  importedMarkdownName.value = pending.fileName
  importedMarkdownText.value = pending.markdown
  requirementText.value = pending.markdown
  analysisResult.value = pending.analysis
  questionReplies.value = pending.analysis.questions.map(() => '')
  activeQuestionIndex.value = 0
  clarificationMessages.value = []
  clarificationInsights.value = pending.analysis.clarificationInsights || []
  clarificationError.value = ''
  hydrateEditableAnalysis(pending.analysis)
  pendingMarkdownImport.value = null
  importMessage.value = `已应用 ${pending.fileName}，可在下方可视化修改后进入下一步。`
  emit('analysis-draft-update', buildRequirementResult(pending.analysis, []))
}

function buildDynamicAnalysis(text) {
  const fallback = defaultAnalysis
  const sourceText = text
  const lowerText = sourceText.toLowerCase()
  const sentences = splitSentences(sourceText)
  const topSentences = sentences.slice(0, 4)
  const firstSentence = topSentences[0] || ''

  const businessBackground = firstSentence
    ? `基于当前输入，项目背景可归纳为：${firstSentence}。`
    : fallback.businessBackground

  const dynamicPainPoints = topSentences.length
    ? topSentences.map((item) => `需求中提到：${item}`)
    : fallback.painPoints

  const dynamicGoals = [
    '形成可落地的 FDE 原型方案。',
    '沉淀可复用的业务流程、页面和接口契约。',
    '基于文本输入完成需求理解和场景识别。',
  ]

  const roleRules = [
    {
      hit: ['司机', '车队', '车辆'],
      role: {
        name: '司机 / 车队执行人员',
        responsibility: '查看任务、确认到达、回传现场状态并反馈执行异常。',
      },
    },
    {
      hit: ['仓储', '仓库', '库存'],
      role: {
        name: '仓储管理人员',
        responsibility: '维护出入库状态、核对物资位置并跟踪库存波动。',
      },
    },
    {
      hit: ['调度', '派单', '任务'],
      role: {
        name: '调度员',
        responsibility: '编排任务、调整作业顺序并处理执行冲突。',
      },
    },
    {
      hit: ['安全', '告警', '风险'],
      role: {
        name: '安全管理人员',
        responsibility: '监控风险告警、跟踪异常事件并推动闭环处理。',
      },
    },
    {
      hit: ['费用', '成本', '结算'],
      role: {
        name: '经营 / 财务人员',
        responsibility: '跟踪成本、核对费用项并支持结算分析。',
      },
    },
  ]

  const dynamicRoles = roleRules
    .filter((rule) => rule.hit.some((keyword) => lowerText.includes(keyword)))
    .map((rule) => rule.role)

  if (!dynamicRoles.length) {
    dynamicRoles.push(...fallback.userRoles)
  }

  const dynamicQuestions = []

  if (text.length < 80) {
    dynamicQuestions.push('当前需求描述较短，是否可以补充核心业务流程、角色边界和成功标准？')
  }

  if (lowerText.includes('移动') || lowerText.includes('手机')) {
    dynamicQuestions.push('移动端是否需要离线能力，以及弱网场景下的数据同步策略是什么？')
  }

  if (lowerText.includes('告警') || lowerText.includes('异常') || lowerText.includes('安全')) {
    dynamicQuestions.push('异常告警的分级规则、触发阈值和责任人分派机制是否已明确？')
  }

  if (lowerText.includes('仓') || lowerText.includes('库存') || lowerText.includes('物资')) {
    dynamicQuestions.push('仓储与运输数据口径是否统一，是否需要与现有 WMS/ERP 对齐？')
  }

  if (lowerText.includes('费用') || lowerText.includes('成本') || lowerText.includes('结算')) {
    dynamicQuestions.push('成本核算口径与结算周期如何定义，是否需要按任务维度归集？')
  }

  if (!dynamicQuestions.length) {
    dynamicQuestions.push(...fallback.questions)
  }

  return {
    businessBackground,
    painPoints: dynamicPainPoints,
    businessGoals: dynamicGoals,
    userRoles: dynamicRoles,
    questions: dynamicQuestions,
  }
}

function getApiErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') {
    return payload.detail
  }

  if (payload?.detail?.message) {
    return payload.detail.message
  }

  return payload?.message || fallback
}

function parseMaybeJson(raw) {
  if (!raw) return null
  if (typeof raw === 'object') return raw

  const text = String(raw).replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if (start >= 0 && end > start) {
      try { return JSON.parse(text.slice(start, end + 1)) } catch { return null }
    }
  }
  return null
}

function normalizeClarificationOutput(raw, fallbackAnswer) {
  const parsed = parseMaybeJson(raw) || {}
  const insights = Array.isArray(parsed.insights) ? parsed.insights : []
  const normalized = insights
    .filter((item) => item && (item.title || item.detail))
    .map((item, index) => ({
      id: `clarity-${Date.now()}-${index}`,
      category: item.category || '业务补充',
      title: item.title || '补充信息',
      detail: item.detail || fallbackAnswer,
      scenarioValue: item.scenarioValue || item.valueForScenario || '',
    }))

  if (!normalized.length && fallbackAnswer) {
    normalized.push({
      id: `clarity-${Date.now()}-0`,
      category: '业务补充',
      title: activeQuestionText.value || '用户补充',
      detail: fallbackAnswer,
      scenarioValue: '可用于补充场景识别的流程边界、异常处理和页面输入。',
    })
  }

  return {
    assistantMessage: parsed.assistantMessage || parsed.summary || '已整理为业务拆解补充，可继续追加更多细节。',
    insights: normalized,
  }
}

async function requestClarificationAnalysis(question, answer) {
  const instruction = [
    '你是企业软件 FDE 业务分析师。请根据需求拆解草案、待确认问题和用户补充，把信息整理成下一步「场景→页面」可直接使用的业务拆解补充。',
    '只返回严格 JSON，不要 Markdown。',
    'JSON 结构：{"assistantMessage":"一句面向用户的简短反馈","insights":[{"category":"角色边界/业务流程/异常规则/系统集成/指标口径/移动端约束/数据口径","title":"短标题","detail":"具体业务补充，必须来自用户补充或草案推断","scenarioValue":"说明它如何帮助下一步生成更具体的场景和页面"}]}',
    '要求：不要编造确定事实；如果是推断，请在 detail 中写明“可按...理解/建议确认...”。',
  ].join('\n')

  const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      step_key: 'requirementClarification',
      step_title: '需求待确认问题对话补充',
      instruction,
      current_output: {
        analysis: analysisResult.value,
        activeQuestion: question,
        userAnswer: answer,
        existingInsights: clarificationInsights.value,
      },
      project_context: {
        projectName: props.projectContext.projectName,
        customerName: props.projectContext.customerName,
        sourceRequirement: combinedRequirementInput.value.substring(0, 3000),
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) {
    throw new Error(getApiErrorMessage(payload, 'LLM 澄清整理失败，请检查后端服务和 API Key。'))
  }

  return normalizeClarificationOutput(payload.data?.revised_output, answer)
}

function buildLocalClarification(question, answer) {
  const lower = `${question} ${answer}`.toLowerCase()
  let category = '业务补充'
  if (lower.includes('接口') || lower.includes('系统') || lower.includes('api')) category = '系统集成'
  if (lower.includes('离线') || lower.includes('弱网') || lower.includes('移动')) category = '移动端约束'
  if (lower.includes('告警') || lower.includes('阈值') || lower.includes('异常')) category = '异常规则'
  if (lower.includes('费用') || lower.includes('成本') || lower.includes('结算')) category = '指标口径'

  return {
    assistantMessage: '已按本地规则整理为业务拆解补充。配置 LLM 后可获得更细的结构化建议。',
    insights: [{
      id: `clarity-${Date.now()}-0`,
      category,
      title: question,
      detail: answer,
      scenarioValue: '下一步可据此生成更具体的角色场景、页面模块、异常分支和接口输入输出。',
    }],
  }
}

function insertQuestionHint() {
  if (!activeQuestionText.value) return
  clarificationInput.value = clarificationInput.value
    ? `${clarificationInput.value}\n\n针对问题「${activeQuestionText.value}」：`
    : `针对问题「${activeQuestionText.value}」：`
}

async function sendClarification() {
  if (!analysisResult.value || !clarificationInput.value || isClarifying.value) return

  const question = activeQuestionText.value || '补充问题'
  const answer = clarificationInput.value
  const messageId = Date.now()
  clarificationMessages.value.push({ id: `u-${messageId}`, role: 'user', content: answer, question })
  questionReplies.value[activeQuestionIndex.value] = [
    questionReplies.value[activeQuestionIndex.value],
    answer,
  ].filter(Boolean).join('\n')

  clarificationInput.value = ''
  clarificationError.value = ''
  isClarifying.value = true

  try {
    const shouldUseDeepSeek = props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmConfigured
    const result = shouldUseDeepSeek
      ? await requestClarificationAnalysis(question, answer)
      : buildLocalClarification(question, answer)

    clarificationMessages.value.push({ id: `a-${messageId}`, role: 'assistant', content: result.assistantMessage })
    clarificationInsights.value = [...clarificationInsights.value, ...result.insights]
    emit('analysis-draft-update', buildRequirementResult(analysisResult.value, buildQuestionResponses()))
  } catch (error) {
    clarificationError.value = error.message || '澄清整理失败，请稍后重试。'
  } finally {
    isClarifying.value = false
  }
}

function enrichAnalysis(analysis, source = 'local') {
  return {
    ...analysis,
    painPoints: analysis.painPoints?.length ? analysis.painPoints : defaultAnalysis.painPoints,
    businessGoals: analysis.businessGoals?.length ? analysis.businessGoals : defaultAnalysis.businessGoals,
    userRoles: analysis.userRoles?.length ? analysis.userRoles : defaultAnalysis.userRoles,
    questions: analysis.questions?.length ? analysis.questions : defaultAnalysis.questions,
    clarificationInsights: analysis.clarificationInsights || clarificationInsights.value || [],
    importedMarkdownName: analysis.importedMarkdownName || importedMarkdownName.value || '',
    generationSource: source,
  }
}

async function requestDeepSeekAnalysis() {
  const response = await fetch(`${API_BASE_URL}/llm/requirement-analysis`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      source_requirement: combinedRequirementInput.value,
      project_name: props.projectContext.projectName,
      customer_name: props.projectContext.customerName,
    }),
  })

  const payload = await response.json().catch(() => ({}))

  if (!response.ok || payload.success === false) {
    throw new Error(getApiErrorMessage(payload, 'DeepSeek 需求拆解失败，请检查后端服务和 API Key。'))
  }

  return enrichAnalysis(payload.data?.analysis || defaultAnalysis, 'deepseek')
}

function clearInput() {
  requirementText.value = ''
  importedMarkdownName.value = ''
  importedMarkdownText.value = ''
  pendingMarkdownImport.value = null
  importMessage.value = ''
  questionReplies.value = []
  activeQuestionIndex.value = 0
  clarificationInput.value = ''
  clarificationMessages.value = []
  clarificationInsights.value = []
  clarificationError.value = ''
  errorMessage.value = ''
  analysisResult.value = null
}

function buildInvalidatedRequirementResult(reason) {
  const sourceRequirement = combinedRequirementInput.value
  const manualRequirement = requirementText.value === sourceRequirement ? '' : requirementText.value

  return {
    invalidated: true,
    invalidatedBy: 'requirement-regenerate',
    invalidatedAt: new Date().toISOString(),
    reason,
    projectName: props.projectContext.projectName || '',
    customerName: props.projectContext.customerName || '',
    projectStage: props.projectContext.projectStage || '',
    sourceRequirement,
    manualRequirement,
    attachmentText: '',
    attachments: [],
    analysis: null,
    summary: reason,
  }
}

async function handleAnalyze() {
  if (!requirementText.value) {
    errorMessage.value = '请先输入客户原始需求，或导入已整理的 Markdown'
    return
  }

  const shouldUseDeepSeek = props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmProvider === 'deepseek'

  errorMessage.value = ''
  analysisResult.value = null
  questionReplies.value = []
  activeQuestionIndex.value = 0
  clarificationInput.value = ''
  clarificationMessages.value = []
  clarificationInsights.value = []
  clarificationError.value = ''
  hydrateEditableAnalysis(null)
  emit('analysis-draft-update', buildInvalidatedRequirementResult('正在重新生成需求拆解草案，上一轮 requirement.md 已失效。'))
  isLoading.value = true

  try {
    const dynamicAnalysis = shouldUseDeepSeek
      ? await requestDeepSeekAnalysis()
      : enrichAnalysis(buildDynamicAnalysis(combinedRequirementInput.value), 'local')

    analysisResult.value = dynamicAnalysis
    hydrateEditableAnalysis(dynamicAnalysis)
    questionReplies.value = dynamicAnalysis.questions.map(() => '')
    activeQuestionIndex.value = 0
    clarificationInput.value = ''
    clarificationMessages.value = []
    clarificationInsights.value = []
    clarificationError.value = ''
    emit('analysis-draft-update', buildRequirementResult(dynamicAnalysis, []))
  } catch (error) {
    analysisResult.value = null
    questionReplies.value = []
    clarificationMessages.value = []
    clarificationInsights.value = []
    errorMessage.value = error.message || '需求拆解生成失败，请稍后重试。'
  } finally {
    isLoading.value = false
  }
}

function compactRequirementAnalysis(analysis, questionResponses) {
  const {
    sourceText,
    manualRequirement,
    sourceRequirement,
    attachmentText,
    importedMarkdown,
    ...rest
  } = analysis || {}

  return {
    ...rest,
    importedMarkdownName: importedMarkdownName.value || rest.importedMarkdownName || '',
    questionResponses,
    clarificationMessages: clarificationMessages.value,
    clarificationInsights: clarificationInsights.value,
    generationSource: rest.generationSource || 'local',
  }
}

function buildRequirementResult(analysis, questionResponses) {
  const sourceRequirement = combinedRequirementInput.value
  const manualRequirement = requirementText.value === sourceRequirement ? '' : requirementText.value

  return {
    projectName: props.projectContext.projectName || '',
    customerName: props.projectContext.customerName || '',
    projectStage: props.projectContext.projectStage || '',
    sourceRequirement,
    manualRequirement,
    attachmentText: '',
    attachments: [],
    analysis: compactRequirementAnalysis(analysis, questionResponses),
  }
}

function buildQuestionResponses() {
  const responses = (analysisResult.value?.questions || []).map((question, index) => ({
    question,
    answer: questionReplies.value[index] || '',
  }))
  const extraAnswer = questionReplies.value[analysisResult.value?.questions?.length || 0]
  if (extraAnswer) {
    responses.push({
      question: '其他补充',
      answer: extraAnswer,
    })
  }
  return responses
}

function goNext() {
  if (!analysisResult.value) {
    return
  }

  emit('analysis-complete', buildRequirementResult(analysisResult.value, buildQuestionResponses()))
}
</script>

<style scoped>
.requirement-input-view {
  margin-top: 16px;
}

.intake-panel,
.analysis-preview,
.question-replies {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.intake-panel {
  display: grid;
  gap: 16px;
  margin-top: 16px;
  padding: 22px;
}

.md-import-block,
.text-block {
  display: grid;
  gap: 10px;
}

.field-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.field-head label {
  color: #263244;
  font-weight: 900;
}

.field-head span {
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

input[type='file'] {
  width: 100%;
  border: 1px dashed #93c5fd;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  color: #172033;
}

.md-import-block p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.import-message {
  border-left: 3px solid #2563eb;
  padding-left: 10px;
  color: #1d4ed8;
  font-weight: 800;
}

.md-import-preview {
  display: grid;
  gap: 12px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 14px;
  background: #f8fbff;
}

.md-import-preview dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.md-import-preview dt {
  color: #0f172a;
  font-size: 13px;
  font-weight: 900;
}

.md-import-preview dd {
  margin: 4px 0 0;
  color: #526174;
  line-height: 1.6;
}

textarea {
  width: 100%;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 14px;
  color: #172033;
  background: #ffffff;
  line-height: 1.7;
}

#customer-requirement {
  min-height: 260px;
}

textarea:focus,
input[type='file']:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

textarea[aria-invalid='true'] {
  border-color: #dc2626;
}

.form-error {
  margin: 0;
  color: #dc2626;
  font-weight: 800;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.button-row button:disabled {
  cursor: not-allowed;
  opacity: 0.62;
}

.analysis-preview {
  margin-top: 16px;
  padding: 24px;
}
.analysis-toggle {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.analysis-toggle small {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
  margin-top: 4px;
}

.analysis-body {
  margin-top: 16px;
}

.analysis-editor {
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 16px;
  background: #f8fbff;
}

.analysis-editor label {
  display: grid;
  gap: 8px;
}

.analysis-editor label span {
  color: #263244;
  font-size: 13px;
  font-weight: 900;
}

.editor-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}
.analysis-heading {
  margin-bottom: 16px;
}

.analysis-heading.compact {
  margin-bottom: 12px;
}

.analysis-heading h3 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
}

.section-desc {
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.65;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.analysis-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.analysis-card.wide {
  grid-column: 1 / -1;
}

.analysis-card span {
  display: block;
  margin-bottom: 10px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.analysis-card p,
.analysis-card ul,
.analysis-card dl {
  margin: 0;
  color: #263244;
  line-height: 1.7;
}

.analysis-card ul,
.reply-list {
  display: grid;
  gap: 10px;
}

.analysis-card dt {
  color: #0f172a;
  font-weight: 900;
}

.analysis-card dd {
  margin: 4px 0 10px;
  color: #526174;
  line-height: 1.6;
}

.question-replies {
  margin-top: 14px;
  padding: 18px;
  overflow: hidden;
}

.clarification-layout {
  display: grid;
  grid-template-columns: minmax(220px, 280px) minmax(0, 1fr);
  align-items: start;
  gap: 16px;
}

.question-list {
  display: grid;
  align-content: start;
  gap: 8px;
  max-height: 620px;
  overflow: auto;
  overscroll-behavior: contain;
  padding-right: 6px;
}

.question-list button {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
  color: #263244;
  text-align: left;
  min-height: 52px;
}

.question-list button.active {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.08);
}

.question-list strong {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 900;
}

.question-list span {
  color: #263244;
  font-size: 13px;
  font-weight: 800;
  line-height: 1.55;
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.chat-panel {
  display: grid;
  grid-template-rows: auto auto auto;
  align-content: start;
  gap: 12px;
  min-width: 0;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.chat-thread {
  display: grid;
  gap: 10px;
  min-height: 168px;
  max-height: 260px;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
}

.chat-message {
  display: grid;
  gap: 5px;
  max-width: 88%;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;
}

.chat-message.user {
  justify-self: end;
  border-color: #bfdbfe;
  background: #eff6ff;
}

.chat-message.assistant {
  justify-self: start;
}

.chat-message.error {
  border-color: #fecaca;
  background: #fff7f7;
}

.chat-message span {
  color: #2563eb;
  font-size: 12px;
  font-weight: 900;
}

.chat-message p {
  margin: 0;
  color: #263244;
  line-height: 1.65;
  white-space: pre-wrap;
}

.chat-input {
  display: grid;
  gap: 8px;
}

.chat-input textarea {
  min-height: 150px;
  max-height: 220px;
}

.chat-input span {
  color: #263244;
  font-size: 13px;
  font-weight: 900;
}

.chat-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
}

.chat-actions button {
  min-height: 40px;
}

.insight-panel {
  display: grid;
  gap: 10px;
  margin-top: 16px;
  border-top: 1px solid #e2e8f0;
  padding-top: 16px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.panel-head strong {
  color: #0f172a;
}

.panel-head span {
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

.insight-card {
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 12px;
  background: #f8fbff;
}

.insight-card span {
  display: inline-flex;
  margin-bottom: 6px;
  border-radius: 999px;
  padding: 3px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.insight-card strong {
  display: block;
  color: #0f172a;
}

.insight-card p {
  margin: 6px 0;
  color: #263244;
  line-height: 1.65;
}

.insight-card small {
  color: #64748b;
  font-weight: 800;
  line-height: 1.55;
}

.reply-list label {
  display: grid;
  gap: 8px;
}

.reply-list label span {
  color: #263244;
  font-weight: 900;
  line-height: 1.6;
}

.next-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 920px) {
  .editor-grid,
  .analysis-grid {
    grid-template-columns: 1fr;
  }

  .clarification-layout {
    grid-template-columns: 1fr;
  }

  .chat-message {
    max-width: 100%;
  }
}
</style>
