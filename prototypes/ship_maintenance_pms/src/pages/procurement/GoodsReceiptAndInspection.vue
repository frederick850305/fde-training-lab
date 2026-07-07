<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">采购验收协同 / 收货验收</span>
        <h1>收货与质检验收</h1>
        <p>扫码识别到货订单，录入检验结论与缺陷原因，合格则入库并确认预算核减，不合格则发起退换货。底部展示历史验收记录。</p>
      </div>
    </header>

    <!-- 加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <!-- 空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无可验收订单</h2>
      <p>当前没有到货待验收的采购订单。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '请检查采购服务状态后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="kpi-grid">
        <article class="kpi-card active"><strong>{{ pendingOrders.length }}</strong><span>待验收订单</span></article>
        <article class="kpi-card ok"><strong>{{ historyRecords.length }}</strong><span>历史验收</span></article>
        <article class="kpi-card warn"><strong>{{ returnCount }}</strong><span>退换货</span></article>
        <article class="kpi-card"><strong>¥{{ totalDeduct.toLocaleString() }}</strong><span>累计预算核减</span></article>
      </section>

      <section class="receipt-layout">
        <!-- 左侧：扫码 + 待验收订单 -->
        <div class="left-stack">
          <article class="panel scan-panel">
            <div class="panel-title">
              <h2>扫码验收</h2>
              <span>扫描订单号或条码</span>
            </div>
            <div class="scan-box">
              <input
                v-model="scanInput"
                placeholder="扫描/输入订单号（如 PO-2026-118）"
                @keyup.enter="onScan"
              />
              <button type="button" class="primary" @click="onScan">识别</button>
            </div>
            <p v-if="scanTip" :class="['scan-tip', scanTipType]">{{ scanTip }}</p>
          </article>

          <article class="panel pending-panel">
            <div class="panel-title">
              <h2>待验收订单</h2>
              <span>{{ pendingOrders.length }} 单 · 点击选择</span>
            </div>
            <div v-if="!pendingOrders.length" class="empty-inline">暂无待验收订单。</div>
            <ul v-else class="pending-list">
              <li
                v-for="o in pendingOrders"
                :key="o.orderNo"
                :class="{ selected: selectedOrder?.orderNo === o.orderNo }"
                @click="selectOrder(o)"
              >
                <div class="pending-head">
                  <strong>{{ o.orderNo }}</strong>
                  <StatusBadge :label="o.status" />
                </div>
                <p>{{ o.supplier }}</p>
                <small>{{ orderItemsText(o) }}</small>
                <small>到货 {{ o.actualDelivery }}</small>
              </li>
            </ul>
          </article>
        </div>

        <!-- 右侧：检验录入 + 预算核减 -->
        <div class="right-stack">
          <article class="panel inspect-panel">
            <div class="panel-title">
              <h2>检验结果录入</h2>
              <span v-if="selectedOrder">{{ selectedOrder.orderNo }}</span>
            </div>
            <div v-if="!selectedOrder" class="empty-inline">请扫码或从左侧选择一个待验收订单。</div>
            <template v-else>
              <dl class="order-info">
                <div><dt>订单号</dt><dd>{{ selectedOrder.orderNo }}</dd></div>
                <div><dt>供应商</dt><dd>{{ selectedOrder.supplier }}</dd></div>
                <div><dt>到货时间</dt><dd>{{ selectedOrder.actualDelivery }}</dd></div>
                <div><dt>订单金额</dt><dd>¥{{ selectedOrder.amount.toLocaleString() }}</dd></div>
              </dl>

              <div class="items-block">
                <strong>到货物料</strong>
                <ul class="items-list">
                  <li v-for="(item, idx) in selectedOrder.items" :key="idx">
                    <span>{{ item.name }}</span>
                    <b>{{ item.qty }} {{ item.unit }}</b>
                  </li>
                </ul>
              </div>

              <form class="inspect-form" @submit.prevent>
                <label>
                  <span>检验结论 <em>*</em></span>
                  <select v-model="inspectForm.conclusion">
                    <option value="">请选择</option>
                    <option value="合格">合格</option>
                    <option value="部分不合格">部分不合格</option>
                    <option value="不合格">不合格</option>
                  </select>
                </label>
                <label>
                  <span>缺陷原因 <em v-if="inspectForm.conclusion !== '合格'">*</em></span>
                  <textarea
                    v-model="inspectForm.defectReason"
                    rows="3"
                    :placeholder="inspectForm.conclusion === '合格' ? '无缺陷（合格时可不填）' : '请描述缺陷情况、数量、影响'"
                    :disabled="inspectForm.conclusion === '合格'"
                  ></textarea>
                </label>
                <label>
                  <span>检验人</span>
                  <input v-model="inspectForm.inspector" placeholder="检验人姓名" />
                </label>
              </form>

              <div class="action-row">
                <button
                  type="button"
                  class="primary ok-btn"
                  @click="doReceipt"
                  :disabled="!canReceipt"
                >入库（合格）</button>
                <button
                  type="button"
                  class="danger-btn"
                  @click="doReturn"
                  :disabled="!canReturn"
                >退换货（不合格）</button>
              </div>
            </template>
          </article>

          <!-- 预算核减确认 -->
          <article v-if="deductInfo" class="panel deduct-panel ok">
            <div class="panel-title">
              <h2>预算核减确认</h2>
              <span>入库后触发</span>
            </div>
            <div class="deduct-info">
              <div class="deduct-amount">
                <strong>¥{{ deductInfo.amount.toLocaleString() }}</strong>
                <span>核减金额</span>
              </div>
              <dl>
                <div><dt>关联订单</dt><dd>{{ deductInfo.orderNo }}</dd></div>
                <div><dt>预算项</dt><dd>{{ deductInfo.budgetRef }}</dd></div>
                <div><dt>核减时间</dt><dd>{{ deductInfo.time }}</dd></div>
                <div><dt>状态</dt><dd class="ok-text">已确认核减</dd></div>
              </dl>
              <button type="button" class="primary" @click="confirmDeduct">确认核减</button>
            </div>
          </article>
        </div>
      </section>

      <!-- 历史验收记录 -->
      <section class="panel history-panel">
        <div class="panel-title">
          <h2>历史验收记录</h2>
          <span>{{ historyRecords.length }} 条</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>验收单号</th>
              <th>订单号</th>
              <th>供应商</th>
              <th>物料</th>
              <th>检验结论</th>
              <th>缺陷原因</th>
              <th>结果</th>
              <th>检验人</th>
              <th>时间</th>
              <th>预算核减</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="r in historyRecords" :key="r.inspectionId">
              <td><strong>{{ r.inspectionId }}</strong></td>
              <td>{{ r.orderId }}</td>
              <td>{{ r.supplier }}</td>
              <td>{{ historyItemsText(r) }}</td>
              <td><span :class="['conc-tag', concTone(r.inspectionConclusion)]">{{ r.inspectionConclusion }}</span></td>
              <td>{{ r.defectReason || '—' }}</td>
              <td><span :class="['result-tag', r.result === '入库' ? 'ok' : 'danger']">{{ r.result }}</span></td>
              <td>{{ r.inspector }}</td>
              <td>{{ r.time }}</td>
              <td :class="{ 'deduct-zero': !r.budgetDeduct }">{{ r.budgetDeduct ? '¥' + r.budgetDeduct.toLocaleString() : '—' }}</td>
            </tr>
          </tbody>
        </table>
        <div v-if="!historyRecords.length" class="empty-inline">暂无历史验收记录。</div>
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
import { computed, onMounted, reactive, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchProcurementOrders, fetchInspectionRecords, submitAction } from '@/mock/api.js'

const orders = ref([])
const historyRecords = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const scanInput = ref('')
const scanTip = ref('')
const scanTipType = ref('')
const selectedOrder = ref(null)

const inspectForm = reactive({
  conclusion: '',
  defectReason: '',
  inspector: '采办协同 马力',
})

const deductInfo = ref(null)

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

// 待验收订单：已到货且未验收或部分退换货
const pendingOrders = computed(() =>
  orders.value.filter(o => o.status === '已到货' || o.status === '部分到货'),
)

const returnCount = computed(() => historyRecords.value.filter(r => r.result === '退换货').length)
const totalDeduct = computed(() => historyRecords.value.reduce((sum, r) => sum + (r.budgetDeduct || 0), 0))

const canSubmit = computed(() => selectedOrder.value && inspectForm.conclusion)
const canReceipt = computed(() => inspectForm.conclusion === '合格')
const canReturn = computed(() => inspectForm.conclusion === '部分不合格' || inspectForm.conclusion === '不合格')

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [o, h] = await Promise.all([fetchProcurementOrders(), fetchInspectionRecords()])
    orders.value = o
    historyRecords.value = h
    uiState.value = (o.length || h.length) ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function onScan() {
  const code = scanInput.value.trim()
  if (!code) {
    scanTip.value = '请输入或扫描订单号'
    scanTipType.value = 'warn'
    return
  }
  const found = pendingOrders.value.find(o => o.orderNo === code || o.orderNo.includes(code))
  if (found) {
    selectOrder(found)
    scanTip.value = `已识别订单 ${found.orderNo}（${found.supplier}）`
    scanTipType.value = 'ok'
    scanInput.value = ''
  } else {
    scanTip.value = `未找到订单号 ${code}，或该订单不在待验收列表`
    scanTipType.value = 'danger'
  }
}

function selectOrder(o) {
  selectedOrder.value = o
  inspectForm.conclusion = ''
  inspectForm.defectReason = ''
  deductInfo.value = null
  scanTip.value = ''
}

function orderItemsText(o) {
  return (o.items || []).map(i => `${i.name} ×${i.qty}`).join('；')
}

function historyItemsText(r) {
  return (r.items || []).map(i => `${i.name} ×${i.qty}`).join('；')
}

function concTone(c) {
  if (c === '合格') return 'ok'
  if (c === '部分不合格') return 'warn'
  return 'danger'
}

function submitInspection() {
  if (!canSubmit.value) return
  if (canReturn.value && !inspectForm.defectReason.trim()) {
    pendingAction.value = { type: 'warn' }
    confirmTitle.value = '请填写缺陷原因'
    confirmMessage.value = '检验结论为部分不合格/不合格时，缺陷原因为必填项。'
    confirmOpen.value = true
    return
  }
  pendingAction.value = { type: 'submit' }
  confirmTitle.value = '提交验收结果'
  confirmMessage.value = `将提交订单 ${selectedOrder.value.orderNo} 的验收结果：${inspectForm.conclusion}。`
  confirmOpen.value = true
}

function doReceipt() {
  if (!canReceipt.value) return
  pendingAction.value = { type: 'receipt' }
  confirmTitle.value = '入库确认'
  confirmMessage.value = `订单 ${selectedOrder.value.orderNo} 检验合格，将办理入库并触发预算核减 ¥${selectedOrder.value.amount.toLocaleString()}。`
  confirmOpen.value = true
}

function doReturn() {
  if (!canReturn.value) return
  if (!inspectForm.defectReason.trim()) {
    pendingAction.value = { type: 'warn' }
    confirmTitle.value = '请填写缺陷原因'
    confirmMessage.value = '退换货操作必须填写缺陷原因。'
    confirmOpen.value = true
    return
  }
  pendingAction.value = { type: 'return' }
  confirmTitle.value = '退换货确认'
  confirmMessage.value = `订单 ${selectedOrder.value.orderNo} 检验${inspectForm.conclusion}，将发起退换货流程，供应商需补货或更换。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  if (action.type === 'warn') {
    confirmOpen.value = false
    return
  }
  try {
    if (action.type === 'receipt' || action.type === 'submit') {
      await submitAction('goodsReceipt', {
        orderNo: selectedOrder.value.orderNo,
        conclusion: inspectForm.conclusion || '合格',
        defectReason: inspectForm.defectReason,
        inspector: inspectForm.inspector,
      })
      // 添加到历史
      const newRecord = {
        inspectionId: `INS-${String(500 + historyRecords.value.length + 1).padStart(3, '0')}`,
        orderId: selectedOrder.value.orderNo,
        supplier: selectedOrder.value.supplier,
        items: selectedOrder.value.items,
        inspectionConclusion: inspectForm.conclusion || '合格',
        defectReason: inspectForm.defectReason || null,
        result: '入库',
        inspector: inspectForm.inspector,
        time: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', month: '2-digit', day: '2-digit' }),
        budgetDeduct: selectedOrder.value.amount,
      }
      historyRecords.value = [newRecord, ...historyRecords.value]
      // 触发预算核减
      deductInfo.value = {
        orderNo: selectedOrder.value.orderNo,
        budgetRef: 'Q3维保预算',
        amount: selectedOrder.value.amount,
        time: newRecord.time,
      }
      // 更新订单状态
      selectedOrder.value.status = '已到货'
      selectedOrder.value.inspectionStatus = '已验收合格'
    } else if (action.type === 'return') {
      await submitAction('goodsReturn', {
        orderNo: selectedOrder.value.orderNo,
        conclusion: inspectForm.conclusion,
        defectReason: inspectForm.defectReason,
        inspector: inspectForm.inspector,
      })
      const newRecord = {
        inspectionId: `INS-${String(500 + historyRecords.value.length + 1).padStart(3, '0')}`,
        orderId: selectedOrder.value.orderNo,
        supplier: selectedOrder.value.supplier,
        items: selectedOrder.value.items,
        inspectionConclusion: inspectForm.conclusion,
        defectReason: inspectForm.defectReason,
        result: '退换货',
        inspector: inspectForm.inspector,
        time: new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit', month: '2-digit', day: '2-digit' }),
        budgetDeduct: 0,
      }
      historyRecords.value = [newRecord, ...historyRecords.value]
      selectedOrder.value.inspectionStatus = inspectForm.conclusion === '不合格' ? '全部退换货' : '部分退换货'
    }
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '操作失败：' + (e?.message || '未知错误')
  }
}

function confirmDeduct() {
  pendingAction.value = { type: 'deduct' }
  confirmTitle.value = '确认预算核减'
  confirmMessage.value = `将确认核减预算 ¥${deductInfo.value.amount.toLocaleString()}（订单 ${deductInfo.value.orderNo}），核减后预算余额将相应减少。`
  confirmOpen.value = true
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .55; cursor: not-allowed; }
.ok-btn { color: #fff; border-color: #11734d; background: #11734d; }
.danger-btn { color: #fff; border-color: #b4232d; background: #b4232d; }

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
.kpi-card.warn strong { color: #b4232d; }
.kpi-card.active strong { color: #1e6fd9; }

.receipt-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
.left-stack, .right-stack { display: grid; gap: 16px; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }
.empty-inline { padding: 28px; text-align: center; color: #8b9aab; }

.scan-box { display: grid; grid-template-columns: 1fr auto; gap: 10px; }
.scan-box input { min-height: 44px; border: 2px solid #1e6fd9; border-radius: 8px; padding: 10px 14px; font-size: 14px; background: #fff; }
.scan-tip { margin: 10px 0 0; font-size: 12px; font-weight: 800; }
.scan-tip.ok { color: #11734d; }
.scan-tip.warn { color: #b8860b; }
.scan-tip.danger { color: #b4232d; }

.pending-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.pending-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; cursor: pointer; background: #f8fbfe; }
.pending-list li:hover { border-color: #1e6fd9; }
.pending-list li.selected { border-color: #1e6fd9; background: #edf5ff; }
.pending-head { display: flex; justify-content: space-between; align-items: center; }
.pending-head strong { font-size: 14px; }
.pending-list p { margin: 6px 0 4px; color: #172033; font-size: 13px; font-weight: 800; }
.pending-list small { display: block; color: #8b9aab; font-size: 11px; margin-top: 3px; }

.order-info { display: grid; gap: 7px; margin: 0 0 14px; }
.order-info div { display: flex; justify-content: space-between; border-bottom: 1px solid #e7edf4; padding-bottom: 6px; }
.order-info dt { color: #64748b; font-size: 12px; }
.order-info dd { margin: 0; font-weight: 900; font-size: 13px; }

.items-block { margin-bottom: 14px; }
.items-block > strong { display: block; font-size: 13px; margin-bottom: 8px; }
.items-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.items-list li { display: flex; justify-content: space-between; padding: 8px 10px; border: 1px solid #e2eaf3; border-radius: 6px; background: #f8fbfe; font-size: 12px; }
.items-list b { color: #1e6fd9; }

.inspect-form { display: grid; gap: 12px; }
.inspect-form label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.inspect-form em { color: #b4232d; font-style: normal; }
.inspect-form select, .inspect-form input { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 9px 10px; background: #fff; }
.inspect-form textarea { width: 100%; border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; resize: vertical; font: inherit; background: #fff; }
.inspect-form textarea:disabled { background: #f3f6fa; color: #8b9aab; }

.action-row { display: flex; gap: 10px; margin-top: 14px; padding-top: 14px; border-top: 1px solid #e7edf4; }

.deduct-panel { border-color: #bfe6cf; background: #e8f8ef; }
.deduct-info { display: grid; gap: 14px; }
.deduct-amount { text-align: center; padding: 12px; border: 1px solid #bfe6cf; border-radius: 8px; background: #fff; }
.deduct-amount strong { display: block; font-size: 28px; color: #11734d; }
.deduct-amount span { color: #64748b; font-size: 12px; font-weight: 800; }
.deduct-panel dl { display: grid; gap: 7px; margin: 0; }
.deduct-panel dl div { display: flex; justify-content: space-between; border-bottom: 1px solid #d9efe2; padding-bottom: 6px; }
.deduct-panel dt { color: #64748b; font-size: 12px; }
.deduct-panel dd { margin: 0; font-weight: 900; font-size: 13px; }
.ok-text { color: #11734d; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; vertical-align: middle; }
th { color: #63748a; background: #f7fafc; }
td strong { color: #172033; }
.conc-tag { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 900; background: #eef3f8; color: #53657c; }
.conc-tag.ok { background: #dff6e8; color: #11734d; }
.conc-tag.warn { background: #fff5d8; color: #8a5a00; }
.conc-tag.danger { background: #ffe1e3; color: #b4232d; }
.result-tag { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 900; }
.result-tag.ok { background: #dff6e8; color: #11734d; }
.result-tag.danger { background: #ffe1e3; color: #b4232d; }
.deduct-zero { color: #cdd9e6; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .receipt-layout { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
