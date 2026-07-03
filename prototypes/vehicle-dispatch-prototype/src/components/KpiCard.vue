<template>
  <button class="kpi-card" type="button" @click="$emit('select')">
    <span class="kpi-label">{{ label }}</span>
    <strong>{{ value }}<small>{{ unit }}</small></strong>
    <span class="kpi-trend" :class="trendDirection">{{ trendText }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  trendText: { type: String, default: '较昨日持平' },
  trendDirection: { type: String, default: 'up' },
})

defineEmits(['select'])
</script>
