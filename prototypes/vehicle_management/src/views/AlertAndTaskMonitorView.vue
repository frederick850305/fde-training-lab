<template>
  <div class="alert-monitor">
    <div v-if="loading" class="loading-state">
      <div class="skeleton sk-row" v-for="n in 4" :key="n"></div>
    </div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else>
      <div class="split-layout">
        <!-- 告警列表 -->
        <div class="alert-zone">
          <div class="zone-header">
            <h3>🚨 实时告警</h3>
            <select v-model="alertFilter" @change="applyFilter">
              <option value="">全部状态</option>
              <option value="待处理">待处理</option>
              <option value="处理中">处理中</option>
              <option value="已处理">已处理</option>
              <option value="已忽略">已忽略</option>
            </select>
          </div>
          <div v-if="filteredAlerts.length === 0" class="empty-hint">暂无告警</div>
          <div v-for="a in filteredAlerts" :key="a.alertId" class="alert-item" :class="'urgency-' + a.urgency" @click="openAlertDetail(a)">
            <StatusTag :status="a.status" />
            <div class="alert-body">
              <strong>{{ a.alertType }} · {{ a.plate }}</strong>
              <small>{{ a.alertTime }} · {{ a.vehicleId }}</small>
            </div>
            <span class="urgency-badge" :class="'u-' + a.urgency">{{ a.urgency }}</span>
          </div>
        </div>

        <!-- 任务列表 -->
        <div class="task-zone">
          <div class="zone-header">
            <h3>📋 任务监控</h3>
            <select v-model="taskFilter" @change="applyFilter">
              <option value="">全部状态</option>
              <option value="待接单">待接单</option>
              <option value="进行中">进行中</option>
              <option value="已完成">已完成</option>
            </select>
          </div>
          <div v-if="filteredTasks.length === 0" class="empty-hint">暂无任务</div>
          <div v-for="t in filteredTasks" :key="t.taskId" class="task-item" @click="openTaskDetail(t)">
            <StatusTag :status="t.taskStatus" />
            <div class="task-body">
              <strong>{{ t.taskId }}</strong>
              <small>{{ t.driver }} · {{ t.plate }}</small>
            </div>
            <span class="phase-text">{{ t.currentPhase }}</span>
          </div>
        </div>
      </div>
    </template>

    <!-- 告警详情弹窗 -->
    <DetailPanel :visible="!!alertDetail" title="告警详情" @close="alertDetail = null">
      <template v-if="alertDetail">
        <div class="detail-section">
          <p><strong>类型：</strong>{{ alertDetail.alertType }}</p>
          <p><strong>车辆：</strong>{{ alertDetail.plate }}（{{ alertDetail.vehicleId }}）</p>
          <p><strong>时间：</strong>{{ alertDetail.alertTime }}</p>
          <p><strong>紧急程度：</strong><span :class="'u-' + alertDetail.urgency">{{ alertDetail.urgency }}</span></p>
        </div>
        <textarea v-model="handleNote" placeholder="输入处理备注..." rows="3" style="width:100%;border:1px solid #cbd5e1;border-radius:8px;padding:8px;margin:12px 0"></textarea>
        <div class="btn-row">
          <button class="btn-confirm" @click="handleAlert('确认')">✅ 确认</button>
          <button class="btn-ignore" @click="handleAlert('忽略')">🔕 忽略</button>
          <button class="btn-transfer" @click="handleAlert('转人工')">👤 转人工</button>
        </div>
      </template>
    </DetailPanel>

    <!-- 任务详情抽屉 -->
    <DetailPanel :visible="!!taskDetail" title="任务详情" @close="taskDetail = null">
      <template v-if="taskDetail">
        <div class="detail-section">
          <p><strong>任务ID：</strong>{{ taskDetail.taskId }}</p>
          <p><strong>车辆：</strong>{{ taskDetail.plate }}</p>
          <p><strong>司机：</strong>{{ taskDetail.driver }}</p>
          <p><strong>状态：</strong><StatusTag :status="taskDetail.taskStatus" /></p>
          <p><strong>当前阶段：</strong>{{ taskDetail.currentPhase }}</p>
          <p><strong>预计完成：</strong>{{ taskDetail.estimatedComplete }}</p>
        </div>
        <div class="btn-row">
          <button class="btn-remind" @click="handleTask('催办')">📢 催办</button>
          <ConfirmDialog :visible="showCancelConfirm" title="取消任务" content="确定取消此任务？请填写取消原因" @confirm="handleTask('取消')" @cancel="showCancelConfirm = false" />
          <button class="btn-cancel" @click="showCancelConfirm = true">❌ 取消任务</button>
        </div>
      </template>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { fetchAlertData } from '../data/mockAlerts.js'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const loading = ref(true)
const error = ref('')
const alerts = ref([])
const tasks = ref([])
const alertFilter = ref('')
const taskFilter = ref('')
const alertDetail = ref(null)
const taskDetail = ref(null)
const handleNote = ref('')
const showCancelConfirm = ref(false)

const filteredAlerts = computed(() => {
  if (!alertFilter.value) return alerts.value
  return alerts.value.filter(a => a.status === alertFilter.value)
})
const filteredTasks = computed(() => {
  if (!taskFilter.value) return tasks.value
  return tasks.value.filter(t => t.taskStatus === taskFilter.value)
})

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchAlertData()
    alerts.value = data.alerts || []
    tasks.value = data.tasks || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function openAlertDetail(a) { alertDetail.value = a; handleNote.value = a.handleNote || '' }
function openTaskDetail(t) { taskDetail.value = t }
function applyFilter() {}

function handleAlert(action) {
  const updated = { ...alertDetail.value, status: action === '确认' ? '已处理' : action === '忽略' ? '已忽略' : '处理中', handleNote: handleNote.value }
  const idx = alerts.value.findIndex(a => a.alertId === updated.alertId)
  if (idx >= 0) alerts.value[idx] = updated
  alertDetail.value = null
  alert(`告警${action}成功`)
}
function handleTask(action) {
  if (action === '取消') {
    const idx = tasks.value.findIndex(t => t.taskId === taskDetail.value.taskId)
    if (idx >= 0) tasks.value[idx] = { ...tasks.value[idx], taskStatus: '已取消', currentPhase: '已取消' }
    showCancelConfirm.value = false
    alert('任务已取消')
  } else {
    alert('已发送催办通知')
  }
}

onMounted(loadData)
</script>

<style scoped>
.alert-monitor { height: 100%; padding: 16px; }
.split-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; height: calc(100vh - 80px); }
.alert-zone, .task-zone { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden; }
.zone-header { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-bottom: 1px solid #e2e8f0; }
.zone-header h3 { margin: 0; font-size: 14px; }
.zone-header select { padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; }
.alert-item, .task-item { display: flex; align-items: center; gap: 10px; padding: 10px 16px; border-bottom: 1px solid #f1f5f9; cursor: pointer; }
.alert-item:hover, .task-item:hover { background: #f8fafc; }
.alert-body, .task-body { flex: 1; display: grid; }
.alert-body strong, .task-body strong { font-size: 13px; }
.alert-body small, .task-body small { font-size: 11px; color: #64748b; }
.urgency-badge { padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: 700; }
.u-高 { background: #ffeaea; color: #c62828; }
.u-中 { background: #fff3e0; color: #d84315; }
.u-低 { background: #f1f5f9; color: #475569; }
.urgency-高 { border-left: 3px solid #c62828; }
.phase-text { font-size: 11px; color: #94a3b8; }
.detail-section p { margin: 6px 0; font-size: 13px; }
.detail-section strong { color: #475569; margin-right: 8px; }
.btn-row { display: flex; gap: 8px; margin-top: 12px; }
.btn-row button { flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; font-weight: 600; }
.btn-confirm { background: #e6f7e6; color: #1a7a1a; }
.btn-ignore { background: #f1f5f9; color: #475569; }
.btn-transfer { background: #e6f0ff; color: #1a56db; }
.btn-remind { background: #fff3e0; color: #d84315; }
.btn-cancel { background: #ffeaea; color: #c62828; }
.loading-state { padding: 40px; }
.sk-row { height: 56px; margin-bottom: 8px; background: #e2e8f0; border-radius: 8px; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-hint { text-align: center; color: #94a3b8; padding: 20px; font-size: 13px; }
</style>
