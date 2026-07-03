<template>
  <div class="gate-access-check">
    <!-- 顶部状态栏 -->
    <div class="status-bar">
      <span :class="['connection-status', { normal: connectionStatus === 'normal', abnormal: connectionStatus === 'abnormal' }]">
        {{ connectionStatus === 'normal' ? '接口正常' : '接口异常' }}
      </span>
      <span class="pending-count">待处理车辆：{{ pendingVehicles.length }}</span>
    </div>

    <!-- 主内容区 -->
    <div class="main-content">
      <!-- 左侧待核验车辆列表 -->
      <div class="vehicle-list-panel">
        <div class="filter-bar">
          <select v-model="filterStatus" @change="onFilterChange">
            <option value="">全部</option>
            <option value="pending">待核验</option>
            <option value="approved">已放行</option>
            <option value="rejected">已拒绝</option>
          </select>
        </div>
        <div v-if="loading" class="loading-state">加载中...</div>
        <div v-else-if="error" class="error-state">
          <p>加载失败：{{ errorMessage }}</p>
          <button @click="refreshList">重试</button>
        </div>
        <div v-else-if="pendingVehicles.length === 0" class="empty-state">当前无待入场车辆</div>
        <ul v-else class="vehicle-list">
          <li
            v-for="vehicle in filteredVehicles"
            :key="vehicle.id"
            :class="{ active: selectedVehicle?.id === vehicle.id }"
            @click="selectVehicle(vehicle)"
          >
            <div class="vehicle-main">
              <span class="plate">{{ vehicle.plate }}</span>
              <span class="vehicle-meta">{{ vehicle.type }} · {{ vehicle.intent }}</span>
            </div>
            <div class="vehicle-side">
              <span class="status-icon" :class="vehicle.status">{{ vehicle.statusLabel }}</span>
              <span class="source-tag">{{ vehicle.source }}</span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 右侧核验详情与操作区 -->
      <div class="detail-panel">
        <div v-if="!selectedVehicle" class="no-selection">请选择车辆查看详情</div>
        <template v-else>
          <div class="vehicle-summary">
            <div class="summary-title">
              <h3>{{ selectedVehicle.plate }}</h3>
              <span class="status-icon" :class="selectedVehicle.status">{{ selectedVehicle.statusLabel }}</span>
            </div>
            <div class="summary-grid">
              <p><span>类型</span><strong>{{ selectedVehicle.type }}</strong></p>
              <p><span>预约信息</span><strong>{{ selectedVehicle.appointment }}</strong></p>
              <p><span>证照状态</span><strong>{{ selectedVehicle.certStatus }}</strong></p>
              <p><span>入场意图</span><strong>{{ selectedVehicle.intent }}</strong></p>
            </div>
          </div>
          <div class="verification-result">
            <h4>核验详情</h4>
            <p>{{ selectedVehicle.verificationDetail }}</p>
          </div>
          <div class="action-buttons">
            <button class="btn-approve" @click="confirmAction('approve')">放行</button>
            <button v-if="selectedVehicle.verificationStatus === 'failed'" class="btn-approve" @click="manualApprove">手动放行</button>
            <button class="btn-reject" @click="showRejectDialog = true">拒绝</button>
          </div>
        </template>

        <!-- 降级面板（当接口异常时显示） -->
        <div v-if="connectionStatus === 'abnormal'" class="degraded-panel">
          <h4>降级模式</h4>
          <input v-model="degradedPlate" placeholder="录入车牌号" />
          <select v-model="degradedAction">
            <option value="approve">放行</option>
            <option value="reject">拒绝</option>
          </select>
          <button @click="submitDegraded">确认</button>
        </div>
      </div>
    </div>

    <!-- 底部操作日志/提示区域 -->
    <div class="footer-log" v-if="operationLog">
      {{ operationLog }}
    </div>

    <!-- 确认对话框 -->
    <ConfirmDialog
      :visible="showConfirmDialog"
      title="确认放行"
      content="确认放行该车辆？"
      @confirm="handleConfirm"
      @cancel="showConfirmDialog = false"
    />

    <!-- 异常原因登记弹窗 -->
    <DetailPanel
      v-if="showRejectDialog"
      :visible="showRejectDialog"
      title="异常原因登记"
      mode="modal"
      :width="'500px'"
      @close="showRejectDialog = false"
    >
      <template #default>
        <form @submit.prevent="submitReject">
          <label>异常原因：<input v-model="abnormalReason" required /></label>
          <label>备注：<textarea v-model="abnormalRemark"></textarea></label>
          <button type="submit">确认</button>
        </form>
      </template>
    </DetailPanel>

    <!-- 成功/错误提示 -->
    <div v-if="toastMessage" class="toast" :class="toastType">{{ toastMessage }}</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import DetailPanel from '@/components/DetailPanel.vue'
import { mockGate } from '@/data/mockGate'

// 状态
const connectionStatus = ref('normal')
const loading = ref(false)
const error = ref(false)
const errorMessage = ref('')
const pendingVehicles = ref([])
const selectedVehicle = ref(null)
const filterStatus = ref('')
const showConfirmDialog = ref(false)
const showRejectDialog = ref(false)
const abnormalReason = ref('')
const abnormalRemark = ref('')
const degradedPlate = ref('')
const degradedAction = ref('approve')
const operationLog = ref('')
const toastMessage = ref('')
const toastType = ref('success')

// 计算过滤后的车辆列表
const filteredVehicles = computed(() => {
  if (!filterStatus.value) return pendingVehicles.value
  return pendingVehicles.value.filter(v => v.status === filterStatus.value)
})

// 模拟数据加载
async function fetchVehicles() {
  loading.value = true
  error.value = false
  errorMessage.value = ''
  try {
    // 模拟 API 调用
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockGate.pendingVehicles || [])
      }, 1000)
    })
    pendingVehicles.value = response
  } catch (err) {
    error.value = true
    errorMessage.value = err.message || '请求失败'
    connectionStatus.value = 'abnormal'
  } finally {
    loading.value = false
  }
}

function selectVehicle(vehicle) {
  selectedVehicle.value = vehicle
}

function onFilterChange() {
  // 可调用 API 重新获取，此处使用本地过滤
}

function confirmAction(action) {
  if (action === 'approve') {
    showConfirmDialog.value = true
  }
}

async function handleConfirm() {
  showConfirmDialog.value = false
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 调用 POST /api/gate/vehicle-action
    // 从列表移除车辆
    pendingVehicles.value = pendingVehicles.value.filter(v => v.id !== selectedVehicle.value.id)
    selectedVehicle.value = null
    showToast('放行成功', 'success')
    operationLog.value = '放行操作已记录'
  } catch (err) {
    showToast('操作失败', 'error')
  } finally {
    loading.value = false
  }
}

function manualApprove() {
  // 手动放行不做二次确认
  handleConfirm()
}

async function submitReject() {
  showRejectDialog.value = false
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 调用 POST /api/gate/abnormal-record
    pendingVehicles.value = pendingVehicles.value.filter(v => v.id !== selectedVehicle.value.id)
    selectedVehicle.value = null
    showToast('已拒绝', 'success')
    operationLog.value = '拒绝操作已记录'
  } catch (err) {
    showToast('操作失败', 'error')
  } finally {
    loading.value = false
  }
}

async function submitDegraded() {
  if (!degradedPlate.value) return
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 500))
    // 调用 POST /api/gate/degraded-action
    showToast('降级操作成功', 'success')
    degradedPlate.value = ''
    degradedAction.value = 'approve'
  } catch (err) {
    showToast('降级操作失败', 'error')
  } finally {
    loading.value = false
  }
}

function refreshList() {
  fetchVehicles()
}

function showToast(message, type) {
  toastMessage.value = message
  toastType.value = type
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

onMounted(() => {
  fetchVehicles()
})
</script>

<style scoped>
.gate-access-check {
  display: flex;
  flex-direction: column;
  height: 100%;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #eef4fb;
}

.status-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 18px;
  background: #fff;
  border: 1px solid #dbe3ef;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .06);
}

.connection-status {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.connection-status.normal {
  background: #e8f5e9;
  color: #2e7d32;
}

.connection-status.abnormal {
  background: #ffebee;
  color: #c62828;
}

.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.vehicle-list-panel {
  width: 360px;
  border-right: 1px solid #dbe3ef;
  overflow-y: auto;
  background: #fff;
}

.filter-bar {
  padding: 12px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.filter-bar select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 8px 10px;
  background: #fff;
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.vehicle-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.vehicle-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background 0.2s;
}

.vehicle-list li:hover,
.vehicle-list li.active {
  background: #e3f2fd;
}

.plate {
  font-weight: bold;
  color: #0f172a;
  font-size: 16px;
}

.vehicle-main {
  display: grid;
  gap: 5px;
}

.vehicle-meta {
  color: #64748b;
  font-size: 12px;
}

.vehicle-side {
  display: grid;
  gap: 6px;
  justify-items: end;
}

.status-icon {
  margin: 0 8px;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 3px;
}

.status-icon.pending { background: #fff3e0; color: #e65100; }
.status-icon.approved { background: #e8f5e9; color: #2e7d32; }
.status-icon.rejected { background: #ffebee; color: #c62828; }

.source-tag {
  background: #e0e0e0;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.detail-panel {
  flex: 1;
  padding: 22px;
  overflow-y: auto;
}

.no-selection {
  color: #aaa;
  text-align: center;
  margin-top: 90px;
  font-size: 20px;
  font-weight: 800;
}

.vehicle-summary,
.verification-result {
  background: #fff;
  padding: 18px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  margin-bottom: 16px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, .05);
}

.summary-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.summary-title h3 {
  margin: 0;
  font-size: 28px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.summary-grid p {
  margin: 0;
  display: grid;
  gap: 4px;
  padding: 12px;
  border-radius: 8px;
  background: #f8fafc;
}

.summary-grid span {
  color: #64748b;
  font-size: 12px;
}

.summary-grid strong {
  color: #0f172a;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-approve {
  background: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-reject {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.degraded-panel {
  border: 1px dashed #f44336;
  padding: 16px;
  border-radius: 4px;
  background: #fff9c4;
}

.degraded-panel input,
.degraded-panel select {
  margin-right: 8px;
  padding: 4px;
}

.footer-log {
  padding: 8px 16px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  font-size: 12px;
  color: #666;
}

.toast {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 24px;
  border-radius: 4px;
  color: white;
  z-index: 1000;
}

.toast.success {
  background: #4caf50;
}

.toast.error {
  background: #f44336;
}
</style>
