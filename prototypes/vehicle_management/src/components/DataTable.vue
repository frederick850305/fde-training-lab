<template>
  <div class="data-table-wrap">
    <div v-if="loading" class="table-loading">
      <div class="skeleton" v-for="n in 5" :key="n" :style="{ height: '36px', marginBottom: '8px', borderRadius: '6px' }"></div>
    </div>

    <div v-else-if="data.length === 0" class="table-empty">
      <slot name="empty">
        <span>📭</span>
        <p>{{ emptyText }}</p>
      </slot>
    </div>

    <table v-else class="data-table">
      <thead>
        <tr>
          <th v-if="expandable" style="width:40px"></th>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width, textAlign: col.align || 'left' }"
            :class="{ sortable: col.sortable }"
            @click="col.sortable && handleSort(col.key)"
          >
            {{ col.title }}
            <span v-if="sortKey === col.key" class="sort-arrow">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in data" :key="row[rowKey] || row.id">
          <tr @click="$emit('rowClick', row)">
            <td v-if="expandable" @click.stop="toggleExpand(row)">
              <span class="expand-icon">{{ expandedRows.has(row[rowKey]) ? '▾' : '▸' }}</span>
            </td>
            <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align || 'left' }">
              <slot :name="'cell'" :column="col" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="expandable && expandedRows.has(row[rowKey])">
            <td :colspan="columns.length + (expandable ? 1 : 0)">
              <slot name="expandRow" :row="row" />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-if="pagination && data.length > 0" class="table-pagination">
      <span>共 {{ pagination.total }} 条</span>
      <div class="page-controls">
        <button :disabled="pagination.current <= 1" @click="$emit('pageChange', pagination.current - 1)">‹</button>
        <span>{{ pagination.current }} / {{ Math.ceil(pagination.total / pagination.pageSize) || 1 }}</span>
        <button :disabled="pagination.current >= Math.ceil(pagination.total / pagination.pageSize)" @click="$emit('pageChange', pagination.current + 1)">›</button>
      </div>
      <select :value="pagination.pageSize" @change="$emit('pageSizeChange', Number($event.target.value))">
        <option value="10">10条/页</option>
        <option value="20">20条/页</option>
        <option value="50">50条/页</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  columns: { type: Array, required: true },
  data: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: '暂无数据' },
  pagination: { type: Object, default: null },
  rowKey: { type: String, default: 'id' },
  expandable: { type: Boolean, default: false },
})

defineEmits(['sortChange', 'pageChange', 'pageSizeChange', 'rowClick', 'expandChange'])

const sortKey = ref('')
const sortOrder = ref('asc')
const expandedRows = ref(new Set())

function handleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

function toggleExpand(row) {
  const id = row[props.rowKey]
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id)
  } else {
    expandedRows.value.add(id)
  }
  expandedRows.value = new Set(expandedRows.value)
}
</script>

<style scoped>
.data-table-wrap { background: #fff; border-radius: 10px; border: 1px solid #e2e8f0; overflow: hidden; }
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 10px 12px; background: #f8fafc; font-size: 12px; color: #64748b; font-weight: 700; text-align: left; border-bottom: 1px solid #e2e8f0; }
.data-table td { padding: 10px 12px; border-bottom: 1px solid #f1f5f9; font-size: 13px; color: #1e293b; }
.data-table tbody tr:hover { background: #f8fafc; cursor: pointer; }
.sortable { cursor: pointer; user-select: none; }
.sort-arrow { font-size: 10px; margin-left: 4px; }
.expand-icon { cursor: pointer; font-size: 14px; color: #64748b; }
.table-loading { padding: 20px; }
.skeleton { background: linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 6px; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
.table-empty { padding: 40px; text-align: center; color: #94a3b8; }
.table-empty span { font-size: 32px; display: block; margin-bottom: 8px; }
.table-empty p { margin: 0; font-size: 13px; }
.table-pagination { display: flex; align-items: center; justify-content: flex-end; gap: 12px; padding: 10px 16px; font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; }
.page-controls { display: flex; align-items: center; gap: 6px; }
.page-controls button { width: 28px; height: 28px; border: 1px solid #cbd5e1; border-radius: 6px; background: #fff; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
.page-controls button:disabled { opacity: 0.4; cursor: default; }
.table-pagination select { padding: 4px 8px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 12px; }
</style>
