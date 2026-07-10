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
            <button v-for="o in config.options" :key="o.action" @click="runOption(o)">{{ o.label }}</button>
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

    <div v-else class="bw-body">
      <!-- 左：结果列表 -->
      <section class="bw-list">
        <RecordList
          ref="listRef"
          :columns="config.columns"
          :rows="viewRows"
          :row-key="rowKey"
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
        <RecordDetail :tabs="config.detailTabs" :model="selected" @change="onFieldChange" />
      </section>
      <section v-else class="bw-detail empty">
        <p class="muted">双击列表行查看明细，或点击 <b>New</b> 创建记录。</p>
      </section>
    </div>

    <div v-if="!config" class="bw-empty muted">该窗口未配置。</div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import FilterDialog from './FilterDialog.vue'
import RecordList from './RecordList.vue'
import RecordDetail from './RecordDetail.vue'
import { store, showToast } from '../store.js'
import { db } from '../mock/index.js'
import { windowRegistry } from '../windows/registry.js'
import { matchRow, matchPlanning } from '../utils/filter.js'

const config = computed(() => windowRegistry[store.activeKey] || null)
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
  return d ? db[d] : []
})
const viewRows = ref([])
const showFilter = ref(false)
const selected = ref(null)
const optionsOpen = ref(false)
const listRef = ref(null)

const statusClass = computed(() => {
  const v = (selected.value && selected.value[config.value?.statusField]) || ''
  const s = String(v).toLowerCase()
  if (/(completed|available|active|passed|posted|open|issued|received)/.test(s)) return 'green'
  if (/(requested|planned|quoted|approved|partly|submitted|in transit|stable)/.test(s)) return 'blue'
  if (/(overdue|critical|shortage|rejected|postponed|cancelled|draft|up)/.test(s)) return 'red'
  if (/(due|pending|warning)/.test(s)) return 'orange'
  return 'gray'
})

function reset() {
  showFilter.value = false
  selected.value = null
  optionsOpen.value = false
  viewRows.value = dbRows.value.slice()
}
watch(() => store.activeKey, () => { reset(); applyPreset() })

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
}

function reopenFilter() {
  selected.value = null
  showFilter.value = true
}

function onSelect(row) {
  selected.value = row
}
function onOpen(row) {
  selected.value = row
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
  dbRows.value.push(rec)
  viewRows.value = [...viewRows.value, rec]
  selected.value = rec
  showToast('已新建记录，编辑后点击 Save', 'ok')
}
function doSave() {
  if (!selected.value) return showToast('请先选择或新建记录', 'warn')
  showToast('已保存（原型：内存态）', 'ok')
}
function doDelete() {
  if (!selected.value) return showToast('请先选择记录', 'warn')
  const i = dbRows.value.findIndex((r) => r[rowKey.value] === selected.value[rowKey.value])
  if (i >= 0) dbRows.value.splice(i, 1)
  const j = viewRows.value.findIndex((r) => r[rowKey.value] === selected.value[rowKey.value])
  if (j >= 0) viewRows.value.splice(j, 1)
  selected.value = null
  showToast('已删除记录', 'warn')
}
function doRefresh() {
  applyFilter({})
  showToast('已刷新', 'info')
}
function onFieldChange() {
  /* 内存态自动同步 */
}

function runOption(o) {
  optionsOpen.value = false
  showToast(`执行：${o.label}（原型演示）`, 'info')
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
onBeforeUnmount(() => window.removeEventListener('amos-action', onAction))
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
.bw-empty { padding: 30px; text-align: center; }
@media (max-width: 980px) {
  .bw-body { grid-template-columns: 1fr; }
  .bw-list { border-right: none; border-bottom: 1px solid var(--amos-border); }
}
</style>
