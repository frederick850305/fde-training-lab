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
            <span class="muted">{{ subRows(t).length }} 条记录</span>
          </div>
          <table class="amos-grid sub">
            <thead><tr>
              <th v-for="c in t.columns" :key="c.key" :style="{ width: c.width }">{{ c.label }}</th>
              <th class="sub-actions"></th>
            </tr></thead>
            <tbody>
              <tr v-for="(row, ri) in subRows(t)" :key="rowKeyOf(row, ri)">
                <td v-for="c in t.columns" :key="c.key">
                  <template v-if="c.type === 'lookup'">
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
          </table>
        </template>
        <template v-else>
          <div v-for="f in t.fields" :key="f.key" class="amos-field">
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
import { db, lookups } from '../mock/index.js'

const props = defineProps({
  tabs: { type: Array, required: true },
  model: { type: Object, required: true },
  presetTabId: { type: String, default: '' }, // 外部指令：强制切换到指定 tab（如注册组件后跳转 Components）
})
const emit = defineEmits(['change'])

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
const lookupField = ref(null)
const lookupOptions = ref([])

function openLookup(f) {
  lookupField.value = f
  lookupOptions.value = (lookups[f.lookupKey] && lookups[f.lookupKey]()) || []
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
    const src = db[t.subSource.dbKey] || []
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
    db[t.subSource.dbKey].push(row)
  } else {
    const key = t.subKey
    if (!props.model[key]) props.model[key] = []
    props.model[key].push(row)
  }
  emit('change', {})
}
function delSubRow(t, row) {
  if (t.subSource) {
    const src = db[t.subSource.dbKey] || []
    const i = src.findIndex((r) => r === row || r.id === row.id)
    if (i >= 0) src.splice(i, 1)
  } else {
    const arr = props.model[t.subKey] || []
    const i = arr.findIndex((r) => r === row)
    if (i >= 0) arr.splice(i, 1)
  }
  emit('change', {})
}
function openSubLookup(t, c, row) {
  lookupField.value = { ...c, _row: row }
  lookupOptions.value = (lookups[c.lookupKey] && lookups[c.lookupKey]()) || []
}
</script>

<style scoped>
.record-detail { display: flex; flex-direction: column; height: 100%; min-width: 0; }
.tab-row { display: flex; flex-wrap: wrap; gap: 2px; }
.tab { padding: 6px 12px; cursor: pointer; border: 1px solid var(--amos-border); border-bottom: none; border-radius: 6px 6px 0 0; background: #f3f6fa; color: var(--amos-text-soft); font-size: 12.5px; white-space: nowrap; }
.tab:hover { background: #fff; }
.tab.active { background: #fff; color: var(--amos-blue); font-weight: 700; box-shadow: inset 0 -2px 0 var(--amos-blue); }
.tab-body { flex: 1; min-height: 0; overflow: auto; padding: 12px; border: 1px solid var(--amos-border); border-radius: 0 0 6px 6px; }
.rd-note { margin: 0 0 10px; color: var(--amos-text-soft); font-size: 13px; line-height: 1.6; }
.amos-grid.sub { width: 100%; border-collapse: collapse; font-size: 12.5px; }
.amos-grid.sub th, .amos-grid.sub td { border: 1px solid var(--amos-border); padding: 4px 6px; text-align: left; vertical-align: middle; }
.amos-grid.sub th { background: #f3f6fa; font-weight: 600; color: var(--amos-text-soft); }
.subgrid-bar { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.sub-actions { text-align: center; width: 46px; }
.cell-lookup { display: flex; gap: 4px; align-items: center; }
.cell-lookup .amos-input { flex: 1; min-width: 0; }
.amos-input.sm, .amos-select.sm { width: 100%; min-width: 60px; padding: 3px 5px; font-size: 12px; }
.amos-btn.xs { padding: 3px 8px; font-size: 11.5px; }
.amos-btn.danger { color: #b3261e; }
.amos-btn.xs.danger:hover { background: #fdecea; }
</style>
