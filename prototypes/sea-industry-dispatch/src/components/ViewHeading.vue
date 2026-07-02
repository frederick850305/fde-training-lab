<template>
  <div class="view-heading">
    <p class="eyebrow">{{ eyebrow }}</p>
    <h2 :id="titleId">{{ title }}</h2>
    <p v-if="description" class="description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  eyebrow: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  titleId: {
    type: String,
    default: undefined,
  },
  description: {
    type: String,
    default: '',
  },
})
</script>

<style scoped>
.view-heading {
  margin-bottom: 18px;
}

.eyebrow {
  margin: 0 0 10px;
  color: #2563eb;
  font-size: 14px;
  font-weight: 700;
}

h2 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 28px;
}

.description {
  max-width: 780px;
  margin: 0;
  color: #526174;
  line-height: 1.7;
}
</style>