<template>
  <div class="data-filter-bar">
    <div class="filter-items">
      <template v-for="filter in filters" :key="filter.key">
        <div class="filter-item">
          <label class="filter-label" v-if="filter.label">{{ filter.label }}</label>
          <div v-if="filter.type === 'dateRange'" class="date-range">
            <input
              type="date"
              :value="modelValue[filter.key + '_start'] || ''"
              @input="updateFilter(filter.key + '_start', $event.target.value)"
            />
            <span class="range-separator">至</span>
            <input
              type="date"
              :value="modelValue[filter.key + '_end'] || ''"
              @input="updateFilter(filter.key + '_end', $event.target.value)"
            />
          </div>
          <select
            v-else-if="filter.type === 'select'"
            :value="modelValue[filter.key] || ''"
            @change="updateFilter(filter.key, $event.target.value)"
          >
            <option value="">{{ filter.placeholder || '请选择' }}</option>
            <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <input
            v-else-if="filter.type === 'input'"
            :type="filter.inputType || 'text'"
            :value="modelValue[filter.key] || ''"
            :placeholder="filter.placeholder || '请输入'"
            @input="updateFilter(filter.key, $event.target.value)"
          />
        </div>
      </template>
    </div>
    <div class="filter-extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  filters: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: Object,
    required: true,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue'])

function updateFilter(key, value) {
  const newValue = { ...modelValue, [key]: value }
  emit('update:modelValue', newValue)
}
</script>

<style scoped>
.data-filter-bar {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  padding: 12px 16px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}
.filter-items {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  flex: 1;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-label {
  font-size: 12px;
  color: #666;
}
.date-range {
  display: flex;
  align-items: center;
  gap: 4px;
}
.date-range input {
  width: 140px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.range-separator {
  color: #999;
}
select, input[type="text"] {
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-width: 120px;
}
.filter-extra {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
}
</style>