<template>
  <header class="topbar">
    <div>
      <span class="brand-mark">{{ mark }}</span>
      <span class="brand-name">{{ name }}</span>
    </div>
    <span class="stage-badge">{{ stage }}</span>
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
  stage: {
    type: String,
    default: '第二阶段 · Vue3 Web 原型',
  },
})
</script>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
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

.stage-badge {
  border: 1px solid #bfdbfe;
  border-radius: 999px;
  padding: 8px 12px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

@media (max-width: 860px) {
  .topbar {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>