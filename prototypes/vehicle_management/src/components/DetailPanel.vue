<template>
  <Teleport to="body">
    <div v-if="visible" class="overlay" @click.self="closable && $emit('close')">
      <div
        v-if="mode === 'modal'"
        class="detail-modal"
        :style="{ width }"
        @click.stop
      >
        <div class="dm-header">
          <slot name="header">
            <h3>{{ title }}</h3>
            <button v-if="closable" class="close-btn" @click="$emit('close')">✕</button>
          </slot>
        </div>
        <div class="dm-body"><slot /></div>
        <div v-if="$slots.footer" class="dm-footer"><slot name="footer" /></div>
      </div>

      <div
        v-else
        class="detail-drawer"
        :style="{ width }"
        @click.stop
      >
        <div class="dd-header">
          <slot name="header">
            <h3>{{ title }}</h3>
            <button v-if="closable" class="close-btn" @click="$emit('close')">✕</button>
          </slot>
        </div>
        <div class="dd-body"><slot /></div>
        <div v-if="$slots.footer" class="dd-footer"><slot name="footer" /></div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  visible: { type: Boolean, default: false },
  title: { type: String, default: '' },
  mode: { type: String, default: 'drawer' },
  width: { type: String, default: '480px' },
  closable: { type: Boolean, default: true },
})

defineEmits(['close'])
</script>

<style scoped>
.overlay {
  position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 1000;
  display: flex; align-items: stretch; justify-content: flex-end;
}
.detail-drawer {
  background: #fff; height: 100vh; display: flex; flex-direction: column;
  box-shadow: -8px 0 30px rgba(0,0,0,.15); animation: slideIn .2s ease;
}
@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
.detail-modal {
  background: #fff; border-radius: 14px; margin: auto; max-height: 85vh;
  display: flex; flex-direction: column; box-shadow: 0 20px 60px rgba(0,0,0,.2);
}
.dm-header, .dd-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; border-bottom: 1px solid #e2e8f0; }
.dm-header h3, .dd-header h3 { margin: 0; font-size: 16px; font-weight: 800; }
.close-btn { width: 32px; height: 32px; border: none; background: #f1f5f9; border-radius: 8px; font-size: 16px; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center; }
.dm-body, .dd-body { flex: 1; overflow-y: auto; padding: 16px 20px; }
.dm-footer, .dd-footer { padding: 12px 20px; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: flex-end; }
</style>
