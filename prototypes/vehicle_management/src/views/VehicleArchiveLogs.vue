<template>
  <div class="vehicle-archive-logs">
    <button class="back-btn" @click="goBack">← 返回档案列表</button>
    <DataFilterBar :filters="filterConfig" :modelValue="filterValues" @update:modelValue="filterValues = $event" @search="loadData" />
    <div v-if="loading" style="padding:20px"><div class="skeleton" v-for="n in 4" :key="n" style="height:44px;margin-bottom:8px;border-radius:6px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <DataTable v-else :columns="columns" :data="logs" :pagination="{ current:1, pageSize:10, total: logs.length }" empty-text="暂无操作日志">
      <template #cell="{ column, value }">
        <StatusTag v-if="column.key === 'operateType'" :status="value" />
        <span v-else>{{ value }}</span>
      </template>
    </DataTable>
    <div class="export-bar"><button @click="exportData">📥 导出日志</button></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '../routerShim.js'
import { fetchVehicleData } from '../data/mockVehicles.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const logs = ref([])
const filterValues = ref({})

const filterConfig = [
  { type: 'dateRange', label: '日期', key: 'date' },
  { type: 'select', label: '操作类型', key: 'type', options: [{ label: '新增', value: '新增' }, { label: '编辑', value: '编辑' }, { label: '停用', value: '停用' }] },
  { type: 'input', label: '操作人', key: 'operator' },
]

const columns = [
  { key: 'operateTime', title: '时间' },
  { key: 'operator', title: '操作人' },
  { key: 'operateType', title: '操作类型' },
  { key: 'vehicleId', title: '车辆ID' },
  { key: 'changeDetail', title: '变更详情' },
]

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchVehicleData()
    logs.value = data.logs || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function goBack() { router.push('/management/vehicle-archive') }
function exportData() { alert('导出操作日志...') }
onMounted(loadData)
</script>

<style scoped>
.vehicle-archive-logs { padding: 16px; display: grid; gap: 12px; }
.back-btn { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 7px; background: #fff; cursor: pointer; font-size: 13px; justify-self: start; }
.export-bar { text-align: right; }
.export-bar button { padding: 8px 18px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.skeleton { background: #e2e8f0; border-radius: 6px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
