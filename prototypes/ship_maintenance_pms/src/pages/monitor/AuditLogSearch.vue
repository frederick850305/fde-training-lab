<template>
  <section class="audit-log-search">
    <header class="page-header">
      <div class="header-text">
        <span class="module-label">系统监控审计 / P0</span>
        <h1>操作日志检索</h1>
        <p>支持按操作人关键词、操作类型、时间范围与合规状态多维检索用户操作日志，辅助合规审计与违规排查。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="openExportConfirm">导出日志</button>
        <button type="button" @click="loadData">刷新</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>日志加载失败</h2>
      <p>操作日志数据获取异常，请检查网络后重试。</p>
      <button type="button" @click="loadData">重试</button>
    </div>

    <div v-else-if="!allLogs.length" class="state-panel empty">
      <h2>暂无操作日志</h2>
      <p>当前没有可检索的操作日志记录。</p>
    </div>

    <template v-else>
      <section class="panel filter-panel">
        <div class="panel-title">
          <h2>多维日志检索</h2>
          <span>命中 {{ filteredLogs.length }} / {{ allLogs.length }} 条</span>
        </div>
        <form class="filter-form" @submit.prevent>
          <label class="field">
            <span>操作人关键词</span>
            <input v-model="filters.keyword" placeholder="输入操作人姓名或账号" />
          </label>
          <label class="field">
            <span>操作类型</span>
            <select v-model="filters.operationType">
              <option value="">全部类型</option>
              <option v-for="t in operationTypes" :key="t">{{ t }}</option>
            </select>
          </label>
          <label class="field">
            <span>开始时间</span>
            <input v-model="filters.startTime" type="datetime-local" />
          </label>
          <label class="field">
            <span>结束时间</span>
            <input v-model="filters.endTime" type="datetime-local" />
          </label>
          <label class="field">
            <span>合规状态</span>
            <select v-model="filters.compliant">
              <option value="">全部</option>
              <option value="true">合规</option>
              <option value="false">违规</option>
            </select>
          </label>
          <div class="filter-actions">
            <button type="button" class="primary" @click="applyFilters">查询</button>
            <button type="button" @click="resetFilters">重置</button>
          </div>
        </form>
      </section>

      <section class="panel logs-panel">
        <div class="panel-title">
          <h2>操作详情</h2>
          <span>违规标记：{{ violationCount }} 条</span>
        </div>
        <div class="logs-table-wrap">
          <table class="logs-table">
            <thead>
              <tr>
                <th>编号</th>
                <th>操作人</th>
                <th>类型</th>
                <th>对象</th>
                <th>详情</th>
                <th>时间</th>
                <th>IP</th>
                <th>合规</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="log in filteredLogs" :key="log.id" :class="{ violation: !log.compliant }">
                <td class="id-cell">{{ log.id }}</td>
                <td><strong>{{ log.operator }}</strong></td>
                <td>{{ log.operationType }}</td>
                <td>{{ log.objectType }}</td>
                <td class="detail-cell" :title="log.detail">{{ log.detail }}</td>
                <td class="time-cell">{{ log.timestamp }}</td>
                <td class="ip-cell">{{ log.ip }}</td>
                <td>
                  <span :class="['compliance-tag', log.compliant ? 'ok' : 'danger']">
                    {{ log.compliant ? '合规' : '违规' }}
                  </span>
                </td>
                <td>
                  <button v-if="!log.compliant" type="button" class="mark-btn" @click.stop="markCompliant(log)">标记合规</button>
                  <span v-else class="compliance-tag ok muted">已标记</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!filteredLogs.length" class="no-result">
          <p>未命中任何日志，请调整筛选条件后重试。</p>
        </div>
      </section>
    </template>

    <ConfirmationDialog
      :open="exportConfirmOpen"
      title="导出日志确认"
      :message="`将导出当前筛选结果共 ${filteredLogs.length} 条操作日志为 CSV 文件，导出操作将记入审计日志。`"
      @cancel="exportConfirmOpen = false"
      @confirm="executeExport"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchOperationLogs, submitAction } from '@/mock/api.js'

const allLogs = ref([])
const uiState = ref('loading')
const exportConfirmOpen = ref(false)

const filters = reactive({
  keyword: '',
  operationType: '',
  startTime: '',
  endTime: '',
  compliant: '',
})

const operationTypes = computed(() =>
  [...new Set(allLogs.value.map(l => l.operationType))].sort(),
)

const filteredLogs = computed(() => allLogs.value.filter(log => {
  if (filters.keyword && !log.operator.includes(filters.keyword) && !log.detail.includes(filters.keyword)) return false
  if (filters.operationType && log.operationType !== filters.operationType) return false
  if (filters.compliant !== '' && Boolean(log.compliant) !== (filters.compliant === 'true')) return false
  if (filters.startTime || filters.endTime) {
    const ts = log.timestamp.replace(/-/g, '/').replace(' ', 'T')
    const logTime = new Date(ts).getTime()
    if (filters.startTime) {
      const start = new Date(filters.startTime).getTime()
      if (!isNaN(start) && logTime < start) return false
    }
    if (filters.endTime) {
      const end = new Date(filters.endTime).getTime()
      if (!isNaN(end) && logTime > end) return false
    }
  }
  return true
}))

const violationCount = computed(() => filteredLogs.value.filter(l => !l.compliant).length)

function applyFilters() { /* computed auto-updates, placeholder for explicit search trigger */ }

function resetFilters() {
  filters.keyword = ''
  filters.operationType = ''
  filters.startTime = ''
  filters.endTime = ''
  filters.compliant = ''
}

async function markCompliant(log) {
  await submitAction('markCompliant', { id: log.id })
  log.compliant = true
}

function openExportConfirm() {
  exportConfirmOpen.value = true
}

async function executeExport() {
  await submitAction('exportLogs', { count: filteredLogs.value.length })
  exportConfirmOpen.value = false
}

async function loadData() {
  uiState.value = 'loading'
  try {
    allLogs.value = await fetchOperationLogs()
    uiState.value = allLogs.value.length ? 'success' : 'empty'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(loadData)
</script>

<style scoped>
.audit-log-search { display: grid; gap: 16px; }

.page-header {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 18px;
  border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff;
}
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-header h1 { margin: 6px 0 8px; font-size: 24px; color: #172033; }
.page-header p { max-width: 920px; margin: 0; color: #64748b; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; }
button {
  border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px;
  color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer;
}
button:hover { background: #eef3f8; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button.primary:hover { background: #1a5fc0; }
.mark-btn { padding: 4px 10px; font-size: 12px; color: #b4232d; border-color: #f5b8bc; background: #fff; }
.mark-btn:hover { background: #ffe1e3; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.state-panel.empty h2 { color: #64748b; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.panel-title h2 { margin: 0; font-size: 16px; color: #172033; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.filter-form { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)) auto; gap: 14px; align-items: end; }
.field { display: grid; gap: 6px; }
.field span { color: #53657c; font-size: 12px; font-weight: 900; }
.field input, .field select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; color: #172033; background: #fff; font-size: 13px; }
.filter-actions { display: flex; gap: 8px; }

.logs-table-wrap { overflow-x: auto; }
.logs-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 920px; }
.logs-table th, .logs-table td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
.logs-table th { color: #63748a; background: #f7fafc; font-weight: 800; }
.logs-table tr.violation { background: #fff5f5; }
.logs-table tr.violation td { color: #b4232d; }
.logs-table tr.violation strong { color: #b4232d; }
.id-cell { color: #64748b; font-size: 12px; white-space: nowrap; }
.detail-cell { max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.time-cell, .ip-cell { color: #64748b; white-space: nowrap; font-size: 12px; }
.compliance-tag { display: inline-flex; min-width: 44px; justify-content: center; border-radius: 999px; padding: 3px 8px; font-size: 11px; font-weight: 900; }
.compliance-tag.ok { color: #11734d; background: #dff6e8; }
.compliance-tag.danger { color: #b4232d; background: #ffe1e3; }
.compliance-tag.muted { opacity: 0.6; }

.no-result { padding: 36px; text-align: center; color: #64748b; }

@media (max-width: 980px) {
  .filter-form { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 720px) {
  .page-header { flex-direction: column; }
  .filter-form { grid-template-columns: 1fr; }
}
</style>
