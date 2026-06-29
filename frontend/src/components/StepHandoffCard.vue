<template>
  <article class="step-handoff-card">
    <div class="panel-heading">
      <span>{{ eyebrow }}</span>
      <strong>{{ title }}</strong>
    </div>

    <p v-if="summary">{{ summary }}</p>

    <dl>
      <div v-for="item in items" :key="item.label">
        <dt>{{ item.label }}</dt>
        <dd>{{ item.value }}</dd>
      </div>
    </dl>
  </article>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    default: '上一步结果',
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    default: '',
  },
  items: {
    type: Array,
    default: () => [],
  },
})
</script>

<style scoped>
.step-handoff-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 18px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.step-handoff-card p {
  margin: 0 0 12px;
  color: #526174;
  line-height: 1.7;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
}

.panel-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

dd {
  margin: 0;
  color: #172033;
  line-height: 1.6;
  font-weight: 800;
}
</style>