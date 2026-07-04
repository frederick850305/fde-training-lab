<template>
  <div class="workspace-view">
    <div v-if="loading" class="loading-state"><div class="skeleton" v-for="n in 3" :key="n" style="height:80px;margin-bottom:8px;border-radius:10px"></div></div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else>
      <div v-if="pendingList.length === 0" class="empty-hint"><span>📋</span><p>暂无待审批预约</p></div>
      <div v-else class="reservation-list">
        <div v-for="r in pendingList" :key="r.reservationId" class="reservation-item" :class="{ timeout: r.timeout }">
          <div class="ri-header">
            <strong>{{ r.plate }}</strong>
            <StatusTag :status="r.status" />
            <span v-if="r.timeout" class="timeout-badge">⏰ 超时</span>
          </div>
          <div class="ri-meta">
            <span>{{ r.unit }}</span><span>{{ r.workArea }}</span><span>{{ r.reservationTime }}</span>
          </div>
          <div class="ri-actions" v-if="r.status === '待审批'">
            <button class="approve-btn" @click="approve(r)">✅ 通过</button>
            <button class="reject-btn" @click="reject(r)">❌ 驳回</button>
          </div>
        </div>
      </div>
    </template>

    <ConfirmDialog :visible="showConfirm" title="审批确认" :content="confirmContent" @confirm="doConfirm" @cancel="showConfirm = false" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchReservationData } from '../data/mockReservations.js'
import StatusTag from '../components/StatusTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const loading = ref(true)
const error = ref('')
const pendingList = ref([])
const showConfirm = ref(false)
const confirmContent = ref('')
const pendingAction = ref(null)

async function loadData() {
  loading.value = true; error.value = ''
  try {
    const data = await fetchReservationData()
    pendingList.value = data.reservations || []
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function approve(r) {
  pendingAction.value = { item: r, action: '通过' }
  confirmContent.value = `确定通过 ${r.plate} 的预约申请？将生成授权码并同步门禁。`
  showConfirm.value = true
}
function reject(r) {
  pendingAction.value = { item: r, action: '驳回' }
  confirmContent.value = `确定驳回 ${r.plate} 的预约申请？`
  showConfirm.value = true
}
function doConfirm() {
  const a = pendingAction.value
  if (a) {
    const idx = pendingList.value.findIndex(r => r.reservationId === a.item.reservationId)
    if (idx >= 0) {
      pendingList.value[idx] = { ...pendingList.value[idx], status: a.action === '通过' ? '已通过' : '已驳回' }
    }
  }
  showConfirm.value = false; pendingAction.value = null
}

onMounted(loadData)
</script>

<style scoped>
.workspace-view { padding: 16px; max-width: 700px; margin: 0 auto; }
.reservation-list { display: grid; gap: 10px; }
.reservation-item { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px; }
.reservation-item.timeout { border-color: #ffcc80; background: #fffdf5; }
.ri-header { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.ri-header strong { font-size: 14px; }
.timeout-badge { font-size: 11px; color: #d84315; font-weight: 700; }
.ri-meta { display: flex; gap: 16px; font-size: 12px; color: #64748b; margin-bottom: 10px; }
.ri-actions { display: flex; gap: 8px; }
.ri-actions button { flex: 1; padding: 8px; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; }
.approve-btn { background: #e6f7e6; color: #1a7a1a; }
.reject-btn { background: #ffeaea; color: #c62828; }
.loading-state { padding: 20px; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.empty-hint { text-align: center; padding: 40px; color: #94a3b8; }
.empty-hint span { font-size: 32px; display: block; margin-bottom: 8px; }
</style>
