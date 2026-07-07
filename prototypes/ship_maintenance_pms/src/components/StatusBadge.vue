<template>
  <span class="status-badge" :class="tone">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
})

const tone = computed(() => {
  if (props.label.includes('异常') || props.label.includes('驳回') || props.label.includes('过期')) return 'danger'
  if (props.label.includes('闭环') || props.label.includes('通过') || props.label.includes('已生效')) return 'ok'
  if (props.label.includes('进行') || props.label.includes('审核')) return 'active'
  return 'pending'
})
</script>

<style scoped>
.status-badge { display: inline-flex; min-width: 58px; justify-content: center; border-radius: 999px; padding: 4px 9px; font-size: 12px; font-weight: 900; }
.pending { color: #8a5a00; background: #fff2cc; }
.active { color: #1f5fbf; background: #e3efff; }
.ok { color: #11734d; background: #dff6e8; }
.danger { color: #b4232d; background: #ffe1e3; }
</style>
