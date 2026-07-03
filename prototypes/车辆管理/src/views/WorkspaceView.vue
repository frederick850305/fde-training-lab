<template>
  <div class="workspace-view">
    <!-- 顶部筛选与排序栏 -->
    <div class="filter-bar">
      <select v-model="filters.vehicleType" @change="fetchList">
        <option value="">所有车辆类型</option>
        <option value="临时车">临时车</option>
        <option value="外协车">外协车</option>
      </select>
      <select v-model="filters.workArea" @change="fetchList">
        <option value="">所有作业区域</option>
        <option value="A区">A区</option>
        <option value="B区">B区</option>
      </select>
      <input type="date" v-model="filters.applyDate" @change="fetchList" />
      <select v-model="filters.sortOrder" @change="fetchList">
        <option value="desc">最新优先</option>
        <option value="asc">最旧优先</option>
      </select>
      <button @click="fetchList" class="refresh-btn">刷新</button>
    </div>

    <!-- 超时提示 -->
    <div v-if="hasOverdue" class="overdue-warning">⚠️ 存在超时未处理的申请，请尽快处理。</div>

    <div class="main-content">
      <!-- 左侧待办列表 -->
      <div class="list-panel">
        <div v-if="loading" class="skeleton">加载中...</div>
        <div v-else-if="error" class="error-state">
          <p>网络错误：{{ errorMessage }}</p>
          <button @click="fetchList">重试</button>
        </div>
        <div v-else-if="filteredList.length === 0" class="empty-state">暂无待审批预约</div>
        <ul v-else class="reservation-list">
          <li
            v-for="item in filteredList"
            :key="item.id"
            :class="{ 'selected': selectedId === item.id, 'overdue': item.overdueFlag }"
            @click="selectItem(item)"
          >
            <div class="list-item-header">
              <StatusTag :status="item.status" :text="item.statusLabel" />
              <span v-if="item.overdueFlag" class="overdue-badge">⚠️</span>
            </div>
            <div class="list-item-body">
              <span class="plate">{{ item.plateNo }}</span>
              <span class="time">{{ item.applyTime }}</span>
              <span class="area">{{ item.workArea }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 右侧详情与操作区 -->
      <div class="detail-panel">
        <div v-if="selectedItem" class="detail-content">
          <h3>预约详情</h3>
          <p><strong>申请ID：</strong>{{ selectedItem.id }}</p>
          <p><strong>车牌号：</strong>{{ selectedItem.plateNo }}</p>
          <p><strong>车辆类型：</strong>{{ selectedItem.vehicleType }}</p>
          <p><strong>所属单位：</strong>{{ selectedItem.unit }}</p>
          <p><strong>作业区域：</strong>{{ selectedItem.workArea }}</p>
          <p><strong>预约时间：</strong>{{ selectedItem.applyTime }}</p>
          <p><strong>状态：</strong>{{ selectedItem.statusLabel }}</p>
          <!-- 车辆档案校验结果 -->
          <div class="vehicle-check">
            <p><strong>档案校验：</strong>
              <StatusTag :status="selectedItem.checkResult" :text="selectedItem.checkLabel" />
            </p>
            <p v-if="selectedItem.checkNote">{{ selectedItem.checkNote }}</p>
          </div>
          <!-- 审批操作 -->
          <div class="approval-actions">
            <button @click="handleApprove" :disabled="approving">通过</button>
            <button @click="handleReject" :disabled="approving">驳回</button>
          </div>
          <!-- 审批意见输入 -->
          <div v-if="showRejectInput" class="reject-input">
            <textarea v-model="rejectReason" placeholder="请输入驳回原因（必填）"></textarea>
            <button @click="confirmReject">确认驳回</button>
            <button @click="showRejectInput = false">取消</button>
          </div>
          <!-- 授权码同步状态 -->
          <div v-if="approveSuccess" class="sync-status">
            <p>授权码：{{ accessCode }}</p>
            <p>同步状态：<StatusTag :status="syncStatus" :text="syncLabel" /></p>
            <button @click="resyncCode" :disabled="resyncing">重新同步</button>
          </div>
          <!-- 操作日志快照 -->
          <div class="operation-log">
            <h4>审批记录</h4>
            <p v-if="selectedItem.logs && selectedItem.logs.length > 0">{{ selectedItem.logs[0].action }} - {{ selectedItem.logs[0].time }}</p>
            <p v-else>暂无记录</p>
          </div>
        </div>
        <div v-else class="detail-placeholder">请选择一个预约申请</div>
      </div>
    </div>

    <!-- 二次确认对话框（通过） -->
    <div v-if="showApproveConfirm" class="modal-overlay" @click.self="showApproveConfirm = false">
      <div class="modal">
        <p>{{ approveConfirmMessage }}</p>
        <button @click="approveConfirmed" :disabled="approving">确认</button>
        <button @click="showApproveConfirm = false">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract'
import { fetchReservationsData } from '../data/mockReservations'
import StatusTag from '../components/StatusTag.vue'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey || 'approver')

// 角色差异：审批人员和管理层可看到所有，其他角色可能只能看到部分（简化，当前仅用于默认筛选）
const roleBasedFilter = computed(() => {
  return currentRoleKey.value === 'manager' ? { status: 'all' } : { status: 'pending' }
})

// 状态
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const list = ref([])
const selectedId = ref(null)
const selectedItem = ref(null)
const approving = ref(false)
const showRejectInput = ref(false)
const rejectReason = ref('')
const showApproveConfirm = ref(false)
const approveConfirmMessage = ref('')
const approveSuccess = ref(false)
const accessCode = ref('')
const syncStatus = ref('')
const syncLabel = ref('')
const resyncing = ref(false)

// 筛选
const filters = ref({
  vehicleType: '',
  workArea: '',
  applyDate: '',
  sortOrder: 'desc'
})

// 计算是否有超时的记录
const hasOverdue = computed(() => list.value.some(item => item.overdueFlag))

// 过滤后的列表（客户端筛选和排序，模拟）
const filteredList = computed(() => {
  let result = list.value
  if (filters.value.vehicleType) {
    result = result.filter(item => item.vehicleType === filters.value.vehicleType)
  }
  if (filters.value.workArea) {
    result = result.filter(item => item.workArea === filters.value.workArea)
  }
  if (filters.value.applyDate) {
    result = result.filter(item => item.applyTime.startsWith(filters.value.applyDate))
  }
  if (filters.value.sortOrder === 'asc') {
    result = [...result].sort((a, b) => a.applyTime.localeCompare(b.applyTime))
  } else {
    result = [...result].sort((a, b) => b.applyTime.localeCompare(a.applyTime))
  }
  return result
})

// 获取列表数据（从mock）
async function fetchList() {
  loading.value = true
  error.value = false
  errorMessage.value = ''
  try {
    const data = await fetchReservationsData()
    // 将mock数据normalize为符合schema的格式
    list.value = (data || []).map(item => {
      // 假设mock返回reservationItem数组，每个包含必要字段
      return normalizeItem(item)
    })
    // 根据角色过滤初始选中
    if (list.value.length > 0 && !selectedId.value) {
      selectItem(list.value[0])
    }
  } catch (e) {
    error.value = true
    errorMessage.value = e.message || '请求失败'
  } finally {
    loading.value = false
  }
}

// normalize 映射，保证字段存在
function normalizeItem(raw) {
  // raw 可能是一个 reservationItem 对象
  return {
    id: raw.id || raw.applyId || 'N/A',
    plateNo: raw.plateNo || '未知',
    vehicleType: raw.vehicleType || '临时车',
    unit: raw.unit || '未知单位',
    workArea: raw.workArea || '未知区域',
    applyTime: raw.applyTime || '2025-01-01 00:00',
    status: raw.status || 'pending',
    statusLabel: raw.statusLabel || '待审批',
    overdueFlag: raw.overdueFlag || false,
    checkResult: raw.checkResult || 'success',
    checkLabel: raw.checkLabel || '通过',
    checkNote: raw.checkNote || '',
    logs: raw.logs || [],
    // 用于审批通过后的模拟
    approvalAction: raw.approvalAction || null,
    accessCode: raw.accessCode || null
  }
}

// 选中列表项
function selectItem(item) {
  selectedId.value = item.id
  selectedItem.value = { ...item }
  approveSuccess.value = false
  accessCode.value = ''
  syncStatus.value = ''
  syncLabel.value = ''
  showRejectInput.value = false
  rejectReason.value = ''
}

// 通过审批
function handleApprove() {
  // 若车辆证照过期则强制确认提示
  if (selectedItem.value.checkResult === 'expired') {
    approveConfirmMessage.value = '车辆证照已过期，是否强制通过？'
  } else {
    approveConfirmMessage.value = '确认通过该预约申请？'
  }
  showApproveConfirm.value = true
}

async function approveConfirmed() {
  approving.value = true
  try {
    // 模拟调用 /api/reservations/{id}/approve (POST)
    // 实际原型中可调用 mock
    const response = await mockApprove(selectedItem.value.id)
    accessCode.value = response.accessCode || 'A1B2C3D4'
    syncStatus.value = 'syncing'
    syncLabel.value = '同步中'
    approveSuccess.value = true
    // 模拟同步状态更新
    setTimeout(() => {
      syncStatus.value = 'success'
      syncLabel.value = '已同步'
    }, 2000)
    // 从列表中移除或标记已审批（演示简化，刷新列表）
    await fetchList()
  } catch (e) {
    console.error(e)
  } finally {
    approving.value = false
    showApproveConfirm.value = false
  }
}

// 模拟审批通过接口
function mockApprove(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ accessCode: 'A1B2C3D4', syncStatus: 'syncing' })
    }, 500)
  })
}

// 驳回审批
function handleReject() {
  showRejectInput.value = true
}

async function confirmReject() {
  if (!rejectReason.value.trim()) {
    alert('请输入驳回原因')
    return
  }
  approving.value = true
  try {
    // 模拟调用驳回接口
    await mockReject(selectedItem.value.id, rejectReason.value)
    // 刷新列表并关闭详情
    await fetchList()
    selectedId.value = null
    selectedItem.value = null
    showRejectInput.value = false
  } catch (e) {
    console.error(e)
  } finally {
    approving.value = false
  }
}

function mockReject(id, reason) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 500)
  })
}

// 重新同步授权码
async function resyncCode() {
  resyncing.value = true
  try {
    await mockResync()
    syncStatus.value = 'success'
    syncLabel.value = '已同步'
  } catch (e) {
    syncStatus.value = 'failed'
    syncLabel.value = '同步失败'
  } finally {
    resyncing.value = false
  }
}

function mockResync() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 1000)
  })
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.workspace-view {
  padding: 16px;
  font-family: sans-serif;
}
.filter-bar {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
  flex-wrap: wrap;
}
.filter-bar select, .filter-bar input {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.refresh-btn {
  padding: 4px 12px;
  background: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.main-content {
  display: flex;
  gap: 16px;
}
.list-panel {
  width: 40%;
  min-width: 300px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 8px;
}
.reservation-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.reservation-list li {
  padding: 12px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.2s;
}
.reservation-list li:hover {
  background: #f5f5f5;
}
.reservation-list li.selected {
  background: #e6f2ff;
}
.reservation-list li.overdue {
  border-left: 4px solid #f0ad4e;
}
.list-item-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.list-item-body {
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #333;
}
.overdue-badge {
  color: #f0ad4e;
}
.detail-panel {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  min-height: 300px;
}
.detail-content h3 {
  margin-top: 0;
}
.detail-content p {
  margin: 4px 0;
}
.vehicle-check {
  margin: 12px 0;
  padding: 8px;
  background: #f9f9f9;
  border-radius: 4px;
}
.approval-actions {
  margin: 12px 0;
  display: flex;
  gap: 8px;
}
.approval-actions button {
  padding: 6px 16px;
  border: 1px solid #4a90d9;
  background: #4a90d9;
  color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.approval-actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.reject-input textarea {
  width: 100%;
  height: 60px;
  margin: 8px 0;
  padding: 4px;
}
.reject-input button {
  margin-right: 8px;
}
.sync-status {
  margin: 12px 0;
  padding: 8px;
  background: #e8f5e9;
  border-radius: 4px;
}
.operation-log {
  margin: 12px 0;
  padding: 8px;
  background: #f3f3f3;
  border-radius: 4px;
}
.detail-placeholder {
  color: #aaa;
  text-align: center;
  padding: 40px;
}
.skeleton, .error-state, .empty-state {
  padding: 40px;
  text-align: center;
  color: #888;
}
.error-state button {
  margin-top: 12px;
}
.overdue-warning {
  background: #fff3cd;
  border: 1px solid #ffc107;
  padding: 8px 16px;
  margin-bottom: 16px;
  border-radius: 4px;
  color: #856404;
}
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  text-align: center;
}
.modal button {
  margin: 8px;
  padding: 6px 16px;
}
</style>
