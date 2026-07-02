<template>
  <span class="status-tag" :class="type">{{ label }}</span>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'normal',
  },
})
</script>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #e2e8f0;
  color: #334155;
  font-size: 12px;
  font-weight: 900;
}

.status-tag.normal,
.status-tag.done,
.status-tag.closed,
.status-tag.available,
.status-tag.arrived {
  background: #dcfce7;
  color: #166534;
}

.status-tag.warning,
.status-tag.running,
.status-tag.processing,
.status-tag.busy,
.status-tag.pending,
.status-tag.in_transit {
  background: #fef3c7;
  color: #92400e;
}

.status-tag.danger,
.status-tag.delayed,
.status-tag.blocked,
.status-tag.open,
.status-tag.shortage,
.status-tag.overdue {
  background: #fee2e2;
  color: #991b1b;
}
</style>