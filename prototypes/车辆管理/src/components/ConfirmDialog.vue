<template>
  <div v-if="visible" class="confirm-dialog-overlay" @click.self="handleCancel">
    <div class="confirm-dialog">
      <div class="dialog-header">
        <h3>{{ title }}</h3>
      </div>
      <div class="dialog-body">
        <slot>
          <p>{{ content }}</p>
        </slot>
      </div>
      <div class="dialog-footer">
        <button class="btn-cancel" @click="handleCancel">{{ cancelText }}</button>
        <button class="btn-confirm" :class="{ 'btn-danger': danger }" :disabled="loading" @click="handleConfirm">
          <span v-if="loading">加载中...</span>
          <span v-else>{{ confirmText }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '确认操作' },
  content: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  loading: { type: Boolean, default: false },
  danger: { type: Boolean, default: false }
})
const emit = defineEmits(['confirm', 'cancel', 'update:visible'])
const handleConfirm = () => emit('confirm')
const handleCancel = () => {
  emit('update:visible', false)
  emit('cancel')
}
</script>

<style scoped>
.confirm-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.confirm-dialog {
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  min-width: 400px;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.dialog-header h3 {
  margin: 0 0 16px 0;
  font-size: 18px;
  color: #333;
}
.dialog-body {
  margin-bottom: 24px;
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.btn-cancel,
.btn-confirm {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-cancel {
  background: #f5f5f5;
  color: #666;
}
.btn-confirm {
  background: #409eff;
  color: #fff;
}
.btn-confirm.btn-danger {
  background: #f56c6c;
}
.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
