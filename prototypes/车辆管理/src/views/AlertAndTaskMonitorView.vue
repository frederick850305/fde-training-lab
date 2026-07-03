<template>
  <div class="alert-task-monitor">
    <div class="left-panel">
      <div class="panel-header">
        <h2>实时告警</h2>
        <div class="filters">
          <select v-model="alertFilter.status">
            <option value="">全部状态</option>
            <option value="pending">待处理</option>
            <option value="handled">已处理</option>
            <option value="ignored">已忽略</option>
          </select>
          <button @click="fetchAlerts">刷新</button>
          <button @click="exportAlerts" class="export-btn">导出</button>
        </div>
      </div>
      <div v-if="alertLoading" class="skeleton">加载中...</div>
      <div v-else-if="alertError" class="error">
        <p>{{ alertError }}</p>
        <button @click="fetchAlerts">重试</button>
      </div>
      <div v-else-if="alertList.length === 0" class="empty">暂无告警</div>
      <div v-else class="list">
        <div v-for="alert in alertList" :key="alert.id" class="list-item" @click="openAlertDetail(alert)">
          <StatusTag :status="alert.severity" :text="alert.type" />
          <div class="item-info">
            <span class="plate">{{ alert.plateNumber }}</span>
            <span class="time">{{ alert.time }}</span>
            <span class="location">{{ alert.location }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="panel-header">
        <h2>任务进度</h2>
        <div class="filters">
          <select v-model="taskFilter.status">
            <option value="">全部状态</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
          <button @click="fetchTasks">刷新</button>
          <button @click="exportTasks" class="export-btn">导出</button>
        </div>
      </div>
      <div v-if="taskLoading" class="skeleton">加载中...</div>
      <div v-else-if="taskError" class="error">
        <p>{{ taskError }}</p>
        <button @click="fetchTasks">重试</button>
      </div>
      <div v-else-if="taskList.length === 0" class="empty">暂无任务</div>
      <div v-else class="list">
        <div v-for="task in taskList" :key="task.id" class="list-item" @click="openTaskDetail(task)">
          <StatusTag :status="task.status" :text="task.statusLabel" />
          <div class="item-info">
            <span class="plate">{{ task.plateNumber }}</span>
            <span class="driver">{{ task.driver }}</span>
            <span class="time">{{ task.estimatedEndTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 告警详情弹窗 -->
    <DetailPanel v-model:visible="alertDetailVisible" title="告警详情" :width="'500px'">
      <template #default>
        <div v-if="selectedAlert" class="detail-content">
          <p><strong>告警ID:</strong> {{ selectedAlert.id }}</p>
          <p><strong>类型:</strong> {{ selectedAlert.type }}</p>
          <p><strong>车牌号:</strong> {{ selectedAlert.plateNumber }}</p>
          <p><strong>车辆ID:</strong> {{ selectedAlert.vehicleId }}</p>
          <p><strong>时间:</strong> {{ selectedAlert.time }}</p>
          <p><strong>紧急程度:</strong> <StatusTag :status="selectedAlert.severity" :text="selectedAlert.severity" /></p>
          <p><strong>处理状态:</strong> {{ selectedAlert.status }}</p>
          <p><strong>备注:</strong> {{ selectedAlert.remark || '无' }}</p>
          <div class="actions">
            <button @click="handleAlert('confirmed')" class="btn-confirm">确认</button>
            <button @click="handleAlert('ignored')" class="btn-ignore">忽略</button>
            <button @click="handleAlert('transferred')" class="btn-transfer">转人工</button>
          </div>
          <div class="remark-input">
            <label>处理备注</label>
            <input v-model="alertRemark" placeholder="可选备注" />
          </div>
        </div>
      </template>
    </DetailPanel>
    <!-- 任务详情抽屉 -->
    <DetailPanel v-model:visible="taskDetailVisible" title="任务详情" :width="'600px'" mode="drawer">
      <template #default>
        <div v-if="selectedTask" class="detail-content">
          <p><strong>任务ID:</strong> {{ selectedTask.id }}</p>
          <p><strong>车牌号:</strong> {{ selectedTask.plateNumber }}</p>
          <p><strong>司机:</strong> {{ selectedTask.driver }}</p>
          <p><strong>状态:</strong> <StatusTag :status="selectedTask.status" :text="selectedTask.statusLabel" /></p>
          <p><strong>当前阶段:</strong> {{ selectedTask.currentPhase }}</p>
          <p><strong>预计完成时间:</strong> {{ selectedTask.estimatedEndTime }}</p>
          <div class="actions">
            <button @click="remindTask" class="btn-remind">催办</button>
            <button @click="openCancelDialog" class="btn-cancel">取消</button>
          </div>
        </div>
      </template>
    </DetailPanel>
    <!-- 取消确认对话框 -->
    <ConfirmDialog v-model:visible="cancelDialogVisible" title="取消任务" :content="'请填写取消原因'" @confirm="cancelTask">
      <template #extra>
        <input v-model="cancelReason" placeholder="请输入取消原因" class="cancel-input" />
      </template>
    </ConfirmDialog>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import prototypeContract from '../prototypeContract'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { fetchAlertsData } from '../data/mockAlerts.js'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = prototypeContext?.currentRoleKey || 'dispatcher'
const currentRole = prototypeContext?.currentRole || { label: '调度员' }

// 告警数据
const alertList = ref([])
const alertLoading = ref(false)
const alertError = ref('')
const alertFilter = ref({ status: '' })
const alertDetailVisible = ref(false)
const selectedAlert = ref(null)
const alertRemark = ref('')

// 任务数据
const taskList = ref([])
const taskLoading = ref(false)
const taskError = ref('')
const taskFilter = ref({ status: '' })
const taskDetailVisible = ref(false)
const selectedTask = ref(null)
const cancelDialogVisible = ref(false)
const cancelReason = ref('')

async function fetchAlerts() {
  alertLoading.value = true
  alertError.value = ''
  try {
    const data = await fetchAlertsData()
    // 根据角色过滤演示
    let filtered = data.alertsRecords || []
    if (currentRoleKey === 'driver') {
      filtered = filtered.filter(a => a.vehicleId === 'V001')
    }
    if (alertFilter.value.status) {
      filtered = filtered.filter(a => a.status === alertFilter.value.status)
    }
    alertList.value = filtered
    alertLoading.value = false
  } catch (e) {
    alertError.value = '加载告警失败'
    alertLoading.value = false
  }
}

async function fetchTasks() {
  taskLoading.value = true
  taskError.value = ''
  try {
    const data = await fetchAlertsData()
    let tasks = data.taskProgress || []
    if (currentRoleKey === 'driver') {
      tasks = tasks.filter(t => t.driver === '李师傅')
    }
    if (taskFilter.value.status) {
      tasks = tasks.filter(t => t.status === taskFilter.value.status)
    }
    taskList.value = tasks
    taskLoading.value = false
  } catch (e) {
    taskError.value = '加载任务失败'
    taskLoading.value = false
  }
}

function openAlertDetail(alert) {
  selectedAlert.value = alert
  alertRemark.value = alert.remark || ''
  alertDetailVisible.value = true
}

function openTaskDetail(task) {
  selectedTask.value = task
  taskDetailVisible.value = true
}

function openCancelDialog() {
  cancelReason.value = ''
  cancelDialogVisible.value = true
}

function handleAlert(action) {
  // 模拟调用API
  setTimeout(() => {
    alertDetailVisible.value = false
    fetchAlerts()
  }, 300)
}

function remindTask() {
  setTimeout(() => {
    taskDetailVisible.value = false
  }, 300)
}

function cancelTask() {
  if (!cancelReason.value) {
    alert('请填写取消原因')
    return
  }
  setTimeout(() => {
    cancelDialogVisible.value = false
    taskDetailVisible.value = false
    fetchTasks()
  }, 300)
}

function exportAlerts() {
  // 预留导出功能，模拟触发下载
  console.log('导出告警数据')
}

function exportTasks() {
  console.log('导出任务数据')
}

onMounted(() => {
  fetchAlerts()
  fetchTasks()
})
</script>

<style scoped>
.alert-task-monitor {
  display: flex;
  height: 100%;
  gap: 16px;
  padding: 16px;
  background: #f5f7fa;
}
.left-panel, .right-panel {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  padding: 16px;
  overflow-y: auto;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.panel-header h2 {
  margin: 0;
  font-size: 18px;
}
.filters {
  display: flex;
  gap: 8px;
  align-items: center;
}
.filters select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.export-btn {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}
.list-item:hover {
  background: #f0f5ff;
}
.item-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.item-info .plate {
  font-weight: bold;
}
.item-info .time, .item-info .location, .item-info .driver {
  font-size: 12px;
  color: #666;
}
.skeleton, .error, .empty {
  padding: 40px 0;
  text-align: center;
  color: #999;
}
.detail-content {
  padding: 16px 0;
}
.detail-content p {
  margin: 8px 0;
}
.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.actions button {
  padding: 6px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-confirm {
  background: #52c41a;
  color: #fff;
}
.btn-ignore {
  background: #faad14;
  color: #fff;
}
.btn-transfer {
  background: #1890ff;
  color: #fff;
}
.btn-remind {
  background: #1890ff;
  color: #fff;
}
.btn-cancel {
  background: #ff4d4f;
  color: #fff;
}
.remark-input {
  margin-top: 12px;
}
.remark-input label {
  display: block;
  margin-bottom: 4px;
}
.remark-input input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.cancel-input {
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-top: 8px;
}
</style>