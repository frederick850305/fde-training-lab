<template>
  <div class="mobile-dispatch">
    <div v-if="loading" class="loading-state"><div class="skeleton" v-for="n in 3" :key="n" style="height:80px;margin-bottom:10px;border-radius:10px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else>
      <!-- 告警通知栏 -->
      <div class="alert-bar" :class="{ expanded: alertExpanded }">
        <div class="alert-bar-header" @click="alertExpanded = !alertExpanded">
          <span>🚨 {{ alertList.length }} 条告警 · {{ feedbackList.length }} 条反馈</span>
          <span>{{ alertExpanded ? '▴' : '▾' }}</span>
        </div>
        <div v-if="alertExpanded" class="alert-bar-body">
          <div v-for="a in alertList" :key="a.alertId" class="mini-alert" @click="handleAlertClick(a)">
            <StatusTag :status="a.urgency === '高' ? '异常' : '待处理'" size="small" />
            <span>{{ a.alertType }} · {{ a.plate }}</span>
            <small>{{ a.alertTime }}</small>
          </div>
        </div>
      </div>

      <!-- 视图切换 + 车辆视图 -->
      <div class="view-toggle">
        <button :class="{ active: viewMode === 'map' }" @click="viewMode = 'map'">🗺️ 地图</button>
        <button :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">📋 列表</button>
      </div>

      <div v-if="viewMode === 'map'" class="map-view">
        <div class="map-sim">
          <div v-for="v in vehicles" :key="v.vehicleId" class="map-dot" :style="{ left: (20 + Math.random() * 60) + '%', top: (20 + Math.random() * 60) + '%' }" @click="selectVehicle(v)">🚛 {{ v.plate }}</div>
        </div>
      </div>
      <div v-else class="list-view">
        <div v-for="v in vehicles" :key="v.vehicleId" class="vehicle-row" @click="selectVehicle(v)">
          <div><strong>{{ v.plate }}</strong><small>{{ v.currentLocation }}</small></div>
          <StatusTag :status="v.onlineStatus" />
        </div>
      </div>
    </template>

    <!-- 车辆信息卡片 -->
    <DetailPanel :visible="!!selectedVehicle" title="车辆信息" @close="selectedVehicle = null">
      <template v-if="selectedVehicle">
        <div class="detail-section">
          <p><strong>车牌：</strong>{{ selectedVehicle.plate }}</p>
          <p><strong>司机：</strong>{{ selectedVehicle.driver }}</p>
          <p><strong>电话：</strong><a href="javascript:void(0)" @click="callPhone(selectedVehicle.driverPhone)">{{ selectedVehicle.driverPhone }}</a></p>
          <p><strong>位置：</strong>{{ selectedVehicle.currentLocation }}</p>
          <p><strong>状态：</strong><StatusTag :status="selectedVehicle.onlineStatus" /></p>
        </div>
        <div class="btn-stack">
          <button @click="reassignTask">🔄 改派任务</button>
          <button class="danger" @click="cancelTask">❌ 取消任务</button>
          <button @click="addTempTask">➕ 新增临时任务</button>
        </div>
      </template>
    </DetailPanel>

    <!-- 即时通讯面板 -->
    <div v-if="showChat" class="chat-panel">
      <div class="chat-header"><strong>💬 即时通讯</strong><button @click="showChat = false">✕</button></div>
      <div class="chat-messages"><div v-for="(msg, i) in chatMessages" :key="i" class="chat-msg" :class="{ mine: msg.mine }">{{ msg.text }}</div></div>
      <div class="chat-input"><input v-model="chatInput" placeholder="输入消息..." @keyup.enter="sendMsg" /><button @click="sendMsg">发送</button></div>
    </div>

    <!-- 底部操作栏 -->
    <div class="bottom-bar">
      <button @click="showChat = !showChat">💬 通讯</button>
      <button @click="addTempTask">➕ 快速调整</button>
      <button @click="loadData">🔄 刷新</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchDispatchData } from '../data/mockDispatch.js'
import { fetchAlertData } from '../data/mockAlerts.js'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'

const loading = ref(true)
const error = ref('')
const vehicles = ref([])
const alertList = ref([])
const feedbackList = ref([])
const alertExpanded = ref(true)
const viewMode = ref('map')
const selectedVehicle = ref(null)
const showChat = ref(false)
const chatInput = ref('')
const chatMessages = ref([{ text: '你好，有什么需要帮助？', mine: false }])

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const [dispatchData, alertData] = await Promise.all([fetchDispatchData(), fetchAlertData()])
    vehicles.value = dispatchData.vehicles || []
    alertList.value = alertData.alerts || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function selectVehicle(v) { selectedVehicle.value = v }
function handleAlertClick(a) { alert(`告警详情：${a.alertType} - ${a.plate}`) }
function callPhone(phone) { window.open('tel:' + phone) }
function reassignTask() { alert('打开改派表单...'); selectedVehicle.value = null }
function cancelTask() { if (confirm('确定取消任务？')) { alert('任务已取消'); selectedVehicle.value = null } }
function addTempTask() { alert('打开新增临时任务表单...') }
function sendMsg() {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({ text: chatInput.value, mine: true })
  chatInput.value = ''
  setTimeout(() => chatMessages.value.push({ text: '收到，正在处理...', mine: false }), 800)
}

onMounted(loadData)
</script>

<style scoped>
.mobile-dispatch { padding: 16px; height: 100%; display: flex; flex-direction: column; gap: 12px; max-width: 500px; margin: 0 auto; }
.alert-bar { background: #fff; border: 1px solid #ffcc80; border-radius: 10px; overflow: hidden; }
.alert-bar-header { display: flex; justify-content: space-between; padding: 10px 14px; cursor: pointer; font-size: 13px; font-weight: 700; background: #fff3e0; }
.alert-bar-body { padding: 8px 14px; max-height: 180px; overflow-y: auto; }
.mini-alert { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; cursor: pointer; font-size: 12px; }
.mini-alert small { color: #94a3b8; margin-left: auto; }
.view-toggle { display: flex; gap: 8px; }
.view-toggle button { flex: 1; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; font-size: 13px; cursor: pointer; }
.view-toggle button.active { background: #1a56db; color: #fff; border-color: #1a56db; }
.map-view { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; min-height: 200px; }
.map-sim { position: relative; height: 100%; background: linear-gradient(135deg, #e8f4e8, #e6f0ff); border-radius: 12px; }
.map-dot { position: absolute; transform: translate(-50%,-50%); background: #fff; padding: 4px 8px; border-radius: 6px; font-size: 11px; box-shadow: 0 2px 8px rgba(0,0,0,.1); cursor: pointer; }
.list-view { flex: 1; background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 12px; overflow-y: auto; }
.vehicle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.vehicle-row strong { font-size: 13px; margin-right: 8px; }
.vehicle-row small { font-size: 11px; color: #94a3b8; }
.chat-panel { position: fixed; bottom: 70px; left: 16px; right: 16px; max-width: 468px; margin: 0 auto; background: #fff; border-radius: 14px; box-shadow: 0 -4px 20px rgba(0,0,0,.15); z-index: 100; display: flex; flex-direction: column; max-height: 350px; }
.chat-header { display: flex; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid #e2e8f0; }
.chat-messages { flex:1; padding: 10px; overflow-y: auto; max-height: 220px; display: grid; gap: 8px; }
.chat-msg { padding: 8px 12px; border-radius: 10px; background: #f1f5f9; font-size: 12px; max-width: 80%; }
.chat-msg.mine { background: #1a56db; color: #fff; justify-self: end; }
.chat-input { display: flex; gap: 8px; padding: 8px 14px; border-top: 1px solid #e2e8f0; }
.chat-input input { flex: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 12px; }
.chat-input button { padding: 6px 14px; background: #1a56db; color: #fff; border: none; border-radius: 8px; font-size: 12px; }
.bottom-bar { display: flex; gap: 8px; }
.bottom-bar button { flex: 1; padding: 10px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; font-size: 13px; cursor: pointer; }
.detail-section p { margin: 6px 0; font-size: 13px; }
.detail-section a { color: #1a56db; text-decoration: none; }
.btn-stack { display: grid; gap: 8px; margin-top: 12px; }
.btn-stack button { padding: 10px; border: none; border-radius: 8px; background: #e6f0ff; color: #1a56db; font-size: 13px; cursor: pointer; }
.btn-stack button.danger { background: #ffeaea; color: #c62828; }
.loading-state { padding: 20px; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
</style>
