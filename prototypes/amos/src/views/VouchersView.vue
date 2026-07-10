<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Vouchers</h2>
      <div class="row" style="gap:6px">
        <button class="amos-btn sm primary" @click="doNew">New</button>
        <button class="amos-btn sm" @click="calculate" :disabled="!selected">Calculate</button>
        <button class="amos-btn sm" @click="linkForm" :disabled="!selected">Link Form</button>
      </div>
    </div>

    <div class="bw-body">
      <section class="bw-list"><RecordList :columns="columns" :rows="db.vouchers" row-key="id" @select="onSelect" @open="onOpen" /></section>
      <section class="bw-detail" v-if="selected">
        <div class="bd-head"><strong>{{ selected.voucherNo }}</strong><span class="tag" :class="statusClass(selected.status)">{{ selected.status }}</span></div>
        <div class="amos-field"><label>Vendor</label><div class="ctrl"><input class="amos-input" v-model="selected.vendor" /></div></div>
        <div class="amos-field"><label>Form</label><div class="ctrl"><input class="amos-input" v-model="selected.formNo" readonly /></div></div>

        <table class="amos-grid">
          <thead><tr><th>Description</th><th class="num">Qty</th><th class="num">Price</th><th class="num">Amount</th></tr></thead>
          <tbody>
            <tr v-for="li in selected.lineItems || []" :key="li.id">
              <td>{{ li.description }}</td><td class="num">{{ li.quantity }}</td><td class="num">{{ li.unitPrice }}</td><td class="num">{{ li.quantity * li.unitPrice }}</td>
            </tr>
            <tr v-if="!(selected.lineItems || []).length"><td colspan="4" class="muted" style="text-align:center;padding:12px">无行项目</td></tr>
          </tbody>
        </table>

        <hr class="sep" />
        <div class="totals">
          <div class="amos-field"><label>Net</label><div class="ctrl"><input class="amos-input" :value="selected.net" readonly /></div></div>
          <div class="amos-field"><label>VAT</label><div class="ctrl"><input class="amos-input" :value="selected.vat" readonly /></div></div>
          <div class="amos-field"><label>Total</label><div class="ctrl"><input class="amos-input" :value="selected.total" readonly /></div></div>
        </div>
      </section>
      <section v-else class="bw-detail empty"><p class="muted">双击列表行查看发票凭证与金额计算。</p></section>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import RecordList from '../components/RecordList.vue'
import { db, uid } from '../mock/index.js'
import { store, showToast } from '../store.js'

const columns = [
  { key: 'voucherNo', label: 'Voucher No.', width: '120px' },
  { key: 'vendor', label: 'Vendor', width: '120px' },
  { key: 'formNo', label: 'Form(s)', width: '130px' },
  { key: 'net', label: 'Net', align: 'right', width: '90px' },
  { key: 'total', label: 'Total', align: 'right', width: '90px' },
  { key: 'status', label: 'Status', width: '90px', tag: true },
]
// 凭证可关联多张采购单（formNos），统一派生一个展示用字符串
db.vouchers.forEach((v) => { if (Array.isArray(v.formNos) && !('formNo' in v)) v.formNo = v.formNos.join(', ') })
const selected = ref(null)
watch(() => store.activeKey, () => (selected.value = null))
function onSelect(r) { selected.value = r }
function onOpen(r) { selected.value = r }
function doNew() {
  const no = 'VC-' + Math.floor(Math.random() * 9000 + 1000)
  const rec = { id: uid('vc'), voucherNo: no, vendor: '', formNo: '', formNos: [], status: 'Draft', net: 0, vat: 0, total: 0, lineItems: [] }
  db.vouchers.unshift(rec); selected.value = rec; showToast('已新建凭证', 'ok')
}
function calculate() {
  if (!selected.value) return
  const net = (selected.value.lineItems || []).reduce((s, li) => s + li.quantity * li.unitPrice, 0)
  selected.value.net = net
  selected.value.vat = Math.round(net * 0.17)
  selected.value.total = selected.value.net + selected.value.vat
  showToast('已计算 Net / VAT / Total', 'ok')
}
function linkForm() {
  const po = db.purchaseForms.find((f) => f.type === 'PurchaseOrder')
  if (selected.value && po) {
    selected.value.formNos = [po.formNo]
    selected.value.formNo = po.formNo
    selected.value.vendor = po.vendor
    selected.value.lineItems = po.lineItems.map((li) => ({ ...li }))
    showToast('已关联采购单 ' + po.formNo, 'ok')
  }
}
function statusClass(v) {
  const s = String(v).toLowerCase()
  if (s === 'posted') return 'green'
  if (s === 'approved') return 'blue'
  if (s === 'draft') return 'gray'
  return 'blue'
}
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
.totals { background: #f7f9fc; border: 1px solid var(--amos-border); border-radius: 6px; padding: 6px 10px; }
@media (max-width: 980px) { .bw-body { grid-template-columns: 1fr; } .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); } }
</style>
