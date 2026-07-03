<template>
  <span
    class="status-tag"
    :class="[sizeClass, customClass]"
    :style="tagStyle"
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
    default: ''
  },
  size: {
    type: String,
    default: 'default'
  },
  customClass: {
    type: String,
    default: ''
  }
})

const colorMap = {
  '空闲': { bg: '#e1f3d8', text: '#67C23A' },
  '任务中': { bg: '#d9ecff', text: '#409EFF' },
  '成功': { bg: '#e1f3d8', text: '#67C23A' },
  '失败': { bg: '#fde2e2', text: '#F56C6C' },
  '警告': { bg: '#faecd8', text: '#E6A23C' },
  '默认': { bg: '#f0f2f5', text: '#909399' }
}

const displayText = computed(() => props.text || props.status)

const colors = computed(() => colorMap[props.status] || colorMap['默认'])

const sizeStyleMap = {
  small: { padding: '0 4px', fontSize: '12px' },
  default: { padding: '2px 8px', fontSize: '14px' },
  large: { padding: '4px 12px', fontSize: '16px' }
}

const sizeClass = `status-tag--${props.size}`

const tagStyle = computed(() => ({
  backgroundColor: colors.value.bg,
  color: colors.value.text,
  border: `1px solid ${colors.value.text}`,
  borderRadius: '4px',
  display: 'inline-block',
  lineHeight: '1.5',
  ...sizeStyleMap[props.size] || sizeStyleMap.default
}))
</script>

<style scoped>
.status-tag {
  display: inline-block;
  font-weight: 500;
  white-space: nowrap;
  vertical-align: middle;
}
</style>