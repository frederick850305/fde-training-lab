<template>
  <div class="record-list">
    <div class="rl-toolbar">
      <input v-model="q" class="amos-input" style="max-width:280px" placeholder="在列表中搜索…" />
      <span class="spacer" />
      <span v-if="selectable" class="muted">已选 {{ checkedList.length }} 条</span>
      <span class="muted">{{ filtered.length }} / {{ rows.length }} 条</span>
    </div>
    <div class="rl-scroll">
      <table class="amos-grid">
        <thead>
          <tr>
            <th v-if="selectable" class="col-check">
              <input type="checkbox" :checked="allChecked" @change="toggleAll" title="全选" />
            </th>
            <th
              v-for="c in columns"
              :key="c.key"
              :style="c.width ? { width: c.width } : null"
              @click="sortBy(c.key)"
            >
              {{ c.label }}
              <span v-if="sortKey === c.key" class="sort-caret">{{ sortDir === 'asc' ? '▲' : '▼' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in filtered"
            :key="row[rowKey]"
            :class="{ selected: row[rowKey] === selectedId }"
            @click="select(row)"
            @dblclick="$emit('open', row)"
          >
            <td v-if="selectable" class="col-check" @click.stop>
              <input type="checkbox" :checked="checkedSet.has(row[rowKey])" @change="toggle(row)" />
            </td>
            <td
              v-for="c in columns"
              :key="c.key"
              :class="{ num: c.align === 'right' }"
            >
              <slot :name="'cell-' + c.key" :row="row" :value="row[c.key]">
                <span v-if="c.tag" :class="['tag', tagClass(row[c.key])]">{{ row[c.key] }}</span>
                <span v-else>{{ row[c.key] }}</span>
              </slot>
            </td>
          </tr>
          <tr v-if="!filtered.length">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="muted" style="text-align:center;padding:18px">无记录（点击 New 或调整 Filter）</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, default: () => [] },
  rowKey: { type: String, default: 'id' },
  selectable: { type: Boolean, default: false },
  checked: { type: Array, default: () => [] },
  preselectId: { type: String, default: '' }, // 外部指令性预选中某行（如回跳上下文恢复时由父组件传入）
})
const emit = defineEmits(['select', 'open', 'update:checked'])

const q = ref('')
const sortKey = ref('')
const sortDir = ref('asc')
const selectedId = ref('')
const checkedSet = ref(new Set(props.checked))

watch(() => props.checked, (v) => { checkedSet.value = new Set(v) })

// 外部指令性预选中：当父组件传入 preselectId 时同步到内部选中状态（用于回跳上下文恢复等场景）
import { watch as watchPreselect } from 'vue'
watchPreselect(() => props.preselectId, (id) => {
  if (id) selectedId.value = id
})

const filtered = computed(() => {
  let list = props.rows
  const s = q.value.trim().toLowerCase()
  if (s) {
    list = list.filter((r) => props.columns.some((c) => String(r[c.key] ?? '').toLowerCase().includes(s)))
  }
  if (sortKey.value) {
    list = [...list].sort((a, b) => {
      const av = a[sortKey.value]
      const bv = b[sortKey.value]
      if (av == null) return 1
      if (bv == null) return -1
      const r = av < bv ? -1 : av > bv ? 1 : 0
      return sortDir.value === 'asc' ? r : -r
    })
  }
  return list
})

const checkedList = computed(() => props.rows.filter((r) => checkedSet.value.has(r[props.rowKey])))
const allChecked = computed(() => filtered.value.length > 0 && filtered.value.every((r) => checkedSet.value.has(r[props.rowKey])))

function emitChecked() { emit('update:checked', [...checkedSet.value]) }
function toggle(row) {
  const k = row[props.rowKey]
  if (checkedSet.value.has(k)) checkedSet.value.delete(k)
  else checkedSet.value.add(k)
  checkedSet.value = new Set(checkedSet.value)
  emitChecked()
}
function toggleAll(e) {
  const on = e.target.checked
  filtered.value.forEach((r) => { const k = r[props.rowKey]; if (on) checkedSet.value.add(k); else checkedSet.value.delete(k) })
  checkedSet.value = new Set(checkedSet.value)
  emitChecked()
}

function sortBy(key) {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else {
    sortKey.value = key
    sortDir.value = 'asc'
  }
}
function select(row) {
  selectedId.value = row[props.rowKey]
  emit('select', row)
}
function tagClass(val) {
  if (typeof val !== 'string') return 'gray'
  const v = val.toLowerCase()
  if (/(completed|available|active|passed|posted|open|issued|received)/.test(v)) return 'green'
  if (/(requested|planned|quoted|approved|partly|submitted|in transit|stable)/.test(v)) return 'blue'
  if (/(overdue|critical|shortage|rejected|postponed|cancelled|draft|up)/.test(v)) return 'red'
  if (/(due|pending|warning|orange)/.test(v)) return 'orange'
  return 'gray'
}
function clearSelection() {
  selectedId.value = ''
}
defineExpose({ clearSelection, selectedId })
</script>

<style scoped>
.record-list { display: flex; flex-direction: column; height: 100%; }
.rl-toolbar { display: flex; align-items: center; gap: 8px; padding: 8px 4px; }
.rl-scroll { flex: 1; overflow: auto; border: 1px solid var(--amos-border); border-radius: 6px; background: #fff; }
.col-check { width: 34px; text-align: center; }
.sort-caret { font-size: 9px; color: var(--amos-blue); margin-left: 3px; }
</style>
