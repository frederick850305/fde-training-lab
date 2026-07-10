<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Stock Items</h2>
      <div class="row" style="gap:6px">
        <button class="amos-btn sm" @click="reopenFilter">查找 / Find</button>
        <button class="amos-btn sm primary" @click="doNew">New</button>
        <button class="amos-btn sm" @click="doMove" :disabled="!selected">Move</button>
        <button class="amos-btn sm" @click="setStatus" :disabled="!selected">Set Status</button>
        <button class="amos-btn sm" @click="viewPH">View Purchase History</button>
      </div>
    </div>

    <FilterDialog :basic="filterBasic" :advanced="filterAdvanced" @ok="applyFilter" @cancel="applyFilter" v-if="showFilter" />
    <div v-else class="bw-body">
      <section class="bw-list"><RecordList :columns="columns" :rows="viewRows" row-key="id" @select="onSelect" @open="onOpen" /></section>
      <section class="bw-detail" v-if="selected">
        <div class="bd-head"><strong>{{ selected.stockItemNo }}</strong><span class="tag" :class="statusClass(selected.status)">{{ selected.status }}</span></div>
        <RecordDetail :tabs="tabs" :model="selected">
          <!-- 手册 2.3(6)：Outstanding Forms -->
          <template #extra-forms>
            <p class="muted">该材料仍处于采购 / 询价阶段的申请单或采购单。</p>
            <table class="amos-grid sub">
              <thead><tr><th>Form No.</th><th>Type</th><th>Status</th><th class="num">Qty</th><th>Vendor</th></tr></thead>
              <tbody>
                <tr v-for="f in relForms" :key="f.formNo + f.partNo">
                  <td>{{ f.formNo }}</td><td>{{ f.type }}</td><td>{{ f.status }}</td><td class="num">{{ f.quantity }}</td><td>{{ f.vendor }}</td>
                </tr>
                <tr v-if="!relForms.length"><td colspan="5" class="muted">无进行中的申请单 / 采购单。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.3(7)：Stock Transactions -->
          <template #extra-tx>
            <table class="amos-grid sub">
              <thead><tr><th>TX No.</th><th>Type</th><th class="num">Qty</th><th>From</th><th>To</th><th>Date</th></tr></thead>
              <tbody>
                <tr v-for="t in relTx" :key="t.id">
                  <td>{{ t.transactionNo }}</td><td>{{ t.type }}</td><td class="num">{{ t.quantity }}</td><td>{{ t.fromLocation || '—' }}</td><td>{{ t.toLocation }}</td><td>{{ t.date }}</td>
                </tr>
                <tr v-if="!relTx.length"><td colspan="6" class="muted">无库存变更记录。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.3(8)：Component -->
          <template #extra-component>
            <p class="muted">所选备件用于以下设备 / 部件（按功能位置匹配）。</p>
            <table class="amos-grid sub">
              <thead><tr><th>Number</th><th>Name</th><th>Function</th><th>Status</th></tr></thead>
              <tbody>
                <tr v-for="c in relComponents" :key="c.id"><td>{{ c.number }}</td><td>{{ c.name }}</td><td>{{ c.functionNo }}</td><td>{{ c.status }}</td></tr>
                <tr v-if="!relComponents.length"><td colspan="4" class="muted">无关联设备。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.3(9)：Attachments -->
          <template #extra-attachments>
            <div class="row" style="gap:6px;margin-bottom:8px">
              <button class="amos-btn sm" @click="showToast('已添加附件（原型演示）', 'ok')">New</button>
              <button class="amos-btn sm" @click="showToast('查看附件（原型演示）', 'info')">View</button>
            </div>
            <p class="muted">附件可为图片或 Word 文件等，用于补充材料描述。</p>
          </template>
          <!-- 手册 2.3(10)：Overview（过去 5 年存耗）-->
          <template #extra-overview>
            <p class="muted">过去 5 年所选材料的存耗概况（手册 2.3(10)）。</p>
            <table class="amos-grid sub">
              <thead><tr><th>Year</th><th class="num">Opening</th><th class="num">In</th><th class="num">Out</th><th class="num">Closing</th></tr></thead>
              <tbody>
                <tr v-for="o in overview" :key="o.year">
                  <td>{{ o.year }}</td><td class="num">{{ o.opening }}</td><td class="num">{{ o.in }}</td><td class="num">{{ o.out }}</td><td class="num">{{ o.closing }}</td>
                </tr>
              </tbody>
            </table>
          </template>
        </RecordDetail>
      </section>
      <section v-else class="bw-detail empty"><p class="muted">双击列表行查看库存项明细。</p></section>
    </div>

    <Modal v-if="moveOpen" title="Move Stock Item" width="420px" @close="moveOpen = false">
      <div class="amos-field"><label>Item</label><div class="ctrl"><input class="amos-input" :value="selected?.stockItemNo" readonly /></div></div>
      <div class="amos-field"><label>To Location</label><div class="ctrl"><input class="amos-input" v-model="moveTo" placeholder="目标库位" /></div></div>
      <div class="amos-field"><label>Quantity</label><div class="ctrl"><input class="amos-input" type="number" v-model.number="moveQty" /></div></div>
      <template #footer>
        <button class="amos-btn" @click="moveOpen = false">Cancel</button>
        <button class="amos-btn primary" @click="confirmMove">OK</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import FilterDialog from '../components/FilterDialog.vue'
import RecordList from '../components/RecordList.vue'
import RecordDetail from '../components/RecordDetail.vue'
import Modal from '../components/Modal.vue'
import { db, uid } from '../mock/index.js'
import { store, showToast, setPresetFilter } from '../store.js'
import { matchRow } from '../utils/filter.js'

// 手册 2.3(2)：查找窗口——Number(SFI) / Name / Maker / Maker's Ref / Stock Class / Drawing No. / Location
const stockClassOptions = ['Gasket', 'Valve', 'Seal', 'Lubricant', 'Electrical', 'Consumable', 'Medical', 'Spare']
const filterBasic = [
  { key: 'stockItemNo', label: 'Number (SFI)', type: 'text', placeholder: '如 SI-00%' },
  { key: 'description', label: 'Name', type: 'text', placeholder: '如 %Gasket' },
  { key: 'maker', label: 'Maker', type: 'text' },
  { key: 'makerRef', label: "Maker's Ref.", type: 'text' },
  { key: 'stockClass', label: 'Stock Class', type: 'select', options: stockClassOptions },
  { key: 'drawingNo', label: 'Drawing No.', type: 'text' },
  { key: 'location', label: 'Location', type: 'text' },
]
const filterAdvanced = [{ key: 'functionNo', label: 'Function (SFI)', type: 'text' }]
const columns = [
  { key: 'stockItemNo', label: 'Item No.', width: '110px' },
  { key: 'description', label: 'Description' },
  { key: 'stockTypeNo', label: 'Stock Type', width: '110px' },
  { key: 'makerRef', label: "Maker's Ref.", width: '110px' },
  { key: 'stockClass', label: 'Class', width: '90px' },
  { key: 'quantity', label: 'Qty', align: 'right', width: '70px' },
  { key: 'location', label: 'Location', width: '110px' },
  { key: 'status', label: 'Status', width: '100px', tag: true },
  { key: 'unitCost', label: 'Unit Cost', align: 'right', width: '90px' },
]
const tabs = [
  { id: 'general', label: 'General', fields: [
    { key: 'stockItemNo', label: 'Item No.' },
    { key: 'stockTypeNo', label: 'Stock Type', type: 'lookup', lookupKey: 'stockTypes' },
    { key: 'description', label: 'Description' },
    { key: 'maker', label: 'Maker' },
    { key: 'makerRef', label: "Maker's Ref." },
    { key: 'drawingNo', label: 'Drawing No.' },
    { key: 'stockClass', label: 'Stock Class', type: 'select', options: stockClassOptions },
    { key: 'quantity', label: 'Quantity（ROB）', type: 'number' },
    { key: 'location', label: 'Location', type: 'text' },
    { key: 'unitCost', label: 'Unit Cost', type: 'number' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Scrapped'] },
  ] },
  { id: 'type', label: 'Type Details', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '材料的详细描述（备件号 / 型号等特殊信息）。' }] },
  { id: 'vendors', label: 'Vendors', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '所选材料采购或报价相关的供应商历史（来自 Stock Type）。' }] },
  { id: 'forms', label: 'Outstanding Forms', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '处于采购或询价阶段的申请单 / 采购单。' }] },
  { id: 'tx', label: 'Stock Transactions', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '所选备件的所有库存变更记录。' }] },
  { id: 'component', label: 'Component', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '所选备件用于哪些设备。' }] },
  { id: 'attachments', label: 'Attachments', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '附加描述文件。' }] },
  { id: 'overview', label: 'Overview', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '过去 5 年存耗概况。' }] },
]

const stockTypeByNo = computed(() => Object.fromEntries(db.stockTypes.map((s) => [s.stockTypeNo, s])))
const all = computed(() => db.stockItems)
const viewRows = ref([])
const showFilter = ref(false)
const selected = ref(null)
const moveOpen = ref(false)
const moveTo = ref('')
const moveQty = ref(1)

const relForms = computed(() => {
  if (!selected.value) return []
  const tno = selected.value.stockTypeNo
  const out = []
  db.purchaseForms.forEach((f) => f.lineItems.forEach((li) => { if (li.partNo === tno) out.push({ formNo: f.formNo, type: f.type, status: f.status, quantity: li.quantity, vendor: f.vendor }) }))
  return out
})
const relTx = computed(() => !selected.value ? [] : db.transactions.filter((t) => t.stockItem === selected.value.stockItemNo))
const relComponents = computed(() => !selected.value ? [] : db.components.filter((c) => c.functionNo && c.functionNo === selected.value.functionNo))
const overview = computed(() => {
  if (!selected.value) return []
  const now = new Date().getFullYear()
  let closing = selected.value.quantity
  const ins = relTx.value.filter((t) => t.type === 'In').reduce((s, t) => s + t.quantity, 0)
  const outs = relTx.value.filter((t) => t.type === 'Out').reduce((s, t) => s + t.quantity, 0)
  const rows = []
  for (let i = 0; i < 5; i++) {
    const year = now - i
    const out = i === 0 ? outs : Math.round(outs / 5)
    const inn = i === 0 ? ins : Math.round(ins / 5)
    const opening = closing - inn + out
    rows.unshift({ year, opening, in: inn, out, closing })
    closing = opening
  }
  return rows
})

watch(() => store.activeKey, () => { if (store.activeKey === 'stock-items') { selected.value = null; applyPreset() } })

function applyPreset() {
  if (store.presetFilter) { applyFilter(store.presetFilter); setPresetFilter(null) }
  else viewRows.value = all.value.slice()
}

function applyFilter(c) {
  showFilter.value = false
  const crit = c || {}
  viewRows.value = all.value.filter((r) => {
    if (!matchRow(r, filterBasic, crit)) return false
    if (crit.maker) {
      const st = stockTypeByNo.value[r.stockTypeNo]
      if (!st || !String(st.maker ?? '').toLowerCase().includes(String(crit.maker).toLowerCase())) return false
    }
    return true
  })
}
function reopenFilter() { selected.value = null; showFilter.value = true }
function onSelect(r) { selected.value = r }
function onOpen(r) { selected.value = r }
function doNew() {
  const rec = { id: uid('si'), stockItemNo: 'SI-' + Math.floor(Math.random() * 900 + 100), description: '', stockTypeNo: '', maker: '', makerRef: '', drawingNo: '', stockClass: '', functionNo: '', quantity: 0, location: '', status: 'Active', unitCost: 0 }
  all.value.push(rec); viewRows.value = [...viewRows.value, rec]; selected.value = rec; showToast('已新建库存项', 'ok')
}
function doMove() { moveTo.value = ''; moveQty.value = 1; moveOpen.value = true }
function confirmMove() {
  if (selected.value && moveTo.value) {
    const tno = 'TX-' + Math.floor(Math.random() * 9000 + 1000)
    // 指南（手册 3）：移动生成两条事务——来源 Transferred Out、目的 Transferred In
    db.transactions.push({ id: uid('tx'), transactionNo: tno + 'A', type: 'Transferred Out', stockItem: selected.value.stockItemNo, quantity: moveQty.value, fromLocation: selected.value.location, toLocation: moveTo.value, date: new Date().toISOString().slice(0, 10), reference: 'MV' })
    db.transactions.push({ id: uid('tx'), transactionNo: tno + 'B', type: 'Transferred In', stockItem: selected.value.stockItemNo, quantity: moveQty.value, fromLocation: selected.value.location, toLocation: moveTo.value, date: new Date().toISOString().slice(0, 10), reference: 'MV' })
    selected.value.location = moveTo.value
    moveOpen.value = false
    showToast('已移动并生成 Transferred Out / In 交易', 'ok')
  }
}
function setStatus() { showToast('Set Status（原型演示）', 'info') }
function viewPH() { showToast('查看采购历史（原型演示）', 'info') }
function statusClass(v) {
  const s = String(v).toLowerCase()
  if (/(active)/.test(s)) return 'green'
  if (/(obsolete|scrapped)/.test(s)) return 'red'
  return 'gray'
}
function onAction(e) { if (e.detail?.action === 'filter') reopenFilter() }
onMounted(() => { window.addEventListener('amos-action', onAction); applyPreset() })
onBeforeUnmount(() => window.removeEventListener('amos-action', onAction))
</script>

<style scoped>
.biz-win { display: flex; flex-direction: column; height: 100%; }
.bw-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--amos-border); }
.bw-head h2 { margin: 0; font-size: 15px; color: #2c486a; }
.bw-body { flex: 1; display: grid; grid-template-columns: 1.4fr 1fr; min-height: 0; }
.bw-list { border-right: 1px solid var(--amos-border); padding: 8px; min-height: 0; display: flex; }
.bw-list > * { flex: 1; }
.bw-detail { padding: 10px; overflow: auto; }
.bw-detail.empty { display: flex; align-items: center; justify-content: center; }
.bd-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.sub { margin-top: 8px; }
@media (max-width: 980px) { .bw-body { grid-template-columns: 1fr; } .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); } }
</style>
