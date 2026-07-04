<template>
  <div class="gate-records">
    <DataFilterBar :filters="filterConfig" :modelValue="filterValues" @update:modelValue="filterValues = $event" @search="loadData" @reset="loadData" />
    <div v-if="loading" style="padding:20px"><div class="skeleton" v-for="n in 4" :key="n" style="height:44px;margin-bottom:8px;border-radius:6px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <DataTable v-else :columns="columns" :data="records" :pagination="{ current:1, pageSize:10, total: records.length }" empty-text="暂无入场记录" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchGateData } from '../data/mockGate.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'

const loading = ref(true)
const error = ref('')
const records = ref([])
const filterValues = ref({})

const filterConfig = [
  { type: 'dateRange', label: '日期范围', key: 'date' },
  { type: 'select', label: '操作结果', key: 'operation', options: [{ label: '放行', value: '放行' }, { label: '拒绝', value: '拒绝' }] },
  { type: 'input', label: '车牌号', key: 'plate', placeholder: '输入车牌号' },
]

const columns = [
  { key: 'plate', title: '车牌号' },
  { key: 'operation', title: '操作' },
  { key: 'operator', title: '操作员' },
  { key: 'operateTime', title: '时间' },
  { key: 'syncStatus', title: '同步状态' },
]

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchGateData()
    records.value = data.records || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.gate-records { padding: 16px; display: grid; gap: 12px; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.skeleton { background: #e2e8f0; border-radius: 6px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
