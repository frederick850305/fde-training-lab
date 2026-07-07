<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">航前管理 / 健康看板</span>
        <h1>航前健康看板</h1>
        <p>展示当前船舶健康分数与拦截/放行状态，分类校验矩阵结果，不通过问题清单，并支持导出健康报告。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" class="primary" @click="exportReport">导出报告</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span class="wide"></span><span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无健康检查数据</h2>
      <p>当前没有可显示的航前健康检查结果。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '健康检查数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 顶部健康分数 / 拦截状态 -->
      <section class="score-bar">
        <article class="score-card" :class="scoreTone">
          <div class="score-ring">
            <strong>{{ currentCheck?.score ?? '—' }}</strong>
            <span>健康分</span>
          </div>
          <div class="score-info">
            <strong>{{ currentCheck?.shipName || '—' }}</strong>
            <p>航次 {{ currentCheck?.voyageNo || '—' }} · 检查时间 {{ currentCheck?.checkTime || '—' }}</p>
            <div class="score-status">
              <StatusBadge :label="currentCheck?.status || '—'" />
              <span class="intercept" :class="interceptTone">拦截状态：{{ currentCheck?.interceptStatus || '—' }}</span>
            </div>
            <p class="summary">{{ currentCheck?.summary || '' }}</p>
          </div>
        </article>
        <article class="kpi-mini" v-for="k in miniKpis" :key="k.label" :class="k.tone">
          <strong>{{ k.value }}</strong>
          <span>{{ k.label }}</span>
        </article>
      </section>

      <!-- 分类校验矩阵 -->
      <article class="panel">
        <div class="panel-title">
          <h2>分类校验矩阵</h2>
          <span>{{ matrix.length }} 个检查类别</span>
        </div>
        <div class="matrix-grid">
          <div v-for="item in matrix" :key="item.name" :class="['matrix-cell', item.tone]">
            <div class="cell-head">
              <strong>{{ item.name }}</strong>
              <span class="cell-result">{{ item.result }}</span>
            </div>
            <p class="cell-detail">{{ item.detail }}</p>
            <span class="cell-tag">{{ toneLabel(item.tone) }}</span>
          </div>
        </div>
      </article>

      <!-- 不通过问题清单 -->
      <article class="panel">
        <div class="panel-title">
          <h2>不通过问题清单</h2>
          <span>{{ issues.length }} 项问题</span>
        </div>
        <div v-if="!issues.length" class="empty-inline">当前检查无拦截问题，全部校验项通过。</div>
        <ul v-else class="issue-list">
          <li v-for="issue in issues" :key="issue.issueId" class="issue-item" @click="viewIssue(issue)">
            <div class="issue-left">
              <span class="sev-badge" :class="sevClass(issue.severity)">{{ issue.severity }}</span>
              <div class="issue-main">
                <strong>{{ issue.title }}</strong>
                <p>{{ issue.category }} · {{ issue.relatedObject }}</p>
              </div>
            </div>
            <div class="issue-right">
              <span class="muted">到期 {{ issue.expireDate }}</span>
              <StatusBadge :label="issue.status" />
            </div>
          </li>
        </ul>
      </article>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      title="导出健康报告"
      :message="`确认导出${currentCheck?.shipName || '当前船舶'}的航前健康检查报告？将生成 PDF 并记录下载。`"
      @cancel="confirmOpen = false"
      @confirm="doExport"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchVoyageHealthChecks, fetchVoyageHealthIssues, fetchHealthCheckMatrix, submitAction } from '@/mock/api.js'

const checks = ref([])
const issues = ref([])
const matrix = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const confirmOpen = ref(false)

const currentCheck = computed(() => checks.value.find((c) => c.status === '不通过') || checks.value[0] || null)

const scoreTone = computed(() => {
  const s = currentCheck.value?.score
  if (s == null) return ''
  if (s >= 90) return 'ok'
  if (s >= 75) return 'warn'
  return 'danger'
})

const interceptTone = computed(() => {
  const s = currentCheck.value?.interceptStatus
  if (s === '拦截') return 'danger'
  if (s === '放行') return 'ok'
  return 'pending'
})

const miniKpis = computed(() => [
  { label: '拦截问题', value: issues.value.length, tone: 'danger' },
  { label: '高风险', value: issues.value.filter((i) => i.severity === '高').length, tone: 'danger' },
  { label: '中风险', value: issues.value.filter((i) => i.severity === '中').length, tone: 'warn' },
  { label: '待处置', value: issues.value.filter((i) => i.status === '待处置').length, tone: 'warn' },
])

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [c, i, m] = await Promise.all([
      fetchVoyageHealthChecks(),
      fetchVoyageHealthIssues(),
      fetchHealthCheckMatrix(),
    ])
    checks.value = c
    issues.value = i
    matrix.value = m
    uiState.value = c.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function toneLabel(tone) {
  return { ok: '通过', warn: '预警', danger: '异常' }[tone] || ''
}

function sevClass(sev) {
  if (sev === '高') return 'danger'
  if (sev === '中') return 'warn'
  return 'pending'
}

function viewIssue(issue) {
  // 导航到问题详情（原型内仅提示）
  confirmOpen.value = false
}

function exportReport() {
  confirmOpen.value = true
}

async function doExport() {
  try {
    await submitAction('导出健康报告', { checkId: currentCheck.value?.checkId })
    confirmOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
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
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }

.state-panel { min-height: 240px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(4, 1fr); padding: 24px; }
.skeleton span { height: 120px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.skeleton .wide { grid-column: 1 / -1; height: 160px; }

.score-bar { display: grid; grid-template-columns: minmax(0, 2fr) repeat(4, minmax(0, 1fr)); gap: 12px; align-items: stretch; }
.score-card { display: flex; gap: 20px; align-items: center; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; border-left: 4px solid #1e6fd9; }
.score-card.ok { border-left-color: #11734d; }
.score-card.warn { border-left-color: #b8860b; }
.score-card.danger { border-left-color: #b4232d; }
.score-ring { width: 110px; height: 110px; border-radius: 50%; display: grid; place-content: center; justify-items: center; border: 10px solid #e7edf4; background: #f8fbfe; flex-shrink: 0; }
.score-card.ok .score-ring { border-color: #dff6e8; }
.score-card.warn .score-ring { border-color: #fff2cc; }
.score-card.danger .score-ring { border-color: #ffe1e3; }
.score-ring strong { font-size: 36px; color: #172033; }
.score-card.ok .score-ring strong { color: #11734d; }
.score-card.warn .score-ring strong { color: #b8860b; }
.score-card.danger .score-ring strong { color: #b4232d; }
.score-ring span { color: #64748b; font-size: 11px; font-weight: 900; }
.score-info { flex: 1; min-width: 0; }
.score-info strong { font-size: 18px; display: block; margin-bottom: 4px; }
.score-info p { margin: 0 0 8px; font-size: 13px; }
.score-status { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
.intercept { font-size: 13px; font-weight: 900; }
.intercept.ok { color: #11734d; }
.intercept.danger { color: #b4232d; }
.intercept.pending { color: #8a5a00; }
.summary { color: #53657c; font-size: 12px; }

.kpi-mini { border: 1px solid #d9e4ef; border-radius: 8px; padding: 14px; background: #fff; display: grid; align-content: center; gap: 4px; border-left: 4px solid #1e6fd9; }
.kpi-mini.danger { border-left-color: #b4232d; }
.kpi-mini.warn { border-left-color: #b8860b; }
.kpi-mini strong { font-size: 26px; color: #172033; }
.kpi-mini span { color: #64748b; font-size: 11px; font-weight: 800; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.empty-inline { padding: 20px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; }

.matrix-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.matrix-cell { border-radius: 8px; padding: 16px; display: grid; gap: 8px; align-content: space-between; border: 1px solid #d9e4ef; }
.matrix-cell.ok { background: #f0fbf4; border-color: #cfe9d8; }
.matrix-cell.warn { background: #fff9e8; border-color: #f0e3b8; }
.matrix-cell.danger { background: #fff0f1; border-color: #f3c2c6; }
.cell-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.cell-head strong { font-size: 15px; }
.cell-result { font-size: 18px; font-weight: 900; }
.matrix-cell.ok .cell-result { color: #11734d; }
.matrix-cell.warn .cell-result { color: #b8860b; }
.matrix-cell.danger .cell-result { color: #b4232d; }
.cell-detail { margin: 0; color: #53657c; font-size: 12px; line-height: 1.5; }
.cell-tag { justify-self: start; font-size: 11px; font-weight: 900; padding: 2px 8px; border-radius: 999px; background: rgba(255,255,255,.6); }
.matrix-cell.ok .cell-tag { color: #11734d; }
.matrix-cell.warn .cell-tag { color: #b8860b; }
.matrix-cell.danger .cell-tag { color: #b4232d; }

.issue-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.issue-item { display: flex; justify-content: space-between; align-items: center; gap: 12px; border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px 14px; background: #f8fbfe; cursor: pointer; transition: border-color .15s; }
.issue-item:hover { border-color: #1e6fd9; }
.issue-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
.sev-badge { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; flex-shrink: 0; }
.sev-badge.danger { color: #b4232d; background: #ffe1e3; }
.sev-badge.warn { color: #8a5a00; background: #fff2cc; }
.sev-badge.pending { color: #53657c; background: #e7edf4; }
.issue-main { min-width: 0; }
.issue-main strong { display: block; font-size: 14px; }
.issue-main p { margin: 2px 0 0; color: #64748b; font-size: 12px; }
.issue-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.muted { color: #8b9aab; font-size: 12px; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .score-bar { grid-template-columns: 1fr 1fr; }
  .score-card { grid-column: 1 / -1; }
}
@media (max-width: 560px) {
  .score-bar { grid-template-columns: 1fr; }
  .score-card { flex-direction: column; text-align: center; }
  .issue-item { flex-direction: column; align-items: flex-start; }
}
</style>
