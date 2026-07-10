<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Components</h2>
      <div class="row" style="gap:6px">
        <button class="amos-btn sm" @click="reopenFilter">查找 / Find</button>
        <button class="amos-btn sm primary" @click="doNew">New</button>
        <button class="amos-btn sm" @click="doSave" :disabled="!selected">Save</button>
        <button class="amos-btn sm danger" @click="doDelete" :disabled="!selected">Delete</button>
        <button class="amos-btn sm" @click="register">Register as Component</button>
      </div>
    </div>

    <FilterDialog :basic="filterBasic" :advanced="filterAdvanced" @ok="applyFilter" @cancel="applyFilter" v-if="showFilter" />
    <div v-else class="bw-body">
      <section class="bw-list">
        <RecordList ref="listRef" :columns="columns" :rows="viewRows" row-key="id" @select="onSelect" @open="onOpen" />
      </section>
      <section class="bw-detail" v-if="selected">
        <div class="bd-head">
          <strong>{{ selected.number }} — {{ selected.name }}</strong>
          <span class="tag" :class="statusClass(selected.status)">{{ selected.status }}</span>
        </div>
        <RecordDetail :tabs="tabs" :model="selected">
          <!-- 手册 2.2(13)：Jobs 标签页 -->
          <template #extra-jobs>
            <table class="amos-grid sub">
              <thead><tr><th>Job No.</th><th>Description</th><th>Frequency</th><th>Method</th><th>Due</th><th></th></tr></thead>
              <tbody>
                <tr v-for="j in relJobs" :key="j.id">
                  <td>{{ j.jobNo }}</td><td>{{ j.description }}</td><td>{{ j.frequency }}</td><td>{{ j.planningMethod }}</td><td>{{ j.dueDate }}</td>
                  <td><button class="amos-btn xs" @click="viewJob(j)">View</button></td>
                </tr>
                <tr v-if="!relJobs.length"><td colspan="6" class="muted">该部件无关联作业。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.2(15)：Parts 标签页（View 打开 Stock Items）-->
          <template #extra-parts>
            <p class="muted">关联备件（按所属功能位置匹配）。点击 View 打开 Stock Items 窗口。</p>
            <table class="amos-grid sub">
              <thead><tr><th>Item No.</th><th>Description</th><th>Stock Class</th><th>Qty</th><th>Location</th><th></th></tr></thead>
              <tbody>
                <tr v-for="s in relParts" :key="s.id">
                  <td>{{ s.stockItemNo }}</td><td>{{ s.description }}</td><td>{{ s.stockClass }}</td><td class="num">{{ s.quantity }}</td><td>{{ s.location }}</td>
                  <td><button class="amos-btn xs" @click="viewStock(s)">View</button></td>
                </tr>
                <tr v-if="!relParts.length"><td colspan="6" class="muted">无关联备件。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.2(17)：Counters 标签页 -->
          <template #extra-counters>
            <table class="amos-grid sub">
              <thead><tr><th>Counter</th><th>Start</th><th>Zeroed</th><th class="num">Current</th><th class="num">Average/日</th></tr></thead>
              <tbody>
                <tr v-for="r in relCounters" :key="r.id">
                  <td>{{ r.counter }}</td><td>{{ selected.installDate || '—' }}</td><td>—</td><td class="num">{{ r.currentValue }} {{ r.unit }}</td><td class="num">{{ avg(r) }} {{ r.unit }}/d</td>
                </tr>
                <tr v-if="!relCounters.length"><td colspan="5" class="muted">无计数器。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.2(19)：Work Order 标签页 -->
          <template #extra-workorder>
            <table class="amos-grid sub">
              <thead><tr><th>WO No.</th><th>Title</th><th>Resp. Discipline</th><th>Due</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="w in relWO" :key="w.id">
                  <td>{{ w.workOrderNo }}</td><td>{{ w.description }}</td><td>{{ w.functionNo || '—' }}</td><td>{{ w.dueDate }}</td><td>{{ w.status }}</td>
                  <td><button class="amos-btn xs" @click="viewWO(w)">View</button></td>
                </tr>
                <tr v-if="!relWO.length"><td colspan="6" class="muted">该部件无关联工单。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.2(18)：Attachments -->
          <template #extra-attachments>
            <div class="row" style="gap:6px;margin-bottom:8px">
              <button class="amos-btn sm" @click="showToast('已新建附件（原型演示）', 'ok')">New</button>
              <button class="amos-btn sm" @click="showToast('查看附件（原型演示）', 'info')">View</button>
            </div>
            <p class="muted">附件可为图纸、Word 或 PDF 等文件。</p>
          </template>
          <!-- 手册 2.2(20)：History -->
          <template #extra-history>
            <table class="amos-grid sub">
              <thead><tr><th>WO No.</th><th>Description</th><th>Completed Due</th><th>Status</th></tr></thead>
              <tbody>
                <tr v-for="w in relHistory" :key="w.id"><td>{{ w.workOrderNo }}</td><td>{{ w.description }}</td><td>{{ w.dueDate }}</td><td>{{ w.status }}</td></tr>
                <tr v-if="!relHistory.length"><td colspan="4" class="muted">暂无历史记录。</td></tr>
              </tbody>
            </table>
          </template>
          <!-- 手册 2.2(21)：Maintenance Log -->
          <template #extra-maintlog>
            <table class="amos-grid sub">
              <thead><tr><th>Date</th><th>WO No.</th><th>Description</th><th>Status</th></tr></thead>
              <tbody>
                <tr v-for="(l, i) in relLog" :key="i"><td>{{ l.date }}</td><td>{{ l.wo }}</td><td>{{ l.desc }}</td><td>{{ l.status }}</td></tr>
                <tr v-if="!relLog.length"><td colspan="4" class="muted">暂无维护记录。</td></tr>
              </tbody>
            </table>
          </template>
        </RecordDetail>
      </section>
      <section v-else class="bw-detail empty"><p class="muted">双击列表行查看明细，或点击 New 创建组件。</p></section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import FilterDialog from '../components/FilterDialog.vue'
import RecordList from '../components/RecordList.vue'
import RecordDetail from '../components/RecordDetail.vue'
import { db } from '../mock/index.js'
import { store, openWindow, showToast, setPresetFilter } from '../store.js'
import { onMounted, onBeforeUnmount } from 'vue'
import { matchRow } from '../utils/filter.js'

// 手册 2.2(2-9)：查找窗口——Name / 编码 + Advanced（部件状态、位置、部件类型、Function Performing）
const filterBasic = [
  { key: 'number', label: 'Number（编码）', type: 'text', placeholder: '如 C-100%' },
  { key: 'name', label: 'Name', type: 'text', placeholder: '如 %Boiler' },
]
const filterAdvanced = [
  { key: 'status', label: 'Component Status', type: 'select', options: ['In Use', 'Available', 'Transferred', 'Scrapped'] },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'typeNumber', label: 'Component Type', type: 'text' },
  { key: 'functionNo', label: 'Function Performing', type: 'text' },
]
const columns = [
  { key: 'number', label: 'Number', width: '110px' },
  { key: 'name', label: 'Name' },
  { key: 'typeNumber', label: 'Type No.', width: '110px' },
  { key: 'status', label: 'Status', width: '100px', tag: true },
  { key: 'maker', label: 'Maker', width: '100px' },
  { key: 'location', label: 'Location', width: '110px' },
  { key: 'functionNo', label: 'Function', width: '110px' },
]
const statuses = ['In Use', 'Available', 'Transferred', 'Scrapped']
const tabs = [
  { id: 'general', label: 'General', fields: [
    { key: 'number', label: 'Number' },
    { key: 'typeNumber', label: 'Type Number', type: 'lookup', lookupKey: 'componentTypes' },
    { key: 'name', label: 'Name' },
    { key: 'serialNo', label: 'Serial No.' },
    { key: 'maker', label: 'Maker' },
    { key: 'type', label: 'Type' },
    { key: 'functionNo', label: 'Function', type: 'lookup', lookupKey: 'functions' },
    { key: 'status', label: 'Status', type: 'select', options: statuses },
  ] },
  { id: 'type', label: 'Type Details', fields: [
    { key: 'vendor', label: 'Vendor' },
    { key: 'location', label: 'Location' },
    { key: 'parentComponent', label: 'Parent Component' },
    { key: 'installDate', label: 'Install Date', type: 'date' },
  ] },
  { id: 'jobs', label: 'Jobs', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '所选部件要求实施的维护保养工作（含继承的类型作业）。' }] },
  { id: 'parts', label: 'Parts', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '与所选部件相关联的备件。' }] },
  { id: 'counters', label: 'Counters', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '所选部件的运行时间（开始于、归零、平均值）。' }] },
  { id: 'workorder', label: 'Work Order', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '与所选部件相关联的工单。' }] },
  { id: 'attachments', label: 'Attachments', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '部件附加文件 / 图纸。' }] },
  { id: 'history', label: 'History', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '所选部件的所有历史工作内容。' }] },
  { id: 'maintlog', label: 'Maintenance Log', fields: [{ key: '_note', label: '说明', type: 'readonly', value: '对该设备工单做的任何汇报记录。' }] },
]

const all = computed(() => db.components)
const viewRows = ref([])
const showFilter = ref(false)
const selected = ref(null)

const relJobs = computed(() => {
  if (!selected.value) return []
  const no = selected.value.number, tno = selected.value.typeNumber
  return db.jobs.filter((j) => (j.targetType === 'Component' && j.targetId === no) || (j.targetType === 'ComponentType' && j.targetId === tno))
})
const relParts = computed(() => !selected.value ? [] : db.stockItems.filter((s) => s.functionNo && s.functionNo === selected.value.functionNo))
const relCounters = computed(() => !selected.value ? [] : db.counterLogs.filter((r) => r.component === selected.value.number))
const relWO = computed(() => !selected.value ? [] : db.workOrders.filter((w) => w.componentId === selected.value.number))
const relHistory = computed(() => relWO.value.filter((w) => w.status === 'Completed'))
const relLog = computed(() => relWO.value.map((w) => ({ date: w.dueDate, wo: w.workOrderNo, desc: w.description, status: w.status })))

function avg(r) {
  const base = selected.value?.installDate || r.readingDate
  let days = 365
  if (base) { const d = (new Date(r.readingDate) - new Date(base)) / 86400000; if (d > 0) days = d }
  return (r.currentValue / days).toFixed(1)
}

watch(() => store.activeKey, () => { selected.value = null; applyPreset() })

function applyPreset() {
  if (store.presetFilter) { applyFilter(store.presetFilter); setPresetFilter(null) }
  else viewRows.value = all.value.slice()
}

function applyFilter(c) {
  showFilter.value = false
  const crit = c || {}
  viewRows.value = all.value.filter((r) => matchRow(r, [...filterBasic, ...filterAdvanced], crit))
}
function reopenFilter() { selected.value = null; showFilter.value = true }
function onSelect(r) { selected.value = r }
function onOpen(r) { selected.value = r }
function viewJob(j) { showToast('查看作业：' + j.jobNo + '（原型演示）', 'info') }
function viewStock(s) { setPresetFilter({ stockItemNo: s.stockItemNo }); openWindow('stock-items') }
function viewWO(w) { setPresetFilter({ workOrderNo: w.workOrderNo }); openWindow('work-orders') }
function doNew() {
  const rec = { id: 'new_' + Date.now(), number: 'C-' + Math.floor(Math.random() * 90000 + 10000), name: '', typeNumber: '', status: 'In Use', maker: '', type: '', serialNo: '', location: '', functionNo: '', vendor: '', parentComponent: '', installDate: '' }
  all.value.push(rec); viewRows.value = [...viewRows.value, rec]; selected.value = rec
  showToast('已新建组件，编辑后 Save', 'ok')
}
function doSave() { if (selected.value) showToast('已保存（内存态）', 'ok') }
function doDelete() {
  if (!selected.value) return
  const i = all.value.findIndex((r) => r.id === selected.value.id)
  if (i >= 0) all.value.splice(i, 1)
  selected.value = null; applyFilter({})
  showToast('已删除', 'warn')
}
function register() { showToast('Register as Component：选择 Installation / Department 后生成组件（原型演示）', 'info') }
function onAction(e) { if (e.detail?.action === 'filter') reopenFilter() }
onMounted(() => { window.addEventListener('amos-action', onAction); applyPreset() })
onBeforeUnmount(() => window.removeEventListener('amos-action', onAction))
function statusClass(v) {
  const s = String(v).toLowerCase()
  if (/(in use|available|active)/.test(s)) return 'green'
  if (/(transferred)/.test(s)) return 'blue'
  if (/(scrapped|obsolete)/.test(s)) return 'red'
  return 'gray'
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
.bd-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--amos-border); }
.sub { margin-top: 8px; }
.sub .amos-btn.xs { padding: 2px 8px; font-size: 11px; }
@media (max-width: 980px) { .bw-body { grid-template-columns: 1fr; } .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); } }
</style>
