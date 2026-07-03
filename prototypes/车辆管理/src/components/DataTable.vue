<template>
  <div class="data-table">
    <table v-if="data.length > 0">
      <thead>
        <tr>
          <th v-if="expandable" class="expand-col"></th>
          <th v-for="col in columns" :key="col.key"
              :style="{ width: col.width, textAlign: col.align || 'left' }"
              @click="col.sortable && emit('sortChange', { key: col.key, order: currentSort.order === 'asc' ? 'desc' : 'asc' })"
              :class="{ sortable: col.sortable, 'sort-asc': currentSort.key === col.key && currentSort.order === 'asc', 'sort-desc': currentSort.key === col.key && currentSort.order === 'desc' }">
            {{ col.title }}
            <span v-if="col.sortable" class="sort-indicator">
              <span class="arrow up" :class="{ active: currentSort.key === col.key && currentSort.order === 'asc' }">▲</span>
              <span class="arrow down" :class="{ active: currentSort.key === col.key && currentSort.order === 'desc' }">▼</span>
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(row, index) in data" :key="row[rowKey]">
          <tr @click="emit('rowClick', row)" :class="{ 'is-expanded': expandedRows.has(row[rowKey]) }">
            <td v-if="expandable" class="expand-col">
              <span class="expand-toggle" @click.stop="toggleExpand(row)">
                {{ expandedRows.has(row[rowKey]) ? '−' : '+' }}
              </span>
            </td>
            <td v-for="col in columns" :key="col.key"
                :style="{ textAlign: col.align || 'left' }">
              <slot v-if="$slots.cell" name="cell" :column="col" :row="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
              <template v-else>{{ row[col.key] }}</template>
            </td>
          </tr>
          <tr v-if="expandable && expandedRows.has(row[rowKey])" class="expand-row">
            <td :colspan="columns.length + 1">
              <slot name="expandRow" :row="row"></slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div v-else class="empty-state">
      <slot name="empty">{{ emptyText }}</slot>
    </div>
    <div v-if="pagination" class="pagination">
      <button :disabled="pagination.current <= 1" @click="emit('pageChange', pagination.current - 1)">上一页</button>
      <span>第 {{ pagination.current }} 页 / 共 {{ totalPages }} 页</span>
      <button :disabled="pagination.current >= totalPages" @click="emit('pageChange', pagination.current + 1)">下一页</button>
      <select :value="pagination.pageSize" @change="emit('pageSizeChange', Number($event.target.value))">
        <option :value="10">10 条/页</option>
        <option :value="20">20 条/页</option>
        <option :value="50">50 条/页</option>
      </select>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

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
});

const emit = defineEmits(['sortChange', 'pageChange', 'pageSizeChange', 'rowClick', 'expandChange']);

const currentSort = ref({ key: '', order: '' });
const expandedRows = ref(new Set());

const toggleExpand = (row) => {
  const key = row[props.rowKey];
  if (expandedRows.value.has(key)) {
    expandedRows.value.delete(key);
    emit('expandChange', { row, expanded: false });
  } else {
    expandedRows.value.add(key);
    emit('expandChange', { row, expanded: true });
  }
};

const totalPages = computed(() => {
  if (!props.pagination) return 1;
  return Math.ceil(props.pagination.total / props.pagination.pageSize);
});
</script>

<style scoped>
.data-table {
  width: 100%;
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}
th, td {
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  text-align: left;
  font-size: 14px;
}
th {
  background: #f5f5f5;
  font-weight: 600;
  white-space: nowrap;
  cursor: default;
}
th.sortable {
  cursor: pointer;
  user-select: none;
}
th.sortable:hover {
  background: #e8e8e8;
}
.sort-indicator {
  display: inline-flex;
  flex-direction: column;
  vertical-align: middle;
  margin-left: 4px;
  font-size: 10px;
  line-height: 1;
}
.sort-indicator .arrow {
  opacity: 0.3;
  transition: opacity 0.2s;
}
.sort-indicator .arrow.active {
  opacity: 1;
}
.expand-col {
  width: 40px;
  text-align: center;
}
.expand-toggle {
  cursor: pointer;
  display: inline-block;
  width: 20px;
  height: 20px;
  line-height: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  background: #fafafa;
}
.expand-toggle:hover {
  background: #e8e8e8;
}
.expand-row td {
  background: #f9f9f9;
}
.empty-state {
  padding: 40px;
  text-align: center;
  color: #999;
}
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px 0;
  gap: 8px;
  font-size: 14px;
}
.pagination button {
  padding: 4px 12px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.pagination button:disabled {
  color: #ccc;
  cursor: not-allowed;
}
.pagination select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #fff;
}
</style>