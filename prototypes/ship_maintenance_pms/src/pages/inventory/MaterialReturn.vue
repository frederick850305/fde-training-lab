<template>
  <section class="page-screen material-return">
    <header class="page-header">
      <div>
        <span class="module-label">物资扫码盘点 / P0</span>
        <h1>物资退料</h1>
        <p>扫描退料条码，选择退料原因并校验数量，提交后增加本地库存生成待同步退料单。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton"><span></span><span></span></div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2><button type="button" @click="reload">重试</button>
    </div>
    <template v-else>
      <section class="return-layout">
        <article class="panel return-form">
          <div class="panel-title"><h2>退料登记</h2></div>
          <div class="scan-zone">
            <input v-model="scanCode" placeholder="扫描退料条码" @keyup.enter="onScan" />
            <button type="button" class="primary" @click="onScan">识别</button>
          </div>

          <div v-if="matchedMaterial" class="material-info">
            <div class="mat-head"><strong>{{ matchedMaterial.name }}</strong><StatusBadge :label="stockTone" /></div>
            <dl>
              <div><dt>物料编码</dt><dd>{{ matchedMaterial.code }}</dd></div>
              <div><dt>分类</dt><dd>{{ matchedMaterial.category }}</dd></div>
              <div><dt>当前库存</dt><dd>{{ matchedMaterial.systemInventory }} {{ matchedMaterial.unit }}</dd></div>
              <div><dt>存放位置</dt><dd>{{ matchedMaterial.location }}</dd></div>
            </dl>
          </div>

          <div v-if="matchedMaterial" class="form-fields">
            <label>退料数量
              <input v-model.number="form.quantity" type="number" min="1" :placeholder="`最大可退`" />
              <small v-if="form.quantity" class="hint">退料后库存：{{ matchedMaterial.systemInventory + form.quantity }} {{ matchedMaterial.unit }}</small>
            </label>
            <label>退料原因
              <select v-model="form.reason">
                <option value="">请选择</option>
                <option>领用结余</option>
                <option>规格不符</option>
                <option>质量问题</option>
                <option>其他</option>
              </select>
            </label>
            <label>备注说明
              <textarea v-model="form.remark" rows="3" placeholder="补充退料说明（可选）"></textarea>
            </label>
          </div>

          <div v-if="matchedMaterial && form.quantity && form.reason" class="submit-area">
            <button type="button" class="primary" @click="openConfirm">提交退料</button>
          </div>
        </article>

        <article class="panel return-orders">
          <div class="panel-title"><h2>待同步退料单</h2><span>{{ pendingCount }} 待同步</span></div>
          <div class="orders-list">
            <div v-for="r in returnOrders" :key="r.orderId" class="order-card" :class="{ pending: r.status === '待同步' }">
              <div class="order-head">
                <strong>{{ r.materialName }}</strong>
                <StatusBadge :label="r.status" />
              </div>
              <div class="order-meta">
                <span>{{ r.orderId }}</span>
                <span>退 {{ r.returnQuantity }} {{ r.unit }}</span>
                <span>{{ r.returnReason }}</span>
              </div>
              <div class="stock-change">
                <span>库存 {{ r.stockBefore }} → {{ r.stockAfter }} {{ r.unit }}</span>
                <small>{{ r.operator }} · {{ r.time }}</small>
              </div>
            </div>
          </div>
        </article>
      </section>
    </template>

    <ConfirmationDialog :open="confirmOpen" title="退料确认" :message="`将退料 ${matchedMaterial?.name} ${form.quantity}${matchedMaterial?.unit}，原因：${form.reason}。提交后库存增加并生成待同步退料单。`" @cancel="confirmOpen = false" @confirm="confirmReturn" />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchMaterials, fetchReturnOrders, submitAction } from '@/mock/api.js'

const materials = ref([])
const returnOrders = ref([])
const uiState = ref('loading')
const scanCode = ref('')
const matchedMaterial = ref(null)
const form = reactive({ quantity: null, reason: '', remark: '' })
const confirmOpen = ref(false)

const pendingCount = computed(() => returnOrders.value.filter(r => r.status === '待同步').length)
const stockTone = computed(() => {
  if (!matchedMaterial.value) return ''
  return matchedMaterial.value.systemInventory < matchedMaterial.value.safetyStock ? '库存不足' : '库存正常'
})

onMounted(load)
async function load() {
  uiState.value = 'loading'
  try {
    const [mats, orders] = await Promise.all([fetchMaterials(), fetchReturnOrders()])
    materials.value = mats
    returnOrders.value = orders
    uiState.value = 'success'
  } catch { uiState.value = 'error' }
}
function reload() { load() }

function onScan() {
  const code = scanCode.value.trim()
  if (!code) return
  matchedMaterial.value = materials.value.find(m => m.barcode === code || m.code === code) || materials.value[0] || null
  form.quantity = null
  form.reason = ''
  form.remark = ''
}

function openConfirm() { confirmOpen.value = true }
async function confirmReturn() {
  if (!matchedMaterial.value) return
  await submitAction('退料', { code: matchedMaterial.value.code, quantity: form.quantity })
  const newOrder = {
    orderId: `RET-${Date.now().toString().slice(-4)}`,
    materialCode: matchedMaterial.value.code,
    materialName: matchedMaterial.value.name,
    returnQuantity: form.quantity,
    unit: matchedMaterial.value.unit,
    returnReason: form.reason,
    remark: form.remark,
    status: '待同步',
    operator: '机工 刘洋',
    time: '2026-07-07 09:30',
    stockBefore: matchedMaterial.value.systemInventory,
    stockAfter: matchedMaterial.value.systemInventory + form.quantity,
  }
  returnOrders.value = [newOrder, ...returnOrders.value]
  matchedMaterial.value.systemInventory += form.quantity
  confirmOpen.value = false
  matchedMaterial.value = null
  scanCode.value = ''
  form.quantity = null
  form.reason = ''
  form.remark = ''
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
p { margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 14px; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
.state-panel { min-height: 200px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; gap: 12px; justify-items: center; background: #fff; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2,1fr); padding: 24px; }
.skeleton span { height: 80px; border-radius: 8px; background: linear-gradient(90deg,#eef3f8,#f8fbfe,#eef3f8); }
.return-layout { display: grid; grid-template-columns: minmax(0,1fr) 360px; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }
.scan-zone { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 16px; }
.scan-zone input { border: 2px dashed #9eb3ca; border-radius: 8px; padding: 12px; font-size: 15px; }
.material-info { border: 1px solid #d9e4ef; border-radius: 8px; padding: 14px; margin-bottom: 16px; background: #f8fbfe; }
.mat-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.mat-head strong { font-size: 16px; }
.material-info dl { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 0; }
.material-info dl div { display: flex; justify-content: space-between; border-bottom: 1px solid #e7edf4; padding-bottom: 6px; }
.material-info dt { color: #64748b; font-size: 12px; }
.material-info dd { margin: 0; font-weight: 800; font-size: 13px; }
.form-fields { display: grid; gap: 14px; }
.form-fields label { display: grid; gap: 6px; font-size: 12px; font-weight: 800; color: #53657c; }
.form-fields input, .form-fields select, .form-fields textarea { border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; font: inherit; }
.hint { color: #1e6fd9; font-weight: 600; }
.submit-area { margin-top: 16px; }
.submit-area .primary { width: 100%; padding: 12px; font-size: 15px; }
.orders-list { display: grid; gap: 10px; max-height: 600px; overflow-y: auto; }
.order-card { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #fff; }
.order-card.pending { border-left: 3px solid #d4743f; background: #fff8f0; }
.order-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.order-head strong { font-size: 14px; }
.order-meta { display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px; color: #64748b; }
.stock-change { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; padding-top: 8px; border-top: 1px solid #e7edf4; }
.stock-change span { font-size: 12px; font-weight: 800; color: #11734d; }
.stock-change small { font-size: 11px; color: #8b9aab; }
@media (max-width: 900px) { .return-layout { grid-template-columns: 1fr; } .material-info dl { grid-template-columns: 1fr; } }
</style>
