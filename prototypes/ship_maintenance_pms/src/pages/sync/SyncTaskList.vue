<template>
  <section class="page-screen sync-task-list">
    <header class="page-header">
      <div>
        <span class="module-label">船岸数据同步 / 任务列表</span>
        <h1>同步任务列表</h1>
        <p class="page-desc">查看所有同步任务，支持按全部/冲突/失败/待同步筛选；可多选任务进行批量重试或忽略操作。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="goBack">返回总览</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>同步任务数据获取异常，请重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无同步任务</h2>
      <p>当前筛选条件下没有同步任务记录。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <template v-else>
      <!-- 顶部筛选 Tab -->
      <section class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="['tab', { active: activeTab === tab.key }]"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </section>

      <!-- 批量操作 -->
      <section class="batch-bar" v-if="filteredTasks.length">
        <div class="batch-left">
          <label class="select-all">
            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
            <span>全选</span>
          </label>
          <span class="selected-count">已选 {{ selectedIds.length }} 项</span>
        </div>
        <div class="batch-actions">
          <button type="button" class="primary" :disabled="!selectedIds.length" @click="openBatch('批量重试')">批量重试</button>
          <button type="button" :disabled="!selectedIds.length || hasUnignorableSelected" @click="openBatch('批量忽略')">批量忽略</button>
        </div>
      </section>

      <!-- 任务表格 -->
      <section class="panel table-panel">
        <div class="panel-title">
          <h2>同步任务列表</h2>
          <span>{{ routeContext.shipName || '全部船舶' }} · {{ filteredTasks.length }} 条</span>
        </div>
        <table>
          <thead>
            <tr>
              <th class="col-check"></th>
              <th>任务编号</th>
              <th>船舶</th>
              <th>类型</th>
              <th>状态</th>
              <th>开始时间</th>
              <th>结束时间</th>
              <th>重试次数</th>
              <th>关联记录</th>
              <th>摘要</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="task in filteredTasks" :key="task.taskId" :class="['row-' + statusKey(task.status)]">
              <td class="col-check">
                <input type="checkbox" :value="task.taskId" v-model="selectedIds" />
              </td>
              <td>{{ task.taskId }}</td>
              <td>{{ task.shipName }}</td>
              <td>{{ task.type }}</td>
              <td><span :class="['status-tag', statusKey(task.status)]">{{ task.status }}</span></td>
              <td>{{ task.startTime }}</td>
              <td>{{ task.endTime || '—' }}</td>
              <td><b :class="{ danger: task.retryCount >= 2 }">{{ task.retryCount }}</b></td>
              <td>{{ task.recordId }}</td>
              <td class="col-summary">{{ task.summary }}</td>
              <td>
                <button v-if="task.status === '失败' || task.status === '冲突'" type="button" class="link-btn" @click="openRetry(task)">重试</button>
                <button v-if="task.status === '冲突'" type="button" class="link-btn" @click="goDetail(task)">明细</button>
                <button type="button" class="link-btn ignore" @click="openIgnore(task)">忽略</button>
              </td>
            </tr>
            <tr v-if="!filteredTasks.length">
              <td colspan="11" class="empty-row">该分类下暂无任务</td>
            </tr>
          </tbody>
        </table>
      </section>
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
import { computed, inject, onMounted, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchSyncTasks, submitAction } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const tasks = ref([])
const uiState = ref('loading')
const activeTab = ref('all')
const selectedIds = ref([])
const confirmOpen = ref(false)
const pendingAction = ref('批量重试')
const currentTask = ref(null)
const routeContext = computed(() => navigation?.routeContext?.value || {})

const scopedTasks = computed(() =>
  routeContext.value.shipId
    ? tasks.value.filter(t => t.shipId === routeContext.value.shipId)
    : tasks.value,
)

const tabs = computed(() => [
  { key: 'all', label: '全部', count: scopedTasks.value.length },
  { key: 'conflict', label: '冲突', count: scopedTasks.value.filter(t => t.status === '冲突').length },
  { key: 'failed', label: '失败', count: scopedTasks.value.filter(t => t.status === '失败').length },
  { key: 'pending', label: '待同步', count: scopedTasks.value.filter(t => t.status === '待同步').length },
])

const filteredTasks = computed(() => {
  if (activeTab.value === 'all') return scopedTasks.value
  if (activeTab.value === 'conflict') return scopedTasks.value.filter(t => t.status === '冲突')
  if (activeTab.value === 'failed') return scopedTasks.value.filter(t => t.status === '失败')
  if (activeTab.value === 'pending') return scopedTasks.value.filter(t => t.status === '待同步')
  return scopedTasks.value
})

const allSelected = computed(() => filteredTasks.value.length > 0 && filteredTasks.value.every(t => selectedIds.value.includes(t.taskId)))
const hasUnignorableSelected = computed(() =>
  tasks.value.some(t => selectedIds.value.includes(t.taskId) && ['冲突', '失败'].includes(t.status)),
)

const confirmMessage = computed(() => {
  if (currentTask.value) {
    return `确认对任务 ${currentTask.value.taskId}（${currentTask.value.summary}）执行“${pendingAction.value}”？`
  }
  return `确认对已选 ${selectedIds.value.length} 项任务执行“${pendingAction.value}”？操作将写入审计日志。`
})

function statusKey(s) {
  if (s === '冲突') return 'conflict'
  if (s === '失败') return 'failed'
  if (s === '待同步') return 'pending'
  if (s === '已完成') return 'done'
  return 'syncing'
}

function toggleAll(e) {
  if (e.target.checked) {
    selectedIds.value = filteredTasks.value.map(t => t.taskId)
  } else {
    selectedIds.value = []
  }
}

function openBatch(action) {
  currentTask.value = null
  pendingAction.value = action
  confirmOpen.value = true
}

function openRetry(task) {
  currentTask.value = task
  pendingAction.value = '重试'
  confirmOpen.value = true
}

function openIgnore(task) {
  currentTask.value = task
  pendingAction.value = '忽略'
  confirmOpen.value = true
}

function goDetail(task) {
  navigation?.navigateTo?.('SyncTaskDetail', {
    taskId: task.taskId,
    shipId: task.shipId,
    recordId: task.recordId,
  })
}

function goBack() {
  navigation?.navigateTo?.('DataSyncManager')
}

async function confirmAction() {
  const ids = currentTask.value ? [currentTask.value.taskId] : [...selectedIds.value]
  await submitAction(pendingAction.value, { ids })
  // 更新本地状态
  tasks.value = tasks.value.map(t => {
    if (!ids.includes(t.taskId)) return t
    if (pendingAction.value.includes('重试')) {
      return { ...t, status: '同步中', retryCount: t.retryCount + 1 }
    }
    if (pendingAction.value.includes('忽略')) {
      return { ...t, status: '已忽略' }
    }
    return t
  })
  selectedIds.value = selectedIds.value.filter(id => !ids.includes(id))
  currentTask.value = null
  confirmOpen.value = false
}

async function reload() {
  uiState.value = 'loading'
  try {
    const data = await fetchSyncTasks()
    tasks.value = data
    uiState.value = data.length ? 'success' : 'empty'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
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
.link-btn { border: 0; background: transparent; color: #1e6fd9; padding: 4px 6px; font-weight: 900; margin-right: 4px; }
.link-btn.ignore { color: #64748b; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.tab-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.tab { display: inline-flex; align-items: center; gap: 6px; border: 1px solid #d9e4ef; background: #fff; }
.tab.active { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
.tab-count { display: inline-flex; min-width: 22px; justify-content: center; padding: 1px 6px; border-radius: 999px; font-size: 11px; background: #eef3f8; color: #1e6fd9; }
.tab.active .tab-count { background: rgba(255,255,255,.25); color: #fff; }

.batch-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 12px 16px; background: #fff; }
.batch-left { display: flex; align-items: center; gap: 16px; }
.select-all { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 800; color: #172033; cursor: pointer; }
.selected-count { color: #64748b; font-size: 13px; font-weight: 800; }
.batch-actions { display: flex; gap: 8px; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; }
.col-check { width: 36px; }
.col-summary { max-width: 220px; color: #53657c; }
tr.row-conflict td { background: #fffdf2; }
tr.row-failed td { background: #fff5f5; }
tr.row-pending td { background: #f8fbfe; }
.empty-row { text-align: center; color: #64748b; padding: 30px; }
b.danger { color: #b4232d; }
.status-tag { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 900; }
.status-tag.conflict { color: #8a5a00; background: #fff2cc; }
.status-tag.failed { color: #b4232d; background: #ffe1e3; }
.status-tag.pending { color: #1f5fbf; background: #e3efff; }
.status-tag.done { color: #11734d; background: #dff6e8; }
.status-tag.syncing { color: #64748b; background: #eef3f8; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .batch-bar { flex-direction: column; align-items: stretch; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
