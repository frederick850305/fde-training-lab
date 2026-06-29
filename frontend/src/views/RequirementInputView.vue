<template>
  <section class="requirement-input-view" aria-labelledby="requirement-input-title">
    <ViewHeading
      eyebrow="P0 Input Workspace"
      title="需求输入工作台"
      title-id="requirement-input-title"
      description="先把客户原始需求收进来，形成后续需求拆解、场景识别、功能设计和 API 契约设计的统一入口。"
    />

    <ProjectContextCard :context="projectContext" />

    <div class="input-workspace">
      <form class="input-panel" @submit.prevent="handleAnalyze">
        <div class="field-head">
          <label for="customer-requirement">客户原始需求 <strong>*</strong></label>
          <span>{{ requirementLength }} 字</span>
        </div>

        <textarea
          id="customer-requirement"
          v-model.trim="requirementText"
          rows="12"
          placeholder="请粘贴客户需求、会议纪要、招标片段或方案描述。当前阶段先不调用大模型，只做前端输入和模拟分析。"
          :aria-invalid="Boolean(errorMessage)"
        ></textarea>

        <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

        <div class="stage-note">
          <span>当前阶段</span>
          <strong>前端模拟输出需求拆解结果，后续会替换为 DeepSeek/FastAPI 的真实分析结果。</strong>
        </div>

        <div class="button-row">
          <button class="secondary-button" type="button" :disabled="isLoading" @click="fillExample">
            填入示例需求
          </button>
          <button class="secondary-button" type="button" :disabled="isLoading" @click="clearInput">
            清空
          </button>
          <button class="primary-button" type="submit" :disabled="isLoading">
            {{ isLoading ? '正在准备分析...' : '开始分析' }}
          </button>
        </div>
      </form>

      <div class="side-column">
        <article class="flow-card">
          <span class="card-label">后续流转</span>
          <ol>
            <li>接收客户原始需求</li>
            <li>进入需求拆解模板</li>
            <li>输出业务背景、痛点、目标和角色</li>
            <li>继续进入场景识别与功能设计</li>
          </ol>
        </article>

        <ResultPanel
          :status="resultStatus"
          :message="result.message"
          :details="resultDetails"
          :error-code="result.errorCode"
          empty-title="等待输入"
          empty-description="输入客户需求后点击“开始分析”，这里会展示模拟处理结果。"
          loading-title="正在准备需求拆解"
          loading-description="当前为前端模拟 loading。后续会在这里调用 FastAPI 和 DeepSeek。"
        />
      </div>
    </div>

    <section v-if="analysisResult" class="analysis-preview" aria-labelledby="analysis-preview-title">
      <div class="analysis-heading">
        <p class="eyebrow">Mock Requirement Analysis</p>
        <h3 id="analysis-preview-title">模拟需求拆解结果</h3>
      </div>

      <div class="analysis-grid">
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

        <article class="analysis-card">
          <span>待确认问题</span>
          <ul>
            <li v-for="item in analysisResult.questions" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>

      <div class="next-action">
        <button class="primary-button" type="button" @click="goNext">
          下一步：进入场景识别
        </button>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import ProjectContextCard from '../components/ProjectContextCard.vue'
import ResultPanel from '../components/ResultPanel.vue'
import { requirementAnalysisMock } from '../data/requirementAnalysisMock'
import ViewHeading from '../components/ViewHeading.vue'

defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['analysis-complete', 'go-next'])

const exampleRequirement = `客户希望建设一个海工生产运营原型系统，用于支撑项目经理、计划员和现场调度员协同管理生产任务。系统需要展示项目总体进度、关键工序状态、物料到货情况、异常问题闭环和现场资源占用情况。当前客户主要依赖 Excel、微信群和人工会议同步信息，希望通过一个可演示的前端原型，先验证业务流程、页面结构和 API 契约。`

const requirementText = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const resultStatus = ref('empty')
const analysisResult = ref(null)
const result = reactive({
  message: '',
  errorCode: '',
})

const requirementLength = computed(() => requirementText.value.length)

function splitSentences(text) {
  return text
    .split(/[。！？!?.\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function buildDynamicAnalysis(text) {
  const fallback = requirementAnalysisMock
  const lowerText = text.toLowerCase()
  const sentences = splitSentences(text)
  const topSentences = sentences.slice(0, 4)
  const firstSentence = topSentences[0] || ''

  const businessBackground = firstSentence
    ? `基于当前输入，项目背景可归纳为：${firstSentence}。`
    : fallback.businessBackground

  const dynamicPainPoints = topSentences.length
    ? topSentences.map((item) => `需求中提到：${item}`)
    : fallback.painPoints

  const dynamicGoals = [
    `形成可落地的原型方案（当前输入 ${text.length} 字）。`,
    '沉淀可复用的业务流程、页面和接口契约。',
    '为后续 FastAPI + DeepSeek 联调提供结构化输入。',
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
        responsibility: '跟踪运输成本、核对费用项并支持结算分析。',
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

const resultDetails = computed(() => [
  {
    label: '输入字数',
    value: `${requirementLength.value} 字`,
  },
  {
    label: '下一步',
    value: analysisResult.value
      ? '将需求拆解结果继续传给场景识别步骤。'
      : '进入需求拆解，生成业务背景、客户痛点、业务目标、用户角色和待确认问题。',
  },
  {
    label: '当前模式',
    value: '前端模拟生成，暂不调用 DeepSeek。',
  },
])

function resetResult(status = 'empty') {
  result.message = ''
  result.errorCode = ''
  resultStatus.value = status
  analysisResult.value = null
}

function fillExample() {
  requirementText.value = exampleRequirement
  errorMessage.value = ''
  resetResult()
}

function clearInput() {
  requirementText.value = ''
  errorMessage.value = ''
  resetResult()
}

async function handleAnalyze() {
  if (!requirementText.value) {
    errorMessage.value = '请先输入客户原始需求'
    result.message = '需求输入校验失败'
    result.errorCode = 'REQUIREMENT_EMPTY'
    resultStatus.value = 'error'
    return
  }

  errorMessage.value = ''
  isLoading.value = true
  resultStatus.value = 'loading'

  await new Promise((resolve) => {
    window.setTimeout(resolve, 700)
  })

  const dynamicAnalysis = buildDynamicAnalysis(requirementText.value)

  result.message = '客户需求已接收，可以进入需求拆解步骤'
  result.errorCode = ''
  analysisResult.value = dynamicAnalysis
  resultStatus.value = 'success'
  isLoading.value = false

  emit('analysis-complete', {
    sourceRequirement: requirementText.value,
    analysis: dynamicAnalysis,
  })
}

function goNext() {
  if (!analysisResult.value) {
    return
  }

  emit('go-next', 'scenarioIdentification')
}
</script>

<style scoped>
.requirement-input-view {
  margin-top: 16px;
}

.input-workspace {
  display: grid;
  grid-template-columns: minmax(0, 1.12fr) minmax(320px, 0.88fr);
  gap: 16px;
}

.input-panel,
.flow-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.input-panel {
  display: grid;
  gap: 14px;
  padding: 24px;
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

.field-head strong,
.form-error {
  color: #dc2626;
}

.field-head span {
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

textarea {
  width: 100%;
  min-height: 260px;
  resize: vertical;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 14px;
  color: #172033;
  background: #ffffff;
  line-height: 1.7;
}

textarea:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

textarea[aria-invalid='true'] {
  border-color: #dc2626;
}

.form-error {
  margin: 0;
  font-weight: 800;
}

.stage-note {
  display: grid;
  gap: 6px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 14px;
  background: #eff6ff;
}

.stage-note span,
.card-label {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.stage-note strong {
  color: #172033;
  line-height: 1.6;
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

.side-column {
  display: grid;
  gap: 16px;
  align-content: start;
}

.flow-card {
  padding: 22px;
}

.flow-card ol {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding-left: 22px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.analysis-preview {
  margin-top: 16px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.analysis-heading {
  margin-bottom: 16px;
}

.analysis-heading h3 {
  margin: 0;
  color: #0f172a;
  font-size: 24px;
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

.next-action {
  margin-top: 16px;
}
  line-height: 1.7;
}

.analysis-card ul {
  display: grid;
  gap: 8px;
  padding-left: 20px;
}

.analysis-card dl {
  display: grid;
  gap: 10px;
}

.analysis-card dt {
  margin-bottom: 4px;
  color: #0f172a;
  font-weight: 900;
}

.analysis-card dd {
  margin: 0;
  color: #526174;
}

@media (max-width: 860px) {
  .input-workspace,
  .analysis-grid {
    grid-template-columns: 1fr;
  }
}
</style>
