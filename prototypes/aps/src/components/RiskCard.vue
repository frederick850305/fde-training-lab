<template>
  <div class="panel risk-card" :class="levelClass">
    <div class="risk-head">
      <StatusTag :status="level" />
      <strong>{{ title }}</strong>
    </div>
    <p class="risk-desc">{{ desc }}</p>
    <div class="risk-foot">
      <span class="muted">{{ type }}</span>
      <span>影响：{{ impact }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import StatusTag from './StatusTag.vue'

const props = defineProps({
  level: { type: String, default: '中' },
  title: { type: String, default: '' },
  desc: { type: String, default: '' },
  type: { type: String, default: '' },
  impact: { type: String, default: '' },
})

const levelClass = computed(() => (props.level === '高' ? 'high' : props.level === '中' ? 'mid' : 'low'))
</script>

<style scoped>
.risk-card { padding: 14px; display: grid; gap: 8px; }
.risk-card.high { border-color: #f3c2c6; }
.risk-card.mid { border-color: #f6e2bd; }
.risk-head { display: flex; align-items: center; gap: 10px; }
.risk-head strong { font-size: 14px; color: #132039; }
.risk-desc { margin: 0; color: #53657c; font-size: 13px; line-height: 1.5; }
.risk-foot { display: flex; justify-content: space-between; gap: 10px; font-size: 12px; color: #8194a8; flex-wrap: wrap; }
</style>
