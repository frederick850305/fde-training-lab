<template>
  <div class="access-code">
    <DataFilterBar :filters="filterConfig" :modelValue="filterValues" @update:modelValue="filterValues = $event" @search="loadData" />
    <div v-if="loading" style="padding:20px"><div class="skeleton" v-for="n in 4" :key="n" style="height:44px;margin-bottom:8px;border-radius:6px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <DataTable v-else :columns="columns" :data="codes" :pagination="{ current:1, pageSize:10, total: codes.length }" empty-text="暂无授权码">
      <template #cell="{ column, value }">
        <StatusTag v-if="column.key === 'syncStatus'" :status="value" />
        <StatusTag v-else-if="column.key === 'usageStatus'" :status="value" />
        <span v-else>{{ value }}</span>
      </template>
    </DataTable>
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
const codes = ref([])
const filterValues = ref({})

const filterConfig = [
  { type: 'select', label: '同步状态', key: 'sync', options: [{ label: '已同步', value: '已同步' }, { label: '同步失败', value: '同步失败' }, { label: '待同步', value: '待同步' }] },
  { type: 'input', label: '车牌号', key: 'plate', placeholder: '搜索车牌号' },
]

const columns = [
  { key: 'codeValue', title: '授权码' },
  { key: 'plate', title: '车牌号' },
  { key: 'syncStatus', title: '同步状态' },
  { key: 'validUntil', title: '有效期' },
  { key: 'usageStatus', title: '使用状态' },
]

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchReservationData()
    codes.value = data.accessCodes || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

onMounted(loadData)
</script>

<style scoped>
.access-code { padding: 16px; display: grid; gap: 12px; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.skeleton { background: #e2e8f0; border-radius: 6px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
