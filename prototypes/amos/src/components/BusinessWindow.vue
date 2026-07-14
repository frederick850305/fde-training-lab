<template>
  <div class="biz-win" v-if="config">
    <!-- 窗口标题条 -->
    <div class="bw-head">
      <h2>{{ config.windowTitle }}</h2>
      <div class="row" style="gap:6px">
        <span class="muted">{{ dbRows.length }} 条记录</span>
        <button class="amos-btn sm" @click="reopenFilter">查找 / Filter</button>
        <div class="bw-options">
          <button class="amos-btn sm" @click="optionsOpen = !optionsOpen" :disabled="!config.options?.length">Options ▾</button>
          <div v-if="optionsOpen" class="bw-options-menu" @mouseleave="optionsOpen = false">
            <button v-for="o in optionItems" :key="o.action" @click="runOption(o)" :class="{ checked: o.checked }">{{ o.label }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 过滤器门禁：所有业务窗口先弹 Filter -->
    <FilterDialog
      v-if="showFilter"
      :basic="config.filterBasic || []"
      :advanced="config.filterAdvanced || []"
      @ok="applyFilter"
      @cancel="applyFilter"
    />

    <!-- 手册：Open 按钮弹出的"打开记录"对话框（按编号精确定位单条记录） -->
    <div v-if="showOpenDialog" class="open-dialog-overlay">
      <div class="open-dialog">
        <h3>Open Record — {{ config.windowTitle }}</h3>
        <p class="muted">输入{{ openKeyLabel }}以定位并打开该记录。</p>
        <div class="amos-field">
          <label>{{ openKeyLabel }}</label>
          <div class="ctrl"><input ref="openInputRef" class="amos-input" v-model="openKeyValue" @keydown.enter="confirmOpen" :placeholder="'如 ' + openKeyExample" /></div>
        </div>
        <div class="od-actions">
          <button class="amos-btn" @click="showOpenDialog = false">Cancel</button>
          <button class="amos-btn primary" @click="confirmOpen">OK</button>
        </div>
      </div>
    </div>

    <!-- Register as Component 对话框（手册 2 / P30） -->
    <div v-if="regDialog" class="open-dialog-overlay">
      <div class="open-dialog reg">
        <h3>Register as Component — {{ selected?.typeNumber }}</h3>
        <p class="muted">将所选部件类型注册为实际部件，继承全部类型信息（作业 / 计数器 / 测点）。按住 Ctrl 可多选安装地点。</p>
        <div class="reg-depts">
          <div v-for="grp in deptGroups" :key="grp.installation" class="reg-grp">
            <div class="reg-grp-h">{{ grp.installation }}</div>
            <label v-for="d in grp.items" :key="d.code" class="row" style="gap:6px">
              <input type="checkbox" :value="d.code" v-model="regSelected" /> {{ d.name }} <span class="muted">({{ d.code }})</span>
            </label>
          </div>
        </div>
        <label class="row" style="gap:6px;margin-top:8px"><input type="checkbox" v-model="regAutoStock" /> Auto-Register Stock Items（同时登记关联备件）</label>
        <div class="od-actions">
          <button class="amos-btn" @click="regDialog = false">Cancel</button>
          <button class="amos-btn primary" @click="confirmRegister">OK</button>
        </div>
      </div>
    </div>

    <!-- Install Component 对话框（手册 Component Locations：Functions 窗口 Options > Install Component） -->
    <div v-if="installDialog" class="open-dialog-overlay">
      <div class="open-dialog reg">
        <h3>Install Component — {{ selected?.functionNo }}</h3>
        <p class="muted">选择要安装到该功能位置的组件（当前未安装其他功能位置的组件）。</p>
        <div class="reg-depts">
          <label v-for="c in installCandidates" :key="c.id" class="row" style="gap:6px">
            <input type="radio" :value="c.number" v-model="installSelected" /> {{ c.number }} — {{ c.name }} <span class="muted">({{ c.status }})</span>
          </label>
        </div>
        <div class="od-actions">
          <button class="amos-btn" @click="installDialog = false">Cancel</button>
          <button class="amos-btn primary" @click="confirmInstall">OK</button>
        </div>
      </div>
    </div>

    <div v-else class="bw-body">
      <!-- 左：结果列表 -->
      <section class="bw-list">
        <RecordList
          ref="listRef"
          :columns="config.columns"
          :rows="viewRows"
          :row-key="rowKey"
          :preselect-id="listPreselectId"
          @select="onSelect"
          @open="onOpen"
        />
      </section>

      <!-- 右：明细标签页 -->
      <section class="bw-detail" v-if="selected">
        <div class="bd-head">
          <strong>{{ selected[detailTitleKey] || config.windowTitle }}</strong>
          <span class="tag" :class="statusClass">{{ selected[config.statusField] || '—' }}</span>
        </div>
        <RecordDetail :tabs="config.detailTabs" :model="selected" :preset-tab-id="detailPresetTab" @change="onFieldChange">
          <!-- 手册 2 / P30：部件类型窗口的 Components 标签，列出已注册的组件实例 -->
          <template #extra-components="scope">
            <p class="muted">由该类型注册的组件实例（手册 2 / P30）。</p>
            <table class="amos-grid sub" v-if="regComponentsList.length">
              <thead><tr><th>Number</th><th>Name</th><th>Location</th><th>Status</th><th></th></tr></thead>
              <tbody>
                <tr v-for="c in regComponentsList" :key="c.id" :class="{ 'highlight-row': highlightCompId.has(c.id) }">
                  <td>{{ c.number }}</td><td>{{ c.name }}</td><td>{{ c.location }}</td><td>{{ c.status }}</td>
                  <td><button class="amos-btn xs" @click="viewComponent(c)">View</button></td>
                </tr>
              </tbody>
            </table>
            <p v-else class="muted">尚未注册组件。点击 Options ▾ → Register as Component。</p>
          </template>
        </RecordDetail>
      </section>
      <section v-else class="bw-detail empty">
        <p class="muted">双击列表行查看明细，或点击 <b>New</b> 创建记录。</p>
      </section>
    </div>

    <div v-if="!config" class="bw-empty muted">该窗口未配置。</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onActivated, onBeforeUnmount, nextTick } from 'vue'
import FilterDialog from './FilterDialog.vue'
import RecordList from './RecordList.vue'
import RecordDetail from './RecordDetail.vue'
import { store, showToast, openWindow, setPresetFilter } from '../store.js'
import { componentService } from '../services/componentService.js'
import { jobService } from '../services/jobService.js'
import { stockItemService } from '../services/stockItemService.js'
import { stockTypeService } from '../services/stockTypeService.js'
import { functionService } from '../services/functionService.js'
import { counterService } from '../services/counterService.js'
import { collectionService } from '../services/collectionService.js'
import { windowRegistry } from '../windows/registry.js'
import { matchRow, matchPlanning } from '../utils/filter.js'
import { departments } from '../data/amosData.js'

const config = computed(() => windowRegistry[store.activeKey] || null)

// Options 菜单项：对系统参数类开关（toggle）附上当前状态（✓）
const optionItems = computed(() => (config.value?.options || []).map((o) => {
  if (o.action === 'toggle-use-types') {
    return { ...o, checked: store.useComponentTypes, label: (store.useComponentTypes ? '✓ ' : '    ') + o.label }
  }
  return o
}))
const rowKey = computed(() => {
  const d = config.value?.dataKey
  if (d === 'jobs') return 'jobNo'
  if (d === 'workOrders') return 'workOrderNo'
  if (d === 'stockItems') return 'stockItemNo'
  if (d === 'purchaseForms') return 'formNo'
  if (d === 'budgets') return 'code'
  if (d === 'vouchers') return 'voucherNo'
  return 'id'
})
const detailTitleKey = computed(() => {
  const d = config.value?.dataKey
  return { componentTypes: 'typeNumber', components: 'number', functions: 'functionNo', jobs: 'jobNo', workOrders: 'workOrderNo', stockTypes: 'stockTypeNo', stockItems: 'stockItemNo', purchaseForms: 'formNo', budgets: 'code', vouchers: 'voucherNo' }[d] || 'id'
})

const dbRows = computed(() => {
  const d = config.value?.dataKey
  return d ? collectionService.collection(d) : []
})
const viewRows = ref([])
const showFilter = ref(false)
const selected = ref(null)
const optionsOpen = ref(false)
const listRef = ref(null)

// ===== Open Record 对话框状态 =====
const showOpenDialog = ref(false)
const openKeyValue = ref('')
const openInputRef = ref(null)

const statusClass = computed(() => {
  const v = (selected.value && selected.value[config.value?.statusField]) || ''
  const s = String(v).toLowerCase()
  if (/(completed|available|active|passed|posted|open|issued|received)/.test(s)) return 'green'
  if (/(requested|planned|quoted|approved|partly|submitted|in transit|stable)/.test(s)) return 'blue'
  if (/(overdue|critical|shortage|rejected|postponed|cancelled|draft|up)/.test(s)) return 'red'
  if (/(due|pending|warning)/.test(s)) return 'orange'
  return 'gray'
})

// 不再于 activeKey 变化时硬重置（避免切回窗口丢失选中记录与过滤上下文）；改用 onActivated 仅在存在 presetFilter 时应用

function applyFilter(criteria) {
  showFilter.value = false
  const c = criteria || {}
  const basic = config.value?.filterBasic || []
  viewRows.value = dbRows.value.filter((row) => {
    if (!matchRow(row, basic, c)) return false
    // 手册 1.5：Dashboard 告警带入的 Planning 预过滤（如 Overdue / Due This Week）
    if (c.planning && config.value?.dataKey === 'workOrders' && !matchPlanning(row, c.planning)) return false
    return true
  })
  // 手册 2：Component Types 列表的 Jobs 列显示该类型实际关联的作业数（动态计算，非硬编码）
  if (config.value?.dataKey === 'componentTypes') {
    viewRows.value = viewRows.value.map((r) => ({
      ...r,
      jobs: jobService.countForComponentType(r.typeNumber),
    }))
  }
}

function reopenFilter() {
  selected.value = null
  showFilter.value = true
}

function onSelect(row) {
  selected.value = row
  // 用户手动切换记录时，清除回跳高亮（避免残留旧组件行淡黄背景）
  highlightCompId.value.clear()
}
function onOpen(row) {
  selected.value = row
  highlightCompId.value.clear()
}

function blankRecord() {
  const d = config.value.dataKey
  const rec = {}
  const key = detailTitleKey.value
  if (key !== 'id') rec[key] = ''
  config.value.columns.forEach((c) => (rec[c.key] = ''))
  if (config.value.statusField && config.value.statusOptions?.length) rec[config.value.statusField] = config.value.statusOptions[0]
  rec.id = 'new_' + Date.now()
  return rec
}

function doNew() {
  if (showFilter.value) return
  const rec = blankRecord()
  collectionService.push(config.value.dataKey, rec)
  viewRows.value = [...viewRows.value, rec]
  selected.value = rec
  showToast('已新建记录，编辑后点击 Save', 'ok')
}
function doSave() {
  if (!selected.value) return showToast('请先选择或新建记录', 'warn')
  // 手册 3（Update Counters）：保存时把读数回写到组件计数器，并级联依赖组件
  if (config.value?.dataKey === 'counterLogs') {
    counterService.recordReading(selected.value)
    showToast('已记录读数并回写组件计数器（含依赖联动）', 'ok')
    return
  }
  showToast('已保存（原型：内存态）', 'ok')
}
function doDelete() {
  if (!selected.value) return showToast('请先选择记录', 'warn')
  const key = rowKey.value
  const target = selected.value[key]
  collectionService.removeBy(config.value.dataKey, (r) => r[key] === target)
  const j = viewRows.value.findIndex((r) => r[rowKey.value] === selected.value[rowKey.value])
  if (j >= 0) viewRows.value.splice(j, 1)
  selected.value = null
  showToast('已删除记录', 'warn')
}
function doRefresh() {
  applyFilter({})
  showToast('已刷新', 'info')
}
// 手册 Component Locations：Functions 窗口字段变更时的级联同步
function onFieldChange(e) {
  if (!e || !e.key || !selected.value) return
  if (config.value?.dataKey === 'functions') {
    const fn = selected.value.functionNo
    if (e.key === 'location') {
      // 修改 function location → 级联更新已安装组件的 location
      functionService.updateLocation(fn, e.value)
      showToast('功能位置地点变更，已级联更新安装组件的 Location', 'info')
    } else if (e.key === 'installedComponentId') {
      // 手动改 function 的 installedComponentId → 双向同步组件的 functionNo
      if (e.value) {
        const comp = componentService.listSync().find((c) => c.number === e.value)
        if (comp) componentService.setFunction(comp.id, fn)
      }
      showToast('已同步组件的功能位置', 'info')
    }
  }
}

// ===== Open Record 对话框：主键字段标签与示例 =====
const openKeyLabel = computed(() => {
  const col = (config.value?.columns || []).find((c) => c.key === detailTitleKey.value)
  return (col && col.label) || detailTitleKey.value
})
const openKeyExample = computed(() => {
  // 取第一条记录的主键值作为示例（如 CT-1001 / WO-2607）
  if (!dbRows.value.length) return '…'
  return String(dbRows.value[0][detailTitleKey.value] || '')
})

function doOpen() {
  if (showFilter.value) return
  openKeyValue.value = ''
  showOpenDialog.value = true
}
function confirmOpen() {
  const val = openKeyValue.value.trim()
  if (!val) { showToast('请输入编号', 'warn'); return }
  const key = detailTitleKey.value
  const rec = dbRows.value.find((r) => String(r[key] || '').toLowerCase() === val.toLowerCase())
  if (!rec) {
    showToast(`未找到 ${openKeyLabel.value} 为「${val}」的记录`, 'warn')
    return
  }
  // 确保该记录在 viewRows 中可见（若当前被过滤掉了则加入）
  if (!viewRows.value.find((r) => r[key] === rec[key])) {
    viewRows.value = [...viewRows.value, rec]
  }
  selected.value = rec
  showOpenDialog.value = false
  showToast(`已打开：${rec[key]}`, 'ok')
}

function runOption(o) {
  optionsOpen.value = false
  // 手册 2 / P30：从部件类型窗口把类型注册为实际部件
  if (o.action === 'register-component') { openRegister(); return }
  // 手册 2 / P37：Options > View Job 打开 Component Type Jobs（预过滤到当前选中类型）
  if (o.action === 'view-job') { viewTypeJobs(); return }
  // 手册 2 / P38：Options > Add Part 快速添加备件到类型的 Parts 列表
  if (o.action === 'add-part') { addPart(); return }
  // 手册 2 / P37：Options > Copy 复制组件类型（选条目 + 新编号 + Save）
  if (o.action === 'copy-type') { copyComponentType(); return }
  // 手册 2 / P36 脚注：系统参数 Use Component Types 开关
  if (o.action === 'toggle-use-types') { store.useComponentTypes = !store.useComponentTypes; showToast(`Use Component Types = ${store.useComponentTypes ? 'TRUE' : 'FALSE'}（系统参数）`, 'info'); return }
  // 手册 Component Locations：Functions 窗口 Options > Install / Remove Component
  if (o.action === 'install-component') { openInstall(); return }
  if (o.action === 'remove-component') { removeComponent(); return }
  showToast(`执行：${o.label}（原型演示）`, 'info')
}

// ===== Install / Remove Component（手册 Component Locations：Functions 窗口 Options）=====
const installDialog = ref(false)
const installSelected = ref('')
const installCandidates = computed(() => {
  if (config.value?.dataKey !== 'functions' || !selected.value) return []
  // 当前未安装到任何功能位置（或已安装到本 function）的组件可被选作安装
  return componentService.listSync().filter((c) => !c.functionNo || c.functionNo === selected.value.functionNo)
})
function openInstall() {
  const fn = selected.value
  if (!fn) { showToast('请先选择功能位置', 'warn'); return }
  installSelected.value = ''
  installDialog.value = true
}
async function confirmInstall() {
  const fn = selected.value
  if (!fn || !installSelected.value) { showToast('请选择组件', 'warn'); return }
  await functionService.installComponent(fn.functionNo, installSelected.value)
  installDialog.value = false
  showToast(`已将 ${installSelected.value} 安装到 ${fn.functionNo}`, 'ok')
  applyFilter({})
}
function removeComponent() {
  const fn = selected.value
  if (!fn) { showToast('请先选择功能位置', 'warn'); return }
  if (!fn.installedComponentId) { showToast('该功能位置未安装组件', 'warn'); return }
  functionService.removeComponent(fn.functionNo).then(() => {
    showToast(`已从 ${fn.functionNo} 拆卸组件`, 'ok')
    applyFilter({})
  })
}

// 手册 2 / P37：Options > View Job 打开 Component Type Jobs 并预过滤到当前选中类型
function viewTypeJobs() {
  const t = selected.value
  if (!t) { showToast('请先在列表中选择一个部件类型', 'warn'); return }
  setPresetFilter({ targetType: 'ComponentType', targetId: t.typeNumber })
  openWindow('component-type-jobs')
}

// 手册 2 / P38：Options > Add Part 快速添加备件行到当前类型的 Parts 子表
function addPart() {
  const t = selected.value
  if (!t) { showToast('请先在列表中选择一个部件类型', 'warn'); return }
  if (!t.parts) t.parts = []
  t.parts.push({ stockTypeNo: '', alternativeNo: '' })
  showToast('Part row added. Please select a Stock Type.', 'ok')
}

// 手册 2 / P37：复制组件类型
async function copyComponentType() {
  const t = selected.value
  if (!t) { showToast('请先在列表中选择要复制的部件类型', 'warn'); return }
  const base = { ...t }
  delete base.id
  delete base.regComponents
  // 深拷贝可编辑子表，避免复制后修改污染原类型
  base.counters = (t.counters || []).map((x) => ({ ...x }))
  base.parts = (t.parts || []).map((x) => ({ ...x }))
  base.relatedTypes = (t.relatedTypes || []).map((x) => ({ ...x }))
  // 手册要求输入新的 Component Type 编号；此处自动递增末位数字作为建议值
  const m = /^(.*?)(\d+)(\D*)$/.exec(base.typeNumber || '')
  base.typeNumber = m ? `${m[1]}${String(Number(m[2]) + 1).padStart(m[2].length, '0')}${m[3]}` : `${base.typeNumber || 'CT'}_COPY`
  base.name = `${base.name || ''} (Copy)`
  base.status = 'Active'
  base.id = 'new_' + Date.now()
  await componentService.addComponentType(base)
  viewRows.value = [...viewRows.value, base]
  selected.value = base
  showToast('已复制部件类型：请修改编号 / 名称后 Save（手册 P37：Options > Copy）', 'ok')
}

// ===== Register as Component（手册 2 / P30）=====
const regDialog = ref(false)
const regSelected = ref([])
const regAutoStock = ref(false)
const detailPresetTab = ref('') // 指令性切换 RecordDetail 的 tab（如注册组件后自动跳转 Components）
const highlightCompId = ref(new Set()) // 高亮 Components 列表中的目标组件行（Set 支持多选）
const listPreselectId = ref('')  // 回跳时预选中左侧列表的某行（同步到 RecordList 内部 selectedId）
const deptGroups = computed(() => {
  const map = {}
  departments.forEach((d) => { (map[d.installation] = map[d.installation] || []).push(d) })
  return Object.entries(map).map(([installation, items]) => ({ installation, items }))
})
// 当前选中类型下已注册的组件实例（用于类型窗口 Components 标签）
const regComponentsList = computed(() => {
  const t = selected.value
  if (!t || !t.regComponents) return []
  return componentService.getByIds(t.regComponents)
})
function openRegister() {
  if (!selected.value) { showToast('请先在列表中选择一个部件类型', 'warn'); return }
  regSelected.value = [store.department]
  regAutoStock.value = false
  regDialog.value = true
}
async function confirmRegister() {
  const t = selected.value
  if (!t) return
  if (!regSelected.value.length) { showToast('请至少选择一个安装地点', 'warn'); return }
  const today = new Date().toISOString().slice(0, 10)
  // 手册 P30：使用 baseNo + 序号后缀，避免同一毫秒批量注册时编号全部重复
  const baseNo = String(Date.now() % 1000000)
  let count = 0
  const newIds = []
  for (let idx = 0; idx < regSelected.value.length; idx++) {
    const dept = regSelected.value[idx]
    // 注册逻辑统一交由 componentService：状态按手册自动推导（未安装 → Available）
    const comp = await componentService.register({
      typeNumber: t.typeNumber,
      name: t.name,
      maker: t.maker,
      model: t.model,
      location: dept,
      department: store.department,
      installDate: today,
    })
    // 注册到同一类型下的编号后缀，便于类型窗口 Components 标签区分
    comp.number = 'C-' + baseNo + '-' + String(idx + 1).padStart(2, '0')
    // 关联到类型，便于类型窗口 Components 标签展示（P30 第 5 步）
    ;(t.regComponents = t.regComponents || []).push(comp.id)
    newIds.push(comp.id)
    count++
    // Auto-Register Stock Items：把该类型关联的备件一并登记到所选安装地点
    if (regAutoStock.value && Array.isArray(t.parts)) {
      for (const p of t.parts) {
        const stNo = p.stockTypeNo
        const st = stockTypeService.get(stNo)
        if (!st) continue
        if (stockItemService.existsAt(stNo, dept)) continue
        await stockItemService.create({
          stockItemNo: 'SI-' + (Date.now() % 1000000), stockTypeNo: stNo,
          description: st.description, makerRef: '', drawingNo: '', stockClass: '',
          functionNo: '', quantity: 0, location: dept, expiryDate: '', perishable: false,
          status: 'Active', unitCost: st.bestPrice,
        })
      }
    }
  }
  regDialog.value = false
  // 注册成功后自动切换到 Components tab，并高亮所有新注册的组件实例
  highlightCompId.value = new Set(newIds)
  detailPresetTab.value = ''
  nextTick(() => { detailPresetTab.value = 'components' })
  showToast(`已注册 ${count} 个组件（来自类型 ${t.typeNumber}）`, 'ok')
}
function viewComponent(c) {
  // 手册 P30 第 5 步：编号 + location 双重定位，确保精确命中目标组件
  setPresetFilter({ number: c.number, location: c.location })
  // 保存回跳上下文：切回 Component Types 时恢复选中类型 + Components tab + 高亮目标行
  const t = selected.value
  store.returnContext = { sourceWindow: config.value?.windowKey, typeNumber: t?.typeNumber, targetId: c.id }
  openWindow('components')
}

// ===== 顶部工具栏事件（CustomEvent 解耦） =====
function onAction(e) {
  const a = e.detail?.action
  if (a === 'new') doNew()
  else if (a === 'save') doSave()
  else if (a === 'delete') doDelete()
  else if (a === 'view') selected.value = selected.value || viewRows.value[0] || null
  else if (a === 'refresh') doRefresh()
  else if (a === 'print') window.print()
  else if (a === 'options') optionsOpen.value = !optionsOpen.value
  else if (a === 'filter') reopenFilter()
  else if (a === 'open') doOpen()
}

// 双击 Dashboard 告警带入的预过滤
function applyPreset() {
  if (store.presetFilter) {
    applyFilter(store.presetFilter)
    store.presetFilter = null
  } else {
    // 进入窗口默认显示全部记录（手册交互：先见列表，再用 Filter 收窄）
    viewRows.value = dbRows.value.slice()
  }
}
onMounted(() => { window.addEventListener('amos-action', onAction); applyPreset() })
// keep-alive 激活时：处理 presetFilter（Dashboard 告警带入）和 returnContext（从其他窗口 View 跳回的上下文恢复）
onActivated(() => {
  if (store.presetFilter) applyPreset()
  // 回跳上下文恢复：从 Component Types 的 Components tab View 跳出后，切回时还原选中类型 + 高亮目标组件行
  if (store.returnContext && store.returnContext.sourceWindow === config.value?.windowKey) {
    const ctx = store.returnContext
    store.returnContext = null // 一次性消费，避免重复触发
    if (ctx.typeNumber) {
      const row = dbRows.value.find((r) => r.typeNumber === ctx.typeNumber)
      if (row) {
        selected.value = row
        // 同步到 RecordList 内部 selectedId 使左侧列表高亮该行
        listPreselectId.value = row[rowKey.value] || ''
      }
    }
    // 切到 Components tab 并标记高亮目标行（淡黄色背景，持久保持直到用户切换记录）
    nextTick(() => {
      detailPresetTab.value = ''
      highlightCompId.value = ctx.targetId ? new Set([ctx.targetId]) : new Set()
      nextTick(() => { detailPresetTab.value = 'components' })
    })
  }
})
onBeforeUnmount(() => window.removeEventListener('amos-action', onAction))

watch(showOpenDialog, (v) => {
  if (v) nextTick(() => openInputRef.value?.focus())
})
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
.bw-options { position: relative; }
.bw-options-menu { position: absolute; right: 0; top: 30px; background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 6px; box-shadow: var(--amos-shadow); z-index: 50; min-width: 200px; padding: 4px; }
.bw-options-menu button { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 12.5px; }
.bw-options-menu button:hover { background: var(--amos-blue-soft); }
.bw-options-menu button.checked { font-weight: 700; color: var(--amos-blue); }
.bw-empty { padding: 30px; text-align: center; }
/* 回跳高亮：从 Components View 跳出后切回时，目标组件行短暂高亮 */
.highlight-row { background: #fff3cd !important; animation: hl-pulse 2s ease-out; }
@keyframes hl-pulse { 0% { background: #ffe066; } 100% { background: #fff3cd; } }

/* Open Record 对话框 */
.open-dialog-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.25); display: flex; align-items: center; justify-content: center; z-index: 40; }
.open-dialog { background: #fff; border-radius: 10px; box-shadow: var(--amos-shadow); width: 420px; padding: 20px 24px; }
.open-dialog h3 { margin: 0 0 8px; font-size: 15px; color: #2c486a; }
.open-dialog .amos-field { margin-top: 12px; }
.open-dialog.reg { width: 460px; }
.reg-depts { max-height: 220px; overflow: auto; border: 1px solid var(--amos-border); border-radius: 6px; padding: 8px; margin-top: 8px; }
.reg-grp { margin-bottom: 6px; }
.reg-grp-h { font-size: 12px; font-weight: 700; color: var(--amos-text-soft); margin-bottom: 2px; }
.reg .amos-grid.sub { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 8px; }
.reg .amos-grid.sub th, .reg .amos-grid.sub td { border: 1px solid var(--amos-border); padding: 4px 6px; text-align: left; }
.od-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 16px; }
@media (max-width: 980px) {
  .bw-body { grid-template-columns: 1fr; }
  .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); }
}
</style>
