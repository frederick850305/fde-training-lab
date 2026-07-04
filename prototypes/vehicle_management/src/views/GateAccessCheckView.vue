<template>
  <div class="gate-access">
    <div v-if="loading" class="loading-state"><div class="skeleton" v-for="n in 3" :key="n" style="height:72px;margin-bottom:8px;border-radius:10px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <div v-else-if="pendingList.length === 0" class="empty-hint"><span>🚧</span><p>暂无待核验车辆</p></div>
    <template v-else>
      <div class="pending-list">
        <div v-for="v in pendingList" :key="v.vehicleId" class="pending-item" @click="openDetail(v)">
          <div class="pi-left">
            <strong>{{ v.plate }}</strong>
            <small>{{ v.vehicleType }} · {{ v.intent }}</small>
          </div>
          <StatusTag :status="v.certStatus === '正常' ? '成功' : '异常'" />
        </div>
      </div>
    </template>

    <!-- 核验详情弹窗 -->
    <DetailPanel :visible="!!selectedVehicle" title="车辆核验" @close="selectedVehicle = null">
      <template v-if="selectedVehicle">
        <div class="detail-section">
          <p><strong>车牌：</strong>{{ selectedVehicle.plate }}</p>
          <p><strong>类型：</strong>{{ selectedVehicle.vehicleType }}</p>
          <p><strong>预约编号：</strong>{{ selectedVehicle.reservationId }}</p>
          <p><strong>证件状态：</strong><StatusTag :status="selectedVehicle.certStatus === '正常' ? '成功' : '异常'" /></p>
          <p><strong>入场意图：</strong>{{ selectedVehicle.intent }}</p>
          <p><strong>预计到达：</strong>{{ selectedVehicle.arrivalTime }}</p>
        </div>
        <div class="action-btns">
          <button class="approve-btn" @click="doAction('放行')">✅ 放行</button>
          <button class="reject-btn" @click="showReject = true">❌ 拒绝</button>
        </div>
        <div v-if="showReject" class="reject-form">
          <select v-model="rejectReason"><option>证件过期</option><option>无预约记录</option><option>其他原因</option></select>
          <button class="approve-btn" style="background:#c62828;margin-top:8px" @click="doAction('拒绝')">确认拒绝</button>
        </div>
      </template>
    </DetailPanel>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchGateData } from '../data/mockGate.js'
import StatusTag from '../components/StatusTag.vue'
import DetailPanel from '../components/DetailPanel.vue'

const loading = ref(true)
const error = ref('')
const pendingList = ref([])
const selectedVehicle = ref(null)
const showReject = ref(false)
const rejectReason = ref('证件过期')

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchGateData()
    pendingList.value = data.pendingVehicles || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function openDetail(v) { selectedVehicle.value = v; showReject.value = false }
function doAction(action) {
  alert(`已${action}车辆 ${selectedVehicle.value.plate}`)
  pendingList.value = pendingList.value.filter(v => v.vehicleId !== selectedVehicle.value.vehicleId)
  selectedVehicle.value = null; showReject.value = false
}

onMounted(loadData)
</script>

<style scoped>
.gate-access { padding: 16px; max-width: 600px; margin: 0 auto; }
.pending-list { display: grid; gap: 8px; }
.pending-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; cursor: pointer; }
.pending-item:hover { border-color: #1a56db; }
.pi-left strong { font-size: 14px; display: block; }
.pi-left small { font-size: 12px; color: #64748b; }
.detail-section p { margin: 6px 0; font-size: 13px; }
.action-btns { display: flex; gap: 12px; margin-top: 16px; }
.action-btns button { flex: 1; padding: 12px; border: none; border-radius: 10px; font-size: 15px; font-weight: 700; cursor: pointer; }
.approve-btn { background: #e6f7e6; color: #1a7a1a; }
.reject-btn { background: #ffeaea; color: #c62828; }
.reject-form { margin-top: 12px; }
.reject-form select { width: 100%; padding: 8px; border: 1px solid #cbd5e1; border-radius: 8px; }
.loading-state { padding: 20px; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-hint { text-align: center; padding: 40px; color: #94a3b8; }
.empty-hint span { font-size: 32px; display: block; margin-bottom: 8px; }
</style>
