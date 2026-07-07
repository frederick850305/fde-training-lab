<template>
  <section class="page mobile-page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">移动作业 / 同步状态</span>
        <h1>移动端同步状态</h1>
        <p>查看待同步队列、冲突任务、手动触发同步、查看同步日志，并管理本地缓存空间。</p>
      </div>
    </header>

    <div class="phone-shell">
      <article class="phone-frame">
        <div class="phone-notch"></div>
        <div class="phone-screen">
          <div v-if="uiState === 'loading'" class="state-box">
            <div class="skeleton-block" v-for="n in 3" :key="n">
              <span class="sk-line w60"></span>
              <span class="sk-line w90"></span>
            </div>
          </div>

          <div v-else-if="uiState === 'error'" class="state-box">
            <strong>同步状态加载失败</strong>
            <p>请检查网络后重试。</p>
            <button @click="reload">重试</button>
          </div>

          <template v-else>
            <!-- 概览 -->
            <div class="overview-banner" :class="overview.networkStatus === '弱网' ? 'weak' : 'online'">
              <div class="ov-left">
                <span class="net-dot"></span>
                <strong>{{ overview.networkStatus }}</strong>
              </div>
              <div class="ov-stats">
                <span>待同步 {{ overview.pendingCount }}</span>
                <span>冲突 {{ overview.conflictCount }}</span>
                <span>失败 {{ overview.failedCount }}</span>
              </div>
            </div>
            <p class="last-sync">最近同步：{{ overview.lastSyncTime }}</p>

            <!-- 手动同步 -->
            <div class="sync-action-card">
              <div class="sync-row">
                <span>手动同步</span>
                <em>{{ syncing ? '同步中...' : (syncDone ? '已完成' : '待触发') }}</em>
              </div>
              <div v-if="syncing" class="sync-progress">
                <div class="sync-fill" :style="{ width: syncProgress + '%' }"></div>
                <span>{{ syncProgress }}%</span>
              </div>
              <p v-if="syncDone" class="sync-result">同步完成，剩余 {{ overview.pendingCount }} 项待处理</p>
              <button
                v-if="uiState === 'success'"
                type="button"
                class="sync-btn"
                :disabled="syncing"
                :title="syncing ? '同步中...' : '立即同步'"
                aria-label="手动同步"
                @click="startSync"
              >{{ syncing ? '同步中' : '手动同步' }}</button>
            </div>

            <!-- 同步队列 -->
            <div class="section-card">
              <h3 class="section-title">待同步队列 <em>{{ pendingTasks.length }}</em></h3>
              <ul v-if="pendingTasks.length" class="task-list">
                <li v-for="t in pendingTasks" :key="t.taskId">
                  <div class="task-top">
                    <strong>{{ t.type }}</strong>
                    <span class="task-status" :class="statusTone(t.status)">{{ t.status }}</span>
                  </div>
                  <div class="task-meta">
                    <span>{{ t.shipName }}</span>
                    <span class="sep">·</span>
                    <span>{{ t.recordId }}</span>
                  </div>
                  <p class="task-summary">{{ t.summary }}</p>
                  <div v-if="t.taskId?.startsWith('OFFLINE-')" class="task-ops">
                    <button class="ghost" @click="retryItem(t)">重试</button>
                    <button class="ghost danger" @click="ignoreItem(t)">忽略</button>
                  </div>
                </li>
              </ul>
              <p v-else class="empty-note">暂无待同步任务</p>
            </div>

            <!-- 冲突列表 -->
            <div class="section-card conflict-card">
              <h3 class="section-title">冲突任务 <em>{{ conflictTasks.length }}</em></h3>
              <ul v-if="conflictTasks.length" class="task-list">
                <li v-for="t in conflictTasks" :key="t.taskId" class="conflict-item">
                  <div class="task-top">
                    <strong>{{ t.type }}</strong>
                    <span class="task-status danger">冲突</span>
                  </div>
                  <p class="task-summary">{{ t.summary }}</p>
                  <div class="conflict-ops">
                    <button class="ghost" @click="resolveConflict(t)">以船端为准</button>
                    <button class="ghost" @click="resolveConflict(t)">以岸基为准</button>
                  </div>
                </li>
              </ul>
              <p v-else class="empty-note">暂无冲突</p>
            </div>

            <!-- 同步日志 -->
            <div class="section-card">
              <h3 class="section-title">同步日志</h3>
              <ol class="log-list">
                <li v-for="log in syncLogs" :key="log.id">
                  <span class="log-time">{{ log.timestamp }}</span>
                  <span class="log-action">{{ log.actionType }}</span>
                  <span class="log-detail">{{ log.detail }}</span>
                </li>
              </ol>
            </div>

            <!-- 本地缓存空间管理 -->
            <div class="section-card storage-card">
              <h3 class="section-title">本地缓存空间</h3>
              <div class="storage-bar">
                <div class="storage-fill" :style="{ width: storagePercent + '%' }"></div>
              </div>
              <div class="storage-meta">
                <span>已用 {{ storage.used }} {{ storage.unit }} / 共 {{ storage.total }} {{ storage.unit }}</span>
                <span>{{ storagePercent }}%</span>
              </div>
              <div class="storage-ops">
                <button class="danger" @click="confirmClear = true">清理缓存</button>
              </div>
              <p class="queue-info">离线队列：{{ offlineQueue.length }} 项</p>
            </div>

          </template>
        </div>
      </article>
    </div>

    <ConfirmationDialog
      :open="confirmClear"
      title="清理本地缓存"
      message="将清空离线队列中的所有暂存数据，未同步的记录将丢失。确认清理？"
      @cancel="confirmClear = false"
      @confirm="doClear"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import {
  fetchSyncStatusOverview,
  fetchSyncTasks,
  fetchSyncAuditLogs,
  clearOfflineQueue,
  readOfflineQueue,
  getStorageUsage,
  getOfflineQueueForDisplay,
  removeOfflineItem,
} from '@/mock/api.js'

const uiState = ref('loading')
const overview = ref({ networkStatus: '', pendingCount: 0, conflictCount: 0, failedCount: 0, lastSyncTime: '', storageUsage: { used: 0, total: 512, unit: 'MB' } })
const syncTasks = ref([])
const syncLogs = ref([])
const offlineQueue = ref([])
const storage = ref({ used: 0, total: 512, unit: 'KB' })
const syncing = ref(false)
const syncProgress = ref(0)
const syncDone = ref(false)
const confirmClear = ref(false)

const pendingTasks = computed(() => {
  // 优先展示离线队列中刚提交的报工/盘点/领料/退料
  const offlineItems = getOfflineQueueForDisplay().filter(t => t.status === '待同步')
  // 合并静态同步任务中的待同步项
  const staticPending = syncTasks.value.filter(t => t.status === '待同步')
  return [...offlineItems, ...staticPending]
})
const conflictTasks = computed(() => syncTasks.value.filter(t => t.status === '冲突'))
const storagePercent = computed(() => (storage.value.total ? Math.round((storage.value.used / storage.value.total) * 100) : 0))

function statusTone(s) {
  if (s === '已完成') return 'ok'
  if (s === '冲突') return 'warn'
  if (s === '失败') return 'danger'
  return 'pending'
}

function startSync() {
  if (syncing.value) return
  syncing.value = true
  syncDone.value = false
  syncProgress.value = 0
  const timer = setInterval(() => {
    syncProgress.value += Math.random() * 18 + 6
    if (syncProgress.value >= 100) {
      syncProgress.value = 100
      clearInterval(timer)
      syncing.value = false
      syncDone.value = true
      // 同步完成后清空离线队列
      clearOfflineQueue()
      offlineQueue.value = readOfflineQueue()
      storage.value = getStorageUsage()
      overview.value.pendingCount = 0
    }
  }, 300)
}

function resolveConflict(task) {
  task.status = '已完成'
  overview.value.conflictCount = Math.max(0, overview.value.conflictCount - 1)
}

function retryItem(task) {
  // 模拟重试：标记为同步中然后完成
  task.status = '同步中'
  setTimeout(() => {
    task.status = '已完成'
    overview.value.pendingCount = Math.max(0, overview.value.pendingCount - 1)
    offlineQueue.value = readOfflineQueue()
  }, 1500)
}

function ignoreItem(task) {
  // 从离线队列中移除
  const queue = readOfflineQueue()
  const item = queue.find(q => task.taskId?.includes(q.queuedAt?.slice(-6)))
  if (item) removeOfflineItem(item.queuedAt)
  offlineQueue.value = readOfflineQueue()
  overview.value.pendingCount = Math.max(0, overview.value.pendingCount - 1)
}

function doClear() {
  confirmClear.value = false
  clearOfflineQueue()
  offlineQueue.value = readOfflineQueue()
  storage.value = getStorageUsage()
  alert('离线队列已清空')
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [ov, tasks, logs] = await Promise.all([
      fetchSyncStatusOverview(),
      fetchSyncTasks(),
      fetchSyncAuditLogs(),
    ])
    overview.value = ov
    syncTasks.value = tasks
    syncLogs.value = logs
    offlineQueue.value = readOfflineQueue()
    storage.value = getStorageUsage()
    // 同步存储用量单位与 overview 的 MB 对齐（移动端展示用）
    if (ov.storageUsage) storage.value = ov.storageUsage
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.mobile-page { display: grid; gap: 16px; }
.page-head { position: relative; border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 20px; background: #fff; }
.eyebrow { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-head h1 { margin: 6px 0 6px; font-size: 22px; color: #172033; }
.page-head p { margin: 6px 0 0; color: #64748b; font-size: 13px; max-width: 760px; }

.phone-shell { display: flex; justify-content: center; padding: 8px 0; }
.phone-frame {
  position: relative;
  width: 390px; max-width: 100%;
  border: 12px solid #172033; border-radius: 34px; background: #172033;
  box-shadow: 0 30px 60px rgba(15, 23, 42, 0.22); overflow: hidden;
}
.phone-notch { width: 140px; height: 22px; margin: 0 auto; background: #172033; border-radius: 0 0 14px 14px; }
.phone-screen { background: #eef3f8; min-height: 640px; padding: 14px; display: flex; flex-direction: column; gap: 12px; }

.state-box { display: grid; gap: 8px; padding: 24px 12px; justify-items: center; text-align: center; }
.state-box strong { color: #172033; font-size: 16px; }
.state-box p { color: #64748b; margin: 0; font-size: 13px; line-height: 1.5; }
.state-box button { border: 1px solid #1e6fd9; border-radius: 8px; padding: 8px 16px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 13px; }
.skeleton-block { background: #fff; border-radius: 10px; padding: 14px; display: grid; gap: 8px; }
.sk-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.sk-line.w60 { width: 60%; } .sk-line.w90 { width: 90%; }

.overview-banner { display: flex; justify-content: space-between; align-items: center; padding: 10px 13px; border-radius: 10px; font-size: 12px; font-weight: 900; }
.overview-banner.weak { background: #fff3d8; color: #8a5a00; }
.overview-banner.online { background: #dff6e8; color: #11734d; }
.ov-left { display: flex; align-items: center; gap: 6px; }
.net-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.ov-stats { display: flex; gap: 10px; }
.last-sync { margin: -6px 0 0; padding: 0 4px; color: #64748b; font-size: 11px; }

.sync-action-card { background: #fff; border: 1px solid #d9e4ef; border-radius: 10px; padding: 12px 13px; display: grid; gap: 8px; }
.sync-row { display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 900; color: #172033; }
.sync-row em { font-style: normal; color: #64748b; font-size: 12px; font-weight: 800; }
.sync-progress { position: relative; height: 20px; border-radius: 999px; background: #e7edf4; overflow: hidden; display: grid; align-items: center; padding: 0 10px; }
.sync-fill { position: absolute; left: 0; top: 0; bottom: 0; background: #1e6fd9; transition: width .3s; }
.sync-progress span { position: relative; color: #fff; font-size: 11px; font-weight: 900; }
.sync-result { margin: 0; color: #11734d; font-size: 12px; font-weight: 800; }
.sync-btn { border: 0; border-radius: 8px; padding: 10px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 13px; }
.sync-btn:disabled { background: #b9c8d8; cursor: not-allowed; }

.section-card { background: #fff; border: 1px solid #d9e4ef; border-radius: 10px; padding: 12px 13px; display: grid; gap: 8px; }
.section-title { margin: 0; font-size: 14px; color: #172033; display: flex; justify-content: space-between; align-items: center; }
.section-title em { font-size: 11px; color: #64748b; font-style: normal; font-weight: 800; }

.task-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.task-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 10px; background: #f8fbfe; display: grid; gap: 4px; }
.task-top { display: flex; justify-content: space-between; align-items: center; }
.task-top strong { font-size: 13px; color: #172033; }
.task-status { font-size: 11px; font-weight: 900; padding: 2px 8px; border-radius: 999px; }
.task-status.ok { color: #11734d; background: #dff6e8; }
.task-status.warn { color: #8a5a00; background: #fff2cc; }
.task-status.danger { color: #b4232d; background: #ffe1e3; }
.task-status.pending { color: #53657c; background: #e7edf4; }
.task-meta { display: flex; gap: 5px; color: #64748b; font-size: 11px; }
.task-meta .sep { opacity: .6; }
.task-summary { margin: 0; font-size: 12px; color: #3e5068; line-height: 1.5; }

.conflict-card { border-left: 3px solid #d4743f; }
.conflict-item { border-color: #f3d6c2; }
.conflict-ops { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 4px; }
.conflict-ops button { border: 1px solid #cfdae6; border-radius: 6px; padding: 6px; background: #f6f9fc; color: #24415f; font-size: 11px; font-weight: 800; }

.empty-note { margin: 0; color: #8b9aab; font-size: 12px; text-align: center; padding: 8px; }

.log-list { margin: 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.log-list li { display: grid; grid-template-columns: auto 1fr; gap: 4px 8px; padding: 6px 8px; border-left: 3px solid #1e6fd9; background: #f8fbfe; border-radius: 0 6px 6px 0; font-size: 11px; }
.log-time { color: #64748b; font-weight: 900; }
.log-action { color: #1e6fd9; font-weight: 900; }
.log-detail { grid-column: 1 / -1; color: #3e5068; }

.storage-card { border-left: 3px solid #1e6fd9; }
.storage-bar { height: 12px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.storage-fill { height: 100%; background: linear-gradient(90deg, #1e6fd9, #62b7ff); transition: width .3s; }
.storage-meta { display: flex; justify-content: space-between; font-size: 11px; color: #64748b; font-weight: 800; }
.storage-ops { display: flex; justify-content: flex-end; }
.storage-ops button { border: 1px solid #f3c2c6; border-radius: 7px; padding: 6px 12px; background: #fff0f1; color: #b4232d; font-weight: 900; font-size: 12px; }
.queue-info { margin: 0; font-size: 11px; color: #64748b; }
.task-ops { display: flex; gap: 6px; margin-top: 4px; }
.task-ops button { border: 1px solid #cfdae6; border-radius: 6px; padding: 4px 10px; background: #f6f9fc; color: #24415f; font-size: 11px; font-weight: 800; }
.task-ops button.danger { color: #b4232d; border-color: #f3c2c6; background: #fff0f1; }
</style>
