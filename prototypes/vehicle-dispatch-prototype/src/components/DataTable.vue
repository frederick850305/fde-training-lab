<template>
  <div class="data-table">
    <table>
      <thead>
        <tr>
          <th v-for="column in columns" :key="column.key">{{ column.label }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="!rows.length">
          <td :colspan="columns.length" class="empty-cell">{{ emptyText }}</td>
        </tr>
        <tr
          v-for="row in rows"
          :key="row[rowKey]"
          :class="{ active: selectedKey && row[rowKey] === selectedKey }"
          @click="$emit('row-click', row)"
        >
          <td v-for="column in columns" :key="column.key">
            <slot :name="column.key" :row="row">
              {{ row[column.key] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  rowKey: { type: String, default: 'id' },
  selectedKey: { type: String, default: '' },
  emptyText: { type: String, default: '暂无数据' },
})

defineEmits(['row-click'])
</script>
