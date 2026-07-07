<template>
  <section class="page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">物资库存 / 领料</span>
        <h1>物料领料</h1>
        <p>扫码或搜索物料，校验库存并关联工单，提交后加入待同步领料单列表。</p>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <div class="sk-row" v-for="n in 3" :key="n"></div>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel">
      <h2>数据加载失败</h2>
      <p>请检查网络后重试。</p>
      <button @click="reload">重试</button>
    </div>

    <template v-else>
      <div class="work-area">
        <!-- 左：领料表单 -->
        <div class="left-col">
          <!-- 扫码 + 搜索 -->
          <div class="panel scan-panel">
            <h3 class="panel-title">物料扫码 / 搜索</h3>
            <div class="scan-row">
              <input v-model="barcodeInput" placeholder="扫描物料条码" @keyup.enter="doScan" />
              <button @click="doScan">扫码</button>
            </div>
            <div class="search-row">
              <input v-model="keyword" placeholder="按编码 / 名称 / 分类搜索" @input="onSearch" />
              <button @click="onSearch">搜索</button>
            </div>
            <ul v-if="searchResults.length" class="search-list">
              <li v-for="m in searchResults" :key="m.code" :class="{ selected: selectedMaterial?.code === m.code }" @click="selectMaterial(m)">
                <div class="sr-top">
                  <strong>{{ m.name }}</strong>
                  <span class="sr-code">{{ m.code }}</span>
                </div>
                <div class="sr-meta">
                  <span>{{ m.category }}</span>
                  <span class="sep">·</span>
                  <span>库存 {{ m.systemInventory }} {{ m.unit }}</span>
                  <span class="sep">·</span>
                  <span>{{ m.location }}</span>
                </div>
              </li>
            </ul>
            <p v-else class="empty-note">输入关键词或扫码匹配物料</p>
          </div>

          <!-- 库存校验 + 关联工单 + 领用数量 -->
          <div v-if="selectedMaterial" class="panel form-panel">
            <h3 class="panel-title">领料信息</h3>
            <div class="stock-check" :class="stockTone">
              <div class="sc-left">
                <span>当前库存</span>
                <strong>{{ selectedMaterial.systemInventory }} {{ selectedMaterial.unit }}</strong>
              </div>
              <div class="sc-right">
                <span>安全库存</span>
                <strong>{{ selectedMaterial.safetyStock }} {{ selectedMaterial.unit }}</strong>
              </div>
              <p v-if="isLowStock" class="low-tip">低于安全库存，请确认是否继续领用</p>
            </div>

            <div class="form-grid">
              <label>
                <span>关联工单号</span>
                <input v-model="relatedOrder" list="wo-list" placeholder="选择或输入工单号" />
                <datalist id="wo-list">
                  <option v-for="wo in workOrderOptions" :key="wo" :value="wo" />
                </datalist>
              </label>
              <label>
                <span>领用数量（{{ selectedMaterial.unit }}）</span>
                <input type="number" min="1" v-model.number="quantity" :max="selectedMaterial.systemInventory" @input="validateQty" />
              </label>
              <label class="full">
                <span>领用用途</span>
                <input v-model="purpose" placeholder="如 主机燃油泵保养" />
              </label>
            </div>
            <p v-if="qtyError" class="qty-error">{{ qtyError }}</p>
            <div v-if="shortageWarning" class="shortage-alert">
              <strong>⚠ 缺件预警</strong>
              <p>领用数量超出当前库存 {{ shortageQty }} {{ selectedMaterial.unit }}，系统将自动生成缺件申请单。</p>
            </div>

            <p v-if="submitHint" class="submit-hint">{{ submitHint }}</p>
            <div class="submit-row">
              <button type="button" class="primary" :disabled="!canSubmit" :title="shortageWarning ? '提交领料并生成缺件申请' : '提交领料单'" @click="submitRequisitionHandler">提交领料</button>
            </div>
          </div>
        </div>

        <!-- 右：待同步领料单 -->
        <div class="right-col">
          <div class="panel list-panel">
            <h3 class="panel-title">待同步领料单 <em>{{ orders.length }}</em></h3>
            <ul class="order-list">
              <li v-for="o in orders" :key="o.orderId">
                <div class="ord-top">
                  <strong>{{ o.materialName }} ×{{ o.quantity }}{{ o.unit }}</strong>
                  <span class="ord-status" :class="ordStatusTone(o.status)">{{ o.status }}</span>
                </div>
                <div class="ord-meta">
                  <span>{{ o.orderId }}</span>
                  <span class="sep">·</span>
                  <span>关联 {{ o.relatedOrder }}</span>
                </div>
                <p class="ord-purpose">{{ o.purpose }}</p>
                <div class="ord-stock">
                  <span>库存 {{ o.stockBefore }} → {{ o.stockAfter }} {{ o.unit }}</span>
                  <small>{{ o.operator }} · {{ o.time }}</small>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import { fetchMaterials, fetchRequisitionOrders, fetchWorkOrders, submitRequisition, appendOfflineQueue } from '@/mock/api.js'

const nav = inject('prototypeNavigation', null)

const uiState = ref('loading')
const materials = ref([])
const orders = ref([])
const workOrderOptions = ref([])
const barcodeInput = ref('')
const keyword = ref('')
const searchResults = ref([])
const selectedMaterial = ref(null)
const relatedOrder = ref('')
const quantity = ref(null)
const purpose = ref('')
const qtyError = ref('')
const submitHint = ref('')
const shortageWarning = ref(false)
const shortageQty = computed(() => {
  if (!selectedMaterial.value || quantity.value === null) return 0
  return Math.max(0, Number(quantity.value) - selectedMaterial.value.systemInventory)
})

const isLowStock = computed(() => selectedMaterial.value && selectedMaterial.value.systemInventory < selectedMaterial.value.safetyStock)
const stockTone = computed(() => (isLowStock.value ? 'low' : 'ok'))
const canSubmit = computed(() => selectedMaterial.value && quantity.value > 0 && relatedOrder.value && purpose.value && !qtyError.value)

function ordStatusTone(s) {
  if (s === '已同步') return 'ok'
  return 'pending'
}

function doScan() {
  const code = barcodeInput.value.trim()
  if (!code) return
  const found = materials.value.find(m => m.barcode === code || m.code === code)
  if (found) {
    selectMaterial(found)
  } else {
    alert('未匹配到物料')
  }
}

function onSearch() {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) { searchResults.value = []; return }
  searchResults.value = materials.value.filter(m =>
    m.code.toLowerCase().includes(kw) || m.name.toLowerCase().includes(kw) || m.category.toLowerCase().includes(kw)
  )
}

function selectMaterial(m) {
  selectedMaterial.value = m
  quantity.value = null
  qtyError.value = ''
  submitHint.value = ''
  searchResults.value = []
  keyword.value = ''
}

function validateQty() {
  qtyError.value = ''
  shortageWarning.value = false
  if (!selectedMaterial.value || quantity.value === null) return
  if (quantity.value < 1) { qtyError.value = '领用数量必须大于 0'; return }
  if (quantity.value > selectedMaterial.value.systemInventory) {
    // 超库存时不阻止提交，而是显示缺件预警
    shortageWarning.value = true
  }
}

async function submitRequisitionHandler() {
  if (!canSubmit.value) return
  const m = selectedMaterial.value
  const stockBefore = m.systemInventory
  const qty = Number(quantity.value)
  // 如果超库存，实际领出 = 当前库存，缺件部分生成缺件申请
  const actualOut = Math.min(qty, stockBefore)
  const stockAfter = stockBefore - actualOut
  const newOrder = {
    orderId: `REQ-${Date.now().toString().slice(-4)}`,
    materialCode: m.code,
    materialName: m.name,
    quantity: qty,
    unit: m.unit,
    purpose: purpose.value,
    relatedOrder: relatedOrder.value,
    status: '待同步',
    operator: '当前用户',
    time: new Date().toLocaleString('zh-CN'),
    stockBefore,
    stockAfter,
  }
  orders.value = [newOrder, ...orders.value]
  // 更新本地库存
  m.systemInventory = stockAfter
  await submitRequisition(newOrder)
  // 如果有缺件，生成缺件申请
  if (shortageWarning.value && shortageQty.value > 0) {
    appendOfflineQueue({
      type: '缺件申请',
      recordId: `PR-${Date.now().toString().slice(-4)}`,
      shipName: '当前船舶',
      summary: `${m.name} 缺件申请 ${shortageQty.value}${m.unit}，关联工单 ${relatedOrder.value}`,
      status: '待同步',
    })
    submitHint.value = `领料单 ${newOrder.orderId} 已提交，缺件申请已生成（缺 ${shortageQty.value}${m.unit}）`
  } else {
    submitHint.value = `领料单 ${newOrder.orderId} 已提交，状态：待同步`
  }
  // 重置表单
  selectedMaterial.value = null
  barcodeInput.value = ''
  relatedOrder.value = ''
  quantity.value = null
  purpose.value = ''
  shortageWarning.value = false
  // 返回工作台
  setTimeout(() => {
    if (nav) nav.navigateTo('InventoryWorkbench')
  }, 1500)
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [mats, ords, wos] = await Promise.all([fetchMaterials(), fetchRequisitionOrders(), fetchWorkOrders()])
    materials.value = mats
    orders.value = ords
    workOrderOptions.value = wos.map(w => w.id)
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.page { display: grid; gap: 16px; position: relative; }
.page-head { position: relative; border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 20px; background: #fff; }
.eyebrow { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-head h1 { margin: 6px 0 6px; font-size: 22px; color: #172033; }
.page-head p { margin: 6px 0 0; color: #64748b; font-size: 13px; max-width: 760px; }

.state-panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 32px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0 0 8px; color: #b4232d; }
.state-panel p { color: #64748b; margin: 0 0 14px; }
.state-panel button { border: 1px solid #1e6fd9; border-radius: 8px; padding: 8px 18px; background: #1e6fd9; color: #fff; font-weight: 900; }
.skeleton { display: grid; gap: 12px; }
.sk-row { height: 80px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.work-area { display: grid; grid-template-columns: 1.2fr .8fr; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; background: #fff; }
.left-col { display: grid; gap: 14px; }
.right-col { display: grid; gap: 14px; }
.panel-title { margin: 0 0 12px; font-size: 15px; color: #172033; display: flex; align-items: center; gap: 8px; }
.panel-title em { font-size: 12px; color: #64748b; font-style: normal; font-weight: 800; background: #eef3f8; padding: 2px 8px; border-radius: 999px; }

.scan-row, .search-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 8px; }
.scan-row input, .search-row input { border: 1px solid #cbd7e4; border-radius: 8px; padding: 10px 12px; font-size: 13px; color: #172033; background: #fff; }
.scan-row button, .search-row button { border: 0; border-radius: 8px; padding: 0 18px; background: #1e6fd9; color: #fff; font-weight: 900; }
.search-list { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 6px; max-height: 220px; overflow-y: auto; }
.search-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 10px; background: #f8fbfe; cursor: pointer; display: grid; gap: 4px; }
.search-list li:hover { border-color: #1e6fd9; }
.search-list li.selected { border-color: #1e6fd9; background: #edf5ff; }
.sr-top { display: flex; justify-content: space-between; align-items: center; }
.sr-top strong { font-size: 13px; color: #172033; }
.sr-code { font-size: 11px; color: #1e6fd9; font-weight: 800; }
.sr-meta { display: flex; gap: 5px; color: #64748b; font-size: 11px; }
.sr-meta .sep { opacity: .6; }
.empty-note { margin: 8px 0 0; color: #8b9aab; font-size: 12px; text-align: center; }

.stock-check { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 14px; border-radius: 8px; margin-bottom: 14px; }
.stock-check.ok { background: #f0f9f3; border: 1px solid #c5e8d2; }
.stock-check.low { background: #fff3e6; border: 1px solid #f3d6c2; }
.sc-left, .sc-right { display: grid; gap: 4px; }
.sc-left span, .sc-right span { color: #64748b; font-size: 12px; font-weight: 800; }
.sc-left strong, .sc-right strong { font-size: 20px; color: #172033; }
.low-tip { grid-column: 1 / -1; margin: 0; color: #d4743f; font-size: 12px; font-weight: 800; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-grid label { display: grid; gap: 6px; }
.form-grid label.full { grid-column: 1 / -1; }
.form-grid span { color: #53657c; font-size: 12px; font-weight: 800; }
.form-grid input { border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; font-size: 13px; color: #172033; background: #fff; }
.qty-error { margin: 10px 0 0; color: #b4232d; font-size: 12px; font-weight: 800; }
.shortage-alert { margin: 10px 0 0; padding: 10px 14px; border: 1px solid #f3d6c2; border-radius: 8px; background: #fff5e6; }
.shortage-alert strong { display: block; color: #d4743f; font-size: 13px; margin-bottom: 4px; }
.shortage-alert p { margin: 0; color: #8a5a00; font-size: 12px; line-height: 1.5; }

.submit-row { margin-top: 14px; display: flex; justify-content: flex-end; }
.submit-row .primary { border: 0; border-radius: 8px; padding: 10px 22px; background: #1e6fd9; color: #fff; font-weight: 900; font-size: 14px; }
.submit-row .primary:disabled { background: #b9c8d8; cursor: not-allowed; }
.submit-hint { margin: 10px 0 0; color: #11734d; font-size: 12px; font-weight: 800; }

.list-panel { position: sticky; top: 0; }
.order-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.order-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; display: grid; gap: 6px; }
.ord-top { display: flex; justify-content: space-between; align-items: center; }
.ord-top strong { font-size: 14px; color: #172033; }
.ord-status { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; }
.ord-status.ok { color: #11734d; background: #dff6e8; }
.ord-status.pending { color: #8a5a00; background: #fff2cc; }
.ord-meta { display: flex; gap: 5px; color: #64748b; font-size: 11px; }
.ord-meta .sep { opacity: .6; }
.ord-purpose { margin: 0; font-size: 12px; color: #3e5068; }
.ord-stock { display: flex; justify-content: space-between; align-items: center; }
.ord-stock span { font-size: 12px; color: #1e6fd9; font-weight: 800; }
.ord-stock small { color: #8b9aab; font-size: 11px; }

@media (max-width: 980px) {
  .work-area { grid-template-columns: 1fr; }
  .list-panel { position: static; }
}
</style>
