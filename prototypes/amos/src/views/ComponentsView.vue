<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Components</h2>
      <span v-if="globalMode" class="scope-badge global-badge" title="手册 P21-23：Global 模式 — 跨 Department 搜索">🌐 Global：{{ globalDepts.length }} Dept</span>
      <span v-else class="scope-badge" title="手册 P20：窗口仅显示当前 Department 范围内的记录">范围：{{ store.department }}</span>
      <div class="row" style="gap:6px">
        <button class="amos-btn sm" @click="reopenFilter">查找 / Find</button>
        <button class="amos-btn sm primary" @click="doNew">New</button>
        <button class="amos-btn sm" @click="doSave" :disabled="!selected">Save</button>
        <button class="amos-btn sm danger" @click="doDelete" :disabled="!selected">Delete</button>
        <div class="bw-options">
          <button class="amos-btn sm" @click="optionsOpen = !optionsOpen">Options ▾</button>
          <div v-if="optionsOpen" class="bw-options-menu" @mouseleave="optionsOpen = false">
            <button @click="copyComponent">Copy</button>
            <button @click="changeStatus">Change Status</button>
          </div>
        </div>
      </div>
    </div>

    <FilterDialog :basic="filterBasic" :advanced="filterAdvanced" @ok="applyFilter" @cancel="applyFilter" v-if="showFilter" />

    <!-- Open Record 对话框 -->
    <div v-if="showOpenDialog" class="open-dialog-overlay">
      <div class="open-dialog">
        <h3>Open Record — Components</h3>
        <p class="muted">输入 Number（编码）以定位并打开该组件。</p>
        <div class="amos-field"><label>Number</label><div class="ctrl"><input ref="openInputRef" class="amos-input" v-model="openKeyValue" @keydown.enter="confirmOpen" placeholder="如 C-10001" /></div></div>
        <div class="od-actions"><button class="amos-btn" @click="showOpenDialog = false">Cancel</button><button class="amos-btn primary" @click="confirmOpen">OK</button></div>
      </div>
    </div>

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
          <!-- 手册 2.2(17)：Counters 标签页（已改为 subgrid 可编辑，见 tabs 配置） -->
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
import { ref, computed, watch, onMounted, onActivated, onBeforeUnmount, nextTick } from 'vue'
import FilterDialog from '../components/FilterDialog.vue'
import RecordList from '../components/RecordList.vue'
import RecordDetail from '../components/RecordDetail.vue'
import { db } from '../mock/index.js'
import { store, openWindow, showToast, setPresetFilter, scopeByDepartment } from '../store.js'
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
const columnsBase = [
  { key: 'number', label: 'Number', width: '110px' },
  { key: 'name', label: 'Name' },
  { key: 'typeNumber', label: 'Type No.', width: '110px' },
  { key: 'status', label: 'Status', width: '100px', tag: true },
  { key: 'maker', label: 'Maker', width: '100px' },
  { key: 'location', label: 'Location', width: '110px' },
  { key: 'functionNo', label: 'Function', width: '110px' },
]
// 手册 P23：Global 模式下列表新增 Inst/Dept 列
const columns = computed(() => {
  const base = [...columnsBase]
  if (globalMode.value) base.splice(1, 0, { key: '_instDept', label: 'Inst / Dept', width: '130px' })
  return base
})
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
  { id: 'jobs', label: 'Jobs', fields: [] },
  { id: 'parts', label: 'Parts', fields: [] },
  // 手册 2 / P44：Counters 标签（New/Delete、继承自组件类型、含 Depends On）
  {
    id: 'counters', label: 'Counters', type: 'subgrid',
    subKey: 'componentCounters',
    columns: [
      { key: 'code', label: 'Counter Code', width: '120px', default: '' },
      { key: 'description', label: 'Description', default: '' },
      { key: 'unit', label: 'Unit', width: '70px', default: '' },
      { key: 'dependsOn', label: 'Depends On', type: 'lookup', lookupKey: 'components', width: '140px', default: '', placeholder: '依赖组件' },
      { key: 'startValue', label: 'Start', width: '70px', default: 0, type: 'number' },
      { key: 'currentValue', label: 'Current', width: '80px', default: 0, type: 'number' },
    ],
  },
  // 手册 2 / P45：Measure Points 独立标签（New/Delete、继承自组件类型）
  {
    id: 'measurePoints', label: 'Measure Points', type: 'subgrid',
    subKey: 'componentMeasurePoints',
    columns: [
      { key: 'code', label: 'Point Code', width: '120px', default: '' },
      { key: 'description', label: 'Description', default: '' },
      { key: 'trend', label: 'Trend', type: 'select', width: '90px', options: ['Up', 'Down', 'Stable'], default: 'Stable' },
      { key: 'value', label: 'Value', width: '80px', default: '', type: 'number' },
      { key: 'lastReadDate', label: 'Last Read', type: 'date', width: '110px', default: '' },
    ],
  },
  { id: 'workorder', label: 'Work Order', fields: [] },
  { id: 'attachments', label: 'Attachments', fields: [] },
  { id: 'history', label: 'History', fields: [] },
  { id: 'maintlog', label: 'Maintenance Log', fields: [] },
]

const all = computed(() => db.components)
const viewRows = ref([])
const showFilter = ref(false)
const selected = ref(null)
// Options 菜单状态（手册 P42-43：Copy / ChangeStatus）
const optionsOpen = ref(false)
// 手册 P21-23：Global Search 状态
const globalMode = ref(false)
const globalDepts = ref([])
// Open Record 对话框
const showOpenDialog = ref(false)
const openKeyValue = ref('')
const openInputRef = ref(null)

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

// 不再于 activeKey 变化时硬重置；改用 onActivated：仅当存在 presetFilter（View 跳转 / Dashboard 告警带入）时才应用，否则保留窗口上下文
watch(() => store.department, () => { selected.value = null; applyPreset() })

function applyPreset() {
  if (store.presetFilter) { applyFilter(store.presetFilter); setPresetFilter(null) }
  else viewRows.value = scopeRows(all.value)
}

// 手册 P21-23：Global 模式下按选中的 Dept 过滤（跨 Dept）；普通模式用 scopeByDepartment
function scopeRows(rows) {
  if (globalMode.value && globalDepts.value.length) {
    return rows.filter((r) => !r.department || globalDepts.value.includes(r.department))
  }
  return scopeByDepartment(rows)
}

function applyFilter(c) {
  showFilter.value = false
  const crit = c || {}
  // 提取 Global Search 状态
  globalMode.value = !!crit._globalSearch
  globalDepts.value = crit._globalDepts || []
  const filtered = all.value.filter((r) => matchRow(r, [...filterBasic, ...filterAdvanced], crit))
  viewRows.value = scopeRows(filtered).map((r) => ({
    ...r,
    _instDept: (r.department || store.department), // Global 模式下的 Inst/Dept 列值
  }))
}
function reopenFilter() { selected.value = null; showFilter.value = true }
function onSelect(r) {
  selected.value = r
  // 手册 2 / P44-45：Counters / Measure Points 继承自组件类型（首次选择时从类型拷贝）
  const ct = db.componentTypes.find((c) => c.typeNumber === r.typeNumber)
  if (!r.componentCounters && ct?.counters?.length) {
    r.componentCounters = ct.counters.map((c) => ({ ...c, startValue: 0, currentValue: 0 }))
  }
  if (!r.componentMeasurePoints && ct?.measurePoints) {
    // measurePoints 在类型中是数字，这里转为子表
    r.componentMeasurePoints = Array(ct.measurePoints || 0).fill(null).map(() => ({ code: '', description: '', trend: 'Stable', value: '', lastReadDate: '' }))
  }
}
function onOpen(r) { selected.value = r }
function viewJob(j) { showToast('查看作业：' + j.jobNo + '（原型演示）', 'info') }
function viewStock(s) { setPresetFilter({ stockItemNo: s.stockItemNo }); openWindow('stock-items') }
function viewWO(w) { setPresetFilter({ workOrderNo: w.workOrderNo }); openWindow('work-orders') }
function doNew() {
  const rec = { id: 'new_' + Date.now(), number: 'C-' + Math.floor(Math.random() * 90000 + 10000), name: '', typeNumber: '', status: 'In Use', maker: '', type: '', serialNo: '', location: '', department: store.department, functionNo: '', vendor: '', parentComponent: '', installDate: '' }
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
// 手册 2 / P43：Options > Copy 复制组件（选条目 + 新编号 + Save）
function copyComponent() {
  optionsOpen.value = false
  const t = selected.value
  if (!t) { showToast('请先选择要复制的组件', 'warn'); return }
  const base = { ...t }
  delete base.id
  const m = /^(.*?)(\d+)(\D*)$/.exec(base.number || '')
  base.number = m ? `${m[1]}${String(Number(m[2]) + 1).padStart(m[2].length, '0')}${m[3]}` : `${base.number || 'C'}_COPY`
  base.name = `${base.name || ''} (Copy)`
  base.status = 'Available'
  base.id = 'new_' + Date.now()
  // 深拷贝子表
  base.componentCounters = (t.componentCounters || []).map((x) => ({ ...x }))
  base.componentMeasurePoints = (t.componentMeasurePoints || []).map((x) => ({ ...x }))
  all.value.push(base)
  viewRows.value = [...viewRows.value, base]
  selected.value = base
  showToast('已复制组件：请修改 Number 后 Save（手册 P43：Options > Copy）', 'ok')
}
// 手册 2 / P43：Options > ChangeStatus
function changeStatus() {
  optionsOpen.value = false
  const s = selected.value
  if (!s) { showToast('请先选择组件', 'warn'); return }
  const next = { 'In Use': 'Available', 'Available': 'In Use', 'Transferred': 'Scrapped', 'Scrapped': 'In Use' }[s.status]
  if (next) { s.status = next; showToast(`状态已改为 ${next}（手册 P43）`, 'ok') }
}
// Open Record
function doOpen() {
  if (showFilter.value) return
  openKeyValue.value = ''
  showOpenDialog.value = true
}
function confirmOpen() {
  const val = openKeyValue.value.trim()
  if (!val) return showToast('请输入 Number', 'warn')
  const rec = all.value.find((r) => String(r.number || '').toLowerCase() === val.toLowerCase())
  if (!rec) return showToast(`未找到 Number 为「${val}」的组件`, 'warn')
  if (!viewRows.value.find((r) => r.id === rec.id)) viewRows.value = [...viewRows.value, rec]
  selected.value = rec; showOpenDialog.value = false
  showToast(`已打开组件：${rec.number}`, 'ok')
}
function onAction(e) { const a = e.detail?.action; if (a === 'filter') reopenFilter(); if (a === 'new') doNew(); if (a === 'open') doOpen() }
onMounted(() => { window.addEventListener('amos-action', onAction); applyPreset() })
// keep-alive 激活时：若带 presetFilter（来自 Component Types 的 View 跳转）则应用并自动选中目标组件，否则保留之前选中的上下文
onActivated(() => { if (store.presetFilter) applyPreset() })
onBeforeUnmount(() => window.removeEventListener('amos-action', onAction))
watch(showOpenDialog, (v) => { if (v) nextTick(() => openInputRef.value?.focus()) })
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
.scope-badge { font-size: 11.5px; color: #1f6fb2; background: #e8f2fb; border: 1px solid #b9d8f0; border-radius: 999px; padding: 2px 10px; }
.global-badge { color: #0e6a30; background: #e4f7e8; border-color: #95d5a9; }
.bw-body { flex: 1; display: grid; grid-template-columns: 1.4fr 1fr; min-height: 0; }
.bw-list { border-right: 1px solid var(--amos-border); padding: 8px; min-height: 0; display: flex; }
.bw-list > * { flex: 1; }
.bw-detail { padding: 10px; overflow: auto; }
.bw-detail.empty { display: flex; align-items: center; justify-content: center; }
.bd-head { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 1px dashed var(--amos-border); }
.sub { margin-top: 8px; }
.sub .amos-btn.xs { padding: 2px 8px; font-size: 11px; }
/* Options 菜单 */
.bw-options { position: relative; }
.bw-options-menu { position: absolute; right: 0; top: 30px; background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 6px; box-shadow: var(--amos-shadow); z-index: 50; min-width: 180px; padding: 4px; }
.bw-options-menu button { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 12.5px; }
.bw-options-menu button:hover { background: var(--amos-blue-soft); }
@media (max-width: 980px) { .bw-body { grid-template-columns: 1fr; } .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); } }
/* Open Record 对话框 */
.open-dialog-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.25); display: flex; align-items: center; justify-content: center; z-index: 40; }
.open-dialog { background: #fff; border-radius: 10px; box-shadow: var(--amos-shadow); width: 420px; padding: 20px 24px; }
.open-dialog h3 { margin: 0 0 8px; font-size: 15px; color: #2c486a; }
.open-dialog .amos-field { margin-top: 12px; }
.od-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
</style>
