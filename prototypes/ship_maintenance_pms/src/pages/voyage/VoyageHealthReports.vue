<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">航前管理 / 检查报告</span>
        <h1>航前健康检查报告</h1>
        <p>检索历史航前健康检查记录，生成检查报告，查看已生成报告下载记录与检查相关操作日志。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" class="primary" :disabled="!selectedCheck" @click="generateReport">生成报告</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span class="wide"></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无检查记录</h2>
      <p>当前没有历史航前健康检查记录。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '检查记录加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 检索区 -->
      <article class="panel">
        <div class="panel-title">
          <h2>历史检查记录检索</h2>
          <span>{{ filteredChecks.length }} 条记录</span>
        </div>
        <FilterBar
          v-model:keyword="filters.keyword"
          v-model:status="filters.status"
          v-model:ship="filters.ship"
          @search="applyFilters"
        />
        <table>
          <thead>
            <tr>
              <th>检查编号</th>
              <th>船舶</th>
              <th>航次</th>
              <th>检查时间</th>
              <th>健康分</th>
              <th>拦截状态</th>
              <th>问题数</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="check in filteredChecks"
              :key="check.checkId"
              :class="{ selected: selectedCheck?.checkId === check.checkId }"
              @click="selectCheck(check)"
            >
              <td>{{ check.checkId }}</td>
              <td>{{ check.shipName }}</td>
              <td>{{ check.voyageNo }}</td>
              <td>{{ check.checkTime || '—' }}</td>
              <td><b :class="scoreClass(check.score)">{{ check.score ?? '—' }}</b></td>
              <td>{{ check.interceptStatus }}</td>
              <td>{{ check.issueCount ?? '—' }}</td>
              <td><StatusBadge :label="check.status" /></td>
            </tr>
          </tbody>
        </table>
      </article>

      <div class="reports-layout">
        <!-- 下载记录 -->
        <article class="panel">
          <div class="panel-title">
            <h2>报告下载记录</h2>
            <span>{{ reports.length }} 份</span>
          </div>
          <div v-if="!reports.length" class="empty-inline">暂无已生成的报告，选择检查记录后点击"生成报告"。</div>
          <ul v-else class="report-list">
            <li v-for="rep in reports" :key="rep.id" class="report-item">
              <div class="report-icon">📄</div>
              <div class="report-meta">
                <strong>{{ rep.name }}</strong>
                <small>{{ rep.checkId }} · {{ rep.shipName }} · 生成于 {{ rep.generatedAt }}</small>
              </div>
              <button type="button" @click="downloadReport(rep)">下载</button>
            </li>
          </ul>
        </article>

        <!-- 日志查看 -->
        <article class="panel">
          <div class="panel-title">
            <h2>检查相关日志</h2>
            <span>{{ logs.length }} 条</span>
          </div>
          <div v-if="!logs.length" class="empty-inline">暂无检查相关日志。</div>
          <ol v-else class="log-list">
            <li v-for="log in logs" :key="log.id" class="log-item">
              <div class="log-head">
                <strong>{{ log.operator }}</strong>
                <span class="log-action">{{ log.action }}</span>
                <small class="muted">{{ log.timestamp }}</small>
              </div>
              <p>{{ log.detail }}</p>
            </li>
          </ol>
        </article>
      </div>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      title="生成检查报告"
      :message="`确认为${selectedCheck?.shipName || '选中记录'}（${selectedCheck?.checkId}）生成航前健康检查报告？`"
      @cancel="confirmOpen = false"
      @confirm="doGenerate"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import FilterBar from '@/components/FilterBar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchVoyageHealthChecks, fetchOpsAuditLogs, submitAction } from '@/mock/api.js'

const checks = ref([])
const logs = ref([])
const reports = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const selectedCheck = ref(null)
const filters = reactive({ keyword: '', status: '', ship: '' })

const confirmOpen = ref(false)

const filteredChecks = computed(() =>
  checks.value.filter((c) => {
    const kw = !filters.keyword || `${c.checkId}${c.shipName}${c.voyageNo}`.includes(filters.keyword)
    const st = !filters.status || c.status === filters.status
    const sh = !filters.ship || c.shipName === filters.ship
    return kw && st && sh
  }),
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [c, l] = await Promise.all([fetchVoyageHealthChecks(), fetchOpsAuditLogs()])
    checks.value = c
    logs.value = l.filter((log) => /检查|工单|航前|健康/.test(log.detail) || /检查|航前/.test(log.action))
    selectedCheck.value = c[0] || null
    uiState.value = c.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function selectCheck(check) {
  selectedCheck.value = check
}

function applyFilters() {
  selectedCheck.value = filteredChecks.value[0] || null
}

function scoreClass(score) {
  if (score == null) return ''
  if (score >= 90) return 'ok'
  if (score >= 75) return 'warn'
  return 'danger'
}

function generateReport() {
  if (!selectedCheck.value) return
  confirmOpen.value = true
}

async function doGenerate() {
  try {
    await submitAction('生成检查报告', { checkId: selectedCheck.value?.checkId })
    reports.value.unshift({
      id: 'RPT-' + Date.now(),
      name: `${selectedCheck.value.shipName} 航前健康检查报告`,
      checkId: selectedCheck.value.checkId,
      shipName: selectedCheck.value.shipName,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    })
    confirmOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
}

function downloadReport(rep) {
  // 原型：模拟下载
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button:disabled { opacity: .5; cursor: not-allowed; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }

.state-panel { min-height: 240px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: 1fr 1fr; padding: 24px; }
.skeleton span { height: 180px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.skeleton .wide { grid-column: 1 / -1; height: 120px; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

table { width: 100%; border-collapse: collapse; font-size: 13px; margin-top: 12px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; font-weight: 900; }
tr { cursor: pointer; }
tr.selected td { background: #edf5ff; }
tr:hover td { background: #f8fbfe; }
td b.ok { color: #11734d; }
td b.warn { color: #b8860b; }
td b.danger { color: #b4232d; }

.reports-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }

.empty-inline { padding: 18px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; }

.report-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.report-item { display: flex; align-items: center; gap: 12px; border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px 14px; background: #f8fbfe; }
.report-icon { font-size: 22px; }
.report-meta { flex: 1; min-width: 0; }
.report-meta strong { display: block; font-size: 13px; }
.report-meta small { color: #8b9aab; font-size: 11px; }

.log-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.log-item { border-left: 3px solid #1e6fd9; padding-left: 12px; }
.log-head { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 4px; }
.log-head strong { font-size: 13px; }
.log-action { color: #1e6fd9; font-size: 12px; font-weight: 900; background: #e3efff; padding: 2px 8px; border-radius: 999px; }
.log-head .muted { font-size: 11px; }
.log-item p { margin: 0; color: #53657c; font-size: 12px; }
.muted { color: #8b9aab; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .reports-layout { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
