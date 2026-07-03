<template>
  <span
    :class="['status-tag', 'status-tag--' + size, 'status-tag--' + status, customClass]"
  >
    {{ text || status }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true,
    default: ''
  },
  text: {
    type: String,
    required: false,
    default: ''
  },
  size: {
    type: String,
    required: false,
    default: 'default',
    validator: (v) => ['small', 'default', 'large'].includes(v)
  },
  customClass: {
    type: String,
    required: false,
    default: ''
  }
})
</script>

<style scoped>
.status-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1.5;
  white-space: nowrap;
}

.status-tag--small {
  padding: 0 6px;
  font-size: 10px;
}

.status-tag--large {
  padding: 4px 12px;
  font-size: 14px;
}

.status-tag--空闲 {
  color: #67c23a;
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
}

.status-tag--任务中 {
  color: #409eff;
  background-color: #ecf5ff;
  border: 1px solid #b3d8ff;
}

.status-tag--成功 {
  color: #67c23a;
  background-color: #f0f9eb;
  border: 1px solid #c2e7b0;
}

.status-tag--失败 {
  color: #f56c6c;
  background-color: #fef0f0;
  border: 1px solid #fbc4c4;
}

.status-tag--等待 {
  color: #909399;
  background-color: #f4f4f5;
  border: 1px solid #c8c9cc;
}

.status-tag--警告 {
  color: #e6a23c;
  background-color: #fdf6ec;
  border: 1px solid #f5dab1;
}
</style>
