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
        <div class="bw-options" ref="optionsRef">
          <button class="amos-btn sm" @click="toggleOptions">Options ▾</button>
          <Teleport to="body">
            <div v-if="optionsOpen && optionsRect" class="bw-options-popup" :style="optionsPopupStyle" @mouseleave="optionsOpen = false">
              <button @click="copyComponent">Copy</button>
              <button @click="changeStatus">Change Status</button>
            </div>
          </Teleport>
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
        <RecordDetail :tabs="tabs" :model="selected" @change="onDetailChange">
          <!-- 手册 2.2：Type Details 继承只读信息（来自 Component Type） -->
          <template #extra-type>
            <div class="inherited-box" v-if="inheritedType">
              <p class="muted">以下信息继承自 Component Type（只读参考）：</p>
              <div class="amos-field"><label>Type Name</label><div class="ctrl"><input class="amos-input" :value="inheritedType.name" readonly /></div></div>
              <div class="amos-field"><label>Class Code</label><div class="ctrl"><input class="amos-input" :value="inheritedType.classCode || '—'" readonly /></div></div>
              <div class="amos-field"><label>Preferred Vendor</label><div class="ctrl"><input class="amos-input" :value="inheritedType.preferredVendor || '—'" readonly /></div></div>
            </div>
          </template>
          <!-- 手册 2.2(13)：Jobs 标签页 -->
          <template #extra-jobs>
            <div class="subgrid-bar" style="margin-bottom:8px">
              <button class="amos-btn xs" @click="newJob">New</button>
              <span class="muted">{{ relJobs.length }} 条作业</span>
            </div>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>Job No.</th><th>Description</th><th>Frequency</th><th>Method</th><th>Due</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="j in relJobs" :key="j.id">
                  <td>{{ j.jobNo }}</td><td>{{ j.description }}</td><td>{{ j.frequency }}</td><td>{{ j.planningMethod }}</td><td>{{ j.dueDate }}</td><td>{{ j.status }}</td>
                  <td><button class="amos-btn xs" @click="viewJob(j)">View</button></td>
                </tr>
                <tr v-if="!relJobs.length"><td colspan="7" class="muted">该部件无关联作业。点击 New 创建组件级作业。</td></tr>
              </tbody>
            </table></div>
          </template>
          <!-- 手册 2.2(15)：Parts 标签页（View 打开 Stock Items）-->
          <template #extra-parts>
            <p class="muted">关联备件（按所属功能位置匹配）。点击 View 打开 Stock Items 窗口。</p>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>Item No.</th><th>Description</th><th>Stock Class</th><th>Qty</th><th>Location</th><th>Alt. No.</th><th></th></tr></thead>
              <tbody>
                <tr v-for="s in relParts" :key="s.id">
                  <td>{{ s.stockItemNo }}</td><td>{{ s.description }}</td><td>{{ s.stockClass }}</td><td class="num">{{ s.quantity }}</td><td>{{ s.location }}</td><td>{{ s.alternativeNo || '—' }}</td>
                  <td><button class="amos-btn xs" @click="viewStock(s)">View</button></td>
                </tr>
                <tr v-if="!relParts.length"><td colspan="7" class="muted">无关联备件。</td></tr>
              </tbody>
            </table></div>
          </template>
          <!-- 手册 2.2(17)：Counters 标签页（已改为 subgrid 可编辑，见 tabs 配置） -->
          <!-- 手册 2.2(19)：Work Order 标签页 -->
          <template #extra-workorder>
            <div class="subgrid-bar" style="margin-bottom:8px">
              <button class="amos-btn xs" @click="newWO">Requisition Work</button>
              <span class="muted">{{ relWO.length }} 条工单</span>
            </div>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>WO No.</th><th>Title</th><th>Resp. Discipline</th><th>Due</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="w in relWO" :key="w.id">
                  <td>{{ w.workOrderNo }}</td><td>{{ w.description }}</td><td>{{ w.functionNo || '—' }}</td><td>{{ w.dueDate }}</td><td>{{ w.status }}</td>
                  <td><button class="amos-btn xs" @click="viewWO(w)">View</button></td>
                </tr>
                <tr v-if="!relWO.length"><td colspan="6" class="muted">该部件无关联工单。点击 Requisition Work 创建工单。</td></tr>
              </tbody>
            </table></div>
          </template>
          <!-- 手册 2.2(18)：Attachments -->
          <template #extra-attachments>
            <div class="subgrid-bar" style="margin-bottom:8px">
              <button class="amos-btn xs" @click="addAttachment">New</button>
              <span class="muted">{{ relAttachments.length }} 个附件</span>
            </div>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>Name</th><th>Type</th><th>Size</th><th>Uploaded</th><th></th></tr></thead>
              <tbody>
                <tr v-for="(a, i) in relAttachments" :key="i">
                  <td>{{ a.name }}</td><td>{{ a.type }}</td><td>{{ a.size }}</td><td>{{ a.date }}</td>
                  <td>
                    <button class="amos-btn xs" @click="viewAttachment(a)">View</button>
                    <button class="amos-btn xs danger" @click="delAttachment(i)">Del</button>
                  </td>
                </tr>
                <tr v-if="!relAttachments.length"><td colspan="5" class="muted">暂无附件。图纸、Word 或 PDF 等文件可点击 New 添加。</td></tr>
              </tbody>
            </table></div>
          </template>
          <!-- 手册 2.2(20)：History -->
          <template #extra-history>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>WO No.</th><th>Description</th><th>Completed Due</th><th>Status</th></tr></thead>
              <tbody>
                <tr v-for="w in relHistory" :key="w.id"><td>{{ w.workOrderNo }}</td><td>{{ w.description }}</td><td>{{ w.dueDate }}</td><td>{{ w.status }}</td></tr>
                <tr v-if="!relHistory.length"><td colspan="4" class="muted">暂无历史记录。</td></tr>
              </tbody>
            </table></div>
          </template>
          <!-- 手册 2.2(21)：Maintenance Log（独立日志条目，非复用 WO） -->
          <template #extra-maintlog>
            <div class="subgrid-bar" style="margin-bottom:8px">
              <button class="amos-btn xs" @click="addLog">New</button>
              <span class="muted">{{ relLog.length }} 条日志</span>
            </div>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>Date</th><th>WO No.</th><th>Log Text</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="(l, i) in relLog" :key="i">
                  <td>{{ l.date }}</td><td>{{ l.wo }}</td><td>{{ l.desc }}</td><td>{{ l.status }}</td>
                  <td><button class="amos-btn xs danger" @click="delLog(i)">Del</button></td>
                </tr>
                <tr v-if="!relLog.length"><td colspan="5" class="muted">暂无维护日志。点击 New 添加维护记录。</td></tr>
              </tbody>
            </table></div>
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
    { key: 'componentTypeModel', label: 'Component Type Model' },
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
      { key: 'readingDate', label: 'Reading Date', type: 'date', width: '120px', default: '' },
    ],
  },
  // 手册 2 / P45：Measure Points 独立标签（New/Delete、继承自组件类型）
  {
    id: 'measurePoints', label: 'Measure Points', type: 'subgrid',
    subKey: 'componentMeasurePoints',
    columns: [
      { key: 'code', label: 'Point Code', width: '120px', default: '' },
      { key: 'description', label: 'Description', default: '' },
      { key: 'unit', label: 'Unit', width: '70px', default: '' },
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
const optionsRef = ref(null)
const optionsRect = ref(null)

function toggleOptions() {
  if (!optionsOpen.value && optionsRef.value) {
    const rect = optionsRef.value.getBoundingClientRect()
    optionsRect.value = { top: rect.bottom, left: rect.right }
  }
  optionsOpen.value = !optionsOpen.value
}

const optionsPopupStyle = computed(() => {
  if (!optionsRect.value) return {}
  return { position: 'fixed', top: optionsRect.value.top + 'px', left: (optionsRect.value.left - 180) + 'px' }
})
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
const relLog = computed(() => selected.value?.maintenanceLog || [])
const relAttachments = computed(() => selected.value?.attachments || [])
// 手册 2.2：Type Details 继承自 Component Type 的只读参考信息
const inheritedType = computed(() => {
  if (!selected.value?.typeNumber) return null
  return db.componentTypes.find((c) => c.typeNumber === selected.value.typeNumber) || null
})

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
  // 手册 2 / P30：从 Component Types 的 Components 标签 View 跳入时，
  // 预设过滤命中单条组件则自动选中并加载继承的 Counters / Measure Points
  if (selected.value === null && viewRows.value.length === 1) {
    onSelect(viewRows.value[0])
  }
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
  if (!r.componentMeasurePoints && ct?.measurePointDefs?.length) {
    // 从组件类型的 Measure Points 标签定义继承为组件级可编辑子表
    r.componentMeasurePoints = ct.measurePointDefs.map((m) => ({ ...m, value: '', lastReadDate: '' }))
  }
}
function onOpen(r) { selected.value = r }
// 手册 2 / P42-43：General 选择 Type Number 后，自动从 Component Type 带出
// Maker / Type / Name 等基础信息并填充到 General 单元格（继承类型默认值的级联）
function onDetailChange(e) {
  if (!e || e.key !== 'typeNumber' || !selected.value) return
  const ct = db.componentTypes.find((c) => c.typeNumber === e.value)
  if (!ct) return
  selected.value.maker = ct.maker || ''
  selected.value.type = ct.type || ''
  if (!selected.value.name) selected.value.name = ct.name || ''
}
function viewJob(j) { showToast('查看作业：' + j.jobNo + '（原型演示）', 'info') }
function viewStock(s) { setPresetFilter({ stockItemNo: s.stockItemNo }); openWindow('stock-items') }
function viewWO(w) { setPresetFilter({ workOrderNo: w.workOrderNo }); openWindow('work-orders') }
// 手册 2.2(13)：从 Components 窗口创建组件级作业
function newJob() {
  const t = selected.value
  if (!t) return showToast('请先选择组件', 'warn')
  const job = { id: 'new_' + Date.now(), jobNo: 'J-' + Math.floor(Math.random()*90000+10000), description: (t.name || t.number) + ' — 维护作业', frequency: 'Monthly', planningMethod: 'Time', dueDate: new Date(Date.now()+30*86400000).toISOString().slice(0,10), status: 'Planned', targetType: 'Component', targetId: t.number }
  db.jobs.push(job)
  showToast('已创建组件级作业：' + job.jobNo + '（原型模拟）', 'ok')
}
// 手册 2.2(18)：附件管理——模拟新增 / 查看 / 删除
function addAttachment() {
  const t = selected.value
  if (!t) return showToast('请先选择组件', 'warn')
  const f = ['Pump_Drawing.dwg', 'Manual_v2.pdf', 'Inspection.docx', 'Photo.jpg'][Math.floor(Math.random()*4)]
  if (!t.attachments) t.attachments = []
  t.attachments.push({ name: f, type: f.split('.').pop().toUpperCase(), size: (Math.random()*5+0.5).toFixed(1)+' MB', date: new Date().toISOString().slice(0,10) })
  showToast('已添加附件（原型模拟）：' + f, 'ok')
}
function viewAttachment(a) { showToast('查看附件：' + a.name + '（原型演示）', 'info') }
function delAttachment(i) { selected.value.attachments.splice(i, 1); showToast('已删除附件', 'warn') }
// 手册 2.2(21)：Maintenance Log 独立日志条目（非复用 WO）
function addLog() {
  const t = selected.value
  if (!t) return showToast('请先选择组件', 'warn')
  if (!t.maintenanceLog) t.maintenanceLog = []
  t.maintenanceLog.push({ date: new Date().toISOString().slice(0,10), wo: 'WO-' + Math.floor(Math.random()*90000+10000), desc: '维护记录：' + (t.name || t.number), status: 'Completed' })
  showToast('已添加维护日志（原型模拟）', 'ok')
}
function delLog(i) { selected.value.maintenanceLog.splice(i, 1); showToast('已删除日志', 'warn') }
// 手册 2.2(19)：从 Components 窗口手工创建工单
function newWO() {
  const t = selected.value
  if (!t) return showToast('请先选择组件', 'warn')
  const wo = { id: 'new_' + Date.now(), workOrderNo: 'WO-' + Math.floor(Math.random()*90000+10000), description: '维修工单：' + (t.name || t.number), functionNo: t.functionNo || '—', dueDate: new Date(Date.now()+14*86400000).toISOString().slice(0,10), status: 'Issued', componentId: t.number }
  db.workOrders.push(wo)
  showToast('已创建工单：' + wo.workOrderNo + '（原型模拟）', 'ok')
}
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
.bw-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--amos-border); gap: 8px; }
.bw-head h2 { margin: 0; font-size: 15px; color: #2c486a; flex-shrink: 0; }
/* 按钮行：空间不足时可横向滚动，确保所有按钮始终可见 */
.bw-head .row { display: flex; gap: 6px; overflow-x: auto; flex-shrink: 1; min-width: 0; scrollbar-width: thin; }
.bw-head .row::-webkit-scrollbar { height: 4px; }
.bw-head .row::-webkit-scrollbar-thumb { background: #c2d2e8; border-radius: 2px; }
.scope-badge { font-size: 11.5px; color: #1f6fb2; background: #e8f2fb; border: 1px solid #b9d8f0; border-radius: 999px; padding: 2px 10px; }
.global-badge { color: #0e6a30; background: #e4f7e8; border-color: #95d5a9; }
.bw-body { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.bw-list { border-bottom: 1px solid var(--amos-border); padding: 8px; min-height: 0; max-height: 40%; overflow: hidden; }
.bw-list > * { height: 100%; min-height: 0; }
.bw-detail { padding: 10px; overflow-y: auto; flex: 1; min-height: 0; }
.bw-detail.empty { display: flex; align-items: center; justify-content: center; }
/* slot 内按钮栏与继承信息框（scoped 不继承 RecordDetail 样式，需本组件定义） */
.subgrid-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.inherited-box { border: 1px dashed var(--amos-border); border-radius: 6px; padding: 10px; margin-bottom: 10px; background: #fafcff; }
.inherited-box .amos-field { margin-top: 6px; }
/* Options 菜单（浮层 popup） */
.bw-options { position: relative; }
.bw-options-popup { background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,.18); z-index: 9999; min-width: 180px; padding: 4px; }
.bw-options-popup button { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 12.5px; }
.bw-options-popup button:hover { background: var(--amos-blue-soft); }
/* 上下布局，无需响应式切换 */
/* Open Record 对话框 */
.open-dialog-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.25); display: flex; align-items: center; justify-content: center; z-index: 40; }
.open-dialog { background: #fff; border-radius: 10px; box-shadow: var(--amos-shadow); width: 420px; padding: 20px 24px; }
.open-dialog h3 { margin: 0 0 8px; font-size: 15px; color: #2c486a; }
.open-dialog .amos-field { margin-top: 12px; }
.od-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
</style>
