<template>
  <div class="dispatch-workbench">
    <!-- 加载态 -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton skeleton-map"></div>
      <div class="skeleton skeleton-card"></div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="error" class="error-state">
      <span>⚠️</span><p>{{ error }}</p>
      <button @click="loadData">重试</button>
    </div>

    <!-- 正常态 -->
    <template v-else>
      <div class="main-layout">
        <!-- 地图区域 -->
        <div class="map-zone">
          <div class="map-placeholder">
            <span>🗺️</span>
            <p>车辆实时地图</p>
            <small>{{ vehicleList.length }} 辆车在线</small>
            <div class="map-vehicles">
              <div v-for="v in vehicleList" :key="v.vehicleId" class="map-dot" :class="'dot-' + (v.onlineStatus === '空闲' ? 'idle' : v.onlineStatus === '异常' ? 'abnormal' : 'busy')" :style="{ left: (Math.random() * 80 + 10) + '%', top: (Math.random() * 70 + 15) + '%' }" @click="selectVehicle(v)">
                <span class="dot-label">{{ v.plate }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 状态看板 -->
          <div class="status-board">
            <div class="stat-card" v-for="stat in statusStats" :key="stat.label" @click="filterByStatus(stat.label)">
              <strong>{{ stat.count }}</strong>
              <span>{{ stat.label }}</span>
            </div>
          </div>

          <!-- 需求列表 -->
          <div class="demand-list" v-if="demands.length">
            <h4>📋 待处理用车需求</h4>
            <div v-for="d in demands" :key="d.demandId" class="demand-item">
              <div class="demand-info">
                <span class="demand-priority" :class="'pri-' + d.priority">{{ d.priority }}</span>
                <strong>{{ d.demandTitle }}</strong>
                <small>{{ d.applicant }} · {{ d.departure }} → {{ d.destination }}</small>
              </div>
              <button class="dispatch-btn" @click="openDispatchPanel(d)">派车</button>
            </div>
          </div>
          <div v-else class="empty-hint">暂无待处理需求</div>
        </div>
      </div>
    </template>

    <!-- 车辆详情弹窗 -->
    <DetailPanel :visible="selectedVehicle !== null" title="车辆详情" @close="selectedVehicle = null">
      <template v-if="selectedVehicle">
        <div class="vehicle-detail">
          <div class="detail-row"><span>车牌号</span><strong>{{ selectedVehicle.plate }}</strong></div>
          <div class="detail-row"><span>车辆类型</span><strong>{{ selectedVehicle.vehicleType }}</strong></div>
          <div class="detail-row"><span>当前位置</span><strong>{{ selectedVehicle.currentLocation }}</strong></div>
          <div class="detail-row"><span>司机</span><strong>{{ selectedVehicle.driver }}</strong></div>
          <div class="detail-row"><span>状态</span><StatusTag :status="selectedVehicle.onlineStatus" /></div>
        </div>
      </template>
    </DetailPanel>

    <!-- 派车面板 -->
    <DetailPanel :visible="dispatching" title="派车确认" @close="dispatching = null">
      <template v-if="dispatching">
        <p style="font-size:13px;color:#64748b">{{ dispatching.demandTitle }}</p>
        <h4 style="margin:12px 0 8px">推荐车辆</h4>
        <div v-for="v in vehicleList.filter(x => x.onlineStatus === '空闲')" :key="v.vehicleId" class="vehicle-option" @click="doDispatch(v)">
          <div><strong>{{ v.plate }}</strong><small>{{ v.driver }}</small></div>
          <StatusTag :status="v.onlineStatus" />
        </div>
      </template>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchDispatchData } from '../data/mockDispatch.js'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'

const loading = ref(true)
const error = ref('')
const vehicleList = ref([])
const demands = ref([])
const selectedVehicle = ref(null)
const dispatching = ref(null)

const statusStats = computed(() => {
  const total = vehicleList.value.length
  const idle = vehicleList.value.filter(v => v.onlineStatus === '空闲').length
  const busy = vehicleList.value.filter(v => v.onlineStatus === '任务中').length
  const queued = vehicleList.value.filter(v => v.onlineStatus === '排队').length
  const abnormal = vehicleList.value.filter(v => v.onlineStatus === '异常').length
  return [
    { label: '空闲', count: idle },
    { label: '任务中', count: busy },
    { label: '排队', count: queued },
    { label: '异常', count: abnormal },
  ]
})

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchDispatchData()
    vehicleList.value = data.vehicles || []
    demands.value = data.demands || []
  } catch (e) {
    error.value = '数据加载失败，请检查网络'
  } finally {
    loading.value = false
  }
}

function selectVehicle(v) { selectedVehicle.value = v }
function openDispatchPanel(d) { dispatching.value = d }
function doDispatch(v) {
  alert(`派车成功！车辆 ${v.plate}（司机：${v.driver}）已分配任务。`)
  dispatching.value = null
}
function filterByStatus(status) {
  alert(`筛选状态：${status}`)
}

onMounted(loadData)
</script>

<style scoped>
.dispatch-workbench { height: 100%; }
.main-layout { display: grid; grid-template-columns: 1fr 360px; gap: 16px; height: 100%; padding: 16px; }
.map-zone { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.map-placeholder { position: relative; height: 100%; min-height: 400px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafc; color: #64748b; }
.map-placeholder span { font-size: 48px; }
.map-placeholder p { margin: 4px 0; font-weight: 700; }
.map-vehicles { position: absolute; inset: 0; }
.map-dot { position: absolute; transform: translate(-50%,-50%); cursor: pointer; }
.dot-label { display: block; padding: 2px 6px; border-radius: 4px; font-size: 10px; white-space: nowrap; font-weight: 700; }
.dot-idle .dot-label { background: #e6f7e6; color: #1a7a1a; border: 1px solid #1a7a1a; }
.dot-busy .dot-label { background: #e6f0ff; color: #1a56db; border: 1px solid #1a56db; }
.dot-abnormal .dot-label { background: #ffeaea; color: #c62828; border: 1px solid #c62828; animation: blink 1s infinite; }
@keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
.right-panel { display: flex; flex-direction: column; gap: 12px; min-height: 0; overflow-y: auto; }
.status-board { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.stat-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; text-align: center; cursor: pointer; }
.stat-card strong { display: block; font-size: 22px; color: #1e293b; }
.stat-card span { font-size: 12px; color: #64748b; }
.stat-card:hover { border-color: #1a56db; }
.demand-list { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; }
.demand-list h4 { margin: 0 0 8px; font-size: 14px; }
.demand-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
.demand-item:last-child { border: none; }
.demand-info { display: grid; gap: 4px; }
.demand-info strong { font-size: 13px; }
.demand-info small { font-size: 11px; color: #64748b; }
.demand-priority { display: inline-block; padding: 1px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; }
.pri-高 { background: #ffeaea; color: #c62828; }
.pri-中 { background: #fff3e0; color: #d84315; }
.dispatch-btn { padding: 5px 14px; background: #1a56db; color: #fff; border: none; border-radius: 7px; font-size: 12px; font-weight: 700; cursor: pointer; }
.vehicle-detail { display: grid; gap: 12px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; }
.detail-row span { font-size: 13px; color: #64748b; }
.vehicle-option { display: flex; justify-content: space-between; align-items: center; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 6px; cursor: pointer; }
.vehicle-option:hover { border-color: #1a56db; background: #f0f4ff; }
.vehicle-option strong { font-size: 13px; margin-right: 8px; }
.vehicle-option small { color: #64748b; font-size: 12px; }
.loading-state { padding: 40px; display: grid; gap: 16px; }
.skeleton { background: #e2e8f0; border-radius: 10px; animation: shimmer 1.5s infinite; }
.skeleton-map { height: 300px; }
.skeleton-card { height: 100px; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-hint { text-align: center; color: #94a3b8; padding: 20px; font-size: 13px; }
</style>
