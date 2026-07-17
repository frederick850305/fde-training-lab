<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Component Types</h2>
      <span class="scope-badge" title="部件类型模板（Fleet 共享）：定义同类设备的作业 / 备件 / 计数器 / 测点">范围：Fleet（全船队共享）</span>
      <div class="row" style="gap:6px">
        <button class="amos-btn sm" @click="reopenFilter">查找 / Find</button>
        <button class="amos-btn sm primary" @click="doNew">New</button>
        <button class="amos-btn sm" @click="doSave" :disabled="!selected">Save</button>
        <button class="amos-btn sm danger" @click="doDelete" :disabled="!selected">Delete</button>
        <div class="bw-options" ref="optionsRef">
          <button class="amos-btn sm" @click="toggleOptions">Options ▾</button>
          <Teleport to="body">
            <div v-if="optionsOpen && optionsRect" class="bw-options-popup" :style="optionsPopupStyle" @mouseleave="optionsOpen = false">
              <button @click="viewSelected">View</button>
              <button @click="registerComponent">Register as Component</button>
              <button @click="viewTypeJob">View Job</button>
              <button @click="copyType">Copy</button>
            </div>
          </Teleport>
        </div>
      </div>
    </div>

    <FilterDialog :basic="filterBasic" :advanced="filterAdvanced" @ok="applyFilter" @cancel="applyFilter" v-if="showFilter" />

    <!-- Open Record 对话框 -->
    <div v-if="showOpenDialog" class="open-dialog-overlay">
      <div class="open-dialog">
        <h3>Open Record — Component Types</h3>
        <p class="muted">输入 Type Number 以定位并打开该组件类型。</p>
        <div class="amos-field"><label>Type Number</label><div class="ctrl"><input ref="openInputRef" class="amos-input" v-model="openKeyValue" @keydown.enter="confirmOpen" placeholder="如 CT-1001" /></div></div>
        <div class="od-actions"><button class="amos-btn" @click="showOpenDialog = false">Cancel</button><button class="amos-btn primary" @click="confirmOpen">OK</button></div>
      </div>
    </div>

    <div v-else class="bw-body">
      <section class="bw-list">
        <RecordList ref="listRef" :columns="columns" :rows="viewRows" row-key="id" @select="onSelect" @open="onOpen" />
      </section>
      <section class="bw-detail" v-if="selected">
        <div class="bd-head">
          <strong>{{ selected.typeNumber }} — {{ selected.name }}</strong>
          <span class="tag" :class="statusClass(selected.status)">{{ selected.status }}</span>
        </div>
        <RecordDetail :tabs="tabs" :model="selected" @change="onDetailChange" @subaction="onSubAction">
          <!-- 手册 P57 / 截图：Jobs 标签页 —— 展示该组件类型已关联的类型级作业（JD 视角） -->
          <!-- New → 创建 ComponentType 作业并跳入 Component Type Jobs 窗口 -->
          <!-- View → 跳转 Component Type Jobs 窗口并定位 -->
          <!-- Details → 本窗口内只读展示 JD 内容 -->
          <template #extra-jobs>
            <div class="subgrid-bar" style="margin-bottom:8px">
              <button class="amos-btn xs primary" @click="jobTab.newJob()">New</button>
              <button class="amos-btn xs" :disabled="!jobTab.selectedJob" @click="jobTab.deleteJob(jobTab.selectedJob)">Delete</button>
              <button class="amos-btn xs" :disabled="!jobTab.selectedJob" @click="jobTab.viewJob(jobTab.selectedJob)">View</button>
              <button class="amos-btn xs" :disabled="!jobTab.selectedJob" @click="jobTab.detailsJob(jobTab.selectedJob)">Details</button>
              <span class="muted">{{ jobTab.relJobs.length }} 条作业</span>
            </div>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>Code</th><th>Revision</th><th>Title</th><th>Frequency</th><th>Priority</th></tr></thead>
              <tbody>
                <tr v-for="j in jobTab.relJobs" :key="j.id" @click="jobTab.selectedJob = j"
                    :class="{ selected: jobTab.selectedJob && jobTab.selectedJob.id === j.id }" style="cursor:pointer">
                  <td>{{ j.jdCode || j.jobNo || '—' }}</td>
                  <td>{{ (j.jdRevision !== '' && j.jdRevision != null) ? j.jdRevision : '—' }}</td>
                  <td>{{ j.jdTitle || j.description || '—' }}</td>
                  <td>{{ j.frequency || '—' }}</td>
                  <td>{{ j.maintCriteria || '—' }}</td>
                </tr>
                <tr v-if="!jobTab.relJobs.length"><td colspan="5" class="muted">该类型无关联作业。点击 New 创建组件类型级作业。</td></tr>
              </tbody>
            </table></div>
            <!-- JD Details 弹窗（与 ComponentsView 复用同一 UI 模式） -->
            <Teleport to="body">
              <div v-if="jobTab.jobDetailsOpen" class="jd-mask" @click.self="jobTab.jobDetailsOpen = false">
                <div class="jd-modal">
                  <div class="jd-head">
                    <strong>Job Description — {{ jobTab.jobDetailsJD?.code }}</strong>
                    <button class="amos-btn xs" @click="jobTab.jobDetailsOpen = false">✕</button>
                  </div>
                  <div class="jd-body" v-if="jobTab.jobDetailsJD">
                    <p class="muted">该作业（{{ jobTab.jobDetailsJobNo }}）关联的 Job Description 主数据（只读参考）：</p>
                    <div class="amos-field"><label>Job Description Code</label><div class="ctrl"><input class="amos-input" :value="jobTab.jobDetailsJD.code" readonly /></div></div>
                    <div class="amos-field"><label>Revision</label><div class="ctrl"><input class="amos-input" :value="jobTab.jobDetailsJD.revision" readonly /></div></div>
                    <div class="amos-field"><label>Title</label><div class="ctrl"><input class="amos-input" :value="jobTab.jobDetailsJD.title" readonly /></div></div>
                    <div class="amos-field"><label>Frequency</label><div class="ctrl"><input class="amos-input" :value="jobTab.jobDetailsJD.frequency || '—'" readonly /></div></div>
                    <div class="amos-field"><label>Window</label><div class="ctrl"><input class="amos-input" :value="jobTab.jobDetailsJD.window != null ? jobTab.jobDetailsJD.window : '—'" readonly /></div></div>
                  </div>
                  <div class="jd-foot">
                    <button class="amos-btn sm primary" @click="jobTab.jobDetailsOpen = false">关闭</button>
                  </div>
                </div>
              </div>
            </Teleport>
          </template>
          <!-- 手册截图右下角：Components 标签 —— 展示已注册到该类型的组件实例列表 -->
          <template #extra-components>
            <p class="muted">已注册到该类型的组件实例（Number / Name / Maker / Type）：</p>
            <div class="table-wrap"><table class="amos-grid sub">
              <thead><tr><th>Number</th><th>Name</th><th>Maker</th><th>Type</th></tr></thead>
              <tbody>
                <tr v-for="c in relComponents" :key="c.id" @click="viewComponent(c)" style="cursor:pointer">
                  <td>{{ c.number }}</td>
                  <td>{{ c.name }}</td>
                  <td>{{ c.maker || '—' }}</td>
                  <td>{{ c.type || '—' }}</td>
                </tr>
                <tr v-if="!relComponents.length"><td colspan="4" class="muted">尚无组件注册到此类型。使用 Options > Register as Component 创建。</td></tr>
              </tbody>
            </table></div>
          </template>
        </RecordDetail>
      </section>
      <section v-else class="bw-detail empty"><p class="muted">双击列表行查看明细，或点击 New 创建组件类型。</p></section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onActivated, onBeforeUnmount, nextTick } from 'vue'
import FilterDialog from '../components/FilterDialog.vue'
import RecordList from '../components/RecordList.vue'
import RecordDetail from '../components/RecordDetail.vue'
import { componentService } from '../services/componentService.js'
import { jobService } from '../services/jobService.js'
import { useJobTab } from '../composables/useJobTab.js'
import { store, openWindow, showToast, setPresetFilter, scopeByDepartment } from '../store.js'
import { matchRow } from '../utils/filter.js'

// ===== 过滤器定义 =====
const filterBasic = [
  { key: 'typeNumber', label: 'Type Number', type: 'text', placeholder: '如 CT-100%' },
  { key: 'name', label: 'Name', type: 'text', placeholder: '如 %Engine' },
]
const filterAdvanced = [
  { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Blocked'] },
  { key: 'maker', label: 'Maker', type: 'text' },
  { key: 'classCode', label: 'Class', type: 'text' },
]

// 手册 P37 截图对齐：Type Number / Name / Maker / Class / Status / Jobs
const columns = [
  { key: 'typeNumber', label: 'Type Number', width: '130px' },
  { key: 'name', label: 'Name', width: '200px' },
  { key: 'maker', label: 'Maker', width: '120px' },
  { key: 'classCode', label: 'Class', width: '80px' },
  { key: 'status', label: 'Status', width: '100px', tag: true },
  // 手册 P37：Jobs 列显示动态计算的关联作业数
  { key: '_jobs', label: 'Jobs', align: 'right', width: '70px' },
]

// ===== 标签页定义（对照手册 P36 截图：General / Details / Jobs / ...）=====
const tabs = [
  // 手册 P36 截图 — General 标签：Number / Name / Maker(lookup) / Type / Preferred Vendor(lookup) / Parent(lookup) / Component Class(下拉)
  { id: 'general', label: 'General', fields: [
    { key: 'typeNumber', label: 'Number' },
    { key: 'name', label: 'Name' },
    { key: 'maker', label: 'Maker', type: 'lookup', lookupKey: 'makers' },
    { key: 'type', label: 'Type' },
    { key: 'preferredVendor', label: 'Preferred Vendor', type: 'lookup', lookupKey: 'makers' },
    { key: 'parentTypeNumber', label: 'Parent', type: 'lookup', lookupKey: 'componentTypes' },
    { key: 'classCode', label: 'Component Class', type: 'select', options: ['ENG', 'BOI', 'PMP', 'VAL', 'PIS', 'ELEC', 'HYD'] },
  ] },
  // 手册 P36 截图 — Details 标签：Model / Status / 补充描述信息
  { id: 'details', label: 'Details', fields: [
    { key: 'model', label: 'Model' },
    { key: 'status', label: 'Status', type: 'select', options: ['Active', 'Obsolete', 'Blocked'] },
    { key: 'description', label: 'Description' },
    { key: 'dateCreated', label: 'Date Created', type: 'readonly' },
    { key: 'dateModified', label: 'Date Modified', type: 'readonly' },
  ] },
  // 手册 P57 截图：Jobs 标签 —— 使用 useJobTab composable，targetType 为 ComponentType
  { id: 'jobs', label: 'Jobs', fields: [] },
  // Parts / Counters / Measure Points / Related 均为子表标签
  {
    id: 'parts', label: 'Parts', type: 'subgrid', subKey: 'parts',
    columns: [
      { key: 'stockTypeNo', label: 'Stock Type', type: 'lookup', lookupKey: 'stockTypes', width: '120px', default: '' },
      { key: 'alternativeNo', label: 'Alternative No.', width: '110px', default: '' },
    ],
  },
  {
    id: 'counters', label: 'Counters', type: 'subgrid', subKey: 'counters',
    columns: [
      { key: 'code', label: 'Counter Code', width: '120px', default: '' },
      { key: 'description', label: 'Description', default: '' },
      { key: 'unit', label: 'Unit', width: '70px', default: '' },
    ],
  },
  {
    id: 'measure_points', label: 'Measure Points', type: 'subgrid', subKey: 'measurePointDefs',
    columns: [
      { key: 'code', label: 'Point Code', width: '120px', default: '' },
      { key: 'description', label: 'Description', default: '' },
      { key: 'trend', label: 'Trend', type: 'select', width: '90px', options: ['Up', 'Down', 'Stable'], default: 'Stable' },
      { key: 'unit', label: 'Unit', width: '70px', default: '' },
    ],
  },
  {
    id: 'related', label: 'Related', type: 'subgrid', subKey: 'relatedTypes',
    columns: [
      { key: 'typeNumber', label: 'Related Component Type', type: 'lookup', lookupKey: 'componentTypes', width: '170px', default: '' },
    ],
  },
  // 手册截图底部：Components 标签 —— 展示该类型的已注册组件实例
  { id: 'components', label: 'Components', fields: [] },
]

// ===== 数据源 =====
const all = computed(() => componentService.listComponentTypes())
// 动态计算每条类型的 Jobs 数（覆盖 mock 静态值）
const viewRows = computed(() => {
  const rows = all.value.map((r) => ({
    ...r,
    _jobs: jobService.countForComponentType(r.typeNumber),
  }))
  return rows
})
const showFilter = ref(false)
const selected = ref(null)

// Options 菜单状态
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

// ===== Jobs 标签：复用 useJobTab composable（targetType = ComponentType）=====

const jobTab = useJobTab({
  targetType: 'ComponentType',
  getTargetId: () => selected.value?.typeNumber,
  getWindowKey: () => 'component-type-jobs',
  getDescriptionHint: () => (selected.value?.name || selected.value?.typeNumber || '') + ' — 类型维护作业',
})

// ===== Components 标签：该类型下的已注册组件实例 =====
const relComponents = computed(() => {
  if (!selected.value) return []
  return componentService.listSync().filter((c) => c.typeNumber === selected.value.typeNumber)
})
function viewComponent(c) {
  if (!c) return
  setPresetFilter({ _focusCompNo: c.number })
  openWindow('components')
}

// ===== 过滤 / 选择 =====
watch(() => store.department, () => { selected.value = null })
watch(() => store.installation, () => { selected.value = null })

function applyPreset() {
  if (store.presetFilter) { applyFilter(store.presetFilter); setPresetFilter(null) }
  else viewRows.value // computed 已自动更新
  // 单条结果时自动选中
  if (selected.value === null && viewRows.value.length === 1) {
    onSelect(viewRows.value[0])
  }
}

function applyFilter(c) {
  showFilter.value = false
  const crit = c || {}
  const filtered = all.value.filter((r) => matchRow(r, [...filterBasic, ...filterAdvanced], crit))
  // 重新映射 _jobs
  viewRows.value = filtered.map((r) => ({
    ...r,
    _jobs: jobService.countForComponentType(r.typeNumber),
  }))
}
function reopenFilter() { selected.value = null; showFilter.value = true }

function onSelect(r) { selected.value = r }
function onOpen(r) { selected.value = r }

async function onDetailChange(e) {
  if (!e || !selected.value) return
  // 字段变更暂无特殊业务逻辑（后续可扩展）
}

function onSubAction(e) {
  // 子表操作（Parts / Counters 等的 New/Delete）
  // 目前由 RecordDetail 内部处理，此处预留扩展点
}

// ===== 操作按钮 =====
function doNew() {
  const now = new Date().toISOString().slice(0, 10)
  const rec = { id: 'ct_' + Date.now(), typeNumber: 'CT-' + Math.floor(Math.random() * 90000 + 10000), name: '', maker: '', model: '', type: '', classCode: '', status: 'Active', preferredVendor: '', parentTypeNumber: '', description: '', dateCreated: now, dateModified: now, jobs: 0, counters: [], measurePointDefs: [], parts: [], relatedTypes: [] }
  all.value.push(rec); selected.value = rec
  showToast('已新建组件类型，编辑后 Save', 'ok')
}
function doSave() { if (selected.value) showToast('已保存（内存态）', 'ok') }
function doDelete() {
  if (!selected.value) return
  const i = all.value.findIndex((r) => r.id === selected.value.id)
  if (i >= 0) all.value.splice(i, 1)
  selected.value = null; showToast('已删除', 'warn')
}

// Options > View：确保选中行并展示详情面板（与 Components 单击/双击行为一致）
function viewSelected() {
  optionsOpen.value = false
  const t = selected.value
  if (!t) { showToast('请先选择一个组件类型', 'warn'); return }
  // 已选中则无需额外操作，详情面板通过 v-if="selected" 自动展示
  showToast(`查看组件类型：${t.typeNumber} — ${t.name}`, 'info')
}

// Options > Register as Component
function registerComponent() {
  optionsOpen.value = false
  const t = selected.value
  if (!t) { showToast('请先选择组件类型', 'warn'); return }
  // 打开 Components 窗口并预设该类型（实际注册在 Components 窗口中完成）
  showToast(`Register as Component：将在 Components 窗口中创建 ${t.typeNumber} 的组件实例`, 'info')
  openWindow('components')
}

// Options > View Job：打开 Component Type Jobs 并预过滤到当前选中类型
function viewTypeJob() {
  optionsOpen.value = false
  const t = selected.value
  if (!t) { showToast('请先选择组件类型', 'warn'); return }
  setPresetFilter({ targetType: 'ComponentType', targetId: t.typeNumber })
  openWindow('component-type-jobs')
}

// Options > Copy
function copyType() {
  optionsOpen.value = false
  const t = selected.value
  if (!t) { showToast('请先选择要复制的类型', 'warn'); return }
  const base = { ...t }
  delete base.id
  const m = /^(.*?)(\d+)(\D*)$/.exec(base.typeNumber || '')
  base.typeNumber = m ? `${m[1]}${String(Number(m[2]) + 1).padStart(m[2].length, '0')}${m[3]}` : `${base.typeNumber || 'CT'}_COPY`
  base.name = `${base.name || ''} (Copy)`
  base.jobs = 0
  base.counters = (t.counters || []).map((x) => ({ ...x }))
  base.measurePointDefs = (t.measurePointDefs || []).map((x) => ({ ...x }))
  base.parts = (t.parts || []).map((x) => ({ ...x }))
  base.relatedTypes = []
  base.id = 'ct_' + Date.now()
  all.value.push(base)
  selected.value = base
  showToast('已复制组件类型：请修改 Type Number 后 Save', 'ok')
}

// ===== Open Record 对话框 =====
const showOpenDialog = ref(false)
const openKeyValue = ref('')
const openInputRef = ref(null)

function doOpen() {
  if (showFilter.value) return
  openKeyValue.value = ''
  showOpenDialog.value = true
}
function confirmOpen() {
  const val = openKeyValue.value.trim()
  if (!val) return showToast('请输入 Type Number', 'warn')
  const rec = all.value.find((r) => String(r.typeNumber || '').toLowerCase() === val.toLowerCase())
  if (!rec) return showToast(`未找到 Type Number 为「${val}」的组件类型`, 'warn')
  selected.value = rec; showOpenDialog.value = false
  showToast(`已打开组件类型：${rec.typeNumber}`, 'ok')
}
function onAction(e) { const a = e.detail?.action; if (a === 'filter') reopenFilter(); if (a === 'new') doNew(); if (a === 'open') doOpen() }

onMounted(() => { window.addEventListener('amos-action', onAction); applyPreset() })
onActivated(() => { if (store.presetFilter) applyPreset() })
onBeforeUnmount(() => window.removeEventListener('amos-action', onAction))
watch(showOpenDialog, (v) => { if (v) nextTick(() => openInputRef.value?.focus()) })

function statusClass(v) {
  const s = String(v).toLowerCase()
  if (/(active|in use|available)/.test(s)) return 'green'
  if (/obsolete/.test(s)) return 'red'
  if (/(blocked)/.test(s)) return 'orange'
  return 'gray'
}
</script>

<style scoped>
.biz-win { display: flex; flex-direction: column; height: 100%; }
.bw-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--amos-border); gap: 8px; }
.bw-head h2 { margin: 0; font-size: 15px; color: #2c486a; flex-shrink: 0; }
.bw-head .row { display: flex; gap: 6px; overflow-x: auto; flex-shrink: 1; min-width: 0; scrollbar-width: thin; }
.bw-head .row::-webkit-scrollbar { height: 4px; }
.bw-head .row::-webkit-scrollbar-thumb { background: #c2d2e8; border-radius: 2px; }
.scope-badge { font-size: 11.5px; color: #1f6fb2; background: #e8f2fb; border: 1px solid #b9d8f0; border-radius: 999px; padding: 2px 10px; }
.bw-body { flex: 1; display: flex; flex-direction: column; min-height: 0; }
.bw-list { border-bottom: 1px solid var(--amos-border); padding: 8px; min-height: 0; max-height: 40%; overflow: hidden; }
.bw-list > * { height: 100%; min-height: 0; }
.bw-detail { padding: 10px; overflow-y: auto; flex: 1; min-height: 0; display: flex; flex-direction: column; }
.bw-detail.empty { display: flex; align-items: center; justify-content: center; }
.bd-head { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.bd-head strong { font-size: 14px; color: #2c486a; }
.subgrid-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
/* Options 菜单 */
.bw-options { position: relative; }
.bw-options-popup { background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 6px; box-shadow: 0 6px 20px rgba(0,0,0,.18); z-index: 9999; min-width: 200px; padding: 4px; }
.bw-options-popup button { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 12.5px; }
.bw-options-popup button:hover { background: var(--amos-blue-soft); }
/* Open Record 对话框 */
.open-dialog-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.25); display: flex; align-items: center; justify-content: center; z-index: 40; }
.open-dialog { background: #fff; border-radius: 10px; box-shadow: var(--amos-shadow); width: 420px; padding: 20px 24px; }
.open-dialog h3 { margin: 0 0 8px; font-size: 15px; color: #2c486a; }
.open-dialog .amos-field { margin-top: 12px; }
.od-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
/* JD Details 弹窗 */
::global(.jd-mask) { position: fixed; inset: 0; background: rgba(0,0,0,.32); display: flex; align-items: center; justify-content: center; z-index: 5000; }
::global(.jd-modal) { background: #fff; border-radius: 10px; box-shadow: 0 10px 36px rgba(0,0,0,.28); width: 460px; max-width: 92vw; max-height: 84vh; display: flex; flex-direction: column; overflow: hidden; }
::global(.jd-head) { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; border-bottom: 1px solid var(--amos-border); background: #f3f6fa; }
::global(.jd-head strong) { font-size: 13.5px; color: #2c486a; }
::global(.jd-body) { padding: 12px 14px; overflow: auto; }
::global(.jd-body .muted) { font-size: 12px; margin: 0 0 10px; }
::global(.jd-body .amos-field) { margin-top: 8px; }
::global(.jd-foot) { display: flex; justify-content: flex-end; padding: 10px 14px; border-top: 1px solid var(--amos-border); background: #fafcff; }
.tag { display: inline-block; padding: 1px 8px; border-radius: 999px; font-size: 11.5px; font-weight: 600; }
.tag.green { background: #d4edda; color: #155724; }
.tag.blue { background: #cce5ff; color: #004085; }
.tag.red { background: #f8d7da; color: #721c24; }
.tag.orange { background: #fff3cd; color: #856404; }
.tag.gray { background: #e9ecef; color: #6c757d; }
</style>
