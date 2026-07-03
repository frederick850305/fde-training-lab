<template>
  <div class="file-upload">
    <div class="upload-trigger" @click="handleTriggerClick">
      <slot name="trigger" />
    </div>
    <div class="file-list" v-if="fileList.length > 0">
      <div
        v-for="(file, index) in fileList"
        :key="file.id"
        class="file-card"
        draggable="true"
        @dragstart="handleDragStart($event, index)"
        @dragover.prevent="handleDragOver($event, index)"
        @dragend="handleDragEnd"
      >
        <slot name="fileCard" :file="file" :index="index">
          <img v-if="file.thumbnail" :src="file.thumbnail" class="file-thumbnail" />
          <span class="file-name">{{ file.name }}</span>
          <div class="file-actions">
            <button @click="emit('preview', file)">预览</button>
            <button @click="emit('replace', file, index)">替换</button>
            <button @click="emit('delete', file, index)">删除</button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  fileList: {
    type: Array,
    default: () => []
  },
  accept: {
    type: String,
    default: 'image/*'
  },
  multiple: {
    type: Boolean,
    default: true
  },
  maxCount: {
    type: Number,
    default: 9
  },
  uploadUrl: {
    type: String,
    required: true
  },
  headers: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:fileList', 'uploadSuccess', 'uploadError', 'preview', 'replace', 'delete', 'dragSort'])

let dragIndex = null

function handleTriggerClick() {
  // 纯展示组件，仅触发事件，由父组件处理文件选择
  emit('triggerClick')
}

function handleDragStart(event, index) {
  dragIndex = index
  event.dataTransfer.effectAllowed = 'move'
}

function handleDragOver(event, index) {
  if (dragIndex !== null && dragIndex !== index) {
    emit('dragSort', { from: dragIndex, to: index })
  }
}

function handleDragEnd() {
  dragIndex = null
}
</script>

<style scoped>
.file-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.upload-trigger {
  cursor: pointer;
}
.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.file-card {
  display: flex;
  align-items: center;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px;
  background: #fafafa;
}
.file-thumbnail {
  width: 48px;
  height: 48px;
  object-fit: cover;
  margin-right: 8px;
}
.file-name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
}
.file-actions {
  display: flex;
  gap: 4px;
}
.file-actions button {
  font-size: 12px;
  padding: 2px 6px;
  cursor: pointer;
}
</style>