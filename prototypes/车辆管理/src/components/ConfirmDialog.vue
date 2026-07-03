<template>
  <Teleport to="body">
    <div v-if="visible" class="confirm-dialog-overlay" @click="handleCancel">
      <div class="confirm-dialog" @click.stop>
        <div class="confirm-dialog-header">
          <h3>{{ title }}</h3>
        </div>
        <div class="confirm-dialog-body">
          <slot>{{ content }}</slot>
        </div>
        <div class="confirm-dialog-footer">
          <button class="btn btn-cancel" @click="handleCancel">{{ cancelText }}</button>
          <button
            class="btn btn-confirm"
            :class="{ 'btn-danger': danger }"
            :disabled="loading"
            @click="handleConfirm"
          >
            <span v-if="loading">处理中...</span>
            <span v-else>{{ confirmText }}</span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
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

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
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
  box-shadow: 0 2px 12px rgba(0,0,0,0.15);
  min-width: 300px;
  max-width: 500px;
}
.confirm-dialog-header {
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}
.confirm-dialog-header h3 {
  margin: 0;
  font-size: 16px;
}
.confirm-dialog-body {
  padding: 20px;
  font-size: 14px;
}
.confirm-dialog-footer {
  padding: 12px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  border-top: 1px solid #eee;
}
.btn {
  padding: 8px 16px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}
.btn-cancel:hover {
  border-color: #b3b3b3;
}
.btn-confirm {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}
.btn-confirm:hover {
  background: #66b1ff;
}
.btn-confirm:disabled {
  background: #a0cfff;
  cursor: not-allowed;
}
.btn-danger {
  background: #f56c6c;
  border-color: #f56c6c;
}
.btn-danger:hover {
  background: #f78989;
}
</style>