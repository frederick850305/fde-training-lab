<template>
  <div class="alert-task-monitor">
    <div v-if="uiState === 'error'" class="state-error">
      <p>数据加载失败，请重试</p>
      <button @click="fetchAll">重试</button>
    </div>
    <div v-else class="layout">
      <div class="panel alerts-panel">
        <div class="panel-header">
          <h3>告警列表</h3>
          <select v-model="alertFilter.status" @change="fetchAlerts">
            <option value="">全部</option>
            <option value="pending">待处理</option>
            <option value="handled">已处理</option>
            <option value="ignored">已忽略</option>
            <option value="transferred">转人工</option>
          </select>
        </div>
        <div v-if="uiState === 'loading'" class="skeleton">加载中...</div>
        <div v-else-if="alerts.length === 0" class="empty">暂无告警</div>
        <ul v-else class="alert-list">
          <li v-for="alert in alerts" :key="alert.id" class="alert-item" :class="severityClass(alert.severity)" @click="openAlertDetail(alert)">
            <span class="severity-badge">{{ alert.severity }}</span>
            <div class="alert-meta">
              <span class="alert-type">{{ alert.type }}</span>
              <span class="alert-time">{{ formatTime(alert.time) }}</span>
              <span class="alert-vehicle">{{ alert.plate }}</span>
            </div>
            <span class="alert-status">{{ alert.statusText }}</span>
          </li>
        </ul>
      </div>
      <div class="panel tasks-panel">
        <div class="panel-header">
          <h3>任务列表</h3>
          <select v-model="taskFilter.status" @change="fetchTasks">
            <option value="">全部</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
        <div v-if="uiState === 'loading'" class="skeleton">加载中...</div>
        <div v-else-if="tasks.length === 0" class="empty">暂无任务</div>
        <ul v-else class="task-list">
          <li v-for="task in tasks" :key="task.id" class="task-item" @click="openTaskDetail(task)">
            <div class="task-meta">
              <span class="task-title">{{ task.title }}</span>
              <span class="task-vehicle">{{ task.plate }}</span>
              <span class="task-driver">{{ task.driver }}</span>
              <span class="task-status">{{ task.statusText }}</span>
            </div>
            <div class="task-progress">
              <span>阶段: {{ task.currentPhase }}</span>
              <span>预计: {{ formatTime(task.estimatedEnd) }}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- 告警详情弹窗 -->
    <div v-if="selectedAlert" class="modal-overlay" @click.self="selectedAlert = null">
      <div class="modal">
        <h3>告警详情</h3>
        <p>类型: {{ selectedAlert.type }}</p>
        <p>车牌: {{ selectedAlert.plate }}</p>
        <p>时间: {{ formatTime(selectedAlert.time) }}</p>
        <p>位置: {{ selectedAlert.location }}</p>
        <p>描述: {{ selectedAlert.description }}</p>
        <div class="actions">
          <button @click="handleAlert('confirmed')">确认</button>
          <button @click="handleAlert('ignored')">忽略</button>
          <button @click="handleAlert('transferred')">转人工</button>
        </div>
        <textarea v-model="alertNote" placeholder="备注"></textarea>
        <button @click="selectedAlert = null">关闭</button>
      </div>
    </div>
    <!-- 任务详情抽屉 -->
    <div v-if="selectedTask" class="drawer-overlay" @click.self="selectedTask = null">
      <div class="drawer">
        <h3>任务详情</h3>
        <p>任务标题: {{ selectedTask.title }}</p>
        <p>车牌: {{ selectedTask.plate }}</p>
        <p>司机: {{ selectedTask.driver }}</p>
        <p>状态: {{ selectedTask.statusText }}</p>
        <p>当前阶段: {{ selectedTask.currentPhase }}</p>
        <p>预计完成: {{ formatTime(selectedTask.estimatedEnd) }}</p>
        <div v-if="selectedTask.steps && selectedTask.steps.length">
          <h4>步骤时间戳</h4>
          <ul>
            <li v-for="step in selectedTask.steps" :key="step.time">{{ step.label }}: {{ formatTime(step.time) }}</li>
          </ul>
        </div>
        <div v-if="selectedTask.photos && selectedTask.photos.length">
          <h4>现场照片</h4>
          <div class="photos">
            <img v-for="(photo, idx) in selectedTask.photos" :key="idx" :src="photo" alt="现场照片" />
          </div>
        </div>
        <div class="actions">
          <button @click="remindTask">催办</button>
          <button @click="cancelTask">取消任务</button>
        </div>
        <button @click="selectedTask = null">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import prototypeContract from '../prototypeContract.js'
import { fetchAlertsData, alertsRecords } from '../data/mockAlerts.js'

const prototypeContext = inject('prototypeContext', { currentRole: 'dispatcher', currentRoleKey: 'dispatcher' })
const currentRole = prototypeContext.currentRole
const currentRoleKey = prototypeContext.currentRoleKey

// 页面状态
const uiState = ref('loading')
const alerts = ref([])
const tasks = ref([])
const alertFilter = ref({ status: '' })
const taskFilter = ref({ status: '' })
const selectedAlert = ref(null)
const selectedTask = ref(null)
const alertNote = ref('')

// 根据角色调整默认筛选
if (currentRoleKey === 'manager' || currentRoleKey === 'admin') {
  alertFilter.value.status = ''
  taskFilter.value.status = ''
} else {
  // 调度员默认看待处理告警
  alertFilter.value.status = 'pending'
}

function severityClass(severity) {
  if (severity === 'high') return 'severity-high'
  if (severity === 'medium') return 'severity-medium'
  return 'severity-low'
}

function formatTime(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
}

function normalizeAlert(raw) {
  // 映射 schema: alertItem 字段
  return {
    id: raw.alertId || raw.id,
    type: raw.alertType || raw.type,
    plate: raw.plateNumber || raw.plate,
    time: raw.alertTime || raw.time,
    severity: raw.severity || 'low',
    status: raw.status || 'pending',
    statusText: raw.statusText || (raw.status === 'pending' ? '待处理' : raw.status === 'handled' ? '已处理' : raw.status === 'ignored' ? '已忽略' : '转人工'),
    location: raw.location || '',
    description: raw.description || ''
  }
}

function normalizeTask(raw) {
  // 映射 schema: taskProgress 字段
  return {
    id: raw.taskId || raw.id,
    title: raw.taskTitle || raw.title || '任务',
    plate: raw.plateNumber || raw.plate,
    driver: raw.driverName || raw.driver,
    status: raw.status || 'in_progress',
    statusText: raw.statusText || (raw.status === 'in_progress' ? '进行中' : raw.status === 'completed' ? '已完成' : raw.status === 'cancelled' ? '已取消' : '未知'),
    currentPhase: raw.currentPhase || '',
    estimatedEnd: raw.estimatedEnd || '',
    steps: raw.steps || [],
    photos: raw.photos || []
  }
}

async function fetchAlerts() {
  try {
    const rawData = await fetchAlertsData()
    // mockAlerts.js 导出 alertsRecords 为数组
    let rawList = Array.isArray(rawData) ? rawData : (rawData.alertsRecords || [])
    if (alertFilter.value.status) {
      rawList = rawList.filter(item => (item.status || 'pending') === alertFilter.value.status)
    }
    alerts.value = rawList.map(normalizeAlert)
  } catch (e) {
    uiState.value = 'error'
  }
}

async function fetchTasks() {
  // 任务数据可能从同一 mock 中获取，这里我们复用 alertsRecords 中的 taskProgress 字段
  // 但实际 mockAlerts 中可能存在 taskProgress 数组，我们通过 fetchAlertsData 获得完整数据后提取
  try {
    const rawData = await fetchAlertsData()
    let rawTasks = rawData.taskProgress || []
    if (!Array.isArray(rawTasks)) rawTasks = []
    if (taskFilter.value.status) {
      rawTasks = rawTasks.filter(item => (item.status || 'in_progress') === taskFilter.value.status)
    }
    tasks.value = rawTasks.map(normalizeTask)
  } catch (e) {
    uiState.value = 'error'
  }
}

async function fetchAll() {
  uiState.value = 'loading'
  await Promise.all([fetchAlerts(), fetchTasks()])
  uiState.value = 'success'
}

function openAlertDetail(alert) {
  selectedAlert.value = alert
  alertNote.value = ''
}

function openTaskDetail(task) {
  selectedTask.value = task
}

async function handleAlert(action) {
  // 模拟调接口 POST /api/v1/alerts/handle
  console.log(`处理告警 ${selectedAlert.value.id} 动作: ${action} 备注: ${alertNote.value}`)
  // 成功后更新本地状态
  const idx = alerts.value.findIndex(a => a.id === selectedAlert.value.id)
  if (idx !== -1) {
    alerts.value[idx].status = action
    alerts.value[idx].statusText = action === 'confirmed' ? '已处理' : action === 'ignored' ? '已忽略' : '转人工'
  }
  selectedAlert.value = null
}

async function remindTask() {
  console.log(`催办任务 ${selectedTask.value.id}`)
  // 调用 POST /api/v1/tasks/remind
}

async function cancelTask() {
  if (!confirm('确认取消任务？')) return
  console.log(`取消任务 ${selectedTask.value.id}`)
  // 调用 POST /api/v1/tasks/cancel
  const idx = tasks.value.findIndex(t => t.id === selectedTask.value.id)
  if (idx !== -1) {
    tasks.value[idx].status = 'cancelled'
    tasks.value[idx].statusText = '已取消'
  }
  selectedTask.value = null
}

onMounted(fetchAll)
</script>

<style scoped>
.alert-task-monitor {
  font-family: sans-serif;
  padding: 16px;
  height: 100%;
  box-sizing: border-box;
}
.state-error {
  text-align: center;
  padding: 40px;
}
.layout {
  display: flex;
  gap: 16px;
  height: calc(100% - 16px);
}
.panel {
  flex: 1;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fff;
  overflow-y: auto;
  padding: 12px;
}
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.skeleton {
  color: #999;
  padding: 20px;
}
.empty {
  color: #999;
  padding: 40px;
  text-align: center;
}
.alert-list, .task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.alert-item, .task-item {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}
.alert-item:hover, .task-item:hover {
  background: #fafafa;
}
.severity-high {
  border-left: 4px solid #ff4d4f;
}
.severity-medium {
  border-left: 4px solid #faad14;
}
.severity-low {
  border-left: 4px solid #52c41a;
}
.severity-badge {
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
  color: #fff;
}
.severity-high .severity-badge {
  background: #ff4d4f;
}
.severity-medium .severity-badge {
  background: #faad14;
}
.severity-low .severity-badge {
  background: #52c41a;
}
.alert-meta, .task-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}
.alert-type {
  font-weight: bold;
}
.alert-time, .alert-vehicle, .task-vehicle, .task-driver {
  color: #666;
  font-size: 13px;
}
.alert-status, .task-status {
  margin-left: auto;
  font-size: 12px;
  color: #1890ff;
}
.task-progress {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}
.modal-overlay, .drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal, .drawer {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}
.drawer {
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  width: 450px;
  border-radius: 0;
  box-shadow: -2px 0 8px rgba(0,0,0,0.1);
}
.actions {
  margin: 12px 0;
  display: flex;
  gap: 8px;
}
textarea {
  width: 100%;
  min-height: 60px;
  margin: 8px 0;
}
.photos img {
  max-width: 100px;
  margin: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
}
button:hover {
  background: #f5f5f5;
}
</style>