<template>
  <section class="dispatch-map-view" aria-labelledby="dispatch-map-title">
    <ViewHeading
      eyebrow="P0 Prototype Page · 现场调度"
      title="现场调度地图监控"
      title-id="dispatch-map-title"
      description="基于地图看板实时展示所有车辆的位置、状态（空闲、排队、任务中、异常）、作业区域，支持点击查看车辆详情。"
    />

    <!-- 顶部统计卡片 -->
    <div class="stats-bar">
      <button
        v-for="stat in stats"
        :key="stat.key"
        type="button"
        class="stat-card"
        :class="{ active: filterStatus === stat.key }"
        :style="{ '--stat-color': stat.color }"
        @click="toggleStatusFilter(stat.key)"
      >
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </button>
      <button
        v-if="filterStatus"
        type="button"
        class="stat-card clear-filter"
        @click="filterStatus = null"
      >
        <span class="stat-value">✕</span>
        <span class="stat-label">清除筛选</span>
      </button>
    </div>

    <!-- 主区域：地图 + 告警 -->
    <div class="map-layout">
      <!-- 地图区域 -->
      <div class="map-area" ref="mapRef">
        <!-- 区域标签 -->
        <div
          v-for="area in mapAreaLabels"
          :key="area.name"
          class="map-zone"
          :style="{
            left: area.x + '%',
            top: area.y + '%',
            width: area.w + '%',
            height: area.h + '%',
          }"
        >
          <span>{{ area.name }}</span>
        </div>

        <!-- 车辆标记 -->
        <button
          v-for="vehicle in filteredVehicles"
          :key="vehicle.id"
          type="button"
          class="vehicle-marker"
          :class="[
            'status-' + vehicle.status,
            { selected: selectedVehicle?.id === vehicle.id },
          ]"
          :style="{
            left: vehicle.position.x + '%',
            top: vehicle.position.y + '%',
          }"
          :aria-label="`车辆 ${vehicle.plate}，状态 ${vehicleStatusMap[vehicle.status].label}`"
          @click="selectVehicle(vehicle)"
        >
          <span class="marker-dot"></span>
          <span class="marker-plate">{{ vehicle.plate.slice(-4) }}</span>
        </button>

        <!-- 加载/空/错误状态 -->
        <div v-if="mapState === 'loading'" class="map-overlay">
          <div class="map-overlay-content">
            <span class="spinner"></span>
            <p>地图加载中...</p>
          </div>
        </div>
        <div v-else-if="mapState === 'empty'" class="map-overlay">
          <div class="map-overlay-content">
            <span class="empty-icon">📍</span>
            <p>当前区域无车辆</p>
            <small>请调整筛选条件或移动地图视野</small>
          </div>
        </div>
        <div v-else-if="mapState === 'error'" class="map-overlay">
          <div class="map-overlay-content error-content">
            <span class="error-icon">⚠️</span>
            <p>地图加载失败</p>
            <small>请检查网络或稍后重试</small>
            <button type="button" class="retry-btn" @click="retryLoad">重试</button>
          </div>
        </div>
      </div>

      <!-- 右侧告警面板 -->
      <aside class="alert-panel" aria-label="异常告警">
        <div class="alert-panel-header">
          <span>🚨 异常告警</span>
          <strong>{{ unhandledAlertCount }} 条未处理</strong>
        </div>
        <div v-if="mapAlerts.length === 0" class="alert-empty">
          <p>暂无异常告警</p>
        </div>
        <ul v-else class="alert-list">
          <li
            v-for="alert in mapAlerts"
            :key="alert.id"
            class="alert-item"
            :class="[
              'severity-' + alert.severity,
              { handled: alert.handled },
            ]"
          >
            <div class="alert-head">
              <span class="alert-type">{{ alert.type }}</span>
              <span class="alert-time">{{ alert.time }}</span>
            </div>
            <p class="alert-desc">{{ alert.description }}</p>
            <div class="alert-meta">
              <small>{{ alert.plate }}</small>
              <small>{{ alert.location }}</small>
            </div>
            <div v-if="!alert.handled" class="alert-actions">
              <button type="button" class="alert-btn confirm" @click="handleAlert(alert.id, 'confirm')">确认</button>
              <button type="button" class="alert-btn ignore" @click="handleAlert(alert.id, 'ignore')">忽略</button>
            </div>
            <div v-else class="alert-resolved">✓ 已处理</div>
          </li>
        </ul>
      </aside>
    </div>

    <!-- 底部车辆详情面板 -->
    <transition name="slide-up">
      <div v-if="selectedVehicle" class="vehicle-detail-panel" aria-label="车辆详情">
        <div class="detail-header">
          <div>
            <h3>{{ selectedVehicle.plate }}</h3>
            <span class="detail-status" :class="'status-' + selectedVehicle.status">
              {{ vehicleStatusMap[selectedVehicle.status].label }}
            </span>
          </div>
          <button type="button" class="close-detail" @click="selectedVehicle = null" aria-label="关闭详情">✕</button>
        </div>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">车辆类型</span>
            <span class="detail-value">{{ selectedVehicle.type }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">司机</span>
            <span class="detail-value">{{ selectedVehicle.driver }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">联系电话</span>
            <span class="detail-value">{{ selectedVehicle.phone }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">速度</span>
            <span class="detail-value">{{ selectedVehicle.speed }} km/h</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">所在区域</span>
            <span class="detail-value">{{ selectedVehicle.area }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">关联任务</span>
            <span class="detail-value">{{ selectedVehicle.taskId || '无' }}</span>
          </div>
        </div>
        <div class="detail-actions">
          <button type="button" class="primary-button small" :disabled="selectedVehicle.status === 'onTask'">
            📋 派发任务
          </button>
          <button type="button" class="ghost-button small">
            📍 定位车辆
          </button>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import ViewHeading from '../../components/ViewHeading.vue'
import {
  mapAlerts,
  mapAreaLabels,
  mapStats,
  mapVehicles,
  vehicleStatusMap,
} from '../../data/prototype/dispatchMapMock'

defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const mapState = ref('loading')
const selectedVehicle = ref(null)
const filterStatus = ref(null)
const alerts = ref([...mapAlerts])

const stats = computed(() => mapStats(mapVehicles))

const filteredVehicles = computed(() => {
  if (!filterStatus.value) return mapVehicles
  return mapVehicles.filter((v) => v.status === filterStatus.value)
})

const unhandledAlertCount = computed(() => alerts.value.filter((a) => !a.handled).length)

function selectVehicle(vehicle) {
  if (selectedVehicle.value?.id === vehicle.id) {
    selectedVehicle.value = null
    return
  }
  selectedVehicle.value = vehicle
}

function toggleStatusFilter(key) {
  filterStatus.value = filterStatus.value === key ? null : key
}

function handleAlert(alertId, action) {
  const idx = alerts.value.findIndex((a) => a.id === alertId)
  if (idx >= 0) {
    alerts.value[idx] = { ...alerts.value[idx], handled: true }
  }
}

function retryLoad() {
  mapState.value = 'loading'
  setTimeout(() => {
    mapState.value = 'success'
  }, 800)
}

onMounted(() => {
  // 模拟地图加载
  setTimeout(() => {
    mapState.value = mapVehicles.length > 0 ? 'success' : 'empty'
  }, 600)
})
</script>

<style scoped>
.dispatch-map-view {
  margin-top: 16px;
}

/* ===== 统计卡片 ===== */
.stats-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 100px;
  padding: 12px 18px;
  border: 2px solid transparent;
  border-radius: 10px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}

.stat-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.stat-card.active {
  border-color: var(--stat-color);
  background: #f8fafc;
}

.stat-card.clear-filter {
  border-color: #e2e8f0;
  min-width: auto;
}

.stat-value {
  font-size: 28px;
  font-weight: 900;
  color: var(--stat-color);
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  font-weight: 700;
}

/* ===== 地图 + 告警布局 ===== */
.map-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 16px;
  min-height: 440px;
}

/* ===== 模拟地图 ===== */
.map-area {
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background:
    linear-gradient(90deg, #f1f5f9 1px, transparent 1px),
    linear-gradient(0deg, #f1f5f9 1px, transparent 1px);
  background-size: 40px 40px;
  background-color: #f8fafc;
  overflow: hidden;
  min-height: 440px;
}

/* 区域标签 */
.map-zone {
  position: absolute;
  border: 1px dashed #cbd5e1;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 4px;
}

.map-zone span {
  font-size: 10px;
  color: #94a3b8;
  font-weight: 700;
  background: rgba(255,255,255,0.8);
  padding: 1px 6px;
  border-radius: 4px;
}

/* 车辆标记 */
.vehicle-marker {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  border: none;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%);
  z-index: 2;
  transition: transform 0.15s;
  padding: 0;
}

.vehicle-marker:hover {
  transform: translate(-50%, -50%) scale(1.2);
  z-index: 3;
}

.vehicle-marker.selected {
  z-index: 4;
}

.vehicle-marker.selected .marker-dot {
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
  transform: scale(1.3);
}

.marker-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: all 0.15s;
}

.status-idle .marker-dot { background: #16a34a; }
.status-queuing .marker-dot { background: #d97706; }
.status-onTask .marker-dot { background: #2563eb; }
.status-abnormal .marker-dot { background: #dc2626; animation: pulse-alert 1s infinite; }

@keyframes pulse-alert {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
  50% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
}

.marker-plate {
  font-size: 9px;
  color: #334155;
  font-weight: 800;
  background: rgba(255,255,255,0.9);
  padding: 1px 4px;
  border-radius: 3px;
  white-space: nowrap;
}

/* 地图覆盖层 */
.map-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(248, 250, 252, 0.85);
  z-index: 10;
}

.map-overlay-content {
  text-align: center;
}

.map-overlay-content p {
  margin: 8px 0 0;
  color: #64748b;
  font-weight: 700;
  font-size: 15px;
}

.map-overlay-content small {
  display: block;
  margin-top: 4px;
  color: #94a3b8;
  font-size: 12px;
}

.error-content p {
  color: #dc2626;
}

.empty-icon {
  font-size: 36px;
}

.error-icon {
  font-size: 36px;
}

.spinner {
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.retry-btn {
  margin-top: 10px;
  padding: 6px 16px;
  border: 1px solid #2563eb;
  border-radius: 6px;
  background: #ffffff;
  color: #2563eb;
  font-weight: 700;
  cursor: pointer;
}

/* ===== 告警面板 ===== */
.alert-panel {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.alert-panel-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.alert-panel-header span {
  font-size: 13px;
  color: #dc2626;
  font-weight: 800;
}

.alert-panel-header strong {
  font-size: 12px;
  color: #ef4444;
  background: #fef2f2;
  padding: 2px 8px;
  border-radius: 10px;
}

.alert-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
}

.alert-list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
}

.alert-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f8fafc;
  border-left: 3px solid transparent;
  transition: background 0.15s;
}

.alert-item.severity-critical {
  border-left-color: #dc2626;
  background: #fef2f2;
}

.alert-item.severity-high {
  border-left-color: #f97316;
}

.alert-item.severity-medium {
  border-left-color: #eab308;
}

.alert-item.handled {
  opacity: 0.55;
}

.alert-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.alert-type {
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
}

.alert-time {
  font-size: 11px;
  color: #94a3b8;
}

.alert-desc {
  margin: 0 0 6px;
  font-size: 12px;
  color: #475569;
  line-height: 1.5;
}

.alert-meta {
  display: flex;
  gap: 12px;
}

.alert-meta small {
  font-size: 11px;
  color: #94a3b8;
}

.alert-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.alert-btn {
  padding: 3px 12px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 800;
  border: 1px solid;
  cursor: pointer;
}

.alert-btn.confirm {
  border-color: #16a34a;
  color: #16a34a;
  background: #ffffff;
}

.alert-btn.ignore {
  border-color: #94a3b8;
  color: #64748b;
  background: #ffffff;
}

.alert-resolved {
  margin-top: 6px;
  font-size: 11px;
  color: #16a34a;
  font-weight: 700;
}

/* ===== 底部车辆详情面板 ===== */
.vehicle-detail-panel {
  margin-top: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 18px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.detail-header h3 {
  margin: 0;
  font-size: 16px;
  color: #0f172a;
  display: inline;
}

.detail-status {
  display: inline-block;
  margin-left: 10px;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 900;
}

.detail-status.status-idle { background: #dcfce7; color: #16a34a; }
.detail-status.status-queuing { background: #fef3c7; color: #d97706; }
.detail-status.status-onTask { background: #dbeafe; color: #2563eb; }
.detail-status.status-abnormal { background: #fee2e2; color: #dc2626; }

.close-detail {
  border: none;
  background: transparent;
  font-size: 18px;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
}

.close-detail:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: #f1f5f9;
}

.detail-item {
  padding: 10px 18px;
  background: #ffffff;
}

.detail-label {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 700;
  margin-bottom: 2px;
}

.detail-value {
  font-size: 14px;
  color: #0f172a;
  font-weight: 700;
}

.detail-actions {
  display: flex;
  gap: 10px;
  padding: 12px 18px;
  border-top: 1px solid #f1f5f9;
}

.primary-button.small,
.ghost-button.small {
  padding: 6px 14px;
  font-size: 13px;
}

.ghost-button.small {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  font-weight: 700;
}

/* ===== 过渡动画 ===== */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* ===== 响应式 ===== */
@media (max-width: 920px) {
  .map-layout {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
