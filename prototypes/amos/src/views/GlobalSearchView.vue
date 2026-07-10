<template>
  <div class="gs">
    <div class="panel" style="max-width:760px">
      <div class="panel-head"><h3>Global Search</h3><span class="sub">跨 Installation / Department 查询</span></div>
      <div class="panel-body">
        <div class="row" style="gap:8px">
          <input v-model="q" class="amos-input" placeholder="输入组件 / 工单 / 库存 / 采购单号…" style="flex:1" />
          <select v-model="scope" class="amos-select" style="width:160px">
            <option value="">全部对象</option>
            <option v-for="s in scopes" :key="s" :value="s">{{ s }}</option>
          </select>
          <button class="amos-btn primary" @click="run">Search</button>
        </div>

        <div v-if="results.length" class="res">
          <div v-for="r in results" :key="r.key" class="res-row" @click="open(r)">
            <span class="tag gray">{{ r.type }}</span>
            <span class="res-title">{{ r.title }}</span>
            <span class="muted">{{ r.sub }}</span>
          </div>
        </div>
        <p v-else-if="searched" class="muted" style="padding:14px 0">无匹配结果。</p>
        <p v-else class="muted" style="padding:14px 0">输入关键字并点击 Search，或在结果上双击定位。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../mock/index.js'
import { openWindow, showToast } from '../store.js'

const scopes = ['Component', 'Work Order', 'Stock Item', 'Purchase Form', 'Budget']
const q = ref('')
const scope = ref('')
const results = ref([])
const searched = ref(false)

function run() {
  searched.value = true
  const s = q.value.trim().toLowerCase()
  const out = []
  const push = (type, key, title, sub, page) => {
    if (scope.value && scope.value !== type) return
    if (!s || (title + ' ' + sub).toLowerCase().includes(s)) out.push({ type, key, title, sub, page })
  }
  db.components.forEach((c) => push('Component', c.id, c.number + ' ' + c.name, 'Status: ' + c.status, 'components'))
  db.workOrders.forEach((w) => push('Work Order', w.id, w.workOrderNo + ' ' + w.description, 'Status: ' + w.status, 'work-orders'))
  db.stockItems.forEach((i) => push('Stock Item', i.id, i.stockItemNo + ' ' + i.description, 'Qty: ' + i.quantity, 'stock-items'))
  db.purchaseForms.forEach((f) => push('Purchase Form', f.id, f.formNo + ' (' + f.type + ')', 'Status: ' + f.status, 'forms'))
  db.budgets.forEach((b) => push('Budget', b.id, b.code + ' ' + b.title, 'Class: ' + b.class, 'budgets'))
  results.value = out.slice(0, 50)
}
function open(r) {
  openWindow(r.page)
  showToast(`定位到 ${r.type}：${r.title}`, 'ok')
}
</script>

<style scoped>
.gs { padding: 16px; height: 100%; overflow: auto; }
.panel-body { padding: 14px; }
.res { margin-top: 12px; display: grid; gap: 6px; }
.res-row { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border: 1px solid var(--amos-border); border-radius: 6px; cursor: pointer; background: #fff; }
.res-row:hover { border-color: var(--amos-blue); background: #f3f8ff; }
.res-title { font-weight: 700; color: #2b3a4d; }
</style>
