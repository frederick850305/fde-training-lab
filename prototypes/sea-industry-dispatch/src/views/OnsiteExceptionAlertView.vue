<template>
  <section class="exception-alert-view" aria-labelledby="alert-title">
    <ViewHeading
      eyebrow="P1 Prototype Page · 现场调度"
      title="现场异常告警处理"
      title-id="alert-title"
      description="实时接收车辆异常告警（超速、禁入区域、异常停留、未授权入场等），支持查看详情、处理告警、标记解决。"
    />

    <!-- 统计横幅 -->
    <div class="stats-bar">
      <div class="stat-item">
        <span class="stat-num">{{ activeAlerts.length }}</span>
        <span class="stat-label">活跃告警</span>
      </div>
      <div class="stat-item critical">
        <span class="stat-num">{{ criticalCount }}</span>
        <span class="stat-label">严重</span>
      </div>
      <div class="stat-item pending">
        <span class="stat-num">{{ unhandledCount }}</span>
        <span class="stat-label">待处理</span>
      </div>
      <div class="stat-item resolved">
        <span class="stat-num">{{ alertHistory.length }}</span>
        <span class="stat-label">已归档</span>
      </div>
    </div>

    <!-- 筛选栏 -->
    <div class="filter-bar">
      <div class="severity-tabs">
        <button v-for="s in severityTabs" :key="s.key" type="button"
          :class="{ active: filterSeverity === s.key }"
          @click="filterSeverity = s.key">
          {{ s.label }}<span v-if="s.key !== 'all'" class="tab-badge">{{ severityCount(s.key) }}</span>
        </button>
      </div>
      <select v-model="filterType" class="type-select">
        <option value="">全部类型</option>
        <option v-for="t in alertTypes" :key="t" :value="t">{{ t }}</option>
      </select>
    </div>

    <!-- 加载态 -->
    <div v-if="listState === 'loading'" class="state-box">
      <div class="sk-row" v-for="n in 3" :key="n">
        <div class="sk-badge"></div><div class="sk-line w-60"></div><div class="sk-line w-30"></div>
      </div>
    </div>

    <!-- 活跃告警列表 -->
    <template v-else>
      <div v-if="filteredAlerts.length === 0" class="state-box">
        <span class="state-icon">✅</span>
        <p>{{ filterSeverity === 'all' && !filterType ? '暂无活跃告警' : '没有符合条件的告警' }}</p>
        <button v-if="filterSeverity !== 'all' || filterType" type="button" class="text-btn" @click="resetFilters">清除筛选</button>
      </div>

      <div v-else class="alert-list">
        <article
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="alert-card"
          :class="['severity-' + alert.severity, 'status-' + alert.status]"
        >
          <div class="alert-main" @click="toggleExpand(alert.id)">
            <span class="severity-badge" :class="'severity-' + alert.severity">
              {{ alertSeverityMap[alert.severity].label }}
            </span>
            <div class="alert-info">
              <div class="alert-head">
                <strong>{{ alert.type }}</strong>
                <span class="alert-id">{{ alert.id }}</span>
              </div>
              <p class="alert-desc">{{ alert.description }}</p>
              <div class="alert-meta">
                <span>🚛 {{ alert.plate }}</span>
                <span>👤 {{ alert.driver }}</span>
                <span>📍 {{ alert.location }}</span>
                <span>🕐 {{ alert.time }}</span>
              </div>
            </div>
            <span class="expand-icon">{{ expandedId === alert.id ? '▴' : '▾' }}</span>
          </div>

          <!-- 展开详情 + 操作 -->
          <div v-if="expandedId === alert.id" class="alert-detail">
            <div class="detail-actions">
              <button type="button" class="action-btn confirm" @click="handleAlert(alert.id, 'confirm')"
                :disabled="alert.status !== 'pending'">✓ 确认告警</button>
              <button type="button" class="action-btn locate" @click="locateVehicle(alert)">📍 定位车辆</button>
              <button type="button" class="action-btn notify" @click="notifyPersonnel(alert)">📢 通知人员</button>
              <button type="button" class="action-btn ignore" @click="handleAlert(alert.id, 'ignore')"
                :disabled="alert.status !== 'pending'">⊘ 忽略</button>
            </div>
            <div v-if="alert.status === 'resolved'" class="resolve-info">
              ✅ 已解决 — {{ alert.resolution }}
            </div>
          </div>
        </article>
      </div>
    </template>

    <!-- 历史记录 -->
    <div v-if="alertHistory.length" class="history-section">
      <div class="history-header">
        <span class="section-label">告警历史</span>
        <button type="button" class="text-btn">📤 导出记录</button>
      </div>
      <table class="history-table">
        <thead>
          <tr><th>告警</th><th>车辆</th><th>位置</th><th>时间</th><th>结果</th></tr>
        </thead>
        <tbody>
          <tr v-for="h in alertHistory" :key="h.id">
            <td>
              <span class="severity-dot" :class="'severity-' + h.severity"></span>
              {{ h.type }}
            </td>
            <td>{{ h.plate }}</td>
            <td>{{ h.location }}</td>
            <td>{{ h.time }}</td>
            <td>
              <span class="result-tag" :class="'result-' + h.status">
                {{ h.status === 'resolved' ? '已解决' : '已忽略' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import {
  activeAlerts,
  alertHistory,
  alertSeverityMap,
  alertTypes,
} from '../data/exceptionAlertMock'

const listState = ref('loading')
const filterSeverity = ref('all')
const filterType = ref('')
const expandedId = ref(null)
const alerts = ref([...activeAlerts])

const severityTabs = [
  { key: 'all', label: '全部' },
  { key: 'critical', label: '严重' },
  { key: 'high', label: '高' },
  { key: 'medium', label: '中' },
  { key: 'low', label: '低' },
]

const criticalCount = computed(() => activeAlerts.filter(a => a.severity === 'critical').length)
const unhandledCount = computed(() => activeAlerts.filter(a => a.status === 'pending').length)

function severityCount(key) {
  return activeAlerts.filter(a => a.severity === key).length
}

const filteredAlerts = computed(() => {
  let result = [...alerts.value]
  if (filterSeverity.value !== 'all') {
    result = result.filter(a => a.severity === filterSeverity.value)
  }
  if (filterType.value) {
    result = result.filter(a => a.type === filterType.value)
  }
  return result
})

function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

function resetFilters() {
  filterSeverity.value = 'all'
  filterType.value = ''
}

function handleAlert(id, action) {
  const idx = alerts.value.findIndex(a => a.id === id)
  if (idx >= 0) {
    const status = action === 'confirm' ? 'resolved' : 'ignored'
    alerts.value[idx] = {
      ...alerts.value[idx],
      status,
      resolvedAt: new Date().toLocaleTimeString('zh-CN'),
      resolution: action === 'confirm' ? '已确认处理' : '已忽略',
    }
  }
  expandedId.value = null
}

function locateVehicle(alert) {
  alert(`定位车辆 ${alert.plate}：${alert.location}`)
}

function notifyPersonnel(alert) {
  alert(`已通知相关人员处理告警：${alert.type} — ${alert.plate}`)
}

onMounted(() => {
  setTimeout(() => { listState.value = 'success' }, 400)
})
</script>

<style scoped>
.exception-alert-view { margin-top: 16px; }

/* 统计 */
.stats-bar { display: flex; gap: 12px; margin-bottom: 14px; }
.stat-item {
  flex: 1; padding: 14px 16px; border-radius: 10px;
  background: #ffffff; border: 1px solid #e2e8f0; text-align: center;
}
.stat-item.critical { border-color: #fecaca; background: #fef2f2; }
.stat-item.pending { border-color: #fde68a; background: #fffbeb; }
.stat-item.resolved { border-color: #bbf7d0; background: #f0fdf4; }
.stat-num { display: block; font-size: 28px; font-weight: 900; color: #0f172a; }
.stat-label { font-size: 12px; color: #64748b; font-weight: 700; }

/* 筛选 */
.filter-bar { display: flex; gap: 10px; margin-bottom: 14px; align-items: center; flex-wrap: wrap; }
.severity-tabs { display: flex; gap: 4px; }
.severity-tabs button {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border: 1px solid #e2e8f0; border-radius: 16px;
  background: #fff; color: #475569; font-size: 12px; font-weight: 700; cursor: pointer;
}
.severity-tabs button:hover { border-color: #93c5fd; }
.severity-tabs button.active { border-color: #1d4ed8; background: #1d4ed8; color: #fff; }
.tab-badge { font-size: 10px; opacity: 0.7; }
.type-select {
  padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 8px;
  font-size: 12px; color: #475569; outline: none; margin-left: auto;
}

/* 状态 */
.state-box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 200px; border: 1px solid #e2e8f0; border-radius: 10px;
  background: #fff; text-align: center; padding: 32px;
}
.state-icon { font-size: 48px; }
.state-box p { margin: 8px 0; color: #64748b; }
.text-btn { border: none; background: transparent; color: #2563eb; font-weight: 700; cursor: pointer; }

.sk-row { display: flex; align-items: center; gap: 10px; padding: 12px 16px; width: 100%; border-radius: 8px; background: #f8fafc; }
.sk-badge { width: 40px; height: 20px; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.sk-line { height: 12px; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.w-60 { width: 60%; } .w-30 { width: 30%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* 告警卡片 */
.alert-list { display: grid; gap: 8px; }
.alert-card { border: 1px solid #e2e8f0; border-radius: 8px; background: #fff; overflow: hidden; }
.alert-card.severity-critical { border-left: 4px solid #dc2626; }
.alert-card.severity-high { border-left: 4px solid #f97316; }
.alert-card.severity-medium { border-left: 4px solid #eab308; }
.alert-card.severity-low { border-left: 4px solid #3b82f6; }
.alert-card.status-resolved, .alert-card.status-ignored { opacity: 0.55; }

.alert-main {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 16px; cursor: pointer;
}
.alert-main:hover { background: #f8fafc; }

.severity-badge {
  display: inline-block; padding: 2px 8px; border-radius: 4px;
  font-size: 10px; font-weight: 900; white-space: nowrap; margin-top: 2px;
}
.severity-badge.severity-critical { background: #fee2e2; color: #dc2626; }
.severity-badge.severity-high { background: #fff7ed; color: #f97316; }
.severity-badge.severity-medium { background: #fefce8; color: #eab308; }
.severity-badge.severity-low { background: #eff6ff; color: #3b82f6; }

.alert-info { flex: 1; min-width: 0; }
.alert-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.alert-head strong { color: #0f172a; font-size: 14px; }
.alert-id { font-size: 10px; color: #94a3b8; }
.alert-desc { margin: 0 0 6px; color: #475569; font-size: 12px; line-height: 1.5; }
.alert-meta { display: flex; gap: 12px; flex-wrap: wrap; }
.alert-meta span { font-size: 11px; color: #94a3b8; }
.expand-icon { color: #94a3b8; font-size: 14px; padding-top: 2px; }

/* 展开操作 */
.alert-detail { padding: 0 16px 12px; border-top: 1px solid #f1f5f9; }
.detail-actions { display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap; }
.action-btn {
  padding: 5px 14px; border: 1px solid #e2e8f0; border-radius: 6px;
  background: #fff; font-size: 12px; font-weight: 700; cursor: pointer;
}
.action-btn:hover:not(:disabled) { background: #f8fafc; }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.action-btn.confirm { border-color: #16a34a; color: #16a34a; }
.action-btn.confirm:hover:not(:disabled) { background: #f0fdf4; }
.action-btn.ignore { border-color: #94a3b8; color: #64748b; }
.action-btn.locate { border-color: #3b82f6; color: #3b82f6; }
.action-btn.notify { border-color: #d97706; color: #d97706; }
.resolve-info {
  margin-top: 8px; padding: 6px 10px; border-radius: 6px;
  background: #f0fdf4; color: #16a34a; font-size: 12px; font-weight: 600;
}

/* 历史 */
.history-section { margin-top: 20px; }
.history-header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 8px;
}
.section-label {
  color: #2563eb; font-size: 12px; font-weight: 900;
  text-transform: uppercase; letter-spacing: 0.5px;
}
.history-table {
  width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;
  border-radius: 8px; overflow: hidden; font-size: 12px;
}
.history-table th {
  padding: 8px 12px; background: #f8fafc; color: #94a3b8;
  font-weight: 700; text-align: left; border-bottom: 1px solid #e2e8f0;
}
.history-table td { padding: 8px 12px; border-bottom: 1px solid #f8fafc; color: #334155; }
.severity-dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 4px; }
.severity-dot.severity-critical { background: #dc2626; }
.severity-dot.severity-high { background: #f97316; }
.severity-dot.severity-medium { background: #eab308; }
.severity-dot.severity-low { background: #3b82f6; }
.result-tag {
  display: inline-block; padding: 1px 8px; border-radius: 10px;
  font-size: 10px; font-weight: 800;
}
.result-tag.result-resolved { background: #dcfce7; color: #16a34a; }
.result-tag.result-ignored { background: #f1f5f9; color: #94a3b8; }
</style>
