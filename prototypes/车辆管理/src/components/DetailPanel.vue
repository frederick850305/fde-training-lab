<template>
  <div v-if="visible" class="detail-panel-overlay" :class="mode" @click.self="onClose">
    <div class="detail-panel" :style="{ width: width }">
      <slot name="header">
        <div class="detail-panel-header">
          <span class="detail-panel-title">{{ title }}</span>
          <button v-if="closable" class="detail-panel-close" @click="onClose">&times;</button>
        </div>
      </slot>
      <div class="detail-panel-body">
        <slot name="default" />
      </div>
      <slot name="footer" />
    </div>
  </div>
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

function onClose() {
  emit('close')
}
</script>

<style scoped>
.detail-panel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
}

.detail-panel-overlay.drawer {
  justify-content: flex-end;
  align-items: stretch;
}

.detail-panel-overlay.modal {
  justify-content: center;
  align-items: center;
}

.detail-panel {
  background: #fff;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  max-height: 100%;
  overflow-y: auto;
}

.detail-panel-overlay.modal .detail-panel {
  border-radius: 8px;
  max-width: 90%;
  max-height: 90%;
}

.detail-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.detail-panel-title {
  font-size: 16px;
  font-weight: 600;
}

.detail-panel-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}

.detail-panel-body {
  flex: 1;
  padding: 20px;
}
</style>