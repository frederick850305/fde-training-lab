<template>
  <section class="page-screen data-sync-detail">
    <header class="page-header">
      <div>
        <span class="module-label">船岸数据同步 / 移动端同步队列</span>
        <h1>移动端同步队列详情</h1>
        <p class="page-desc">在手机外壳内展示同步队列任务列表，支持失败任务重试、冲突任务字段差异简化处理，顶部显示同步进度与网络状态。</p>
      </div>
      </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>同步队列数据获取异常，请重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="mobile-layout">
        <!-- 手机外壳 -->
        <article class="phone-frame">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            <!-- 顶部进度与网络状态 -->
            <div class="phone-top">
              <div class="phone-status-bar">
                <span :class="['net-badge', netClass]">{{ overview.networkStatus }}</span>
                <small>最后同步：{{ overview.lastSyncTime }}</small>
              </div>
              <div class="sync-progress">
                <div class="sync-meta">
                  <span>同步进度</span>
                  <b>{{ syncProgress.done }} / {{ syncProgress.total }}</b>
                </div>
                <div class="sync-track">
                  <i :style="{ width: syncProgress.rate + '%' }"></i>
                </div>
                <div class="sync-mini-stats">
                  <span>待同步 {{ overview.pendingCount }}</span>
                  <span>冲突 {{ overview.conflictCount }}</span>
                  <span>失败 {{ overview.failedCount }}</span>
                </div>
              </div>
            </div>

            <!-- 队列筛选 -->
            <div class="queue-tabs">
              <button
                v-for="tab in tabs"
                :key="tab.key"
                type="button"
                :class="['qtab', { active: activeTab === tab.key }]"
                @click="activeTab = tab.key"
              >{{ tab.label }}<i>{{ tab.count }}</i></button>
            </div>

            <!-- 任务列表 -->
            <div class="queue-list">
              <div v-for="task in filteredTasks" :key="task.taskId" :class="['queue-item', statusKey(task.status)]">
                <div class="qi-head">
                  <strong>{{ task.type }}</strong>
                  <span :class="['qi-status', statusKey(task.status)]">{{ task.status }}</span>
                </div>
                <div class="qi-meta">
                  <span>{{ task.taskId }}</span>
                  <span>{{ task.shipName }}</span>
                </div>
                <p class="qi-summary">{{ task.summary }}</p>
                <div class="qi-foot">
                  <small>重试 {{ task.retryCount }} 次</small>
                  <div class="qi-actions">
                    <button v-if="task.status === '失败'" type="button" class="mini primary" @click="retryTask(task)">重试</button>
                    <button v-if="task.status === '冲突'" type="button" class="mini" @click="openConflict(task)">处理</button>
                    <button v-if="task.status === '待同步'" type="button" class="mini" @click="syncNow(task)">同步</button>
                    <span v-if="task.status === '已完成'" class="done-mark">已完成</span>
                  </div>
                </div>
              </div>
              <div v-if="!filteredTasks.length" class="queue-empty">该分类下暂无任务</div>
            </div>
          </div>
        </article>

        <!-- 右侧冲突简化处理面板 -->
        <article class="panel conflict-side">
          <div class="panel-title">
            <h2>冲突字段差异（简化）</h2>
            <span v-if="currentConflict">{{ currentConflict.workOrderId }}</span>
          </div>
          <template v-if="currentConflict">
            <div class="conflict-fields">
              <div v-for="(fd, i) in currentConflict.fieldDifferences" :key="i" class="cf-row">
                <div class="cf-label">{{ fieldLabel(fd.field) }}</div>
                <div class="cf-versions">
                  <label :class="{ picked: cfResolved[i] === 'boat' }">
                    <input type="radio" :name="'cf-' + i" value="boat" v-model="cfResolved[i]" />
                    <span>船端</span>
                    <b>{{ fd.boatVersion }}</b>
                  </label>
                  <label :class="{ picked: cfResolved[i] === 'shore' }">
                    <input type="radio" :name="'cf-' + i" value="shore" v-model="cfResolved[i]" />
                    <span>岸端</span>
                    <b>{{ fd.shoreVersion }}</b>
                  </label>
                </div>
              </div>
            </div>
            <div class="conflict-submit-bar" v-if="currentConflict">
              <button type="button" class="primary" :disabled="!cfAllResolved" @click="submitConflict">合并提交</button>
            </div>
          </template>
          <div v-else class="empty-hint">
            点击队列中冲突任务的"处理"按钮，在此查看字段差异并选择采用版本。
          </div>
        </article>
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
import { computed, onMounted, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchSyncTasks, fetchSyncConflicts, fetchSyncStatusOverview, submitAction } from '@/mock/api.js'

const tasks = ref([])
const conflicts = ref([])
const overview = ref({ networkStatus: '—', pendingCount: 0, conflictCount: 0, failedCount: 0, lastSyncTime: '—' })
const uiState = ref('loading')
const activeTab = ref('all')
const currentConflict = ref(null)
const cfResolved = ref([])
const confirmOpen = ref(false)
const pendingAction = ref('重试')

const tabs = computed(() => [
  { key: 'all', label: '全部', count: tasks.value.length },
  { key: 'pending', label: '待同步', count: tasks.value.filter(t => t.status === '待同步').length },
  { key: 'conflict', label: '冲突', count: tasks.value.filter(t => t.status === '冲突').length },
  { key: 'failed', label: '失败', count: tasks.value.filter(t => t.status === '失败').length },
  { key: 'done', label: '已完成', count: tasks.value.filter(t => t.status === '已完成').length },
])

const filteredTasks = computed(() => {
  if (activeTab.value === 'all') return tasks.value
  const map = { pending: '待同步', conflict: '冲突', failed: '失败', done: '已完成' }
  return tasks.value.filter(t => t.status === map[activeTab.value])
})

const syncProgress = computed(() => {
  const total = tasks.value.length
  const done = tasks.value.filter(t => t.status === '已完成').length
  return { total, done, rate: total ? Math.round((done / total) * 100) : 0 }
})

const netClass = computed(() => {
  const n = overview.value.networkStatus
  if (n === '在线' || n === '正常') return 'ok'
  if (n === '弱网') return 'warn'
  return 'danger'
})

const cfAllResolved = computed(() => {
  return currentConflict.value && currentConflict.value.fieldDifferences.every((_, i) => cfResolved.value[i])
})

const confirmMessage = computed(() => `确认对任务执行“${pendingAction.value}”？`)

function statusKey(s) {
  if (s === '冲突') return 'conflict'
  if (s === '失败') return 'failed'
  if (s === '待同步') return 'pending'
  if (s === '已完成') return 'done'
  return 'syncing'
}

function fieldLabel(f) {
  const map = { actualHours: '实际工时', findingNote: '发现描述', materialQty: '物料数量', materialName: '物料名称' }
  return map[f] || f
}

function retryTask(task) {
  pendingAction.value = '重试'
  confirmOpen.value = true
  currentConflict.value = null
  // 存储待操作任务
  pendingTask.value = task
}

function syncNow(task) {
  pendingAction.value = '同步'
  confirmOpen.value = true
  pendingTask.value = task
}

function openConflict(task) {
  // 找到匹配的冲突数据
  const c = conflicts.value.find(x => x.workOrderId === task.recordId) || conflicts.value[0]
  currentConflict.value = c
  cfResolved.value = c ? c.fieldDifferences.map(() => '') : []
}

function submitConflict() {
  pendingAction.value = '合并提交'
  confirmOpen.value = true
}

const pendingTask = ref(null)

async function confirmAction() {
  await submitAction(pendingAction.value, currentConflict.value || pendingTask.value)
  if (pendingAction.value === '重试' && pendingTask.value) {
    pendingTask.value.status = '同步中'
    pendingTask.value.retryCount += 1
  } else if (pendingAction.value === '同步' && pendingTask.value) {
    pendingTask.value.status = '同步中'
  } else if (pendingAction.value === '合并提交') {
    if (currentConflict.value) currentConflict.value.resolveStatus = '已处理'
    currentConflict.value = null
  }
  confirmOpen.value = false
  pendingTask.value = null
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [t, c, o] = await Promise.all([
      fetchSyncTasks(),
      fetchSyncConflicts(),
      fetchSyncStatusOverview(),
    ])
    tasks.value = t
    conflicts.value = c
    overview.value = o
    uiState.value = 'success'
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

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.mobile-layout { display: grid; grid-template-columns: 400px minmax(0, 1fr); gap: 16px; align-items: start; }

/* phone frame */
.phone-frame { border: 12px solid #172033; border-radius: 36px; padding: 0; background: #172033; box-shadow: 0 20px 60px rgba(15,23,42,.25); overflow: hidden; position: relative; }
.phone-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 120px; height: 22px; background: #172033; border-radius: 0 0 16px 16px; z-index: 2; }
.phone-screen { background: #eef3f8; min-height: 640px; max-height: 720px; overflow-y: auto; padding: 28px 14px 16px; }
.phone-top { background: #fff; border-radius: 14px; padding: 12px; margin-bottom: 12px; }
.phone-status-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.net-badge { padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 900; }
.net-badge.ok { color: #11734d; background: #dff6e8; }
.net-badge.warn { color: #8a5a00; background: #fff2cc; }
.net-badge.danger { color: #b4232d; background: #ffe1e3; }
.phone-status-bar small { color: #64748b; font-size: 11px; }
.sync-progress { display: grid; gap: 6px; }
.sync-meta { display: flex; justify-content: space-between; font-size: 12px; font-weight: 800; color: #172033; }
.sync-meta b { color: #1e6fd9; }
.sync-track { height: 7px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.sync-track i { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, #1e6fd9, #11734d); transition: width .4s; }
.sync-mini-stats { display: flex; gap: 12px; font-size: 11px; color: #64748b; font-weight: 800; }

.queue-tabs { display: flex; gap: 6px; overflow-x: auto; margin-bottom: 10px; }
.qtab { display: inline-flex; align-items: center; gap: 4px; border: 1px solid #d9e4ef; border-radius: 999px; padding: 6px 12px; background: #fff; font-size: 12px; font-weight: 900; color: #24415f; white-space: nowrap; cursor: pointer; }
.qtab.active { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
.qtab i { display: inline-flex; min-width: 18px; justify-content: center; padding: 0 5px; border-radius: 999px; font-style: normal; font-size: 10px; background: #eef3f8; color: #1e6fd9; }
.qtab.active i { background: rgba(255,255,255,.25); color: #fff; }

.queue-list { display: grid; gap: 10px; }
.queue-item { border: 1px solid #e2eaf3; border-radius: 12px; padding: 12px; background: #fff; border-left: 4px solid #1e6fd9; }
.queue-item.failed { border-left-color: #b4232d; }
.queue-item.conflict { border-left-color: #d97706; }
.queue-item.done { border-left-color: #11734d; }
.queue-item.pending { border-left-color: #1e6fd9; }
.qi-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.qi-head strong { font-size: 14px; color: #172033; }
.qi-status { padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 900; }
.qi-status.failed { color: #b4232d; background: #ffe1e3; }
.qi-status.conflict { color: #8a5a00; background: #fff2cc; }
.qi-status.pending { color: #1f5fbf; background: #e3efff; }
.qi-status.done { color: #11734d; background: #dff6e8; }
.qi-status.syncing { color: #64748b; background: #eef3f8; }
.qi-meta { display: flex; gap: 10px; font-size: 11px; color: #64748b; margin-bottom: 4px; }
.qi-summary { margin: 0 0 8px; font-size: 12px; color: #53657c; line-height: 1.4; }
.qi-foot { display: flex; align-items: center; justify-content: space-between; }
.qi-foot small { color: #64748b; font-size: 11px; }
.qi-actions { display: flex; gap: 6px; }
.mini { padding: 4px 10px; font-size: 11px; border-radius: 6px; }
.mini.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
.done-mark { font-size: 11px; color: #11734d; font-weight: 900; }
.queue-empty { text-align: center; color: #64748b; padding: 30px 0; font-size: 13px; }

/* conflict side panel */
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }
.empty-hint { padding: 30px 0; text-align: center; color: #64748b; font-size: 13px; line-height: 1.6; }

.conflict-fields { display: grid; gap: 10px; margin-bottom: 14px; }
.cf-row { border: 1px solid #e7edf4; border-radius: 8px; padding: 12px; background: #f8fbfe; }
.cf-label { font-size: 13px; font-weight: 900; color: #53657c; margin-bottom: 8px; }
.cf-versions { display: grid; gap: 8px; }
.cf-versions label { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; border: 1px solid transparent; font-size: 13px; cursor: pointer; background: #fff; }
.cf-versions label.picked { border-color: #1e6fd9; background: #edf5ff; }
.cf-versions input { accent-color: #1e6fd9; }
.cf-versions span { color: #64748b; font-weight: 800; }
.cf-versions b { margin-left: auto; color: #172033; }
.full { width: 100%; }
.conflict-submit-bar { display: flex; justify-content: flex-end; margin-top: 14px; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .mobile-layout { grid-template-columns: 1fr; }
  .phone-frame { max-width: 400px; margin: 0 auto; }
}
</style>
