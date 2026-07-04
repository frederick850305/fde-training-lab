<template>
  <div class="vehicle-archive-list">
    <DataFilterBar :filters="filterConfig" :modelValue="filterValues" @update:modelValue="filterValues = $event" @search="applyFilter" />
    <div v-if="loading" style="padding:20px"><div class="skeleton" v-for="n in 4" :key="n" style="height:44px;margin-bottom:8px;border-radius:6px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else>
      <div v-if="expiringList.length" class="expiry-alert">
        <span>⚠️</span> {{ expiringList.length }} 辆车临近证件到期：{{ expiringList.map(v => v.plate).join('、') }}
      </div>
      <DataTable :columns="columns" :data="vehicles" :pagination="{ current:1, pageSize:10, total: vehicles.length }" empty-text="暂无车辆档案">
        <template #cell="{ column, value }">
          <StatusTag v-if="column.key === 'status'" :status="value" />
          <span v-else>{{ value }}</span>
        </template>
      </DataTable>
      <div class="action-bar">
        <button @click="addVehicle">➕ 新增车辆</button>
        <button @click="viewLogs">📋 操作日志</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from '../routerShim.js'
import { fetchVehicleData } from '../data/mockVehicles.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const vehicles = ref([])
const filterValues = ref({})

const filterConfig = [
  { type: 'select', label: '车辆类型', key: 'type', options: [{ label: '平板运输车', value: '平板运输车' }, { label: '厢式货车', value: '厢式货车' }, { label: '重型卡车', value: '重型卡车' }] },
  { type: 'select', label: '状态', key: 'status', options: [{ label: '启用', value: '启用' }, { label: '停用', value: '停用' }] },
  { type: 'input', label: '车牌号', key: 'plate', placeholder: '搜索车牌号' },
]

const columns = [
  { key: 'plate', title: '车牌号', sortable: true },
  { key: 'vehicleType', title: '类型' },
  { key: 'unit', title: '所属单位' },
  { key: 'driverName', title: '司机' },
  { key: 'annualCheckExpiry', title: '年检到期' },
  { key: 'insuranceExpiry', title: '保险到期' },
  { key: 'status', title: '状态' },
]

const expiringList = computed(() => vehicles.value.filter(v => {
  const d = new Date(v.insuranceExpiry)
  const now = new Date()
  return (d - now) / (1000 * 60 * 60 * 24) < 30
}))

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchVehicleData()
    vehicles.value = data.vehicles || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function applyFilter() {}
function addVehicle() { router.push('/management/vehicle-archive/edit') }
function viewLogs() { router.push('/management/vehicle-archive/logs') }

onMounted(loadData)
</script>

<style scoped>
.vehicle-archive-list { padding: 16px; display: grid; gap: 12px; }
.expiry-alert { padding: 10px 14px; background: #fff3e0; border: 1px solid #ffcc80; border-radius: 8px; font-size: 13px; color: #d84315; }
.action-bar { display: flex; gap: 12px; }
.action-bar button { padding: 10px 20px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; font-size: 13px; cursor: pointer; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.skeleton { background: #e2e8f0; border-radius: 6px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
