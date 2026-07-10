<template>
  <div class="dash">
    <section class="kpi-grid">
      <div class="kpi" v-for="k in kpis" :key="k.label">
        <span class="kpi-label">{{ k.label }}</span>
        <span class="kpi-num" :class="k.tone">{{ k.value }}</span>
        <span class="kpi-sub">{{ k.sub }}</span>
      </div>
    </section>

    <div class="dash-cols">
      <!-- 告警概览 -->
      <div class="panel">
        <div class="panel-head">
          <h3>Alerts Overview</h3>
          <div class="row" style="gap:6px">
            <button class="amos-btn sm" :class="{ primary: chartType === 'bar' }" @click="chartType = 'bar'">条形图</button>
            <button class="amos-btn sm" :class="{ primary: chartType === 'pie' }" @click="chartType = 'pie'">饼图</button>
          </div>
        </div>
        <div class="panel-body">
          <div v-if="chartType === 'bar'" class="alert-bars">
            <div v-for="a in alerts" :key="a.name" class="alert-row" @dblclick="openAlert(a)" @contextmenu.prevent="openAlert(a)">
              <span class="alert-name">{{ a.group }} · {{ a.name }}</span>
              <div class="bar-track"><div class="bar-fill" :class="a.tone" :style="{ width: (a.number / maxAlert) * 100 + '%' }" /></div>
              <span class="alert-num">{{ a.number }}</span>
            </div>
          </div>
          <div v-else class="pie-wrap">
            <div class="pie" :style="{ background: pieGradient }" />
            <ul class="pie-legend">
              <li v-for="a in alerts" :key="a.name"><i :class="['dot', a.tone]" /> {{ a.name }} <b>({{ a.number }})</b></li>
            </ul>
          </div>
          <p class="hint">双击告警可打开相关业务窗口（原型：跳转至对应模块）。</p>
        </div>
      </div>

      <!-- 通知 -->
      <div class="panel">
        <div class="panel-head"><h3>Notifications</h3></div>
        <div class="panel-body">
          <div v-for="n in notifications" :key="n.module" class="notif-row" @dblclick="openNotif(n)">
            <span class="notif-mod">{{ n.module }}</span>
            <span class="tag blue">{{ n.number }}</span>
          </div>
          <hr class="sep" />
          <div class="quick-links">
            <button v-for="q in quick" :key="q.key" class="amos-btn sm" @click="openWindow(q.key)">{{ q.label }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { db, dashboardAlerts, dashboardNotifications } from '../mock/index.js'
import { openWindow, showToast, setPresetFilter } from '../store.js'

const alerts = dashboardAlerts
const notifications = dashboardNotifications
const chartType = ref('bar')
const maxAlert = computed(() => Math.max(...alerts.map((a) => a.number), 1))

const kpis = computed(() => [
  { label: 'Overdue WO', value: db.workOrders.filter((w) => w.status === 'Overdue').length || 1, sub: '逾期工单', tone: 'red' },
  { label: 'Open WO', value: db.workOrders.filter((w) => ['Requested', 'Planned', 'Issued'].includes(w.status)).length, sub: '进行中工单', tone: 'blue' },
  { label: 'Stock Shortage', value: db.stockWanted.filter((s) => s.currentQty < s.reorderLevel).length, sub: '低于重订水平', tone: 'orange' },
  { label: 'Open Requisitions', value: db.purchaseForms.filter((f) => f.type === 'Requisition' && f.status !== 'Filed').length, sub: '待处理申请', tone: 'blue' },
  { label: 'Budget Used', value: Math.round(((db.budgets.reduce((s, b) => s + b.committed, 0)) / db.budgets.reduce((s, b) => s + b.limit, 0)) * 100) + '%', sub: '预算占用', tone: 'violet' },
])
const quick = [
  { key: 'work-orders', label: 'Work Orders' },
  { key: 'components', label: 'Components' },
  { key: 'wanted', label: 'Stock Wanted' },
  { key: 'forms', label: 'Purchase Forms' },
  { key: 'budgets', label: 'Budget' },
]

const colors = { red: '#d64b54', blue: '#1e6fd9', orange: '#e8853a', green: '#1f9d63', violet: '#8b5cf6' }
const pieGradient = computed(() => {
  let acc = 0
  const segs = alerts.map((a) => {
    const start = acc
    const frac = a.number / alerts.reduce((s, x) => s + x.number, 0)
    acc += frac * 360
    return `${colors[a.tone]} ${start}deg ${acc}deg`
  })
  return `conic-gradient(${segs.join(',')})`
})

function openAlert(a) {
  const map = { Maintenance: 'work-orders', Purchase: 'forms', Stock: 'wanted', Budget: 'budgets' }
  let target = map[a.group] || 'dashboard'
  // 手册 1.5：报价类告警应跳到 Quotations 窗口
  if (a.group === 'Purchase' && /Quotation/.test(a.name)) target = 'quotations'
  // 双击告警直接打开已过滤的列表（手册 1.5：如逾期工单）
  let preset = null
  if (target === 'work-orders') {
    if (/Overdue/.test(a.name)) preset = { planning: 'Overdue' }
    else if (/This Week/.test(a.name)) preset = { planning: 'Due This Week' }
    else if (/Planned/.test(a.name)) preset = { planning: 'Due Now' }
  }
  if (preset) setPresetFilter(preset)
  showToast(`打开 ${a.group} 窗口：${a.name}`, 'info')
  openWindow(target)
}
function openNotif(n) {
  showToast(`打开 Workflow Notifications：${n.module}`, 'info')
}
</script>

<style scoped>
.dash { padding: 16px; display: grid; gap: 16px; overflow: auto; height: 100%; }
.kpi-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
.kpi { background: #fff; border: 1px solid var(--amos-border); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 1px 2px rgba(20,50,90,.05); }
.kpi-label { font-size: 12px; color: var(--amos-text-soft); }
.kpi-num { font-size: 26px; font-weight: 800; }
.kpi-num.red { color: var(--amos-danger); } .kpi-num.blue { color: var(--amos-blue); }
.kpi-num.orange { color: var(--amos-warn); } .kpi-num.violet { color: #8b5cf6; }
.kpi-sub { font-size: 11.5px; color: var(--amos-text-soft); }
.dash-cols { display: grid; grid-template-columns: 1.3fr 1fr; gap: 16px; }
.panel-body { padding: 12px; }
.alert-row { display: grid; grid-template-columns: 200px 1fr 36px; align-items: center; gap: 10px; padding: 5px 0; cursor: pointer; }
.alert-name { font-size: 12.5px; color: #36506e; }
.alert-num { text-align: right; font-weight: 800; font-variant-numeric: tabular-nums; }
.bar-fill.red { background: #d64b54; } .bar-fill.blue { background: #1e6fd9; } .bar-fill.orange { background: #e8853a; } .bar-fill.green { background: #1f9d63; }
.pie-wrap { display: flex; align-items: center; gap: 18px; }
.pie { width: 130px; height: 130px; border-radius: 50%; flex-shrink: 0; }
.pie-legend { list-style: none; margin: 0; padding: 0; font-size: 12.5px; }
.pie-legend li { padding: 3px 0; display: flex; align-items: center; gap: 6px; }
.dot { width: 10px; height: 10px; border-radius: 2px; display: inline-block; }
.dot.red { background: #d64b54; } .dot.blue { background: #1e6fd9; } .dot.orange { background: #e8853a; } .dot.green { background: #1f9d63; } .dot.violet { background: #8b5cf6; }
.hint { font-size: 11.5px; color: var(--amos-text-soft); margin: 10px 0 0; }
.notif-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 4px; border-bottom: 1px dashed var(--amos-border); cursor: pointer; }
.notif-mod { font-size: 12.5px; color: #36506e; }
.quick-links { display: flex; flex-wrap: wrap; gap: 8px; }
@media (max-width: 980px) { .dash-cols { grid-template-columns: 1fr; } }
</style>
