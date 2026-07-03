<template>
  <div class="mobile-dispatch-view">
    <!-- 顶部告警与反馈滚动通知栏 -->
    <div class="alert-banner" v-if="alerts.length > 0" @click="toggleAlertBanner">
      <span class="banner-text">{{ alerts.length }} 条未读告警/反馈</span>
      <span class="collapse-icon">{{ alertBannerExpanded ? '▲' : '▼' }}</span>
    </div>
    <transition name="slide">
      <div v-if="alertBannerExpanded" class="alert-list">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          class="alert-item"
          @click="onAlertClick(alert)"
        >
          <span class="alert-type" :class="alert.urgency">{{ alert.type }}</span>
          <span class="alert-msg">{{ alert.message }}</span>
        </div>
      </div>
    </transition>

    <!-- 中央区域：地图/列表视图 -->
    <div class="main-content">
      <!-- 加载状态 -->
      <div v-if="loading" class="status-container">
        <div class="loading-spinner"></div>
        <p>正在获取数据...</p>
      </div>
      <!-- 空状态 -->
      <div v-else-if="empty" class="status-container">
        <p class="empty-icon">📭</p>
        <p>暂无告警和周边车辆</p>
      </div>
      <!-- 错误状态 -->
      <div v-else-if="error" class="status-container">
        <p class="error-icon">⚠️</p>
        <p>{{ errorMessage }}</p>
        <button @click="retryLoad" class="retry-btn">重试</button>
      </div>
      <!-- 正常视图 -->
      <template v-else>
        <div class="view-toggle">
          <button
            :class="{ active: viewMode === 'map' }"
            @click="viewMode = 'map'"
          >
            🗺️ 地图
          </button>
          <button
            :class="{ active: viewMode === 'list' }"
            @click="viewMode = 'list'"
          >
            📋 列表
          </button>
        </div>
        <!-- 地图视图（占位） -->
        <div v-if="viewMode === 'map'" class="map-placeholder">
          <p>地图组件占位（集成地图SDK后实现）</p>
          <div
            v-for="vehicle in nearbyVehicles"
            :key="vehicle.id"
            class="vehicle-marker"
            @click="onVehicleClick(vehicle)"
          >
            🚗 {{ vehicle.plate }}
          </div>
        </div>
        <!-- 列表视图 -->
        <div v-else class="vehicle-list">
          <div
            v-for="vehicle in nearbyVehicles"
            :key="vehicle.id"
            class="vehicle-item"
            @click="onVehicleClick(vehicle)"
          >
            <span class="plate">{{ vehicle.plate }}</span>
            <span class="distance">{{ vehicle.distance }}km</span>
            <span class="status">{{ vehicle.status }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 底部浮动操作栏 -->
    <div class="bottom-bar">
      <button class="action-btn" @click="openChat">💬 通讯</button>
      <div class="quick-actions">
        <button @click="quickAdjust('transfer')">改派</button>
        <button @click="quickAdjust('cancel')">取消</button>
        <button @click="quickAdjust('newTask')">新增临时任务</button>
      </div>
    </div>

    <!-- 即时通讯面板（从底部弹出） -->
    <transition name="slide-up">
      <div v-if="chatVisible" class="chat-panel">
        <div class="chat-header">
          <span>与 {{ chatTarget?.driverName || '司机' }} 的对话</span>
          <button @click="chatVisible = false">✕</button>
        </div>
        <div class="chat-messages">
          <div
            v-for="msg in chatMessages"
            :key="msg.id"
            class="message"
            :class="{ mine: msg.isMine }"
          >
            <p>{{ msg.text }}</p>
            <span class="time">{{ msg.time }}</span>
          </div>
        </div>
        <div class="chat-input">
          <input
            v-model="chatInput"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
          />
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </transition>

    <!-- 告警快捷操作菜单（使用通用DetailPanel） -->
    <DetailPanel
      v-if="selectedAlert"
      :visible="!!selectedAlert"
      mode="modal"
      :title="'告警：' + selectedAlert.type"
      @close="selectedAlert = null"
    >
      <template #default>
        <p>{{ selectedAlert.message }}</p>
        <div class="alert-actions">
          <button @click="viewVehicleDetail(selectedAlert.vehicleId)">查看车辆</button>
          <button @click="startChat(selectedAlert.vehicleId)">通讯</button>
          <button @click="transferTask(selectedAlert.vehicleId)">转派任务</button>
        </div>
      </template>
    </DetailPanel>

    <!-- 车辆信息卡片（使用通用DetailPanel） -->
    <DetailPanel
      v-if="selectedVehicle"
      :visible="!!selectedVehicle"
      mode="drawer"
      :title="'车辆：' + selectedVehicle.plate"
      @close="selectedVehicle = null"
    >
      <template #default>
        <p>司机：{{ selectedVehicle.driverName }}</p>
        <p>联系方式：{{ selectedVehicle.driverPhone }}</p>
        <p>当前任务：{{ selectedVehicle.currentTask }}</p>
        <div class="vehicle-actions">
          <button @click="startChat(selectedVehicle.id)">通讯</button>
          <button @click="transferTask(selectedVehicle.id)">改派</button>
          <button @click="cancelTask(selectedVehicle.id)">取消任务</button>
        </div>
      </template>
    </DetailPanel>

    <!-- 确认对话框（取消任务/操作确认） -->
    <ConfirmDialog
      :visible="confirmVisible"
      :title="confirmTitle"
      :content="confirmContent"
      @confirm="onConfirm"
      @cancel="confirmVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DetailPanel from '@/components/DetailPanel.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
import { mockAlerts, mockDispatch } from '@/data/mockDispatch'

// 状态
const loading = ref(true)
const error = ref(false)
const errorMessage = ref('')
const empty = ref(false)

const alerts = ref([])
const nearbyVehicles = ref([])
const viewMode = ref('map') // 'map' | 'list'
const alertBannerExpanded = ref(false)

const selectedAlert = ref(null)
const selectedVehicle = ref(null)

const chatVisible = ref(false)
const chatTarget = ref(null)
const chatMessages = ref([])
const chatInput = ref('')

const confirmVisible = ref(false)
const confirmTitle = ref('')
const confirmContent = ref('')
let confirmAction = null

// 加载数据
async function loadData() {
  loading.value = true
  error.value = false
  empty.value = false
  try {
    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500))
    // 使用mock数据
    alerts.value = mockAlerts || []
    nearbyVehicles.value = mockDispatch?.nearbyVehicles || []
    if (alerts.value.length === 0 && nearbyVehicles.value.length === 0) {
      empty.value = true
    }
  } catch (e) {
    error.value = true
    errorMessage.value = '数据加载失败，请检查网络'
  } finally {
    loading.value = false
  }
}

function retryLoad() {
  loadData()
}

onMounted(() => {
  loadData()
})

// 交互
function toggleAlertBanner() {
  alertBannerExpanded.value = !alertBannerExpanded.value
}

function onAlertClick(alert) {
  selectedAlert.value = alert
}

function onVehicleClick(vehicle) {
  selectedVehicle.value = vehicle
}

function openChat() {
  chatVisible.value = !chatVisible.value
  if (chatVisible.value && !chatTarget.value) {
    // 默认选择第一个车辆司机通讯
    chatTarget.value = nearbyVehicles.value[0] || null
    if (chatTarget.value) {
      chatMessages.value = [
        { id: 1, text: '您好，有什么可以帮您？', isMine: false, time: '10:00' }
      ]
    }
  }
}

function startChat(vehicleId) {
  const vehicle = nearbyVehicles.value.find(v => v.id === vehicleId)
  if (vehicle) {
    chatTarget.value = vehicle
    chatVisible.value = true
    chatMessages.value = [
      { id: 1, text: '您好，有什么可以帮您？', isMine: false, time: '10:00' }
    ]
  }
}

function sendMessage() {
  if (!chatInput.value.trim()) return
  const msg = {
    id: Date.now(),
    text: chatInput.value,
    isMine: true,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  chatMessages.value.push(msg)
  chatInput.value = ''
}

function viewVehicleDetail(vehicleId) {
  const vehicle = nearbyVehicles.value.find(v => v.id === vehicleId)
  if (vehicle) {
    selectedVehicle.value = vehicle
  }
  selectedAlert.value = null
}

function transferTask(vehicleId) {
  // 弹出改派表单（简化：使用确认对话框模拟）
  confirmTitle.value = '改派任务'
  confirmContent.value = '确定要将该车辆的任务改派给其他司机吗？'
  confirmAction = () => {
    // 实际调用改派API
    alert('改派请求已发送')
    confirmVisible.value = false
  }
  confirmVisible.value = true
}

function cancelTask(vehicleId) {
  confirmTitle.value = '取消任务'
  confirmContent.value = '确定要取消该车辆当前任务吗？取消后司机将收到通知。'
  confirmAction = () => {
    // 实际调用取消API
    alert('任务已取消，已通知司机')
    confirmVisible.value = false
  }
  confirmVisible.value = true
}

function quickAdjust(type) {
  switch (type) {
    case 'transfer':
      transferTask(null)
      break
    case 'cancel':
      cancelTask(null)
      break
    case 'newTask':
      // 新增临时任务（简化）
      alert('打开新增临时任务表单')
      break
  }
}

function onConfirm() {
  if (confirmAction) confirmAction()
}
</script>

<style scoped>
.mobile-dispatch-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f5f5;
  font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif;
}

/* 顶部告警横幅 */
.alert-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #ff4d4f;
  color: white;
  cursor: pointer;
  font-size: 14px;
}
.banner-text {
  font-weight: 500;
}
.collapse-icon {
  font-size: 12px;
}

.alert-list {
  max-height: 200px;
  overflow-y: auto;
  background: #fffbe6;
  border-bottom: 1px solid #f0f0f0;
}
.alert-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background 0.2s;
}
.alert-item:hover {
  background: #fff1b8;
}
.alert-type {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  color: white;
  background: #faad14;
}
.alert-type.urgent {
  background: #ff4d4f;
}
.alert-type.info {
  background: #1890ff;
}

.slide-enter-active, .slide-leave-active {
  transition: max-height 0.3s ease;
}
.slide-enter, .slide-leave-to {
  max-height: 0;
  overflow: hidden;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  position: relative;
}

.status-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e8e8e8;
  border-top-color: #1890ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.empty-icon, .error-icon {
  font-size: 48px;
  margin-bottom: 8px;
}
.retry-btn {
  margin-top: 12px;
  padding: 8px 24px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.view-toggle {
  display: flex;
  justify-content: center;
  margin: 12px 0;
}
.view-toggle button {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}
.view-toggle button:first-child {
  border-radius: 4px 0 0 4px;
}
.view-toggle button:last-child {
  border-radius: 0 4px 4px 0;
  border-left: none;
}
.view-toggle button.active {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.map-placeholder {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
}
.vehicle-marker {
  display: inline-block;
  padding: 4px 8px;
  background: white;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin: 8px;
  cursor: pointer;
}

.vehicle-list {
  padding: 8px 16px;
}
.vehicle-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  margin-bottom: 8px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.vehicle-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.plate {
  font-weight: 500;
}
.distance {
  color: #666;
  font-size: 13px;
}
.status {
  color: #52c41a;
  font-size: 13px;
}

.bottom-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
  box-shadow: 0 -2px 4px rgba(0,0,0,0.06);
}
.action-btn {
  padding: 8px 20px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 12px;
}
.quick-actions button {
  padding: 6px 12px;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  margin-right: 8px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}
.quick-actions button:hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* 即时通讯面板 */
.chat-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50vh;
  background: white;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
  display: flex;
  flex-direction: column;
  z-index: 1000;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f0f0f0;
  border-bottom: 1px solid #e8e8e8;
}
.chat-header button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}
.message {
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}
.message.mine {
  align-items: flex-end;
}
.message p {
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 8px;
  background: #e8f4ff;
  margin: 0;
}
.message.mine p {
  background: #1890ff;
  color: white;
}
.time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
}
.chat-input {
  display: flex;
  padding: 8px 16px;
  border-top: 1px solid #e8e8e8;
}
.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  outline: none;
}
.chat-input button {
  margin-left: 8px;
  padding: 8px 16px;
  background: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: transform 0.3s ease;
}
.slide-up-enter, .slide-up-leave-to {
  transform: translateY(100%);
}

/* 告警操作和车辆操作按钮通用 */
.alert-actions, .vehicle-actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
.alert-actions button, .vehicle-actions button {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}
.alert-actions button:hover, .vehicle-actions button:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>
