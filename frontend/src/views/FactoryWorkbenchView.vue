<template>
  <section class="factory-workbench-view" aria-labelledby="factory-workbench-title">
    <ViewHeading
      eyebrow="FDE Self-Service Wizard"
      title="FDE 自助式原型工厂"
      title-id="factory-workbench-title"
      description="从客户原始需求开始，按步骤生成并确认需求、场景、功能、页面、交互、API 契约和前端原型方案。"
    />

    <section class="runtime-panel" aria-label="生成方式选择">
      <div class="runtime-copy compact">
        <span>生成方式</span>
        <strong>{{ runtimeTitle }}</strong>
        <small v-if="localExecutionMode === 'llm-ready' && localLlmProvider === 'deepseek'" class="config-status" :class="{ ready: llmConfig.configured }">
          {{ llmConfig.configured ? `Key 已保存：${llmConfig.maskedApiKey}` : 'Key 尚未保存' }}
        </small>
      </div>

      <div class="runtime-controls" aria-label="模型与生成方式">
        <label>
          <span>模式</span>
          <select v-model="localExecutionMode" @change="emitRuntimeUpdate">
            <option value="local">本地规则生成</option>
            <option value="llm-ready">大模型生成</option>
          </select>
        </label>

        <label>
          <span>模型</span>
          <select v-model="localLlmProvider" :disabled="localExecutionMode === 'local'" @change="emitRuntimeUpdate">
            <option value="deepseek">DeepSeek</option>
            <option value="other">其他 LLM</option>
          </select>
        </label>
      </div>

      <form
        v-if="localExecutionMode === 'llm-ready' && localLlmProvider === 'deepseek'"
        class="deepseek-config"
        aria-label="DeepSeek 本地配置"
        @submit.prevent="saveDeepSeekConfig"
      >
        <label class="api-key-field">
          <span>DeepSeek API Key</span>
          <input
            v-model.trim="deepSeekApiKey"
            type="password"
            autocomplete="new-password"
            placeholder="只提交到本地 FastAPI，不保存在浏览器"
          />
        </label>
        <label>
          <span>模型</span>
          <input v-model.trim="deepSeekModel" type="text" placeholder="deepseek-v4-flash" />
        </label>
        <label>
          <span>服务地址</span>
          <input v-model.trim="deepSeekBaseUrl" type="url" placeholder="https://api.deepseek.com" />
        </label>
        <button class="secondary-button" type="submit" :disabled="isSavingConfig">
          {{ isSavingConfig ? '保存中...' : '安全保存 Key' }}
        </button>
        <p v-if="configMessage" class="config-message" :class="{ error: configError }">{{ configMessage }}</p>
      </form>
    </section>

    <section v-if="savedSession" class="local-session-panel" aria-label="本地版本接续">
      <div>
        <span>本地版本</span>
        <strong>发现本地 Markdown 记录</strong>
        <p>已保存 {{ savedSession.completedCount }} 步，点击接续后从项目本地文件恢复上下文。</p>
      </div>
      <div class="local-session-actions">
        <button class="primary-button" type="button" @click="$emit('restore-local-session')">
          接续本地版本
        </button>
      </div>
    </section>

    <div class="wizard-layout">
      <aside class="wizard-sidebar" aria-label="FDE 方法步骤">
        <div class="step-list">
          <button
            v-for="item in steps"
            :key="item.key"
            type="button"
            class="step-button"
            :class="{ active: item.key === activeStepKey, done: item.isDone }"
            :disabled="!item.canOpen"
            @click="$emit('select-step', item.key)"
          >
            <span class="step-index">{{ item.step }}</span>
            <span class="step-main">
              <strong>{{ item.title }}</strong>
              <small>{{ item.output }}</small>
            </span>
            <StatusTag :label="item.statusLabel" :type="item.statusType" />
          </button>
        </div>

      </aside>

      <section class="wizard-stage" aria-label="当前步骤工作台">
        <div class="stage-strip">
          <div>
            <span>当前步骤</span>
            <strong>{{ activeStep?.title || '需求拆解' }}</strong>
          </div>
          <p>{{ stageHint }}</p>
        </div>

        <slot />
      </section>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
  steps: {
    type: Array,
    required: true,
  },
  activeStepKey: {
    type: String,
    required: true,
  },
  savedSession: {
    type: Object,
    default: null,
  },
  stepOutput: {
    type: [Object, Array, String, Number, Boolean],
    default: null,
  },
})

const emit = defineEmits(['select-step', 'restore-local-session', 'revision-applied', 'runtime-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const localExecutionMode = ref(props.projectContext.executionMode || 'local')
const localLlmProvider = ref(props.projectContext.llmProvider === 'none' ? 'deepseek' : props.projectContext.llmProvider || 'deepseek')
const deepSeekApiKey = ref('')
const deepSeekModel = ref(props.projectContext.llmModel || 'deepseek-v4-flash')
const deepSeekBaseUrl = ref(props.projectContext.llmBaseUrl || 'https://api.deepseek.com')
const isSavingConfig = ref(false)
const configMessage = ref('')
const configError = ref(false)
const llmConfig = ref({
  configured: Boolean(props.projectContext.llmConfigured),
  maskedApiKey: '',
})

watch(
  () => props.projectContext.executionMode,
  (value) => {
    localExecutionMode.value = value || 'local'
  },
)

watch(
  () => props.projectContext.llmProvider,
  (value) => {
    localLlmProvider.value = value === 'none' ? 'deepseek' : value || 'deepseek'
  },
)

const activeStep = computed(() => props.steps.find((item) => item.key === props.activeStepKey))

const runtimeTitle = computed(() => {
  if (localExecutionMode.value === 'local') {
    return '本地规则生成'
  }

  const providerLabel = localLlmProvider.value === 'deepseek' ? 'DeepSeek' : localLlmProvider.value === 'other' ? '其他 LLM' : '模型未选择'
  return `${providerLabel} 生成`
})

const runtimeDescription = computed(() => {
  if (localExecutionMode.value === 'local') {
    return '当前使用本地规则生成需求拆解草案，适合在模型接入前整理材料和确认问题。'
  }

  if (localLlmProvider.value === 'deepseek') {
    return llmConfig.value.configured
      ? '当前会通过本地 FastAPI 调用真实 DeepSeek 服务生成需求拆解。'
      : '请选择 DeepSeek 并先保存 API Key；Key 仅写入本地 .env，前端不持久化。'
  }

  return '其他模型入口已预留，当前请先使用本地规则或 DeepSeek。'
})

const stageHint = computed(() => {
  const step = activeStep.value
  if (!step) {
    return '输入客户原始需求，生成第一版结构化草案。'
  }

  return `输入：${step.input}；输出：${step.output}。生成草案后确认，结果会写入统一项目上下文。`
})

function getConfigErrorMessage(error, fallback) {
  if (error?.name === 'TypeError' || error?.message === 'Failed to fetch') {
    return `未连接到本地 FastAPI。请先在 VSCode 终端执行 bash scripts/start_api.sh，并确认后端地址为 ${API_BASE_URL}。`
  }

  return error?.message || fallback
}


async function loadDeepSeekConfig() {
  try {
    const response = await fetch(`${API_BASE_URL}/llm/config`)
    if (!response.ok) {
      throw new Error('配置接口不可用')
    }
    const payload = await response.json()
    const data = payload.data || {}
    llmConfig.value = {
      configured: Boolean(data.configured),
      maskedApiKey: data.masked_api_key || '',
    }
    deepSeekModel.value = data.model || deepSeekModel.value
    deepSeekBaseUrl.value = data.base_url || deepSeekBaseUrl.value
    emitRuntimeUpdate()
  } catch (error) {
    configError.value = true
    configMessage.value = getConfigErrorMessage(error, '未连接到本地 FastAPI，保存或调用 DeepSeek 前请启动后端服务。')
  }
}

async function saveDeepSeekConfig() {
  if (!deepSeekApiKey.value && llmConfig.value.configured) {
    configError.value = false
    configMessage.value = `DeepSeek Key 已保存在项目根目录 .env：${llmConfig.value.maskedApiKey || '已脱敏'}。后续会默认读取，无需重复填写。`
    emitRuntimeUpdate()
    return
  }

  if (!deepSeekApiKey.value) {
    configError.value = true
    configMessage.value = '请输入新的 DeepSeek API Key 后再保存；如果已保存，请先启动后端让系统读取 .env。'
    return
  }

  isSavingConfig.value = true
  configError.value = false
  configMessage.value = ''

  try {
    const response = await fetch(`${API_BASE_URL}/llm/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: deepSeekApiKey.value,
        model: deepSeekModel.value || 'deepseek-v4-flash',
        base_url: deepSeekBaseUrl.value || 'https://api.deepseek.com',
      }),
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok || payload.success === false) {
      throw new Error(payload.message || payload.detail?.message || 'DeepSeek 配置保存失败')
    }

    const data = payload.data || {}
    llmConfig.value = {
      configured: true,
      maskedApiKey: data.masked_api_key || '',
    }
    deepSeekModel.value = data.model || deepSeekModel.value
    deepSeekBaseUrl.value = data.base_url || deepSeekBaseUrl.value
    deepSeekApiKey.value = ''
    configMessage.value = 'DeepSeek Key 已保存到项目根目录 .env；后续会默认读取，无需重复填写。'
    emitRuntimeUpdate()
  } catch (error) {
    configError.value = true
    configMessage.value = getConfigErrorMessage(error, 'DeepSeek 配置保存失败。')
  } finally {
    isSavingConfig.value = false
  }
}

onMounted(loadDeepSeekConfig)

function emitRuntimeUpdate() {
  if (localExecutionMode.value === 'local') {
    localLlmProvider.value = 'deepseek'
  }

  emit('runtime-update', {
    executionMode: localExecutionMode.value,
    llmProvider: localExecutionMode.value === 'local' ? 'none' : localLlmProvider.value,
    llmConfigured: llmConfig.value.configured,
    llmModel: deepSeekModel.value,
    llmBaseUrl: deepSeekBaseUrl.value,
  })
}
</script>

<style scoped>
.factory-workbench-view {
  margin-top: 16px;
}

.runtime-panel,
.local-session-panel,
.wizard-sidebar,
.wizard-stage {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.runtime-panel {
  display: grid;
  grid-template-columns: minmax(180px, 0.8fr) minmax(320px, 1fr);
  align-items: end;
  gap: 16px;
  margin-bottom: 14px;
  padding: 14px 16px;
}

.local-session-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 14px;
  border-color: #bfdbfe;
  padding: 16px;
  background: #eff6ff;
}

.local-session-panel div:first-child {
  display: grid;
  gap: 6px;
}

.local-session-panel span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.local-session-panel strong {
  color: #0f172a;
  font-size: 18px;
}

.local-session-panel p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.local-session-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.runtime-copy.compact {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px 12px;
}

.runtime-copy span,
.stage-strip span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.runtime-copy strong,
.stage-strip strong {
  color: #0f172a;
  font-size: 18px;
}

.runtime-controls {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 10px;
}

.runtime-controls label {
  display: grid;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
}

.runtime-controls select {
  min-width: 160px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 9px 11px;
  background: #ffffff;
  color: #172033;
  font-weight: 800;
}

.config-status {
  color: #b45309;
  font-size: 13px;
  font-weight: 900;
}

.config-status.ready {
  color: #166534;
}

.deepseek-config {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: minmax(220px, 1.2fr) minmax(150px, 0.65fr) minmax(210px, 0.9fr) auto;
  align-items: end;
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding-top: 12px;
}

.deepseek-config label {
  display: grid;
  gap: 6px;
  color: #64748b;
  font-size: 12px;
  font-weight: 900;
}

.deepseek-config input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 9px 11px;
  color: #172033;
  font-weight: 800;
}

.config-message {
  grid-column: 1 / -1;
  margin: 0;
  color: #166534;
  font-weight: 800;
}

.config-message.error {
  color: #dc2626;
}

.wizard-layout {
  display: grid;
  gap: 14px;
}

.wizard-sidebar,
.wizard-stage {
  padding: 14px;
}

.wizard-sidebar {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 10px;
}

.step-list {
  display: grid;
  grid-template-columns: repeat(7, minmax(110px, 1fr));
  gap: 8px;
}

.step-button {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 8px;
  min-height: 58px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 9px 10px;
  background: #f8fafc;
  text-align: left;
}

.step-button.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.step-button.done {
  border-color: #bbf7d0;
}

.step-button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.step-button :deep(.status-tag),
.step-button > :last-child {
  justify-self: start;
  grid-column: 2;
  margin-top: -2px;
}

.step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.step-main {
  display: grid;
  gap: 2px;
  min-width: 0;
}

.step-main strong {
  color: #0f172a;
  font-size: 14px;
  line-height: 1.25;
}

.step-main small {
  display: none;
}

.stage-strip {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 12px;
  margin-bottom: 14px;
}

.stage-strip div {
  display: grid;
  gap: 6px;
  min-width: 160px;
}

.stage-strip p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

@media (max-width: 1180px) {
  .step-list {
    grid-template-columns: repeat(4, minmax(120px, 1fr));
  }
}

@media (max-width: 980px) {
  .runtime-panel,
  .local-session-panel,
  .stage-strip {
    display: grid;
    grid-template-columns: 1fr;
  }

  .runtime-controls {
    justify-content: stretch;
  }

  .deepseek-config {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .step-list {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
