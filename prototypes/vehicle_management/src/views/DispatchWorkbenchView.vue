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
          <svg class="factory-map" viewBox="0 0 800 560">
            <!-- 厂区背景 -->
            <rect x="0" y="0" width="800" height="560" fill="#f0f4e8" rx="8" />
            <!-- 厂区边框 -->
            <rect x="8" y="8" width="784" height="544" fill="none" stroke="#8b9b6a" stroke-width="2" rx="4" stroke-dasharray="8,4" />
            <text x="400" y="30" text-anchor="middle" font-size="13" fill="#6b7b4a" font-weight="700">🏭 HG 海工基地厂区示意</text>

            <!-- 主干道 -->
            <rect x="8" y="260" width="784" height="40" fill="#d4d4c8" stroke="#b0b0a0" stroke-width="1" />
            <text x="400" y="284" text-anchor="middle" font-size="10" fill="#888">主干道</text>
            <!-- 纵向道路 -->
            <rect x="380" y="50" width="40" height="502" fill="#d4d4c8" stroke="#b0b0a0" stroke-width="1" />

            <!-- A区仓库 -->
            <rect x="24" y="64" width="160" height="100" fill="#e8e0d0" stroke="#a08060" stroke-width="1.5" rx="4" />
            <text x="104" y="110" text-anchor="middle" font-size="13" fill="#6b5040" font-weight="700">📦 A区仓库</text>
            <text x="104" y="130" text-anchor="middle" font-size="10" fill="#8b7060">材料库 · 设备库</text>

            <!-- 东区堆场 -->
            <rect x="210" y="64" width="140" height="100" fill="#e0e8d8" stroke="#7a9a5a" stroke-width="1.5" rx="4" />
            <text x="280" y="110" text-anchor="middle" font-size="13" fill="#4a6a2a" font-weight="700">🏗️ 东区堆场</text>
            <text x="280" y="130" text-anchor="middle" font-size="10" fill="#6a8a4a">吊装 · 转运区</text>

            <!-- 调度中心 -->
            <rect x="436" y="64" width="140" height="60" fill="#dce8f8" stroke="#5a80b0" stroke-width="1.5" rx="4" />
            <text x="506" y="90" text-anchor="middle" font-size="13" fill="#3a6090" font-weight="700">🏢 调度中心</text>
            <text x="506" y="108" text-anchor="middle" font-size="10" fill="#5a80b0">指挥 · 监控</text>

            <!-- B区产线 -->
            <rect x="436" y="140" width="140" height="100" fill="#e8e4f0" stroke="#7a6aaa" stroke-width="1.5" rx="4" />
            <text x="506" y="186" text-anchor="middle" font-size="13" fill="#4a3a7a" font-weight="700">🏭 B区产线</text>
            <text x="506" y="206" text-anchor="middle" font-size="10" fill="#6a5a9a">3号车间 · 装配线</text>

            <!-- 行政楼 -->
            <rect x="610" y="64" width="170" height="90" fill="#f0ece4" stroke="#a09060" stroke-width="1.5" rx="4" />
            <text x="695" y="106" text-anchor="middle" font-size="13" fill="#706030" font-weight="700">🏛️ 行政楼</text>
            <text x="695" y="126" text-anchor="middle" font-size="10" fill="#908050">办公 · 接待</text>

            <!-- 维修车间 -->
            <rect x="24" y="320" width="160" height="80" fill="#f0e0d8" stroke="#b07050" stroke-width="1.5" rx="4" />
            <text x="104" y="356" text-anchor="middle" font-size="13" fill="#804020" font-weight="700">🔧 维修车间</text>
            <text x="104" y="376" text-anchor="middle" font-size="10" fill="#a06040">保养 · 检修</text>

            <!-- 南门岗 -->
            <rect x="210" y="320" width="140" height="80" fill="#f8e8d8" stroke="#b08040" stroke-width="1.5" rx="4" />
            <text x="280" y="356" text-anchor="middle" font-size="13" fill="#805020" font-weight="700">🚧 南门岗</text>
            <text x="280" y="376" text-anchor="middle" font-size="10" fill="#a07030">入场核验 · 道闸</text>

            <!-- 材料库 -->
            <rect x="436" y="320" width="140" height="80" fill="#e0e4d8" stroke="#8a9a6a" stroke-width="1.5" rx="4" />
            <text x="506" y="356" text-anchor="middle" font-size="13" fill="#5a6a3a" font-weight="700">📋 物资中心</text>
            <text x="506" y="376" text-anchor="middle" font-size="10" fill="#7a8a5a">提货 · 配送</text>

            <!-- 停车场 -->
            <rect x="610" y="200" width="170" height="60" fill="#eaeaea" stroke="#aaa" stroke-width="1" rx="4" />
            <text x="695" y="236" text-anchor="middle" font-size="12" fill="#777" font-weight="700">🅿️ 停车场</text>

            <!-- 东门岗 -->
            <rect x="610" y="320" width="170" height="80" fill="#f8e8d8" stroke="#b08040" stroke-width="1.5" rx="4" />
            <text x="695" y="356" text-anchor="middle" font-size="13" fill="#805020" font-weight="700">🚧 东门岗</text>
            <text x="695" y="376" text-anchor="middle" font-size="10" fill="#a07030">临时车辆 · 外协入口</text>

            <!-- 车辆图标 -->
            <g v-for="v in vehicleList" :key="v.vehicleId" class="vehicle-icon-group" @click="selectVehicle(v, $event)">
              <!-- 图标背景圆 -->
              <circle :cx="getVehiclePos(v).x" :cy="getVehiclePos(v).y" r="16" :fill="getStatusColor(v.onlineStatus)" stroke="#fff" stroke-width="2" opacity="0.9" />
              <!-- 车辆 emoji -->
              <text :x="getVehiclePos(v).x" :y="getVehiclePos(v).y + 5" text-anchor="middle" font-size="18">{{ getVehicleIcon(v.vehicleType) }}</text>
            </g>

            <!-- 车辆 popup -->
            <g v-if="hoveredVehicle" class="vehicle-popup">
              <rect :x="hoveredPos.x - 90" :y="hoveredPos.y - 90" width="180" height="75" rx="8" fill="#fff" stroke="#e2e8f0" stroke-width="1" filter="url(#shadow)" />
              <text :x="hoveredPos.x" :y="hoveredPos.y - 62" text-anchor="middle" font-size="13" font-weight="700" fill="#1e293b">{{ hoveredVehicle.plate }}</text>
              <text :x="hoveredPos.x" :y="hoveredPos.y - 44" text-anchor="middle" font-size="11" fill="#64748b">{{ hoveredVehicle.vehicleType }} · {{ hoveredVehicle.driver }}</text>
              <text :x="hoveredPos.x" :y="hoveredPos.y - 28" text-anchor="middle" font-size="11" fill="#94a3b8">{{ hoveredVehicle.currentLocation }}</text>
            </g>

            <!-- 阴影滤镜 -->
            <defs>
              <filter id="shadow">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000" flood-opacity="0.12" />
              </filter>
            </defs>

            <!-- 图例 -->
            <g transform="translate(24, 440)">
              <rect x="0" y="0" width="752" height="36" fill="#fff" stroke="#e2e8f0" stroke-width="1" rx="6" />
              <circle cx="30" cy="18" r="8" fill="#0d904f" />
              <text x="44" y="22" font-size="12" fill="#475569">空闲</text>
              <circle cx="120" cy="18" r="8" fill="#1a56db" />
              <text x="134" y="22" font-size="12" fill="#475569">任务中</text>
              <circle cx="210" cy="18" r="8" fill="#f5a623" />
              <text x="224" y="22" font-size="12" fill="#475569">排队</text>
              <circle cx="290" cy="18" r="8" fill="#c62828" />
              <text x="304" y="22" font-size="12" fill="#475569">异常</text>

              <text x="430" y="22" font-size="11" fill="#94a3b8">点击车辆图标查看详情</text>
            </g>
          </svg>
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
    <DetailPanel :visible="selectedVehicle !== null && !hoveredVehicle" title="车辆详情" @close="selectedVehicle = null">
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
const hoveredVehicle = ref(null)
const hoveredPos = ref({ x: 0, y: 0 })

// 车辆在厂区地图中的固定位置
const vehiclePositions = {
  'V-001': { x: 104, y: 145 },   // A区仓库附近 → 空闲
  'V-002': { x: 506, y: 230 },   // B区产线附近 → 任务中
  'V-003': { x: 280, y: 145 },   // 东区堆场附近 → 空闲
  'V-004': { x: 695, y: 236 },   // 停车场 → 排队
  'V-005': { x: 280, y: 380 },   // 南门岗附近 → 异常
}

function getVehiclePos(v) {
  return vehiclePositions[v.vehicleId] || { x: 400, y: 200 }
}

function getStatusColor(status) {
  const map = { '空闲': '#0d904f', '任务中': '#1a56db', '排队': '#f5a623', '异常': '#c62828' }
  return map[status] || '#94a3b8'
}

function getVehicleIcon(vehicleType) {
  if (vehicleType?.includes('重型')) return '🚛'
  if (vehicleType?.includes('厢式')) return '🚚'
  return '🚗'
}

const statusStats = computed(() => {
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

function selectVehicle(v, event) {
  hoveredVehicle.value = v
  if (event) {
    const svg = event.target.closest('svg')
    const rect = svg.getBoundingClientRect()
    const svgPoint = svg.createSVGPoint()
    svgPoint.x = event.clientX - rect.left
    svgPoint.y = event.clientY - rect.top
    // 根据 viewBox 缩放
    const scaleX = 800 / rect.width
    const scaleY = 560 / rect.height
    hoveredPos.value = {
      x: svgPoint.x * scaleX,
      y: svgPoint.y * scaleY,
    }
  }
}

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
.map-zone { background: #fff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; display: flex; }
.factory-map { width: 100%; height: 100%; min-height: 500px; }

.vehicle-icon-group { cursor: pointer; transition: transform .15s; }
.vehicle-icon-group:hover { transform-origin: center; }
.vehicle-icon-group:hover circle { filter: brightness(1.1); stroke-width: 3; }

.vehicle-popup { pointer-events: none; }

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
