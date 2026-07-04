<template>
  <div class="data-filter-bar">
    <div class="filter-controls">
      <template v-for="filter in filters" :key="filter.key">
        <div class="filter-item">
          <label>{{ filter.label }}</label>
          <input
            v-if="filter.type === 'input'"
            type="text"
            :placeholder="filter.placeholder"
            :value="modelValue[filter.key] || ''"
            @input="handleInput(filter.key, $event.target.value)"
          />
          <select
            v-else-if="filter.type === 'select'"
            :value="modelValue[filter.key] || ''"
            @change="handleInput(filter.key, $event.target.value)"
          >
            <option value="">全部</option>
            <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
          </select>
          <div v-else-if="filter.type === 'dateRange'" class="date-range">
            <input
              type="date"
              :value="modelValue[filter.key + '_start'] || ''"
              @input="handleInput(filter.key + '_start', $event.target.value)"
            />
            <span>至</span>
            <input
              type="date"
              :value="modelValue[filter.key + '_end'] || ''"
              @input="handleInput(filter.key + '_end', $event.target.value)"
            />
          </div>
        </div>
      </template>
    </div>
    <div class="filter-actions">
      <slot name="extra" />
      <button v-if="showSearchButton" type="button" class="search-btn" @click="$emit('search', modelValue)">查询</button>
      <button type="button" class="reset-btn" @click="handleReset">重置</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  filters: { type: Array, required: true },
  modelValue: { type: Object, required: true },
  showSearchButton: { type: Boolean, default: true },
  autoSearchDelay: { type: Number, default: 300 },
})

const emit = defineEmits(['update:modelValue', 'search', 'reset'])

let timer = null
function handleInput(key, value) {
  const updated = { ...props.modelValue, [key]: value }
  emit('update:modelValue', updated)
  if (!props.showSearchButton) {
    clearTimeout(timer)
    timer = setTimeout(() => emit('search', updated), props.autoSearchDelay)
  }
}

function handleReset() {
  const cleared = {}
  props.filters.forEach(f => {
    if (f.type === 'dateRange') {
      cleared[f.key + '_start'] = ''
      cleared[f.key + '_end'] = ''
    } else {
      cleared[f.key] = ''
    }
  })
  emit('update:modelValue', cleared)
  emit('reset')
}
</script>

<style scoped>
.data-filter-bar {
  display: flex; flex-wrap: wrap; align-items: flex-end; gap: 12px;
  padding: 12px 16px; background: #fff; border-radius: 10px; border: 1px solid #e2e8f0;
}
.filter-controls { display: flex; flex-wrap: wrap; gap: 12px; flex: 1; }
.filter-item { display: grid; gap: 4px; }
.filter-item label { font-size: 12px; color: #64748b; font-weight: 600; }
.filter-item input, .filter-item select {
  padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 7px; font-size: 13px; background: #fff;
}
.date-range { display: flex; align-items: center; gap: 6px; }
.date-range input { width: 140px; padding: 6px 8px; border: 1px solid #cbd5e1; border-radius: 7px; font-size: 12px; }
.filter-actions { display: flex; gap: 8px; align-items: flex-end; }
.search-btn { padding: 7px 16px; background: #1a56db; color: #fff; border: none; border-radius: 7px; font-size: 13px; font-weight: 700; }
.reset-btn { padding: 7px 16px; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1; border-radius: 7px; font-size: 13px; }
</style>
