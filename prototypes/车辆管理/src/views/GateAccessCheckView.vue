<template>
  <div class="gate-access-check-view">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <span class="connection-status" :class="{ 'status-normal': connectionStatus === 'normal', 'status-error': connectionStatus === 'error' }">
        {{ connectionStatus === 'normal' ? '接口连接正常' : '接口异常，已启用降级模式' }}
      </span>
      <span class="pending-count">待处理车辆: {{ pendingVehicles.length }}</span>
    </div>

    <div class="main-content" v-if="pageState === 'loading'">
      <div class="loading">加载中...</div>
    </div>

    <div class="main-content" v-else-if="pageState === 'empty'">
      <div class="empty-state">当前无待入场车辆</div>
    </div>

    <div class="main-content" v-else-if="pageState === 'error'">
      <div class="error-state">
        <p>数据加载失败，请稍后重试</p>
        <button @click="retryLoad" class="retry-btn">重新加载</button>
      </div>
    </div>

    <div class="main-content" v-else>
      <!-- 左侧待核验列表 -->
      <div class="left-panel">
        <div class="filter-bar">
          <select v-model="filterType" @change="applyFilter">
            <option value="">全部</option>
            <option value="预约">预约</option>
            <option value="临时">临时</option>
          </select>
          <input v-model="searchPlate" placeholder="搜索车牌号" @input="applyFilter" />
        </div>
        <div class="vehicle-list">
          <div
            v-for="vehicle in filteredVehicles"
            :key="vehicle.车辆ID"
            class="vehicle-item"
            :class="{ active: selectedVehicle?.车辆ID === vehicle.车辆ID }"
            @click="selectVehicle(vehicle)"
          >
            <span class="plate">{{ vehicle.车牌号 }}</span>
            <span class="status-icon" :style="{ color: vehicle.证照状态 === '正常' ? 'green' : 'red' }">
              {{ vehicle.证照状态 === '正常' ? '✓' : '✗' }}
            </span>
            <span class="source">{{ vehicle.入场意图 || '未知' }}</span>
          </div>
        </div>
      </div>

      <!-- 右侧详情区 -->
      <div class="right-panel">
        <div v-if="selectedVehicle" class="detail-container">
          <h3>车辆档案摘要</h3>
          <div class="detail-row"><label>车牌号：</label>{{ selectedVehicle.车牌号 }}</div>
          <div class="detail-row"><label>车辆类型：</label>{{ selectedVehicle.车辆类型 }}</div>
          <div class="detail-row"><label>证照状态：</label>{{ selectedVehicle.证照状态 }}</div>
          <div class="detail-row"><label>入场意图：</label>{{ selectedVehicle.入场意图 }}</div>
          <div class="detail-row" v-if="selectedVehicle.预约信息"><label>预约信息：</label>{{ selectedVehicle.预约信息 }}</div>

          <h3>核验结果详情</h3>
          <div class="detail-row"><label>核验结果：</label>{{ selectedVehicle.核验状态 || '待核验' }}</div>

          <div class="action-buttons">
            <button class="btn-allow" @click="confirmAllow">放行</button>
            <button class="btn-reject" @click="showRejectDialog">拒绝</button>
            <button class="btn-manual" @click="manualAllow" :disabled="connectionStatus === 'error'">手动放行</button>
          </div>
        </div>
        <div v-else class="no-selection">请从左侧选择一个待核验车辆</div>
      </div>
    </div>

    <!-- 底部日志区域 -->
    <div class="footer-log" v-if="operationLogs.length">
      <h4>操作记录</h4>
      <div v-for="(log, idx) in operationLogs" :key="idx" class="log-item">{{ log }}</div>
    </div>

    <!-- 放行二次确认弹窗 -->
    <div v-if="showConfirmDialog" class="modal-overlay" @click.self="showConfirmDialog = false">
      <div class="modal-dialog">
        <p>确认放行 {{ selectedVehicle?.车牌号 }}？</p>
        <div class="dialog-actions">
          <button @click="executeAllow" :disabled="actionLoading">{{ actionLoading ? '处理中...' : '确认放行' }}</button>
          <button @click="showConfirmDialog = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 拒绝原因弹窗 -->
    <div v-if="showReject" class="modal-overlay" @click.self="showReject = false">
      <div class="modal-dialog">
        <h3>登记拒绝原因</h3>
        <select v-model="rejectReason" class="reject-select">
          <option value="">请选择原因</option>
          <option value="证照过期">证照过期</option>
          <option value="未预约">未预约</option>
          <option value="车辆信息不符">车辆信息不符</option>
          <option value="其他">其他</option>
        </select>
        <textarea v-model="rejectRemark" placeholder="备注（可选）" rows="2"></textarea>
        <div class="dialog-actions">
          <button @click="executeReject" :disabled="!rejectReason || actionLoading">{{ actionLoading ? '处理中...' : '确认拒绝' }}</button>
          <button @click="showReject = false">取消</button>
        </div>
      </div>
    </div>

    <!-- 降级模式面板 -->
    <div v-if="connectionStatus === 'error'" class="degraded-panel">
      <h3>降级操作</h3>
      <input v-model="degradedPlate" placeholder="输入车牌号" />
      <select v-model="degradedAction">
        <option value="allow">放行</option>
        <option value="reject">拒绝</option>
      </select>
      <button @click="executeDegraded" :disabled="!degradedPlate || degradedActionLoading">
        {{ degradedActionLoading ? '处理中...' : '确认' }}
      </button>
    </div>

    <!-- 短暂成功提示 -->
    <div v-if="showSuccessToast" class="success-toast">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { fetchGateData, gateRecords } from '../data/mockGate.js'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = prototypeContext?.currentRoleKey || 'gate'
const currentRole = prototypeContext?.currentRole || { key: 'gate', label: '门岗', userName: '门岗-赵工', description: '车辆入场核验与放行记录处理' }

// 页面状态
const pageState = ref('loading')
const pendingVehicles = ref([])
const selectedVehicle = ref(null)
const searchPlate = ref('')
const filterType = ref('')
const connectionStatus = ref('normal') // 'normal' | 'error'
const showConfirmDialog = ref(false)
const showReject = ref(false)
const rejectReason = ref('')
const rejectRemark = ref('')
const actionLoading = ref(false)
const degradedPlate = ref('')
const degradedAction = ref('allow')
const degradedActionLoading = ref(false)
const showSuccessToast = ref(false)
const successMessage = ref('')
const operationLogs = ref([])

// 模拟接口异常概率，原型演示：随机触发降级
const simulateError = () => {
  if (Math.random() < 0.3) {
    connectionStatus.value = 'error'
  }
}

const loadData = async () => {
  pageState.value = 'loading'
  try {
    const data = await fetchGateData()
    // 根据角色调整数据：gate 角色看到预装全部，manager/admin 可以更多但这里简化
    let vehicles = data.gateRecords || []
    // 如果角色为 manager 或 admin，可以增加一些筛选（示例中保持不变）
    pendingVehicles.value = vehicles
    if (vehicles.length === 0) {
      pageState.value = 'empty'
    } else {
      pageState.value = 'success'
      // 默认选中第一辆
      selectedVehicle.value = vehicles[0]
    }
    simulateError()
  } catch (e) {
    pageState.value = 'error'
    connectionStatus.value = 'error'
  }
}

const retryLoad = () => loadData()

onMounted(() => {
  loadData()
})

// 筛选
const filteredVehicles = computed(() => {
  let list = pendingVehicles.value
  if (filterType.value) {
    list = list.filter(v => v.入场意图 === filterType.value)
  }
  if (searchPlate.value) {
    list = list.filter(v => v.车牌号.includes(searchPlate.value))
  }
  return list
})

const applyFilter = () => {
  // computed自动更新
}

const selectVehicle = (vehicle) => {
  selectedVehicle.value = vehicle
}

// 放行
const confirmAllow = () => {
  if (!selectedVehicle.value) return
  showConfirmDialog.value = true
}

const executeAllow = async () => {
  if (!selectedVehicle.value) return
  actionLoading.value = true
  try {
    // 模拟调用 POST /api/gate/vehicle-action
    await new Promise(resolve => setTimeout(resolve, 800))
    operationLogs.value.unshift(`放行 ${selectedVehicle.value.车牌号} 成功`)
    pendingVehicles.value = pendingVehicles.value.filter(v => v.车辆ID !== selectedVehicle.value.车辆ID)
    showConfirmDialog.value = false
    selectedVehicle.value = pendingVehicles.value[0] || null
    showSuccess('放行成功')
  } catch (e) {
    showError('放行失败')
  } finally {
    actionLoading.value = false
  }
}

// 手动放行
const manualAllow = async () => {
  if (!selectedVehicle.value) return
  actionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    operationLogs.value.unshift(`手动放行 ${selectedVehicle.value.车牌号} 成功`)
    pendingVehicles.value = pendingVehicles.value.filter(v => v.车辆ID !== selectedVehicle.value.车辆ID)
    selectedVehicle.value = pendingVehicles.value[0] || null
    showSuccess('手动放行成功')
  } catch (e) {
    showError('手动放行失败')
  } finally {
    actionLoading.value = false
  }
}

// 拒绝
const showRejectDialog = () => {
  rejectReason.value = ''
  rejectRemark.value = ''
  showReject.value = true
}

const executeReject = async () => {
  if (!selectedVehicle.value || !rejectReason.value) return
  actionLoading.value = true
  try {
    // 模拟调用 POST /api/gate/abnormal-record
    await new Promise(resolve => setTimeout(resolve, 800))
    operationLogs.value.unshift(`拒绝 ${selectedVehicle.value.车牌号}，原因：${rejectReason.value} ${rejectRemark.value ? `备注：${rejectRemark.value}` : ''}`)
    pendingVehicles.value = pendingVehicles.value.filter(v => v.车辆ID !== selectedVehicle.value.车辆ID)
    showReject.value = false
    selectedVehicle.value = pendingVehicles.value[0] || null
    showSuccess('拒绝成功')
  } catch (e) {
    showError('拒绝失败')
  } finally {
    actionLoading.value = false
  }
}

// 降级操作
executeDegraded = async () => {
  if (!degradedPlate.value) return
  degradedActionLoading.value = true
  try {
    // 模拟调用 POST /api/gate/degraded-action
    await new Promise(resolve => setTimeout(resolve, 800))
    const action = degradedAction.value === 'allow' ? '放行' : '拒绝'
    operationLogs.value.unshift(`降级操作：${action} ${degradedPlate.value}`)
    degradedPlate.value = ''
    showSuccess(`降级${action}成功`)
  } catch (e) {
    showError('降级操作失败')
  } finally {
    degradedActionLoading.value = false
  }
}

const showSuccess = (msg) => {
  successMessage.value = msg
  showSuccessToast.value = true
  setTimeout(() => { showSuccessToast.value = false }, 2000)
}

const showError = (msg) => {
  // 错误提示可以通过其他方式，这里简单 alert
  alert(msg)
}
</script>

<style scoped>
.gate-access-check-view {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: sans-serif;
}
.status-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #f0f2f5;
  border-bottom: 1px solid #d9d9d9;
}
.connection-status.status-normal { color: #389e0d; }
.connection-status.status-error { color: #cf1322; }
.pending-count {
  font-weight: bold;
}
.main-content {
  flex: 1;
  display: flex;
  overflow: hidden;
}
.left-panel {
  width: 300px;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}
.filter-bar {
  padding: 8px;
  display: flex;
  gap: 4px;
}
.filter-bar select, .filter-bar input {
  flex: 1;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.vehicle-list {
  flex: 1;
  overflow-y: auto;
}
.vehicle-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}
.vehicle-item:hover { background: #e6f7ff; }
.vehicle-item.active { background: #bae7ff; }
.plate {
  margin-right: 8px;
  font-weight: 500;
}
.status-icon {
  margin-right: 8px;
}
.source {
  font-size: 12px;
  color: #888;
}
.right-panel {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.detail-container h3 {
  margin: 12px 0 8px;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 4px;
}
.detail-row {
  margin: 4px 0;
}
.detail-row label {
  font-weight: 500;
  margin-right: 8px;
}
.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}
.btn-allow, .btn-reject, .btn-manual {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-allow {
  background: #389e0d;
  color: white;
}
.btn-reject {
  background: #cf1322;
  color: white;
}
.btn-manual {
  background: #faad14;
  color: #333;
}
.btn-manual:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #aaa;
}
.footer-log {
  border-top: 1px solid #d9d9d9;
  padding: 8px 16px;
  max-height: 150px;
  overflow-y: auto;
  background: #fafafa;
}
.footer-log h4 {
  margin: 0 0 4px;
}
.log-item {
  font-size: 12px;
  color: #666;
  margin: 2px 0;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-dialog {
  background: white;
  padding: 20px;
  border-radius: 8px;
  min-width: 300px;
}
.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
}
.reject-select, textarea {
  width: 100%;
  margin: 8px 0;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.degraded-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.degraded-panel input, .degraded-panel select, .degraded-panel button {
  padding: 4px;
}
.success-toast {
  position: fixed;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: #389e0d;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 200;
}
.loading, .empty-state, .error-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}
.retry-btn {
  margin-left: 8px;
  padding: 4px 12px;
}
</style>