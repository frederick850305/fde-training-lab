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
          <div class="map-placeholder">
            <p>地图区域（此处集成高德/百度地图）</p>
            <div
              v-for="vehicle in vehicleList"
              :key="vehicle.id"
              class="vehicle-marker"
              @click="showVehicleDetail(vehicle)"
            >
              {{ vehicle.plate }}
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
.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.vehicle-marker {
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
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