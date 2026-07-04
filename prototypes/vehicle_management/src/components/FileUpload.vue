<template>
  <div class="file-upload">
    <slot name="trigger">
      <label class="upload-trigger">
        <input
          type="file"
          :accept="accept"
          :multiple="multiple"
          :max="maxCount"
          hidden
          @change="handleFileChange"
        />
        <span>📷</span>
        <span>点击或拖拽上传</span>
      </label>
    </slot>

    <div v-if="fileList.length" class="file-preview-list">
      <div v-for="(file, idx) in fileList" :key="file.id || idx" class="file-preview-item">
        <slot name="fileCard" :file="file" :index="idx">
          <img v-if="file.url && file.type?.startsWith?.('image/')" :src="file.url" alt="" class="preview-img" @click="$emit('preview', file)" />
          <span v-else class="file-name">{{ file.name }}</span>
        </slot>
        <button class="remove-btn" @click="removeFile(idx)">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  fileList: { type: Array, default: () => [] },
  accept: { type: String, default: 'image/*' },
  multiple: { type: Boolean, default: false },
  maxCount: { type: Number, default: 9 },
})

const emit = defineEmits(['update:fileList', 'uploadSuccess', 'uploadError', 'preview'])

function handleFileChange(e) {
  const files = Array.from(e.target.files || [])
  const newFiles = files.map(f => ({
    id: Date.now() + Math.random(),
    name: f.name,
    type: f.type,
    url: URL.createObjectURL(f),
    file: f,
  }))
  const updated = props.multiple ? [...props.fileList, ...newFiles].slice(0, props.maxCount) : newFiles.slice(0, 1)
  emit('update:fileList', updated)
  emit('uploadSuccess', updated)
}

function removeFile(idx) {
  const updated = props.fileList.filter((_, i) => i !== idx)
  emit('update:fileList', updated)
}
</script>

<style scoped>
.file-upload { display: grid; gap: 12px; }
.upload-trigger {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 24px; border: 2px dashed #cbd5e1; border-radius: 12px;
  cursor: pointer; color: #64748b; font-size: 13px; transition: border-color .2s;
}
.upload-trigger:hover { border-color: #1a56db; color: #1a56db; }
.upload-trigger span:first-child { font-size: 28px; }
.file-preview-list { display: flex; flex-wrap: wrap; gap: 8px; }
.file-preview-item { position: relative; width: 80px; height: 80px; border-radius: 8px; overflow: hidden; background: #f1f5f9; display: flex; align-items: center; justify-content: center; }
.preview-img { width: 100%; height: 100%; object-fit: cover; cursor: pointer; }
.file-name { font-size: 11px; color: #64748b; padding: 4px; text-align: center; word-break: break-all; }
.remove-btn {
  position: absolute; top: 2px; right: 2px; width: 20px; height: 20px;
  border: none; border-radius: 50%; background: rgba(0,0,0,.5); color: #fff;
  font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center;
}
</style>
