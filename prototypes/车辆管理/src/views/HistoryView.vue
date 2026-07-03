<template>
  <div class="history-view">
    <!-- 筛选栏 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="true"
      @search="handleSearch"
    />

    <!-- 加载中状态 -->
    <div v-if="loading" class="state-container">
      <div class="loading-spinner"></div>
      <p>数据加载中，请稍候...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="state-container error-state">
      <p>请求失败，请检查网络后重试</p>
      <button @click="fetchData" class="retry-btn">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!loading && tableData.length === 0" class="state-container empty-state">
      <p>暂无记录</p>
      <p class="hint">请修改筛选条件后重新查询</p>
    </div>

    <!-- 数据表格 -->
    <template v-else>
      <DataTable
        :columns="tableColumns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        rowKey="id"
        @row-click="handleRowClick"
      />
    </template>

    <!-- 导出区域 -->
    <div class="export-area">
      <button @click="handleExport" :disabled="exporting" class="export-btn">
        {{ exporting ? '导出中...' : '导出Excel' }}
      </button>
      <div v-if="exportProgress > -1" class="export-progress">
        <div class="progress-bar" :style="{ width: exportProgress + '%' }"></div>
        <span>{{ exportProgress }}%</span>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <DetailPanel
      :visible="detailVisible"
      :title="currentDetail ? currentDetail.licensePlate : ''"
      mode="modal"
      width="600px"
      @close="detailVisible = false"
    >
      <template v-if="currentDetail">
        <div class="detail-content">
          <h4>基本信息</h4>
          <p>车牌号：{{ currentDetail.licensePlate }}</p>
          <p>预约时间：{{ currentDetail.reservationTime }}</p>
          <p>审批状态：
            <StatusTag :status="currentDetail.approvalStatus" :text="currentDetail.approvalStatus" />
          </p>
          <p>授权码：{{ currentDetail.accessCode }}</p>
          <p>入场时间：{{ currentDetail.entryTime }}</p>
          <p>出场时间：{{ currentDetail.exitTime }}</p>
          <p>费用：¥{{ currentDetail.fee }}</p>

          <h4>操作日志</h4>
          <ul class="log-timeline">
            <li v-for="(log, index) in currentDetail.operationLogs" :key="index">
              <span class="log-time">{{ log.time }}</span>
              <span class="log-event">{{ log.event }}</span>
            </li>
          </ul>

          <h4>费用明细</h4>
          <table class="fee-table">
            <tr>
              <th>项目</th>
              <th>金额</th>
            </tr>
            <tr v-for="(item, index) in currentDetail.feeDetails" :key="index">
              <td>{{ item.name }}</td>
              <td>¥{{ item.amount }}</td>
            </tr>
          </table>
        </div>
      </template>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DataFilterBar from '@/components/DataFilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import DetailPanel from '@/components/DetailPanel.vue'
import StatusTag from '@/components/StatusTag.vue'

// 模拟数据（实际原型可改为从 src/data/mockReservations 导入）
const mockData = Array.from({ length: 88 }, (_, i) => ({
  id: i + 1,
  licensePlate: '京A·' + String(10000 + i).slice(-5),
  reservationTime: `2025-03-${String(10 + (i % 20)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:00`,
  approvalStatus: ['已批准', '待审批', '已拒绝', '已过期'][i % 4],
  accessCode: 'AC' + String(100000 + Math.floor(Math.random() * 900000)),
  entryTime: i % 2 === 0 ? `2025-03-${String(10 + (i % 20)).padStart(2, '0')} 08:${String(i % 60).padStart(2, '0')}` : '-',
  exitTime: i % 2 === 0 ? `2025-03-${String(10 + (i % 20)).padStart(2, '0')} 17:${String(i % 60).padStart(2, '0')}` : '-',
  fee: (Math.random() * 1000).toFixed(2),
  operationLogs: [
    { time: '2025-03-10 08:00', event: '预约申请提交' },
    { time: '2025-03-10 09:15', event: '审批通过' },
    { time: '2025-03-11 07:30', event: '车辆入场' },
    { time: '2025-03-11 18:20', event: '车辆出场，费用计算' }
  ],
  feeDetails: [
    { name: '基础停车费', amount: '200.00' },
    { name: '超时附加费', amount: '50.00' },
    { name: '清洁服务费', amount: '30.00' }
  ]
}))

// 筛选配置
const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'dateRange', options: [] },
  { type: 'input', label: '车辆', key: 'licensePlate', placeholder: '输入车牌号' },
  { type: 'select', label: '所属单位', key: 'unit', options: [
    { label: '全部', value: '' },
    { label: 'A物流', value: 'A物流' },
    { label: 'B运输', value: 'B运输' },
    { label: 'C工程', value: 'C工程' }
  ]},
  { type: 'select', label: '作业区域', key: 'area', options: [
    { label: '全部', value: '' },
    { label: '东区', value: '东区' },
    { label: '西区', value: '西区' },
    { label: '南区', value: '南区' },
    { label: '北区', value: '北区' }
  ]},
  { type: 'select', label: '审批状态', key: 'approvalStatus', options: [
    { label: '全部', value: '' },
    { label: '已批准', value: '已批准' },
    { label: '待审批', value: '待审批' },
    { label: '已拒绝', value: '已拒绝' },
    { label: '已过期', value: '已过期' }
  ]}
]

// 响应式状态
const filterValues = reactive({
  dateRange: [],
  licensePlate: '',
  unit: '',
  area: '',
  approvalStatus: ''
})

const tableData = ref([])
const loading = ref(false)
const error = ref(false)
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})
const detailVisible = ref(false)
const currentDetail = ref(null)
const exporting = ref(false)
const exportProgress = ref(-1)

// 表格列定义
const tableColumns = [
  { key: 'id', title: '记录ID', width: 80, sortable: true },
  { key: 'licensePlate', title: '车牌号', width: 120 },
  { key: 'reservationTime', title: '预约时间', width: 160 },
  {
    key: 'approvalStatus',
    title: '审批状态',
    width: 100,
    customRender: ({ value }) => {
      // 简单使用 StatusTag 组件，但实际在模板中通过插槽处理更好，这里简化为字符串
      return value
    }
  },
  { key: 'accessCode', title: '授权码', width: 120 },
  { key: 'entryTime', title: '入场时间', width: 160 },
  { key: 'exitTime', title: '出场时间', width: 160 },
  { key: 'fee', title: '费用(元)', width: 100, sortable: true }
]

// 模拟数据加载
const fetchData = () => {
  loading.value = true
  error.value = false
  // 模拟网络请求延迟
  setTimeout(() => {
    try {
      // 根据筛选条件过滤（简单模拟）
      let filtered = mockData
      if (filterValues.licensePlate) {
        filtered = filtered.filter(item =>
          item.licensePlate.includes(filterValues.licensePlate)
        )
      }
      if (filterValues.unit) {
        filtered = filtered.filter(item => item.unit === filterValues.unit)
      }
      if (filterValues.area) {
        filtered = filtered.filter(item => item.area === filterValues.area)
      }
      if (filterValues.approvalStatus) {
        filtered = filtered.filter(
          item => item.approvalStatus === filterValues.approvalStatus
        )
      }
      // 分页
      const total = filtered.length
      const start = (pagination.current - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      const list = filtered.slice(start, end)

      tableData.value = list
      pagination.total = total
      loading.value = false
    } catch (e) {
      error.value = true
      loading.value = false
    }
  }, 800) // 800ms延迟模拟
}

// 搜索事件
const handleSearch = () => {
  pagination.current = 1
  fetchData()
}

// 分页切换（通过 watch pagination.current 自动触发）
import { watch } from 'vue'
watch(() => pagination.current, (newVal) => {
  if (newVal) fetchData()
})

// 行点击查看详情
const handleRowClick = (row) => {
  currentDetail.value = row
  detailVisible.value = true
}

// 导出Excel模拟
const handleExport = () => {
  if (exporting.value) return
  exporting.value = true
  exportProgress.value = 0
  const interval = setInterval(() => {
    exportProgress.value += Math.floor(Math.random() * 20) + 5
    if (exportProgress.value >= 100) {
      clearInterval(interval)
      exportProgress.value = 100
      setTimeout(() => {
        exporting.value = false
        exportProgress.value = -1
        // 模拟下载完成提示
        alert('导出完成，文件已下载。')
      }, 500)
    }
  }, 300)
}

// 页面加载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.history-view {
  padding: 16px;
  background: #f5f7fa;
  min-height: 100vh;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state p {
  color: #f56c6c;
  margin-bottom: 12px;
}

.retry-btn {
  padding: 8px 24px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.retry-btn:hover {
  background: #66b1ff;
}

.empty-state p {
  color: #909399;
  margin: 4px 0;
}

.hint {
  font-size: 13px;
  color: #c0c4cc;
}

.export-area {
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.export-btn {
  padding: 8px 24px;
  background: #67c23a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.export-btn:disabled {
  background: #b3e19d;
  cursor: not-allowed;
}

.export-progress {
  flex: 1;
  max-width: 200px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  height: 10px;
  background: #409eff;
  border-radius: 5px;
  transition: width 0.3s;
  flex: 1;
}

.detail-content {
  padding: 8px 0;
}

.detail-content h4 {
  margin: 16px 0 8px;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 8px;
}

.detail-content p {
  margin: 4px 0;
  font-size: 14px;
  color: #606266;
}

.log-timeline {
  list-style: none;
  padding: 0;
}

.log-timeline li {
  display: flex;
  gap: 16px;
  padding: 6px 0;
  border-bottom: 1px solid #ebeef5;
}

.log-time {
  color: #909399;
  font-size: 13px;
  min-width: 120px;
}

.log-event {
  color: #303133;
}

.fee-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}

.fee-table th,
.fee-table td {
  border: 1px solid #ebeef5;
  padding: 8px 12px;
  text-align: left;
  font-size: 14px;
}

.fee-table th {
  background: #f5f7fa;
  color: #606266;
}

.fee-table td {
  color: #303133;
}
</style>