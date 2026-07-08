<template>
  <div class="timeline">
    <div v-for="m in milestones" :key="m.name" class="tl-item" :class="m.status">
      <span class="tl-dot"></span>
      <div class="tl-body">
        <div class="tl-row">
          <strong>{{ m.name }}</strong>
          <span class="tl-date">{{ m.date }}</span>
        </div>
        <StatusTag :status="statusLabel(m.status)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusTag from './StatusTag.vue'

defineProps({
  milestones: { type: Array, required: true },
})

function statusLabel(status) {
  return { done: '已完成', active: '进行中', risk: '风险', pending: '待开始' }[status] || '待开始'
}
</script>

<style scoped>
.timeline { display: grid; gap: 0; padding-left: 6px; }
.tl-item { position: relative; padding: 0 0 18px 22px; border-left: 2px solid #e1e8f0; }
.tl-item:last-child { border-left-color: transparent; padding-bottom: 0; }
.tl-dot { position: absolute; left: -7px; top: 2px; width: 12px; height: 12px; border-radius: 50%; background: #b9c8d8; border: 2px solid #fff; box-shadow: 0 0 0 2px #e1e8f0; }
.tl-item.done .tl-dot { background: #11845b; }
.tl-item.active .tl-dot { background: #1e6fd9; }
.tl-item.risk .tl-dot { background: #c43b45; }
.tl-body { display: grid; gap: 6px; }
.tl-row { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; }
.tl-row strong { font-size: 14px; color: #132039; }
.tl-date { color: #8194a8; font-size: 12px; }
</style>
