<template>
  <div class="access-code-view">
    <!-- 顶部状态筛选栏 -->
    <div class="filter-bar">
      <span
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="['filter-tab', { active: activeStatus === tab.value }]"
        @click="switchStatus(tab.value)"
      >
        {{ tab.label }}
      </span>
      <div class="search-area">
        <input
          v-model="searchKeyword"
          placeholder="搜索车牌号"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 状态：loading -->
    <div v-if="uiState === 'loading'" class="skeleton">
      <div v-for="n in 5" :key="n" class="skeleton-row"></div>
    </div>

    <!-- 状态：error -->
    <div v-else-if="uiState === 'error'" class="error-state">
      <p>数据加载失败，请稍后重试</p>
      <button @click="fetchData">重试</button>
    </div>

    <!-- 状态：empty -->
    <div v-else-if="uiState === 'empty'" class="empty-state">
      <p>暂无授权码数据</p>
    </div>

    <!-- 状态：success 显示列表 -->
    <div v-else-if="uiState === 'success'" class="content-area">
      <DataTable
        :columns="tableColumns"
        :data="accessCodeList"
        :loading="false"
        :pagination="pagination"
        rowKey="id"
        @row-click="handleRowClick"
        @update:pagination="handlePageChange"
      >
        <!-- 自定义状态列 -->
        <template #syncStatus="{ row }">
          <StatusTag
            :status="row.syncStatus"
            :text="syncStatusMap[row.syncStatus]"
            size="small"
          />
        </template>
        <!-- 展开行内容 -->
        <template #expand="{ row }">
          <div class="expand-detail">
            <p><strong>同步日志：</strong>{{ row.syncLog }}</p>
            <button
              v-if="row.syncStatus === 'failed'"
              @click.stop="retrySync(row)"
              :disabled="row.resyncing"
            >
              {{ row.resyncing ? '重试中...' : '重新同步' }}
            </button>
          </div>
        </template>
      </DataTable>

      <!-- 详情面板（使用 DetailPanel 组件） -->
      <DetailPanel
        :visible="detailVisible"
        :title="'授权码详情'"
        mode="drawer"
        width="500px"
        @close="detailVisible = false"
      >
        <div v-if="currentDetail">
          <p>车牌号：{{ currentDetail.plate }}</p>
          <p>授权码：{{ currentDetail.code }}</p>
          <p>有效期：{{ currentDetail.validUntil }}</p>
          <p>同步状态：{{ syncStatusMap[currentDetail.syncStatus] }}</p>
          <p>使用时间：{{ currentDetail.usedAt || '未使用' }}</p>
          <p>门岗信息：{{ currentDetail.gate || '-' }}</p>
        </div>
      </DetailPanel>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import StatusTag from '@/components/StatusTag.vue'
import DetailPanel from '@/components/DetailPanel.vue'

// 状态筛选 tabs
const statusTabs = [
  { label: '全部', value: 'all' },
  { label: '同步成功', value: 'success' },
  { label: '同步失败', value: 'failed' },
  { label: '待同步', value: 'pending' },
  { label: '已过期', value: 'expired' },
  { label: '已使用', value: 'used' }
]

const activeStatus = ref('all')
const searchKeyword = ref('')
const uiState = ref('loading')
const accessCodeList = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 表格列定义
const tableColumns = [
  { key: 'plate', title: '车牌号' },
  { key: 'code', title: '授权码' },
  { key: 'validUntil', title: '有效期' },
  { key: 'syncStatus', title: '同步状态', slot: 'syncStatus' },
  { key: 'usedAt', title: '使用时间' },
  { key: 'gate', title: '门岗信息' }
]

// 同步状态映射
const syncStatusMap = {
  success: '同步成功',
  failed: '同步失败',
  pending: '待同步',
  expired: '已过期',
  used: '已使用'
}

// 详情面板
const detailVisible = ref(false)
const currentDetail = ref(null)

// Mock 数据
const mockData = [
  { id: 1, plate: '京A12345', code: 'AC001', validUntil: '2025-12-31', syncStatus: 'success', usedAt: '2025-06-15 14:30', gate: '东门', syncLog: '同步成功' },
  { id: 2, plate: '沪B67890', code: 'AC002', validUntil: '2025-12-31', syncStatus: 'failed', usedAt: null, gate: '西门', syncLog: '连接超时' },
  { id: 3, plate: '粤C11223', code: 'AC003', validUntil: '2025-11-30', syncStatus: 'pending', usedAt: null, gate: '-', syncLog: '等待同步' },
  { id: 4, plate: '苏D44556', code: 'AC004', validUntil: '2025-06-01', syncStatus: 'expired', usedAt: '2025-05-20 09:10', gate: '南门', syncLog: '已过期' },
  { id: 5, plate: '浙E77889', code: 'AC005', validUntil: '2026-01-15', syncStatus: 'used', usedAt: '2025-07-01 16:45', gate: '北门', syncLog: '已使用' }
]

// 模拟异步请求
function mockFetch() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据筛选和搜索过滤
      let filtered = [...mockData]
      if (activeStatus.value !== 'all') {
        filtered = filtered.filter(item => item.syncStatus === activeStatus.value)
      }
      if (searchKeyword.value) {
        filtered = filtered.filter(item => item.plate.includes(searchKeyword.value))
      }
      // 模拟分页
      const total = filtered.length
      const start = (pagination.current - 1) * pagination.pageSize
      const end = start + pagination.pageSize
      const pageData = filtered.slice(start, end)
      resolve({ list: pageData, total })
    }, 500)
  })
}

async function fetchData() {
  uiState.value = 'loading'
  try {
    const result = await mockFetch()
    if (result.list.length === 0) {
      uiState.value = 'empty'
    } else {
      accessCodeList.value = result.list
      pagination.total = result.total
      uiState.value = 'success'
    }
  } catch (e) {
    uiState.value = 'error'
  }
}

function switchStatus(status) {
  activeStatus.value = status
  pagination.current = 1
  fetchData()
}

function handleSearch() {
  pagination.current = 1
  fetchData()
}

function handlePageChange(newPage) {
  pagination.current = newPage.current
  pagination.pageSize = newPage.pageSize
  fetchData()
}

function handleRowClick(row) {
  // 展示详情面板
  currentDetail.value = row
  detailVisible.value = true
}

async function retrySync(row) {
  row.resyncing = true
  // 模拟重试请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 模拟成功
  row.syncStatus = 'success'
  row.syncLog = '重试同步成功'
  row.resyncing = false
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.access-code-view {
  padding: 20px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.filter-bar {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
  flex-wrap: wrap;
}
.filter-tab {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  color: #333;
  font-size: 14px;
  transition: all 0.2s;
}
.filter-tab.active,
.filter-tab:hover {
  border-color: #1890ff;
  color: #1890ff;
  background: #e6f7ff;
}
.search-area {
  margin-left: auto;
  display: flex;
  gap: 4px;
}
.search-area input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}
.search-area button {
  padding: 6px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.skeleton {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-row {
  height: 40px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
.error-state,
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
}
.error-state button {
  margin-top: 12px;
  padding: 8px 24px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.expand-detail {
  padding: 12px 24px;
  background: #fafafa;
}
.expand-detail button {
  margin-top: 8px;
  padding: 4px 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.expand-detail button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
