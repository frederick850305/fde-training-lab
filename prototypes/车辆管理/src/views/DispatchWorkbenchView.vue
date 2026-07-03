<template>
  <div class="dispatch-workbench">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-mask">
      <div class="spinner"></div>
      <p>加载中，请稍候...</p>
    </div>

    <!-- 空状态 -->
    <div v-else-if="empty" class="empty-state">
      <p>暂无车辆在线或待处理需求</p>
      <button @click="fetchData">刷新</button>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ errorMessage }}</p>
      <button @click="fetchData">重试</button>
    </div>

    <!-- 正常态 -->
    <template v-else>
      <div class="main-content">
        <!-- 地图区域 -->
        <div class="map-area">
          <div class="yard-map">
            <div class="map-toolbar">
              <div>
                <strong>厂区实时调度地图</strong>
                <span>最后更新 09:42</span>
              </div>
              <button>刷新定位</button>
            </div>

            <div class="map-grid"></div>
            <div class="road road-main"></div>
            <div class="road road-vertical"></div>
            <div class="road road-loop"></div>
            <div class="route-line route-line-primary"></div>
            <div class="route-line route-line-secondary"></div>

            <div class="zone gate-zone">厂区A门</div>
            <div class="zone warehouse-zone">仓库B区</div>
            <div class="zone yard-zone">堆场C区</div>
            <div class="zone loading-zone">装卸区</div>
            <div class="zone office-zone">调度中心</div>

            <div
              v-for="vehicle in vehicleList"
              :key="vehicle.id"
              class="vehicle-marker"
              :class="`is-${vehicle.status}`"
              :style="vehicleMarkerStyle(vehicle)"
              @click="showVehicleDetail(vehicle)"
            >
              <span class="vehicle-dot"></span>
              <span>{{ vehicle.plate }}</span>
            </div>

            <div class="map-scale">
              <span></span>
              200 m
            </div>

            <div class="map-legend">
              <span><i class="legend-dot idle"></i>空闲</span>
              <span><i class="legend-dot busy"></i>任务中</span>
              <span><i class="legend-dot error"></i>异常</span>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="side-panel">
          <!-- 状态看板 -->
          <div class="status-dashboard">
            <StatusTag
              v-for="(count, status) in statusCounts"
              :key="status"
              :status="status"
              :text="`${status}: ${count}`"
              size="default"
              @click="filterByStatus(status)"
            />
          </div>

          <!-- 需求列表 -->
          <div class="demand-list">
            <h3>待处理需求</h3>
            <div v-for="demand in demands" :key="demand.id" class="demand-item">
              <span>{{ demand.description }}</span>
              <button @click="openDispatchPanel(demand)">派车</button>
            </div>
            <div v-if="demands.length === 0" class="no-demand">暂无待处理需求</div>
          </div>

          <!-- 派车操作面板 -->
          <div v-if="showDispatchPanel" class="dispatch-panel">
            <h4>派车 - {{ selectedDemand?.description }}</h4>
            <select v-model="selectedVehicleId">
              <option value="">请选择车辆</option>
              <option
                v-for="v in availableVehicles"
                :key="v.id"
                :value="v.id"
              >
                {{ v.plate }} - {{ v.driver }}
              </option>
            </select>
            <button @click="confirmDispatch">确认派车</button>
            <button @click="showDispatchPanel = false">取消</button>
          </div>
        </div>
      </div>
    </template>

    <!-- 车辆详情弹窗 -->
    <DetailPanel
      :visible="detailVisible"
      :title="`车辆详情 - ${detailVehicle?.plate}`"
      mode="modal"
      width="500px"
      @close="detailVisible = false"
    >
      <p>车牌号：{{ detailVehicle?.plate }}</p>
      <p>司机：{{ detailVehicle?.driver }}</p>
      <p>速度：{{ detailVehicle?.speed }} km/h</p>
      <p>任务：{{ detailVehicle?.task }}</p>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import DetailPanel from '@/components/DetailPanel.vue'
import { mockVehicles, mockDemands } from '@/data/mockDispatch.js'

// 状态
const loading = ref(true)
const empty = ref(false)
const error = ref(false)
const errorMessage = ref('')

// 数据
const vehicleList = ref([])
const demands = ref([])
const availableVehicles = ref([])

// 派车面板
const showDispatchPanel = ref(false)
const selectedDemand = ref(null)
const selectedVehicleId = ref('')

// 详情弹窗
const detailVisible = ref(false)
const detailVehicle = ref(null)

// 看板统计
const statusCounts = computed(() => {
  const counts = { idle: 0, busy: 0, queue: 0, error: 0 }
  vehicleList.value.forEach(v => {
    if (counts[v.status] !== undefined) counts[v.status]++
  })
  return counts
})

// 模拟加载数据
function fetchData() {
  loading.value = true
  error.value = false
  empty.value = false
  // 模拟异步
  setTimeout(() => {
    try {
      // 从 mock 获取
      const vehicles = mockVehicles()
      const demandsData = mockDemands()
      vehicleList.value = vehicles
      demands.value = demandsData
      availableVehicles.value = vehicles.filter(v => v.status === 'idle')
      loading.value = false
      if (vehicles.length === 0 && demandsData.length === 0) {
        empty.value = true
      }
    } catch (e) {
      error.value = true
      errorMessage.value = '数据加载失败：' + e.message
      loading.value = false
    }
  }, 500)
}

// 标记点击
function showVehicleDetail(vehicle) {
  detailVehicle.value = vehicle
  detailVisible.value = true
}

// 看板筛选
function filterByStatus(status) {
  // 简单高亮，实际可地图定位等
  console.log('筛选状态：', status)
}

function vehicleMarkerStyle(vehicle) {
  const positions = {
    V001: { left: '28%', top: '62%' },
    V002: { left: '72%', top: '30%' },
    V003: { left: '44%', top: '42%' },
  }
  const fallback = { left: '52%', top: '54%' }
  return positions[vehicle.id] || positions[vehicle.vehicleId] || fallback
}

// 打开派车面板
function openDispatchPanel(demand) {
  selectedDemand.value = demand
  showDispatchPanel.value = true
}

// 确认派车
function confirmDispatch() {
  if (!selectedVehicleId.value) {
    alert('请选择车辆')
    return
  }
  // 模拟派车成功
  alert(`派车成功：需求 ${selectedDemand.value?.id} 分配到车辆 ${selectedVehicleId.value}`)
  showDispatchPanel.value = false
  selectedVehicleId.value = ''
  // 刷新数据
  fetchData()
}

onMounted(fetchData)
</script>

<style scoped>
.dispatch-workbench {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}
.loading-mask,
.empty-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.map-area {
  flex: 1;
  background: #e8ecf0;
  position: relative;
}
.yard-map {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(circle at 18% 78%, rgba(34, 197, 94, 0.13), transparent 24%),
    linear-gradient(135deg, #eef5ec 0%, #e7eef2 48%, #edf1f5 100%);
}
.map-toolbar {
  position: absolute;
  z-index: 5;
  top: 18px;
  left: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.map-toolbar div {
  display: grid;
  gap: 4px;
  padding: 10px 12px;
  border: 1px solid rgba(148, 163, 184, .45);
  border-radius: 8px;
  background: rgba(255, 255, 255, .82);
  box-shadow: 0 8px 20px rgba(15, 23, 42, .08);
}
.map-toolbar strong {
  font-size: 15px;
}
.map-toolbar span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}
.map-toolbar button {
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, .9);
  color: #334155;
  font-weight: 800;
}
.map-grid {
  position: absolute;
  inset: 0;
  opacity: .42;
  background-image:
    linear-gradient(rgba(100, 116, 139, .17) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 116, 139, .17) 1px, transparent 1px);
  background-size: 56px 56px;
}
.road {
  position: absolute;
  z-index: 1;
  background: #d9e1e8;
  border: 1px solid rgba(148, 163, 184, .35);
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, .55);
}
.road-main {
  left: 8%;
  right: 8%;
  top: 57%;
  height: 58px;
  transform: rotate(-6deg);
}
.road-vertical {
  left: 51%;
  top: 16%;
  bottom: 18%;
  width: 50px;
  transform: rotate(5deg);
}
.road-loop {
  left: 18%;
  top: 24%;
  width: 62%;
  height: 42%;
  border-radius: 28px;
  background: transparent;
  border: 26px solid #d9e1e8;
}
.route-line {
  position: absolute;
  z-index: 2;
  height: 4px;
  border-radius: 999px;
  background: repeating-linear-gradient(90deg, #2563eb 0 14px, transparent 14px 22px);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
}
.route-line-primary {
  left: 25%;
  top: 61%;
  width: 43%;
  transform: rotate(-7deg);
}
.route-line-secondary {
  left: 31%;
  top: 47%;
  width: 31%;
  transform: rotate(-39deg);
  background: repeating-linear-gradient(90deg, #f59e0b 0 14px, transparent 14px 22px);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, .14);
}
.zone {
  position: absolute;
  z-index: 3;
  display: grid;
  place-items: center;
  min-width: 96px;
  min-height: 58px;
  border: 1px solid rgba(100, 116, 139, .28);
  border-radius: 8px;
  background: rgba(255, 255, 255, .72);
  color: #1e293b;
  font-weight: 900;
  box-shadow: 0 10px 24px rgba(15, 23, 42, .08);
}
.gate-zone {
  left: 12%;
  top: 58%;
  background: rgba(219, 234, 254, .78);
}
.warehouse-zone {
  right: 16%;
  top: 20%;
  width: 138px;
  height: 82px;
  background: rgba(224, 242, 254, .82);
}
.yard-zone {
  right: 18%;
  bottom: 22%;
  width: 148px;
  height: 86px;
  background: rgba(220, 252, 231, .78);
}
.loading-zone {
  left: 35%;
  top: 30%;
  width: 126px;
  height: 72px;
  background: rgba(254, 243, 199, .78);
}
.office-zone {
  left: 43%;
  bottom: 18%;
  width: 118px;
  height: 68px;
  background: rgba(237, 233, 254, .78);
}
.vehicle-marker {
  position: absolute;
  z-index: 6;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(15, 23, 42, .18);
  border-radius: 999px;
  padding: 7px 10px;
  background: #fff;
  color: #0f172a;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 12px 26px rgba(15, 23, 42, .18);
  cursor: pointer;
}
.vehicle-marker:hover {
  outline: 3px solid rgba(37, 99, 235, .18);
}
.vehicle-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, .18);
}
.vehicle-marker.is-busy .vehicle-dot {
  background: #f59e0b;
  box-shadow: 0 0 0 4px rgba(245, 158, 11, .18);
}
.vehicle-marker.is-error .vehicle-dot {
  background: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, .18);
}
.map-scale {
  position: absolute;
  left: 22px;
  bottom: 22px;
  z-index: 5;
  display: grid;
  gap: 4px;
  color: #475569;
  font-size: 12px;
  font-weight: 800;
}
.map-scale span {
  width: 84px;
  height: 6px;
  border-inline: 2px solid #475569;
  border-bottom: 2px solid #475569;
}
.map-legend {
  position: absolute;
  right: 20px;
  bottom: 20px;
  z-index: 5;
  display: flex;
  gap: 10px;
  padding: 9px 11px;
  border: 1px solid rgba(148, 163, 184, .42);
  border-radius: 8px;
  background: rgba(255, 255, 255, .86);
  color: #475569;
  font-size: 12px;
  font-weight: 800;
}
.map-legend span {
  display: inline-flex;
  align-items: center;
  gap: 5px;
}
.legend-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #22c55e;
}
.legend-dot.busy {
  background: #f59e0b;
}
.legend-dot.error {
  background: #ef4444;
}
.side-panel {
  width: 360px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
  overflow-y: auto;
}
.status-dashboard {
  display: flex;
  gap: 8px;
  padding: 12px;
  flex-wrap: wrap;
  border-bottom: 1px solid #eee;
}
.demand-list {
  flex: 1;
  padding: 12px;
}
.demand-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.dispatch-panel {
  padding: 12px;
  border-top: 1px solid #ddd;
  background: #fafafa;
}
.no-demand {
  color: #999;
  text-align: center;
  padding: 20px;
}
</style>
