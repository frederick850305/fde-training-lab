<template>
  <div class="file-uploader">
    <div v-if="!readonly" class="upload-trigger" @click="pickFile">
      <input ref="inputRef" type="file" :accept="accept" :multiple="multiple" hidden @change="onPick" />
      <span class="trigger-icon">＋</span>
      <span>拍照 / 选择附件</span>
    </div>

    <div v-if="!fileList.length && readonly" class="empty-attachments">暂无附件</div>

    <ul v-if="fileList.length" class="file-list">
      <li v-for="file in fileList" :key="file.id" class="file-item">
        <div class="file-thumb" @click="$emit('preview', file)">
          <span v-if="file.type?.startsWith('image') || file.type === 'image'">🖼</span>
          <span v-else-if="file.type?.startsWith('video') || file.type === 'video'">🎬</span>
          <span v-else>📄</span>
        </div>
        <div class="file-meta">
          <strong>{{ file.name }}</strong>
          <small>{{ formatSize(file.size) }}<template v-if="file.uploadedAt"> · {{ file.uploadedAt }}</template></small>
        </div>
        <div class="file-ops">
          <button type="button" @click="$emit('preview', file)">查看</button>
          <button v-if="!readonly" type="button" class="danger" @click="$emit('delete', file)">删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  accept: { type: String, default: 'image/*,video/*' },
  multiple: { type: Boolean, default: true },
  maxSize: { type: Number, default: 10485760 },
  fileList: { type: Array, default: () => [] },
  readonly: { type: Boolean, default: false },
})

const emit = defineEmits(['upload', 'preview', 'delete', 'error'])
const inputRef = ref(null)

function pickFile() {
  inputRef.value?.click()
}

function onPick(event) {
  const files = Array.from(event.target.files || [])
  for (const file of files) {
    if (file.size > props.maxSize) {
      emit('error', { code: 'SIZE_EXCEED', message: `${file.name} 超过大小限制` })
      continue
    }
    emit('upload', file)
  }
  event.target.value = ''
}

function formatSize(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1048576).toFixed(1)} MB`
}
</script>

<style scoped>
.file-uploader { display: grid; gap: 12px; }
.upload-trigger { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; min-height: 120px; border: 2px dashed #9eb3ca; border-radius: 10px; cursor: pointer; color: #53657c; background: #f8fbfe; font-weight: 900; transition: border-color .15s, background .15s; }
.upload-trigger:hover { border-color: #1e6fd9; background: #edf5ff; color: #1e6fd9; }
.trigger-icon { font-size: 28px; }
.empty-attachments { padding: 18px; text-align: center; color: #8b9aab; border: 1px dashed #cdd9e6; border-radius: 8px; }
.file-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.file-item { display: flex; align-items: center; gap: 12px; border: 1px solid #e2eaf3; border-radius: 8px; padding: 10px 12px; background: #fff; }
.file-thumb { width: 46px; height: 46px; border-radius: 8px; display: grid; place-items: center; background: #eef3f8; font-size: 22px; cursor: pointer; }
.file-meta { flex: 1; min-width: 0; display: grid; gap: 3px; }
.file-meta strong { font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.file-meta small { color: #8b9aab; font-size: 11px; }
.file-ops { display: flex; gap: 6px; }
.file-ops button { border: 1px solid #cfdae6; border-radius: 6px; padding: 5px 10px; background: #f6f9fc; font-size: 12px; font-weight: 800; }
.file-ops button.danger { color: #b4232d; border-color: #f3c2c6; background: #fff0f1; }
</style>
