<template>
  <section class="page-screen sync-task-detail">
    <header class="page-header">
      <div>
        <span class="module-label">船岸数据同步 / 冲突明细</span>
        <h1>同步任务冲突处理</h1>
        <p class="page-desc">对冲突任务进行船岸版本字段差异对比，逐字段选择采用版本后合并提交；支持重试与忽略操作。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="goBack">返回任务列表</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>冲突数据获取异常，请重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无冲突任务</h2>
      <p>当前没有需要处理的同步冲突。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <template v-else>
      <!-- 冲突任务选择 -->
      <section class="panel conflict-selector">
        <div class="panel-title">
          <h2>冲突任务列表</h2>
          <span>{{ conflicts.length }} 个冲突</span>
        </div>
        <div class="conflict-tabs">
          <button
            v-for="c in conflicts"
            :key="c.conflictId"
            type="button"
            :class="['conf-tab', { active: selectedConflict?.conflictId === c.conflictId }]"
            @click="selectConflict(c)"
          >
            <strong>{{ c.conflictId }}</strong>
            <span>工单 {{ c.workOrderId }}</span>
            <small :class="c.resolveStatus === '待处理' ? 'pending' : 'done'">{{ c.resolveStatus }}</small>
          </button>
        </div>
      </section>

      <template v-if="selectedConflict">
        <!-- 冲突字段差异对比 -->
        <section class="panel diff-section">
          <div class="panel-title">
            <h2>冲突字段差异对比</h2>
            <span>逐字段选择采用版本</span>
          </div>
          <DiffView
            :left="selectedConflict.boatVersion"
            :right="selectedConflict.shoreVersion"
            :fields="diffFields"
            mode="side-by-side"
            :resolve-mode="true"
            left-label="船端版本"
            right-label="岸端版本"
            @resolve="onResolve"
          />
        </section>

        <!-- 版本选择摘要 -->
        <section class="panel resolve-summary">
          <div class="panel-title">
            <h2>版本选择摘要</h2>
            <span>确认后合并提交</span>
          </div>
          <div class="resolve-grid">
            <div v-for="field in diffFields" :key="field.key" class="resolve-row">
              <span class="rf-label">{{ field.label }}</span>
              <div class="rf-options">
                <label :class="{ picked: resolved[field.key] === 'left' }">
                  <input type="radio" :name="'rs-' + field.key" value="left" v-model="resolved[field.key]" />
                  船端：{{ displayValue(selectedConflict.boatVersion[field.key]) }}
                </label>
                <label :class="{ picked: resolved[field.key] === 'right' }">
                  <input type="radio" :name="'rs-' + field.key" value="right" v-model="resolved[field.key]" />
                  岸端：{{ displayValue(selectedConflict.shoreVersion[field.key]) }}
                </label>
              </div>
            </div>
          </div>
          <div class="resolve-hint" v-if="!allResolved">
            <span>还有 {{ unresolvedCount }} 个字段未选择采用版本，完成选择后可合并提交。</span>
          </div>
          <div class="resolve-hint ok" v-else>
            <span>所有冲突字段已选择采用版本，可合并提交。</span>
          </div>
          <div class="action-bar">
            <button type="button" @click="openConfirm('重试')">重试同步</button>
            <button type="button" @click="openConfirm('忽略')">忽略冲突</button>
            <button type="button" class="primary" :disabled="!allResolved" @click="openConfirm('合并提交')">合并提交</button>
          </div>
        </section>
      </template>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="pendingAction + '确认'"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmAction"
    />
  </section>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import DiffView from '@/components/DiffView.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchSyncConflicts, submitAction } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const conflicts = ref([])
const uiState = ref('loading')
const selectedConflict = ref(null)
const resolved = reactive({})
const confirmOpen = ref(false)
const pendingAction = ref('合并提交')
const routeContext = computed(() => navigation?.routeContext?.value || {})

const fieldLabelMap = {
  actualHours: '实际工时',
  findingNote: '发现描述',
  materialQty: '物料数量',
  materialName: '物料名称',
}

const diffFields = computed(() => {
  if (!selectedConflict.value) return []
  const keys = new Set([
    ...Object.keys(selectedConflict.value.boatVersion || {}),
    ...Object.keys(selectedConflict.value.shoreVersion || {}),
  ])
  return [...keys].map(key => ({ key, label: fieldLabelMap[key] || key }))
})

const unresolvedCount = computed(() => diffFields.value.filter(f => !resolved[f.key]).length)
const allResolved = computed(() => diffFields.value.length > 0 && unresolvedCount.value === 0)

const confirmMessage = computed(() => {
  if (!selectedConflict.value) return ''
  if (pendingAction.value === '合并提交') {
    return `确认对冲突 ${selectedConflict.value.conflictId}（工单 ${selectedConflict.value.workOrderId}）按所选版本合并提交？提交后将覆盖对应版本并写入审计日志。`
  }
  return `确认对冲突 ${selectedConflict.value.conflictId} 执行“${pendingAction.value}”？`
})

function displayValue(v) {
  if (v === null || v === undefined) return '—'
  return String(v)
}

function selectConflict(c) {
  selectedConflict.value = c
  // 重置选择
  for (const k in resolved) delete resolved[k]
}

function onResolve({ field, selectedVersion }) {
  resolved[field] = selectedVersion
}

function openConfirm(action) {
  pendingAction.value = action
  confirmOpen.value = true
}

function goBack() {
  navigation?.navigateTo?.('SyncTaskList', {
    shipId: routeContext.value.shipId,
  })
}

async function confirmAction() {
  await submitAction(pendingAction.value, selectedConflict.value)
  if (pendingAction.value === '合并提交') {
    // 标记为已处理
    selectedConflict.value.resolveStatus = '已处理'
  } else if (pendingAction.value === '忽略') {
    selectedConflict.value.resolveStatus = '已忽略'
  }
  confirmOpen.value = false
}

async function reload() {
  uiState.value = 'loading'
  try {
    const data = await fetchSyncConflicts()
    conflicts.value = data
    if (!data.length) {
      uiState.value = 'empty'
      return
    }
    selectedConflict.value = pickConflict(data)
    for (const k in resolved) delete resolved[k]
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)

function pickConflict(data) {
  if (routeContext.value.recordId) {
    return data.find(c => c.workOrderId === routeContext.value.recordId) || data[0]
  }
  return data[0]
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .5; cursor: not-allowed; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.conflict-tabs { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; }
.conf-tab { display: grid; gap: 4px; text-align: left; border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; }
.conf-tab.active { border-color: #1e6fd9; background: #edf5ff; }
.conf-tab strong { font-size: 14px; color: #172033; }
.conf-tab span { color: #64748b; font-size: 12px; }
.conf-tab small { font-size: 11px; font-weight: 900; }
.conf-tab small.pending { color: #8a5a00; }
.conf-tab small.done { color: #11734d; }

.diff-section { background: #fff; }

.resolve-grid { display: grid; gap: 10px; }
.resolve-row { display: grid; grid-template-columns: 120px minmax(0,1fr); gap: 12px; align-items: start; border: 1px solid #e7edf4; border-radius: 7px; padding: 10px 12px; background: #f8fbfe; }
.rf-label { color: #53657c; font-size: 13px; font-weight: 900; padding-top: 4px; }
.rf-options { display: grid; gap: 8px; }
.rf-options label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #172033; cursor: pointer; padding: 6px 8px; border-radius: 6px; border: 1px solid transparent; }
.rf-options label.picked { border-color: #1e6fd9; background: #edf5ff; font-weight: 900; }
.rf-options input { accent-color: #1e6fd9; }

.resolve-hint { margin-top: 12px; padding: 10px 12px; border-radius: 7px; background: #fff2cc; color: #8a5a00; font-size: 13px; font-weight: 800; }
.resolve-hint.ok { background: #dff6e8; color: #11734d; }

.action-bar { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #e7edf4; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .resolve-row { grid-template-columns: 1fr; }
  .action-bar { flex-direction: column; }
  .action-bar button { width: 100%; }
}
</style>
