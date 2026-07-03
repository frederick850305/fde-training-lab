<template>
  <div class="data-table">
    <div v-if="$slots.search || showSearch" class="search-bar">
      <slot name="search" :value="searchValue" :on-input="handleSearchInput">
        <input
          v-if="showSearch"
          type="text"
          :value="searchValue"
          @input="handleSearchInput"
          placeholder="搜索..."
          class="search-input"
        />
      </slot>
    </div>

    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th v-if="expandable" class="expand-col"></th>
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width, textAlign: col.align }"
              :class="{ sortable: col.sortable }"
              @click="col.sortable && $emit('sortChange', { key: col.key, order: getSortOrder(col.key) })"
            >
              {{ col.title }}
              <span v-if="col.sortable && sortKey === col.key" class="sort-indicator">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="row in data" :key="row[rowKey]">
            <tr @click="$emit('rowClick', row)" class="data-row">
              <td v-if="expandable" class="expand-col">
                <button @click.stop="toggleExpand(row)" class="expand-btn">
                  {{ isExpanded(row) ? '▼' : '▶' }}
                </button>
              </td>
              <td v-for="col in columns" :key="col.key" :style="{ textAlign: col.align }">
                <slot name="cell" :column="col" :row="row" :value="row[col.key]">
                  {{ row[col.key] }}
                </slot>
              </td>
            </tr>
            <tr v-if="expandable && isExpanded(row)" class="expand-row">
              <td :colspan="columns.length + 1">
                <slot name="expandRow" :row="row">
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="data.length === 0 && !loading" class="empty-state">
      <slot name="empty">
        {{ emptyText }}
      </slot>
    </div>

    <div v-if="loading" class="loading-state">加载中...</div>

    <div v-if="pagination" class="pagination">
      <button :disabled="pagination.current <= 1" @click="$emit('pageChange', pagination.current - 1)">上一页</button>
      <span>第 {{ pagination.current }} 页 / 共 {{ totalPages }} 页</span>
      <button :disabled="pagination.current >= totalPages" @click="$emit('pageChange', pagination.current + 1)">下一页</button>
      <select :value="pagination.pageSize" @change="handlePageSizeChange">
        <option v-for="size in [10, 20, 50, 100]" :key="size" :value="size">{{ size }}条/页</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

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
  },
  showSearch: {
    type: Boolean,
    default: false
  },
  searchValue: {
    type: String,
    default: ''
  },
  sortKey: {
    type: String,
    default: ''
  },
  sortOrder: {
    type: String,
    default: ''
  },
  expandedRowKeys: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'sortChange',
  'pageChange',
  'pageSizeChange',
  'rowClick',
  'expandChange',
  'searchChange'
])

const getSortOrder = (key) => {
  return (props.sortKey === key && props.sortOrder === 'asc') ? 'desc' : 'asc'
}

const isExpanded = (row) => {
  return props.expandedRowKeys.includes(row[props.rowKey])
}

const toggleExpand = (row) => {
  const key = row[props.rowKey]
  const expanded = !isExpanded(row)
  emit('expandChange', { row, expanded })
}

const handlePageSizeChange = (e) => {
  emit('pageSizeChange', Number(e.target.value))
}

const handleSearchInput = (e) => {
  const value = e.target.value
  emit('searchChange', value)
}

const totalPages = computed(() => {
  if (!props.pagination) return 0
  return Math.ceil(props.pagination.total / props.pagination.pageSize) || 1
})
</script>

<style scoped>
.data-table {
  font-size: 14px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}
.search-bar {
  padding: 8px 12px;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e0;
}
.search-input {
  width: 200px;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.table-wrapper {
  overflow-x: auto;
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th,
.table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}
.table th {
  background: #f5f5f5;
  font-weight: 600;
  cursor: default;
}
.table th.sortable {
  cursor: pointer;
  user-select: none;
}
.sort-indicator {
  margin-left: 4px;
  font-size: 12px;
}
.expand-col {
  width: 40px;
  text-align: center;
}
.expand-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
}
.data-row:hover {
  background: #f0f0f0;
}
.expand-row td {
  background: #fafafa;
}
.empty-state,
.loading-state {
  padding: 20px;
  text-align: center;
  color: #999;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px 12px;
  gap: 8px;
  border-top: 1px solid #e0e0e0;
  background: #fafafa;
}
.pagination button {
  padding: 4px 10px;
  border: 1px solid #ccc;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.pagination select {
  padding: 4px 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
