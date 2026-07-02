<template>
  <section class="vehicle-filter-view" aria-labelledby="vehicle-filter-title">
    <ViewHeading
      eyebrow="P1 Prototype Page · 现场调度"
      title="现场车辆快速筛选"
      title-id="vehicle-filter-title"
      description="支持按车辆类型、状态、作业区域、距离远近等条件筛选车辆，便于调度员快速定位合适车辆。"
    />

    <!-- 筛选条件区 -->
    <div class="filter-panel" :class="{ 'filter-active': isFilterActive }">
      <div class="filter-row">
        <div class="filter-item">
          <label>车辆类型</label>
          <select v-model="filters.type">
            <option v-for="t in vehicleTypes" :key="t" :value="t === '全部' ? '' : t">{{ t }}</option>
          </select>
        </div>
        <div class="filter-item">
          <label>车辆状态</label>
          <div class="status-chips">
            <button
              v-for="s in statusOptions"
              :key="s.key"
              type="button"
              :class="{ active: filters.statuses.includes(s.key) }"
              @click="toggleStatus(s.key)"
            >
              {{ s.label }}
            </button>
          </div>
        </div>
        <div class="filter-item">
          <label>作业区域</label>
          <select v-model="filters.area">
            <option v-for="a in areas" :key="a" :value="a === '全部区域' ? '' : a">{{ a }}</option>
          </select>
        </div>
      </div>
      <div class="filter-row filter-row-bottom">
        <div class="filter-item filter-distance">
          <label>距调度员距离：<strong>{{ filters.maxDistance }} km</strong></label>
          <input
            type="range"
            min="0"
            max="50"
            step="1"
            v-model.number="filters.maxDistance"
            class="distance-slider"
          />
          <div class="distance-labels"><span>0</span><span>25</span><span>50 km</span></div>
        </div>
        <div class="filter-item filter-summary" v-if="isFilterActive">
          <span class="filter-badge">已筛选 {{ activeFilterCount }} 项</span>
          <button type="button" class="reset-link" @click="resetFilters">重置筛选</button>
        </div>
      </div>
    </div>

    <!-- 加载态 -->
    <div v-if="listState === 'loading'" class="state-box">
      <div class="skeleton-list">
        <div v-for="n in 3" :key="n" class="skeleton-row">
          <div class="sk-circle"></div>
          <div class="sk-lines">
            <div class="sk-line w-60"></div>
            <div class="sk-line w-40"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="listState === 'error'" class="state-box error-box">
      <span class="state-icon">⚠️</span>
      <p>筛选项加载失败</p>
      <button type="button" class="retry-btn" @click="retryLoad">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredVehicles.length === 0" class="state-box">
      <span class="state-icon">🔍</span>
      <p>没有符合条件的车辆</p>
      <small>尝试调整筛选条件</small>
      <button type="button" class="text-btn" @click="resetFilters">清除筛选条件</button>
    </div>

    <!-- 车辆结果列表 -->
    <div v-else class="vehicle-results">
      <div class="results-header">
        <span>共 <strong>{{ filteredVehicles.length }}</strong> 辆车匹配</span>
        <span v-if="selectedIds.length">已选 <strong>{{ selectedIds.length }}</strong> 辆</span>
      </div>
      <div
        v-for="vehicle in filteredVehicles"
        :key="vehicle.id"
        class="vehicle-row"
        :class="{ selected: selectedIds.includes(vehicle.id) }"
        @click="toggleSelect(vehicle.id)"
      >
        <span
          class="row-check"
          :class="{ checked: selectedIds.includes(vehicle.id) }"
        >{{ selectedIds.includes(vehicle.id) ? '✓' : '' }}</span>
        <div class="row-info">
          <div class="row-main">
            <strong>{{ vehicle.plate }}</strong>
            <span class="row-type">{{ vehicle.type }}</span>
            <span class="row-status-tag" :class="'status-' + vehicle.status">
              {{ vehicleStatusMap[vehicle.status].label }}
            </span>
          </div>
          <div class="row-meta">
            <span>📍 {{ vehicle.area }}</span>
            <span>👤 {{ vehicle.driver }}</span>
            <span>📦 {{ vehicle.loadCapacity }}</span>
            <span>📏 {{ vehicle.distance }} km</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar" :class="{ active: selectedIds.length > 0 }">
      <button type="button" class="ghost-btn" @click="resetFilters">重置筛选</button>
      <button
        type="button"
        class="primary-btn"
        :disabled="selectedIds.length === 0"
        @click="confirmDispatch"
      >
        {{ selectedIds.length ? `选定派车（${selectedIds.length}辆）` : '选定派车' }}
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import {
  areas,
  filterVehicles,
  vehicleStatusMap,
  vehicleTypes,
} from '../data/vehicleFilterMock'

const listState = ref('loading')

const filters = reactive({
  type: '',
  statuses: [],
  area: '',
  maxDistance: 50,
})

const selectedIds = ref([])

const statusOptions = [
  { key: 'idle', label: '空闲' },
  { key: 'queuing', label: '排队' },
  { key: 'onTask', label: '任务中' },
  { key: 'abnormal', label: '异常' },
]

const isFilterActive = computed(() => activeFilterCount.value > 0)
const activeFilterCount = computed(() => {
  let count = 0
  if (filters.type) count++
  if (filters.statuses.length) count++
  if (filters.area) count++
  if (filters.maxDistance < 50) count++
  return count
})

const filteredVehicles = computed(() => {
  let result = [...filterVehicles]

  if (filters.type) {
    result = result.filter((v) => v.type === filters.type)
  }
  if (filters.statuses.length) {
    result = result.filter((v) => filters.statuses.includes(v.status))
  }
  if (filters.area) {
    result = result.filter((v) => v.area === filters.area)
  }

  result = result.filter((v) => v.distance <= filters.maxDistance)
  result.sort((a, b) => a.distance - b.distance)

  return result
})

function toggleStatus(key) {
  const idx = filters.statuses.indexOf(key)
  if (idx >= 0) {
    filters.statuses.splice(idx, 1)
  } else {
    filters.statuses.push(key)
  }
  selectedIds.value = []
}

function toggleSelect(id) {
  const idx = selectedIds.value.indexOf(id)
  if (idx >= 0) {
    selectedIds.value.splice(idx, 1)
  } else {
    selectedIds.value.push(id)
  }
}

function resetFilters() {
  filters.type = ''
  filters.statuses = []
  filters.area = ''
  filters.maxDistance = 50
  selectedIds.value = []
}

function confirmDispatch() {
  const plates = selectedIds.value
    .map((id) => filterVehicles.find((v) => v.id === id)?.plate)
    .filter(Boolean)
  alert(`已选定 ${selectedIds.value.length} 辆车：\n${plates.join('\n')}\n\n将进入派车流程（下一节实现）。`)
}

function retryLoad() {
  listState.value = 'loading'
  setTimeout(() => { listState.value = 'success' }, 600)
}

onMounted(() => {
  setTimeout(() => {
    listState.value = filterVehicles.length > 0 ? 'success' : 'empty'
  }, 500)
})
</script>

<style scoped>
.vehicle-filter-view { margin-top: 16px; }

/* ===== 筛选面板 ===== */
.filter-panel {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 18px;
  background: #ffffff;
  margin-bottom: 14px;
  transition: background 0.2s;
}
.filter-panel.filter-active { background: #eff6ff; border-color: #93c5fd; }

.filter-row {
  display: flex; gap: 16px; flex-wrap: wrap; align-items: flex-end;
}
.filter-row-bottom { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; }

.filter-item { display: grid; gap: 6px; }
.filter-item label { font-size: 12px; color: #64748b; font-weight: 800; }
.filter-item label strong { color: #1d4ed8; }

.filter-item select {
  padding: 6px 12px; border: 1px solid #e2e8f0; border-radius: 6px;
  font-size: 13px; color: #0f172a; background: #ffffff; cursor: pointer; outline: none;
  min-width: 120px;
}

.status-chips { display: flex; gap: 4px; flex-wrap: wrap; }
.status-chips button {
  padding: 5px 12px; border: 1px solid #e2e8f0; border-radius: 16px;
  background: #ffffff; color: #475569; font-size: 12px; font-weight: 700;
  cursor: pointer; transition: all 0.15s;
}
.status-chips button:hover { border-color: #93c5fd; }
.status-chips button.active { border-color: #1d4ed8; background: #1d4ed8; color: #ffffff; }

.filter-distance { flex: 1; min-width: 200px; }
.distance-slider {
  width: 100%; height: 6px; -webkit-appearance: none;
  background: #e2e8f0; border-radius: 3px; outline: none; cursor: pointer;
}
.distance-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 18px; height: 18px;
  border-radius: 50%; background: #1d4ed8; cursor: pointer; border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.distance-labels { display: flex; justify-content: space-between; font-size: 10px; color: #94a3b8; }

.filter-summary { display: flex; align-items: center; gap: 10px; }
.filter-badge {
  display: inline-block; padding: 3px 10px; border-radius: 12px;
  background: #dbeafe; color: #1d4ed8; font-size: 12px; font-weight: 800;
}
.reset-link {
  border: none; background: transparent; color: #64748b; font-size: 12px;
  font-weight: 700; cursor: pointer; text-decoration: underline;
}

/* ===== 状态占位 ===== */
.state-box {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 220px; border: 1px solid #e2e8f0; border-radius: 10px;
  background: #ffffff; text-align: center; padding: 32px;
}
.state-icon { font-size: 48px; }
.state-box p { margin: 8px 0 4px; color: #64748b; font-size: 14px; }
.state-box small { color: #94a3b8; font-size: 12px; }
.error-box p { color: #dc2626; }
.text-btn { margin-top: 10px; border: none; background: transparent; color: #2563eb; font-weight: 700; font-size: 13px; cursor: pointer; }
.retry-btn { margin-top: 10px; padding: 6px 16px; border: 1px solid #2563eb; border-radius: 6px; background: #fff; color: #2563eb; font-weight: 700; cursor: pointer; }

/* 骨架屏 */
.skeleton-list { display: grid; gap: 8px; width: 100%; }
.skeleton-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; border-radius: 8px; background: #f8fafc; }
.sk-circle { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.sk-lines { display: grid; gap: 6px; flex: 1; }
.sk-line { height: 12px; border-radius: 4px; background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
.w-60 { width: 60%; } .w-40 { width: 40%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }

/* ===== 车辆列表 ===== */
.vehicle-results {
  border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff; overflow: hidden;
}
.results-header {
  display: flex; justify-content: space-between;
  padding: 10px 18px; background: #f8fafc; border-bottom: 1px solid #e2e8f0;
  font-size: 12px; color: #64748b; font-weight: 600;
}
.results-header strong { color: #0f172a; }

.vehicle-row {
  display: flex; align-items: center; gap: 12px; padding: 12px 18px;
  border-bottom: 1px solid #f8fafc; cursor: pointer; transition: background 0.12s;
}
.vehicle-row:last-child { border-bottom: none; }
.vehicle-row:hover { background: #f8fafc; }
.vehicle-row.selected { background: #eff6ff; }

.row-check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 24px; height: 24px; border: 2px solid #cbd5e1; border-radius: 6px;
  flex-shrink: 0; font-size: 14px;
}
.row-check.checked { border-color: #1d4ed8; background: #1d4ed8; color: #ffffff; }

.row-info { flex: 1; min-width: 0; }
.row-main { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; flex-wrap: wrap; }
.row-main strong { color: #0f172a; font-size: 14px; }
.row-type { font-size: 11px; color: #64748b; background: #f1f5f9; padding: 1px 6px; border-radius: 4px; }
.row-status-tag {
  display: inline-block; padding: 1px 8px; border-radius: 10px; font-size: 10px; font-weight: 900;
}
.row-status-tag.status-idle { background: #dcfce7; color: #16a34a; }
.row-status-tag.status-queuing { background: #fef3c7; color: #d97706; }
.row-status-tag.status-onTask { background: #dbeafe; color: #2563eb; }
.row-status-tag.status-abnormal { background: #fee2e2; color: #dc2626; }

.row-meta { display: flex; gap: 12px; flex-wrap: wrap; }
.row-meta span { font-size: 12px; color: #94a3b8; }

/* ===== 底部操作栏 ===== */
.bottom-bar {
  display: flex; justify-content: flex-end; gap: 10px;
  margin-top: 16px; padding: 12px 18px;
  border: 1px solid #e2e8f0; border-radius: 10px; background: #ffffff;
}
.bottom-bar.active { border-color: #93c5fd; background: #eff6ff; }

.ghost-btn {
  padding: 8px 18px; border: 1px solid #e2e8f0; border-radius: 8px;
  background: #ffffff; color: #475569; font-weight: 700; font-size: 13px; cursor: pointer;
}
.primary-btn {
  padding: 8px 22px; border: none; border-radius: 8px;
  background: #1d4ed8; color: #ffffff; font-weight: 800; font-size: 13px; cursor: pointer;
}
.primary-btn:disabled { background: #94a3b8; cursor: not-allowed; }

/* ===== 响应式 ===== */
@media (max-width: 680px) {
  .filter-row { flex-direction: column; }
  .filter-item select { min-width: 100%; }
  .vehicle-row { padding: 10px 12px; }
  .row-meta { gap: 8px; }
}
</style>
