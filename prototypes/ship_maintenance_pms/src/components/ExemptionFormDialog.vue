<template>
  <div v-if="open" class="dialog-mask">
    <section class="dialog">
      <h3>{{ title }}</h3>
      <p class="dialog-desc">{{ message }}</p>

      <div class="field">
        <label>豁免理由<span class="req">*</span></label>
        <textarea v-model="form.reason" rows="3" placeholder="请填写申请豁免的原因及后续整改承诺" />
      </div>

      <div class="field">
        <label>豁免有效期至<span class="req">*</span></label>
        <input v-model="form.validUntil" type="date" />
      </div>

      <p v-if="error" class="form-error">{{ error }}</p>

      <div class="dialog-actions">
        <button type="button" @click="$emit('cancel')">取消</button>
        <button type="button" class="primary" @click="submit">提交申请</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  title: { type: String, default: '申请豁免' },
  message: { type: String, default: '' },
})
const emit = defineEmits(['cancel', 'confirm'])

const form = reactive({ reason: '', validUntil: '' })
const error = ref('')

watch(() => props.open, (v) => {
  if (v) {
    form.reason = ''
    form.validUntil = ''
    error.value = ''
  }
})

function submit() {
  if (!form.reason.trim()) {
    error.value = '请填写豁免理由'
    return
  }
  if (!form.validUntil) {
    error.value = '请选择豁免有效期'
    return
  }
  error.value = ''
  emit('confirm', { reason: form.reason.trim(), validUntil: form.validUntil })
}
</script>

<style scoped>
.dialog-mask { position: fixed; inset: 0; z-index: 20; display: grid; place-items: center; background: rgba(15, 23, 42, .38); }
.dialog { width: min(440px, calc(100vw - 32px)); border-radius: 8px; padding: 20px; background: #fff; box-shadow: 0 24px 80px rgba(15,23,42,.28); }
h3 { margin: 0; font-size: 18px; }
.dialog-desc { margin: 10px 0 16px; color: #53657c; line-height: 1.5; font-size: 13px; }
.field { margin-bottom: 14px; }
.field label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 800; color: #24415f; }
.req { color: #b4232d; margin-left: 2px; }
.field textarea, .field input { width: 100%; box-sizing: border-box; border: 1px solid #d9e4ef; border-radius: 8px; padding: 9px 11px; font: inherit; color: #172033; background: #f8fbfe; resize: vertical; }
.field textarea:focus, .field input:focus { outline: none; border-color: #1e6fd9; box-shadow: 0 0 0 3px rgba(30, 111, 217, .1); }
.form-error { margin: 0 0 12px; color: #b4232d; font-size: 12px; font-weight: 800; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 14px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
</style>
