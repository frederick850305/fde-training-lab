<template>
  <div class="task-adjust-view">
    <!-- 顶部信息摘要 -->
    <div v-if="vehicleInfo" class="summary-card">
      <div class="summary-item"><span class="label">车牌</span>{{ vehicleInfo.plate }}</div>
      <div class="summary-item"><span class="label">司机</span>{{ vehicleInfo.driverName }}</div>
      <div class="summary-item"><span class="label">任务描述</span>{{ currentTask?.description || '--' }}</div>
    </div>

    <!-- Empty 状态 -->
    <div v-if="pageState === 'empty'" class="state-message error">
      无法获取任务信息，请返回重试
    </div>

    <!-- 加载遮罩 -->
    <div v-if="pageState === 'loading'" class="loading-overlay">
      <div class="spinner"></div>
    </div>

    <!-- 错误通知 -->
    <div v-if="pageState === 'error'" class="state-message error">
      {{ errorMessage }}
    </div>

    <!-- 表单主体（仅当有数据且非loading/error时显示） -->
    <div v-if="pageState === 'ready'" class="form-body">
      <!-- 操作类型选择 -->
      <div class="operation-buttons">
        <button
          v-for="op in operationTypes"
          :key="op.value"
          :class="['op-btn', { active: selectedOperation === op.value }]"
          @click="selectOperation(op.value)"
        >
          {{ op.label }}
        </button>
      </div>

      <!-- 改派表单 -->
      <div v-if="selectedOperation === 'reassign'" class="form-section">
        <label>目标司机</label>
        <div class="driver-picker" @click="openDriverList">
          <template v-if="selectedDriver">
            <span>{{ selectedDriver.name }}（{{ selectedDriver.plate }}）</span>
          </template>
          <template v-else>
            <span class="placeholder">点击选择司机</span>
          </template>
        </div>
      </div>

      <!-- 取消表单 -->
      <div v-if="selectedOperation === 'cancel'" class="form-section">
        <label>取消原因</label>
        <select v-model="cancelReason" class="input">
          <option value="">请选择原因</option>
          <option value="任务重复">任务重复</option>
          <option value="车辆故障">车辆故障</option>
          <option value="客户取消">客户取消</option>
          <option value="其他">其他</option>
        </select>
      </div>

      <!-- 加派表单 -->
      <div v-if="selectedOperation === 'add'" class="form-section">
        <label>作业地点</label>
        <div class="location-picker" @click="openLocationPicker">
          <span v-if="selectedLocation">{{ selectedLocation }}</span>
          <span v-else class="placeholder">选择作业点</span>
        </div>
        <label>预计作业时间</label>
        <input v-model="addTime" type="datetime-local" class="input" />
        <label>作业要求</label>
        <textarea v-model="addRequirement" class="input" rows="2"></textarea>
      </div>

      <!-- 异常处理记录 -->
      <div class="form-section exception-section">
        <label>异常处理原因 <span class="required">*</span></label>
        <input v-model="exceptionReason" class="input" placeholder="请填写异常处理原因" />
        <label>备注</label>
        <textarea v-model="exceptionNote" class="input" rows="2"></textarea>
        <label>附件上传</label>
        <div class="file-upload">
          <input type="file" @change="onFileChange" multiple />
          <div v-if="files.length" class="file-list">
            <span v-for="f in files" :key="f.name">{{ f.name }}</span>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <button
        class="submit-btn"
        :disabled="!canSubmit"
        @click="confirmSubmit"
      >
        提交
      </button>
    </div>

    <!-- 二次确认弹窗 -->
    <div v-if="showConfirm" class="confirm-overlay" @click.self="showConfirm = false">
      <div class="confirm-dialog">
        <h3>确认操作</h3>
        <div class="confirm-summary">
          <p>操作类型：{{ operationLabel }}</p>
          <p v-if="selectedDriver">目标司机：{{ selectedDriver.name }}</p>
          <p v-if="selectedLocation">作业地点：{{ selectedLocation }}</p>
          <p>异常处理原因：{{ exceptionReason }}</p>
        </div>
        <div class="confirm-actions">
          <button class="cancel-btn" @click="showConfirm = false">取消</button>
          <button class="ok-btn" @click="doSubmit" :disabled="submitting">
            {{ submitting ? '提交中...' : '确定' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 司机选择浮层（改派用） -->
    <div v-if="showDriverList" class="drawer-overlay" @click.self="showDriverList = false">
      <div class="drawer">
        <h3>选择目标司机</h3>
        <div class="driver-list">
          <div
            v-for="driver in nearbyDrivers"
            :key="driver.vehicleId"
            class="driver-item"
            @click="selectDriver(driver)"
          >
            <span>{{ driver.driverName }}</span>
            <span>{{ driver.plate }}</span>
            <span>{{ driver.currentPosition }}</span>
          </div>
        </div>
        <button class="close-drawer" @click="showDriverList = false">关闭</button>
      </div>
    </div>

    <!-- 作业点选择器（加派用） -->
    <div v-if="showLocationPicker" class="drawer-overlay" @click.self="showLocationPicker = false">
      <div class="drawer">
        <h3>选择作业地点</h3>
        <input v-model="locationSearch" class="input" placeholder="搜索地点" />
        <div class="location-list">
          <div
            v-for="loc in filteredLocations"
            :key="loc"
            class="location-item"
            @click="selectLocation(loc)"
          >
            {{ loc }}
          </div>
        </div>
        <button class="close-drawer" @click="showLocationPicker = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { prototypeContract } from '../prototypeContract'

// 注入角色上下文
const prototypeContext = inject('prototypeContext', {
  currentRole: 'dispatcher',
  currentRoleKey: 'dispatcher'
})
const currentRoleKey = computed(() => prototypeContext.currentRoleKey)

// 页面状态
const pageState = ref('loading')
const errorMessage = ref('')
const submitting = ref(false)
const showConfirm = ref(false)
const showDriverList = ref(false)
const showLocationPicker = ref(false)

// 数据
const vehicleInfo = ref(null)
const currentTask = ref(null)
const nearbyDrivers = ref([])
const operationTypes = [
  { label: '改派', value: 'reassign' },
  { label: '取消', value: 'cancel' },
  { label: '加派', value: 'add' }
]
const selectedOperation = ref('')
const selectedDriver = ref(null)
const cancelReason = ref('')
const selectedLocation = ref('')
const addTime = ref('')
const addRequirement = ref('')
const exceptionReason = ref('')
const exceptionNote = ref('')
const files = ref([])
const locationSearch = ref('')

// 预设作业地点列表（用于演示）
const predefinedLocations = [
  '一号仓库', '二号仓库', '三号仓库', 'A区卸货台', 'B区装货台', '维修车间'
]
const filteredLocations = computed(() =>
  predefinedLocations.filter(l => l.includes(locationSearch.value))
)

// 操作类型标签
const operationLabel = computed(() => {
  const op = operationTypes.find(o => o.value === selectedOperation.value)
  return op ? op.label : ''
})

// 是否可提交
const canSubmit = computed(() => {
  if (!selectedOperation.value) return false
  if (!exceptionReason.value) return false
  if (selectedOperation.value === 'reassign' && !selectedDriver.value) return false
  if (selectedOperation.value === 'cancel' && !cancelReason.value) return false
  if (selectedOperation.value === 'add' && (!selectedLocation.value || !addTime.value)) return false
  return true
})

// 模拟从 mock 获取数据
async function fetchData() {
  pageState.value = 'loading'
  try {
    // 从 pageContract 指定的 mock 读取
    const { fetchDispatchData } = await import('../data/mockDispatch.js')
    const mockData = fetchDispatchData()
    // 模拟从路由或上下文获取车辆任务信息，此处从 mock 提取演示
    const task = mockData.dispatchTask
    if (!task) {
      pageState.value = 'empty'
      return
    }
    currentTask.value = task
    // 车辆信息可以从 task 或 vehicleList 中提取
    const vehicle = (mockData.vehicleList || []).find(v => v.vehicleId === task.vehicleId)
    vehicleInfo.value = vehicle ? {
      plate: vehicle.plate,
      driverName: vehicle.driverName
    } : { plate: '未知', driverName: '未知' }
    // 周边司机来自 nearbyVehicles
    nearbyDrivers.value = (mockData.nearbyVehicles || []).map(v => ({
      vehicleId: v.vehicleId,
      plate: v.plate,
      driverName: v.driverName || v.currentDriver,
      currentPosition: v.currentPosition
    }))
    pageState.value = 'ready'
  } catch (e) {
    pageState.value = 'error'
    errorMessage.value = '数据加载失败：' + (e.message || '未知错误')
  }
}

onMounted(fetchData)

function selectOperation(val) {
  selectedOperation.value = val
  // 清除其他字段
  if (val !== 'reassign') selectedDriver.value = null
  if (val !== 'cancel') cancelReason.value = ''
  if (val !== 'add') {
    selectedLocation.value = ''
    addTime.value = ''
    addRequirement.value = ''
  }
}

function openDriverList() {
  showDriverList.value = true
}

function selectDriver(driver) {
  selectedDriver.value = driver
  showDriverList.value = false
}

function openLocationPicker() {
  showLocationPicker.value = true
}

function selectLocation(loc) {
  selectedLocation.value = loc
  showLocationPicker.value = false
}

function onFileChange(e) {
  files.value = Array.from(e.target.files)
}

function confirmSubmit() {
  showConfirm.value = true
}

async function doSubmit() {
  submitting.value = true
  try {
    // 模拟调用 API
    await new Promise((resolve) => setTimeout(resolve, 1500))
    // 成功后返回主工作台（模拟跳转）
    pageState.value = 'success'
    // 短暂显示 success 提示
  } catch (e) {
    pageState.value = 'error'
    errorMessage.value = '操作失败：' + (e.message || '请求异常')
  } finally {
    submitting.value = false
    showConfirm.value = false
  }
}
</script>

<style scoped>
.task-adjust-view {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}
.summary-card {
  background: #f5f7fa;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}
.summary-item {
  font-size: 14px;
}
.summary-item .label {
  color: #909399;
  margin-right: 6px;
}
.operation-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}
.op-btn {
  flex: 1;
  padding: 10px 0;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}
.op-btn.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.form-section {
  margin-bottom: 16px;
}
.form-section label {
  display: block;
  font-size: 13px;
  color: #606266;
  margin-bottom: 6px;
}
.form-section .required {
  color: #f56c6c;
}
.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}
select.input {
  appearance: auto;
}
textarea.input {
  resize: vertical;
}
.driver-picker,
.location-picker {
  padding: 8px 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  min-height: 36px;
  display: flex;
  align-items: center;
}
.placeholder {
  color: #c0c4cc;
}
.file-upload {
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
  padding: 8px;
  text-align: center;
}
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
}
.submit-btn {
  width: 100%;
  padding: 12px 0;
  background: #409eff;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
}
.submit-btn:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.state-message {
  padding: 20px;
  text-align: center;
  border-radius: 4px;
  margin-bottom: 16px;
}
.state-message.error {
  background: #fef0f0;
  color: #f56c6c;
}
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #409eff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}
.confirm-dialog {
  background: #fff;
  width: 80%;
  max-width: 400px;
  border-radius: 8px;
  padding: 24px;
}
.confirm-dialog h3 {
  margin-top: 0;
  margin-bottom: 16px;
}
.confirm-summary p {
  margin: 4px 0;
  font-size: 14px;
}
.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
.cancel-btn,
.ok-btn {
  padding: 8px 20px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}
.cancel-btn {
  background: #f4f4f5;
  color: #606266;
}
.ok-btn {
  background: #409eff;
  color: #fff;
}
.ok-btn:disabled {
  background: #a0cfff;
}
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  z-index: 300;
}
.drawer {
  background: #fff;
  width: 100%;
  max-height: 60%;
  border-radius: 12px 12px 0 0;
  padding: 20px;
  overflow-y: auto;
}
.drawer h3 {
  margin-top: 0;
  margin-bottom: 12px;
}
.driver-item,
.location-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
}
.driver-item:hover,
.location-item:hover {
  background: #f5f7fa;
}
.close-drawer {
  display: block;
  width: 100%;
  padding: 10px;
  margin-top: 12px;
  background: #f4f4f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>