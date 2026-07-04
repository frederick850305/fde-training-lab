<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay" @click.self="$emit('cancel')">
      <div class="confirm-dialog" @click.stop>
        <div class="cd-body">
          <h3>{{ title }}</h3>
          <slot>
            <p>{{ content }}</p>
          </slot>
        </div>
        <div class="cd-footer">
          <button class="cancel-btn" @click="$emit('cancel')" :disabled="loading">{{ cancelText }}</button>
          <button class="confirm-btn" :class="{ danger }" @click="$emit('confirm')" :disabled="loading">
            <span v-if="loading">⏳</span>
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '确认操作' },
  content: { type: String, default: '' },
  confirmText: { type: String, default: '确定' },
  cancelText: { type: String, default: '取消' },
  loading: { type: Boolean, default: false },
  danger: { type: Boolean, default: false },
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.dialog-overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 2000;
  display: flex; align-items: center; justify-content: center;
}
.confirm-dialog {
  background: #fff; border-radius: 14px; width: 400px; max-width: 90vw;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
}
.cd-body { padding: 24px 24px 12px; }
.cd-body h3 { margin: 0 0 8px; font-size: 16px; font-weight: 800; }
.cd-body p { margin: 0; font-size: 14px; color: #64748b; }
.cd-footer { display: flex; gap: 8px; justify-content: flex-end; padding: 12px 24px 20px; }
.cancel-btn { padding: 8px 20px; border: 1px solid #cbd5e1; border-radius: 8px; background: #fff; color: #475569; font-size: 13px; cursor: pointer; }
.confirm-btn { padding: 8px 20px; border: none; border-radius: 8px; background: #1a56db; color: #fff; font-size: 13px; font-weight: 700; cursor: pointer; }
.confirm-btn.danger { background: #c62828; }
</style>
