<template>
  <div v-if="open" class="dialog-mask">
    <section class="dialog">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="dialog-actions">
        <button type="button" @click="$emit('cancel')">取消</button>
        <button type="button" class="primary" @click="$emit('confirm')">确认</button>
      </div>
    </section>
  </div>
</template>

<script setup>
defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '确认操作' },
  message: { type: String, default: '确认提交当前操作吗？' },
})

defineEmits(['cancel', 'confirm'])
</script>

<style scoped>
.dialog-mask { position: fixed; inset: 0; z-index: 20; display: grid; place-items: center; background: rgba(15, 23, 42, .38); }
.dialog { width: min(420px, calc(100vw - 32px)); border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 24px 80px rgba(15,23,42,.28); }
h3 { margin: 0; font-size: 18px; }
p { margin: 12px 0 20px; color: #53657c; line-height: 1.55; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 14px; color: #24415f; background: #f6f9fc; font-weight: 900; }
.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
</style>
