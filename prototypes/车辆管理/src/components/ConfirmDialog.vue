<template>
  <div v-if="visible" class="confirm-dialog-overlay" @click.self="handleCancel">
    <div class="confirm-dialog">
      <div class="dialog-header">
        <span>{{ title }}</span>
        <button class="close-btn" @click="handleCancel">&times;</button>
      </div>
      <div class="dialog-body">
        <slot>
          <p>{{ content }}</p>
        </slot>
      </div>
      <div class="dialog-footer">
        <button class="btn-cancel" @click="handleCancel">{{ cancelText }}</button>
        <button
          class="btn-confirm"
          :class="{ 'btn-danger': danger }"
          :disabled="loading"
          @click="handleConfirm"
        >
          <span v-if="loading" class="spinner"></span>
          {{ loading ? '' : confirmText }}
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

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  if (!props.loading) {
    emit('confirm')
  }
}

const handleCancel = () => {
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-dialog {
  background: #fff;
  border-radius: 8px;
  min-width: 400px;
  max-width: 600px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
  font-size: 16px;
  font-weight: bold;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
}

.close-btn:hover {
  color: #333;
}

.dialog-body {
  padding: 20px;
  color: #333;
  line-height: 1.5;
}

.dialog-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #e8e8e8;
}

.btn-cancel {
  background: #f5f5f5;
  border: 1px solid #d9d9d9;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #333;
}

.btn-cancel:hover {
  background: #e8e8e8;
}

.btn-confirm {
  background: #1890ff;
  border: 1px solid #1890ff;
  padding: 6px 16px;
  border-radius: 4px;
  cursor: pointer;
  color: #fff;
  position: relative;
  min-width: 60px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-confirm:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.btn-confirm:disabled {
  background: #91d5ff;
  border-color: #91d5ff;
  cursor: not-allowed;
}

.btn-danger {
  background: #ff4d4f;
  border-color: #ff4d4f;
}

.btn-danger:hover {
  background: #ff7875;
  border-color: #ff7875;
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>