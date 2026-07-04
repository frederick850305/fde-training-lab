<template>
  <div class="access-code-view">
    <!-- 顶部状态筛选栏 -->
    <div class="status-filter">
      <span
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="['filter-tab', { active: activeStatus === tab.value }]"
        @click="switchStatus(tab.value)"
      >
        {{ tab.label }}
      </span>
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索车牌号"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-table">
        <div v-for="i in 5" :key="i" class="skeleton-row"></div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>加载失败：{{ errorMessage }}</p>
      <button @click="fetchData">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="codes.length === 0" class="empty-state">
      <p>暂无授权码数据</p>
    </div>

    <!-- 成功状态：列表 -->
    <div v-else class="code-list">
      <div
        v-for="code in codes"
        :key="code.id"
        class="code-card"
        @click="toggleExpand(code.id)"
      >
        <div class="code-summary">
          <span class="plate">{{ code.plateNumber }}</span>
          <span class="code-value">{{ code.code }}</span>
          <span class="valid-date">{{ formatDate(code.validFrom) }} - {{ formatDate(code.validTo) }}</span>
          <span :class="['status-tag', statusClass(code.syncStatus)]">{{ statusLabel(code.syncStatus) }}</span>
          <span v-if="code.usedAt" class="used-time">使用时间：{{ formatDate(code.usedAt) }}</span>
          <span v-if="code.gateName" class="gate-info">{{ code.gateName }}</span>
          <span class="expand-icon">{{ expandedId === code.id ? '▲' : '▼' }}</span>
        </div>
        <!-- 展开详情 -->
        <div v-if="expandedId === code.id" class="code-detail">
          <div class="sync-log">
            <p v-if="code.syncLog">{{ code.syncLog }}</p>
            <p v-else>暂无同步日志</p>
          </div>
          <button
            v-if="code.syncStatus === 'failed'"
            class="retry-btn"
            :disabled="retryingId === code.id"
            @click.stop="retrySync(code.id)"
          >
            {{ retryingId === code.id ? '重试中...' : '重新同步' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract.js'
import { fetchReservationsData, reservationsRecords } from '../data/mockReservations.js'

// 角色上下文
const prototypeContext = inject('prototypeContext')
const currentRole = computed(() => prototypeContext?.currentRole || {})
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey || '')

// 状态筛选
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
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const codes = ref([])
const expandedId = ref(null)
const retryingId = ref(null)

// 获取数据
async function fetchData() {
  loading.value = true
  error.value = false
  errorMessage.value = ''
  try {
    const data = await fetchReservationsData()
    // 从 mock 数据中提取 accessCode 列表
    const rawCodes = data.map(item => item.accessCode).filter(Boolean)
    // 根据角色做默认筛选（示例：管理员看到全部，审批人员默认看待同步）
    let filtered = rawCodes
    if (currentRoleKey.value === 'approver') {
      filtered = rawCodes.filter(c => c.syncStatus === 'pending' || c.syncStatus === 'failed')
    }
    // 应用状态筛选
    if (activeStatus.value !== 'all') {
      filtered = filtered.filter(c => c.syncStatus === activeStatus.value)
    }
    // 搜索车牌号
    if (searchKeyword.value.trim()) {
      const kw = searchKeyword.value.trim().toLowerCase()
      filtered = filtered.filter(c => c.plateNumber && c.plateNumber.toLowerCase().includes(kw))
    }
    codes.value = filtered
  } catch (e) {
    error.value = true
    errorMessage.value = e.message || '接口请求失败'
  } finally {
    loading.value = false
  }
}

// 切换状态筛选
function switchStatus(val) {
  activeStatus.value = val
  fetchData()
}

// 搜索
function handleSearch() {
  fetchData()
}

// 展开/收起详情
function toggleExpand(id) {
  expandedId.value = expandedId.value === id ? null : id
}

// 重新同步
async function retrySync(id) {
  retryingId.value = id
  // 模拟请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  // 更新本地状态
  const code = codes.value.find(c => c.id === id)
  if (code) {
    code.syncStatus = 'success'
    code.syncLog = '重试成功，已同步'
  }
  retryingId.value = null
}

// 工具函数
function formatDate(dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
}

function statusClass(status) {
  const map = {
    success: 'status-success',
    failed: 'status-failed',
    pending: 'status-pending',
    expired: 'status-expired',
    used: 'status-used'
  }
  return map[status] || ''
}

function statusLabel(status) {
  const map = {
    success: '同步成功',
    failed: '同步失败',
    pending: '待同步',
    expired: '已过期',
    used: '已使用'
  }
  return map[status] || status
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.access-code-view {
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.status-filter {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.filter-tab {
  padding: 6px 14px;
  border-radius: 20px;
  background: #f0f0f0;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.filter-tab.active {
  background: #1890ff;
  color: white;
}

.search-box {
  margin-left: auto;
  display: flex;
  gap: 4px;
}

.search-box input {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.search-box button {
  padding: 6px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.loading-state .skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  height: 48px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.error-state {
  text-align: center;
  padding: 40px;
  color: #ff4d4f;
}

.error-state button {
  margin-top: 12px;
  padding: 8px 20px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 60px;
  color: #999;
}

.code-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.code-card {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.code-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.code-summary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 16px;
}

.plate {
  font-weight: bold;
  min-width: 80px;
}

.code-value {
  font-family: monospace;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
}

.valid-date {
  color: #666;
  font-size: 13px;
}

.status-tag {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-success { background: #f6ffed; color: #52c41a; border: 1px solid #b7eb8f; }
.status-failed { background: #fff2f0; color: #ff4d4f; border: 1px solid #ffccc7; }
.status-pending { background: #fffbe6; color: #faad14; border: 1px solid #ffe58f; }
.status-expired { background: #f0f0f0; color: #999; border: 1px solid #d9d9d9; }
.status-used { background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff; }

.used-time, .gate-info {
  font-size: 13px;
  color: #555;
}

.expand-icon {
  margin-left: auto;
  color: #999;
}

.code-detail {
  margin-top: 12px;
  padding: 12px;
  background: #fafafa;
  border-radius: 6px;
}

.sync-log {
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.retry-btn {
  padding: 6px 16px;
  background: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
