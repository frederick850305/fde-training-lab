<template>
  <div class="dispatch-workbench" v-loading="loadingState">
    <!-- Error State -->
    <div v-if="errorState" class="error-state">
      <p>数据加载失败，请重试</p>
      <button @click="loadData">重试</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="emptyState" class="empty-state">
      <p>暂无调度数据</p>
    </div>

    <!-- Success State -->
    <div v-else class="workbench-layout">
      <!-- Map Area -->
      <div class="map-area">
        <div class="map-placeholder">
          <h3>实时车辆位置</h3>
          <div class="vehicle-markers">
            <div 
              v-for="vehicle in normalizedVehicleList" 
              :key="vehicle.id" 
              class="vehicle-marker"
              @click="onVehicleClick(vehicle)"
            >
              <span class="plate">{{ vehicle.plate }}</span>
              <span class="status-dot" :class="vehicle.onlineStatus"></span>
              <span class="driver">{{ vehicle.driver }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Status Board -->
      <div class="status-board">
        <div 
          v-for="(count, category) in statusCounts" 
          :key="category"
          class="status-card"
          @click="onStatusCardClick(category)"
        >
          <span class="count">{{ count }}</span>
          <span class="label">{{ categoryLabels[category] }}</span>
        </div>
      </div>

      <!-- Demand List -->
      <div class="demand-list">
        <h3>待处理用车需求</h3>
        <div v-if="normalizedDemands.length === 0" class="list-empty">暂无待处理需求</div>
        <div v-else class="demand-items">
          <div v-for="demand in normalizedDemands" :key="demand.id" class="demand-item">
            <div class="demand-header">
              <span class="demand-title">{{ demand.title }}</span>
              <span class="demand-status">{{ demand.status }}</span>
            </div>
            <div class="demand-info">
              <span>申请人：{{ demand.applicant }}</span>
              <span>出发地：{{ demand.from }}</span>
              <span>目的地：{{ demand.to }}</span>
              <span>需求时间：{{ demand.requiredTime }}</span>
            </div>
            <button class="dispatch-btn" @click="openDispatchPanel(demand)">派车</button>
          </div>
        </div>
      </div>

      <!-- Dispatch Panel (drawn when active) -->
      <div v-if="dispatchPanelVisible" class="dispatch-panel">
        <h3>派车操作</h3>
        <div class="recommended-vehicles">
          <div 
            v-for="vehicle in recommendedVehicles" 
            :key="vehicle.id"
            class="vehicle-option"
          >
            <input type="radio" :value="vehicle.id" v-model="selectedVehicleId" />
            <span>{{ vehicle.plate }} - {{ vehicle.driver }}</span>
          </div>
        </div>
        <div class="panel-actions">
          <button @click="confirmDispatch" :disabled="!selectedVehicleId">确认派车</button>
          <button @click="closeDispatchPanel">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { fetchDispatchData } from '../data/mockDispatch.js';
import prototypeContract from '../prototypeContract.js';

const prototypeContext = inject('prototypeContext');
const currentRole = computed(() => prototypeContext?.currentRole || '调度员');
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey || 'dispatcher');

// State machine
const loadingState = ref(false);
const errorState = ref(false);
const emptyState = ref(false);
const dispatchData = ref(null);

// UI state
const dispatchPanelVisible = ref(false);
const selectedVehicleId = ref(null);
const selectedDemand = ref(null);

const statusCounts = ref({
  idle: 0,
  busy: 0,
  queued: 0,
  abnormal: 0
});

const categoryLabels = {
  idle: '空闲',
  busy: '任务中',
  queued: '排队',
  abnormal: '异常'
};

const normalizedDemands = ref([]);
const normalizedVehicleList = ref([]);
const recommendedVehicles = ref([]);

async function loadData() {
  loadingState.value = true;
  errorState.value = false;
  emptyState.value = false;
  try {
    const data = fetchDispatchData();
    if (!data || !data.dispatchRecords) {
      throw new Error('Invalid data');
    }
    dispatchData.value = data.dispatchRecords;
    
    // Normalize data based on schema fields
    // data should contain arrays: demand, vehicleList, etc.
    const rawDemands = data.dispatchRecords.demand || [];
    const rawVehicleList = data.dispatchRecords.vehicleList || [];
    
    // Apply role-based filtering
    let filteredDemands = rawDemands;
    let filteredVehicles = rawVehicleList;
    if (currentRoleKey.value !== 'dispatcher') {
      // For non-dispatcher roles, show only relevant subset
      filteredDemands = rawDemands.slice(0, 2);
      filteredVehicles = rawVehicleList.slice(0, 3);
    }

    // Normalize demands
    normalizedDemands.value = filteredDemands.map(d => ({
      id: d.id || d.demandId || `D${Math.random().toString(36).slice(2, 6)}`,
      title: `用车需求 ${d.demandId || d.id || ''}`,
      status: d.status || '待处理',
      applicant: d.applicant || '未知',
      from: d.from || d.start || '',
      to: d.to || d.destination || '',
      requiredTime: d.requiredTime || d.time || ''
    }));

    // Normalize vehicle list
    normalizedVehicleList.value = filteredVehicles.map(v => ({
      id: v.id || v.vehicleId || `V${Math.random().toString(36).slice(2, 6)}`,
      plate: v.plate || v.plateNumber || '未知车牌',
      onlineStatus: v.onlineStatus || v.status || 'offline',
      driver: v.driver || v.driverName || '未知司机'
    }));

    // Compute status counts from vehicle list
    statusCounts.value = {
      idle: filteredVehicles.filter(v => (v.onlineStatus || v.status) === 'idle').length,
      busy: filteredVehicles.filter(v => (v.onlineStatus || v.status) === 'busy').length,
      queued: filteredVehicles.filter(v => (v.onlineStatus || v.status) === 'queued').length,
      abnormal: filteredVehicles.filter(v => (v.onlineStatus || v.status) === 'abnormal').length
    };

    // Determine if empty
    emptyState.value = normalizedDemands.value.length === 0 && normalizedVehicleList.value.length === 0;

  } catch (e) {
    console.error(e);
    errorState.value = true;
  } finally {
    loadingState.value = false;
  }
}

function onVehicleClick(vehicle) {
  alert(`车辆信息：${vehicle.plate}\n司机：${vehicle.driver}\n状态：${vehicle.onlineStatus}`);
}

function onStatusCardClick(category) {
  // In prototype, just show a message
  alert(`筛选 ${categoryLabels[category]} 车辆`);
  // Could simulate highlighting on map
}

function openDispatchPanel(demand) {
  selectedDemand.value = demand;
  // Recommend vehicles from the current list
  recommendedVehicles.value = normalizedVehicleList.value.filter(v => v.onlineStatus === 'idle' || v.onlineStatus === 'idle');
  if (recommendedVehicles.value.length === 0) {
    // Fallback to all online
    recommendedVehicles.value = normalizedVehicleList.value.filter(v => v.onlineStatus !== 'offline');
  }
  selectedVehicleId.value = null;
  dispatchPanelVisible.value = true;
}

function confirmDispatch() {
  alert(`派车成功：需求 ${selectedDemand.value.title} 指派给车辆 ${selectedVehicleId.value}`);
  // In real scenario, would call API and refresh
  dispatchPanelVisible.value = false;
  loadData();
}

function closeDispatchPanel() {
  dispatchPanelVisible.value = false;
}

onMounted(() => {
  loadData();
});
</script>

<style scoped>
.dispatch-workbench {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
}

.loading { background: #f0f0f0; text-align: center; padding: 40px; }
.error-state { background: #ffe0e0; padding: 40px; text-align: center; }
.empty-state { background: #e0f0e0; padding: 40px; text-align: center; }

.workbench-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto 1fr auto;
  gap: 8px;
  padding: 12px;
  height: 100%;
  box-sizing: border-box;
}

.map-area {
  grid-row: 1 / 4;
  grid-column: 1;
  background: #e8f4f8;
  border-radius: 8px;
  padding: 12px;
  overflow-y: auto;
}

.map-placeholder {
  min-height: 300px;
}

.vehicle-markers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.vehicle-marker {
  background: white;
  padding: 6px 12px;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.vehicle-marker:hover {
  background: #d0e0ff;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-dot.idle { background: green; }
.status-dot.busy { background: orange; }
.status-dot.queued { background: blue; }
.status-dot.abnormal { background: red; }

.status-board {
  grid-row: 1;
  grid-column: 2;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.status-card {
  background: white;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  min-width: 60px;
}

.status-card:hover {
  background: #f0f0ff;
}

.count {
  font-size: 1.5em;
  font-weight: bold;
  display: block;
}

.label {
  font-size: 0.8em;
  color: #555;
}

.demand-list {
  grid-row: 2 / 4;
  grid-column: 2;
  background: white;
  border-radius: 8px;
  padding: 8px;
  overflow-y: auto;
}

.demand-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.demand-item {
  border: 1px solid #ddd;
  padding: 6px;
  border-radius: 4px;
}

.demand-header {
  display: flex;
  justify-content: space-between;
}

.demand-title {
  font-weight: bold;
}

.demand-info {
  font-size: 0.85em;
  color: #555;
  margin: 4px 0;
}

.dispatch-btn {
  margin-top: 4px;
  background: #4caf50;
  color: white;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.dispatch-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 360px;
  background: white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  border-radius: 8px;
  padding: 16px;
  z-index: 1000;
}

.recommended-vehicles {
  margin: 8px 0;
}

.vehicle-option {
  margin: 4px 0;
}

.panel-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.panel-actions button:first-child {
  background: #2196f3;
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.panel-actions button:last-child {
  background: #eee;
  border: none;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.list-empty {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>