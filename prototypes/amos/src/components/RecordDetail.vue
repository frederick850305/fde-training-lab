<template>
  <div class="record-detail">
    <div class="tab-row">
      <div
        v-for="t in tabs"
        :key="t.id"
        class="tab"
        :class="{ active: active === t.id }"
        @click="switchTab(t.id)"
      >{{ t.label }}</div>
    </div>
    <div class="tab-body" style="border-top:none">
      <div v-for="t in tabs" v-show="active === t.id" :key="t.id">
        <!-- 手册 2 / P37-39：Jobs / Parts / Related 可编辑子表 -->
        <template v-if="t.type === 'subgrid'">
          <div class="subgrid-bar">
            <button class="amos-btn xs" @click="addSubRow(t)">New</button>
            <button v-for="a in (t.subActions || [])" :key="a.id" class="amos-btn xs" @click="runSubAction(t, a)">{{ a.label }}</button>
            <span class="muted">{{ subRows(t).length }} 条记录</span>
          </div>
          <div class="table-wrap"><table class="amos-grid sub">
            <thead><tr>
              <th v-for="c in t.columns" :key="c.key" :style="subColStyle(t, c)">{{ c.label }}<span class="col-resize" @mousedown.stop.prevent="startSubResize($event, t, c.key)"></span></th>
              <th class="sub-actions"></th>
            </tr></thead>
            <tbody>
              <tr v-for="(row, ri) in subRows(t)" :key="rowKeyOf(row, ri)" :class="{ 'sub-sel': isSubSelected(row) }" @click="selectSubRow(row)">
                <td v-for="c in t.columns" :key="c.key" :style="subColStyle(t, c)">
                  <span v-if="c.readonly" class="cell-ro">{{ row[c.key] }}</span>
                  <template v-else-if="c.type === 'lookup'">
                    <span class="cell-lookup">
                      <input class="amos-input sm" :value="row[c.key]" readonly :placeholder="'选择…'" />
                      <button class="lookup-btn" type="button" @click="openSubLookup(t, c, row)">…</button>
                    </span>
                  </template>
                  <select v-else-if="c.type === 'select'" v-model="row[c.key]" class="amos-select sm">
                    <option v-for="o in c.options" :key="o" :value="o">{{ o }}</option>
                  </select>
                  <input v-else-if="c.type === 'number'" type="number" v-model.number="row[c.key]" class="amos-input sm" />
                  <input v-else-if="c.type === 'date'" type="date" v-model="row[c.key]" class="amos-input sm" />
                  <input v-else type="text" v-model="row[c.key]" class="amos-input sm" :placeholder="c.label" />
                </td>
                <td class="sub-actions"><button class="amos-btn xs danger" @click="delSubRow(t, row)">Del</button></td>
              </tr>
              <tr v-if="!subRows(t).length">
                <td :colspan="t.columns.length + 1" class="muted" style="text-align:center;padding:10px">（空）点击 New 添加</td>
              </tr>
            </tbody>
          </table></div>
        </template>
        <template v-else>
          <div v-for="f in visibleFields(t)" :key="f.key" class="amos-field">
            <p v-if="f.key === '_note'" class="rd-note">{{ f.value }}</p>
            <template v-else>
            <label>{{ f.label }}</label>
            <div class="ctrl">
              <template v-if="f.type === 'lookup'">
                <input class="amos-input" :value="model[f.key]" readonly :placeholder="f.placeholder || '选择…'" />
                <button class="lookup-btn" type="button" @click="openLookup(f)">…</button>
              </template>
              <select v-else-if="f.type === 'select'" v-model="model[f.key]" class="amos-select" :disabled="f.readonly">
                <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
              </select>
              <textarea v-else-if="f.type === 'textarea'" v-model="model[f.key]" class="amos-textarea" :readonly="f.readonly" />
              <input v-else-if="f.type === 'number'" type="number" v-model.number="model[f.key]" class="amos-input" :readonly="f.readonly" />
              <input v-else-if="f.type === 'date'" type="date" v-model="model[f.key]" class="amos-input" :readonly="f.readonly" />
              <input v-else-if="f.type === 'readonly'" type="text" class="amos-input" :value="model[f.key] !== undefined && model[f.key] !== '' ? model[f.key] : f.value" readonly />
              <input v-else type="text" v-model="model[f.key]" class="amos-input" :readonly="f.readonly" :placeholder="f.placeholder || ''" />
            </div>
            </template>
          </div>
        </template>
        <slot :name="'extra-' + t.id" :model="model" />
      </div>
    </div>

    <LookupDialog
      v-if="lookupField"
      :title="lookupField.label"
      :options="lookupOptions"
      @select="onLookupSelect"
      @cancel="lookupField = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LookupDialog from './LookupDialog.vue'
import { lookups } from '../mock/index.js'
import { collectionService } from '../services/collectionService.js'

const props = defineProps({
  tabs: { type: Array, required: true },
  model: { type: Object, required: true },
  presetTabId: { type: String, default: '' }, // 外部指令：强制切换到指定 tab（如注册组件后跳转 Components）
})
const emit = defineEmits(['change', 'subaction'])

// 手册 P30 导航体验优化：每个窗口的详情标签页状态持久化，
// 切换窗口再切回后保留用户之前所在的 tab（而非总是重置到 General）
// 使用模块级 Map 按 windowKey 缓存，RecordDetail 组件不感知外部 windowKey
// 由父组件 BusinessWindow 通过 detailTabKey prop 传入唯一标识
const _tabCache = new Map()

function getActive(key) {
  return _tabCache.get(key) || props.tabs[0]?.id || ''
}

function setActive(key, val) {
  _tabCache.set(key, val)
}

const active = ref(getActive('default'))

// 监听 model 变化（选中记录切换时）以决定是否使用缓存或默认
import { watch, toRef } from 'vue'
const modelId = computed(() => props.model?.id || props.model?.typeNumber || 'unknown')
watch(modelId, (newId) => {
  const cacheKey = newId
  if (!_tabCache.has(cacheKey)) {
    // 首次打开该记录 → 默认首 tab
    active.value = props.tabs[0]?.id || ''
    _tabCache.set(cacheKey, active.value)
  } else {
    // 切回已缓存的记录 → 恢复之前的 tab
    active.value = getActive(cacheKey)
  }
}, { immediate: true })

// 监听 presetTabId：外部指令性切换 tab（如 Register as Component 后自动跳转 Components）
import { watch as watchPreset } from 'vue'
watchPreset(() => props.presetTabId, (id) => {
  if (id && props.tabs.some((t) => t.id === id)) {
    switchTab(id)
  }
})

function switchTab(id) {
  active.value = id
  setActive(modelId.value, id)
}
// 手册 P44：字段支持 showIf 条件显示（如 Jobs 中 Counter Code 仅当 Planning Method = Counter 出现）
function visibleFields(t) {
  return (t.fields || []).filter((f) => !f.showIf || props.model[f.showIf.key] === f.showIf.value)
}
const lookupField = ref(null)
const lookupOptions = ref([])

function openLookup(f) {
  lookupField.value = f
  const fn = lookups[f.lookupKey]
  lookupOptions.value = (fn ? fn(props.model) : []) || []
}
function onLookupSelect(code) {
  if (lookupField.value) {
    const f = lookupField.value
    if (f._row) f._row[f.key] = code
    else props.model[f.key] = code
    emit('change', { key: f.key, value: code })
  }
  lookupField.value = null
}

// ===== 可编辑子表（手册 2 / P37-39：Jobs / Parts / Related）=====
function subRows(t) {
  if (t.subSource) {
    const src = collectionService.collection(t.subSource.dbKey)
    return src.filter((r) => r[t.subSource.filterKey] === props.model[t.subSource.filterModelKey])
  }
  const key = t.subKey
  if (!props.model[key]) props.model[key] = []
  return props.model[key]
}
function rowKeyOf(row, ri) {
  return row.id || row.jobNo || row.stockTypeNo || row.typeNumber || ('row_' + ri)
}
function addSubRow(t) {
  const row = {}
  ;(t.columns || []).forEach((c) => { row[c.key] = c.default !== undefined ? c.default : '' })
  if (t.subSource) {
    const base = { ...(t.newDefaults || {}) }
    base[t.subSource.filterKey] = props.model[t.subSource.filterModelKey]
    if (!row.id) row.id = 'new_' + Date.now() + '_' + Math.floor(Math.random() * 1000)
    Object.assign(row, base)
    collectionService.push(t.subSource.dbKey, row)
  } else {
    const key = t.subKey
    if (!props.model[key]) props.model[key] = []
    props.model[key].push(row)
  }
  emit('change', {})
}
function delSubRow(t, row) {
  if (t.subSource) {
    collectionService.removeBy(t.subSource.dbKey, (r) => r === row || r.id === row.id)
  } else {
    const arr = props.model[t.subKey] || []
    const i = arr.findIndex((r) => r === row)
    if (i >= 0) arr.splice(i, 1)
  }
  emit('change', {})
}
function openSubLookup(t, c, row) {
  lookupField.value = { ...c, _row: row }
  const fn = lookups[c.lookupKey]
  lookupOptions.value = (fn ? fn(props.model) : []) || []
}

// 子表行选中（供 Update / Set Start 等 subActions 操作指定行）
const selectedSub = ref(null)
function selectSubRow(row) { selectedSub.value = row }
function isSubSelected(row) { return selectedSub.value === row }
function runSubAction(t, a) {
  emit('subaction', { action: a.id, tabId: t.id, row: selectedSub.value })
}

// ===== 子表格列宽拖拽调整 =====
const subColWidths = ref({})
const subResizing = ref(null)

function _subWkey(t, key) { return t.id + '::' + key }

function subColStyle(t, c) {
  const w = subColWidths.value[_subWkey(t, c.key)] || c.width
  return w ? { width: w } : null
}

function startSubResize(e, t, key) {
  const th = e.target.parentElement
  const rect = th.getBoundingClientRect()
  subResizing.value = { t, key, startX: e.clientX, startW: rect.width }
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  document.addEventListener('mousemove', onSubResizeMove)
  document.addEventListener('mouseup', onSubResizeEnd)
}

function onSubResizeMove(e) {
  const r = subResizing.value
  if (!r) return
  const diff = e.clientX - r.startX
  const newW = Math.max(60, r.startW + diff)
  subColWidths.value[_subWkey(r.t, r.key)] = newW + 'px'
}

function onSubResizeEnd() {
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
  document.removeEventListener('mousemove', onSubResizeMove)
  document.removeEventListener('mouseup', onSubResizeEnd)
  subResizing.value = null
}
</script>

<style scoped>
.record-detail { display: flex; flex-direction: column; height: 100%; }
.tab-row { display: flex; gap: 2px; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: thin; }
.tab-row::-webkit-scrollbar { height: 4px; }
.tab-row::-webkit-scrollbar-thumb { background: #c0d0e8; border-radius: 2px; }
.tab { padding: 5px 9px; cursor: pointer; border: 1px solid var(--amos-border); border-bottom: none; border-radius: 6px 6px 0 0; background: #f3f6fa; color: var(--amos-text-soft); font-size: 11.5px; white-space: nowrap; flex-shrink: 0; }
.tab:hover { background: #fff; }
.tab.active { background: #fff; color: var(--amos-blue); font-weight: 700; box-shadow: inset 0 -2px 0 var(--amos-blue); }
/* 核心：tab-body 是唯一的内容滚动容器 */
.tab-body { flex: 1; min-height: 0; min-width: 0; overflow: auto; padding: 12px; border: 1px solid var(--amos-border); border-radius: 0 0 6px 6px; }
.tab-body::-webkit-scrollbar { width: 8px; height: 8px; }
.tab-body::-webkit-scrollbar-track { background: #f5f7fa; }
.tab-body::-webkit-scrollbar-thumb { background: #c2d2e8; border-radius: 4px; }
.tab-body::-webkit-scrollbar-thumb:hover { background: #9bb6d8; }
.rd-note { margin: 0 0 10px; color: var(--amos-text-soft); font-size: 13px; line-height: 1.6; }
/* 子表格包裹层 */
.table-wrap { overflow-x: auto; margin-top: 8px; }
.amos-grid.sub { border-collapse: collapse; font-size: 12.5px; width: 100%; }
.amos-grid.sub th, .amos-grid.sub td { border: 1px solid var(--amos-border); padding: 4px 6px; text-align: left; vertical-align: middle; }
.amos-grid.sub th { background: #f3f6fa; font-weight: 600; color: var(--amos-text-soft); }
.subgrid-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
/* 列宽调整手柄 */
.amos-grid.sub th { position: relative; }
.amos-grid.sub th .col-resize { position: absolute; right: 0; top: 4px; bottom: 4px; width: 5px; cursor: col-resize; }
.amos-grid.sub th .col-resize::after { content: ''; position: absolute; left: 2px; top: 0; bottom: 0; width: 1px; background: var(--amos-border); opacity: 0; transition: opacity .15s; }
.amos-grid.sub th .col-resize:hover::after { opacity: 1; background: var(--amos-blue); }
.sub-actions { text-align: center; width: 46px; }
.cell-lookup { display: flex; gap: 4px; align-items: center; }
/* 子表行选中高亮（Update / Set Start 操作指定行） */
.amos-grid.sub tbody tr { cursor: pointer; }
.amos-grid.sub tbody tr.sub-sel { background: #e8f2fb !important; }
.cell-ro { display: inline-block; padding: 2px 4px; color: var(--amos-text-soft); }
.cell-lookup .amos-input { flex: 1; min-width: 0; }
.amos-input.sm, .amos-select.sm { width: 100%; min-width: 60px; padding: 3px 5px; font-size: 12px; }
.amos-btn.xs { padding: 3px 8px; font-size: 11.5px; }
.amos-btn.danger { color: #b3261e; }
.amos-btn.xs.danger:hover { background: #fdecea; }
</style>
