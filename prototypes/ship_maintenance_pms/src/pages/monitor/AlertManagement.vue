<template>
  <section class="alert-management">
    <header class="page-header">
      <div>
<div class="header-text">
            <span class="module-label">系统监控审计 / P0</span>
            <h1>告警管理</h1>
          </div>
<p>集中管理所有系统异常告警，支持按级别分级响应、处置记录填写、关闭与升级操作，确保告警闭环可追溯。</p>
</div>
      </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>告警数据加载失败</h2>
      <p>请检查网络连接或系统同步状态后重试。</p>
      <button type="button" @click="loadData">重试</button>
    </div>

    <div v-else-if="!alerts.length" class="state-panel empty">
      <h2>暂无告警记录</h2>
      <p>当前筛选条件下没有匹配的告警数据。</p>
    </div>

    <template v-else>
      <section class="panel severity-tabs-panel">
        <div class="severity-tabs">
          <button
            v-for="tab in severityTabs"
            :key="tab.value"
            type="button"
            :class="['severity-tab', { active: activeSeverity === tab.value, [tab.tone]: tab.value !== 'all' }]"
            @click="activeSeverity = tab.value"
          >
            <span>{{ tab.label }}</span>
            <em>{{ countBySeverity(tab.value) }}</em>
          </button>
        </div>
      </section>

      <section class="alert-layout">
        <article class="panel alert-list-panel">
          <div class="panel-title">
            <h2>告警列表</h2>
            <span>{{ filteredAlerts.length }} 条 · 已选 {{ selectedAlert ? 1 : 0 }}</span>
          </div>
          <div class="alert-table-wrap">
            <table class="alert-table">
              <thead>
                <tr>
                  <th>级别</th>
                  <th>类型</th>
                  <th>消息</th>
                  <th>发生时间</th>
                  <th>状态</th>
                  <th>处理人</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="a in filteredAlerts"
                  :key="a.alertId"
                  :class="{ selected: selectedAlert?.alertId === a.alertId }"
                  @click="selectAlert(a)"
                >
                  <td>
                    <span :class="['severity-badge', severityClass(a.severity)]">{{ a.severity }}</span>
                  </td>
                  <td>{{ a.type }}</td>
                  <td class="message-cell" :title="a.message">{{ a.message }}</td>
                  <td class="time-cell">{{ a.occurTime }}</td>
                  <td><StatusBadge :label="a.status" /></td>
                  <td>{{ a.handler || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <aside class="panel handle-panel">
          <div class="panel-title">
            <h2>处置记录</h2>
            <span v-if="selectedAlert">{{ selectedAlert.alertId }}</span>
          </div>
          <template v-if="selectedAlert">
            <div class="alert-detail">
              <div class="detail-row"><label>告警编号</label><span>{{ selectedAlert.alertId }}</span></div>
              <div class="detail-row"><label>级别</label><span :class="severityClass(selectedAlert.severity)">{{ selectedAlert.severity }}</span></div>
              <div class="detail-row"><label>类型</label><span>{{ selectedAlert.type }}</span></div>
              <div class="detail-row"><label>发生时间</label><span>{{ selectedAlert.occurTime }}</span></div>
              <div class="detail-row"><label>当前状态</label><StatusBadge :label="selectedAlert.status" /></div>
              <div class="detail-row"><label>处理人</label><span>{{ selectedAlert.handler || '未指派' }}</span></div>
              <div class="detail-row full">
                <label>告警内容</label>
                <p>{{ selectedAlert.message }}</p>
              </div>
              <div class="detail-row full" v-if="selectedAlert.resolveNote">
                <label>已记录处置</label>
                <p class="existing-note">{{ selectedAlert.resolveNote }}</p>
              </div>
            </div>

            <div class="handle-form">
              <label class="form-label">处理意见</label>
              <textarea v-model="handleNote" rows="4" placeholder="填写处置说明、根因分析或后续措施"></textarea>
              <div class="action-row">
                <button type="button" class="primary" @click="openConfirm('提交处置')">提交处置</button>
                <button type="button" @click="openConfirm('关闭告警')">关闭告警</button>
                <button type="button" class="warn" @click="openConfirm('升级级别')">升级级别</button>
              </div>
            </div>
          </template>
          <div v-else class="no-selection">
            <p>请从左侧列表选择一条告警进行处置</p>
          </div>
        </aside>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="`${pendingAction}确认`"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="executeAction"
    />

    
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchAlerts, submitAction } from '@/mock/api.js'

const alerts = ref([])
const uiState = ref('loading')
const activeSeverity = ref('all')
const selectedAlert = ref(null)
const handleNote = ref('')
const confirmOpen = ref(false)
const pendingAction = ref('')
const severityTabs = [
  { label: '全部', value: 'all', tone: '' },
  { label: '紧急', value: '紧急', tone: 'critical' },
  { label: '主要', value: '主要', tone: 'major' },
  { label: '次要', value: '次要', tone: 'minor' },
  { label: '提示', value: '提示', tone: 'info' },
]

const filteredAlerts = computed(() =>
  activeSeverity.value === 'all'
    ? alerts.value
    : alerts.value.filter(a => a.severity === activeSeverity.value),
)

function countBySeverity(value) {
  if (value === 'all') return alerts.value.length
  return alerts.value.filter(a => a.severity === value).length
}

function severityClass(severity) {
  return {
    '紧急': 'critical',
    '主要': 'major',
    '次要': 'minor',
    '提示': 'info',
  }[severity] || 'info'
}

function selectAlert(alert) {
  selectedAlert.value = alert
  handleNote.value = alert.resolveNote || ''
}

const confirmMessage = computed(() => {
  if (!selectedAlert.value) return ''
  return `将对告警 ${selectedAlert.value.alertId} 执行“${pendingAction.value}”操作，操作将记录至审计日志。`
})

function openConfirm(action) {
  if (!selectedAlert.value) return
  pendingAction.value = action
  confirmOpen.value = true
}

async function executeAction() {
  const alert = selectedAlert.value
  if (!alert) return
  await submitAction('alertHandle', { id: alert.alertId, action: pendingAction.value, note: handleNote.value })
  if (pendingAction.value === '提交处置') {
    alert.status = '处置中'
    alert.handler = '系统管理员'
    alert.resolveNote = handleNote.value
  } else if (pendingAction.value === '关闭告警') {
    alert.status = '已闭环'
    alert.resolveNote = handleNote.value || alert.resolveNote
    if (!alert.handler) alert.handler = '系统管理员'
  } else if (pendingAction.value === '升级级别') {
    const order = ['提示', '次要', '主要', '紧急']
    const idx = order.indexOf(alert.severity)
    if (idx < order.length - 1) alert.severity = order[idx + 1]
    alert.status = '处置中'
  }
  confirmOpen.value = false
}

async function loadData() {
  uiState.value = 'loading'
  try {
    alerts.value = await fetchAlerts()
    uiState.value = alerts.value.length ? 'success' : 'empty'
    selectedAlert.value = alerts.value[0] || null
    handleNote.value = selectedAlert.value?.resolveNote || ''
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(loadData)
</script>

<style scoped>
.alert-management { display: grid; gap: 16px; position: relative; }

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
button:disabled { opacity: 0.5; cursor: not-allowed; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button.primary:hover { background: #1a5fc0; }
button.warn { color: #fff; border-color: #d4743f; background: #d4743f; }
button.warn:hover { background: #b85f2e; }
button.danger { color: #fff; border-color: #b4232d; background: #b4232d; }
button.danger:hover { background: #9a1e26; }

.action-hint { margin: 0; color: #8b9aab; font-size: 12px; }

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

.severity-tabs { display: flex; gap: 10px; flex-wrap: wrap; }
.severity-tab {
  display: flex; align-items: center; gap: 8px; padding: 9px 16px;
  border: 1px solid #cfdae6; border-radius: 8px; background: #f6f9fc;
  color: #24415f; font-weight: 800; cursor: pointer; transition: all 0.15s;
}
.severity-tab em { font-style: normal; font-size: 12px; padding: 2px 7px; border-radius: 999px; background: #e7edf4; color: #64748b; }
.severity-tab.active { border-color: #1e6fd9; background: #edf5ff; color: #1e6fd9; }
.severity-tab.active em { background: #1e6fd9; color: #fff; }
.severity-tab.critical.active { border-color: #b4232d; background: #ffe1e3; color: #b4232d; }
.severity-tab.critical.active em { background: #b4232d; color: #fff; }
.severity-tab.major.active { border-color: #d4743f; background: #fff3e6; color: #d4743f; }
.severity-tab.major.active em { background: #d4743f; color: #fff; }
.severity-tab.minor.active { border-color: #8a6500; background: #fff8d8; color: #8a6500; }
.severity-tab.minor.active em { background: #8a6500; color: #fff; }
.severity-tab.info.active { border-color: #1e6fd9; background: #e3efff; color: #1e6fd9; }
.severity-tab.info.active em { background: #1e6fd9; color: #fff; }

.alert-layout { display: grid; grid-template-columns: minmax(0, 1fr) 400px; gap: 16px; align-items: start; }
.alert-table-wrap { overflow-x: auto; }
.alert-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 720px; }
.alert-table th, .alert-table td { padding: 12px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
.alert-table th { color: #63748a; background: #f7fafc; font-weight: 800; }
.alert-table tr { cursor: pointer; transition: background 0.12s; }
.alert-table tr:hover { background: #f8fbfe; }
.alert-table tr.selected { background: #edf5ff; }
.message-cell { max-width: 240px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #172033; }
.time-cell { color: #64748b; white-space: nowrap; }
.severity-badge { display: inline-flex; min-width: 48px; justify-content: center; border-radius: 999px; padding: 3px 8px; font-size: 11px; font-weight: 900; }
.severity-badge.critical { color: #b4232d; background: #ffe1e3; }
.severity-badge.major { color: #d4743f; background: #fff3e6; }
.severity-badge.minor { color: #8a6500; background: #fff8d8; }
.severity-badge.info { color: #1e6fd9; background: #e3efff; }

.handle-panel { position: sticky; top: 0; }
.alert-detail { display: grid; gap: 10px; margin-bottom: 16px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-bottom: 1px solid #e7edf4; padding-bottom: 8px; }
.detail-row.full { flex-direction: column; align-items: flex-start; gap: 6px; }
.detail-row label { color: #64748b; font-size: 12px; font-weight: 800; }
.detail-row span, .detail-row p { font-size: 13px; color: #172033; font-weight: 700; }
.detail-row.full p { font-weight: 400; line-height: 1.55; margin: 0; }
.existing-note { background: #f8fbfe; padding: 8px 10px; border-radius: 6px; border-left: 3px solid #1e6fd9; }

.handle-form { display: grid; gap: 10px; }
.form-label { color: #53657c; font-size: 12px; font-weight: 900; }
textarea { width: 100%; border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; resize: vertical; font-family: inherit; font-size: 13px; }
.action-row { display: flex; gap: 9px; flex-wrap: wrap; margin-top: 6px; }
.no-selection { padding: 40px 20px; text-align: center; color: #64748b; }
.no-selection p { margin: 0; }

@media (max-width: 980px) {
  .alert-layout { grid-template-columns: 1fr; }
  .handle-panel { position: static; }
}
@media (max-width: 720px) {
  .page-header { flex-direction: column; }
  .severity-tabs { flex-direction: column; }
}
</style>
