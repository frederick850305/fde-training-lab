<template>
  <section class="llm-revision-panel" aria-labelledby="llm-revision-title">
    <div class="panel-heading">
      <div>
        <span>大模型修改</span>
        <strong id="llm-revision-title">修改当前步骤输出内容</strong>
      </div>
      <small>{{ providerLabel }}</small>
    </div>

    <label class="revision-input">
      <span>修改要求</span>
      <textarea
        v-model.trim="instruction"
        rows="4"
        placeholder="例如：把当前输出改得更贴近门岗车辆入场场景，减少泛化模块，补充异常反馈和状态回传。"
      ></textarea>
    </label>

    <div class="revision-actions">
      <button class="secondary-button" type="button" :disabled="isLoading || !canRequest" @click="requestRevision">
        {{ isLoading ? '正在调用大模型...' : '调用大模型修改' }}
      </button>
      <button class="primary-button" type="button" :disabled="!revisionResult" @click="applyRevision">
        应用并保存本地
      </button>
    </div>

    <p v-if="message" class="revision-message" :class="{ error: hasError }">{{ message }}</p>

    <details v-if="revisionResult" class="revision-preview" open>
      <summary>修改后的结构化结果预览</summary>
      <pre>{{ formattedRevision }}</pre>
    </details>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  step: {
    type: Object,
    default: null,
  },
  stepOutput: {
    type: [Object, Array, String, Number, Boolean],
    default: null,
  },
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['revision-applied'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const instruction = ref('')
const revisionResult = ref(null)
const isLoading = ref(false)
const message = ref('')
const hasError = ref(false)

const canRequest = computed(() => Boolean(props.step && props.stepOutput && instruction.value))

const providerLabel = computed(() => {
  if (props.projectContext.executionMode !== 'llm-ready') {
    return '请先在上方切换为大模型生成'
  }

  if (props.projectContext.llmProvider === 'deepseek' && props.projectContext.llmConfigured) {
    return 'DeepSeek 已配置'
  }

  return '大模型尚未完成配置'
})

const formattedRevision = computed(() => JSON.stringify(revisionResult.value, null, 2))

watch(
  () => props.step?.key,
  () => {
    instruction.value = ''
    revisionResult.value = null
    message.value = ''
    hasError.value = false
  },
)

function getApiErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') {
    return payload.detail
  }

  return payload?.detail?.message || payload?.message || fallback
}

async function requestRevision() {
  if (!canRequest.value) {
    return
  }

  isLoading.value = true
  message.value = ''
  hasError.value = false
  revisionResult.value = null

  try {
    const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        step_key: props.step.key,
        step_title: props.step.title,
        instruction: instruction.value,
        current_output: props.stepOutput,
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
      throw new Error(getApiErrorMessage(payload, '大模型修改失败，请检查后端服务和模型配置。'))
    }

    revisionResult.value = payload.data?.revised_output || props.stepOutput
    message.value = '大模型已返回修改结果，请检查后应用。'
  } catch (error) {
    hasError.value = true
    message.value = error.message || '大模型修改失败。'
  } finally {
    isLoading.value = false
  }
}

function applyRevision() {
  if (!revisionResult.value || !props.step) {
    return
  }

  emit('revision-applied', {
    stepKey: props.step.resultKey,
    stepDefinitionKey: props.step.key,
    revisedOutput: revisionResult.value,
    revisionInstruction: instruction.value,
  })

  message.value = '已应用到当前步骤，并写入本地版本。'
}
</script>

<style scoped>
.llm-revision-panel {
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 18px;
  background: #f8fbff;
}

.panel-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.panel-heading div,
.revision-input {
  display: grid;
  gap: 6px;
}

.panel-heading span,
.revision-input span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.panel-heading small {
  color: #64748b;
  font-weight: 800;
}

.revision-input textarea {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
  color: #172033;
  line-height: 1.6;
  resize: vertical;
}

.revision-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.revision-message {
  margin: 0;
  color: #166534;
  font-weight: 800;
}

.revision-message.error {
  color: #dc2626;
}

.revision-preview {
  border-top: 1px solid #dbe3ef;
  padding-top: 10px;
}

.revision-preview summary {
  cursor: pointer;
  color: #1d4ed8;
  font-weight: 900;
}

.revision-preview pre {
  max-height: 260px;
  overflow: auto;
  border-radius: 8px;
  padding: 12px;
  background: #0f172a;
  color: #e2e8f0;
  font-size: 12px;
  line-height: 1.5;
}
</style>
