<template>
  <article class="capability-card" :class="{ active }">
    <span class="card-tag">{{ stage }}</span>
    <h3>{{ title }}</h3>
    <p>{{ description }}</p>
    <button type="button" @click="$emit('select')">{{ action }}</button>
  </article>
</template>

<script setup>
defineProps({
  stage: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['select'])
</script>

<style scoped>
.capability-card {
  display: flex;
  flex-direction: column;
  min-height: 230px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.capability-card.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.card-tag {
  align-self: flex-start;
  margin-bottom: 16px;
  border-radius: 999px;
  padding: 5px 9px;
  background: #e0ecff;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

h3 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 18px;
}

p {
  flex: 1;
  margin-top: 0;
  color: #526174;
  line-height: 1.65;
}

button {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px 16px;
  background: #ffffff;
  color: #1e293b;
  font-weight: 800;
  cursor: pointer;
}

.capability-card.active button {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}
</style>
