<template>
  <div class="workspace-view">
    <!-- 顶部筛选与排序栏 -->
    <div class="filter-bar">
      <div class="filter-group">
        <label>车辆类型</label>
        <select v-model="filters.vehicleType" @change="onFilterChange">
          <option value="">全部</option>
          <option value="truck">货车</option>
          <option value="van">厢式车</option>
          <option value="flatbed">平板车</option>
        </select>
      </div>
      <div class="filter-group">
        <label>作业区域</label>
        <select v-model="filters.area" @change="onFilterChange">
          <option value="">全部</option>
          <option value="A">A区</option>
          <option value="B">B区</option>
          <option value="C">C区</option>
        </select>
      </div>
      <div class="filter-group">
        <label>申请日期</label>
        <input type="date" v-model="filters.date" @change="onFilterChange" />
      </div>
      <div class="filter-group">
        <label>排序</label>
        <select v-model="filters.sortBy" @change="onFilterChange">
          <option value="urgency">紧急度</option>
          <option value="applyTime">申请时间</option>
        </select>
      </div>
      <div class="filter-group">
        <label>车牌搜索</label>
        <input type="text" v-model="filters.plateSearch" @input="onFilterChange" placeholder="输入车牌" />
      </div>
      <button class="refresh-btn" @click="refreshList">刷新</button>
    </div>

    <!-- 主体区域：左侧列表 + 右侧详情 -->
    <div class="main-content">
      <!-- 左侧待办申请列表区 -->
      <div class="left-panel">
        <div v-if="loading" class="loading-state">
          <div class="skeleton-item" v-for="i in 5" :key="i"></div>
        </div>
        <div v-else-if="error" class="error-state">
          <p>网络错误，加载失败</p>
          <button @click="refreshList">重试</button>
        </div>
        <div v-else-if="reservations.length === 0" class="empty-state">
          <p>暂无待审批预约</p>
        </div>
        <div v-else class="list">
          <div
            v-for="item in filteredReservations"
            :key="item.id"
            class="list-item"
            :class="{ selected: selectedId === item.id, overdue: item.overdue }"
            @click="selectItem(item)"
          >
            <div class="item-header">
              <span class="plate">{{ item.plateNumber }}</span>
              <span class="status-tag" :style="{ backgroundColor: statusColor(item.status) }">{{ item.status }}</span>
              <span v-if="item.overdue" class="overdue-badge">超时</span>
            </div>
            <div class="item-body">
              <span>类型: {{ item.vehicleType }}</span>
              <span>区域: {{ item.area }}</span>
              <span>时间: {{ item.applyTime }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧详情与操作区 -->
      <div class="right-panel">
        <div v-if="!selectedId" class="placeholder">
          <p>请选择一条申请</p>
        </div>
        <div v-else>
          <div v-if="detailLoading" class="loading-indicator">加载中...</div>
          <div v-else-if="detailError" class="detail-error">
            <p>加载详情失败</p>
            <button @click="loadDetail(selectedId)">重试</button>
          </div>
          <div v-else class="detail-content">
            <h3>预约详情</h3>
            <div class="detail-row" v-for="(value, key) in detailFields" :key="key">
              <span class="label">{{ key }}</span>
              <span class="value">{{ value }}</span>
            </div>
            <div class="vehicle-check" v-if="vehicleCheckResult">
              <h4>车辆档案校验</h4>
              <p v-if="vehicleCheckResult.valid" style="color: green;">校验通过</p>
              <p v-else style="color: red;">校验不通过: {{ vehicleCheckResult.message }}</p>
            </div>
            <div class="approval-actions" v-if="currentDetail && currentDetail.status === 'pending'">
              <textarea v-model="approvalComment" placeholder="审批意见" rows="3"></textarea>
              <div class="buttons">
                <button class="approve-btn" @click="handleApprove">通过</button>
                <button class="reject-btn" @click="handleReject">驳回</button>
              </div>
            </div>
            <div class="access-code-section" v-if="currentDetail && currentDetail.status === 'approved'">
              <h4>授权码</h4>
              <p>授权码: {{ currentDetail.accessCode?.code || '生成中...' }}</p>
              <p>同步状态: {{ currentDetail.accessCode?.syncStatus || '未知' }}</p>
              <button v-if="currentDetail.accessCode?.syncStatus === 'failed'" @click="resyncCode">重新同步</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部操作日志快照 -->
    <div class="bottom-log">
      <h4>审批记录</h4>
      <div v-if="logs.length === 0">暂无操作记录</div>
      <div v-for="log in logs" :key="log.id" class="log-item">
        <span>{{ log.operator }}</span>
        <span>{{ log.action }}</span>
        <span>{{ log.time }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted, watch } from 'vue'
import { fetchReservationsData } from '../data/mockReservations.js'

// 注入 prototypeContext
const prototypeContext = inject('prototypeContext')
const currentRole = prototypeContext?.currentRole || 'approver'
const currentRoleKey = prototypeContext?.currentRoleKey || 'approver'

// 页面状态
const loading = ref(true)
const error = ref(false)
const detailLoading = ref(false)
const detailError = ref(false)
const reservations = ref([])
const selectedId = ref(null)
const currentDetail = ref(null)
const vehicleCheckResult = ref(null)
const approvalComment = ref('')
const logs = ref([])

// 筛选条件
const filters = ref({
  vehicleType: '',
  area: '',
  date: '',
  sortBy: 'urgency',
  plateSearch: ''
})

// 根据角色调整默认筛选
if (currentRoleKey === 'manager' || currentRoleKey === 'admin') {
  // 管理员可以看到全部，不额外筛选
} else if (currentRoleKey === 'approver') {
  // 审批人员默认只看待审批
}

// 过滤后的列表（模拟）
const filteredReservations = computed(() => {
  let list = reservations.value
  if (filters.value.vehicleType) {
    list = list.filter(item => item.vehicleType === filters.value.vehicleType)
  }
  if (filters.value.area) {
    list = list.filter(item => item.area === filters.value.area)
  }
  if (filters.value.date) {
    list = list.filter(item => item.applyTime.startsWith(filters.value.date))
  }
  if (filters.value.plateSearch) {
    list = list.filter(item => item.plateNumber.includes(filters.value.plateSearch))
  }
  return list
})

// 详情展示字段映射
const detailFields = computed(() => {
  if (!currentDetail.value) return {}
  const d = currentDetail.value
  return {
    '申请ID': d.id,
    '车牌号': d.plateNumber,
    '车辆类型': d.vehicleType,
    '所属单位': d.unit,
    '作业区域': d.area,
    '预约时间': d.applyTime,
    '申请状态': d.status,
    '超时标记': d.overdue ? '是' : '否'
  }
})

// 状态颜色
function statusColor(status) {
  const map = {
    'pending': '#ffa500',
    'approved': '#4caf50',
    'rejected': '#f44336',
    'expired': '#9e9e9e'
  }
  return map[status] || '#ccc'
}

// 加载列表
async function loadList() {
  loading.value = true
  error.value = false
  try {
    const data = await fetchReservationsData()
    reservations.value = data || []
    // 模拟日志
    logs.value = [
      { id: 1, operator: '陈主管', action: '通过', time: '2025-03-20 10:30' },
      { id: 2, operator: '陈主管', action: '驳回', time: '2025-03-19 14:20' }
    ]
  } catch (e) {
    console.error(e)
    error.value = true
  } finally {
    loading.value = false
  }
}

// 选择列表项
function selectItem(item) {
  selectedId.value = item.id
  loadDetail(item.id)
}

// 加载详情
async function loadDetail(id) {
  detailLoading.value = true
  detailError.value = false
  try {
    // 模拟从mock数据中查找
    const item = reservations.value.find(r => r.id === id)
    if (item) {
      currentDetail.value = { ...item }
      // 模拟车辆校验结果
      vehicleCheckResult.value = {
        valid: Math.random() > 0.3,
        message: '年检已过期'
      }
    } else {
      detailError.value = true
    }
  } catch (e) {
    detailError.value = true
  } finally {
    detailLoading.value = false
  }
}

// 筛选变化
function onFilterChange() {
  // 如果是角色为approver，只保留pending状态？ 这里不强制，让filtered列表处理
}

// 刷新列表
function refreshList() {
  loadList()
}

// 通过审批
async function handleApprove() {
  if (!currentDetail.value) return
  // 模拟调用审批通过接口
  // 实际应调用 /api/reservations/{id}/approve
  currentDetail.value.status = 'approved'
  currentDetail.value.accessCode = {
    code: 'CODE-' + Date.now(),
    syncStatus: 'syncing'
  }
  // 模拟同步状态更新
  setTimeout(() => {
    if (currentDetail.value && currentDetail.value.accessCode) {
      currentDetail.value.accessCode.syncStatus = 'synced'
    }
  }, 2000)
  logs.value.unshift({ id: Date.now(), operator: '当前用户', action: '通过', time: new Date().toLocaleString() })
}

// 驳回审批
async function handleReject() {
  if (!approvalComment.value.trim()) {
    alert('请填写驳回原因')
    return
  }
  if (!currentDetail.value) return
  currentDetail.value.status = 'rejected'
  logs.value.unshift({ id: Date.now(), operator: '当前用户', action: '驳回', time: new Date().toLocaleString() })
  selectedId.value = null
  currentDetail.value = null
}

// 重新同步授权码
async function resyncCode() {
  if (!currentDetail.value || !currentDetail.value.accessCode) return
  currentDetail.value.accessCode.syncStatus = 'syncing'
  // 模拟重新同步
  setTimeout(() => {
    if (currentDetail.value && currentDetail.value.accessCode) {
      currentDetail.value.accessCode.syncStatus = 'synced'
    }
  }, 2000)
}

onMounted(() => {
  loadList()
})
</script>

<style scoped>
.workspace-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #e0e0e0;
}
.filter-group {
  display: flex;
  align-items: center;
  gap: 4px;
}
.filter-group label {
  font-size: 13px;
  color: #333;
}
.filter-group select,
.filter-group input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 13px;
}
.refresh-btn {
  margin-left: auto;
  padding: 6px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}
.left-panel {
  width: 40%;
  min-width: 300px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
  background: #fafafa;
}
.right-panel {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  background: #fff;
}
.list-item {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}
.list-item:hover {
  background: #f0f5ff;
}
.list-item.selected {
  background: #e6f7ff;
  border-left: 3px solid #1890ff;
}
.list-item.overdue {
  border-left: 3px solid #faad14;
}
.item-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}
.plate {
  font-weight: 600;
  font-size: 14px;
}
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 10px;
  color: #fff;
  font-size: 12px;
}
.overdue-badge {
  background: #faad14;
  color: #fff;
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
}
.item-body {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
}
.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #999;
}
.skeleton-item {
  height: 60px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 8px;
  border-radius: 4px;
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}
.detail-content h3 {
  margin-top: 0;
}
.detail-row {
  display: flex;
  margin-bottom: 6px;
  font-size: 13px;
}
.detail-row .label {
  width: 90px;
  color: #888;
}
.detail-row .value {
  color: #333;
}
.vehicle-check {
  margin-top: 12px;
  padding: 8px;
  background: #f5f5f5;
  border-radius: 4px;
}
.approval-actions {
  margin-top: 16px;
}
.approval-actions textarea {
  width: 100%;
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
.buttons {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.approve-btn {
  padding: 6px 20px;
  background: #52c41a;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.reject-btn {
  padding: 6px 20px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.access-code-section {
  margin-top: 16px;
  padding: 8px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
}
.bottom-log {
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
  background: #fff;
  max-height: 120px;
  overflow-y: auto;
}
.bottom-log h4 {
  margin: 0 0 8px;
  font-size: 14px;
}
.log-item {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}
.loading-indicator {
  text-align: center;
  padding: 40px;
  color: #999;
}
.detail-error {
  text-align: center;
  padding: 40px;
  color: #f5222d;
}
</style>