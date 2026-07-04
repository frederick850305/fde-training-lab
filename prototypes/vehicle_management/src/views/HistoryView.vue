<template>
  <div class="history-view">
    <DataFilterBar :filters="filterConfig" :modelValue="filterValues" @update:modelValue="filterValues = $event" @search="loadData" />
    <div v-if="loading" style="padding:20px"><div class="skeleton" v-for="n in 4" :key="n" style="height:44px;margin-bottom:8px;border-radius:6px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <DataTable v-else :columns="columns" :data="records" :pagination="{ current:1, pageSize:10, total: records.length }" empty-text="暂无历史记录">
      <template #cell="{ column, value }">
        <StatusTag v-if="column.key === 'approvalStatus'" :status="value" />
        <span v-else>{{ value || '—' }}</span>
      </template>
    </DataTable>
    <div class="export-bar"><button @click="exportData">📥 导出记录</button></div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchReservationData } from '../data/mockReservations.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'

const loading = ref(true)
const error = ref('')
const records = ref([])
const filterValues = ref({})

const filterConfig = [
  { type: 'dateRange', label: '日期范围', key: 'date' },
  { type: 'input', label: '车牌号', key: 'plate' },
  { type: 'select', label: '审批状态', key: 'status', options: [{ label: '已通过', value: '已通过' }, { label: '已驳回', value: '已驳回' }] },
]

const columns = [
  { key: 'plate', title: '车牌号' },
  { key: 'reservationTime', title: '预约时间' },
  { key: 'approvalStatus', title: '审批状态' },
  { key: 'entryTime', title: '入场时间' },
  { key: 'exitTime', title: '出场时间' },
  { key: 'fee', title: '费用(元)' },
]

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchReservationData()
    records.value = data.history || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function exportData() { alert('导出历史记录...') }
onMounted(loadData)
</script>

<style scoped>
.history-view { padding: 16px; display: grid; gap: 12px; }
.export-bar { text-align: right; }
.export-bar button { padding: 8px 18px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.skeleton { background: #e2e8f0; border-radius: 6px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
