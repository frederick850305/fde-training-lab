<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">采购验收协同 / 订单跟踪</span>
        <h1>采购订单跟踪</h1>
        <p>跟踪采购订单的到货进度、供应商与附件信息，支持确认到货、更新进度操作。选中订单查看明细与到货进度条。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" class="primary" @click="confirmReceipt" :disabled="!canConfirm">确认到货</button>
      </div>
    </header>

    <!-- 加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <!-- 空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无采购订单</h2>
      <p>当前没有采购订单数据。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>订单数据加载失败</h2>
      <p>{{ errorMsg || '请检查采购服务状态后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="kpi-grid">
        <article class="kpi-card active"><strong>{{ orders.length }}</strong><span>订单总数</span></article>
        <article class="kpi-card warn"><strong>{{ procuringCount }}</strong><span>采购中</span></article>
        <article class="kpi-card ok"><strong>{{ arrivedCount }}</strong><span>已到货</span></article>
        <article class="kpi-card"><strong>¥{{ totalAmount.toLocaleString() }}</strong><span>订单总金额</span></article>
      </section>

      <section class="track-layout">
        <!-- 订单列表 -->
        <article class="panel order-list-panel">
          <div class="panel-title">
            <h2>采购订单列表</h2>
            <span>{{ filteredOrders.length }} / {{ orders.length }} 单</span>
          </div>
          <div class="filter-row">
            <input v-model="keyword" placeholder="搜索订单号 / 供应商" />
            <select v-model="statusFilter">
              <option value="">全部状态</option>
              <option value="采购中">采购中</option>
              <option value="部分到货">部分到货</option>
              <option value="已到货">已到货</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>订单号</th>
                <th>供应商</th>
                <th>状态</th>
                <th>物料</th>
                <th>预计到货</th>
                <th>实际到货</th>
                <th>金额</th>
                <th>验收</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="o in filteredOrders"
                :key="o.orderNo"
                :class="{ selected: selectedOrder?.orderNo === o.orderNo }"
                @click="selectOrder(o)"
              >
                <td><strong>{{ o.orderNo }}</strong></td>
                <td>{{ o.supplier }}</td>
                <td><StatusBadge :label="o.status" /></td>
                <td>{{ orderItemsText(o) }}</td>
                <td>{{ o.expectedDelivery || '—' }}</td>
                <td :class="{ 'overdue': isOverdue(o) }">{{ o.actualDelivery || '未到货' }}</td>
                <td>¥{{ o.amount.toLocaleString() }}</td>
                <td>
                  <span v-if="o.inspectionStatus" :class="['insp-tag', inspTone(o.inspectionStatus)]">{{ o.inspectionStatus }}</span>
                  <span v-else class="insp-na">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </article>

        <!-- 订单详情 -->
        <aside class="panel detail-panel">
          <div class="panel-title">
            <h2>订单详情</h2>
            <span v-if="selectedOrder">{{ selectedOrder.orderNo }}</span>
          </div>
          <div v-if="!selectedOrder" class="empty-inline">请选择一个订单查看详情。</div>
          <template v-else>
            <dl>
              <div><dt>订单号</dt><dd>{{ selectedOrder.orderNo }}</dd></div>
              <div><dt>供应商</dt><dd>{{ selectedOrder.supplier }}</dd></div>
              <div><dt>订单状态</dt><dd><StatusBadge :label="selectedOrder.status" /></dd></div>
              <div><dt>关联需求</dt><dd>{{ selectedOrder.relatedReq || '—' }}</dd></div>
              <div><dt>预计到货</dt><dd>{{ selectedOrder.expectedDelivery || '—' }}</dd></div>
              <div><dt>实际到货</dt><dd>{{ selectedOrder.actualDelivery || '未到货' }}</dd></div>
              <div><dt>订单金额</dt><dd>¥{{ selectedOrder.amount.toLocaleString() }}</dd></div>
              <div><dt>验收状态</dt><dd>{{ selectedOrder.inspectionStatus || '未验收' }}</dd></div>
            </dl>

            <!-- 到货进度 -->
            <div class="progress-section">
              <div class="progress-head">
                <strong>到货进度</strong>
                <span>{{ progressPercent }}%</span>
              </div>
              <div class="progress-bar">
                <i :style="{ width: `${progressPercent}%` }" :class="progressTone"></i>
              </div>
              <p class="progress-tip">{{ progressTip }}</p>
            </div>

            <!-- 物料明细 -->
            <div class="items-section">
              <strong>物料明细</strong>
              <ul class="items-list">
                <li v-for="(item, idx) in selectedOrder.items" :key="idx">
                  <span>{{ item.name }}</span>
                  <b>{{ item.qty }} {{ item.unit }}</b>
                </li>
              </ul>
            </div>

            <!-- 附件 -->
            <div class="attach-section">
              <strong>附件信息</strong>
              <div v-if="selectedOrder.attachmentFileIds.length" class="attach-list">
                <div v-for="fid in selectedOrder.attachmentFileIds" :key="fid" class="attach-item">
                  <span class="attach-icon">📄</span>
                  <span>{{ fid }}.pdf</span>
                  <button type="button" class="mini" @click="previewAttach(fid)">查看</button>
                </div>
              </div>
              <div v-else class="empty-inline small">暂无附件</div>
            </div>

            <!-- 操作 -->
            <div class="action-row">
              <button type="button" class="primary" @click="confirmReceipt" :disabled="!canConfirm">确认到货</button>
              <button type="button" @click="updateProgress" :disabled="selectedOrder.status === '已到货'">更新进度</button>
            </div>
          </template>
        </aside>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmAction"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchProcurementOrders, submitAction } from '@/mock/api.js'

const orders = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const keyword = ref('')
const statusFilter = ref('')
const selectedOrder = ref(null)

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

const filteredOrders = computed(() =>
  orders.value.filter(o => {
    const kw = keyword.value.trim()
    const kwHit = !kw || `${o.orderNo}${o.supplier}`.includes(kw)
    const stHit = !statusFilter.value || o.status === statusFilter.value
    return kwHit && stHit
  }),
)

const procuringCount = computed(() => orders.value.filter(o => o.status === '采购中').length)
const arrivedCount = computed(() => orders.value.filter(o => o.status === '已到货').length)
const totalAmount = computed(() => orders.value.reduce((sum, o) => sum + (o.amount || 0), 0))

const canConfirm = computed(() => selectedOrder.value && selectedOrder.value.status !== '已到货')

const progressPercent = computed(() => {
  if (!selectedOrder.value) return 0
  const s = selectedOrder.value.status
  if (s === '已到货') return 100
  if (s === '部分到货') return 60
  if (s === '采购中') return 30
  return 0
})

const progressTone = computed(() => {
  if (!selectedOrder.value) return ''
  if (selectedOrder.value.status === '已到货') return 'ok'
  if (selectedOrder.value.status === '部分到货') return 'warn'
  return 'active'
})

const progressTip = computed(() => {
  if (!selectedOrder.value) return ''
  const s = selectedOrder.value.status
  if (s === '已到货') return '订单已全部到货，可进行验收。'
  if (s === '部分到货') return '订单部分到货，剩余物料待供应商补齐。'
  return '订单采购中，等待供应商发货。'
})

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const data = await fetchProcurementOrders()
    orders.value = data
    selectedOrder.value = data[0] || null
    uiState.value = data.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function selectOrder(o) {
  selectedOrder.value = o
}

function orderItemsText(o) {
  return (o.items || []).map(i => `${i.name} ×${i.qty}`).join('；')
}

function isOverdue(o) {
  if (!o.expectedDelivery || o.actualDelivery) return false
  return new Date(o.expectedDelivery) < new Date('2026-07-07')
}

function inspTone(s) {
  if (/合格/.test(s)) return 'ok'
  if (/退换|不合格/.test(s)) return 'danger'
  return ''
}

function previewAttach(fid) {
  pendingAction.value = { type: 'preview', fid }
  confirmTitle.value = '预览附件'
  confirmMessage.value = `将预览附件 ${fid}.pdf（采购合同/送货单/发票等）。`
  confirmOpen.value = true
}

function confirmReceipt() {
  if (!canConfirm.value) return
  pendingAction.value = { type: 'receipt' }
  confirmTitle.value = '确认到货'
  confirmMessage.value = `将确认订单 ${selectedOrder.value.orderNo}（${selectedOrder.value.supplier}）已到货，到货后进入验收流程。`
  confirmOpen.value = true
}

function updateProgress() {
  if (!selectedOrder.value || selectedOrder.value.status === '已到货') return
  pendingAction.value = { type: 'progress' }
  confirmTitle.value = '更新到货进度'
  confirmMessage.value = `将更新订单 ${selectedOrder.value.orderNo} 的到货进度状态。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  try {
    if (action.type === 'receipt') {
      await submitAction('confirmReceipt', { orderNo: selectedOrder.value.orderNo })
      selectedOrder.value.status = '已到货'
      selectedOrder.value.actualDelivery = new Date().toISOString().slice(0, 10)
    } else if (action.type === 'progress') {
      await submitAction('updateProgress', { orderNo: selectedOrder.value.orderNo })
      if (selectedOrder.value.status === '采购中') {
        selectedOrder.value.status = '部分到货'
      } else if (selectedOrder.value.status === '部分到货') {
        selectedOrder.value.status = '已到货'
        selectedOrder.value.actualDelivery = new Date().toISOString().slice(0, 10)
      }
    }
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '操作失败：' + (e?.message || '未知错误')
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button.mini { padding: 4px 9px; font-size: 12px; }
button:disabled { opacity: .55; cursor: not-allowed; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.kpi-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 15px; background: #fff; }
.kpi-card strong { display: block; color: #1e6fd9; font-size: 22px; }
.kpi-card span { color: #64748b; font-size: 12px; font-weight: 800; }
.kpi-card.ok strong { color: #11734d; }
.kpi-card.warn strong { color: #b8860b; }
.kpi-card.active strong { color: #1e6fd9; }

.track-layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }
.empty-inline { padding: 28px; text-align: center; color: #8b9aab; }
.empty-inline.small { padding: 16px; }

.filter-row { display: grid; grid-template-columns: 1.4fr 1fr; gap: 10px; margin-bottom: 12px; }
.filter-row input, .filter-row select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; vertical-align: middle; }
th { color: #63748a; background: #f7fafc; }
tr { cursor: pointer; }
tr.selected td { background: #edf5ff; }
td.overdue { color: #b4232d; font-weight: 800; }
.insp-tag { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 900; background: #eef3f8; color: #53657c; }
.insp-tag.ok { background: #dff6e8; color: #11734d; }
.insp-tag.danger { background: #ffe1e3; color: #b4232d; }
.insp-na { color: #cdd9e6; }

.detail-panel { position: sticky; top: 0; display: grid; gap: 14px; }
dl { display: grid; gap: 8px; margin: 0; }
dl div { display: flex; justify-content: space-between; gap: 12px; border-bottom: 1px solid #e7edf4; padding-bottom: 7px; }
dt { color: #64748b; font-size: 12px; }
dd { margin: 0; font-weight: 900; text-align: right; font-size: 13px; }

.progress-section { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; }
.progress-head { display: flex; justify-content: space-between; margin-bottom: 8px; }
.progress-head strong { font-size: 13px; }
.progress-head span { color: #1e6fd9; font-weight: 900; }
.progress-bar { height: 10px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.progress-bar i { display: block; height: 100%; border-radius: 999px; background: #1e6fd9; transition: width .3s; }
.progress-bar i.ok { background: #11734d; }
.progress-bar i.warn { background: #b8860b; }
.progress-tip { margin: 8px 0 0; color: #53657c; font-size: 12px; }

.items-section { display: grid; gap: 8px; }
.items-section > strong { font-size: 13px; }
.items-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.items-list li { display: flex; justify-content: space-between; padding: 8px 10px; border: 1px solid #e2eaf3; border-radius: 6px; background: #f8fbfe; font-size: 12px; }
.items-list b { color: #1e6fd9; }

.attach-section { display: grid; gap: 8px; }
.attach-section > strong { font-size: 13px; }
.attach-list { display: grid; gap: 6px; }
.attach-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border: 1px solid #e2eaf3; border-radius: 6px; background: #f8fbfe; font-size: 12px; }
.attach-icon { font-size: 16px; }
.attach-item span:nth-child(2) { flex: 1; color: #172033; }

.action-row { display: flex; gap: 10px; flex-wrap: wrap; padding-top: 6px; border-top: 1px solid #e7edf4; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .track-layout { grid-template-columns: 1fr; }
  .detail-panel { position: static; }
  .filter-row { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
