<template>
  <section class="empty-state">
    <strong>{{ title }}</strong>
    <p>{{ description }}</p>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: '暂无数据',
  },
  description: {
    type: String,
    default: '当前没有可展示的内容。',
  },
})
</script>

<style scoped>
.empty-state {
  display: grid;
  place-items: center;
  min-height: 180px;
  padding: 24px;
  text-align: center;
  background: #f8fafc;
}

.empty-state strong {
  color: #0f172a;
  font-size: 18px;
}

.empty-state p {
  max-width: 420px;
  margin: 8px 0 0;
  color: #64748b;
  line-height: 1.65;
}
</style>