<template>
  <nav class="prototype-nav" aria-label="业务原型内部导航">
    <div class="prototype-nav-heading">
      <span>Business Prototype</span>
      <strong>业务原型页面</strong>
    </div>

    <div class="prototype-nav-list">
      <button
        v-for="item in items"
        :key="item.key"
        type="button"
        :class="{ active: item.key === activeKey }"
        @click="$emit('select', item.key)"
      >
        <span>{{ item.stage }}</span>
        {{ item.label }}
      </button>
    </div>
  </nav>
</template>

<script setup>
defineProps({
  items: {
    type: Array,
    required: true,
  },
  activeKey: {
    type: String,
    required: true,
  },
})

defineEmits(['select'])
</script>

<style scoped>
.prototype-nav {
  display: grid;
  grid-template-columns: minmax(180px, 0.34fr) minmax(0, 1fr);
  gap: 16px;
  align-items: center;
  margin: 18px 0 16px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 16px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.prototype-nav-heading {
  display: grid;
  gap: 6px;
}

.prototype-nav-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.prototype-nav-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.prototype-nav-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.prototype-nav-list button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  background: #ffffff;
  color: #1e293b;
  font-weight: 900;
  cursor: pointer;
}

.prototype-nav-list button span {
  border-radius: 999px;
  padding: 3px 7px;
  background: #e0ecff;
  color: #1d4ed8;
  font-size: 11px;
}

.prototype-nav-list button.active {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}

.prototype-nav-list button.active span {
  background: rgb(255 255 255 / 0.18);
  color: #ffffff;
}

@media (max-width: 860px) {
  .prototype-nav {
    grid-template-columns: 1fr;
  }

  .prototype-nav-list {
    justify-content: flex-start;
  }
}
</style>