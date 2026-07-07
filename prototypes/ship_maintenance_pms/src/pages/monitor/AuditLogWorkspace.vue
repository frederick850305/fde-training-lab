<template>
  <section class="audit-workspace">
    <header class="page-header">
      <div>
<div class="header-text">
            <span class="module-label">系统监控审计 / P0</span>
            <h1>审计工作台</h1>
          </div>
<p>审计员一体化工作台：多维筛选定位操作日志与配置变更，查看变更差异、合规标记异常操作，并留下审计行为留痕。</p>
</div>
      </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>审计数据加载失败</h2>
      <p>请检查网络后重试。</p>
      <button type="button" @click="loadData">重试</button>
    </div>

    <div v-else-if="!mergedLogs.length" class="state-panel empty">
      <h2>暂无审计日志</h2>
      <p>当前没有可审计的操作或配置变更记录。</p>
    </div>

    <template v-else>
      <section class="workspace-layout">
        <aside class="panel filter-sidebar">
          <div class="panel-title">
            <h2>日志筛选</h2>
            <span>{{ filteredLogs.length }} 条</span>
          </div>
          <div class="filter-fields">
            <label class="field">
              <span>操作人</span>
              <input v-model="filters.operator" placeholder="姓名/账号" />
            </label>
            <label class="field">
              <span>操作类型</span>
              <select v-model="filters.operationType">
                <option value="">全部</option>
                <option v-for="t in allOperationTypes" :key="t">{{ t }}</option>
              </select>
            </label>
            <label class="field">
              <span>时间范围</span>
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
            <label class="field">
              <span>数据来源</span>
              <select v-model="filters.source">
                <option value="">全部来源</option>
                <option value="operation">操作日志</option>
                <option value="config">配置变更</option>
              </select>
            </label>
            <button type="button" class="reset-btn" @click="resetFilters">重置筛选</button>
          </div>
        </aside>

        <article class="panel log-list-panel">
          <div class="panel-title">
            <h2>合并日志列表</h2>
            <span>违规 {{ violationCount }} 条 · 配置变更 {{ configCount }} 条</span>
          </div>
          <div class="log-table-wrap">
            <table class="log-table">
              <thead>
                <tr>
                  <th>编号</th>
                  <th>来源</th>
                  <th>操作人</th>
                  <th>类型</th>
                  <th>对象</th>
                  <th>时间</th>
                  <th>合规</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="log in filteredLogs"
                  :key="log.id"
                  :class="{ selected: selectedLog?.id === log.id, violation: !log.compliant }"
                  @click="selectLog(log)"
                >
                  <td class="id-cell">{{ log.id }}</td>
                  <td><span :class="['source-tag', log.source]">{{ log.source === 'config' ? '配置' : '操作' }}</span></td>
                  <td><strong>{{ log.operator }}</strong></td>
                  <td>{{ log.operationType }}</td>
                  <td>{{ log.objectType }}</td>
                  <td class="time-cell">{{ log.timestamp }}</td>
                  <td>
                    <span :class="['compliance-tag', log.compliant ? 'ok' : 'danger']">
                      {{ log.compliant ? '合规' : '违规' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <article class="panel detail-panel">
          <div class="panel-title">
            <h2>详情与变更差异</h2>
            <span v-if="selectedLog">{{ selectedLog.id }}</span>
          </div>
          <template v-if="selectedLog">
            <div class="log-detail">
              <div class="detail-row"><label>操作人</label><span>{{ selectedLog.operator }}</span></div>
              <div class="detail-row"><label>操作类型</label><span>{{ selectedLog.operationType }}</span></div>
              <div class="detail-row"><label>对象类型</label><span>{{ selectedLog.objectType }}</span></div>
              <div class="detail-row"><label>时间</label><span>{{ selectedLog.timestamp }}</span></div>
              <div v-if="selectedLog.ip" class="detail-row"><label>IP地址</label><span>{{ selectedLog.ip }}</span></div>
              <div class="detail-row full"><label>操作详情</label><p>{{ selectedLog.detail }}</p></div>
            </div>

            <div v-if="selectedLog.source === 'config' && selectedLog.before !== undefined" class="diff-section">
              <div class="diff-title">变更差异对比</div>
              <DiffView
                :left="diffLeft"
                :right="diffRight"
                :fields="diffFields"
                mode="side-by-side"
              />
            </div>

            <div class="compliance-section">
              <div class="compliance-title">合规标记</div>
              <p class="current-status">当前状态：<span :class="selectedLog.compliant ? 'ok-text' : 'danger-text'">{{ selectedLog.compliant ? '合规' : '违规' }}</span></p>
              <div class="compliance-actions">
                <button type="button" class="primary" @click="markLog(selectedLog, true)">标记合规</button>
                <button type="button" class="danger" @click="markLog(selectedLog, false)">标记违规</button>
                <button type="button" @click="openExportConfirm">导出报告</button>
              </div>
            </div>
          </template>
          <div v-else class="no-selection">
            <p>请从列表中选择一条日志查看详情</p>
          </div>
        </article>
      </section>

      <section class="panel audit-trail-panel">
        <div class="panel-title">
          <h2>审计行为留痕</h2>
          <span>当前审计员操作记录 · {{ auditTrail.length }} 条</span>
        </div>
        <div class="audit-trail-list">
          <div v-for="(trail, idx) in auditTrail" :key="idx" :class="['trail-item', trail.tone]">
            <span class="trail-time">{{ trail.time }}</span>
            <strong>{{ trail.action }}</strong>
            <span class="trail-target">{{ trail.target }}</span>
          </div>
          <div v-if="!auditTrail.length" class="no-trail">
            <p>暂无审计操作记录，对日志进行查看、标记或导出将自动留痕。</p>
          </div>
        </div>
      </section>
    </template>

    <ConfirmationDialog
      :open="exportConfirmOpen"
      title="导出审计报告"
      :message="`将导出当前筛选结果共 ${filteredLogs.length} 条日志为审计报告，导出操作将记入留痕。`"
      @cancel="exportConfirmOpen = false"
      @confirm="executeExport"
    />

    
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import DiffView from '@/components/DiffView.vue'
import { fetchOperationLogs, fetchConfigAuditLogs, submitAction } from '@/mock/api.js'

const operationLogs = ref([])
const configLogs = ref([])
const uiState = ref('loading')
const selectedLog = ref(null)
const exportConfirmOpen = ref(false)
const auditTrail = ref([])
const filters = reactive({
  operator: '',
  operationType: '',
  startTime: '',
  endTime: '',
  compliant: '',
  source: '',
})

const mergedLogs = computed(() => {
  const ops = operationLogs.value.map(l => ({ ...l, source: 'operation', compliant: l.compliant }))
  const configs = configLogs.value.map(l => ({ ...l, source: 'config', compliant: true }))
  return [...ops, ...configs].sort((a, b) => b.timestamp.localeCompare(a.timestamp))
})

const allOperationTypes = computed(() =>
  [...new Set(mergedLogs.value.map(l => l.operationType))].sort(),
)

const filteredLogs = computed(() => mergedLogs.value.filter(log => {
  if (filters.operator && !log.operator.includes(filters.operator)) return false
  if (filters.operationType && log.operationType !== filters.operationType) return false
  if (filters.compliant !== '' && Boolean(log.compliant) !== (filters.compliant === 'true')) return false
  if (filters.source && log.source !== filters.source) return false
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
const configCount = computed(() => filteredLogs.value.filter(l => l.source === 'config').length)

const diffLeft = computed(() => {
  if (!selectedLog.value || selectedLog.value.source !== 'config') return {}
  return { before: selectedLog.value.before ?? '—', field: '配置内容' }
})

const diffRight = computed(() => {
  if (!selectedLog.value || selectedLog.value.source !== 'config') return {}
  return { after: selectedLog.value.after ?? '—', field: '配置内容' }
})

const diffFields = computed(() => [
  { key: 'before', label: '变更前' },
  { key: 'after', label: '变更后' },
])

function selectLog(log) {
  selectedLog.value = log
  addTrail('查看日志', `${log.id} (${log.operator})`, 'info')
}

function resetFilters() {
  filters.operator = ''
  filters.operationType = ''
  filters.startTime = ''
  filters.endTime = ''
  filters.compliant = ''
  filters.source = ''
}

async function markLog(log, compliant) {
  await submitAction('markCompliance', { id: log.id, compliant })
  log.compliant = compliant
  addTrail(compliant ? '标记合规' : '标记违规', `${log.id} (${log.operator})`, compliant ? 'ok' : 'danger')
}

function openExportConfirm() {
  exportConfirmOpen.value = true
}

async function executeExport() {
  await submitAction('exportAuditReport', { count: filteredLogs.value.length })
  exportConfirmOpen.value = false
  addTrail('导出审计报告', `${filteredLogs.value.length} 条日志`, 'info')
}

function addTrail(action, target, tone = 'info') {
  const time = new Date().toISOString().replace('T', ' ').slice(0, 16)
  auditTrail.value = [{ time, action, target, tone }, ...auditTrail.value].slice(0, 20)
}

async function loadData() {
  uiState.value = 'loading'
  try {
    const [ops, configs] = await Promise.all([fetchOperationLogs(), fetchConfigAuditLogs()])
    operationLogs.value = ops
    configLogs.value = configs
    uiState.value = mergedLogs.value.length ? 'success' : 'empty'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(loadData)
</script>

<style scoped>
.audit-workspace { display: grid; gap: 16px; position: relative; }

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
button:disabled { opacity: 0.45; cursor: not-allowed; }
.ok-btn { color: #fff; border-color: #11734d; background: #11734d; }
.danger-btn { color: #fff; border-color: #b4232d; background: #b4232d; }

.action-hint { margin: 0; color: #8b9aab; font-size: 12px; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.state-panel.empty h2 { color: #64748b; }
.skeleton { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 140px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.panel-title h2 { margin: 0; font-size: 16px; color: #172033; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.workspace-layout { display: grid; grid-template-columns: 260px minmax(0, 1fr) 420px; gap: 16px; align-items: start; }

.filter-sidebar { position: sticky; top: 0; }
.filter-fields { display: grid; gap: 12px; }
.field { display: grid; gap: 6px; }
.field span { color: #53657c; font-size: 12px; font-weight: 900; }
.field input, .field select { min-height: 36px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 7px 10px; color: #172033; background: #fff; font-size: 13px; }
.reset-btn { width: 100%; margin-top: 6px; }

.log-list-panel { min-height: 400px; }
.log-table-wrap { overflow-x: auto; max-height: 520px; overflow-y: auto; }
.log-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 720px; }
.log-table th, .log-table td { padding: 10px 8px; border-bottom: 1px solid #e7edf4; text-align: left; }
.log-table th { color: #63748a; background: #f7fafc; font-weight: 800; position: sticky; top: 0; z-index: 1; }
.log-table tr { cursor: pointer; transition: background 0.12s; }
.log-table tr:hover { background: #f8fbfe; }
.log-table tr.selected { background: #edf5ff; }
.log-table tr.violation { background: #fff5f5; }
.log-table tr.violation.selected { background: #ffe8eb; }
.id-cell { color: #64748b; font-size: 11px; white-space: nowrap; }
.time-cell { color: #64748b; white-space: nowrap; font-size: 12px; }
.source-tag { display: inline-flex; min-width: 36px; justify-content: center; border-radius: 4px; padding: 2px 6px; font-size: 11px; font-weight: 900; }
.source-tag.operation { color: #1e6fd9; background: #e3efff; }
.source-tag.config { color: #d4743f; background: #fff3e6; }
.compliance-tag { display: inline-flex; min-width: 44px; justify-content: center; border-radius: 999px; padding: 3px 8px; font-size: 11px; font-weight: 900; }
.compliance-tag.ok { color: #11734d; background: #dff6e8; }
.compliance-tag.danger { color: #b4232d; background: #ffe1e3; }

.detail-panel { position: sticky; top: 0; max-height: 640px; overflow-y: auto; }
.log-detail { display: grid; gap: 8px; margin-bottom: 16px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-bottom: 1px solid #e7edf4; padding-bottom: 7px; }
.detail-row.full { flex-direction: column; align-items: flex-start; gap: 5px; }
.detail-row label { color: #64748b; font-size: 12px; font-weight: 800; }
.detail-row span, .detail-row p { font-size: 13px; color: #172033; font-weight: 700; }
.detail-row.full p { font-weight: 400; line-height: 1.55; margin: 0; }

.diff-section { margin-bottom: 16px; }
.diff-title { font-size: 13px; font-weight: 900; color: #172033; margin-bottom: 8px; padding-left: 8px; border-left: 3px solid #d4743f; }

.compliance-section { border-top: 1px solid #e7edf4; padding-top: 14px; }
.compliance-title { font-size: 13px; font-weight: 900; color: #172033; margin-bottom: 10px; }
.compliance-actions { display: flex; gap: 9px; margin-bottom: 10px; }
.current-status { font-size: 12px; color: #64748b; margin: 0; }
.ok-text { color: #11734d; font-weight: 900; }
.danger-text { color: #b4232d; font-weight: 900; }

.no-selection { padding: 40px 20px; text-align: center; color: #64748b; }

.audit-trail-panel { margin-top: 0; }
.audit-trail-list { display: grid; gap: 8px; max-height: 280px; overflow-y: auto; }
.trail-item { display: grid; grid-template-columns: 150px minmax(0, 1fr) auto; gap: 10px; align-items: center; padding: 10px 12px; border-radius: 6px; border-left: 3px solid #1e6fd9; background: #f8fbfe; font-size: 13px; }
.trail-item.ok { border-left-color: #11734d; }
.trail-item.danger { border-left-color: #b4232d; }
.trail-time { color: #64748b; font-size: 11px; }
.trail-target { color: #64748b; font-size: 12px; }
.no-trail { padding: 24px; text-align: center; color: #64748b; }

@media (max-width: 1200px) {
  .workspace-layout { grid-template-columns: 240px minmax(0, 1fr); }
  .detail-panel { grid-column: 1 / -1; position: static; max-height: none; }
}
@media (max-width: 980px) {
  .workspace-layout { grid-template-columns: 1fr; }
  .filter-sidebar { position: static; }
}
@media (max-width: 720px) {
  .page-header { flex-direction: column; }
  .trail-item { grid-template-columns: 1fr; gap: 4px; }
}
</style>
