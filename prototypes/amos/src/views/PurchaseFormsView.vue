<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Forms</h2>
      <div class="row" style="gap:6px">
        <select v-model="typeFilter" class="amos-select sm">
          <option value="">全部类型</option>
          <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
        </select>
        <button class="amos-btn sm" @click="newForm">New</button>
        <button class="amos-btn sm primary" @click="convert" :disabled="!selected">Convert</button>
        <button class="amos-btn sm" @click="applyContract" :disabled="!selected">Apply Contract</button>
        <button class="amos-btn sm" @click="print">Print</button>
      </div>
    </div>

    <div class="bw-body">
      <section class="bw-list"><RecordList :columns="columns" :rows="viewRows" row-key="id" @select="onSelect" @open="onOpen" /></section>
      <section class="bw-detail" v-if="selected">
        <div class="bd-head">
          <strong>{{ selected.formNo }}</strong>
          <span class="tag" :class="typeClass(selected.type)">{{ selected.type }}</span>
          <span class="tag blue">{{ selected.status }}</span>
        </div>

        <div class="tab-row">
          <div class="tab" :class="{ active: tab === 'general' }" @click="tab = 'general'">General</div>
          <div class="tab" :class="{ active: tab === 'items' }" @click="tab = 'items'">Line Items</div>
          <div class="tab" :class="{ active: tab === 'cost' }" @click="tab = 'cost'">Costs</div>
        </div>
        <div class="tab-body" style="border-top:none">
          <div v-show="tab === 'general'" class="amos-field" v-for="f in generalFields" :key="f.key">
            <label>{{ f.label }}</label>
            <div class="ctrl">
              <select v-if="f.type === 'select'" v-model="selected[f.key]" class="amos-select">
                <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
              </select>
              <input v-else v-model="selected[f.key]" class="amos-input" />
            </div>
          </div>

          <div v-show="tab === 'items'">
            <table class="amos-grid">
              <thead><tr><th>Part No.</th><th>Description</th><th class="num">Qty</th><th class="num">Unit Price</th><th>Currency</th></tr></thead>
              <tbody>
                <tr v-for="li in selected.lineItems" :key="li.id">
                  <td>{{ li.partNo }}</td><td>{{ li.description }}</td>
                  <td class="num">{{ li.quantity }}</td><td class="num">{{ li.unitPrice }}</td><td>{{ li.currency }}</td>
                </tr>
                <tr v-if="!selected.lineItems.length"><td colspan="5" class="muted" style="text-align:center;padding:12px">无行项目</td></tr>
              </tbody>
            </table>
          </div>

          <div v-show="tab === 'cost'">
            <div class="amos-field"><label>Total Amount</label><div class="ctrl"><input class="amos-input" :value="selected.total" readonly /></div></div>
            <div class="amos-field"><label>Vendor</label><div class="ctrl"><input class="amos-input" :value="selected.vendor" readonly /></div></div>
            <div class="amos-field"><label>Contract</label><div class="ctrl"><input class="amos-input" :value="selected.contract" readonly /></div></div>
          </div>
        </div>
      </section>
      <section v-else class="bw-detail empty"><p class="muted">双击列表行查看采购单：Header + Line Items + 转换流程。</p></section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import RecordList from '../components/RecordList.vue'
import { db, uid } from '../mock/index.js'
import { store, showToast } from '../store.js'

const types = ['Requisition', 'Query', 'PurchaseOrder']
const typeFilter = ref('')
const columns = [
  { key: 'formNo', label: 'Form No.', width: '120px' },
  { key: 'type', label: 'Type', width: '120px', tag: true },
  { key: 'status', label: 'Status', width: '120px', tag: true },
  { key: 'vendor', label: 'Vendor', width: '120px' },
  { key: 'deliveryLocation', label: 'Delivery', width: '120px' },
  { key: 'total', label: 'Total', align: 'right', width: '90px' },
]
const generalFields = [
  { key: 'formNo', label: 'Form No.' },
  { key: 'type', label: 'Type', type: 'select', options: types },
  { key: 'status', label: 'Status', type: 'select', options: ['Draft', 'Awaiting Approval', 'Approved', 'Issued', 'Partly Delivered', 'Received', 'Filed'] },
  { key: 'vendor', label: 'Vendor' },
  { key: 'deliveryLocation', label: 'Delivery Location' },
  { key: 'contract', label: 'Contract' },
  { key: 'createdDate', label: 'Created', type: 'readonly' },
]
const all = computed(() => db.purchaseForms)
const viewRows = ref([])
const selected = ref(null)
const tab = ref('general')
watch(() => store.activeKey, () => { selected.value = null; typeFilter.value = ''; refresh() })

function refresh() {
  viewRows.value = typeFilter.value ? all.value.filter((r) => r.type === typeFilter.value) : all.value
}
watch(typeFilter, refresh)

function onSelect(r) { selected.value = r; tab.value = 'general' }
function onOpen(r) { selected.value = r; tab.value = 'general' }
function newForm() {
  const no = 'REQ-' + Math.floor(Math.random() * 9000 + 1000)
  const rec = { id: uid('pf'), formNo: no, type: 'Requisition', status: 'Draft', vendor: '', deliveryLocation: 'ER-Store-A', contract: '', createdDate: new Date().toISOString().slice(0, 10), lineItems: [], total: 0 }
  all.value.unshift(rec); refresh(); selected.value = rec; showToast('已新建采购申请', 'ok')
}
function convert() {
  if (!selected.value) return
  const order = { Requisition: 'Query', Query: 'PurchaseOrder', PurchaseOrder: 'PurchaseOrder' }
  const next = order[selected.value.type]
  if (next === selected.value.type) return showToast('Purchase Order 已是最终形态', 'info')
  selected.value.type = next
  // 指南（手册 4）：Requisition→Query 为已发出的询价（Issued）；Query→Purchase Order 为新生成的采购单（Draft，待审批）
  selected.value.status = next === 'Query' ? 'Issued' : 'Draft'
  showToast(`已转换为 ${next}`, 'ok')
}
function applyContract() {
  if (selected.value) { selected.value.contract = selected.value.contract || db.contracts[0]?.contractNo || ''; showToast('已应用合同 ' + selected.value.contract, 'ok') }
}
function print() { window.print() }
function typeClass(v) {
  const s = String(v).toLowerCase()
  if (s === 'requisition') return 'blue'
  if (s === 'query') return 'orange'
  return 'green'
}
refresh()
</script>

<style scoped>
.biz-win { display: flex; flex-direction: column; height: 100%; }
.bw-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--amos-border); gap: 8px; flex-wrap: wrap; }
.bw-head h2 { margin: 0; font-size: 15px; color: #2c486a; }
.bw-body { flex: 1; display: grid; grid-template-columns: 1.4fr 1fr; min-height: 0; }
.bw-list { border-right: 1px solid var(--amos-border); padding: 8px; min-height: 0; display: flex; }
.bw-list > * { flex: 1; }
.bw-detail { padding: 10px; overflow: auto; }
.bw-detail.empty { display: flex; align-items: center; justify-content: center; }
.bd-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
@media (max-width: 980px) { .bw-body { grid-template-columns: 1fr; } .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); } }
</style>
