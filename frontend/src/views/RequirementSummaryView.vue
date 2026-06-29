<script setup>
import { computed, reactive, ref } from 'vue'
import ResultPanel from '../components/ResultPanel.vue'
import ViewHeading from '../components/ViewHeading.vue'

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
          <button class="primary-button" type="submit" :disabled="resultStatus === 'loading'">
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
  .requirement-layout {
    grid-template-columns: 1fr;
  }
}
</style>