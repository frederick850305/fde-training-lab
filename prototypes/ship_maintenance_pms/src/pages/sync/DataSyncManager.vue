<template>
  <section class="page-screen data-sync-manager">
    <header class="page-header">
      <div>
        <span class="module-label">船岸数据同步 / 同步管理</span>
        <h1>船岸同步总览与管理</h1>
        <p class="page-desc">统计船队同步状态KPI，高亮异常与未同步船舶，逐船展示同步任务与冲突情况，支持进入任务明细进行处理。</p>
      </div>
      </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>同步概览数据获取异常，请检查网络后重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无同步数据</h2>
      <p>当前没有可显示的船岸同步记录。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <template v-else>
      <!-- 顶部 KPI -->
      <section class="kpi-grid">
        <article class="kpi-card normal">
          <strong>{{ kpi.normal }}</strong>
          <span>正常船舶</span>
        </article>
        <article class="kpi-card abnormal">
          <strong>{{ kpi.abnormal }}</strong>
          <span>异常船舶</span>
        </article>
        <article class="kpi-card unsynced">
          <strong>{{ kpi.unsynced }}</strong>
          <span>未同步船舶</span>
        </article>
        <article class="kpi-card pending">
          <strong>{{ kpi.pending }}</strong>
          <span>待同步任务</span>
        </article>
        <article class="kpi-card conflict">
          <strong>{{ kpi.conflict }}</strong>
          <span>冲突任务</span>
        </article>
        <article class="kpi-card failed">
          <strong>{{ kpi.failed }}</strong>
          <span>失败任务</span>
        </article>
      </section>

      <!-- 异常船舶定位 -->
      <section class="panel abnormal-panel" v-if="abnormalShips.length">
        <div class="panel-title">
          <h2>异常船舶定位</h2>
          <span>需优先处理</span>
        </div>
        <div class="abnormal-grid">
          <article v-for="ship in abnormalShips" :key="ship.shipId" :class="['ab-card', ship.syncStatus]">
            <div class="ab-head">
              <strong>{{ ship.shipName }}</strong>
              <span :class="['ab-tag', ship.syncStatus]">{{ statusLabel(ship.syncStatus) }}</span>
            </div>
            <div class="ab-stats">
              <div><span>任务数</span><b>{{ ship.taskCount }}</b></div>
              <div><span>待同步</span><b>{{ ship.pendingCount }}</b></div>
              <div><span>冲突</span><b class="danger">{{ ship.conflictCount }}</b></div>
              <div><span>失败</span><b class="danger">{{ ship.failedCount }}</b></div>
            </div>
            <div class="ab-foot">
              <small>最后同步：{{ ship.lastSyncTime }}</small>
              <button type="button" class="primary" @click="goTasks(ship)">查看任务</button>
            </div>
          </article>
        </div>
      </section>

      <!-- 同步状态统计 -->
      <section class="panel stat-panel">
        <div class="panel-title">
          <h2>同步状态统计</h2>
          <span>每艘船一行</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>船舶</th>
              <th>同步状态</th>
              <th>最后同步时间</th>
              <th>任务数</th>
              <th>待同步</th>
              <th>冲突</th>
              <th>失败</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="ship in summary" :key="ship.shipId" :class="['row-' + ship.syncStatus]">
              <td>{{ ship.shipName }}</td>
              <td><span :class="['sync-tag', ship.syncStatus]">{{ statusLabel(ship.syncStatus) }}</span></td>
              <td>{{ ship.lastSyncTime }}</td>
              <td>{{ ship.taskCount }}</td>
              <td>{{ ship.pendingCount }}</td>
              <td><b :class="{ danger: ship.conflictCount > 0 }">{{ ship.conflictCount }}</b></td>
              <td><b :class="{ danger: ship.failedCount > 0 }">{{ ship.failedCount }}</b></td>
              <td><button type="button" class="link-btn" @click="goTasks(ship)">查看任务</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { fetchSyncSummary } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const summary = ref([])
const uiState = ref('loading')

const kpi = computed(() => {
  const s = summary.value
  return {
    normal: s.filter(x => x.syncStatus === 'normal').length,
    abnormal: s.filter(x => x.syncStatus === 'abnormal').length,
    unsynced: s.filter(x => x.syncStatus === 'unsynced').length,
    pending: s.reduce((a, b) => a + b.pendingCount, 0),
    conflict: s.reduce((a, b) => a + b.conflictCount, 0),
    failed: s.reduce((a, b) => a + b.failedCount, 0),
  }
})

const abnormalShips = computed(() => summary.value.filter(x => x.syncStatus !== 'normal'))

function statusLabel(s) {
  if (s === 'normal') return '正常'
  if (s === 'abnormal') return '异常'
  return '未同步'
}

function goTasks(ship) {
  navigation?.navigateTo?.('SyncTaskList', {
    shipId: ship.shipId,
    shipName: ship.shipName,
  })
}

async function reload() {
  uiState.value = 'loading'
  try {
    const data = await fetchSyncSummary()
    summary.value = data
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
.link-btn { border: 0; background: transparent; color: #1e6fd9; padding: 4px 6px; font-weight: 900; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.kpi-grid { display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 12px; }
.kpi-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; border-top: 4px solid #1e6fd9; }
.kpi-card.normal { border-top-color: #11734d; }
.kpi-card.abnormal { border-top-color: #b4232d; }
.kpi-card.unsynced { border-top-color: #d97706; }
.kpi-card.pending { border-top-color: #1e6fd9; }
.kpi-card.conflict { border-top-color: #b8860b; }
.kpi-card.failed { border-top-color: #b4232d; }
.kpi-card strong { display: block; color: #1e6fd9; font-size: 30px; line-height: 1.1; }
.kpi-card span { color: #64748b; font-size: 12px; font-weight: 800; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.abnormal-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.ab-card { border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #f8fbfe; border-left: 4px solid; }
.ab-card.abnormal { border-left-color: #b4232d; }
.ab-card.unsynced { border-left-color: #d97706; }
.ab-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.ab-head strong { font-size: 15px; color: #172033; }
.ab-tag { padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 900; }
.ab-tag.abnormal { color: #b4232d; background: #ffe1e3; }
.ab-tag.unsynced { color: #8a5a00; background: #fff2cc; }
.ab-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; font-size: 12px; margin-bottom: 10px; }
.ab-stats div { display: flex; justify-content: space-between; }
.ab-stats span { color: #64748b; }
.ab-stats b { font-weight: 900; }
.ab-stats b.danger { color: #b4232d; }
.ab-foot { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.ab-foot small { color: #64748b; font-size: 11px; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 12px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; }
tr.row-abnormal td { background: #fff5f5; }
tr.row-unsynced td { background: #fffdf2; }
b.danger { color: #b4232d; }
.sync-tag { display: inline-flex; padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 900; }
.sync-tag.normal { color: #11734d; background: #dff6e8; }
.sync-tag.abnormal { color: #b4232d; background: #ffe1e3; }
.sync-tag.unsynced { color: #8a5a00; background: #fff2cc; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
