<template>
  <div class="gate-access-check">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <span :class="['connection-status', connectionStatus === 'normal' ? 'status-normal' : 'status-abnormal']">
        {{ connectionStatus === 'normal' ? '接口正常' : '接口异常（降级模式）' }}
      </span>
      <span class="pending-count">待处理车辆：{{ pendingCount }}</span>
      <button @click="handleRefresh" :disabled="loading" class="refresh-btn">刷新</button>
      <select v-model="filterStatus" @change="handleFilterChange" class="filter-select">
        <option value="">全部</option>
        <option value="pending">待核验</option>
        <option value="approved">已核准</option>
      </select>
    </div>

    <div class="content-area">
      <!-- 左侧待核验车辆列表 -->
      <div class="vehicle-list">
        <div v-if="loading" class="loading-state">加载中…</div>
        <div v-else-if="empty" class="empty-state">当前无待入场车辆</div>
        <div v-else-if="error" class="error-state">加载失败，请重试</div>
        <div v-else class="vehicle-cards">
          <div
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            class="vehicle-card"
            :class="{ selected: selectedVehicle && selectedVehicle.id === vehicle.id }"
            @click="selectVehicle(vehicle)"
          >
            <div class="plate">{{ vehicle.plate }}</div>
            <div class="status-icon" :class="vehicle.status">{{ vehicle.status === 'pending' ? '待核验' : '已核验' }}</div>
            <div class="source-tag">{{ vehicle.source }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧核验详情与操作区 -->
      <div class="detail-panel">
        <div v-if="!selectedVehicle" class="placeholder">请选择左侧车辆查看详情</div>
        <div v-else class="detail-content">
          <div class="detail-header">
            <h3>车辆详情</h3>
            <span class="plate-big">{{ selectedVehicle.plate }}</span>
          </div>
          <div class="detail-body">
            <div class="info-row"><label>车辆类型</label><span>{{ selectedVehicle.type }}</span></div>
            <div class="info-row"><label>证照状态</label><span :class="selectedVehicle.certStatus">{{ selectedVehicle.certStatus === 'valid' ? '有效' : '异常' }}</span></div>
            <div class="info-row"><label>入场意图</label><span>{{ selectedVehicle.intent }}</span></div>
            <div class="info-row"><label>预约信息</label><span>{{ selectedVehicle.reservation }}</span></div>
          </div>
          <div class="action-buttons" v-if="selectedVehicle.status === 'pending'">
            <button @click="handlePass(selectedVehicle)" class="btn-pass">放行（核验通过）</button>
            <button @click="handleManualPass(selectedVehicle)" class="btn-manual">手动放行</button>
            <button @click="handleRejectPrompt(selectedVehicle)" class="btn-reject">拒绝</button>
          </div>
          <div v-else class="action-buttons">
            <span class="done-label">已处理</span>
          </div>
          <!-- 降级模式面板 -->
          <div v-if="connectionStatus === 'abnormal'" class="degrade-panel">
            <h4>降级处理</h4>
            <input v-model="degradePlate" placeholder="输入车牌号" />
            <select v-model="degradeAction">
              <option value="pass">放行</option>
              <option value="reject">拒绝</option>
            </select>
            <button @click="handleDegrade">确认降级操作</button>
          </div>
        </div>
        <!-- 底部操作日志/提示区域 -->
        <div class="log-area">
          <div v-for="(log, idx) in operationLogs" :key="idx" class="log-item">{{ log }}</div>
        </div>
      </div>
    </div>

    <!-- 二次确认放行弹窗 -->
    <div v-if="showPassConfirm" class="modal-overlay" @click.self="showPassConfirm = false">
      <div class="modal-card">
        <h4>确认放行</h4>
        <p>确认对 {{ confirmVehicle?.plate }} 执行放行操作？</p>
        <div class="modal-actions">
          <button @click="confirmPass" class="btn-pass">确定</button>
          <button @click="showPassConfirm = false" class="btn-cancel">取消</button>
        </div>
      </div>
    </div>

    <!-- 异常原因登记弹窗 -->
    <div v-if="showRejectModal" class="modal-overlay" @click.self="showRejectModal = false">
      <div class="modal-card">
        <h4>拒绝原因登记</h4>
        <div class="form-row">
          <label>异常原因</label>
          <select v-model="rejectForm.abnormalReason">
            <option value="证件不符">证件不符</option>
            <option value="车辆异常">车辆异常</option>
            <option value="预约无效">预约无效</option>
          </select>
        </div>
        <div class="form-row">
          <label>备注</label>
          <textarea v-model="rejectForm.abnormalRemark" placeholder="请填写补充说明"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="submitReject" class="btn-reject">确认拒绝</button>
          <button @click="showRejectModal = false" class="btn-cancel">取消</button>
        </div>
      </div>
    </div>

    <!-- 操作成功提示 -->
    <div v-if="successMessage" class="toast toast-success">{{ successMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { fetchGateData, gateRecords } from '../data/mockGate.js'

const prototypeContext = inject('prototypeContext', {
  currentRole: { userName: '门岗-赵工', key: 'gate' },
  currentRoleKey: 'gate'
})
const currentRole = prototypeContext.currentRole
const currentRoleKey = prototypeContext.currentRoleKey

// 状态
const connectionStatus = ref('normal') // 'normal' | 'abnormal'
const loading = ref(true)
const empty = ref(false)
const error = ref(false)
const vehicles = ref([])
const selectedVehicle = ref(null)
const filterStatus = ref('')
const degradePlate = ref('')
const degradeAction = ref('pass')
const showPassConfirm = ref(false)
const confirmVehicle = ref(null)
const showRejectModal = ref(false)
const rejectForm = ref({ abnormalReason: '', abnormalRemark: '' })
const rejectTarget = ref(null)
const operationLogs = ref([])
const successMessage = ref('')

const pendingCount = computed(() => vehicles.value.filter(v => v.status === 'pending').length)

const filteredVehicles = computed(() => {
  if (!filterStatus.value) return vehicles.value
  return vehicles.value.filter(v => v.status === filterStatus.value)
})

// 数据获取
async function loadVehicles() {
  loading.value = true
  error.value = false
  empty.value = false
  try {
    const data = await fetchGateData()
    // 假设返回数组或对象
    const list = Array.isArray(data) ? data : (data.gateRecords || [])
    // normalize 映射
    vehicles.value = list.map(item => ({
      id: item.vehicleId || item.id || Math.random().toString(36).substr(2, 5),
      plate: item.plate || item.plateNumber || '无车牌',
      type: item.vehicleType || '未知',
      status: item.status || 'pending',
      source: item.source || '预约',
      certStatus: item.certStatus || 'valid',
      intent: item.intent || '运输',
      reservation: item.reservation || '无预约'
    }))
    if (vehicles.value.length === 0) empty.value = true
  } catch (e) {
    error.value = true
    connectionStatus.value = 'abnormal'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadVehicles()
})

// 选择车辆
function selectVehicle(vehicle) {
  selectedVehicle.value = vehicle
}

// 刷新
async function handleRefresh() {
  await loadVehicles()
}

// 筛选
function handleFilterChange() {
  // 简单本地过滤
}

// 放行（核验通过）
function handlePass(vehicle) {
  confirmVehicle.value = vehicle
  showPassConfirm.value = true
}

async function confirmPass() {
  if (!confirmVehicle.value) return
  showPassConfirm.value = false
  const plate = confirmVehicle.value.plate
  // 模拟调用 POST /api/gate/vehicle-action
  await new Promise(resolve => setTimeout(resolve, 300))
  vehicles.value = vehicles.value.filter(v => v.id !== confirmVehicle.value.id)
  selectedVehicle.value = null
  operationLogs.value.push(`${new Date().toLocaleString()} 放行车辆 ${plate}`)
  showSuccess(`${plate} 放行成功`)
}

// 手动放行
async function handleManualPass(vehicle) {
  await new Promise(resolve => setTimeout(resolve, 300))
  const plate = vehicle.plate
  vehicles.value = vehicles.value.filter(v => v.id !== vehicle.id)
  selectedVehicle.value = null
  operationLogs.value.push(`${new Date().toLocaleString()} 手动放行车辆 ${plate}`)
  showSuccess(`${plate} 手动放行成功`)
}

// 拒绝
function handleRejectPrompt(vehicle) {
  rejectTarget.value = vehicle
  rejectForm.value = { abnormalReason: '', abnormalRemark: '' }
  showRejectModal.value = true
}

async function submitReject() {
  if (!rejectTarget.value) return
  const plate = rejectTarget.value.plate
  // 模拟调用 POST /api/gate/abnormal-record
  await new Promise(resolve => setTimeout(resolve, 300))
  vehicles.value = vehicles.value.filter(v => v.id !== rejectTarget.value.id)
  selectedVehicle.value = null
  operationLogs.value.push(`${new Date().toLocaleString()} 拒绝车辆 ${plate} 原因:${rejectForm.value.abnormalReason} 备注:${rejectForm.value.abnormalRemark}`)
  showRejectModal.value = false
  showSuccess(`${plate} 拒绝成功`)
}

// 降级操作
async function handleDegrade() {
  if (!degradePlate.value.trim()) return
  const plate = degradePlate.value.trim()
  // 模拟调用 POST /api/gate/degraded-action
  await new Promise(resolve => setTimeout(resolve, 300))
  if (degradeAction.value === 'pass') {
    operationLogs.value.push(`${new Date().toLocaleString()} 降级放行车辆 ${plate}`)
    showSuccess(`${plate} 降级放行成功`)
  } else {
    operationLogs.value.push(`${new Date().toLocaleString()} 降级拒绝车辆 ${plate}`)
    showSuccess(`${plate} 降级拒绝成功`)
  }
  degradePlate.value = ''
}

// 成功提示
function showSuccess(msg) {
  successMessage.value = msg
  setTimeout(() => { successMessage.value = '' }, 2000)
}
</script>

<style scoped>
.gate-access-check {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: Arial, sans-serif;
  padding: 12px;
  box-sizing: border-box;
}
.status-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 6px;
  margin-bottom: 12px;
}
.connection-status {
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
}
.status-normal { color: green; background: #e8f5e9; }
.status-abnormal { color: red; background: #ffebee; }
.pending-count { margin-left: auto; }
.refresh-btn { padding: 4px 12px; cursor: pointer; }
.filter-select { padding: 4px 8px; }
.content-area {
  display: flex;
  flex: 1;
  gap: 12px;
}
.vehicle-list {
  width: 280px;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow-y: auto;
  background: white;
  padding: 8px;
}
.loading-state, .empty-state, .error-state {
  text-align: center;
  padding: 20px;
  color: #999;
}
.vehicle-cards {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.vehicle-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}
.vehicle-card:hover { background: #f0f0f0; }
.vehicle-card.selected { background: #e3f2fd; border-color: #1976d2; }
.plate { font-weight: bold; flex: 1; }
.status-icon { font-size: 12px; padding: 2px 6px; border-radius: 3px; background: #fff9c4; }
.status-icon.pending { background: #fff9c4; }
.source-tag { font-size: 12px; color: #666; }
.detail-panel {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  padding: 12px;
  display: flex;
  flex-direction: column;
}
.placeholder { text-align: center; color: #999; padding: 40px; }
.detail-header {
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
  margin-bottom: 12px;
}
.plate-big { font-size: 1.5em; font-weight: bold; }
.detail-body .info-row {
  display: flex;
  margin-bottom: 8px;
  line-height: 1.6;
}
.info-row label { width: 80px; color: #666; }
.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.btn-pass, .btn-manual, .btn-reject, .btn-cancel {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-pass { background: #4caf50; color: white; }
.btn-manual { background: #ff9800; color: white; }
.btn-reject { background: #f44336; color: white; }
.btn-cancel { background: #9e9e9e; color: white; }
.degrade-panel {
  margin-top: 16px;
  padding: 12px;
  border: 1px dashed #f44336;
  background: #fff3f0;
  border-radius: 4px;
}
.degrade-panel h4 { margin: 0 0 8px 0; }
.degrade-panel input, .degrade-panel select {
  margin-right: 8px;
  padding: 4px;
}
.log-area {
  margin-top: auto;
  border-top: 1px solid #eee;
  padding-top: 8px;
  max-height: 100px;
  overflow-y: auto;
}
.log-item { font-size: 12px; color: #888; padding: 2px 0; }
.modal-overlay {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.modal-card h4 { margin-top: 0; }
.modal-actions {
  margin-top: 16px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.form-row {
  margin-bottom: 12px;
}
.form-row label { display: block; margin-bottom: 4px; }
.form-row select, .form-row textarea {
  width: 100%;
  padding: 6px;
  box-sizing: border-box;
}
.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  border-radius: 6px;
  background: #4caf50;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 2000;
}
.done-label { color: #999; font-style: italic; }
</style>