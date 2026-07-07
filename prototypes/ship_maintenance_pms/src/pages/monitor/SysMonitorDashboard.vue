<template>
  <section class="monitor-dashboard">
    <header class="page-header">
      <div>
<div class="header-text">
            <span class="module-label">系统监控审计 / P0</span>
            <h1>系统监控看板</h1>
          </div>
<p>集中展示系统整体健康度、关键运行指标、模块运行状态与告警分级摘要，帮助管理员快速掌握系统运行态势并定位异常。</p>
</div>
      </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span class="skeleton-block ring-skeleton"></span>
      <span class="skeleton-block kpi-skeleton"></span>
      <span class="skeleton-block kpi-skeleton"></span>
      <span class="skeleton-block kpi-skeleton"></span>
      <span class="skeleton-block kpi-skeleton"></span>
      <span class="skeleton-block kpi-skeleton"></span>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>监控数据获取异常，请检查网络或同步状态后重试。</p>
      <button type="button" @click="loadData">重试</button>
    </div>

    <div v-else-if="!overview" class="state-panel empty">
      <h2>暂无监控数据</h2>
      <p>当前没有可用的系统监控指标。</p>
    </div>

    <template v-else>
      <section class="overview-grid">
        <article class="panel health-panel">
          <div class="panel-title">
            <h2>系统健康度</h2>
            <span>综合评分</span>
          </div>
          <div class="health-ring-wrap">
            <div class="health-ring">
              <svg viewBox="0 0 200 200" class="health-svg">
                <circle cx="100" cy="100" r="84" class="ring-bg" />
                <circle
                  cx="100" cy="100" r="84"
                  class="ring-fg"
                  :class="healthTone"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="dashOffset"
                />
              </svg>
              <div class="ring-content">
                <strong>{{ overview.healthScore }}</strong>
                <span>健康度</span>
              </div>
            </div>
            <div class="health-desc">
              <p :class="healthTone">{{ healthSummary }}</p>
              <small>评分由模块可用率、延迟、告警密度综合得出</small>
            </div>
          </div>
        </article>

        <article class="panel alert-summary-panel">
          <div class="panel-title">
            <h2>告警分级摘要</h2>
            <span>当前活跃告警统计</span>
          </div>
          <div class="alert-summary-grid">
            <div class="alert-stat-card critical" @click="$emit('jump-alerts')">
              <strong>{{ overview.alertSummary.critical }}</strong>
              <span>紧急</span>
              <em>需立即处置</em>
            </div>
            <div class="alert-stat-card major" @click="$emit('jump-alerts')">
              <strong>{{ overview.alertSummary.major }}</strong>
              <span>主要</span>
              <em>影响关键业务</em>
            </div>
            <div class="alert-stat-card minor" @click="$emit('jump-alerts')">
              <strong>{{ overview.alertSummary.minor }}</strong>
              <span>次要</span>
              <em>需关注排查</em>
            </div>
            <div class="alert-stat-card info" @click="$emit('jump-alerts')">
              <strong>{{ overview.alertSummary.info }}</strong>
              <span>提示</span>
              <em>信息性通知</em>
            </div>
          </div>
        </article>
      </section>

      <section class="panel indicators-panel">
        <div class="panel-title">
          <h2>关键运行指标</h2>
          <span>实时采集 · 每30秒刷新</span>
        </div>
        <div class="indicators-grid">
          <article v-for="(item, idx) in overview.keyIndicators" :key="idx" :class="['indicator-card', item.tone]">
            <div class="indicator-value">{{ item.value }}</div>
            <div class="indicator-label">{{ item.label }}</div>
            <div class="indicator-bar">
              <i :style="indicatorBarStyle(item)"></i>
            </div>
          </article>
        </div>
      </section>

      <section class="panel modules-panel">
        <div class="panel-title">
          <h2>模块运行状态</h2>
          <span>{{ degradedModules }} 个降级模块</span>
        </div>
        <table class="module-table">
          <thead>
            <tr>
              <th>模块</th>
              <th>状态</th>
              <th>可用率</th>
              <th>平均延迟</th>
              <th>健康判定</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="m in overview.moduleMetrics" :key="m.module" :class="{ degraded: m.status === '降级' }">
              <td><strong>{{ m.module }}</strong></td>
              <td>
                <StatusBadge :label="m.status" />
              </td>
              <td>{{ m.uptime }}</td>
              <td>{{ m.latency }}</td>
              <td>
                <span v-if="m.status === '正常'" class="verdict ok">运行正常</span>
                <span v-else class="verdict danger">需介入排查</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import { fetchMonitorOverview } from '@/mock/api.js'

defineEmits(['jump-alerts'])

const overview = ref(null)
const uiState = ref('loading')
const circumference = 2 * Math.PI * 84

const dashOffset = computed(() => {
  const score = overview.value?.healthScore ?? 0
  const ratio = Math.max(0, Math.min(100, score)) / 100
  return circumference * (1 - ratio)
})

const healthTone = computed(() => {
  const score = overview.value?.healthScore ?? 0
  if (score >= 90) return 'ok'
  if (score >= 75) return 'warn'
  return 'danger'
})

const healthSummary = computed(() => {
  const score = overview.value?.healthScore ?? 0
  if (score >= 90) return '系统整体运行健康，未发现重大异常'
  if (score >= 75) return '系统存在部分告警，建议关注降级模块'
  return '系统健康度偏低，存在需立即处置的问题'
})

const degradedModules = computed(() =>
  (overview.value?.moduleMetrics || []).filter(m => m.status === '降级').length,
)

function indicatorBarStyle(item) {
  let ratio = 0
  const numMatch = String(item.value).match(/(\d+(\.\d+)?)/)
  const num = numMatch ? parseFloat(numMatch[1]) : 0
  if (item.label.includes('CPU') || item.label.includes('内存') || item.label.includes('磁盘')) ratio = num / 100
  else if (item.label.includes('响应')) ratio = Math.min(100, num / 4)
  else if (item.label.includes('用户') || item.label.includes('请求')) ratio = 0.7
  const toneColor = item.tone === 'warn' ? '#d4743f' : item.tone === 'danger' ? '#b4232d' : '#11734d'
  return { width: `${Math.max(6, ratio * 100)}%`, background: toneColor }
}

async function loadData() {
  uiState.value = 'loading'
  try {
    overview.value = await fetchMonitorOverview()
    uiState.value = overview.value ? 'success' : 'empty'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(loadData)
</script>

<style scoped>
.monitor-dashboard { display: grid; gap: 16px; position: relative; }

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

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.state-panel.empty h2 { color: #64748b; }
.skeleton { grid-template-columns: repeat(3, minmax(0, 1fr)); padding: 24px; }
.skeleton-block { height: 120px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); animation: pulse 1.4s ease-in-out infinite; }
.ring-skeleton { height: 240px; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }

.overview-grid { display: grid; grid-template-columns: 420px minmax(0, 1fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 14px; }
.panel-title h2 { margin: 0; font-size: 16px; color: #172033; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.health-ring-wrap { display: flex; gap: 24px; align-items: center; flex-wrap: wrap; }
.health-ring { position: relative; width: 200px; height: 200px; }
.health-svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg { fill: none; stroke: #e7edf4; stroke-width: 16; }
.ring-fg { fill: none; stroke-width: 16; stroke-linecap: round; transition: stroke-dashoffset 0.8s ease; }
.ring-fg.ok { stroke: #11734d; }
.ring-fg.warn { stroke: #d4743f; }
.ring-fg.danger { stroke: #b4232d; }
.ring-content { position: absolute; inset: 0; display: grid; place-content: center; justify-items: center; }
.ring-content strong { font-size: 48px; font-weight: 900; color: #172033; line-height: 1; }
.ring-content span { color: #64748b; font-size: 13px; font-weight: 800; margin-top: 6px; }
.health-desc p { margin: 0 0 6px; font-size: 14px; font-weight: 700; }
.health-desc p.ok { color: #11734d; }
.health-desc p.warn { color: #d4743f; }
.health-desc p.danger { color: #b4232d; }
.health-desc small { color: #64748b; font-size: 12px; }

.alert-summary-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.alert-stat-card {
  display: grid; gap: 4px; padding: 16px; border-radius: 8px; cursor: pointer;
  border: 1px solid #d9e4ef; transition: transform 0.15s, box-shadow 0.15s;
}
.alert-stat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(30, 111, 217, 0.12); }
.alert-stat-card strong { font-size: 32px; font-weight: 900; line-height: 1; }
.alert-stat-card span { font-size: 14px; font-weight: 800; color: #172033; }
.alert-stat-card em { font-style: normal; font-size: 11px; color: #64748b; }
.alert-stat-card.critical { background: #ffe1e3; border-color: #f5b8bc; }
.alert-stat-card.critical strong { color: #b4232d; }
.alert-stat-card.major { background: #fff3e6; border-color: #f3c899; }
.alert-stat-card.major strong { color: #d4743f; }
.alert-stat-card.minor { background: #fff8d8; border-color: #e8d99a; }
.alert-stat-card.minor strong { color: #8a6500; }
.alert-stat-card.info { background: #e3efff; border-color: #b8d4f5; }
.alert-stat-card.info strong { color: #1e6fd9; }

.indicators-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
.indicator-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 18px; background: #f8fbfe; }
.indicator-card.ok { border-left: 4px solid #11734d; }
.indicator-card.warn { border-left: 4px solid #d4743f; }
.indicator-card.danger { border-left: 4px solid #b4232d; }
.indicator-value { font-size: 30px; font-weight: 900; color: #172033; line-height: 1.2; }
.indicator-label { color: #64748b; font-size: 13px; font-weight: 800; margin: 6px 0 14px; }
.indicator-bar { height: 6px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.indicator-bar i { display: block; height: 100%; border-radius: 999px; transition: width 0.6s ease; }

.module-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.module-table th, .module-table td { padding: 12px 14px; border-bottom: 1px solid #e7edf4; text-align: left; }
.module-table th { color: #63748a; background: #f7fafc; font-weight: 800; }
.module-table tr.degraded { background: #fff5f5; }
.module-table tr.degraded td { color: #b4232d; }
.module-table tr.degraded strong { color: #b4232d; }
.verdict { font-size: 12px; font-weight: 800; padding: 3px 8px; border-radius: 999px; }
.verdict.ok { color: #11734d; background: #dff6e8; }
.verdict.danger { color: #b4232d; background: #ffe1e3; }

@media (max-width: 980px) {
  .overview-grid { grid-template-columns: 1fr; }
  .alert-summary-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .indicators-grid { grid-template-columns: 1fr; }
}
@media (max-width: 720px) {
  .page-header { flex-direction: column; }
}
</style>
