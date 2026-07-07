<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">系统管理 / 审计日志</span>
        <h1>配置变更审计日志</h1>
        <p>查看系统配置变更（用户/角色/流程）的完整审计记录，支持按操作类型、对象类型检索，点击行展开 before/after 差异，可导出日志报表。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" @click="exportLogs" :disabled="!logs.length">导出日志</button>
      </div>
    </header>

    <!-- 加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <!-- 空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无审计日志</h2>
      <p>当前筛选条件下没有配置变更记录。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>审计日志加载失败</h2>
      <p>{{ errorMsg || '请检查审计服务状态后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="kpi-grid">
        <article class="kpi-card active"><strong>{{ logs.length }}</strong><span>日志总数</span></article>
        <article class="kpi-card warn"><strong>{{ todayCount }}</strong><span>今日变更</span></article>
        <article class="kpi-card ok"><strong>{{ typeStats.size }}</strong><span>操作类型</span></article>
        <article class="kpi-card"><strong>{{ operatorStats.size }}</strong><span>操作人</span></article>
      </section>

      <section class="panel filter-panel">
        <div class="filter-row">
          <label>
            <span>关键词</span>
            <input v-model="keyword" placeholder="操作人 / 详情 / 编号" />
          </label>
          <label>
            <span>操作类型</span>
            <select v-model="opTypeFilter">
              <option value="">全部类型</option>
              <option v-for="t in typeStats" :key="t">{{ t }}</option>
            </select>
          </label>
          <label>
            <span>对象类型</span>
            <select v-model="objTypeFilter">
              <option value="">全部对象</option>
              <option v-for="t in objTypeStats" :key="t">{{ t }}</option>
            </select>
          </label>
          <button type="button" class="primary" @click="applyFilter">查询</button>
          <button type="button" @click="resetFilter">重置</button>
        </div>
      </section>

      <section class="panel log-panel">
        <div class="panel-title">
          <h2>审计日志列表</h2>
          <span>{{ filteredLogs.length }} / {{ logs.length }} 条 · 点击行展开差异</span>
        </div>
        <table class="log-table">
          <thead>
            <tr>
              <th>日志编号</th>
              <th>操作人</th>
              <th>操作类型</th>
              <th>对象类型</th>
              <th>变更详情</th>
              <th>时间</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="log in filteredLogs" :key="log.id">
              <tr
                :class="{ selected: expandedId === log.id }"
                @click="toggleExpand(log)"
              >
                <td><strong>{{ log.id }}</strong></td>
                <td>{{ log.operator }}</td>
                <td><span :class="['op-tag', opTone(log.operationType)]">{{ log.operationType }}</span></td>
                <td>{{ log.objectType }}</td>
                <td class="col-detail">{{ log.detail }}</td>
                <td>{{ log.timestamp }}</td>
                <td><span class="expand-icon">{{ expandedId === log.id ? '收起' : '展开' }}</span></td>
              </tr>
              <tr v-if="expandedId === log.id" class="expand-row">
                <td colspan="7">
                  <div class="diff-section">
                    <div class="diff-section-title">
                      <h3>变更差异（{{ log.operationType }} · {{ log.objectType }}）</h3>
                      <span>{{ log.timestamp }} · {{ log.operator }}</span>
                    </div>
                    <DiffView
                      :left="diffLeft(log)"
                      :right="diffRight(log)"
                      left-label="变更前"
                      right-label="变更后"
                      mode="side-by-side"
                      :fields="diffFields(log)"
                    />
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
        <div v-if="!filteredLogs.length" class="empty-inline">没有匹配的审计日志，请调整筛选条件。</div>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmAction"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import DiffView from '@/components/DiffView.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchConfigAuditLogs, submitAction } from '@/mock/api.js'

const logs = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const keyword = ref('')
const opTypeFilter = ref('')
const objTypeFilter = ref('')
const expandedId = ref(null)

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

const typeStats = computed(() => new Set(logs.value.map(l => l.operationType)))
const objTypeStats = computed(() => new Set(logs.value.map(l => l.objectType)))

const todayCount = computed(() => {
  const today = '2026-07-07'
  return logs.value.filter(l => l.timestamp?.startsWith(today)).length
})

const operatorStats = computed(() => new Set(logs.value.map(l => l.operator)))

const filteredLogs = computed(() =>
  logs.value.filter(l => {
    const kw = keyword.value.trim()
    const kwHit = !kw || `${l.id}${l.operator}${l.detail}${l.objectType}`.includes(kw)
    const opHit = !opTypeFilter.value || l.operationType === opTypeFilter.value
    const objHit = !objTypeFilter.value || l.objectType === objTypeFilter.value
    return kwHit && opHit && objHit
  }),
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const data = await fetchConfigAuditLogs()
    logs.value = data
    uiState.value = data.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function toggleExpand(log) {
  expandedId.value = expandedId.value === log.id ? null : log.id
}

function opTone(op) {
  if (/新增|发布|启用/.test(op)) return 'ok'
  if (/禁用|删除|驳回/.test(op)) return 'danger'
  if (/修改|调整/.test(op)) return 'warn'
  return ''
}

function diffLeft(log) {
  return { 变更前: log.before === null ? '（无）' : log.before }
}

function diffRight(log) {
  return { 变更后: log.after === null ? '（无）' : log.after }
}

function diffFields(log) {
  return [
    { key: '变更前', label: '变更前' },
    { key: '变更后', label: '变更后' },
  ]
}

function applyFilter() {
  // 计算属性自动响应，此处可做额外逻辑
}

function resetFilter() {
  keyword.value = ''
  opTypeFilter.value = ''
  objTypeFilter.value = ''
  expandedId.value = null
}

function exportLogs() {
  pendingAction.value = { type: 'export' }
  confirmTitle.value = '导出审计日志'
  confirmMessage.value = `将导出当前 ${filteredLogs.value.length} 条审计日志（含操作人、操作类型、对象类型、详情、变更前后差异）为 Excel 报表。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  try {
    await submitAction('exportAuditLogs', { count: filteredLogs.value.length })
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '导出失败：' + (e?.message || '未知错误')
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .55; cursor: not-allowed; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.kpi-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 15px; background: #fff; }
.kpi-card strong { display: block; color: #1e6fd9; font-size: 26px; }
.kpi-card span { color: #64748b; font-size: 12px; font-weight: 800; }
.kpi-card.ok strong { color: #11734d; }
.kpi-card.warn strong { color: #b8860b; }
.kpi-card.active strong { color: #1e6fd9; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.filter-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr auto auto; gap: 12px; align-items: end; }
.filter-row label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.filter-row input, .filter-row select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; }

.log-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.log-table th, .log-table td { padding: 12px 10px; border-bottom: 1px solid #e7edf4; text-align: left; vertical-align: middle; }
.log-table th { color: #63748a; background: #f7fafc; }
.log-table tbody tr { cursor: pointer; }
.log-table tbody tr:hover td { background: #f8fbfe; }
.log-table tr.selected td { background: #edf5ff; }
.col-detail { color: #53657c; max-width: 320px; }
.op-tag { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 900; background: #eef3f8; color: #53657c; }
.op-tag.ok { background: #dff6e8; color: #11734d; }
.op-tag.danger { background: #ffe1e3; color: #b4232d; }
.op-tag.warn { background: #fff5d8; color: #8a5a00; }
.expand-icon { color: #1e6fd9; font-size: 12px; font-weight: 900; }

.expand-row td { background: #f8fbfe !important; padding: 0 16px 16px !important; }
.diff-section { border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #fff; margin-top: 8px; }
.diff-section-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.diff-section-title h3 { margin: 0; font-size: 14px; }
.diff-section-title span { color: #8b9aab; font-size: 12px; }

.empty-inline { padding: 32px; text-align: center; color: #8b9aab; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .filter-row { grid-template-columns: 1fr; }
  .log-table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
