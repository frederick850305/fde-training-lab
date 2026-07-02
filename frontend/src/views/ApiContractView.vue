<template>
  <section class="api-contract-view" aria-labelledby="api-contract-title">
    <div class="api-title-row">
      <ViewHeading
        eyebrow="API Contract"
        title="API 契约设计工作台"
        title-id="api-contract-title"
        description="根据已确认的页面交互结果生成接口清单，再按接口逐项生成契约详情。"
      />
      <button class="gen-btn" type="button" :disabled="isGeneratingList || !canGenerate" @click="generateApiList">
        {{ isGeneratingList ? '生成中...' : '生成接口' }}
      </button>
    </div>

    <p v-if="generationMessage" class="generation-message" :class="{ error: generationError }">{{ generationMessage }}</p>

    <section v-if="!hasContracts" class="empty-state" aria-label="API 契约占位">
      <span>待生成</span>
      <strong>暂无 API 接口清单</strong>
      <p>本页不会预填模拟接口。请先完成第 05 步页面交互，再点击“生成接口”。生成清单后，逐个选择接口生成契约详情。</p>
    </section>

    <template v-else>
      <article class="api-list-panel">
        <div class="panel-heading inline-heading">
          <div>
            <span>API 列表</span>
            <strong>共 {{ contracts.length }} 个接口</strong>
          </div>
          <div class="api-list-actions">
            <small>{{ generatedDetailCount }} / {{ contracts.length }} 已生成详情</small>
            <button
              class="gen-btn"
              type="button"
              :disabled="isGeneratingDetail || !pendingDetailCount"
              @click="generateAllContractDetails"
            >
              {{ isGeneratingDetail ? '生成中...' : '生成契约' }}
            </button>
          </div>
        </div>

        <div class="api-list-horizontal" aria-label="横向 API 列表">
          <button
            v-for="item in contracts"
            :key="item.key"
            type="button"
            class="api-button"
            :class="{ active: item.key === selectedContract?.key }"
            @click="selectedKey = item.key"
          >
            <span
              class="status-tag"
              :class="{
                done: hasContractDetails(item),
                running: item.detailStatus === 'generating',
                failed: item.detailStatus === 'failed',
              }"
            >
              {{ getContractStatusLabel(item) }}
            </span>
            <span class="method-tag">{{ item.method }}</span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.path }}</small>
            <em>{{ item.resourceGroupLabel }}</em>
          </button>
        </div>
      </article>

      <article class="api-detail-panel selected-summary">
        <div class="detail-head-row">
          <div>
            <span class="detail-label">当前接口</span>
            <h3>{{ selectedContract.name }}</h3>
            <p>{{ selectedContract.goal }}</p>
          </div>
        </div>
      </article>

      <section v-if="!hasContractDetails(selectedContract)" class="empty-state compact" aria-label="当前接口详情占位">
        <span>{{ selectedContract?.detailStatus === 'failed' ? '生成失败' : '待生成' }}</span>
        <strong>当前接口还没有契约详情</strong>
        <p>{{ selectedContract?.detailError || '点击 API 列表右上角“生成契约”，系统会按顺序为未生成接口补齐请求参数、响应结构和错误码。' }}</p>
      </section>

      <div v-else class="contract-detail-grid">
        <article class="contract-card meta-card">
          <span>基础信息</span>
          <dl class="api-meta compact-meta">
            <div>
              <dt>请求方法</dt>
              <dd>{{ selectedContract.method }}</dd>
            </div>
            <div>
              <dt>接口路径</dt>
              <dd>{{ selectedContract.path }}</dd>
            </div>
            <div>
              <dt>前端触发</dt>
              <dd>{{ selectedContract.trigger }}</dd>
            </div>
          </dl>
        </article>

        <article class="contract-card params-card">
          <span>请求参数</span>
          <div class="param-row header">
            <strong>参数</strong>
            <strong>类型</strong>
            <strong>必填</strong>
            <strong>说明</strong>
          </div>
          <div v-for="param in selectedContract.requestParams" :key="param.name" class="param-row">
            <span>{{ param.name }}</span>
            <span>{{ param.type }}</span>
            <span>{{ param.required ? '是' : '否' }}</span>
            <span>{{ param.description }}</span>
          </div>
        </article>

        <article class="contract-card code-card">
          <span>成功响应</span>
          <pre>{{ formatJson(selectedContract.successResponse) }}</pre>
        </article>

        <article class="contract-card code-card">
          <span>失败响应</span>
          <pre>{{ formatJson(selectedContract.errorResponse) }}</pre>
        </article>

        <article class="contract-card errors-card">
          <span>错误码</span>
          <div class="error-code-list">
            <section v-for="item in selectedContract.errorCodes" :key="item.code" class="error-code-item">
              <strong>{{ item.code }}</strong>
              <p>{{ item.meaning }}</p>
              <small>{{ item.frontendAdvice }}</small>
            </section>
          </div>
        </article>
      </div>

      <section class="response-standard" aria-labelledby="response-standard-title">
        <button class="response-standard-toggle" type="button" :aria-expanded="isResponseStandardOpen" @click="isResponseStandardOpen = !isResponseStandardOpen">
          <div class="panel-heading">
            <span>统一响应格式</span>
            <strong id="response-standard-title">后续 FastAPI 接口都按这个结构返回</strong>
          </div>
          <small>{{ isResponseStandardOpen ? '收起' : '展开' }}</small>
        </button>
        <div v-if="isResponseStandardOpen" class="response-standard-body">
          <article v-for="section in responseStandardSections" :key="section.key" class="response-standard-section">
            <div>
              <span>{{ section.title }}</span>
              <p>{{ section.description }}</p>
            </div>
            <dl>
              <div v-for="item in section.items" :key="item.name">
                <dt>{{ item.name }}</dt>
                <dd>{{ item.description }}</dd>
              </div>
            </dl>
          </article>
        </div>
      </section>
    </template>

    <div class="next-action">
      <button class="primary-button" type="button" :disabled="!hasContracts" @click="confirmAndNext">
        确认并进入下一步
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['api-contract-confirm', 'api-contract-draft-update'])

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const generatedContractDesign = ref(null)
const selectedKey = ref('')
const isGeneratingList = ref(false)
const isGeneratingDetail = ref(false)
const generationMessage = ref('')
const generationError = ref(false)
const isResponseStandardOpen = ref(false)

const savedApiContractResult = computed(() => props.projectContext.apiContractResult || props.projectContext.stepResults?.api || null)

const interactionDesignResult = computed(() => props.projectContext.interactionDesignResult || props.projectContext.stepResults?.interaction || null)

const pageDesignResult = computed(() => props.projectContext.pageDesignResult || props.projectContext.stepResults?.page || null)

const interactionPages = computed(() => {
  if (interactionDesignResult.value?.pages?.length) {
    return interactionDesignResult.value.pages
  }

  if (interactionDesignResult.value?.generatedPagesByKey) {
    return Object.values(interactionDesignResult.value.generatedPagesByKey)
  }

  return props.projectContext.selectedInteractionPage ? [props.projectContext.selectedInteractionPage] : []
})

const canGenerate = computed(() => Boolean(interactionPages.value.length))

const activeContractDesign = computed(() => generatedContractDesign.value || savedApiContractResult.value || null)

const contracts = computed(() => normalizeContracts(activeContractDesign.value?.contracts || []))

const hasContracts = computed(() => contracts.value.length > 0)

const generatedDetailCount = computed(() => contracts.value.filter((contract) => hasContractDetails(contract)).length)

const pendingDetailCount = computed(() => contracts.value.filter((contract) => !hasContractDetails(contract)).length)

const responseStandard = computed(() => normalizeResponseStandard(activeContractDesign.value?.responseStandard))

const responseStandardSections = computed(() => responseStandard.value.sections || [])

const selectedContract = computed(() => {
  return contracts.value.find((item) => item.key === selectedKey.value) || contracts.value[0] || null
})

watch(
  savedApiContractResult,
  (result) => {
    if (!generatedContractDesign.value && result?.contracts?.length) {
      selectedKey.value = result.selectedContract?.key || result.contracts[0]?.key || ''
    }
  },
  { immediate: true },
)

watch(
  contracts,
  (items) => {
    if (!items.some((item) => item.key === selectedKey.value)) {
      selectedKey.value = items[0]?.key || ''
    }
  },
  { immediate: true },
)

function formatJson(value) {
  return JSON.stringify(value || {}, null, 2)
}

async function generateApiList() {
  if (!canGenerate.value) {
    setGenerationError('没有可用的页面交互结果，无法生成 API 列表。')
    return
  }

  isGeneratingList.value = true
  generationError.value = false
  generationMessage.value = '正在调用大模型生成接口列表...'

  try {
    const compactInput = buildCompactInteractionInput()
    const response = await requestLlmRevision({
      instruction: buildApiListGenerationInstruction(compactInput.pages.length),
      currentOutput: compactInput,
    })

    const nextDesign = normalizeContractListDesign(response, compactInput)
    if (!nextDesign.contracts.length) {
      throw new Error('大模型未返回可用接口列表，请调整页面交互内容后重试。')
    }

    generatedContractDesign.value = nextDesign
    selectedKey.value = nextDesign.selectedContract?.key || nextDesign.contracts[0]?.key || ''
    generationMessage.value = `已生成 ${nextDesign.contracts.length} 个接口清单，并保存到本页 Markdown。请继续逐个生成接口详情。`
    emitDraftUpdate(nextDesign)
  } catch (error) {
    setGenerationError(error.message || '接口列表生成失败。')
  } finally {
    isGeneratingList.value = false
  }
}

async function generateAllContractDetails() {
  if (!hasContracts.value) {
    setGenerationError('请先生成 API 接口清单。')
    return
  }

  const pendingContracts = contracts.value.filter((contract) => !hasContractDetails(contract))
  if (!pendingContracts.length) {
    generationError.value = false
    generationMessage.value = '所有接口契约详情均已生成，无需重复调用。'
    return
  }

  isGeneratingDetail.value = true
  generationError.value = false
  let successCount = 0
  let failedCount = 0
  let nextContracts = contracts.value.map((contract) => ({ ...contract }))

  try {
    for (let index = 0; index < pendingContracts.length; index += 1) {
      const currentBase = nextContracts.find((contract) => contract.key === pendingContracts[index].key) || pendingContracts[index]
      selectedKey.value = currentBase.key
      generationMessage.value = `正在生成 ${index + 1} / ${pendingContracts.length}：「${currentBase.name}」契约详情...`

      const generatingContract = {
        ...currentBase,
        detailStatus: 'generating',
        detailError: '',
      }
      nextContracts = replaceContract(nextContracts, generatingContract)
      syncGeneratedDesign(nextContracts, generatingContract)

      try {
        const result = await generateContractDetailWithRetry(generatingContract)
        nextContracts = replaceContract(nextContracts, result)
        successCount += 1
        syncGeneratedDesign(nextContracts, result)
        emitDraftUpdate(generatedContractDesign.value)
      } catch (error) {
        failedCount += 1
        const failedResult = markContractDetailFailed(generatingContract, error.message || '当前接口契约详情生成失败。')
        nextContracts = replaceContract(nextContracts, failedResult)
        syncGeneratedDesign(nextContracts, failedResult)
        emitDraftUpdate(generatedContractDesign.value)
      }
    }

    generationError.value = failedCount > 0
    generationMessage.value = failedCount > 0
      ? `已生成 ${successCount} 个接口契约详情，${failedCount} 个接口失败；成功和失败状态均已保存到本页 Markdown。`
      : `已生成 ${successCount} 个接口契约详情，并逐个保存到本页 Markdown。`
  } catch (error) {
    setGenerationError(error.message || '批量生成接口契约详情失败。')
  } finally {
    isGeneratingDetail.value = false
  }
}

async function generateContractDetailWithRetry(contract) {
  const maxAttempts = 3
  let lastError = null

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await requestContractDetail(contract, { compact: attempt > 1 })
    } catch (error) {
      lastError = error
      if (attempt < maxAttempts) {
        generationMessage.value = `「${contract.name}」第 ${attempt} 次生成失败，正在重试...`
      }
    }
  }

  throw lastError || new Error('接口契约详情生成失败。')
}

async function requestContractDetail(contract, { compact = false } = {}) {
  const sourcePage = findInteractionPageForContract(contract)
  const detailInput = {
    contract: stripContractDetails(contract),
    sourcePage: compact ? compactInteractionPage(sourcePage) : sourcePage,
    responseStandard: responseStandard.value,
  }
  const response = await requestLlmRevision({
    instruction: buildApiDetailGenerationInstruction(compact),
    currentOutput: detailInput,
  })
  return normalizeContractDetail(response, contract)
}

function replaceContract(items, nextContract) {
  return items.map((contract) => (contract.key === nextContract.key ? nextContract : contract))
}

function syncGeneratedDesign(nextContracts, selectedContractValue) {
  generatedContractDesign.value = {
    ...(activeContractDesign.value || {}),
    contracts: nextContracts,
    selectedContract: selectedContractValue,
    responseStandard: responseStandard.value,
    updatedAt: new Date().toISOString(),
  }
  selectedKey.value = selectedContractValue?.key || selectedKey.value
}

function markContractDetailFailed(contract, message) {
  return {
    ...contract,
    detailGenerated: false,
    detailStatus: 'failed',
    detailError: message,
  }
}

async function requestLlmRevision({ instruction, currentOutput }) {
  const response = await fetch(`${API_BASE_URL}/llm/revise-step`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      step_key: 'apiContract',
      step_title: 'API 契约设计',
      instruction,
      current_output: currentOutput,
      project_context: {
        projectName: props.projectContext.projectName,
        customerName: props.projectContext.customerName,
        projectStage: props.projectContext.projectStage,
      },
    }),
  })

  const payload = await response.json().catch(() => ({}))
  if (!response.ok || payload.success === false) {
    throw new Error(getApiErrorMessage(payload, '接口契约生成失败，请检查后端服务和 DeepSeek 配置。'))
  }

  return payload.data?.revised_output
}

function emitDraftUpdate(result) {
  const cleanedResult = sanitizeApiContractResult(result)
  emit('api-contract-draft-update', cleanedResult)
}

function setGenerationError(message) {
  generationError.value = true
  generationMessage.value = message
}

function confirmAndNext() {
  if (!hasContracts.value) {
    return
  }

  const result = buildApiContractResult()
  emit('api-contract-confirm', {
    contract: sanitizeContractForSave(selectedContract.value),
    apiContractDesign: result,
  })
}

function buildApiContractResult() {
  return sanitizeApiContractResult({
    contracts: contracts.value,
    selectedContract: selectedContract.value,
    responseStandard: responseStandard.value,
    generationSource: {
      interactionPageCount: interactionPages.value.length,
    },
    confirmedAt: new Date().toISOString(),
  })
}

function buildCompactInteractionInput() {
  return {
    source: 'pageInteraction',
    pages: interactionPages.value.map((page, index) => ({
      key: page.key || `interaction-page-${index + 1}`,
      name: page.name || `页面 ${index + 1}`,
      vueFile: page.vueFile || '',
      goal: page.goal || '',
      features: page.features || [],
      fields: (page.fields || []).map((field) => ({
        name: field.name,
        label: field.label || field.name,
        type: field.type || 'string',
        required: Boolean(field.required),
        description: field.description || '',
      })),
      actions: (page.actions || []).map((action) => ({
        label: action.label,
        trigger: action.trigger || '',
        feedback: action.feedback || '',
      })),
      validations: page.validations || [],
      states: page.states || {},
    })),
  }
}

function buildApiListGenerationInstruction(pageCount) {
  return [
    `请根据 ${pageCount} 个页面交互设计，先生成 API 接口清单。`,
    '只返回 JSON，不要 Markdown。JSON 结构必须为：{ "contracts": [...], "responseStandard": object }。',
    '每个 contracts 项只生成接口摘要，不生成详细参数和响应体。必须包含：key, method, name, path, goal, sourcePage, trigger, resourceGroupKey, resourceGroupLabel。',
    'name 必须唯一且体现接口功能。禁止多个接口使用同样的 name。同一个页面拆成多个接口时，按功能细分命名，例如“查询任务列表”、“创建异常工单”、“更新任务状态”等，不要全部叫“XX页面接口契约”。name 中不应包含“接口契约”字样。',
    '每个接口设置 detailGenerated=false。requestParams、successResponse、errorResponse、errorCodes 可以省略或为空。',
    '接口路径必须以 /api/ 开头，按业务资源归类，避免全部使用 /api/resources。',
    '如果一个页面有查询、保存、状态流转等动作，可以拆成 1-3 个核心接口；不要为每个字段生成接口。',
  ].join('\n')
}

function buildApiDetailGenerationInstruction(compact = false) {
  return [
    '请根据当前选中的接口摘要和来源页面交互信息，生成该接口的完整契约详情。',
    compact ? '当前是失败后的重试请求，来源页面信息已压缩；请优先根据接口摘要、页面名称、目标和关键交互生成稳定可用的契约详情。' : '',
    '只返回 JSON，不要 Markdown。JSON 结构必须为单个 contract object。',
    '必须包含：key, method, name, path, goal, trigger, resourceGroupKey, resourceGroupLabel, requestParams, successResponse, errorResponse, errorCodes, detailGenerated。',
    '不要返回 sourcePage 字段；来源页面只作为生成上下文，不写入最终 API 契约。',
    'requestParams 每项包含 name, type, required, description。errorCodes 每项包含 code, meaning, frontendAdvice。',
    'successResponse 和 errorResponse 必须符合统一响应结构：code, message, data, traceId。分页查询时 data 必须包含 records, pagination, summary；失败时 data 必须为 null 或包含 error 对象。',
    'detailGenerated 必须为 true。',
  ].filter(Boolean).join('\n')
}

function sanitizeApiContractResult(result = {}) {
  const cleanedContracts = Array.isArray(result.contracts) ? result.contracts.map(sanitizeContractForSave) : []
  const cleanedSelected = sanitizeContractForSave(result.selectedContract || selectedContract.value || cleanedContracts[0] || null)
  return {
    ...result,
    contracts: cleanedContracts,
    selectedContract: cleanedSelected,
  }
}

function sanitizeContractForSave(contract) {
  if (!contract || typeof contract !== 'object') {
    return contract
  }

  const { sourcePage, ...rest } = contract
  return rest
}

function normalizeContractListDesign(rawOutput, compactInput) {
  const parsed = parseMaybeJson(rawOutput)
  const source = parsed && typeof parsed === 'object' ? parsed : {}
  const rawContracts = Array.isArray(source.contracts) ? source.contracts : []
  const normalizedContracts = normalizeContracts(rawContracts, { detailMode: 'list' })

  return {
    contracts: normalizedContracts,
    selectedContract: normalizedContracts[0] || null,
    responseStandard: source.responseStandard && typeof source.responseStandard === 'object' ? source.responseStandard : defaultResponseStandard(),
    generationInputSummary: `${compactInput.pages.length} 个页面交互结果`,
    generatedAt: new Date().toISOString(),
  }
}

function normalizeContractDetail(rawOutput, baseContract) {
  const parsed = parseMaybeJson(rawOutput)
  const source = parsed && typeof parsed === 'object' ? parsed : {}
  const normalized = normalizeContracts([{
    key: baseContract.key,
    method: source.method || baseContract.method,
    name: source.name || baseContract.name,
    path: source.path || baseContract.path,
    goal: source.goal || baseContract.goal,
    sourcePage: source.sourcePage || baseContract.sourcePage,
    trigger: source.trigger || baseContract.trigger,
    resourceGroupKey: source.resourceGroupKey || baseContract.resourceGroupKey,
    resourceGroupLabel: source.resourceGroupLabel || baseContract.resourceGroupLabel,
    requestParams: source.requestParams,
    successResponse: source.successResponse,
    errorResponse: source.errorResponse,
    errorCodes: source.errorCodes,
    detailGenerated: true,
  }], { detailMode: 'detail' })[0]
  return {
    ...normalized,
    detailGenerated: true,
    detailStatus: 'done',
    detailError: '',
    detailGeneratedAt: new Date().toISOString(),
  }
}

function normalizeContracts(items, options = {}) {
  return items
    .filter(Boolean)
    .map((item, index) => {
      const path = normalizePath(item.path, item.resourceGroupKey, index)
      const key = item.key || `${path.replace(/[^a-zA-Z0-9]+/g, '-')}-${index}`
      const resourceGroupKey = item.resourceGroupKey || inferResourceKey({ ...item, path })
      const detailGenerated = Boolean(item.detailGenerated || hasRawContractDetails(item))
      const shouldNormalizeDetails = options.detailMode === 'detail' || detailGenerated
      const detailStatus = resolveDetailStatus(item, detailGenerated)
      return {
        key,
        method: item.method || 'GET',
        name: item.name || `接口 ${index + 1}`,
        path,
        goal: item.goal || '支撑当前页面的数据读取、提交和状态反馈。',
        sourcePage: item.sourcePage || item.pageName || '未指定页面',
        trigger: item.trigger || '页面初始化、查询、保存或状态变更',
        resourceGroupKey,
        resourceGroupLabel: item.resourceGroupLabel || inferResourceLabel({ ...item, path, resourceGroupKey }),
        requestParams: shouldNormalizeDetails ? normalizeRequestParams(item.requestParams) : [],
        successResponse: shouldNormalizeDetails ? item.successResponse || defaultSuccessResponse(key) : null,
        errorResponse: shouldNormalizeDetails ? item.errorResponse || defaultErrorResponse(resourceGroupKey) : null,
        errorCodes: shouldNormalizeDetails ? normalizeErrorCodes(item.errorCodes, resourceGroupKey) : [],
        detailGenerated,
        detailStatus,
        detailError: detailStatus === 'failed' ? item.detailError || '接口契约详情生成失败，请重新生成。' : '',
        detailGeneratedAt: item.detailGeneratedAt || '',
      }
    })
    .reduce(deduplicateContractNames, [])
}

function resolveDetailStatus(item, detailGenerated) {
  if (detailGenerated) {
    return 'done'
  }

  if (item.detailStatus === 'failed') {
    return 'failed'
  }

  if (item.detailStatus === 'generating') {
    return 'generating'
  }

  return 'pending'
}

function getContractStatusLabel(contract) {
  if (hasContractDetails(contract)) {
    return '已生成'
  }

  if (contract?.detailStatus === 'generating') {
    return '生成中'
  }

  if (contract?.detailStatus === 'failed') {
    return '失败'
  }

  return '未生成'
}

function deduplicateContractNames(result, contract) {
  const existingName = result.find((item) => item.name === contract.name)
  if (!existingName) {
    result.push(contract)
    return result
  }

  const suffix = resolveNameSuffix(contract)
  contract.name = `${contract.name}-${suffix}`
  result.push(contract)
  return result
}

function resolveNameSuffix(contract) {
  const method = String(contract.method || '').toUpperCase()
  const name = String(contract.name || '').toLowerCase()
  if (method.includes('POST') && !name.includes('创建') && !name.includes('保存')) {
    return '保存'
  }

  if (method.includes('GET') && (name.includes('查询') || name.includes('获取') || name.includes('列表'))) {
    return '查询'
  }

  if (method.includes('PUT') || method.includes('PATCH') || name.includes('更新')) {
    return '更新'
  }

  if (method.includes('DELETE') || name.includes('删除')) {
    return '删除'
  }

  return '操作'
}

function hasRawContractDetails(contract) {
  return Boolean(
    (Array.isArray(contract.requestParams) && contract.requestParams.length) ||
    contract.successResponse ||
    contract.errorResponse ||
    (Array.isArray(contract.errorCodes) && contract.errorCodes.length),
  )
}

function hasContractDetails(contract) {
  return Boolean(contract?.detailGenerated && contract?.requestParams?.length && contract?.successResponse && contract?.errorResponse && contract?.errorCodes?.length)
}

function stripContractDetails(contract) {
  return {
    key: contract.key,
    method: contract.method,
    name: contract.name,
    path: contract.path,
    goal: contract.goal,
    sourcePage: contract.sourcePage,
    trigger: contract.trigger,
    resourceGroupKey: contract.resourceGroupKey,
    resourceGroupLabel: contract.resourceGroupLabel,
  }
}

function findInteractionPageForContract(contract) {
  return interactionPages.value.find((page) => {
    return [page.name, page.key, page.vueFile].some((value) => value && String(contract.sourcePage || '').includes(String(value)))
  }) || interactionPages.value.find((page) => page.name === contract.sourcePage) || null
}

function compactInteractionPage(page) {
  if (!page) {
    return null
  }

  return {
    key: page.key || '',
    name: page.name || '',
    vueFile: page.vueFile || '',
    goal: page.goal || '',
    features: Array.isArray(page.features) ? page.features.slice(0, 8) : [],
    fields: (page.fields || []).slice(0, 12).map((field) => ({
      name: field.name,
      label: field.label || field.name,
      type: field.type || 'string',
      required: Boolean(field.required),
      description: field.description || '',
    })),
    actions: (page.actions || []).slice(0, 8).map((action) => ({
      label: action.label,
      trigger: action.trigger || '',
      feedback: action.feedback || '',
    })),
    validations: (page.validations || []).slice(0, 8),
    states: page.states || {},
  }
}

function normalizeRequestParams(params) {
  if (!Array.isArray(params) || !params.length) {
    return [{ name: 'id', type: 'string', required: false, description: '业务对象标识，按接口场景可选。' }]
  }

  return params.map((param) => ({
    name: param.name || 'param',
    type: param.type || 'string',
    required: Boolean(param.required),
    description: param.description || '请求参数。',
  }))
}

function normalizeErrorCodes(codes, resourceGroupKey) {
  if (!Array.isArray(codes) || !codes.length) {
    const prefix = String(resourceGroupKey || 'api').replace(/-/g, '_').toUpperCase()
    return [
      { code: `${prefix}_VALIDATION_FAILED`, meaning: '请求参数或状态流转不合法。', frontendAdvice: '在页面字段旁提示错误，并保留用户输入。' },
      { code: `${prefix}_SYNC_FAILED`, meaning: '服务端保存或同步失败。', frontendAdvice: '展示失败原因并提供重试入口。' },
    ]
  }

  return codes.map((item) => ({
    code: item.code || 'API_FAILED',
    meaning: item.meaning || '接口处理失败。',
    frontendAdvice: item.frontendAdvice || '提示用户失败原因并允许重试。',
  }))
}

function parseMaybeJson(value) {
  if (!value) {
    return null
  }

  if (typeof value === 'object') {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const cleaned = value.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim()
  try {
    return JSON.parse(cleaned)
  } catch (error) {
    return null
  }
}

function normalizePath(path, resourceGroupKey, index) {
  const rawPath = String(path || '').trim()
  if (rawPath.startsWith('/api/')) {
    return rawPath
  }

  const resource = resourceGroupKey || rawPath || `business-${index + 1}`
  return `/api/${String(resource).replace(/^\/api\//, '').replace(/[^a-zA-Z0-9/-]+/g, '-').toLowerCase()}`
}

function inferResourceKey(contract) {
  const path = String(contract.path || '').replace(/^\/api\//, '').split('/')[0]
  if (path) {
    return path
  }

  const text = [contract.name, contract.sourcePage, contract.goal].join(' ')
  if (/车辆|司机|门岗|调度/.test(text)) return 'vehicles'
  if (/任务|计划|工序/.test(text)) return 'tasks'
  if (/异常|问题|反馈/.test(text)) return 'issues'
  if (/统计|报表|分析/.test(text)) return 'analytics'
  return 'business'
}

function inferResourceLabel(contract) {
  const key = contract.resourceGroupKey || inferResourceKey(contract)
  const labels = {
    vehicles: '车辆',
    tasks: '任务',
    issues: '异常',
    analytics: '统计分析',
    business: '业务接口',
  }
  return labels[key] || key
}

function defaultSuccessResponse(key) {
  return {
    code: 0,
    message: 'success',
    data: {
      key,
      records: [],
      pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
      },
      summary: {},
    },
    traceId: 'trace-id',
  }
}

function defaultErrorResponse(resourceGroupKey) {
  return {
    code: 500,
    message: '接口处理失败',
    data: null,
    error: {
      code: `${String(resourceGroupKey || 'api').replace(/-/g, '_').toUpperCase()}_FAILED`,
      message: '业务处理失败或状态流转不合法。',
      details: [],
    },
    traceId: 'trace-id',
  }
}

function defaultResponseStandard() {
  return {
    sections: [
      {
        key: 'envelope',
        title: '统一返回 Envelope',
        description: '所有 FastAPI 接口无论成功或失败，都返回同一层外壳，前端只需按 code 判断业务是否成功。',
        items: [
          { name: 'code', description: 'number。0 表示成功；非 0 表示业务失败或系统异常。' },
          { name: 'message', description: 'string。面向用户或操作员的可读提示，成功默认 success。' },
          { name: 'data', description: 'object | array | null。成功时返回业务数据；失败时通常为 null。' },
          { name: 'traceId', description: 'string。后端链路追踪标识，前端报错或日志记录时带上。' },
        ],
      },
      {
        key: 'pagination',
        title: '列表分页 Data',
        description: '查询列表类接口统一把分页、统计和数据记录放在 data 内，避免每个接口重复定义。',
        items: [
          { name: 'data.records', description: 'array。当前页业务记录。' },
          { name: 'data.pagination.page', description: 'number。当前页码，从 1 开始。' },
          { name: 'data.pagination.pageSize', description: 'number。每页条数。' },
          { name: 'data.pagination.total', description: 'number。符合筛选条件的总记录数。' },
          { name: 'data.summary', description: 'object。当前查询范围内的统计摘要，可为空对象。' },
        ],
      },
      {
        key: 'error',
        title: '失败与错误信息',
        description: '失败响应仍保留统一外壳，错误原因放入 error，方便前端统一弹窗、字段提示和重试。',
        items: [
          { name: 'error.code', description: 'string。稳定错误码，例如 VEHICLE_VALIDATION_FAILED。' },
          { name: 'error.message', description: 'string。失败原因的可读说明。' },
          { name: 'error.details', description: 'array。字段级错误、状态流转错误或校验详情。' },
        ],
      },
      {
        key: 'frontend',
        title: '前端处理规则',
        description: '每个接口契约只描述自身参数和业务 data，下面这些规则作为全局约定复用。',
        items: [
          { name: '成功判断', description: 'code === 0 视为成功；否则进入统一错误处理。' },
          { name: '表单错误', description: 'error.details 中带 field 时，优先落到对应字段旁。' },
          { name: '空状态', description: 'records 为空数组且 code 为 0 时展示空状态，不作为异常。' },
          { name: '重试入口', description: '网络错误、5xx 或 *_SYNC_FAILED 错误码需要保留重试操作。' },
        ],
      },
    ],
  }
}

function normalizeResponseStandard(value) {
  if (value?.sections?.length) {
    return value
  }

  if (value && typeof value === 'object') {
    return {
      sections: [
        {
          key: 'legacy',
          title: '统一返回 Envelope',
          description: '历史保存的响应格式已兼容显示，后续重新生成会采用新的统一结构。',
          items: Object.entries(value).map(([name, description]) => ({
            name,
            description,
          })),
        },
        ...defaultResponseStandard().sections.slice(1),
      ],
    }
  }

  return defaultResponseStandard()
}

function getApiErrorMessage(payload, fallback) {
  if (typeof payload?.detail === 'string') {
    return payload.detail
  }

  return payload?.detail?.message || payload?.message || fallback
}
</script>

<style scoped>
.api-contract-view {
  margin-top: 16px;
}

.empty-state,
.api-list-panel,
.api-detail-panel,
.contract-card,
.response-standard {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.api-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.api-title-row .primary-button {
  flex: 0 0 auto;
  margin-top: 8px;
  min-width: 150px;
}

.empty-state {
  display: grid;
  gap: 6px;
}

.empty-state span,
.panel-heading span,
.detail-label,
.contract-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.empty-state strong,
.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.empty-state p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.generation-message {
  margin: -8px 0 16px;
  color: #166534;
  font-weight: 800;
}

.generation-message.error {
  color: #dc2626;
}

.empty-state {
  min-height: 220px;
  place-content: center;
  margin-bottom: 16px;
  padding: 28px;
  background: #f8fbff;
  text-align: center;
}

.empty-state.compact {
  min-height: 150px;
  margin-top: 16px;
}

.api-list-panel,
.api-detail-panel,
.contract-card,
.response-standard {
  padding: 22px;
}

.inline-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.inline-heading small {
  border-radius: 999px;
  padding: 5px 10px;
  background: #eef2ff;
  color: #1d4ed8;
  font-weight: 900;
}

.api-list-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.small-action {
  min-width: 112px;
  padding: 10px 16px;
  font-size: 14px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.api-list-horizontal {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  overflow: visible;
  padding: 2px;
}

.api-button {
  position: relative;
  display: grid;
  grid-template-rows: auto auto minmax(44px, auto) auto auto;
  gap: 8px;
  width: 100%;
  min-height: 168px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
}

.api-button.active {
  border-color: #2563eb;
  background: #eff6ff;
  box-shadow: inset 0 0 0 1px #93c5fd;
}

.status-tag,
.method-tag {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  font-size: 12px;
  font-style: normal;
  font-weight: 900;
}

.status-tag {
  justify-self: end;
  background: #fef3c7;
  color: #92400e;
}

.status-tag.done {
  background: #dcfce7;
  color: #166534;
}

.status-tag.running {
  background: #dbeafe;
  color: #1d4ed8;
}

.status-tag.failed {
  background: #fee2e2;
  color: #b91c1c;
}

.method-tag {
  background: #dbeafe;
  color: #1d4ed8;
}

.api-button strong {
  display: -webkit-box;
  overflow: hidden;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.4;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.api-button small,
.api-button em {
  overflow: hidden;
  color: #526174;
  font-style: normal;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-summary {
  margin-top: 16px;
}

.detail-head-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.api-detail-panel p,
.api-meta dd,
.error-code-item p,
.error-code-item small,
.response-standard dd {
  color: #526174;
  line-height: 1.65;
}

.api-detail-panel h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 26px;
}

.api-meta {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
}

.compact-meta {
  margin-top: 12px;
}

.api-meta div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.api-meta dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.api-meta dd {
  margin: 0;
  color: #172033;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.contract-detail-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin-top: 16px;
  overflow: visible;
}

.contract-card {
  min-width: 0;
}

.param-row {
  display: grid;
  grid-template-columns: 0.8fr 0.65fr 0.45fr minmax(0, 1.6fr);
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding: 12px 0;
  color: #263244;
  line-height: 1.55;
}

.param-row.header {
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

pre {
  overflow-x: hidden;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  margin: 14px 0 0;
  border-radius: 8px;
  padding: 14px;
  background: #0f172a;
  color: #e2e8f0;
  line-height: 1.55;
}

.error-code-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.error-code-item {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.error-code-item strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
}

.error-code-item p,
.error-code-item small {
  display: block;
  margin: 0 0 4px;
}

.response-standard {
  margin-top: 16px;
}

.response-standard-toggle {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;
}

.response-standard-toggle small {
  flex: 0 0 auto;
  margin-top: 2px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 800;
}

.response-standard dl {
  margin-top: 14px;
}

.response-standard-body {
  display: grid;
  gap: 12px;
  margin-top: 14px;
}

.response-standard-section {
  display: grid;
  grid-template-columns: minmax(180px, 0.35fr) minmax(0, 1fr);
  gap: 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.response-standard-section > div {
  display: grid;
  align-content: start;
  gap: 6px;
}

.response-standard-section span {
  color: #0f172a;
  font-size: 16px;
  font-weight: 900;
}

.response-standard-section p {
  margin: 0;
  color: #526174;
  line-height: 1.55;
}

.response-standard-section dl {
  display: grid;
  gap: 8px;
  margin: 0;
}

.response-standard-section dl div {
  display: grid;
  grid-template-columns: minmax(150px, 0.3fr) minmax(0, 1fr);
  gap: 10px;
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;
}

.response-standard-section dt {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.response-standard-section dd {
  margin: 0;
  color: #172033;
  line-height: 1.6;
  overflow-wrap: anywhere;
}

.next-action {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

@media (max-width: 920px) {
  .api-title-row,
  .detail-head-row {
    align-items: stretch;
    flex-direction: column;
  }

  .contract-detail-grid {
    grid-template-columns: 1fr;
  }

  .api-list-horizontal {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .param-row {
    grid-template-columns: 1fr;
  }

  .response-standard-section,
  .response-standard-section dl div {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .api-list-horizontal {
    grid-template-columns: 1fr;
  }
}
</style>
