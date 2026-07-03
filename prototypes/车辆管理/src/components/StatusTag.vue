<template>
  <span
    :class="['status-tag', 'status-tag--' + size, customClass]"
    :style="{ backgroundColor: colorMap[status]?.bg || '#e0e0e0', color: colorMap[status]?.text || '#333' }"
  >
    {{ displayText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    default: ''
  },
  text: {
    type: String,
    required: false,
    default: ''
  },
  size: {
    type: String,
    required: false,
    default: 'default',
    validator: (val) => ['small', 'default', 'large'].includes(val)
  },
  customClass: {
    type: String,
    required: false,
    default: ''
  }
})

const colorMap = {
  '空闲': { bg: '#52c41a', text: '#fff' },
  '任务中': { bg: '#1890ff', text: '#fff' },
  '成功': { bg: '#52c41a', text: '#fff' },
  '失败': { bg: '#ff4d4f', text: '#fff' },
  '警告': { bg: '#faad14', text: '#fff' },
  '默认': { bg: '#d9d9d9', text: '#333' }
}

const displayText = computed(() => props.text || props.status)
</script>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
}
.status-tag--small {
  padding: 1px 6px;
  font-size: 10px;
}
.status-tag--large {
  padding: 4px 12px;
  font-size: 14px;
}
</style>