<template>
  <div class="history-view">
    <!-- 顶部筛选栏 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="true"
      @search="handleSearch"
    />

    <!-- 导出区域 -->
    <div class="export-area">
      <button class="export-btn" @click="handleExport" :disabled="exporting">
        {{ exporting ? '导出中...' : '导出Excel' }}
      </button>
      <div v-if="exportProgress" class="export-progress">{{ exportProgress }}</div>
    </div>

    <!-- 列表区域 -->
    <div class="list-area">
      <!-- 加载态 -->
      <div v-if="loading" class="state-loading">
        <span class="spinner"></span> 数据加载中...
      </div>

      <!-- 错误态 -->
      <div v-else-if="error" class="state-error">
        <p>接口请求失败，请重试</p>
        <button @click="fetchHistory">重试</button>
      </div>

      <!-- 空态 -->
      <div v-else-if="listData.length === 0" class="state-empty">
        <p>暂无记录</p>
        <p v-if="hasActiveFilter">请修改筛选条件后重新查询</p>
      </div>

      <!-- 成功态 -->
      <DataTable
        v-else
        :columns="tableColumns"
        :data="listData"
        :loading="false"
        :pagination="pagination"
        rowKey="id"
        @page-change="handlePageChange"
      >
        <template #action="{ row }">
          <button class="detail-btn" @click="openDetail(row)">详情</button>
        </template>
      </DataTable>
    </div>

    <!-- 详情弹窗 -->
    <DetailPanel
      :visible="detailVisible"
      :title="detailTitle"
      mode="drawer"
      width="500px"
      @close="detailVisible = false"
    >
      <div class="detail-content">
        <h4>操作日志时间线</h4>
        <ul class="timeline">
          <li v-for="log in detailLogs" :key="log.time">
            <span class="time">{{ log.time }}</span>
            <span class="desc">{{ log.description }}</span>
          </li>
        </ul>
        <h4>费用明细</h4>
        <table class="fee-table">
          <thead>
            <tr>
              <th>费用项目</th>
              <th>金额</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="fee in detailFees" :key="fee.item">
              <td>{{ fee.item }}</td>
              <td>{{ fee.amount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import DetailPanel from '../components/DetailPanel.vue'
import { fetchReservationsData } from '../data/mockReservations'

const prototypeContext = inject('prototypeContext', { currentRole: 'manager', currentRoleKey: 'manager' })
const { currentRole, currentRoleKey } = prototypeContext

// 状态
const loading = ref(false)
const error = ref(false)
const listData = ref([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

// 筛选
const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'timeRange', placeholder: '选择日期范围' },
  { type: 'input', label: '车辆', key: 'vehicle', placeholder: '车牌号' },
  { type: 'input', label: '所属单位', key: 'unit', placeholder: '单位名称' },
  { type: 'input', label: '作业区域', key: 'area', placeholder: '区域名称' },
  { type: 'select', label: '审批状态', key: 'status', options: [
    { value: '', label: '全部' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已驳回' },
    { value: 'pending', label: '待审批' }
  ]}
]

// 根据角色设置默认筛选
const defaultFilter = computed(() => {
  if (currentRoleKey === 'approver') {
    return { status: 'approved' }
  } else if (currentRoleKey === 'manager' || currentRoleKey === 'admin') {
    return { status: '' }
  }
  return {}
})

const filterValues = ref({ ...defaultFilter.value })

const hasActiveFilter = computed(() => {
  return Object.values(filterValues.value).some(v => v !== '' && v !== null && v !== undefined)
})

// 表格列定义
const tableColumns = [
  { key: 'vehiclePlate', title: '车牌号', sortable: true },
  { key: 'reservationTime', title: '预约时间', sortable: true },
  { key: 'approvalStatus', title: '审批状态', customRender: (value) => {
    const statusMap = { approved: '已通过', rejected: '已驳回', pending: '待审批' }
    return statusMap[value] || value
  }},
  { key: 'accessCode', title: '授权码' },
  { key: 'entryTime', title: '入场时间' },
  { key: 'exitTime', title: '出场时间' },
  { key: 'fee', title: '费用', align: 'right' },
  { key: 'action', title: '操作', width: '80px' }
]

// 导出
const exporting = ref(false)
const exportProgress = ref('')

async function handleExport() {
  exporting.value = true
  exportProgress.value = '正在生成文件...'
  try {
    // 模拟导出延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    exportProgress.value = '导出完成，开始下载'
    // 实际原型中可触发下载
  } catch (e) {
    exportProgress.value = '导出失败'
  } finally {
    exporting.value = false
    setTimeout(() => { exportProgress.value = '' }, 2000)
  }
}

// 数据获取
async function fetchHistory() {
  loading.value = true
  error.value = false
  try {
    const rawData = await fetchReservationsData()
    // 根据schema中的historyRecord进行normalize
    const records = (rawData.historyRecords || []).map(item => ({
      id: item.id || item.recordId,
      vehiclePlate: item.vehiclePlate || item.plateNumber,
      reservationTime: item.reservationTime,
      approvalStatus: item.approvalStatus || item.status,
      accessCode: item.accessCode,
      entryTime: item.entryTime,
      exitTime: item.exitTime,
      fee: item.fee
    }))
    // 应用筛选条件（简单模拟，实际应该在API层面过滤）
    let filtered = records
    if (filterValues.value.vehicle) {
      filtered = filtered.filter(r => r.vehiclePlate.includes(filterValues.value.vehicle))
    }
    if (filterValues.value.status) {
      filtered = filtered.filter(r => r.approvalStatus === filterValues.value.status)
    }
    // 其他筛选同理，为原型演示简化
    // 倒序
    filtered.sort((a, b) => new Date(b.reservationTime) - new Date(a.reservationTime))
    listData.value = filtered
    pagination.value.total = filtered.length
  } catch (e) {
    error.value = true
    listData.value = []
  } finally {
    loading.value = false
  }
}

function handleSearch() {
  pagination.value.current = 1
  fetchHistory()
}

function handlePageChange(page) {
  pagination.value.current = page
  fetchHistory()
}

// 详情
const detailVisible = ref(false)
const detailTitle = ref('')
const detailLogs = ref([])
const detailFees = ref([])

function openDetail(row) {
  detailTitle.value = `预约记录详情 - ${row.vehiclePlate}`
  // 模拟操作日志和费用明细
  detailLogs.value = [
    { time: row.reservationTime, description: '提交预约申请' },
    { time: row.reservationTime, description: '审批通过' },
    { time: row.entryTime, description: '车辆入场' },
    { time: row.exitTime, description: '车辆出场' }
  ]
  detailFees.value = [
    { item: '入场费', amount: '50.00' },
    { item: '停车费', amount: '30.00' },
    { item: '其他', amount: '20.00' }
  ]
  detailVisible.value = true
}

onMounted(() => {
  fetchHistory()
})
</script>

<style scoped>
.history-view {
  padding: 16px;
}
.export-area {
  margin: 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}
.export-btn {
  padding: 6px 16px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.export-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.export-progress {
  color: #909399;
  font-size: 13px;
}
.list-area {
  min-height: 200px;
}
.state-loading, .state-error, .state-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #909399;
}
.state-error p {
  margin-bottom: 12px;
}
.state-error button {
  padding: 4px 12px;
  cursor: pointer;
}
.spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #dcdfe6;
  border-top-color: #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 8px;
  vertical-align: middle;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.detail-btn {
  padding: 2px 8px;
  background: #ecf5ff;
  color: #409eff;
  border: 1px solid #b3d8ff;
  border-radius: 4px;
  cursor: pointer;
}
.detail-content h4 {
  margin: 16px 0 8px;
}
.timeline {
  list-style: none;
  padding: 0;
}
.timeline li {
  padding: 4px 0;
  border-left: 2px solid #dcdfe6;
  padding-left: 12px;
  margin-bottom: 8px;
}
.timeline .time {
  font-weight: bold;
  margin-right: 8px;
}
.fee-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}
.fee-table th, .fee-table td {
  border: 1px solid #dcdfe6;
  padding: 6px 12px;
  text-align: left;
}
.fee-table th {
  background: #f5f7fa;
}
</style>