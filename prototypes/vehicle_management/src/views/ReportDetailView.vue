<template>
  <div class="report-detail">
    <button class="back-btn" @click="goBack">← 返回报表</button>
    <DataFilterBar :filters="filterConfig" :modelValue="filterValues" @update:modelValue="filterValues = $event" @search="loadData" />
    <div v-if="loading" style="padding:20px"><div class="skeleton" v-for="n in 5" :key="n" style="height:44px;margin-bottom:8px;border-radius:6px"></div></div>
    <DataTable v-else :columns="columns" :data="detailData" :pagination="{ current:1, pageSize:10, total: detailData.length }" empty-text="暂无明细数据">
      <template #cell="{ column, value }">
        <StatusTag v-if="column.key === 'status'" :status="value" />
        <span v-else>{{ value }}</span>
      </template>
    </DataTable>
    <div class="export-bar"><button @click="exportData">📥 导出当前明细</button></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '../routerShim.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'

const router = useRouter()
const loading = ref(false)
const filterValues = ref({})

const filterConfig = [
  { type: 'dateRange', label: '日期', key: 'date' },
  { type: 'select', label: '车辆类型', key: 'type', options: [{ label: '平板运输车', value: '平板运输车' }, { label: '厢式货车', value: '厢式货车' }] },
  { type: 'input', label: '车牌号', key: 'plate' },
]

const columns = [
  { key: 'plate', title: '车牌号', sortable: true },
  { key: 'type', title: '类型' },
  { key: 'taskCount', title: '任务数' },
  { key: 'utilization', title: '利用率' },
  { key: 'waitTime', title: '平均等待' },
  { key: 'status', title: '状态' },
]

const detailData = ref([
  { id: 1, plate: '沪A-2601', type: '平板运输车', taskCount: 24, utilization: '85%', waitTime: '15min', status: '启用' },
  { id: 2, plate: '沪B-3812', type: '厢式货车', taskCount: 18, utilization: '72%', waitTime: '22min', status: '启用' },
  { id: 3, plate: '沪C-4920', type: '重型卡车', taskCount: 30, utilization: '91%', waitTime: '10min', status: '启用' },
  { id: 4, plate: '沪D-5031', type: '平板运输车', taskCount: 12, utilization: '55%', waitTime: '35min', status: '停用' },
  { id: 5, plate: '沪E-6142', type: '厢式货车', taskCount: 20, utilization: '78%', waitTime: '18min', status: '启用' },
])

function goBack() { router.push('/management/reports') }
function loadData() { loading.value = false }
function exportData() { alert('导出明细数据...') }
onMounted(loadData)
</script>

<style scoped>
.report-detail { padding: 16px; display: grid; gap: 12px; }
.back-btn { padding: 6px 12px; border: 1px solid #cbd5e1; border-radius: 7px; background: #fff; cursor: pointer; font-size: 13px; justify-self: start; }
.export-bar { text-align: right; }
.export-bar button { padding: 8px 18px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; }
.skeleton { background: #e2e8f0; border-radius: 6px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
