<template>
  <div class="approval-actions">
    <label class="comment-label">
      <span>审批意见<em v-if="commentRequired"> *</em></span>
      <textarea v-model="comment" rows="4" :placeholder="placeholder" :disabled="loading"></textarea>
    </label>
    <div class="action-row">
      <button v-if="allowReject" type="button" class="reject" :disabled="loading || rejectDisabled" @click="onReject">
        {{ loading && pending === 'reject' ? '提交中…' : '驳回' }}
      </button>
      <button v-if="allowApprove" type="button" class="approve" :disabled="loading || approveDisabled" @click="onApprove">
        {{ loading && pending === 'approve' ? '提交中…' : '通过' }}
      </button>
      <slot name="extra" />
    </div>
    <p v-if="errorMsg" class="err">{{ errorMsg }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  allowApprove: { type: Boolean, default: true },
  allowReject: { type: Boolean, default: true },
  approveDisabled: { type: Boolean, default: false },
  rejectDisabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  commentRequired: { type: Boolean, default: true },
  placeholder: { type: String, default: '填写审批意见（驳回时必填）' },
})

const emit = defineEmits(['approve', 'reject'])

const comment = ref('')
const pending = ref('')
const errorMsg = ref('')

function onApprove() {
  errorMsg.value = ''
  pending.value = 'approve'
  emit('approve', comment.value)
}

function onReject() {
  errorMsg.value = ''
  if (props.commentRequired && !comment.value.trim()) {
    errorMsg.value = '驳回时审批意见为必填项'
    pending.value = ''
    return
  }
  pending.value = 'reject'
  emit('reject', comment.value)
}

defineExpose({ clear: () => { comment.value = ''; errorMsg.value = ''; pending.value = '' }, setError: (msg) => { errorMsg.value = msg; pending.value = '' } })
</script>

<style scoped>
.approval-actions { display: grid; gap: 12px; }
.comment-label { display: grid; gap: 6px; font-size: 12px; font-weight: 900; color: #53657c; }
.comment-label em { color: #b4232d; font-style: normal; }
textarea { width: 100%; border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; resize: vertical; font: inherit; }
textarea:disabled { background: #f3f6fa; }
.action-row { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 9px 18px; background: #f6f9fc; font-weight: 900; }
button:disabled { opacity: .55; cursor: not-allowed; }
button.approve { color: #fff; border-color: #11734d; background: #11734d; }
button.reject { color: #fff; border-color: #b4232d; background: #b4232d; }
.err { margin: 0; color: #b4232d; font-size: 12px; font-weight: 800; }
</style>
