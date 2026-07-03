<template>
  <div class="task-adjust-view">
    <!-- 顶部任务/车辆信息摘要区 -->
    <div class="summary-section">
      <h4 class="section-title">任务/车辆信息</h4>
      <div v-if="currentTask" class="summary-content">
        <div class="summary-item"><span class="label">车牌号：</span><span class="value">{{ currentTask.plateNumber }}</span></div>
        <div class="summary-item"><span class="label">司机：</span><span class="value">{{ currentTask.driverName }}</span></div>
        <div class="summary-item"><span class="label">任务描述：</span><span class="value">{{ currentTask.description }}</span></div>
        <div class="summary-item"><span class="label">任务状态：</span><span class="value status-badge" :class="'status-' + (currentTask.status || '').toLowerCase()">{{ currentTask.status }}</span></div>
      </div>
      <div v-else class="empty-summary">
        <span class="empty-icon">⚠️</span>
        <span>无法获取任务信息，请返回重试</span>
      </div>
    </div>

    <!-- 操作类型选择按钮组 -->
    <div class="operation-section">
      <h4 class="section-title">选择操作类型</h4>
      <div class="operation-buttons">
        <button
          v-for="op in operationTypes"
          :key="op.key"
          :class="['op-btn', { active: selectedOperation === op.key }]"
          @click="selectOperation(op.key)"
        >
          {{ op.label }}
        </button>
      </div>
    </div>

    <!-- 操作表单区 -->
    <div class="form-section">
      <h4 class="section-title">{{ formTitle }}</h4>
      <div v-if="selectedOperation === 'reassign'" class="reassign-form">
        <div class="form-group">
          <label>目标司机</label>
          <div class="driver-selector" @click="showDriverPicker = true">
            <input type="text" :value="formData.targetDriverName" placeholder="点击选择司机" readonly />
            <span class="selector-arrow">▶</span>
          </div>
        </div>
        <div v-if="showDriverPicker" class="driver-list-overlay">
          <div class="driver-list-panel">
            <h5>选择目标司机</h5>
            <div
              v-for="driver in nearbyDrivers"
              :key="driver.id"
              :class="['driver-item', { selected: formData.targetDriver === driver.id }]"
              @click="selectDriver(driver)"
            >
              <div class="driver-info">
                <span class="driver-name">{{ driver.name }}</span>
                <span class="driver-plate">{{ driver.plateNumber }}</span>
                <span class="driver-location">{{ driver.currentPosition }}</span>
              </div>
              <span v-if="formData.targetDriver === driver.id" class="check-mark">✓</span>
            </div>
            <button class="close-picker" @click="showDriverPicker = false">关闭</button>
          </div>
        </div>
      </div>
      <div v-else-if="selectedOperation === 'cancel'" class="cancel-form">
        <div class="form-group">
          <label>取消原因</label>
          <textarea v-model="formData.cancelReason" placeholder="请说明取消原因" rows="3"></textarea>
        </div>
      </div>
      <div v-else-if="selectedOperation === 'add'" class="add-form">
        <div class="form-group">
          <label>作业地点</label>
          <div class="location-selector" @click="showLocationPicker = true">
            <input type="text" :value="formData.workLocation" placeholder="点击选择作业地点" readonly />
            <span class="selector-arrow">▶</span>
          </div>
        </div>
        <div class="form-group">
          <label>作业时间</label>
          <input type="datetime-local" v-model="formData.workTime" />
        </div>
        <div class="form-group">
          <label>作业要求</label>
          <textarea v-model="formData.workRequirement" placeholder="请输入作业要求" rows="2"></textarea>
        </div>
        <div v-if="showLocationPicker" class="location-list-overlay">
          <div class="location-list-panel">
            <h5>选择作业地点</h5>
            <div
              v-for="loc in mockLocations"
              :key="loc.value"
              :class="['location-item', { selected: formData.workLocation === loc.label }]"
              @click="selectLocation(loc)"
            >
              <span>{{ loc.label }}</span>
              <span v-if="formData.workLocation === loc.label" class="check-mark">✓</span>
            </div>
            <button class="close-picker" @click="showLocationPicker = false">关闭</button>
          </div>
        </div>
      </div>
      <div v-else class="form-placeholder">
        <p>请先选择操作类型</p>
      </div>
    </div>

    <!-- 异常处理记录区 -->
    <div class="exception-section">
      <h4 class="section-title">异常处理记录</h4>
      <div class="form-group">
        <label>处理原因</label>
        <select v-model="exceptionRecord.reason">
          <option value="">请选择</option>
          <option value="driver_unavailable">司机无法到岗</option>
          <option value="vehicle_breakdown">车辆故障</option>
          <option value="route_change">路线变更</option>
          <option value="other">其他</option>
        </select>
      </div>
      <div class="form-group">
        <label>备注</label>
        <textarea v-model="exceptionRecord.remark" placeholder="可补充说明" rows="2"></textarea>
      </div>
      <div class="form-group">
        <label>附件上传</label>
        <div class="file-upload">
          <input type="file" @change="handleFileUpload" accept="image/*,.pdf" />
          <span class="file-name" v-if="exceptionRecord.attachmentName">{{ exceptionRecord.attachmentName }}</span>
        </div>
      </div>
    </div>

    <!-- 底部提交确认按钮区 -->
    <div class="submit-section">
      <button
        class="submit-btn"
        :disabled="!canSubmit || loading"
        @click="handleSubmit"
      >
        <span v-if="loading" class="loading-spinner"></span>
        <span v-else>提交调整</span>
      </button>
    </div>

    <!-- 二次确认弹窗 -->
    <div v-if="showConfirm" class="confirm-overlay">
      <div class="confirm-dialog">
        <h5>确认操作</h5>
        <div class="confirm-summary">
          <p>操作类型：{{ selectedOperationLabel }}</p>
          <p v-if="selectedOperation === 'reassign'">目标司机：{{ formData.targetDriverName }}</p>
          <p v-if="selectedOperation === 'cancel'">取消原因：{{ formData.cancelReason }}</p>
          <p v-if="selectedOperation === 'add'">作业地点：{{ formData.workLocation }}</p>
          <p>异常处理原因：{{ exceptionRecord.reasonLabel || exceptionRecord.reason }}</p>
        </div>
        <div class="confirm-actions">
          <button class="cancel-btn" @click="showConfirm = false">取消</button>
          <button class="confirm-btn" @click="confirmSubmit" :disabled="submitting">
            <span v-if="submitting" class="loading-spinner"></span>
            <span v-else>确定</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 全屏加载遮罩 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner large"></div>
    </div>

    <!-- 成功提示 Toast -->
    <div v-if="showSuccessToast" class="toast success-toast">操作成功！正在返回...</div>
    <!-- 错误提示 -->
    <div v-if="errorMessage" class="error-banner">{{ errorMessage }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted } from 'vue'
import { fetchDispatchData, dispatchRecords } from '../data/mockDispatch.js'
import prototypeContract from '../prototypeContract.js'

const prototypeContext = inject('prototypeContext')
const currentRole = computed(() => prototypeContext.currentRole || 'dispatcher')
const currentRoleKey = computed(() => prototypeContext.currentRoleKey || 'dispatcher')

// 页面状态
const loading = ref(false)
const empty = ref(false)
const errorMessage = ref('')
const submitting = ref(false)
const showSuccessToast = ref(false)
const showConfirm = ref(false)

// 当前任务/车辆数据
const currentTask = ref(null)

// 操作类型
const operationTypes = [
  { key: 'reassign', label: '改派' },
  { key: 'cancel', label: '取消' },
  { key: 'add', label: '加派' }
]
const selectedOperation = ref('')
const selectedOperationLabel = computed(() => {
  const op = operationTypes.find(o => o.key === selectedOperation.value)
  return op ? op.label : ''
})

const formTitle = computed(() => {
  if (!selectedOperation.value) return '请选择操作类型以显示表单'
  const map = { reassign: '改派设置', cancel: '取消确认', add: '加派信息' }
  return map[selectedOperation.value] || ''
})

// 表单数据
const formData = reactive({
  targetDriver: null,
  targetDriverName: '',
  targetDriverPlate: '',
  cancelReason: '',
  workLocation: '',
  workTime: '',
  workRequirement: ''
})

// 异常处理记录
const exceptionRecord = reactive({
  reason: '',
  reasonLabel: '',
  remark: '',
  attachmentName: ''
})

// 司机选择
const showDriverPicker = ref(false)
const nearbyDrivers = ref([])

// 地点选择
const showLocationPicker = ref(false)
const mockLocations = [
  { value: 'A', label: 'A区卸货点' },
  { value: 'B', label: 'B区装货点' },
  { value: 'C', label: 'C区仓库' },
  { value: 'D', label: 'D区临时停靠点' }
]

// 是否可以提交
const canSubmit = computed(() => {
  if (!selectedOperation.value) return false
  if (selectedOperation.value === 'reassign' && !formData.targetDriver) return false
  if (selectedOperation.value === 'cancel' && !formData.cancelReason.trim()) return false
  if (selectedOperation.value === 'add' && (!formData.workLocation || !formData.workTime)) return false
  if (!exceptionRecord.reason) return false
  return true
})

// 初始化数据
onMounted(async () => {
  loading.value = true
  try {
    const data = await fetchDispatchData()
    // 从 mock 数据中提取第一个任务作为示例
    if (data && data.dispatchTask) {
      const task = data.dispatchTask
      currentTask.value = {
        plateNumber: task.vehiclePlate || '沪A12345',
        driverName: task.driverName || '张三',
        description: task.description || '运输物资至B区',
        status: task.status || '进行中'
      }
    } else if (Array.isArray(data) && data.length > 0) {
      // 如果返回数组取第一个
      const first = data[0]
      currentTask.value = {
        plateNumber: first.vehiclePlate || first.plateNumber || '京B67890',
        driverName: first.driverName || '李四',
        description: first.description || '临时任务',
        status: first.status || '待执行'
      }
    } else {
      // 兜底数据
      currentTask.value = {
        plateNumber: '粤C34567',
        driverName: '王五',
        description: '运输钢材到D区',
        status: '待执行'
      }
    }
    // 加载周边司机
    if (data && data.nearbyVehicles) {
      nearbyDrivers.value = data.nearbyVehicles.map(v => ({
        id: v.vehicleId || v.id,
        name: v.driverName || '未知司机',
        plateNumber: v.plateNumber || '未知车牌',
        currentPosition: v.currentPosition || '未知位置'
      }))
    } else {
      // 兜底司机
      nearbyDrivers.value = [
        { id: 'd1', name: '赵六', plateNumber: '沪B00001', currentPosition: 'A区' },
        { id: 'd2', name: '钱七', plateNumber: '沪B00002', currentPosition: 'B区附近' }
      ]
    }
    // 根据角色调整默认操作类型等（演示差异）
    if (currentRoleKey.value === 'driver') {
      // 司机角色不能改派和加派，只能取消
      selectedOperation.value = 'cancel'
    }
  } catch (e) {
    errorMessage.value = '加载数据失败，请重试'
    empty.value = true
  } finally {
    loading.value = false
  }
})

function selectOperation(key) {
  selectedOperation.value = key
  // 切换时重置部分字段
  if (key === 'reassign') {
    formData.cancelReason = ''
    formData.workLocation = ''
    formData.workTime = ''
    formData.workRequirement = ''
  } else if (key === 'cancel') {
    formData.targetDriver = null
    formData.targetDriverName = ''
  } else if (key === 'add') {
    formData.targetDriver = null
    formData.targetDriverName = ''
    formData.cancelReason = ''
  }
}

function selectDriver(driver) {
  formData.targetDriver = driver.id
  formData.targetDriverName = driver.name
  formData.targetDriverPlate = driver.plateNumber
  showDriverPicker.value = false
}

function selectLocation(loc) {
  formData.workLocation = loc.label
  showLocationPicker.value = false
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (file) {
    exceptionRecord.attachmentName = file.name
  }
}

function handleSubmit() {
  showConfirm.value = true
  // 填充异常原因标签
  const reasonMap = {
    driver_unavailable: '司机无法到岗',
    vehicle_breakdown: '车辆故障',
    route_change: '路线变更',
    other: '其他'
  }
  exceptionRecord.reasonLabel = reasonMap[exceptionRecord.reason] || exceptionRecord.reason
}

async function confirmSubmit() {
  submitting.value = true
  showConfirm.value = false
  loading.value = true
  try {
    // 模拟提交
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // 成功后
    showSuccessToast.value = true
    loading.value = false
    submitting.value = false
    // 模拟返回（原型中通过界面返回）
    setTimeout(() => {
      // 这里可以触发路由返回，但禁止引入vue-router，所以简单重置或提示
      showSuccessToast.value = false
      // 刷新任务列表（演示用）
      window.dispatchEvent(new CustomEvent('refresh-task-list'))
    }, 1500)
  } catch (e) {
    errorMessage.value = `操作失败：${e.message || '未知错误'}`
    loading.value = false
    submitting.value = false
  }
}
</script>

<style scoped>
.task-adjust-view {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.summary-section {
  background: #f7f9fc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.summary-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.summary-item {
  display: flex;
  align-items: baseline;
}

.summary-item .label {
  width: 80px;
  flex-shrink: 0;
  color: #666;
  font-size: 14px;
}

.summary-item .value {
  color: #1a1a1a;
  font-size: 14px;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  background: #e6f7ff;
  color: #1890ff;
}

.status-进行中 {
  background: #fff7e6;
  color: #fa8c16;
}

.status-待执行 {
  background: #f6ffed;
  color: #52c41a;
}

.empty-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #999;
  font-size: 14px;
}

.empty-icon {
  font-size: 20px;
}

.operation-section {
  margin-bottom: 16px;
}

.operation-buttons {
  display: flex;
  gap: 12px;
}

.op-btn {
  padding: 8px 24px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.op-btn:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.op-btn.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.form-section {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  min-height: 120px;
}

.form-placeholder {
  color: #ccc;
  text-align: center;
  padding: 40px 0;
}

.form-group {
  margin-bottom: 12px;
}

.form-group label {
  display: block;
  margin-bottom: 4px;
  font-size: 14px;
  color: #333;
}

input[type="text"],
input[type="datetime-local"],
textarea,
select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

textarea {
  resize: vertical;
}

.driver-selector,
.location-selector {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.driver-selector input,
.location-selector input {
  flex: 1;
  cursor: pointer;
  background: #fafafa;
}

.selector-arrow {
  margin-left: -30px;
  color: #999;
  font-size: 12px;
}

.driver-list-overlay,
.location-list-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 100;
}

.driver-list-panel,
.location-list-panel {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px 16px 0 0;
  padding: 20px;
  max-height: 60vh;
  overflow-y: auto;
}

.driver-list-panel h5,
.location-list-panel h5 {
  margin: 0 0 12px 0;
  font-size: 16px;
}

.driver-item,
.location-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
}

.driver-item:hover,
.location-item:hover {
  background: #f7f9fc;
}

.driver-item.selected,
.location-item.selected {
  background: #e6f7ff;
}

.driver-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

.driver-name {
  font-weight: 600;
}

.driver-plate {
  color: #666;
  font-size: 12px;
}

.check-mark {
  color: #1890ff;
  font-weight: bold;
}

.close-picker {
  margin-top: 12px;
  width: 100%;
  padding: 8px;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.exception-section {
  background: #fff9e6;
  border: 1px solid #ffe58f;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
}

.file-upload {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-upload input[type="file"] {
  flex: 1;
}

.file-name {
  font-size: 12px;
  color: #666;
}

.submit-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.submit-btn {
  padding: 12px 48px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.submit-btn:disabled {
  background: #b0b0b0;
  cursor: not-allowed;
}

.submit-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

.large {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 300;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.success-toast {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.error-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 12px;
  background: #fff1f0;
  color: #f5222d;
  text-align: center;
  font-size: 14px;
  border-bottom: 1px solid #ffa39e;
  z-index: 400;
}

.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 150;
}

.confirm-dialog {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.confirm-dialog h5 {
  margin: 0 0 16px 0;
  font-size: 18px;
}

.confirm-summary p {
  margin: 8px 0;
  font-size: 14px;
  color: #333;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn {
  padding: 8px 24px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
}

.confirm-btn {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>