<template>
  <section class="page-screen sync-report">
    <header class="page-header">
      <div class="header-text">
        <span class="module-label">船岸数据同步 / 同步报告</span>
        <h1>同步历史报告与健康趋势</h1>
        <p>按时间范围与船舶检索同步历史报告，查看健康度趋势图表，支持生成新报告并下载历史报告。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" class="primary" @click="openConfirm('生成报告')">生成报告</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>报告数据获取异常，请重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 历史检索 -->
      <section class="panel search-panel">
        <div class="panel-title">
          <h2>同步历史检索</h2>
          <span>{{ filteredReports.length }} 条记录</span>
        </div>
        <div class="search-bar">
          <label>
            时间范围
            <select v-model="filters.period">
              <option value="">全部周期</option>
              <option v-for="r in reports" :key="r.reportId" :value="r.period">{{ r.period }}</option>
            </select>
          </label>
          <label>
            船舶
            <select v-model="filters.ship">
              <option value="">全部船舶</option>
              <option value="4">全部4艘</option>
              <option value="3">3艘及以下</option>
            </select>
          </label>
          <label>
            状态
            <select v-model="filters.status">
              <option value="">全部状态</option>
              <option>可下载</option>
              <option>生成中</option>
            </select>
          </label>
          <button type="button" class="primary" @click="applyFilters">查询</button>
        </div>

        <table>
          <thead>
            <tr>
              <th>报告编号</th>
              <th>周期</th>
              <th>船舶数</th>
              <th>成功率</th>
              <th>冲突数</th>
              <th>生成时间</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in filteredReports" :key="r.reportId">
              <td>{{ r.reportId }}</td>
              <td>{{ r.period }}</td>
              <td>{{ r.ships }}</td>
              <td>
                <div class="rate-cell">
                  <div class="rate-bar"><i :style="{ width: r.successRate + '%', background: rateColor(r.successRate) }"></i></div>
                  <b>{{ r.successRate }}%</b>
                </div>
              </td>
              <td><b :class="{ danger: r.conflictCount > 0 }">{{ r.conflictCount }}</b></td>
              <td>{{ r.generatedAt }}</td>
              <td><StatusBadge :label="r.status" /></td>
              <td><button type="button" class="link-btn" @click="downloadReport(r)" :disabled="r.status !== '可下载'">下载</button></td>
            </tr>
            <tr v-if="!filteredReports.length">
              <td colspan="8" class="empty-row">无匹配报告</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 健康度趋势 -->
      <section class="panel trend-panel">
        <div class="panel-title">
          <h2>同步健康度趋势</h2>
          <span>近 {{ overview.healthTrend.length }} 个周期</span>
        </div>
        <div class="trend-chart">
          <div class="chart-bars">
            <div v-for="(val, i) in overview.healthTrend" :key="i" class="bar-col">
              <div class="bar-value">{{ val }}</div>
              <div class="bar-fill" :style="{ height: barHeight(val) + '%', background: trendColor(val) }"></div>
              <div class="bar-label">T-{{ overview.healthTrend.length - i }}</div>
            </div>
          </div>
          <div class="chart-meta">
            <div class="meta-card">
              <span>当前网络状态</span>
              <strong :class="netClass">{{ overview.networkStatus }}</strong>
            </div>
            <div class="meta-card">
              <span>待同步</span>
              <strong>{{ overview.pendingCount }}</strong>
            </div>
            <div class="meta-card">
              <span>冲突</span>
              <strong class="danger">{{ overview.conflictCount }}</strong>
            </div>
            <div class="meta-card">
              <span>失败</span>
              <strong class="danger">{{ overview.failedCount }}</strong>
            </div>
            <div class="meta-card">
              <span>最后同步</span>
              <strong>{{ overview.lastSyncTime }}</strong>
            </div>
          </div>
        </div>
      </section>

      <!-- 下载记录 -->
      <section class="panel download-panel" v-if="downloadRecords.length">
        <div class="panel-title">
          <h2>报告下载记录</h2>
          <span>{{ downloadRecords.length }} 条</span>
        </div>
        <ul class="download-list">
          <li v-for="(d, i) in downloadRecords" :key="i">
            <div class="dl-info">
              <strong>{{ d.reportId }}</strong>
              <span>{{ d.period }}</span>
            </div>
            <small>{{ d.downloadedAt }}</small>
          </li>
        </ul>
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
import { computed, onMounted, reactive, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchSyncReportHistory, fetchSyncStatusOverview, submitAction } from '@/mock/api.js'

const reports = ref([])
const overview = ref({ healthTrend: [], networkStatus: '—', pendingCount: 0, conflictCount: 0, failedCount: 0, lastSyncTime: '—' })
const uiState = ref('loading')
const filters = reactive({ period: '', ship: '', status: '' })
const downloadRecords = ref([])
const confirmOpen = ref(false)
const pendingAction = ref('生成报告')

const filteredReports = computed(() => {
  return reports.value.filter(r => {
    if (filters.period && r.period !== filters.period) return false
    if (filters.ship === '4' && r.ships < 4) return false
    if (filters.ship === '3' && r.ships > 3) return false
    if (filters.status && r.status !== filters.status) return false
    return true
  })
})

const confirmMessage = computed(() => {
  if (pendingAction.value === '生成报告') {
    return '确认生成当前周期的船岸同步报告？生成后可在列表中下载。'
  }
  return `确认执行“${pendingAction.value}”？`
})

const netClass = computed(() => {
  const n = overview.value.networkStatus
  if (n === '在线' || n === '正常') return 'ok'
  if (n === '弱网') return 'warn'
  return 'danger'
})

function rateColor(rate) {
  if (rate >= 90) return '#11734d'
  if (rate >= 80) return '#1e6fd9'
  return '#b4232d'
}

function trendColor(val) {
  if (val >= 85) return '#11734d'
  if (val >= 75) return '#1e6fd9'
  return '#d97706'
}

function barHeight(val) {
  return Math.max(8, val)
}

function applyFilters() {
  // 计算属性自动响应
}

function downloadReport(r) {
  downloadRecords.value = [
    { reportId: r.reportId, period: r.period, downloadedAt: new Date().toISOString().slice(0, 16).replace('T', ' ') },
    ...downloadRecords.value,
  ].slice(0, 10)
}

function openConfirm(action) {
  pendingAction.value = action
  confirmOpen.value = true
}

async function confirmAction() {
  await submitAction(pendingAction.value, null)
  if (pendingAction.value === '生成报告') {
    const newReport = {
      reportId: `RPT-SYNC-${String(reports.value.length + 1).padStart(2, '0')}`,
      period: '2026-07-01 ~ 2026-07-07',
      ships: 4,
      successRate: 87 + Math.floor(Math.random() * 10),
      conflictCount: Math.floor(Math.random() * 4),
      generatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: '可下载',
    }
    reports.value = [newReport, ...reports.value]
  }
  confirmOpen.value = false
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [r, o] = await Promise.all([
      fetchSyncReportHistory(),
      fetchSyncStatusOverview(),
    ])
    reports.value = r
    overview.value = o
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .5; cursor: not-allowed; }
.link-btn { border: 0; background: transparent; color: #1e6fd9; padding: 4px 6px; font-weight: 900; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.search-bar { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 12px; align-items: end; margin-bottom: 14px; }
.search-bar label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.search-bar select { min-height: 36px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; color: #172033; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; }
.empty-row { text-align: center; color: #64748b; padding: 30px; }
b.danger { color: #b4232d; }
.rate-cell { display: flex; align-items: center; gap: 8px; }
.rate-bar { width: 80px; height: 6px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.rate-bar i { display: block; height: 100%; border-radius: 999px; }

.trend-chart { display: grid; grid-template-columns: minmax(0, 1fr) 280px; gap: 20px; align-items: stretch; }
.chart-bars { display: flex; align-items: flex-end; gap: 14px; min-height: 220px; padding: 16px 8px 8px; border: 1px solid #e7edf4; border-radius: 8px; background: #f8fbfe; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; height: 100%; justify-content: flex-end; }
.bar-value { font-size: 12px; font-weight: 900; color: #172033; }
.bar-fill { width: 70%; max-width: 48px; min-height: 8px; border-radius: 6px 6px 0 0; transition: height .4s; }
.bar-label { font-size: 11px; color: #64748b; font-weight: 800; }
.chart-meta { display: grid; gap: 10px; align-content: start; }
.meta-card { border: 1px solid #e7edf4; border-radius: 7px; padding: 10px 12px; background: #f8fbfe; display: flex; justify-content: space-between; align-items: center; }
.meta-card span { color: #64748b; font-size: 12px; font-weight: 800; }
.meta-card strong { font-size: 15px; color: #1e6fd9; }
.meta-card strong.ok { color: #11734d; }
.meta-card strong.warn { color: #8a5a00; }
.meta-card strong.danger { color: #b4232d; }

.download-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.download-list li { display: flex; align-items: center; justify-content: space-between; border: 1px solid #e7edf4; border-radius: 7px; padding: 10px 12px; background: #f8fbfe; }
.dl-info { display: flex; gap: 12px; align-items: center; }
.dl-info strong { color: #172033; }
.dl-info span { color: #64748b; font-size: 12px; }
.download-list small { color: #64748b; font-size: 12px; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .search-bar { grid-template-columns: 1fr; }
  .trend-chart { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
