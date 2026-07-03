<template>
  <div class="alert-task-monitor">
    <!-- 加载状态 -->
    <div v-if="pageLoading" class="loading-container">
      <div class="skeleton-list">
        <div class="skeleton-item" v-for="n in 5" :key="n"></div>
      </div>
      <div class="skeleton-list right">
        <div class="skeleton-item" v-for="n in 3" :key="n"></div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="pageError" class="error-container">
      <p>{{ errorMessage }}</p>
      <button @click="retryLoad">重试</button>
    </div>

    <!-- 正常内容 -->
    <template v-else>
      <!-- 告警列表区域（左侧） -->
      <div class="alert-panel">
        <div class="panel-header">
          <h3>实时告警</h3>
          <div class="filter-controls">
            <select v-model="alertStatusFilter" @change="filterAlerts">
              <option value="">全部状态</option>
              <option value="pending">待处理</option>
              <option value="handling">处理中</option>
              <option value="resolved">已处理</option>
            </select>
          </div>
          <button @click="exportAlerts" class="export-btn">导出Excel</button>
        </div>
        <div class="alert-list">
          <div v-if="filteredAlerts.length === 0" class="empty-state">暂无告警</div>
          <div
            v-for="alert in filteredAlerts"
            :key="alert.id"
            class="alert-item"
            :class="severityClass(alert.severity)"
            @click="openAlertDetail(alert)"
          >
            <span class="severity-indicator"></span>
            <div class="alert-info">
              <span class="alert-type">{{ alert.type }}</span>
              <span class="alert-desc">{{ alert.vehiclePlate }} · {{ alert.location }}</span>
              <span class="alert-time">{{ alert.time }}</span>
            </div>
            <StatusTag :status="alert.status" :text="alert.statusLabel" size="small" />
          </div>
        </div>
      </div>

      <!-- 任务列表区域（右侧） -->
      <div class="task-panel">
        <div class="panel-header">
          <h3>任务进展</h3>
          <div class="filter-controls">
            <select v-model="taskStatusFilter" @change="filterTasks">
              <option value="">全部状态</option>
              <option value="in_progress">进行中</option>
              <option value="pending_review">待审核</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>
          <button @click="exportTasks" class="export-btn">导出Excel</button>
        </div>
        <div class="task-list">
          <div v-if="filteredTasks.length === 0" class="empty-state">暂无任务</div>
          <div
            v-for="task in filteredTasks"
            :key="task.id"
            class="task-item"
            @click="openTaskDetail(task)"
          >
            <div class="task-header">
              <span class="task-title">{{ task.title }}</span>
              <StatusTag :status="task.status" :text="task.statusLabel" />
            </div>
            <div class="task-meta">
              <span>{{ task.vehiclePlate }}</span>
              <span>{{ task.driver }}</span>
            </div>
            <div class="task-progress">
              <div class="progress-bar" :style="{ width: task.progress + '%' }"></div>
            </div>
            <div class="task-footer">
              <span class="task-deadline">预计完成: {{ task.deadline }}</span>
              <span class="task-percent">{{ task.progress }}%</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 告警处理弹窗 -->
    <DetailPanel
      v-model:visible="alertDialogVisible"
      title="告警详情"
      mode="modal"
      :width="'500px'"
    >
      <template v-if="selectedAlert">
        <div class="alert-detail-content">
          <p><strong>告警类型：</strong>{{ selectedAlert.type }}</p>
          <p><strong>车辆：</strong>{{ selectedAlert.vehiclePlate }}</p>
          <p><strong>时间：</strong>{{ selectedAlert.time }}</p>
          <p><strong>位置：</strong>{{ selectedAlert.location }}</p>
          <p><strong>描述：</strong>{{ selectedAlert.description }}</p>
          <div class="action-buttons">
            <button @click="handleAlert('confirmed')" :disabled="alertHandling">确认</button>
            <button @click="handleAlert('ignored')" :disabled="alertHandling">忽略</button>
            <button @click="handleAlert('transferred')" :disabled="alertHandling">转人工</button>
          </div>
          <div class="remark-area">
            <label>备注：</label>
            <textarea v-model="alertRemark" placeholder="输入备注..."></textarea>
          </div>
        </div>
      </template>
    </DetailPanel>

    <!-- 任务详情抽屉 -->
    <DetailPanel
      v-model:visible="taskDrawerVisible"
      :title="selectedTask ? selectedTask.title : ''"
      mode="drawer"
      :width="'450px'"
    >
      <template v-if="selectedTask">
        <div class="task-detail-content">
          <p><strong>司机：</strong>{{ selectedTask.driver }}</p>
          <p><strong>车辆：</strong>{{ selectedTask.vehiclePlate }}</p>
          <p><strong>状态：</strong><StatusTag :status="selectedTask.status" :text="selectedTask.statusLabel" /></p>
          <div class="timeline">
            <h4>任务步骤</h4>
            <div v-for="step in selectedTask.steps" :key="step.id" class="step-item">
              <span class="step-time">{{ step.time }}</span>
              <span class="step-action">{{ step.action }}</span>
              <span v-if="step.photo" class="step-photo" @click="viewPhoto(step.photo)">查看照片</span>
            </div>
          </div>
          <div class="related-alerts" v-if="selectedTask.relatedAlerts.length">
            <h4>关联告警</h4>
            <span v-for="alert in selectedTask.relatedAlerts" :key="alert.id" class="related-alert-tag">{{ alert.type }}</span>
          </div>
          <div class="action-buttons">
            <button @click="urgeTask" :disabled="taskActionLoading">催办</button>
            <button @click="showCancelDialog = true" :disabled="taskActionLoading">取消任务</button>
          </div>
        </div>
      </template>
    </DetailPanel>

    <!-- 取消任务确认对话框 -->
    <ConfirmDialog
      v-model:visible="showCancelDialog"
      title="取消任务"
      content="请输入取消原因："
      confirmText="确认取消"
      cancelText="返回"
      :loading="taskActionLoading"
      @confirm="cancelTask"
      @cancel="showCancelDialog = false"
    >
      <template #default>
        <textarea v-model="cancelReason" placeholder="请填写取消原因..." rows="3"></textarea>
      </template>
    </ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import StatusTag from '@/components/StatusTag.vue'
import DataTable from '@/components/DataTable.vue'
import DetailPanel from '@/components/DetailPanel.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { alerts, tasks } from '@/data/mockAlerts'

// 页面状态
const pageLoading = ref(true)
const pageError = ref(false)
const errorMessage = ref('')

// 告警数据
const alertList = ref([])
const alertStatusFilter = ref('')
const filteredAlerts = computed(() => {
  if (!alertStatusFilter.value) return alertList.value
  return alertList.value.filter(a => a.status === alertStatusFilter.value)
})

// 任务数据
const taskList = ref([])
const taskStatusFilter = ref('')
const filteredTasks = computed(() => {
  if (!taskStatusFilter.value) return taskList.value
  return taskList.value.filter(t => t.status === taskStatusFilter.value)
})

// 告警弹窗
const alertDialogVisible = ref(false)
const selectedAlert = ref(null)
const alertRemark = ref('')
const alertHandling = ref(false)

// 任务抽屉
const taskDrawerVisible = ref(false)
const selectedTask = ref(null)
const taskActionLoading = ref(false)

// 取消任务
const showCancelDialog = ref(false)
const cancelReason = ref('')

// 严重程度类名
function severityClass(severity) {
  return {
    high: 'severity-high',
    medium: 'severity-medium',
    low: 'severity-low'
  }[severity] || ''
}

// 加载数据
async function loadData() {
  pageLoading.value = true
  pageError.value = false
  try {
    // 模拟接口调用
    await new Promise(resolve => setTimeout(resolve, 800))
    alertList.value = alerts
    taskList.value = tasks
  } catch (e) {
    pageError.value = true
    errorMessage.value = '数据加载失败，请重试'
  } finally {
    pageLoading.value = false
  }
}

const retryLoad = loadData

onMounted(loadData)

// 告警处理
async function handleAlert(action) {
  alertHandling.value = true
  try {
    // 模拟 POST /api/v1/alerts/handle
    await new Promise(resolve => setTimeout(resolve, 300))
    // 更新本地状态
    const idx = alertList.value.findIndex(a => a.id === selectedAlert.value.id)
    if (idx !== -1) {
      const newStatus = action === 'confirmed' ? 'resolved' : (action === 'ignored' ? 'ignored' : 'transferred')
      alertList.value[idx].status = newStatus
      alertList.value[idx].remark = alertRemark.value
    }
    alertDialogVisible.value = false
    alertRemark.value = ''
  } finally {
    alertHandling.value = false
  }
}

function openAlertDetail(alert) {
  selectedAlert.value = { ...alert }
  alertRemark.value = alert.remark || ''
  alertDialogVisible.value = true
}

// 任务操作
function openTaskDetail(task) {
  selectedTask.value = { ...task }
  taskDrawerVisible.value = true
}

async function urgeTask() {
  taskActionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    alert('催办通知已发送')
  } finally {
    taskActionLoading.value = false
  }
}

async function cancelTask() {
  taskActionLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 300))
    // 更新本地任务状态为已取消
    const idx = taskList.value.findIndex(t => t.id === selectedTask.value.id)
    if (idx !== -1) {
      taskList.value[idx].status = 'cancelled'
      taskList.value[idx].cancelReason = cancelReason.value
    }
    showCancelDialog.value = false
    cancelReason.value = ''
    taskDrawerVisible.value = false
  } finally {
    taskActionLoading.value = false
  }
}

// 导出（预留）
function exportAlerts() {
  console.log('导出告警列表')
}
function exportTasks() {
  console.log('导出任务列表')
}

function viewPhoto(photoUrl) {
  // 预留查看照片
  window.open(photoUrl, '_blank')
}

function filterAlerts() {
  // 可通过computed自动过滤，这里仅演示
}

function filterTasks() {
  // 可通过computed自动过滤
}
</script>

<style scoped>
.alert-task-monitor {
  display: flex;
  height: 100%;
  gap: 16px;
  padding: 16px;
  background: #f0f2f5;
}

.loading-container {
  display: flex;
  gap: 16px;
  width: 100%;
}

.skeleton-list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-list.right {
  flex: 0 0 400px;
}

.skeleton-item {
  height: 80px;
  background: linear-gradient(90deg, #e0e0e0 25%, #f5f5f5 50%, #e0e0e0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  color: #ff4d4f;
  gap: 12px;
}

.error-container button {
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.alert-panel,
.task-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.alert-panel {
  flex: 1;
}

.task-panel {
  flex: 0 0 400px;
}

.panel-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e8e8e8;
  gap: 12px;
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  flex: 1;
}

.filter-controls select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
}

.export-btn {
  padding: 4px 12px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.alert-list,
.task-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #999;
  font-size: 14px;
}

.alert-item {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s;
  position: relative;
}

.alert-item:hover {
  background: #fafafa;
}

.severity-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
}

.severity-high .severity-indicator {
  background: #ff4d4f;
}

.severity-medium .severity-indicator {
  background: #faad14;
}

.severity-low .severity-indicator {
  background: #52c41a;
}

.alert-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alert-type {
  font-weight: 500;
  color: #1f2937;
}

.alert-desc {
  font-size: 12px;
  color: #4b5563;
}

.alert-time {
  font-size: 12px;
  color: #888;
}

.task-item {
  padding: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.task-item:hover {
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-weight: 500;
  color: #1f2937;
}

.task-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
  font-size: 12px;
  color: #4b5563;
}

.task-progress {
  height: 6px;
  background: #e8e8e8;
  border-radius: 3px;
  margin-bottom: 6px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: #1890ff;
  border-radius: 3px;
  transition: width 0.3s;
}

.task-deadline {
  font-size: 12px;
  color: #888;
}

.task-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.task-percent {
  font-size: 12px;
  color: #1890ff;
  font-weight: 600;
}

.alert-detail-content,
.task-detail-content {
  padding: 16px;
}

.alert-detail-content p,
.task-detail-content p {
  margin: 8px 0;
}

.action-buttons {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.action-buttons button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.action-buttons button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.remark-area {
  margin-top: 12px;
}

.remark-area textarea {
  width: 100%;
  min-height: 60px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  resize: vertical;
}

.timeline {
  margin-top: 16px;
}

.step-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 8px;
}

.step-time {
  font-size: 12px;
  color: #888;
  min-width: 60px;
}

.step-action {
  flex: 1;
}

.step-photo {
  color: #1890ff;
  cursor: pointer;
  font-size: 12px;
}

.related-alerts {
  margin-top: 16px;
}

.related-alert-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #f5222d;
  color: white;
  border-radius: 4px;
  margin: 4px 4px 0 0;
  font-size: 12px;
}
</style>
