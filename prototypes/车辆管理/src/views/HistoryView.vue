<template>
  <div class="history-view">
    <header class="page-header">
      <h1>外协/临时车辆预约历史记录</h1>
      <span class="role-hint">当前角色: {{ roleLabel }}</span>
    </header>

    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="true"
      @search="handleSearch"
    />

    <div class="export-area">
      <button @click="handleExport" :disabled="exporting">
        {{ exporting ? '导出中...' : '导出Excel' }}
      </button>
      <span v-if="exportProgress" class="export-progress">{{ exportProgress }}</span>
    </div>

    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loading"
      :emptyText="emptyText"
      :pagination="pagination"
      rowKey="id"
      @page-change="handlePageChange"
      @row-click="handleRowClick"
    />

    <DetailPanel
      v-model:visible="detailVisible"
      title="预约详情"
      mode="drawer"
      width="550px"
    >
      <template v-if="selectedRecord">
        <div class="detail-section">
          <h3>基本信息</h3>
          <ul>
            <li><span>车牌号</span><span>{{ selectedRecord.plateNumber }}</span></li>
            <li><span>预约时间</span><span>{{ selectedRecord.reservationTime }}</span></li>
            <li><span>审批状态</span><span>{{ selectedRecord.approvalStatus }}</span></li>
            <li><span>授权码</span><span>{{ selectedRecord.accessCode || '-' }}</span></li>
            <li><span>入场时间</span><span>{{ selectedRecord.entryTime }}</span></li>
            <li><span>出场时间</span><span>{{ selectedRecord.exitTime }}</span></li>
            <li><span>费用</span><span>{{ selectedRecord.fee }}</span></li>
          </ul>
        </div>
        <div class="detail-section">
          <h3>操作日志时间线</h3>
          <div v-if="selectedRecord.operationLogs && selectedRecord.operationLogs.length" class="timeline">
            <div v-for="log in selectedRecord.operationLogs" :key="log.time" class="timeline-item">
              <span class="time">{{ log.time }}</span>
              <span class="desc">{{ log.description }}</span>
            </div>
          </div>
          <p v-else class="no-data">暂无操作日志</p>
        </div>
        <div class="detail-section">
          <h3>费用明细</h3>
          <div v-if="selectedRecord.feeDetails && selectedRecord.feeDetails.length" class="fee-list">
            <div v-for="item in selectedRecord.feeDetails" :key="item.name" class="fee-item">
              <span>{{ item.name }}</span><span>{{ item.amount }}</span>
            </div>
          </div>
          <p v-else class="no-data">暂无费用明细</p>
        </div>
      </template>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { prototypeContract } from '../prototypeContract.js'
import { fetchReservationsData } from '../data/mockReservations.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import DetailPanel from '../components/DetailPanel.vue'

const prototypeContext = inject('prototypeContext', { currentRole: 'approver', currentRoleKey: 'approver' })
const currentRole = computed(() => prototypeContext.currentRole)
const currentRoleKey = computed(() => prototypeContext.currentRoleKey)

const roleLabel = computed(() => {
  const role = prototypeContract.roles.find(r => r.key === currentRoleKey.value)
  return role ? role.label : '未知'
})

// 筛选配置
const filterConfig = computed(() => [
  { type: 'dateRange', label: '时间范围', key: 'timeRange', placeholder: '选择日期范围' },
  { type: 'select', label: '审批状态', key: 'approvalStatus', options: ['全部','待审批','已通过','已驳回'] },
  { type: 'input', label: '车牌号', key: 'plateNumber', placeholder: '输入车牌号搜索' },
  { type: 'select', label: '所属单位', key: 'department', options: ['全部','外协单位A','外协单位B'] },
  { type: 'select', label: '作业区域', key: 'workArea', options: ['全部','原料区','成品区','维修区'] }
])

// 默认筛选（按角色）
const defaultFilters = computed(() => {
  if (currentRoleKey.value === 'manager') {
    return { timeRange: [], approvalStatus: '全部', plateNumber: '', department: '全部', workArea: '全部' }
  }
  // approver/admin 可自定义
  return { timeRange: [], approvalStatus: '全部', plateNumber: '', department: '全部', workArea: '全部' }
})
const filterValues = ref({ ...defaultFilters.value })

// 列表状态
const loading = ref(false)
const emptyText = ref('暂无记录，请尝试修改筛选条件')
const tableData = ref([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

// 详情
const detailVisible = ref(false)
const selectedRecord = ref(null)

// 导出
const exporting = ref(false)
const exportProgress = ref('')

// 列定义（务必使用 schema 中的字段）
const tableColumns = computed(() => [
  { key: 'plateNumber', title: '车牌号', sortable: false, width: '120px' },
  { key: 'reservationTime', title: '预约时间', sortable: true, width: '180px' },
  { key: 'approvalStatus', title: '审批状态', sortable: false, width: '120px', customRender: (val) => {
      const statusMap = { '待审批': '待审批', '已通过': '通过', '已驳回': '驳回' }
      return statusMap[val] || val
    }
  },
  { key: 'accessCode', title: '授权码', sortable: false, width: '150px' },
  { key: 'entryTime', title: '入场时间', sortable: true, width: '180px' },
  { key: 'exitTime', title: '出场时间', sortable: true, width: '180px' },
  { key: 'fee', title: '费用', sortable: true, width: '100px' }
])

// 加载数据
async function loadData() {
  loading.value = true
  try {
    const result = await fetchReservationsData()
    // 提取历史记录数据
    const rawRecords = result.historyRecords || result.data || result
    // 标准化映射
    const normalized = rawRecords.map((item, index) => ({
      id: item.id || `record_${index}`,
      plateNumber: item.plateNumber || item.vehiclePlate || '-',
      reservationTime: item.reservationTime || item.appointmentTime || '-',
      approvalStatus: item.approvalStatus || item.status || '-',
      accessCode: item.accessCode || item.code || '-',
      entryTime: item.entryTime || item.inTime || '-',
      exitTime: item.exitTime || item.outTime || '-',
      fee: item.fee || item.cost || '0.00',
      operationLogs: item.operationLogs || item.logs || [],
      feeDetails: item.feeDetails || item.feeBreakdown || []
    }))
    tableData.value = normalized
    pagination.value.total = normalized.length
    emptyText.value = '暂无记录，请尝试修改筛选条件'
  } catch (e) {
    emptyText.value = '加载失败，请重试'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

function handleSearch() {
  pagination.value.current = 1
  loadData()
}

function handlePageChange(page) {
  pagination.value.current = page
  loadData()
}

function handleRowClick(row) {
  selectedRecord.value = row
  detailVisible.value = true
}

async function handleExport() {
  exporting.value = true
  exportProgress.value = '正在生成...'
  try {
    // 模拟导出
    await new Promise(resolve => setTimeout(resolve, 1500))
    exportProgress.value = '导出完成，自动下载中'
    // 实际触发下载逻辑略
    setTimeout(() => {
      exportProgress.value = ''
      exporting.value = false
    }, 2000)
  } catch {
    exportProgress.value = '导出失败'
    exporting.value = false
  }
}
</script>

<style scoped>
.history-view {
  padding: 20px;
  font-family: sans-serif;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h1 {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}
.role-hint {
  font-size: 12px;
  color: #888;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
}
.export-area {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.export-area button {
  padding: 6px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.export-area button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.export-progress {
  font-size: 12px;
  color: #666;
}
.detail-section {
  margin-bottom: 20px;
}
.detail-section h3 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  padding-bottom: 4px;
}
.detail-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.detail-section li {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  font-size: 13px;
}
.detail-section li span:first-child {
  color: #666;
}
.timeline {
  padding-left: 8px;
  border-left: 2px solid #ddd;
}
.timeline-item {
  margin-bottom: 8px;
  display: flex;
  gap: 8px;
  font-size: 12px;
}
.timeline-item .time {
  color: #999;
  min-width: 80px;
}
.no-data {
  color: #999;
  font-size: 12px;
}
.fee-list {
  font-size: 13px;
}
.fee-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}
</style>
