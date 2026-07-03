<template>
  <div class="vehicle-archive-logs">
    <DataFilterBar
      :filters="filterConfig"
      v-model="filters"
      @search="handleSearch"
    />
    <div class="action-bar">
      <button @click="exportLogs" :disabled="loading">导出Excel</button>
    </div>
    <DataTable
      :columns="columns"
      :data="logData"
      :loading="loading"
      :empty-text="emptyText"
      :pagination="pagination"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
    >
      <template #expandedRow="{ row }">
        <div class="expand-content">
          <h4>变更详情 (JSON对比)</h4>
          <pre>{{ row.beforeAfter }}</pre>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract'
import { fetchVehiclesData } from '../data/mockVehicles'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'

const prototypeContext = inject('prototypeContext', { currentRole: 'admin', currentRoleKey: 'admin' })
const currentRoleKey = computed(() => prototypeContext.currentRoleKey || 'admin')

const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'timeRange', placeholder: '选择日期范围' },
  { type: 'input', label: '操作人', key: 'operator', placeholder: '输入操作人' },
  { type: 'select', label: '操作类型', key: 'operationType', options: ['新增', '编辑', '停用', '启用', '其他'] },
  { type: 'input', label: '关联车辆', key: 'plateNumber', placeholder: '输入车牌号' }
]

const initialFilters = currentRoleKey.value === 'admin'
  ? { timeRange: [], operator: '', operationType: '', plateNumber: '' }
  : { timeRange: [new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), new Date().toISOString()], operator: '', operationType: '', plateNumber: '' }
const filters = reactive(initialFilters)

const logData = ref([])
const loading = ref(false)
const emptyText = ref('暂无操作记录')
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const columns = [
  { key: 'operationTime', title: '时间', sortable: true },
  { key: 'operatorName', title: '操作人', sortable: true },
  { key: 'operationType', title: '操作类型', sortable: true },
  { key: 'vehicleId', title: '关联车辆ID', sortable: true },
  { key: 'changeSummary', title: '修改内容摘要' }
]

async function fetchLogs() {
  loading.value = true
  emptyText.value = '暂无操作记录'
  try {
    const data = await fetchVehiclesData()
    let logs = data.operationLog || []
    // 根据角色过滤（示例：管理员全量，其他人仅显示相关操作人）
    // 实际角色过滤逻辑可拓展
    const total = logs.length
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    logData.value = logs.slice(start, end).map(item => ({
      operationTime: item.operationTime,
      operatorName: item.operatorName,
      operationType: item.operationType,
      vehicleId: item.vehicleId,
      changeSummary: item.changeDetail ? item.changeDetail.substring(0, 100) : '',
      beforeAfter: item.changeDetail
    }))
    pagination.total = total
    if (logs.length === 0) {
      emptyText.value = '暂无操作记录'
    }
  } catch (error) {
    emptyText.value = '加载失败，请重试'
    console.error(error)
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.current = 1
  fetchLogs()
}

function handlePageChange(page) {
  pagination.current = page
  fetchLogs()
}

function handlePageSizeChange(size) {
  pagination.pageSize = size
  pagination.current = 1
  fetchLogs()
}

function exportLogs() {
  if (pagination.total > 100000) {
    alert('筛选结果超过10万条，请缩小筛选范围')
    return
  }
  loading.value = true
  setTimeout(() => {
    loading.value = false
    alert('导出成功')
  }, 1500)
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.vehicle-archive-logs {
  padding: 16px;
}
.action-bar {
  margin: 12px 0;
}
.expand-content {
  padding: 12px;
  background: #f5f5f5;
}
.expand-content pre {
  white-space: pre-wrap;
  word-break: break-all;
}
</style>