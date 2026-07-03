<template>
  <div class="mobile-dispatch-view">
    <!-- 顶部告警与反馈滚动通知栏 -->
    <div class="alert-bar" @click="toggleAlertSection">
      <div class="alert-bar-title">
        <span class="alert-icon">🚨</span>
        <span>异常告警与反馈</span>
        <span class="badge" v-if="alerts.length">{{ alerts.length }}</span>
      </div>
      <div class="alert-bar-toggle">{{ alertSectionExpanded ? '收起' : '展开' }}</div>
    </div>
    <div v-if="alertSectionExpanded" class="alert-list">
      <div v-for="item in alerts" :key="item.alertId" class="alert-item" @click="onAlertClick(item)">
        <div class="alert-header">
          <span class="alert-type">{{ item.alertTypeLabel }}</span>
          <span class="alert-time">{{ item.time }}</span>
        </div>
        <div class="alert-body">
          <span>车牌：{{ item.plateNumber }}</span>
          <span>位置：{{ item.location }}</span>
        </div>
      </div>
    </div>

    <!-- 中央区域：地图/列表切换 -->
    <div class="view-area">
      <div class="view-switch">
        <button :class="{ active: currentView === 'map' }" @click="currentView = 'map'">🗺️ 地图</button>
        <button :class="{ active: currentView === 'list' }" @click="currentView = 'list'">📋 列表</button>
      </div>

      <!-- 地图视图占位（原型示意） -->
      <div v-if="currentView === 'map'" class="map-placeholder">
        <div v-if="uiState === 'loading'" class="loading-indicator">加载中...</div>
        <div v-else-if="uiState === 'error'" class="error-indicator">
          <p>数据加载失败</p>
          <button @click="loadData">重试</button>
        </div>
        <div v-else-if="uiState === 'empty'" class="empty-indicator">暂无周边车辆信息</div>
        <div v-else class="map-markers">
          <div v-for="v in nearbyVehicles" :key="v.vehicleId" class="map-marker" @click="onVehicleClick(v)">
            🚚 {{ v.plateNumber }}
          </div>
        </div>
      </div>

      <!-- 列表视图 -->
      <div v-if="currentView === 'list'" class="list-view">
        <div v-if="uiState === 'loading'" class="loading-indicator">加载中...</div>
        <div v-else-if="uiState === 'error'" class="error-indicator">
          <p>数据加载失败</p>
          <button @click="loadData">重试</button>
        </div>
        <div v-else-if="uiState === 'empty'" class="empty-indicator">暂无周边车辆信息</div>
        <div v-else class="vehicle-list">
          <div v-for="v in nearbyVehicles" :key="v.vehicleId" class="vehicle-card" @click="onVehicleClick(v)">
            <div class="card-header">
              <span class="plate">{{ v.plateNumber }}</span>
              <span class="distance">{{ v.distance }}km</span>
            </div>
            <div class="card-body">
              <span>司机：{{ v.driverName }}</span>
              <span>状态：{{ v.driverStatus }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部浮动操作栏 -->
    <div class="bottom-actions">
      <button class="action-btn" @click="openCommunication">💬 通讯</button>
      <button class="action-btn" @click="openQuickAdjust">⚡ 快速调整</button>
    </div>

    <!-- 即时通讯面板（从底部弹出） -->
    <div v-if="communicationVisible" class="communication-panel">
      <div class="panel-header">
        <span>即时通讯</span>
        <button @click="communicationVisible = false" class="close-btn">✕</button>
      </div>
      <div class="message-list">
        <div v-for="msg in messages" :key="msg.id" class="message-item">
          <div class="msg-sender">{{ msg.sender }}</div>
          <div class="msg-content">{{ msg.content }}</div>
          <div class="msg-time">{{ msg.time }}</div>
        </div>
      </div>
      <div class="message-input-area">
        <input v-model="newMessage" placeholder="输入消息" @keyup.enter="sendMessage" />
        <button @click="sendMessage">发送</button>
      </div>
    </div>

    <!-- 快速调整面板（简易弹出） -->
    <div v-if="adjustVisible" class="adjust-panel">
      <div class="panel-header">
        <span>任务调整</span>
        <button @click="adjustVisible = false" class="close-btn">✕</button>
      </div>
      <div class="adjust-options">
        <button @click="openAdjustForm('reassign')">改派</button>
        <button @click="openAdjustForm('cancel')">取消任务</button>
        <button @click="openAdjustForm('newTask')">新增临时任务</button>
      </div>
      <div v-if="adjustFormVisible" class="adjust-form">
        <div v-if="adjustType === 'reassign'">
          <label>选择新司机：</label>
          <input v-model="newDriver" placeholder="司机姓名或ID" />
          <label>原因：</label>
          <input v-model="adjustReason" placeholder="调整原因" />
        </div>
        <div v-if="adjustType === 'cancel'">
          <label>取消原因：</label>
          <input v-model="adjustReason" placeholder="取消原因" />
        </div>
        <div v-if="adjustType === 'newTask'">
          <label>作业点：</label>
          <input v-model="newTaskPoint" placeholder="作业点名称" />
          <label>预计时间：</label>
          <input v-model="newTaskTime" placeholder="例如 14:00" />
          <label>要求：</label>
          <input v-model="newTaskRequirement" placeholder="特殊要求" />
        </div>
        <button class="submit-btn" @click="submitAdjustment">提交</button>
      </div>
    </div>

    <!-- 详情弹窗：点击告警或车辆后显示 -->
    <div v-if="detailVisible" class="detail-overlay" @click.self="detailVisible = false">
      <div class="detail-panel">
        <div class="panel-header">
          <span>{{ detailTitle }}</span>
          <button @click="detailVisible = false" class="close-btn">✕</button>
        </div>
        <div class="detail-body">
          <div v-for="(val, key) in detailFields" :key="key" class="detail-field">
            <span class="field-label">{{ key }}：</span>
            <span class="field-value">{{ val }}</span>
          </div>
        </div>
        <div class="detail-actions">
          <button @click="openCommunicationFromDetail">通讯</button>
          <button @click="openAdjustFromDetail">调整</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, computed } from 'vue'
import { prototypeContract } from '../prototypeContract'
import { fetchAlertsData, alertsRecords } from '../data/mockAlerts'
import { fetchDispatchData, dispatchRecords } from '../data/mockDispatch'

// 注入角色上下文
const currentRoleKey = inject('currentRoleKey', 'dispatcher')
const currentRole = inject('currentRole', null)

// UI 状态
const uiState = ref('loading')
const alertSectionExpanded = ref(false)
const currentView = ref('map')
const communicationVisible = ref(false)
const adjustVisible = ref(false)
const adjustFormVisible = ref(false)
const adjustType = ref('')
const newMessage = ref('')
const messages = ref([])
const newDriver = ref('')
const adjustReason = ref('')
const newTaskPoint = ref('')
const newTaskTime = ref('')
const newTaskRequirement = ref('')
const detailVisible = ref(false)
const detailTitle = ref('')
const detailFields = ref({})
let currentAlertItem = null
let currentVehicleItem = null

// 数据
const alerts = ref([])
const nearbyVehicles = ref([])

// 根据角色调整数据获取行为（演示差异）
const roleSuffix = computed(() => {
  if (currentRoleKey.value === 'dispatcher') return 'dispatcher'
  if (currentRoleKey.value === 'manager') return 'manager'
  return 'default'
})

async function loadData() {
  uiState.value = 'loading'
  try {
    // 从 mock 读取告警数据
    const alertData = await fetchAlertsData()
    // 从 mock 读取调度数据（包含周边车辆）
    const dispatchData = await fetchDispatchData()

    // 映射告警列表
    const rawAlerts = alertData.alertsRecords || []
    alerts.value = rawAlerts.map(item => ({
      alertId: item.alertItem?.alertId || '',
      alertTypeLabel: item.alertItem?.alertType || '未知',
      plateNumber: item.alertItem?.plateNumber || '',
      time: item.alertItem?.alertTime || '',
      location: item.alertItem?.location || '未知位置',
      severity: item.alertItem?.severity || '',
      status: item.alertItem?.status || ''
    }))

    // 映射周边车辆
    const rawVehicles = dispatchData.dispatchRecords?.nearbyVehicles || []
    nearbyVehicles.value = rawVehicles.map(v => ({
      vehicleId: v.vehicleId || '',
      plateNumber: v.plateNumber || '',
      distance: v.distance || 0,
      driverName: v.driverName || '未知',
      driverStatus: v.driverStatus || '未知'
    }))

    if (alerts.value.length === 0 && nearbyVehicles.value.length === 0) {
      uiState.value = 'empty'
    } else {
      uiState.value = 'success'
    }
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(loadData)

// 交互函数
function toggleAlertSection() {
  alertSectionExpanded.value = !alertSectionExpanded.value
}

function onAlertClick(item) {
  currentAlertItem = item
  detailTitle.value = '告警详情'
  detailFields.value = {
    '告警类型': item.alertTypeLabel,
    '车牌号': item.plateNumber,
    '时间': item.time,
    '位置': item.location,
    '紧急程度': item.severity,
    '处理状态': item.status
  }
  detailVisible.value = true
}

function onVehicleClick(v) {
  currentVehicleItem = v
  detailTitle.value = '车辆信息'
  detailFields.value = {
    '车牌号': v.plateNumber,
    '距离': v.distance + 'km',
    '司机': v.driverName,
    '状态': v.driverStatus
  }
  detailVisible.value = true
}

function openCommunication() {
  communicationVisible.value = true
  // 如果有消息占位
  if (messages.value.length === 0) {
    messages.value.push({ id: 1, sender: '系统', content: '开始通讯', time: new Date().toLocaleTimeString() })
  }
}

function sendMessage() {
  if (!newMessage.value.trim()) return
  messages.value.push({
    id: Date.now(),
    sender: '我',
    content: newMessage.value,
    time: new Date().toLocaleTimeString()
  })
  newMessage.value = ''
}

function openQuickAdjust() {
  adjustVisible.value = !adjustVisible.value
  adjustFormVisible.value = false
}

function openAdjustForm(type) {
  adjustType.value = type
  adjustFormVisible.value = true
}

function submitAdjustment() {
  // 模拟提交
  const payload = { type: adjustType.value }
  if (adjustType.value === 'reassign') {
    payload.newDriver = newDriver.value
    payload.reason = adjustReason.value
  } else if (adjustType.value === 'cancel') {
    payload.reason = adjustReason.value
  } else if (adjustType.value === 'newTask') {
    payload.point = newTaskPoint.value
    payload.time = newTaskTime.value
    payload.requirement = newTaskRequirement.value
  }
  console.log('提交任务调整', payload)
  // 清空表单
  newDriver.value = ''
  adjustReason.value = ''
  newTaskPoint.value = ''
  newTaskTime.value = ''
  newTaskRequirement.value = ''
  adjustFormVisible.value = false
  adjustVisible.value = false
  alert('调整请求已提交')
}

function openCommunicationFromDetail() {
  detailVisible.value = false
  openCommunication()
}

function openAdjustFromDetail() {
  detailVisible.value = false
  adjustVisible.value = true
}
</script>

<style scoped>
.mobile-dispatch-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: #f2f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.alert-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #fff3e0;
  border-bottom: 1px solid #ffe0b2;
  cursor: pointer;
}

.alert-bar-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  font-size: 14px;
}

.alert-icon {
  font-size: 18px;
}

.badge {
  background: #e53935;
  color: white;
  border-radius: 10px;
  padding: 0 8px;
  font-size: 12px;
  line-height: 20px;
}

.alert-bar-toggle {
  font-size: 12px;
  color: #1565c0;
}

.alert-list {
  max-height: 180px;
  overflow-y: auto;
  background: #fff8e1;
  padding: 4px 0;
  border-bottom: 1px solid #ffe0b2;
}

.alert-item {
  padding: 8px 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  margin-bottom: 4px;
}

.alert-type {
  color: #d32f2f;
  font-weight: 500;
}

.alert-time {
  color: #888;
}

.alert-body {
  display: flex;
  gap: 12px;
  font-size: 12px;
  color: #555;
}

.view-area {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.view-switch {
  display: flex;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background: #fff;
  border-bottom: 1px solid #ddd;
}

.view-switch button {
  padding: 6px 20px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}

.view-switch button.active {
  background: #1976d2;
  color: #fff;
  border-color: #1976d2;
}

.map-placeholder, .list-view {
  padding: 8px;
}

.loading-indicator, .error-indicator, .empty-indicator {
  text-align: center;
  padding: 40px 16px;
  color: #888;
}

.error-indicator button {
  margin-top: 8px;
  padding: 6px 16px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.map-markers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  padding: 20px;
}

.map-marker {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.vehicle-card {
  background: #fff;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  margin-bottom: 4px;
}

.card-body {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #555;
}

.bottom-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px 16px;
  background: #fff;
  border-top: 1px solid #ddd;
}

.action-btn {
  flex: 1;
  margin: 0 8px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #1976d2;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}

.communication-panel, .adjust-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.15);
  max-height: 50vh;
  overflow-y: auto;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #888;
}

.message-list {
  flex: 1;
  padding: 12px 16px;
  overflow-y: auto;
  max-height: 30vh;
}

.message-item {
  margin-bottom: 10px;
}

.msg-sender {
  font-weight: 500;
  font-size: 12px;
  color: #1976d2;
}

.msg-content {
  background: #f1f1f1;
  padding: 6px 10px;
  border-radius: 8px;
  margin: 4px 0;
  font-size: 14px;
}

.msg-time {
  font-size: 11px;
  color: #aaa;
}

.message-input-area {
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid #ddd;
}

.message-input-area input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.message-input-area button {
  margin-left: 8px;
  padding: 8px 16px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.adjust-options {
  display: flex;
  justify-content: space-around;
  padding: 12px;
}

.adjust-options button {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
}

.adjust-form {
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

.adjust-form label {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #555;
}

.adjust-form input {
  width: 100%;
  padding: 6px 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.submit-btn {
  margin-top: 12px;
  padding: 8px 20px;
  background: #43a047;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.detail-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.detail-panel {
  background: #fff;
  border-radius: 12px;
  width: 80%;
  max-width: 360px;
  padding: 16px;
}

.detail-body {
  padding: 8px 0;
}

.detail-field {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.field-label {
  color: #888;
}

.field-value {
  font-weight: 500;
}

.detail-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.detail-actions button {
  flex: 1;
  padding: 8px;
  background: #1976d2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
</style>