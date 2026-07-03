<template>
  <div class="vehicle-archive-logs">
    <!-- 筛选区 -->
    <div class="filter-bar">
      <DataFilterBar
        :filters="filterConfig"
        v-model="filters"
        @search="handleSearch"
      />
      <div class="filter-actions">
        <button class="btn-export" @click="handleExport" :disabled="loading">导出Excel</button>
      </div>
    </div>

    <!-- 日志列表区 -->
    <div class="logs-table">
      <DataTable
        :columns="columns"
        :data="logs"
        :loading="loading"
        :empty-text="emptyText"
        :pagination="pagination"
        row-key="id"
        @page-change="handlePageChange"
        @page-size-change="handlePageSizeChange"
      >
        <!-- 展开行显示修改详情 -->
        <template #expand="{ row }">
          <div class="expand-detail">
            <div v-if="row.changeBefore || row.changeAfter">
              <strong>修改前：</strong>
              <pre>{{ row.changeBefore ? JSON.stringify(row.changeBefore, null, 2) : '无' }}</pre>
              <strong>修改后：</strong>
              <pre>{{ row.changeAfter ? JSON.stringify(row.changeAfter, null, 2) : '无' }}</pre>
            </div>
            <div v-else>暂无详细变更内容</div>
          </div>
        </template>
      </DataTable>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-toast">{{ error }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, computed, onMounted } from 'vue'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import { fetchVehiclesData } from '../data/mockVehicles.js'

const prototypeContext = inject('prototypeContext')
const currentRole = prototypeContext?.currentRole || 'admin'
const currentRoleKey = prototypeContext?.currentRoleKey || 'admin'

// 根据角色确定默认筛选（管理员查看所有，其他角色默认筛选本人操作）
const defaultOperator = computed(() => {
  if (currentRoleKey === 'admin') return ''
  const role = prototypeContract.roles.find(r => r.key === currentRoleKey)
  return role ? role.userName : ''
})

const loading = ref(false)
const error = ref('')
const logs = ref([])
const filters = reactive({
  timeRange: [],
  operator: defaultOperator.value,
  operationType: [],
  licensePlate: ''
})
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'timeRange', placeholder: ['开始时间', '结束时间'] },
  { type: 'select', label: '操作人', key: 'operator', options: [], placeholder: '全部' },
  { type: 'select', label: '操作类型', key: 'operationType', options: [
    { label: '新增', value: 'create' },
    { label: '编辑', value: 'update' },
    { label: '停用', value: 'disable' },
    { label: '启用', value: 'enable' }
  ], placeholder: '全部', multiple: true },
  { type: 'input', label: '关联车辆', key: 'licensePlate', placeholder: '输入车牌号' }
]

const columns = [
  { key: 'time', title: '操作时间', width: 160 },
  { key: 'operator', title: '操作人', width: 120 },
  { key: 'type', title: '操作类型', width: 100 },
  { key: 'vehicle', title: '关联车辆', width: 150 },
  { key: 'summary', title: '修改内容摘要', minWidth: 200 }
]

const emptyText = computed(() => {
  if (loading.value) return '加载中...'
  if (error.value) return '加载失败，请重试'
  return '暂无操作记录'
})

async function fetchLogs() {
  loading.value = true
  error.value = ''
  try {
    // 使用 contract 指定的 mock 读取函数获取数据
    const result = await fetchVehiclesData()
    // 假设返回对象包含 operationLogs 数组（符合 schema 中的 operationLog 类型）
    let mockLogs = result.operationLogs || []
    // 根据筛选条件过滤（原型演示简单过滤）
    if (filters.operator) {
      mockLogs = mockLogs.filter(l => l.operator === filters.operator)
    }
    if (filters.operationType && filters.operationType.length) {
      mockLogs = mockLogs.filter(l => filters.operationType.includes(l.type))
    }
    if (filters.licensePlate) {
      mockLogs = mockLogs.filter(l => l.vehicle && l.vehicle.includes(filters.licensePlate))
    }
    if (filters.timeRange && filters.timeRange.length === 2) {
      const [start, end] = filters.timeRange
      mockLogs = mockLogs.filter(l => l.time >= start && l.time <= end)
    }
    // 模拟分页（取当前页数据）
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    logs.value = mockLogs.slice(start, end)
    pagination.total = mockLogs.length
  } catch (e) {
    error.value = '查询失败：' + (e.message || '未知错误')
    logs.value = []
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

function handleExport() {
  if (pagination.total > 100000) {
    alert('筛选结果超过10万条，请缩小筛选范围后再导出。')
    return
  }
  loading.value = true
  // 模拟导出 POST 请求
  setTimeout(() => {
    loading.value = false
    alert('导出成功，文件已开始下载。')
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
.filter-bar {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 16px;
}
.filter-actions {
  margin-left: auto;
}
.btn-export {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-export:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.logs-table {
  position: relative;
}
.expand-detail {
  padding: 8px 16px;
  background: #fafafa;
  border-top: 1px solid #e8e8e8;
}
.expand-detail pre {
  background: #f0f0f0;
  padding: 8px;
  border-radius: 4px;
  max-height: 200px;
  overflow: auto;
  font-size: 12px;
}
.error-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: #ff4d4f;
  color: white;
  padding: 8px 24px;
  border-radius: 4px;
  z-index: 1000;
}
</style>
