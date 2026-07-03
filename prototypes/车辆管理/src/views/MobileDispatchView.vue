<template>
  <div class="mobile-dispatch-view">
    <!-- 顶部告警与反馈滚动通知栏 -->
    <div class="alert-banner" v-if="alerts.length > 0">
      <div class="banner-scroll">
        <span v-for="item in alerts" :key="item.alertId" class="alert-chip" :class="{ urgent: item.urgency === 'high' }" @click="onAlertClick(item)">
          {{ item.type }}: {{ item.vehiclePlate }} - {{ item.time }}
        </span>
      </div>
    </div>

    <!-- 中央车辆地图/列表视图 -->
    <div class="main-content">
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'map' }" @click="viewMode = 'map'">地图</button>
        <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">列表</button>
      </div>

      <!-- 加载状态 -->
      <div v-if="state === 'loading'" class="state-placeholder">加载中...</div>
      <!-- 空状态 -->
      <div v-else-if="state === 'empty'" class="state-placeholder">暂无告警及周边车辆</div>
      <!-- 错误状态 -->
      <div v-else-if="state === 'error'" class="state-placeholder error">数据获取失败，<button @click="loadData">重试</button></div>
      <!-- 成功状态 -->
      <div v-else class="view-container">
        <div v-if="viewMode === 'map'" class="map-placeholder">地图区域（展示周边车辆位置）</div>
        <div v-else class="vehicle-list">
          <div v-for="v in nearbyVehicles" :key="v.vehicleId" class="vehicle-card" @click="onVehicleClick(v)">
            <div class="card-title">{{ v.plateNumber }} - {{ v.driverName }}</div>
            <div class="card-info">
              <span>状态: {{ v.driverStatus }}</span>
              <span>距离: {{ v.distance }}km</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部浮动操作栏 -->
    <div class="bottom-actions">
      <button class="action-btn" @click="openChat">💬 通讯</button>
      <button class="action-btn" @click="quickAdjust">⚡ 快速调整</button>
    </div>

    <!-- 即时通讯面板（从底部弹出） -->
    <div v-if="chatVisible" class="chat-panel" @click.self="chatVisible = false">
      <div class="chat-content">
        <div class="chat-header">
          <span>即时通讯 - 调度员</span>
          <button @click="chatVisible = false">✕</button>
        </div>
        <div class="chat-messages">
          <div v-for="(msg, idx) in chatMessages" :key="idx" class="message-item">
            <span class="sender">{{ msg.from }}:</span>
            <span class="text">{{ msg.text }}</span>
            <span class="status">{{ msg.status }}</span>
          </div>
        </div>
        <div class="chat-input">
          <input v-model="chatInput" placeholder="输入消息..." @keyup.enter="sendMessage" />
          <button @click="sendMessage">发送</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import prototypeContract from '../prototypeContract.js'

const context = inject('prototypeContext')
const currentRole = context?.currentRole || { key: 'dispatcher', label: '调度员' }
const currentRoleKey = context?.currentRoleKey || 'dispatcher'

// 状态管理
const state = ref('loading')
const viewMode = ref('map')
const alerts = ref([])
const nearbyVehicles = ref([])
const chatVisible = ref(false)
const chatMessages = reactive([
  { from: '司机-李师傅', text: '已到达作业点', status: '已送达' },
  { from: '调度员-王敏', text: '收到，请等待指令', status: '已送达' }
])
const chatInput = ref('')

// 根据角色调整默认筛选（示例）
const roleFilter = computed(() => {
  if (currentRoleKey === 'dispatcher') {
    return { urgency: 'all' }
  } else if (currentRoleKey === 'manager') {
    return { urgency: 'high' }
  }
  return {}
})

// 加载数据
async function loadData() {
  state.value = 'loading'
  try {
    const mockDispatch = await import('../data/mockDispatch.js')
    const dispatchData = mockDispatch.fetchDispatchData()
    // 从 dispatchData 提取 nearbyVehicles 和 mobileAlert
    nearbyVehicles.value = dispatchData.nearbyVehicles || []

    const mockAlerts = await import('../data/mockAlerts.js')
    const alertsData = mockAlerts.fetchAlertsData()
    alerts.value = alertsData.alertsRecords || []

    // 模拟角色筛选
    if (roleFilter.value.urgency === 'high') {
      alerts.value = alerts.value.filter(a => a.urgency === 'high')
    }

    if (alerts.value.length === 0 && nearbyVehicles.value.length === 0) {
      state.value = 'empty'
    } else {
      state.value = 'success'
    }
  } catch (e) {
    state.value = 'error'
    console.error('数据加载失败', e)
  }
}

// 告警点击
function onAlertClick(alert) {
  console.log('告警点击', alert)
  // 弹出快捷操作菜单（原型演示：alert）
  alert('告警操作菜单（查看车辆详情、发起通讯、转派任务）')
}

// 车辆点击
function onVehicleClick(vehicle) {
  console.log('车辆点击', vehicle)
  alert(`车辆信息: ${vehicle.plateNumber} 司机: ${vehicle.driverName}`)
}

// 打开通讯面板
function openChat() {
  chatVisible.value = true
}

// 发送消息
function sendMessage() {
  if (!chatInput.value.trim()) return
  chatMessages.push({
    from: '调度员-王敏',
    text: chatInput.value,
    status: '发送中'
  })
  // 模拟发送后状态更新
  setTimeout(() => {
    const last = chatMessages[chatMessages.length - 1]
    if (last) last.status = '已送达'
  }, 500)
  chatInput.value = ''
}

// 快速调整
function quickAdjust() {
  alert('快速调整：改派/取消/新增临时任务')
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.mobile-dispatch-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  font-family: sans-serif;
}
.alert-banner {
  background: #fff3cd;
  padding: 8px 12px;
  overflow: hidden;
  white-space: nowrap;
}
.banner-scroll {
  display: inline-block;
  animation: scroll 20s linear infinite;
}
@keyframes scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
.alert-chip {
  display: inline-block;
  background: #ffeeba;
  padding: 4px 8px;
  border-radius: 12px;
  margin-right: 12px;
  cursor: pointer;
  font-size: 13px;
}
.alert-chip.urgent {
  background: #f8d7da;
  color: #721c24;
}
.main-content {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}
.view-toggle {
  text-align: right;
  margin-bottom: 8px;
}
.view-toggle button {
  margin-left: 4px;
  padding: 4px 12px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.view-toggle button.active {
  background: #007bff;
  color: #fff;
}
.state-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #888;
}
.state-placeholder.error {
  color: red;
}
.map-placeholder {
  background: #e9ecef;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: #666;
}
.vehicle-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.vehicle-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px;
  cursor: pointer;
  background: #fff;
}
.vehicle-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card-title {
  font-weight: bold;
  margin-bottom: 4px;
}
.card-info {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #555;
}
.bottom-actions {
  display: flex;
  justify-content: space-around;
  padding: 12px;
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}
.action-btn {
  padding: 8px 24px;
  border: none;
  border-radius: 20px;
  background: #007bff;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
}
.chat-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: flex-end;
  height: 100vh;
}
.chat-content {
  background: #fff;
  width: 100%;
  max-height: 70vh;
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
}
.chat-header {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
}
.message-item {
  margin-bottom: 8px;
  font-size: 14px;
}
.sender { font-weight: bold; margin-right: 8px; }
.status { font-size: 12px; color: #999; margin-left: 8px; }
.chat-input {
  display: flex;
  padding: 8px;
  border-top: 1px solid #ddd;
}
.chat-input input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chat-input button {
  margin-left: 8px;
  padding: 8px 16px;
  background: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>