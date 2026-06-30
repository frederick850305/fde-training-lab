<template>
  <header class="topbar">
    <div>
      <span class="brand-mark">{{ mark }}</span>
      <span class="brand-name">{{ name }}</span>
    </div>
  </header>
</template>

<script setup>
defineProps({
  mark: {
    type: String,
    default: 'FDE',
  },
  name: {
    type: String,
    default: 'Prototype Factory',
  },
})
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 14px 0 30px;
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  margin-right: 12px;
  border-radius: 8px;
  background: #1d4ed8;
  color: #ffffff;
  font-size: 14px;
  font-weight: 800;
}

.brand-name {
  color: #0f172a;
  font-size: 18px;
  font-weight: 800;
}


@media (max-width: 860px) {
  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>