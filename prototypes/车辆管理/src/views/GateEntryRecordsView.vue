<template>
  <div class="gate-entry-records-view">
    <div class="page-header">
      <h2>入场记录</h2>
      <span class="role-badge">当前角色：{{ roleLabel }}</span>
    </div>

    <!-- 筛选栏 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="false"
      :autoSearchDelay="300"
      @update:modelValue="onFilterChange"
    />

    <!-- 加载态 -->
    <div v-if="state === 'loading'" class="loading-placeholder">
      <div class="skeleton-row" v-for="i in 5" :key="i"></div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="state === 'error'" class="error-container">
      <p>加载失败，请重试</p>
      <button @click="fetchRecords">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="records.length === 0" class="empty-container">
      <p>暂无入场记录</p>
    </div>

    <!-- 成功态：列表 -->
    <div v-else class="table-wrapper">
      <DataTable
        :columns="tableColumns"
        :data="records"
        :loading="state === 'loading'"
        :pagination="null"
        rowKey="id"
        @row-click="openDetail"
      >
        <template #syncStatus="{ row }">
          <StatusTag
            :status="row.syncStatus"
            :text="syncStatusText(row.syncStatus)"
            size="small"
          />
        </template>
        <template #actions="{ row }">
          <button
            v-if="row.syncStatus === 'failed'"
            class="retry-btn"
            :disabled="retryingId === row.id"
            @click.stop="retrySync(row.id)"
          >
            {{ retryingId === row.id ? '重试中...' : '重新同步' }}
          </button>
        </template>
      </DataTable>
    </div>

    <!-- 详情弹窗 -->
    <DetailPanel
      :visible="detailVisible"
      :title="'入场记录详情'"
      mode="modal"
      width="600px"
      @close="detailVisible = false"
    >
      <div class="detail-content" v-if="selectedRecord">
        <div class="detail-section">
          <h4>核验结果快照</h4>
          <p><strong>记录ID：</strong>{{ selectedRecord.id }}</p>
          <p><strong>车牌号：</strong>{{ selectedRecord.plateNumber }}</p>
          <p><strong>操作结果：</strong>{{ selectedRecord.actionResult === 'pass' ? '放行' : '拒绝' }}</p>
          <p><strong>操作时间：</strong>{{ selectedRecord.actionTime }}</p>
          <p><strong>操作员：</strong>{{ selectedRecord.operator }}</p>
          <p v-if="selectedRecord.rejectReason"><strong>拒绝原因：</strong>{{ selectedRecord.rejectReason }}</p>
        </div>
        <div class="detail-section">
          <h4>同步状态</h4>
          <p><strong>同步状态：</strong>{{ syncStatusText(selectedRecord.syncStatus) }}</p>
          <p v-if="selectedRecord.syncFailedReason"><strong>同步失败原因：</strong>{{ selectedRecord.syncFailedReason }}</p>
          <p v-if="selectedRecord.degraded"><strong>降级标记：</strong>是</p>
        </div>
        <div class="detail-section" v-if="selectedRecord.apiResponse">
          <h4>接口返回信息</h4>
          <pre>{{ selectedRecord.apiResponse }}</pre>
        </div>
      </div>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'
import { fetchGateData } from '../data/mockGate.js'

// 注入角色上下文
const prototypeContext = inject('prototypeContext')
const currentRoleKey = prototypeContext?.currentRoleKey || 'gate'
const roles = [
  { key: 'gate', label: '门岗' },
  { key: 'manager', label: '管理层' },
  { key: 'admin', label: '系统管理员' }
]
const roleLabel = computed(() => roles.find(r => r.key === currentRoleKey)?.label || '门岗')

// 状态管理
const state = ref('loading') // 'loading' | 'empty' | 'success' | 'error'
const records = ref([])
const retryingId = ref(null)
const detailVisible = ref(false)
const selectedRecord = ref(null)

// 筛选配置
const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'dateRange', placeholder: '选择日期范围' },
  { type: 'input', label: '车牌号', key: 'plateNumber', placeholder: '输入车牌号' },
  { type: 'select', label: '操作结果', key: 'actionResult', options: [{ value: 'pass', label: '放行' }, { value: 'reject', label: '拒绝' }] },
  { type: 'select', label: '同步状态', key: 'syncStatus', options: [{ value: 'pending', label: '待同步' }, { value: 'syncing', label: '同步中' }, { value: 'success', label: '已同步' }, { value: 'failed', label: '同步失败' }] }
]
const filterValues = ref({})

// 根据角色设置默认筛选
if (currentRoleKey === 'gate') {
  // 门岗默认只看今天的数据
  const today = new Date()
  const todayStr = today.toISOString().slice(0, 10)
  filterValues.value.dateRange = [todayStr, todayStr]
}

// 表格列定义
const tableColumns = [
  { key: 'actionTime', title: '时间', sortable: true },
  { key: 'plateNumber', title: '车牌号' },
  {
    key: 'actionResult',
    title: '操作类型',
    customRender: (val) => val === 'pass' ? '放行' : '拒绝'
  },
  { key: 'operator', title: '操作员' },
  { key: 'syncStatus', title: '同步状态', slot: 'syncStatus' },
  { key: 'actions', title: '操作', slot: 'actions', width: '120px' }
]

// 同步状态文本映射
function syncStatusText(status) {
  const map = {
    pending: '待同步',
    syncing: '同步中',
    success: '已同步',
    failed: '同步失败'
  }
  return map[status] || status
}

// 获取数据（模拟从 mock 读取）
async function fetchRecords() {
  state.value = 'loading'
  try {
    // 模拟异步获取
    const data = await fetchGateData()
    // 由于 fetchGateData 返回整个 mock 对象，需要提取 entryRecord 数组
    // 假设返回对象包含 entryRecords 数组
    const rawRecords = data?.entryRecords || []
    // 根据筛选条件过滤（原型简化：只做前端模拟过滤）
    let filtered = rawRecords
    if (filterValues.value.dateRange && filterValues.value.dateRange.length === 2) {
      const start = filterValues.value.dateRange[0]
      const end = filterValues.value.dateRange[1]
      filtered = filtered.filter(r => r.actionTime >= start && r.actionTime <= end + 'T23:59:59')
    }
    if (filterValues.value.plateNumber) {
      filtered = filtered.filter(r => r.plateNumber.includes(filterValues.value.plateNumber))
    }
    if (filterValues.value.actionResult) {
      filtered = filtered.filter(r => r.actionResult === filterValues.value.actionResult)
    }
    if (filterValues.value.syncStatus) {
      filtered = filtered.filter(r => r.syncStatus === filterValues.value.syncStatus)
    }
    // 按角色限制，门岗只看到自己的记录
    if (currentRoleKey === 'gate') {
      const currentUser = '门岗-赵工'
      filtered = filtered.filter(r => r.operator === currentUser)
    }
    records.value = filtered
    state.value = filtered.length === 0 ? 'empty' : 'success'
  } catch (e) {
    state.value = 'error'
    records.value = []
  }
}

// 筛选变化
function onFilterChange() {
  fetchRecords()
}

// 打开详情
function openDetail(row) {
  selectedRecord.value = row
  detailVisible.value = true
}

// 重新同步
async function retrySync(recordId) {
  retryingId.value = recordId
  // 模拟调用的延迟
  await new Promise(resolve => setTimeout(resolve, 1500))
  // 模拟更新该记录状态为 'syncing' 或 'success'
  const record = records.value.find(r => r.id === recordId)
  if (record) {
    record.syncStatus = 'syncing'
  }
  // 实际项目中这里调用 POST /api/gate/retry-sync/{recordId}
  // 并处理结果
  retryingId.value = null
}

// 初始化
onMounted(() => {
  fetchRecords()
})
</script>

<style scoped>
.gate-entry-records-view {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100%;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}
.role-badge {
  background: #409eff;
  color: #fff;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
}
.loading-placeholder {
  padding: 20px 0;
}
.skeleton-row {
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
  margin-bottom: 8px;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
.error-container {
  text-align: center;
  padding: 40px;
  color: #909399;
}
.error-container button {
  margin-top: 12px;
  padding: 8px 20px;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.empty-container {
  text-align: center;
  padding: 60px 0;
  color: #909399;
}
.table-wrapper {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
.retry-btn {
  padding: 4px 12px;
  background: #e6a23c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}
.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.detail-content {
  padding: 16px;
}
.detail-section {
  margin-bottom: 20px;
}
.detail-section h4 {
  margin: 0 0 8px 0;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 6px;
}
.detail-section p {
  margin: 4px 0;
  color: #606266;
}
.detail-section pre {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 12px;
}
</style>