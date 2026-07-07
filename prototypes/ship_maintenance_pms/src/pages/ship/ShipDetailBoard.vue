<template>
  <section class="page-screen ship-detail-board">
    <header class="page-header">
      <div class="header-text">
        <span class="module-label">船舶监控调度 / 单船看板</span>
        <h1>船舶详情看板</h1>
        <p>聚焦单船当前航次进度、工单执行情况、航前健康校验结果与船员证书预警，并提供问题处置入口。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" class="primary" @click="openConfirm('导出看板')">导出看板</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>船舶详情数据获取异常，请检查同步链路后重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else-if="detail">
      <!-- 顶部航次进度 -->
      <section class="panel voyage-panel">
        <div class="panel-title">
          <h2>当前航次进度</h2>
          <span>{{ detail.currentVoyage.voyageNo }}</span>
        </div>
        <div class="voyage-route">
          <div class="route-node start">
            <span class="node-dot"></span>
            <div class="node-info">
              <small>出发港</small>
              <strong>{{ detail.currentVoyage.departure }}</strong>
              <span>{{ detail.currentVoyage.departTime }}</span>
            </div>
          </div>
          <div class="route-bar">
            <div class="route-track">
              <div class="route-fill" :style="{ width: detail.currentVoyage.progress + '%' }"></div>
            </div>
            <div class="route-meta">
              <span>货物：{{ detail.currentVoyage.cargoType }}</span>
              <b>{{ detail.currentVoyage.progress }}%</b>
              <span>预计到达：{{ detail.currentVoyage.eta }}</span>
            </div>
          </div>
          <div class="route-node end">
            <span class="node-dot"></span>
            <div class="node-info">
              <small>目的港</small>
              <strong>{{ detail.currentVoyage.destination }}</strong>
              <span>{{ detail.currentVoyage.eta }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="board-grid">
        <!-- 工单进度 -->
        <article class="panel work-panel">
          <div class="panel-title"><h2>工单执行进度</h2><span>{{ detail.workOrderProgress.total }} 单</span></div>
          <div class="work-ring">
            <svg viewBox="0 0 120 120" class="ring-svg">
              <circle cx="60" cy="60" r="50" class="ring-bg" />
              <circle cx="60" cy="60" r="50" class="ring-fg" :stroke-dasharray="ringDash" />
            </svg>
            <div class="ring-center">
              <strong>{{ doneRate }}%</strong>
              <span>完成率</span>
            </div>
          </div>
          <div class="work-bars">
            <div class="bar-row done">
              <span>已完成</span>
              <div class="bar"><i :style="{ width: barWidth(detail.workOrderProgress.done) }"></i></div>
              <b>{{ detail.workOrderProgress.done }}</b>
            </div>
            <div class="bar-row in-progress">
              <span>进行中</span>
              <div class="bar"><i :style="{ width: barWidth(detail.workOrderProgress.inProgress) }"></i></div>
              <b>{{ detail.workOrderProgress.inProgress }}</b>
            </div>
            <div class="bar-row pending">
              <span>待处理</span>
              <div class="bar"><i :style="{ width: barWidth(detail.workOrderProgress.pending) }"></i></div>
              <b>{{ detail.workOrderProgress.pending }}</b>
            </div>
          </div>
        </article>

        <!-- 航前健康结果 -->
        <article class="panel health-panel">
          <div class="panel-title"><h2>航前健康校验结果</h2><StatusBadge :label="detail.healthCheckResult.status" /></div>
          <div class="health-body">
            <div :class="['health-score', healthTone]">
              <strong>{{ detail.healthCheckResult.score }}</strong>
              <span>健康分</span>
            </div>
            <dl class="health-meta">
              <div><dt>校验编号</dt><dd>{{ detail.healthCheckResult.checkId }}</dd></div>
              <div><dt>拦截状态</dt><dd :class="healthTone">{{ detail.healthCheckResult.interceptStatus }}</dd></div>
              <div><dt>问题数</dt><dd>{{ detail.healthCheckResult.issues }}</dd></div>
            </dl>
          </div>
          <div class="health-hint" v-if="detail.healthCheckResult.status === '不通过'">
            健康校验未通过且处于拦截状态，建议在开航前完成问题处置。
          </div>
        </article>
      </section>

      <!-- 船员证书预警 -->
      <section class="panel cert-panel">
        <div class="panel-title">
          <h2>船员证书预警</h2>
          <span>临期 / 过期着色</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>证书编号</th>
              <th>证书名称</th>
              <th>持有人</th>
              <th>到期日期</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cert in detail.certificateAlerts" :key="cert.certId" :class="certTone(cert.status)">
              <td>{{ cert.certId }}</td>
              <td>{{ cert.name }}</td>
              <td>{{ cert.holder }}</td>
              <td>{{ cert.expireDate }}</td>
              <td><StatusBadge :label="cert.status" /></td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- 问题处置入口 -->
      <section class="panel issue-panel">
        <div class="panel-title">
          <h2>问题处置入口</h2>
          <span>{{ detail.recentIssues.length }} 项待处置</span>
        </div>
        <div class="issue-list">
          <div v-for="issue in detail.recentIssues" :key="issue.id" class="issue-row">
            <div class="issue-main">
              <div class="issue-id">{{ issue.id }}</div>
              <div class="issue-title">{{ issue.title }}</div>
              <div class="issue-tags">
                <StatusBadge :label="issue.severity === '高' ? '异常' : '进行中'" />
                <span class="sev-tag" :class="issue.severity === '高' ? 'high' : 'mid'">{{ issue.severity }}风险</span>
                <StatusBadge :label="issue.status" />
              </div>
            </div>
            <button type="button" class="primary" @click="openHandle(issue)">处置</button>
          </div>
        </div>
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
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchVesselDetail, submitAction } from '@/mock/api.js'

const detail = ref(null)
const uiState = ref('loading')
const confirmOpen = ref(false)
const pendingAction = ref('导出看板')
const currentIssue = ref(null)

const doneRate = computed(() => {
  const w = detail.value?.workOrderProgress
  if (!w || !w.total) return 0
  return Math.round((w.done / w.total) * 100)
})

const ringDash = computed(() => {
  const circumference = 2 * Math.PI * 50
  const fill = (doneRate.value / 100) * circumference
  return `${fill} ${circumference}`
})

const healthTone = computed(() => {
  const s = detail.value?.healthCheckResult?.status
  if (s === '不通过') return 'danger'
  if (s === '通过') return 'ok'
  return 'warn'
})

const confirmMessage = computed(() => {
  if (currentIssue.value) {
    return `将对问题 ${currentIssue.value.id}（${currentIssue.value.title}）执行“${pendingAction.value}”，并写入审计日志。`
  }
  return `将对 ${detail.value?.name || '当前船舶'} 执行“${pendingAction.value}”，并写入审计日志。`
})

function barWidth(val) {
  const total = detail.value?.workOrderProgress.total || 1
  return `${Math.round((val / total) * 100)}%`
}

function certTone(status) {
  if (status === '过期') return 'row-danger'
  if (status === '临期') return 'row-warn'
  return ''
}

function openHandle(issue) {
  currentIssue.value = issue
  pendingAction.value = '启动处置'
  confirmOpen.value = true
}

function openConfirm(action) {
  currentIssue.value = null
  pendingAction.value = action
  confirmOpen.value = true
}

async function confirmAction() {
  await submitAction(pendingAction.value, currentIssue.value || detail.value)
  if (currentIssue.value) currentIssue.value.status = '处置中'
  confirmOpen.value = false
}

async function reload() {
  uiState.value = 'loading'
  try {
    detail.value = await fetchVesselDetail()
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

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

/* voyage */
.voyage-route { display: grid; grid-template-columns: 200px minmax(0, 1fr) 200px; gap: 18px; align-items: center; }
.route-node { display: flex; align-items: center; gap: 12px; }
.route-node.end { justify-content: flex-end; text-align: right; flex-direction: row-reverse; }
.node-dot { width: 14px; height: 14px; border-radius: 50%; background: #1e6fd9; box-shadow: 0 0 0 4px rgba(30,111,217,.18); flex-shrink: 0; }
.route-node.end .node-dot { background: #11734d; box-shadow: 0 0 0 4px rgba(17,115,77,.18); }
.node-info { display: grid; gap: 2px; }
.node-info small { color: #64748b; font-size: 11px; font-weight: 800; }
.node-info strong { font-size: 16px; color: #172033; }
.node-info span { color: #64748b; font-size: 12px; }
.route-bar { display: grid; gap: 8px; }
.route-track { height: 8px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.route-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #1e6fd9, #11734d); transition: width .4s; }
.route-meta { display: flex; justify-content: space-between; align-items: center; color: #64748b; font-size: 12px; font-weight: 800; }
.route-meta b { color: #1e6fd9; font-size: 16px; }

/* board grid */
.board-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; align-items: start; }
.work-ring { position: relative; width: 160px; height: 160px; margin: 0 auto 16px; }
.ring-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: #e7edf4; stroke-width: 12; }
.ring-fg { fill: none; stroke: #1e6fd9; stroke-width: 12; stroke-linecap: round; transition: stroke-dasharray .5s; }
.ring-center { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; }
.ring-center strong { color: #1e6fd9; font-size: 30px; line-height: 1; }
.ring-center span { color: #64748b; font-size: 12px; font-weight: 800; margin-top: 4px; }
.work-bars { display: grid; gap: 10px; }
.bar-row { display: grid; grid-template-columns: 64px minmax(0,1fr) 32px; gap: 10px; align-items: center; font-size: 13px; }
.bar-row span { color: #64748b; font-weight: 800; }
.bar-row b { text-align: right; color: #172033; }
.bar { height: 8px; border-radius: 999px; background: #eef3f8; overflow: hidden; }
.bar i { display: block; height: 100%; border-radius: 999px; }
.bar-row.done .bar i { background: #11734d; }
.bar-row.in-progress .bar i { background: #1e6fd9; }
.bar-row.pending .bar i { background: #d97706; }

/* health */
.health-body { display: grid; grid-template-columns: 160px minmax(0,1fr); gap: 18px; align-items: center; }
.health-score { width: 160px; height: 160px; border-radius: 50%; display: grid; place-content: center; justify-items: center; border: 14px solid; background: #f8fbfe; }
.health-score.ok { border-color: #dff6e8; }
.health-score.warn { border-color: #fff2cc; }
.health-score.danger { border-color: #ffe1e3; }
.health-score strong { font-size: 44px; line-height: 1; }
.health-score.ok strong { color: #11734d; }
.health-score.warn strong { color: #8a5a00; }
.health-score.danger strong { color: #b4232d; }
.health-score span { color: #64748b; font-size: 12px; font-weight: 800; margin-top: 6px; }
.health-meta { display: grid; gap: 10px; margin: 0; }
.health-meta div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid #e7edf4; padding-bottom: 8px; }
.health-meta dt { color: #64748b; }
.health-meta dd { margin: 0; font-weight: 900; }
.health-meta dd.danger { color: #b4232d; }
.health-meta dd.ok { color: #11734d; }
.health-hint { margin-top: 12px; padding: 10px 12px; border-radius: 7px; background: #ffe1e3; color: #b4232d; font-size: 13px; font-weight: 800; }

/* cert table */
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 12px 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; }
tr.row-warn td { background: #fffdf2; }
tr.row-danger td { background: #fff5f5; }

/* issue */
.issue-list { display: grid; gap: 10px; }
.issue-row { display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 12px; align-items: center; border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px 14px; background: #f8fbfe; }
.issue-main { display: grid; gap: 6px; }
.issue-id { color: #64748b; font-size: 12px; font-weight: 800; }
.issue-title { font-size: 15px; font-weight: 900; color: #172033; }
.issue-tags { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.sev-tag { padding: 2px 8px; border-radius: 999px; font-size: 12px; font-weight: 900; }
.sev-tag.high { color: #b4232d; background: #ffe1e3; }
.sev-tag.mid { color: #8a5a00; background: #fff2cc; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .board-grid { grid-template-columns: 1fr; }
  .voyage-route { grid-template-columns: 1fr; text-align: center; }
  .route-node, .route-node.end { justify-content: center; flex-direction: row; text-align: center; }
  .health-body { grid-template-columns: 1fr; justify-items: center; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
