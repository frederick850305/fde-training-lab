<template>
  <div class="kpi-card" :class="tone">
    <span class="kpi-label">{{ label }}</span>
    <strong class="kpi-value">{{ value }}</strong>
    <span v-if="sub" class="kpi-sub">{{ sub }}</span>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  sub: { type: String, default: '' },
  tone: { type: String, default: 'blue' },
})
</script>
