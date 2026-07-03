<template>
  <div v-if="visible" class="detail-mask" :class="{ modal: mode === 'modal' }" @click.self="handleClose">
  <div :class="['detail-panel', mode]">
    <slot name="header">
      <div class="panel-header">
        <span class="title">{{ title }}</span>
        <button v-if="closable" class="close-btn" @click="handleClose">×</button>
      </div>
    </slot>
    <div class="panel-body">
      <slot />
    </div>
    <slot name="footer" />
  </div>
  </div>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  mode: { type: String, default: 'drawer' },
  width: { type: String, default: '400px' },
  closable: { type: Boolean, default: true }
})
const emit = defineEmits(['close', 'update:visible'])

function handleClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.detail-mask.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(15, 23, 42, 0.36);
}
.detail-panel {
  position: fixed;
  top: 0;
  right: 0;
  height: 100%;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.15);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  width: v-bind(width);
}
.detail-panel.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: auto;
  max-height: 80vh;
  box-shadow: 0 20px 45px rgba(15,23,42,0.25);
  border-radius: 8px;
  width: v-bind(width);
}
.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #e8e8e8;
}
.title {
  font-size: 16px;
  font-weight: 600;
}
.close-btn {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
  color: #999;
}
.close-btn:hover {
  color: #333;
}
.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}
</style>
