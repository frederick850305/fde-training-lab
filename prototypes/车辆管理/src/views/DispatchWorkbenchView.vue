<template>
  <div class="dispatch-workbench" :class="{ 'loading': loadingState === 'loading', 'error': loadingState === 'error', 'empty': loadingState === 'empty' }">
    <!-- 状态看板区域 -->
    <div class="status-panel">
      <div class="stat-card" v-for="stat in stats" :key="stat.label" @click="filterByStatus(stat.status)">
        <div class="stat-value">{{ stat.count }}</div>
        <div class="stat-label">{{ stat.label }}</div>
      </div>
    </div>

    <!-- 地图区域（占位） -->
    <div class="map-area">
      <div v-if="loadingState === 'loading'" class="loading-overlay">加载中...</div>
      <div v-else-if="loadingState === 'error'" class="error-overlay">
        <p>数据加载失败，请重试</p>
        <button @click="retryLoad">重试</button>
      </div>
      <div v-else-if="loadingState === 'empty'" class="empty-overlay">
        <p>暂无车辆在线</p>
      </div>
      <div v-else class="map-placeholder">
        <!-- 模拟车辆标记 -->
        <div
          v-for="vehicle in visibleVehicles"
          :key="vehicle.vehicleId"
          class="vehicle-marker"
          :style="{ left: randomX(vehicle.vehicleId), top: randomY(vehicle.vehicleId) }"
          @click="selectVehicle(vehicle)"
        >
          {{ vehicle.plateNumber }}
        </div>
      </div>
    </div>

    <!-- 需求列表区域 -->
    <div class="demand-list">
      <h3>待处理需求</h3>
      <div v-if="loadingState === 'loading'" class="skeleton-list">
        <div v-for="i in 3" :key="i" class="skeleton-row"></div>
      </div>
      <div v-else-if="loadingState === 'empty' || filteredDemands.length === 0" class="empty-state">
        暂无待处理需求
      </div>
      <ul v-else>
        <li v-for="demand in filteredDemands" :key="demand.demandId" class="demand-item" @click="openDispatchPanel(demand)">
          <div class="demand-header">
            <span class="demand-id">{{ demand.demandId }}</span>
            <span class="demand-time">{{ demand.applyTime }}</span>
          </div>
          <div class="demand-info">
            <span>申请人：{{ demand.applicant }}</span>
            <span>出发：{{ demand.departure }} → 目的：{{ demand.destination }}</span>
          </div>
          <button class="dispatch-btn" @click.stop="openDispatchPanel(demand)">派车</button>
        </li>
      </ul>
    </div>

    <!-- 派车操作面板（弹窗） -->
    <div v-if="showDispatchPanel" class="dispatch-panel-overlay" @click.self="closeDispatchPanel">
      <div class="dispatch-panel">
        <h4>派车操作</h4>
        <div v-if="currentDemand" class="demand-summary">
          <p>需求：{{ currentDemand.demandId }} - {{ currentDemand.applicant }}</p>
          <p>路线：{{ currentDemand.departure }} → {{ currentDemand.destination }}</p>
        </div>
        <div class="vehicle-selection">
          <h5>推荐车辆</h5>
          <div v-for="vehicle in recommendedVehicles" :key="vehicle.vehicleId" class="vehicle-option" :class="{ selected: selectedVehicle === vehicle.vehicleId }" @click="selectVehicleForDispatch(vehicle.vehicleId)">
            <div class="vehicle-info">
              <span>{{ vehicle.plateNumber }}</span>
              <span>司机：{{ vehicle.driverName }}</span>
              <span>位置：{{ vehicle.currentLocation }}</span>
            </div>
          </div>
        </div>
        <div class="panel-actions">
          <button @click="confirmDispatch" :disabled="!selectedVehicle">确认派车</button>
          <button @click="closeDispatchPanel">取消</button>
        </div>
      </div>
    </div>

    <!-- 车辆详情弹窗 -->
    <div v-if="selectedVehicleDetail" class="detail-overlay" @click.self="closeDetail">
      <div class="detail-panel">
        <h4>车辆详情</h4>
        <p>车牌号：{{ selectedVehicleDetail.plateNumber }}</p>
        <p>司机：{{ selectedVehicleDetail.driverName }}</p>
        <p>电话：{{ selectedVehicleDetail.driverPhone }}</p>
        <p>速度：{{ selectedVehicleDetail.speed }} km/h</p>
        <p>任务：{{ selectedVehicleDetail.task }}</p>
        <button @click="closeDetail">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import prototypeContract from '../prototypeContract.js'
import { fetchDispatchData, dispatchRecords } from '../data/mockDispatch.js'

const prototypeContext = inject('prototypeContext')
const currentRole = prototypeContext?.currentRole
const currentRoleKey = prototypeContext?.currentRoleKey

const loadingState = ref('loading')
const rawData = ref(null)
const demandList = ref([])
const vehicleList = ref([])
const selectedVehicle = ref(null)
const selectedVehicleDetail = ref(null)
const showDispatchPanel = ref(false)
const currentDemand = ref(null)

// 根据角色过滤数据
const isDispatcher = computed(() => currentRoleKey === 'dispatcher')

// 统计状态看板
const stats = computed(() => {
  if (!rawData.value) return []
  const vehicles = rawData.value.vehicleList || []
  const free = vehicles.filter(v => v.onlineStatus === '空闲' || v.onlineStatus === 'free').length
  const busy = vehicles.filter(v => v.onlineStatus === '任务中' || v.onlineStatus === 'busy').length
  const queue = vehicles.filter(v => v.onlineStatus === '排队' || v.onlineStatus === 'queue').length
  const abnormal = vehicles.filter(v => v.onlineStatus === '异常' || v.onlineStatus === 'abnormal').length
  return [
    { label: '空闲', count: free, status: 'free' },
    { label: '任务中', count: busy, status: 'busy' },
    { label: '排队', count: queue, status: 'queue' },
    { label: '异常', count: abnormal, status: 'abnormal' }
  ]
})

// 可见车辆（地图上标记）
const visibleVehicles = computed(() => {
  if (!rawData.value) return []
  return rawData.value.vehicleList || []
})

// 待处理需求列表
const filteredDemands = computed(() => {
  if (!rawData.value) return []
  let demands = rawData.value.demand || []
  if (!isDispatcher.value) {
    // 非调度员只显示与自己相关的需求（简单模拟：只显示前两条）
    demands = demands.slice(0, 2)
  }
  return demands
})

// 推荐车辆（派车面板中展示）
const recommendedVehicles = computed(() => {
  if (!rawData.value) return []
  return rawData.value.vehicleList?.filter(v => v.onlineStatus === '空闲' || v.onlineStatus === 'free') || []
})

// 模拟随机位置
function randomX(id) {
  return (id.charCodeAt(0) % 80) + 10 + '%'
}
function randomY(id) {
  return (id.charCodeAt(1) % 60) + 20 + '%'
}

function filterByStatus(status) {
  // 原型中简单高亮或过滤，此处留空
  console.log('筛选状态:', status)
}

function selectVehicle(vehicle) {
  selectedVehicleDetail.value = vehicle
}

function closeDetail() {
  selectedVehicleDetail.value = null
}

function openDispatchPanel(demand) {
  currentDemand.value = demand
  selectedVehicle.value = null
  showDispatchPanel.value = true
}

function closeDispatchPanel() {
  showDispatchPanel.value = false
  currentDemand.value = null
}

function selectVehicleForDispatch(vehicleId) {
  selectedVehicle.value = vehicleId
}

function confirmDispatch() {
  if (!selectedVehicle.value) return
  // 模拟派车成功
  alert('派车成功！')
  closeDispatchPanel()
  // 刷新数据
  loadData()
}

// 加载数据
async function loadData() {
  loadingState.value = 'loading'
  try {
    const data = await fetchDispatchData()
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 300))
    if (!data || (!data.vehicleList?.length && !data.demand?.length)) {
      loadingState.value = 'empty'
      rawData.value = data
    } else {
      rawData.value = data
      loadingState.value = 'success'
    }
  } catch (e) {
    loadingState.value = 'error'
  }
}

function retryLoad() {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.dispatch-workbench {
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto 1fr auto;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif;
}

.status-panel {
  grid-column: 1 / -1;
  display: flex;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 8px 20px;
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  transition: all 0.2s;
}
.stat-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
}
.stat-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.map-area {
  position: relative;
  background: #e8e8e8;
  min-height: 400px;
  border-radius: 8px;
  margin: 8px;
}
.map-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
}
.vehicle-marker {
  position: absolute;
  background: #409eff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transform: translate(-50%, -50%);
  white-space: nowrap;
}
.vehicle-marker:hover {
  background: #337ecc;
}

.demand-list {
  background: white;
  border-radius: 8px;
  margin: 8px;
  padding: 12px;
  overflow-y: auto;
}
.demand-list h3 {
  margin: 0 0 8px;
  font-size: 16px;
}
.demand-item {
  display: flex;
  flex-direction: column;
  padding: 8px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}
.demand-item:hover {
  background: #f0f9ff;
}
.demand-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.demand-id {
  font-weight: bold;
}
.demand-time {
  color: #999;
  font-size: 12px;
}
.demand-info {
  font-size: 13px;
  color: #333;
  display: flex;
  flex-direction: column;
}
.dispatch-btn {
  position: absolute;
  right: 8px;
  top: 8px;
  padding: 4px 12px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.dispatch-btn:hover {
  background: #5daf34;
}

.dispatch-panel-overlay,
.detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.dispatch-panel,
.detail-panel {
  background: white;
  border-radius: 12px;
  padding: 24px;
  min-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}
.dispatch-panel h4,
.detail-panel h4 {
  margin: 0 0 16px;
}
.demand-summary {
  background: #f5f7fa;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 12px;
}
.vehicle-option {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.vehicle-option.selected {
  border-color: #409eff;
  background: #ecf5ff;
}
.vehicle-option:hover {
  border-color: #409eff;
}
.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 14px;
}
.panel-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}
.panel-actions button {
  padding: 8px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.panel-actions button:first-child {
  background: #409eff;
  color: white;
}
.panel-actions button:first-child:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.panel-actions button:last-child {
  background: #f56c6c;
  color: white;
}

.loading-overlay,
.error-overlay,
.empty-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
.empty-state {
  color: #999;
  text-align: center;
  padding: 20px;
}
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton-row {
  height: 24px;
  background: #eee;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style>