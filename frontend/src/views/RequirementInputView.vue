<template>
  <section class="requirement-input-view" aria-labelledby="requirement-input-title">
    <ViewHeading
      eyebrow="Requirement Intake"
      title="需求输入工作台"
      title-id="requirement-input-title"
      description="上传客户材料或直接输入需求文本，系统先形成需求拆解草案；你回复待确认问题后，再提交给场景识别。"
    />

    <ProjectContextCard :context="projectContext" @context-update="emit('context-update', $event)" />

    <form class="intake-panel" @submit.prevent="handleAnalyze">
      <section class="upload-block" aria-labelledby="attachment-title">
        <div class="field-head">
          <label id="attachment-title" for="requirement-files">需求附件</label>
          <span>{{ uploadedFiles.length }} 个文件{{ isParsingFiles ? '，解析中' : '' }}</span>
        </div>
        <input
          id="requirement-files"
          type="file"
          multiple
          accept=".txt,.md,.pdf,.doc,.docx,.xls,.xlsx,.csv,.ppt,.pptx,.png,.jpg,.jpeg"
          @change="handleFileChange"
        />
        <p>支持多附件上传。文本、CSV、Markdown、JSON、HTML、PDF、docx、xlsx、pptx 会在浏览器端提取文本；图片和旧版 Office 二进制文件会保留文件信息，后续可接入 OCR/解析服务。</p>
        <div v-if="uploadedFiles.length" class="file-list">
          <span v-for="file in uploadedFiles" :key="file.name + file.size" :class="file.parseStatus">
            {{ file.name }} · {{ formatFileSize(file.size) }} · {{ file.parseLabel }}
          </span>
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
          placeholder="可以直接粘贴客户需求、会议纪要、招标片段、方案描述；如果主要依赖附件，也可以先写一句材料背景。"
          :aria-invalid="Boolean(errorMessage)"
        ></textarea>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>
      </section>

      <div class="button-row">
        <button class="secondary-button" type="button" :disabled="isLoading || isParsingFiles" @click="clearInput">
          清空
        </button>
        <button class="gen-btn" type="submit" :disabled="isLoading || isParsingFiles">
          {{ isLoading ? '正在生成草案...' : isParsingFiles ? '正在解析附件...' : '生成草案' }}
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
const uploadedFiles = ref([])
const isParsingFiles = ref(false)
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
    uploadedFiles.value = savedRequirement.attachments || []
    analysisResult.value = savedRequirement.analysis
    questionReplies.value = (savedRequirement.analysis.questionResponses || savedRequirement.analysis.questions || [])
      .map((item) => item.answer || '')
    clarificationMessages.value = savedRequirement.analysis.clarificationMessages || []
    clarificationInsights.value = savedRequirement.analysis.clarificationInsights || []
  },
  { immediate: true },
)

watch(analysisResult, (nextAnalysis) => {
  const questionCount = nextAnalysis?.questions?.length || 0
  if (activeQuestionIndex.value >= questionCount) activeQuestionIndex.value = 0
})

const defaultAnalysis = {
  businessBackground: '请补充客户业务背景或上传需求材料。',
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

const attachmentSummary = computed(() => uploadedFiles.value.map((file) => `${file.name}（${formatFileSize(file.size)}，${file.parseLabel}）`).join('；'))

const extractedAttachmentText = computed(() => uploadedFiles.value.map((file) => file.extractedText || '').filter(Boolean).join('\n'))

const combinedRequirementInput = computed(() => [requirementText.value, extractedAttachmentText.value].filter(Boolean).join('\n\n'))

function splitSentences(text) {
  return text
    .split(/[。！？!?.\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function formatFileSize(size) {
  if (size >= 1024 * 1024) {
    return `${(size / 1024 / 1024).toFixed(1)} MB`
  }

  return `${Math.max(1, Math.round(size / 1024))} KB`
}

function buildFileRecord(file, parseStatus, parseLabel, extractedText = '') {
  return {
    name: file.name,
    size: file.size,
    type: file.type || 'unknown',
    lastModified: file.lastModified,
    parseStatus,
    parseLabel,
    extractedText,
  }
}

function getFileExtension(fileName) {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

function normalizeExtractedText(text) {
  return String(text || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function parseRequirementFile(file) {
  const ext = getFileExtension(file.name)

  try {
    if (['txt', 'md', 'csv', 'json', 'html', 'htm', 'xml'].includes(ext) || file.type.startsWith('text/')) {
      const text = normalizeExtractedText(await file.text())
      return buildFileRecord(file, text ? 'parsed' : 'empty', text ? '已解析文本' : '无可读文本', text)
    }

    if (ext === 'pdf') {
      const text = normalizeExtractedText(extractPdfText(await file.arrayBuffer()))
      return buildFileRecord(file, text ? 'parsed' : 'partial', text ? '已基础解析 PDF' : '未提取到 PDF 文本', text)
    }

    if (['docx', 'xlsx', 'pptx'].includes(ext)) {
      const text = normalizeExtractedText(await extractOfficeOpenXmlText(await file.arrayBuffer(), ext))
      return buildFileRecord(file, text ? 'parsed' : 'partial', text ? `已解析 ${ext}` : `${ext} 未提取到文本`, text)
    }

    return buildFileRecord(file, 'unsupported', '暂不支持内容解析')
  } catch (error) {
    return buildFileRecord(file, 'error', '解析失败')
  }
}

function extractPdfText(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 8192

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(index, index + chunkSize))
  }

  const matches = [...binary.matchAll(/\(([^()]{2,})\)/g)]
  return matches.map((match) => match[1].replace(/\\([()\\])/g, '$1')).join(' ')
}

async function extractOfficeOpenXmlText(buffer, ext) {
  const entries = readZipEntries(buffer)
  const targetPatterns = {
    docx: [/^word\/document\.xml$/, /^word\/header\d*\.xml$/, /^word\/footer\d*\.xml$/],
    xlsx: [/^xl\/sharedStrings\.xml$/, /^xl\/worksheets\/sheet\d+\.xml$/],
    pptx: [/^ppt\/slides\/slide\d+\.xml$/],
  }
  const patterns = targetPatterns[ext] || []
  const parts = []

  for (const entry of entries) {
    if (!patterns.some((pattern) => pattern.test(entry.name))) {
      continue
    }

    const content = await inflateZipEntry(entry)
    parts.push(new TextDecoder('utf-8').decode(content))
  }

  return parts.join(' ')
}

function readZipEntries(buffer) {
  const view = new DataView(buffer)
  const bytes = new Uint8Array(buffer)
  const entries = []
  let offset = 0

  while (offset < bytes.length - 30) {
    if (view.getUint32(offset, true) !== 0x04034b50) {
      offset += 1
      continue
    }

    const compressionMethod = view.getUint16(offset + 8, true)
    const compressedSize = view.getUint32(offset + 18, true)
    const uncompressedSize = view.getUint32(offset + 22, true)
    const fileNameLength = view.getUint16(offset + 26, true)
    const extraLength = view.getUint16(offset + 28, true)
    const nameStart = offset + 30
    const nameEnd = nameStart + fileNameLength
    const dataStart = nameEnd + extraLength
    const dataEnd = dataStart + compressedSize
    const name = new TextDecoder('utf-8').decode(bytes.slice(nameStart, nameEnd))

    if (!name.endsWith('/')) {
      entries.push({
        name,
        compressionMethod,
        compressedSize,
        uncompressedSize,
        data: bytes.slice(dataStart, dataEnd),
      })
    }

    offset = dataEnd
  }

  return entries
}

async function inflateZipEntry(entry) {
  if (entry.compressionMethod === 0) {
    return entry.data
  }

  if (entry.compressionMethod !== 8 || typeof DecompressionStream === 'undefined') {
    return new Uint8Array()
  }

  const stream = new Blob([entry.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function handleFileChange(event) {
  const files = Array.from(event.target.files || [])
  errorMessage.value = ''
  analysisResult.value = null
  questionReplies.value = []

  if (!files.length) {
    uploadedFiles.value = []
    return
  }

  isParsingFiles.value = true
  uploadedFiles.value = files.map((file) => buildFileRecord(file, 'pending', '等待解析'))

  uploadedFiles.value = await Promise.all(files.map(parseRequirementFile))
  isParsingFiles.value = false
}

function buildDynamicAnalysis(text) {
  const fallback = defaultAnalysis
  const sourceText = [text, attachmentSummary.value].filter(Boolean).join(' ')
  const lowerText = sourceText.toLowerCase()
  const sentences = splitSentences(sourceText)
  const topSentences = sentences.slice(0, 4)
  const firstSentence = topSentences[0] || ''

  const businessBackground = firstSentence
    ? `基于当前输入，项目背景可归纳为：${firstSentence}。`
    : uploadedFiles.value.length
      ? `已收到 ${uploadedFiles.value.length} 个客户材料，需结合附件内容继续拆解业务背景。`
      : fallback.businessBackground

  const dynamicPainPoints = topSentences.length
    ? topSentences.map((item) => `需求中提到：${item}`)
    : uploadedFiles.value.length
      ? uploadedFiles.value.map((file) => `需从附件 ${file.name} 中提取客户痛点和业务约束`)
      : fallback.painPoints

  const dynamicGoals = [
    '形成可落地的 FDE 原型方案。',
    '沉淀可复用的业务流程、页面和接口契约。',
    uploadedFiles.value.length ? '结合上传材料完成需求理解和场景识别。' : '基于文本输入完成需求理解和场景识别。',
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

  if (uploadedFiles.value.length) {
    dynamicQuestions.push('上传附件中哪些内容是本轮原型必须覆盖的范围？')
  }

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
    attachments: uploadedFiles.value,
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
    attachments: uploadedFiles.value,
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
      attachments: uploadedFiles.value.map(({ extractedText, ...file }) => file),
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
  uploadedFiles.value = []
  isParsingFiles.value = false
  questionReplies.value = []
  activeQuestionIndex.value = 0
  clarificationInput.value = ''
  clarificationMessages.value = []
  clarificationInsights.value = []
  clarificationError.value = ''
  errorMessage.value = ''
  analysisResult.value = null
}

async function handleAnalyze() {
  if (isParsingFiles.value) {
    errorMessage.value = '附件仍在解析中，请稍后再生成草案'
    return
  }

  if (!requirementText.value && !uploadedFiles.value.length) {
    errorMessage.value = '请先输入客户原始需求，或上传至少一个需求附件'
    return
  }

  const shouldUseDeepSeek = props.projectContext.executionMode === 'llm-ready' && props.projectContext.llmProvider === 'deepseek'

  errorMessage.value = ''
  isLoading.value = true

  try {
    const dynamicAnalysis = shouldUseDeepSeek
      ? await requestDeepSeekAnalysis()
      : enrichAnalysis(buildDynamicAnalysis(combinedRequirementInput.value), 'local')

    analysisResult.value = dynamicAnalysis
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

function buildRequirementResult(analysis, questionResponses) {
  return {
    projectName: props.projectContext.projectName || '',
    customerName: props.projectContext.customerName || '',
    projectStage: props.projectContext.projectStage || '',
    sourceRequirement: combinedRequirementInput.value,
    manualRequirement: requirementText.value,
    attachmentText: extractedAttachmentText.value,
    attachments: uploadedFiles.value,
    analysis: {
      ...analysis,
      sourceText: combinedRequirementInput.value,
      manualRequirement: requirementText.value,
      attachmentText: extractedAttachmentText.value,
      questionResponses,
      clarificationMessages: clarificationMessages.value,
      clarificationInsights: clarificationInsights.value,
      generationSource: analysis.generationSource || 'local',
    },
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

.upload-block,
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

.upload-block p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.file-list span {
  border-radius: 999px;
  padding: 6px 10px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 800;
}


.file-list span.parsed {
  background: #dcfce7;
  color: #166534;
}

.file-list span.partial,
.file-list span.unsupported,
.file-list span.pending {
  background: #fef3c7;
  color: #92400e;
}

.file-list span.error {
  background: #fee2e2;
  color: #991b1b;
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
}

.clarification-layout {
  display: grid;
  grid-template-columns: minmax(220px, 0.34fr) minmax(0, 1fr);
  gap: 14px;
}

.question-list {
  display: grid;
  align-content: start;
  gap: 8px;
}

.question-list button {
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
  color: #263244;
  text-align: left;
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
}

.chat-panel {
  display: grid;
  gap: 12px;
  min-width: 0;
}

.chat-thread {
  display: grid;
  gap: 10px;
  max-height: 360px;
  overflow: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.chat-message {
  display: grid;
  gap: 5px;
  max-width: 78%;
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

.chat-input span {
  color: #263244;
  font-size: 13px;
  font-weight: 900;
}

.chat-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 10px;
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
