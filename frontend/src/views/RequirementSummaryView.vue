<script setup>
import { computed, reactive, ref } from 'vue'
import ProjectContextCard from '../components/ProjectContextCard.vue'
import ResultPanel from '../components/ResultPanel.vue'
import StepHandoffCard from '../components/StepHandoffCard.vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const form = reactive({
  inputPath: 'data/customer-requirement.md',
  outputPath: 'output/api_requirement_summary.md',
  enableAiAdvice: false
})

const resultStatus = ref('waiting')

const result = reactive({
  message: '',
  errorCode: '',
  outputPath: ''
})

const resultDetails = computed(() => {
  if (resultStatus.value !== 'success') {
    return []
  }

  return [
    {
      label: '需求文件',
      value: form.inputPath
    },
    {
      label: '输出报告',
      value: result.outputPath
    },
    {
      label: 'AI 辅助建议',
      value: form.enableAiAdvice ? '已启用' : '未启用'
    }
  ]
})

const hasRequirementContext = computed(() => {
  return Boolean(props.projectContext.sourceRequirement || props.projectContext.requirementAnalysis)
})

const sourceRequirementPreview = computed(() => {
  if (!props.projectContext.sourceRequirement) {
    return '当前还没有从“需求输入工作台”传入原始需求内容。'
  }

  return props.projectContext.sourceRequirement
})

const requirementAnalysisSummary = computed(() => {
  return props.projectContext.requirementAnalysis || null
})

const requirementHandoffItems = computed(() => {
  if (!requirementAnalysisSummary.value) {
    return []
  }

  return [
    {
      label: '原始需求内容',
      value: sourceRequirementPreview.value,
    },
    {
      label: '业务背景',
      value: requirementAnalysisSummary.value.businessBackground || '暂无业务背景',
    },
    {
      label: '客户痛点',
      value:
        requirementAnalysisSummary.value.painPoints
          ?.map((item) => item.description)
          .filter(Boolean)
          .join('；') || '暂无客户痛点',
    },
    {
      label: '业务目标',
      value:
        requirementAnalysisSummary.value.goals
          ?.map((item) => item.description)
          .filter(Boolean)
          .join('；') || '暂无业务目标',
    },
  ]
})

function validateForm() {
  if (!form.inputPath.trim()) {
    resultStatus.value = 'error'
    result.message = '需求文件路径不能为空。'
    result.errorCode = 'FRONTEND_VALIDATION_ERROR'
    result.outputPath = ''
    return false
  }

  if (!form.outputPath.trim()) {
    resultStatus.value = 'error'
    result.message = '报告输出路径不能为空。'
    result.errorCode = 'FRONTEND_VALIDATION_ERROR'
    result.outputPath = ''
    return false
  }

  if (!form.inputPath.endsWith('.md')) {
    resultStatus.value = 'error'
    result.message = '需求文件必须是 Markdown 文件，扩展名应为 .md。'
    result.errorCode = 'FRONTEND_VALIDATION_ERROR'
    result.outputPath = ''
    return false
  }

  if (!form.outputPath.endsWith('.md')) {
    resultStatus.value = 'error'
    result.message = '报告输出文件必须是 Markdown 文件，扩展名应为 .md。'
    result.errorCode = 'FRONTEND_VALIDATION_ERROR'
    result.outputPath = ''
    return false
  }

  return true
}

async function handleSubmit() {
  if (!validateForm()) {
    return
  }

  resultStatus.value = 'loading'
  result.message = ''
  result.errorCode = ''
  result.outputPath = ''

  await new Promise((resolve) => {
    window.setTimeout(resolve, 700)
  })

  resultStatus.value = 'success'
  result.message = '当前为前端模拟执行结果。后续章节会接入 FastAPI 的 /requirement/summary 接口。'
  result.errorCode = ''
  result.outputPath = form.outputPath
}

function resetForm() {
  form.inputPath = 'data/customer-requirement.md'
  form.outputPath = 'output/api_requirement_summary.md'
  form.enableAiAdvice = false

  resultStatus.value = 'waiting'
  result.message = ''
  result.errorCode = ''
  result.outputPath = ''
}
</script>

<template>
  <section class="requirement-section" aria-labelledby="requirement-title">
    <ViewHeading
      eyebrow="P0 Core Flow"
      title="客户需求分析页"
      title-id="requirement-title"
      description="输入客户需求文件路径，生成结构化需求分析报告。本节先完成前端交互骨架，后续再接入 FastAPI。"
    />

    <ProjectContextCard :context="projectContext" />

    <StepHandoffCard :items="requirementHandoffItems" />

    <div class="requirement-layout">
      <form class="form-card" @submit.prevent="handleSubmit">
        <label class="form-field">
          <span>需求文件路径 <strong>*</strong></span>
          <input
            v-model="form.inputPath"
            type="text"
            placeholder="data/customer-requirement.md"
          />
        </label>

        <label class="form-field">
          <span>报告输出路径 <strong>*</strong></span>
          <input
            v-model="form.outputPath"
            type="text"
            placeholder="output/api_requirement_summary.md"
          />
        </label>

        <label class="switch-card">
          <input v-model="form.enableAiAdvice" type="checkbox" />
          <span>
            <strong>启用 AI 辅助建议</strong>
            <small>后续会调用 DeepSeek，当前先作为参数开关保留。</small>
          </span>
        </label>

        <div class="button-row">
          <button class="gen-btn" type="submit" :disabled="resultStatus === 'loading'">
            {{ resultStatus === 'loading' ? '生成中...' : '生成报告' }}
          </button>

          <button class="secondary-button" type="button" @click="resetForm">
            重置
          </button>
        </div>
      </form>

      <ResultPanel
        :status="resultStatus"
        :message="result.message"
        :error-code="result.errorCode"
        :details="resultDetails"
      />
    </div>
  </section>
</template>

<style scoped>
.requirement-section {
  margin-top: 24px;
}

.context-bridge {
  margin: 16px 0;
}

.bridge-heading {
  margin-bottom: 14px;
}

.bridge-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.bridge-card {
  border: 1px solid #d8e1ef;
  border-radius: 12px;
  padding: 18px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.bridge-card.wide {
  grid-column: span 3;
}

.bridge-card span {
  display: block;
  margin-bottom: 10px;
  color: #2454e6;
  font-size: 13px;
  font-weight: 900;
}

.bridge-card p,
.bridge-card li {
  color: #526174;
  line-height: 1.7;
}

.bridge-card ul {
  margin: 0;
  padding-left: 20px;
}

.empty-bridge {
  margin-bottom: 0;
}

.requirement-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 1fr);
  gap: 24px;
}

.form-card {
  padding: 28px;
  border: 1px solid #d8e1ef;
  border-radius: 12px;
  background: #ffffff;
}

.form-field {
  display: grid;
  gap: 10px;
  margin-bottom: 22px;
}

.form-field span {
  color: #334155;
  font-size: 15px;
  font-weight: 800;
}

.form-field strong {
  color: #dc2626;
}

.form-field input {
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  color: #111827;
  font-size: 15px;
  outline: none;
}

.form-field input:focus {
  border-color: #2454e6;
  box-shadow: 0 0 0 3px rgba(36, 84, 230, 0.12);
}

.switch-card {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 18px;
  border: 1px solid #d8e1ef;
  border-radius: 10px;
  background: #f8fafc;
  cursor: pointer;
}

.switch-card input {
  width: 18px;
  height: 18px;
  margin-top: 3px;
}

.switch-card span {
  display: grid;
  gap: 6px;
}

.switch-card strong {
  color: #111827;
  font-size: 15px;
}

.switch-card small {
  color: #64748b;
  font-size: 13px;
  line-height: 1.6;
}

.button-row {
  display: flex;
  gap: 12px;
}

.primary-button,
.secondary-button {
  min-height: 48px;
  padding: 0 22px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.primary-button {
  border: 1px solid #2454e6;
  background: #2454e6;
  color: #ffffff;
}

.primary-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.secondary-button {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #111827;
}

@media (max-width: 960px) {
  .bridge-grid {
    grid-template-columns: 1fr;
  }

  .bridge-card.wide {
    grid-column: span 1;
  }

  .requirement-layout {
    grid-template-columns: 1fr;
  }
}
</style>