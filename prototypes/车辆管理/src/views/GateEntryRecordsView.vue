<template>
  <div class="gate-entry-records">
    <h2 class="page-title">入场记录</h2>
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :show-search-button="false"
      :auto-search-delay="300"
      @update:model-value="onFilterChange"
    />

    <DataTable
      :columns="tableColumns"
      :data="tableData"
      :loading="loadingState === 'loading'"
      :empty-text="emptyText"
      :pagination="pagination"
      row-key="recordId"
      @row-click="onRowClick"
    >
      <template #syncStatus="{ row }">
        <StatusTag
          :status="row.syncStatus"
          :text="syncStatusText(row.syncStatus)"
          size="small"
        />
        <button
          v-if="row.syncStatus === 'failed'"
          class="retry-btn"
          :disabled="retryingIds.includes(row.recordId)"
          @click.stop="onRetrySync(row)"
        >
          {{ retryingIds.includes(row.recordId) ? '重试中...' : '重新同步' }}
        </button>
      </template>
    </DataTable>

    <Teleport to="body">
      <DetailPanel
        :visible="detailVisible"
        title="入场记录详情"
        mode="modal"
        width="600px"
        @close="detailVisible = false"
      >
        <div class="detail-content" v-if="selectedRecord">
          <div class="detail-item"><label>记录ID</label><span>{{ selectedRecord.recordId }}</span></div>
          <div class="detail-item"><label>车牌号</label><span>{{ selectedRecord.plateNumber }}</span></div>
          <div class="detail-item"><label>操作结果</label><span>{{ selectedRecord.actionResult }}</span></div>
          <div class="detail-item"><label>操作时间</label><span>{{ formatTime(selectedRecord.actionTime) }}</span></div>
          <div class="detail-item"><label>操作员</label><span>{{ selectedRecord.operator }}</span></div>
          <div class="detail-item" v-if="selectedRecord.rejectReason"><label>拒绝原因</label><span>{{ selectedRecord.rejectReason }}</span></div>
          <div class="detail-item"><label>同步状态</label><span>{{ syncStatusText(selectedRecord.syncStatus) }}</span></div>
          <div class="detail-item" v-if="selectedRecord.extraInfo"><label>接口返回信息</label><pre>{{ selectedRecord.extraInfo }}</pre></div>
          <div class="detail-item" v-if="selectedRecord.degradation"><label>降级标记</label><span>{{ selectedRecord.degradation }}</span></div>
        </div>
      </DetailPanel>
    </Teleport>

    <div v-if="loadingState === 'error'" class="error-state">
      <p>加载失败，请重试</p>
      <button @click="loadRecords">重试</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract.js'
import { fetchGateData } from '../data/mockGate.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'

const context = inject('prototypeContext', { currentRole: 'gate', currentRoleKey: 'gate' })
const currentRoleKey = computed(() => context.currentRoleKey)
const currentRole = computed(() => context.currentRole)

// 状态管理
const loadingState = ref('loading') // 'loading' | 'empty' | 'success' | 'error'
const tableData = ref([])
const pagination = ref({ current: 1, pageSize: 20, total: 0 })
const retryingIds = ref([])
const detailVisible = ref(false)
const selectedRecord = ref(null)

// 筛选配置
const filterConfig = [
  { type: 'dateRange', label: '时间范围', key: 'dateRange', placeholder: ['开始日期', '结束日期'] },
  { type: 'input', label: '车牌号', key: 'plateNumber', placeholder: '请输入车牌号' },
  { type: 'select', label: '操作结果', key: 'actionResult', options: [{ label: '放行', value: 'pass' }, { label: '拒绝', value: 'reject' }] },
  { type: 'select', label: '同步状态', key: 'syncStatus', options: [{ label: '同步成功', value: 'success' }, { label: '同步失败', value: 'failed' }, { label: '同步中', value: 'pending' }] }
]

// 根据角色调整默认筛选
const defaultFilter = computed(() => {
  const base = { dateRange: [], plateNumber: '', actionResult: '', syncStatus: '' }
  if (currentRoleKey.value === 'gate') {
    // 门岗只看今天
    const today = new Date()
    const start = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
    base.dateRange = [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]
  } else if (currentRoleKey.value === 'manager' || currentRoleKey.value === 'admin') {
    // 管理员默认近7天
    const end = new Date()
    const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000)
    base.dateRange = [start.toISOString().slice(0, 10), end.toISOString().slice(0, 10)]
  }
  return base
})

const filterValues = ref({ ...defaultFilter.value })

// 表格列定义
const tableColumns = [
  { key: 'actionTime', title: '操作时间', sortable: true },
  { key: 'plateNumber', title: '车牌号', sortable: true },
  { key: 'actionResult', title: '操作类型' },
  { key: 'operator', title: '操作员' },
  { key: 'syncStatus', title: '同步状态', customRender: 'syncStatus' }
]

const emptyText = computed(() => {
  if (loadingState.value === 'empty') return '暂无入场记录'
  if (loadingState.value === 'error') return '加载失败'
  return '暂无数据'
})

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return d.toLocaleString('zh-CN', { hour12: false })
}

function syncStatusText(status) {
  const map = { success: '已同步', failed: '同步失败', pending: '同步中' }
  return map[status] || status
}

async function loadRecords() {
  loadingState.value = 'loading'
  try {
    const filters = {
      startDate: filterValues.value.dateRange?.[0] || '',
      endDate: filterValues.value.dateRange?.[1] || '',
      plateNumber: filterValues.value.plateNumber,
      actionResult: filterValues.value.actionResult,
      syncStatus: filterValues.value.syncStatus
    }
    // 模拟分页
    const result = await fetchGateData('entryRecords', { page: pagination.value.current, pageSize: pagination.value.pageSize, ...filters })
    // normalize mapping
    const rawList = result.list || []
    const normalized = rawList.map(item => ({
      recordId: item.recordId || item.id,
      plateNumber: item.plateNumber,
      actionResult: item.actionResult === 'pass' ? '放行' : (item.actionResult === 'reject' ? '拒绝' : item.actionResult),
      actionTime: item.actionTime,
      operator: item.operator,
      rejectReason: item.rejectReason || '',
      syncStatus: item.syncStatus,
      extraInfo: item.extraInfo || '',
      degradation: item.degradation || ''
    }))
    tableData.value = normalized
    pagination.value.total = result.total || normalized.length
    loadingState.value = normalized.length === 0 ? 'empty' : 'success'
  } catch (e) {
    loadingState.value = 'error'
    console.error(e)
  }
}

function onFilterChange(val) {
  filterValues.value = val
  pagination.value.current = 1
  loadRecords()
}

function onRowClick(row) {
  selectedRecord.value = row
  detailVisible.value = true
}

async function onRetrySync(row) {
  if (retryingIds.value.includes(row.recordId)) return
  retryingIds.value.push(row.recordId)
  try {
    // 模拟调用重新同步API
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟随机成功/失败
        if (Math.random() > 0.3) {
          resolve()
        } else {
          reject(new Error('同步失败'))
        }
      }, 1500)
    })
    // 更新该行同步状态为 pending（同步中）
    const idx = tableData.value.findIndex(r => r.recordId === row.recordId)
    if (idx !== -1) {
      tableData.value[idx] = { ...tableData.value[idx], syncStatus: 'pending' }
    }
  } catch (e) {
    // 保持同步失败
    alert('重新同步失败，请稍后再试')
  } finally {
    retryingIds.value = retryingIds.value.filter(id => id !== row.recordId)
  }
}

onMounted(() => {
  loadRecords()
})
</script>

<style scoped>
.gate-entry-records {
  padding: 20px;
}
.page-title {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
}
.retry-btn {
  margin-left: 8px;
  padding: 2px 8px;
  font-size: 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.retry-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}
.detail-content {
  padding: 16px;
}
.detail-item {
  display: flex;
  margin-bottom: 12px;
}
.detail-item label {
  width: 100px;
  font-weight: 500;
  color: #555;
}
.detail-item span {
  flex: 1;
}
.detail-item pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  white-space: pre-wrap;
}
.error-state {
  text-align: center;
  padding: 40px;
  color: #999;
}
.error-state button {
  margin-top: 12px;
  padding: 6px 20px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
