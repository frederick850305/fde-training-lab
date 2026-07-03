<template>
  <div class="data-filter-bar">
    <div v-for="(filter, index) in filters" :key="index" class="filter-item">
      <label v-if="filter.label" class="filter-label">{{ filter.label }}</label>
      <!-- 时间范围选择器 -->
      <a-date-picker
        v-if="filter.type === 'dateRange'"
        :value="modelValue[filter.key]"
        :placeholder="filter.placeholder || '选择日期范围'"
        type="range"
        @change="(dates) => handleFilterChange(filter.key, dates)"
      />
      <!-- 下拉选择器 -->
      <a-select
        v-else-if="filter.type === 'select'"
        :value="modelValue[filter.key]"
        :placeholder="filter.placeholder || '请选择'"
        :options="filter.options || []"
        allow-clear
        @change="(value) => handleFilterChange(filter.key, value)"
      />
      <!-- 搜索输入框 -->
      <a-input
        v-else-if="filter.type === 'input'"
        :value="modelValue[filter.key]"
        :placeholder="filter.placeholder || '请输入搜索关键词'"
        allow-clear
        @input="(e) => handleFilterChange(filter.key, e.target.value)"
        @press-enter="handleSearch"
      />
    </div>
    <slot name="extra"></slot>
    <a-button v-if="showSearchButton" type="primary" @click="handleSearch">查询</a-button>
    <a-button @click="handleReset">重置</a-button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

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

const timer = ref(null)

function handleFilterChange(key, value) {
  const newValue = { ...props.modelValue, [key]: value }
  emit('update:modelValue', newValue)
  if (!props.showSearchButton) {
    if (timer.value) clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      emit('search', newValue)
    }, props.autoSearchDelay)
  }
}

function handleSearch() {
  if (timer.value) clearTimeout(timer.value)
  emit('search', { ...props.modelValue })
}

function handleReset() {
  emit('reset')
}

watch(() => props.modelValue, (newVal) => {
  // 可做额外处理，但纯展示组件无需业务逻辑
})
</script>

<style scoped>
.data-filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #fff;
  border-bottom: 1px solid #e8e8e8;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  color: #333;
  white-space: nowrap;
}

.filter-item .ant-input,
.filter-item .ant-select,
.filter-item .ant-picker {
  min-width: 200px;
}
</style>