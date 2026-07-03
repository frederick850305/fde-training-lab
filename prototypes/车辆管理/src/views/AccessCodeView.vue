<template>
  <div class="access-code-view">
    <!-- 顶部状态筛选栏 -->
    <div class="filter-bar">
      <div class="status-tabs">
        <span
          v-for="tab in statusTabs"
          :key="tab.key"
          :class="['status-tab', { active: activeStatus === tab.key }]"
          @click="selectStatus(tab.key)"
        >
          {{ tab.label }}
        </span>
      </div>
      <div class="search-box">
        <input
          v-model="searchKeyword"
          type="text"
          placeholder="搜索车牌号"
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">搜索</button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="skeleton-table">
        <div v-for="n in 5" :key="n" class="skeleton-row"></div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <p>{{ errorMessage }}</p>
      <button @click="fetchList">重试</button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredList.length === 0" class="empty-state">
      <p>暂无授权码数据</p>
    </div>

    <!-- 列表区域 -->
    <div v-else class="list-area">
      <div class="list-header">
        <span class="col-plate">车牌号</span>
        <span class="col-code">授权码</span>
        <span class="col-valid">有效期</span>
        <span class="col-status">同步状态</span>
        <span class="col-use-time">使用时间</span>
        <span class="col-gate">门岗信息</span>
        <span class="col-action">操作</span>
      </div>
      <div
        v-for="item in filteredList"
        :key="item.id"
        class="list-row"
        @click="toggleExpand(item)"
      >
        <span class="col-plate">{{ item.plateNumber }}</span>
        <span class="col-code">{{ item.code }}</span>
        <span class="col-valid">{{ item.validPeriod }}</span>
        <span class="col-status">
          <StatusTag :status="item.syncStatus" :text="statusLabelMap[item.syncStatus]" size="small" />
        </span>
        <span class="col-use-time">{{ item.useTime || '-' }}</span>
        <span class="col-gate">{{ item.gateInfo || '-' }}</span>
        <span class="col-action">
          <button v-if="item.expanded" @click.stop="toggleExpand(item)">收起</button>
          <button v-else @click.stop="toggleExpand(item)">展开</button>
        </span>

        <!-- 展开详情 -->
        <div v-if="item.expanded" class="detail-panel">
          <div class="sync-logs">
            <strong>同步日志：</strong>
            <p>{{ item.syncLog || '暂无日志' }}</p>
          </div>
          <button
            class="retry-btn"
            :disabled="item.retrying"
            @click.stop="resync(item)"
          >
            {{ item.retrying ? '重新同步中...' : '重新同步' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { reservationsRecords, fetchReservationsData } from '../data/mockReservations.js'
import StatusTag from '../components/StatusTag.vue'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey || 'approver')

// 状态筛选标签
const statusTabs = [
  { key: 'all', label: '全部' },
  { key: 'synced', label: '同步成功' },
  { key: 'failed', label: '同步失败' },
  { key: 'pending', label: '待同步' },
  { key: 'expired', label: '已过期' },
  { key: 'used', label: '已使用' }
]

const statusLabelMap = {
  synced: '同步成功',
  failed: '同步失败',
  pending: '待同步',
  expired: '已过期',
  used: '已使用'
}

// 根据角色设置默认筛选状态
const defaultStatus = (() => {
  if (currentRoleKey.value === 'gate') return 'pending'
  if (currentRoleKey.value === 'approver') return 'all'
  return 'all'
})()

const activeStatus = ref(defaultStatus)
const searchKeyword = ref('')
const rawList = ref([])
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')

// 从 mock 数据中提取授权码列表
function extractAccessCodes(records) {
  const items = []
  records.forEach((rec, index) => {
    if (rec.accessCode) {
      items.push({
        id: rec.accessCode.id || index,
        plateNumber: rec.accessCode.plateNumber || rec.reservationItem?.plateNumber || '未知',
        code: rec.accessCode.code || rec.accessCode.accessCodeValue || '-',
        validPeriod: rec.accessCode.validPeriod || rec.accessCode.validity || '-',
        syncStatus: rec.accessCode.syncStatus || 'pending',
        useTime: rec.accessCode.useTime || '',
        gateInfo: rec.accessCode.gateInfo || '',
        syncLog: rec.accessCode.syncLog || '',
        expanded: false,
        retrying: false
      })
    }
  })
  return items
}

async function fetchList() {
  loading.value = true
  error.value = false
  try {
    // 模拟异步
    await new Promise(resolve => setTimeout(resolve, 300))
    const data = fetchReservationsData ? fetchReservationsData() : reservationsRecords
    rawList.value = extractAccessCodes(data)
  } catch (e) {
    error.value = true
    errorMessage.value = '获取授权码列表失败，请重试。'
  } finally {
    loading.value = false
  }
}

// 筛选逻辑
const filteredList = computed(() => {
  let list = rawList.value
  // 状态筛选
  if (activeStatus.value !== 'all') {
    list = list.filter(item => item.syncStatus === activeStatus.value)
  }
  // 车牌号搜索
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.trim().toLowerCase()
    list = list.filter(item => item.plateNumber.toLowerCase().includes(kw))
  }
  return list
})

function selectStatus(key) {
  activeStatus.value = key
}

function handleSearch() {
  // 搜索已在 computed 中实时触发，此函数仅保留用于回车或点击搜索按钮的显式意图
}

function toggleExpand(item) {
  item.expanded = !item.expanded
}

async function resync(item) {
  item.retrying = true
  try {
    // 模拟 POST /api/access-codes/{id}/resync
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟80%成功率
        if (Math.random() > 0.2) {
          item.syncStatus = 'synced'
          item.syncLog = '门禁同步成功'
          resolve()
        } else {
          reject(new Error('同步失败：门禁超时'))
        }
      }, 800)
    })
  } catch (e) {
    item.syncStatus = 'failed'
    item.syncLog = e.message
  } finally {
    item.retrying = false
  }
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.access-code-view {
  padding: 16px;
  font-size: 14px;
  color: #333;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.status-tabs {
  display: flex;
  gap: 8px;
}

.status-tab {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  background: #fff;
  transition: all 0.2s;
}

.status-tab.active {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}

.search-box {
  display: flex;
  gap: 4px;
}

.search-box input {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 180px;
}

.search-btn {
  padding: 4px 12px;
  border: 1px solid #1890ff;
  background: #1890ff;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}

.loading-state .skeleton-table {
  display: flex;
  flex-direction: column;
  gap: 8px;
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

.error-state, .empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.error-state button {
  margin-top: 8px;
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
}

.list-area {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
}

.list-header {
  display: flex;
  background: #fafafa;
  padding: 10px 16px;
  font-weight: 600;
  border-bottom: 1px solid #e8e8e8;
}

.list-row {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
  flex-wrap: wrap;
}

.list-row:hover {
  background: #f5f5f5;
}

.list-row:last-child {
  border-bottom: none;
}

.col-plate { flex: 1.5; min-width: 100px; }
.col-code { flex: 1.5; min-width: 120px; }
.col-valid { flex: 1.5; min-width: 100px; }
.col-status { flex: 1; min-width: 80px; }
.col-use-time { flex: 1.2; min-width: 100px; }
.col-gate { flex: 1.2; min-width: 80px; }
.col-action { flex: 0.8; min-width: 60px; text-align: center; }

.detail-panel {
  width: 100%;
  padding: 12px 16px;
  background: #f9f9f9;
  border-top: 1px solid #e8e8e8;
  margin-top: 8px;
}

.sync-logs {
  margin-bottom: 8px;
}

.sync-logs p {
  margin: 4px 0 0;
  color: #666;
}

.retry-btn {
  padding: 4px 12px;
  border: 1px solid #faad14;
  background: #fff7e6;
  color: #d46b08;
  border-radius: 4px;
  cursor: pointer;
}

.retry-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
