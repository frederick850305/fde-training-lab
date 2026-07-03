<template>
  <div class="data-filter-bar">
    <div v-for="filter in filters" :key="filter.key" class="filter-item">
      <label>{{ filter.label }}</label>
      <template v-if="filter.type === 'dateRange'">
        <input type="date" :value="modelValue[filter.key]?.[0]" @input="updateDateRange(filter.key, $event, 'start')" />
        <span>至</span>
        <input type="date" :value="modelValue[filter.key]?.[1]" @input="updateDateRange(filter.key, $event, 'end')" />
      </template>
      <template v-else-if="filter.type === 'select'">
        <select :value="modelValue[filter.key]" @change="updateFilter(filter.key, $event.target.value)">
          <option value="">全部</option>
          <option v-for="opt in filter.options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
      </template>
      <template v-else-if="filter.type === 'input'">
        <input :type="filter.inputType || 'text'" :placeholder="filter.placeholder" :value="modelValue[filter.key]" @input="updateFilter(filter.key, $event.target.value)" />
      </template>
    </div>
    <div class="filter-actions">
      <button v-if="showSearchButton" @click="emitSearch">查询</button>
      <button @click="emitReset">重置</button>
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup>
import { watch, onUnmounted } from 'vue'

const props = defineProps({
  filters: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: Object,
    required: true,
    default: () => ({})
  },
  showSearchButton: {
    type: Boolean,
    default: true
  },
  autoSearchDelay: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['update:modelValue', 'search', 'reset'])

function updateFilter(key, value) {
  const newModel = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newModel)
}

function updateDateRange(key, event, bound) {
  const current = props.modelValue[key] || ['', '']
  let newRange
  if (bound === 'start') {
    newRange = [event.target.value, current[1]]
  } else {
    newRange = [current[0], event.target.value]
  }
  const newModel = { ...props.modelValue, [key]: newRange }
  emit('update:modelValue', newModel)
}

function emitSearch() {
  emit('search', props.modelValue)
}

function emitReset() {
  emit('reset')
}

let searchTimer = null
watch(
  () => props.modelValue,
  (newVal) => {
    if (!props.showSearchButton) {
      if (searchTimer) clearTimeout(searchTimer)
      searchTimer = setTimeout(() => {
        emit('search', newVal)
      }, props.autoSearchDelay)
    }
  },
  { deep: true }
)

onUnmounted(() => {
  if (searchTimer) clearTimeout(searchTimer)
})
</script>

<style scoped>
.data-filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
  padding: 12px;
  background: #f5f7fa;
  border-radius: 4px;
}
.filter-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.filter-item label {
  font-size: 12px;
  color: #666;
}
.filter-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>