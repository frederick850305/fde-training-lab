<template>
  <span class="status-tag" :class="kind">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
})

const kind = computed(() => {
  if (['空闲', '已完成', '已入场', '通过', '已解除'].includes(props.label)) return 'success'
  if (['排队', '待接单', '待核验', '待派车', '已确认'].includes(props.label)) return 'warning'
  if (['异常', '待处理', '高'].includes(props.label)) return 'danger'
  if (['任务中', '进行中'].includes(props.label)) return 'primary'
  return 'neutral'
})
</script>
