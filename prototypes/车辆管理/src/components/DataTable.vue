<template>
  <div class="data-table-wrapper">
    <table v-if="data.length > 0 || $slots.empty" class="data-table">
      <thead>
        <tr>
          <th v-if="expandable" class="expand-column" />
          <th
            v-for="col in columns"
            :key="col.key"
            :style="{ width: col.width, textAlign: col.align || 'left' }"
            class="table-header-cell"
            @click="handleSort(col)"
          >
            <span>{{ col.title }}</span>
            <span v-if="col.sortable" class="sort-icon">
              {{ internalSort.key === col.key ? (internalSort.order === 'asc' ? '▲' : '▼') : '⇅' }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in data" :key="row[rowKey]">
          <tr
            class="table-row"
            @click="$emit('rowClick', row)"
          >
            <td v-if="expandable" class="expand-cell" @click.stop="toggleExpand(row)">
              {{ isExpanded(row) ? '▼' : '▶' }}
            </td>
            <td
              v-for="col in columns"
              :key="col.key"
              :style="{ textAlign: col.align || 'left' }"
              class="table-cell"
            >
              <slot :name="col.slot || col.key" :column="col" :row="row" :value="row[col.key]">
                <slot name="cell" :column="col" :row="row" :value="row[col.key]">
                  {{ row[col.key] ?? '-' }}
                </slot>
              </slot>
            </td>
          </tr>
          <tr v-if="expandable && isExpanded(row)" class="expand-row">
            <td :colspan="columns.length + 1">
              <slot name="expandRow" :row="row">
                <div class="expand-placeholder">展开内容区域</div>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <slot name="empty">
        <span>{{ emptyText }}</span>
      </slot>
    </div>
    <div v-if="pagination" class="pagination-bar">
      <button :disabled="pagination.current <= 1" @click="$emit('pageChange', pagination.current - 1)">上一页</button>
      <span>第 {{ pagination.current }} / {{ totalPages }} 页，共 {{ pagination.total }} 条</span>
      <button :disabled="pagination.current >= totalPages" @click="$emit('pageChange', pagination.current + 1)">下一页</button>
      <select :value="pagination.pageSize" @change="$emit('pageSizeChange', Number($event.target.value))">
        <option v-for="size in [10, 20, 50, 100]" :key="size" :value="size">{{ size }}条/页</option>
      </select>
    </div>
    <div v-if="loading" class="loading-overlay">
      <span>加载中...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
    default: () => []
  },
  data: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无数据'
  },
  pagination: {
    type: Object,
    default: null
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  expandable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['sortChange', 'pageChange', 'pageSizeChange', 'rowClick', 'expandChange'])

const internalSort = ref({ key: '', order: 'asc' })
const expandedSet = ref(new Set())

const totalPages = computed(() => {
  if (!props.pagination) return 0
  return Math.ceil(props.pagination.total / props.pagination.pageSize)
})

function handleSort(col) {
  if (!col.sortable) return
  const key = col.key
  let order = 'asc'
  if (internalSort.value.key === key) {
    order = internalSort.value.order === 'asc' ? 'desc' : 'asc'
  }
  internalSort.value = { key, order }
  emit('sortChange', { key, order })
}

function toggleExpand(row) {
  const id = row[props.rowKey]
  const expanded = expandedSet.value.has(id)
  if (expanded) {
    expandedSet.value.delete(id)
  } else {
    expandedSet.value.add(id)
  }
  emit('expandChange', { row, expanded: !expanded })
}

function isExpanded(row) {
  return expandedSet.value.has(row[props.rowKey])
}
</script>

<style scoped>
.data-table-wrapper {
  position: relative;
  width: 100%;
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #d9d9d9;
}
.table-header-cell {
  padding: 8px 12px;
  background-color: #fafafa;
  font-weight: 600;
  border-bottom: 2px solid #e8e8e8;
  cursor: pointer;
  user-select: none;
}
.table-header-cell:hover {
  background-color: #f0f0f0;
}
.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  opacity: 0.6;
}
.table-row {
  border-bottom: 1px solid #e8e8e8;
}
.table-row:hover {
  background-color: #f5f5f5;
}
.table-cell {
  padding: 8px 12px;
}
.expand-column, .expand-cell {
  width: 30px;
  text-align: center;
  cursor: pointer;
}
.expand-row td {
  padding: 12px;
  background-color: #f9f9f9;
}
.expand-placeholder {
  color: #999;
}
.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #999;
}
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0;
  gap: 12px;
}
.pagination-bar button, .pagination-bar select {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: white;
  cursor: pointer;
}
.pagination-bar button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #666;
}
</style>
