<template>
  <div class="vehicle-archive-logs-page">
    <!-- 筛选区 -->
    <div class="filter-area">
      <DataFilterBar
        :filters="filterConfig"
        v-model="filterValues"
        :showSearchButton="true"
        @search="fetchLogs"
      />
    </div>

    <!-- 操作区 -->
    <div class="action-area">
      <button class="export-btn" :disabled="loading || exportLoading" @click="handleExport">
        {{ exportLoading ? '导出中...' : '导出Excel' }}
      </button>
    </div>

    <!-- 错误提示 -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <!-- 日志列表区 -->
    <div class="table-area">
      <DataTable
        :columns="tableColumns"
        :data="pageData"
        :loading="loading"
        :emptyText="'暂无操作记录'"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
        rowKey="id"
        :expandable="true"
      >
        <template v-slot:expand="{ row }">
          <div class="expand-content">
            <h4>修改前后对比</h4>
            <div class="compare">
              <div class="diff before">
                <strong>修改前：</strong>
                <pre>{{ JSON.stringify(row.before, null, 2) }}</pre>
              </div>
              <div class="diff after">
                <strong>修改后：</strong>
                <pre>{{ JSON.stringify(row.after, null, 2) }}</pre>
              </div>
            </div>
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import DataFilterBar from '@/components/DataFilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import { operationLogs } from '@/data/mockVehicles.js'

// 筛选配置
const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'timeRange', placeholder: ['开始时间', '结束时间'] },
  { type: 'input', label: '操作人', key: 'operator', placeholder: '请输入操作人' },
  { type: 'select', label: '操作类型', key: 'operationType', multiple: true, options: [
    { label: '新增', value: 'create' },
    { label: '编辑', value: 'update' },
    { label: '停用', value: 'disable' },
    { label: '启用', value: 'enable' }
  ], placeholder: '选择操作类型' },
  { type: 'input', label: '关联车辆', key: 'vehiclePlate', placeholder: '请输入车牌号' }
]

const filterValues = ref({
  timeRange: [],
  operator: '',
  operationType: [],
  vehiclePlate: ''
})

// 表格数据
const rawData = ref([])
const loading = ref(false)
const error = ref(null)
const exportLoading = ref(false)

// 分页
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

const pageData = computed(() => {
  const start = (pagination.current - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return rawData.value.slice(start, end)
})

// 列定义
const tableColumns = [
  { key: 'time', title: '时间', sortable: true, width: 180 },
  { key: 'operator', title: '操作人', width: 120 },
  { key: 'operationType', title: '操作类型', width: 100 },
  { key: 'vehiclePlate', title: '关联车辆', width: 150 },
  { key: 'summary', title: '修改内容摘要', minWidth: 200 }
]

// 模拟获取日志
const fetchLogs = async () => {
  loading.value = true
  error.value = null
  try {
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 800))
    // 从mock数据中过滤（简单模拟）
    let filtered = operationLogs
    if (filterValues.value.operator) {
      filtered = filtered.filter(item => item.operator.includes(filterValues.value.operator))
    }
    if (filterValues.value.vehiclePlate) {
      filtered = filtered.filter(item => item.vehiclePlate.includes(filterValues.value.vehiclePlate))
    }
    if (filterValues.value.operationType.length > 0) {
      filtered = filtered.filter(item => filterValues.value.operationType.includes(item.operationType))
    }
    // 时间范围过滤省略（原型假定）
    rawData.value = filtered
    pagination.total = filtered.length
    pagination.current = 1
  } catch (err) {
    error.value = '查询失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

// 分页事件
const onPageChange = (page) => {
  pagination.current = page
}

const onPageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.current = 1
}

// 导出
const handleExport = async () => {
  if (rawData.value.length > 100000) {
    alert('筛选结果超过10万条，请缩小查询范围')
    return
  }
  exportLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    alert('导出成功！文件已开始下载。')
  } catch (err) {
    error.value = '导出失败，请稍后重试'
  } finally {
    exportLoading.value = false
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<style scoped>
.vehicle-archive-logs-page {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}

.filter-area {
  margin-bottom: 16px;
}

.action-area {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.export-btn {
  padding: 8px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.export-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}

.error-message {
  background: #fef0f0;
  color: #f56c6c;
  padding: 10px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #fbc4c4;
}

.table-area {
  position: relative;
}

.expand-content {
  padding: 12px 20px;
  background: #fafafa;
}

.expand-content h4 {
  margin: 0 0 12px 0;
  color: #333;
}

.compare {
  display: flex;
  gap: 20px;
}

.diff {
  flex: 1;
}

.diff pre {
  background: #f5f7fa;
  padding: 8px;
  border-radius: 4px;
  max-height: 300px;
  overflow: auto;
  font-size: 13px;
  line-height: 1.5;
}

.before {
  border-left: 3px solid #e6a23c;
  padding-left: 8px;
}

.after {
  border-left: 3px solid #67c23a;
  padding-left: 8px;
}
</style>