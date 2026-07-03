<template>
  <Teleport to="body" v-if="visible">
    <div
      class="detail-panel-overlay"
      :class="`detail-panel-mode-${mode}`"
      @click.self="handleOverlayClick"
    >
      <div class="detail-panel" :style="{ width: width }">
        <div class="detail-panel-header">
          <slot name="header">
            <div class="detail-panel-title">{{ title }}</div>
            <button
              v-if="closable"
              class="detail-panel-close"
              @click="handleClose"
            >
              ×
            </button>
          </slot>
        </div>
        <div class="detail-panel-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="detail-panel-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  mode: {
    type: String,
    default: 'drawer',
    validator: (value) => ['drawer', 'modal'].includes(value)
  },
  width: {
    type: String,
    default: '400px'
  },
  closable: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (mode === 'modal') {
    emit('close')
  }
}
</script>

<style scoped>
.detail-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  z-index: 1000;
}

.detail-panel-mode-drawer {
  justify-content: flex-end;
  align-items: stretch;
}

.detail-panel-mode-modal {
  justify-content: center;
  align-items: center;
}

.detail-panel {
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.detail-panel-mode-drawer .detail-panel {
  height: 100%;
}

.detail-panel-mode-modal .detail-panel {
  max-height: 80%;
  border-radius: 4px;
}

.detail-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid #ebeef5;
  font-size: 16px;
  font-weight: 600;
}

.detail-panel-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.detail-panel-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #909399;
  padding: 0 4px;
}

.detail-panel-close:hover {
  color: #606266;
}

.detail-panel-body {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}

.detail-panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #ebeef5;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>