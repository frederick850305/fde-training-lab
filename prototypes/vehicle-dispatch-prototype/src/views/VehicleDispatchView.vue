<template>
  <section class="page-grid dispatch-view">
    <header class="page-header">
      <div>
        <span class="eyebrow">调度指挥</span>
        <h1>车辆调度看板</h1>
        <p>实时查看车辆位置、任务请求、作业区域和异常告警，支持筛选、派车和告警处理。</p>
      </div>
      <div class="header-actions">
        <select v-model="filters.area">
          <option value="">全部区域</option>
          <option>总装一区</option>
          <option>码头堆场</option>
          <option>门岗南区</option>
        </select>
        <select v-model="filters.type">
          <option value="">全部车型</option>
          <option>生产车</option>
          <option>物流车</option>
          <option>外协车</option>
          <option>临时车</option>
        </select>
        <button class="primary-btn" type="button" @click="assignBestVehicle">智能推荐派车</button>
      </div>
    </header>

    <section class="panel map-panel">
      <div class="panel-title">
        <strong>厂区实时地图</strong>
        <span>{{ filteredVehicles.length }} 台车辆在线</span>
      </div>
      <YardMap :markers="filteredVehicles" :selected-id="selectedVehicle?.id || ''" @marker-click="selectVehicle" />
    </section>

    <aside class="panel side-panel">
      <div class="panel-title">
        <strong>任务请求</strong>
        <span>按优先级处理</span>
      </div>
      <div class="task-list">
        <button
          v-for="task in dispatchTasks"
          :key="task.id"
          type="button"
          :class="{ active: selectedTask?.id === task.id }"
          @click="selectedTask = task"
        >
          <span><strong>{{ task.id }}</strong>{{ task.point }}</span>
          <StatusTag :label="task.priority" />
        </button>
      </div>

      <div class="detail-card">
        <span class="eyebrow">选中车辆</span>
        <template v-if="selectedVehicle">
          <h3>{{ selectedVehicle.plate }}</h3>
          <p>{{ selectedVehicle.type }} / {{ selectedVehicle.area }} / {{ selectedVehicle.driver }}</p>
          <div class="meta-row">
            <StatusTag :label="selectedVehicle.status" />
            <span>{{ selectedVehicle.distance }} km</span>
            <span>{{ selectedVehicle.speed }} km/h</span>
          </div>
        </template>
        <p v-else class="empty-copy">点击地图车辆查看详情。</p>
      </div>

      <button class="primary-btn wide" type="button" :disabled="!selectedVehicle || !selectedTask" @click="confirmDispatch">
        确认派车
      </button>
    </aside>

    <section class="panel">
      <div class="panel-title">
        <strong>车辆状态列表</strong>
        <span>支持按地图联动定位</span>
      </div>
      <DataTable :columns="vehicleColumns" :rows="filteredVehicles" row-key="id" :selected-key="selectedVehicle?.id || ''" @row-click="selectVehicle">
        <template #status="{ row }"><StatusTag :label="row.status" /></template>
      </DataTable>
    </section>

    <section class="panel">
      <div class="panel-title">
        <strong>异常告警</strong>
        <span>{{ pendingAlerts.length }} 条待处理</span>
      </div>
      <div class="alert-list">
        <button v-for="alert in alerts" :key="alert.id" type="button" @click="focusAlert(alert)">
          <StatusTag :label="alert.status" />
          <strong>{{ alert.type }}</strong>
          <span>{{ alert.vehicle }} / {{ alert.location }} / {{ alert.time }}</span>
        </button>
      </div>
    </section>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import YardMap from '../components/YardMap.vue'
import { alerts, dispatchTasks, vehicles } from '../data/mockData'

const filters = reactive({ area: '', type: '' })
const selectedVehicle = ref(vehicles[0])
const selectedTask = ref(dispatchTasks[0])
const toast = ref('')

const vehicleColumns = [
  { key: 'plate', label: '车牌' },
  { key: 'type', label: '车型' },
  { key: 'area', label: '区域' },
  { key: 'status', label: '状态' },
  { key: 'driver', label: '司机' },
]

const filteredVehicles = computed(() =>
  vehicles.filter((item) =>
    (!filters.area || item.area === filters.area) &&
    (!filters.type || item.type === filters.type)
  )
)
const pendingAlerts = computed(() => alerts.filter((item) => item.status === '待处理'))

function selectVehicle(row) {
  selectedVehicle.value = row
}

function assignBestVehicle() {
  selectedVehicle.value = filteredVehicles.value.find((item) => item.status === '空闲') || filteredVehicles.value[0]
  toast.value = selectedVehicle.value ? `已推荐 ${selectedVehicle.value.plate}，距离最近且状态可用。` : '当前筛选条件下没有可用车辆。'
}

function confirmDispatch() {
  toast.value = `${selectedTask.value.id} 已派给 ${selectedVehicle.value.plate}，调度指令已下发司机端。`
}

function focusAlert(alert) {
  selectedVehicle.value = vehicles.find((item) => item.plate === alert.vehicle) || selectedVehicle.value
  toast.value = `已定位告警：${alert.type}，可选择确认、解除或通知司机。`
}
</script>
