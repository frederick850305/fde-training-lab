<template>
  <div class="data-table">
    <table v-if="rows.length">
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row[rowKey]">
          <td v-for="column in columns" :key="column.key">
            <slot :name="column.key" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>

    <EmptyState v-else :title="emptyTitle" :description="emptyDescription" />
  </div>
</template>

<script setup>
import EmptyState from './EmptyState.vue'

defineProps({
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  emptyTitle: {
    type: String,
    default: '暂无数据',
  },
  emptyDescription: {
    type: String,
    default: '当前没有可展示的数据。',
  },
})
</script>

<style scoped>
.data-table {
  overflow-x: auto;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 640px;
}

th,
td {
  border-bottom: 1px solid #e2e8f0;
  padding: 12px 14px;
  text-align: left;
}

th {
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

td {
  color: #263244;
  line-height: 1.55;
}

tbody tr:last-child td {
  border-bottom: 0;
}
</style>