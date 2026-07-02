<template>
  <article class="metric-card" :class="status">
    <span>{{ label }}</span>
    <strong>{{ value }}</strong>
    <p>{{ helper }}</p>
  </article>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  helper: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    default: 'normal',
  },
})
</script>

<style scoped>
.metric-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
}

.metric-card span {
  display: block;
  margin-bottom: 10px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.metric-card strong {
  display: block;
  margin-bottom: 8px;
  color: #0f172a;
  font-size: 28px;
}

.metric-card p {
  margin: 0;
  color: #526174;
  line-height: 1.55;
}

.metric-card.warning {
  border-color: #fde68a;
  background: #fffbeb;
}

.metric-card.danger {
  border-color: #fecaca;
  background: #fef2f2;
}

.metric-card.normal {
  border-color: #bbf7d0;
  background: #f0fdf4;
}
</style>