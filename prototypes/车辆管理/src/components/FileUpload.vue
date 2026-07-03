<template>
  <div class="file-upload">
    <div class="upload-trigger" @click="$emit('triggerClick')">
      <slot name="trigger">
        <button type="button">选择文件</button>
      </slot>
    </div>
    <div class="file-list">
      <div
        v-for="(file, index) in fileList"
        :key="file.id"
        class="file-card"
        draggable="true"
        @dragstart="onDragStart($event, index)"
        @dragover.prevent="onDragOver($event, index)"
        @drop.prevent="onDrop($event, index)"
        @dragend="onDragEnd"
      >
        <slot name="fileCard" :file="file" :index="index">
          <div class="card-default">
            <img v-if="file.thumbnail" :src="file.thumbnail" alt="预览" class="thumbnail" />
            <span class="file-name">{{ file.name }}</span>
            <div class="actions">
              <button @click.stop="$emit('preview', file)">预览</button>
              <button @click.stop="$emit('replace', file)">替换</button>
              <button @click.stop="$emit('delete', file)">删除</button>
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

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
    default: ''
  },
  headers: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:fileList', 'uploadSuccess', 'uploadError', 'preview', 'triggerClick', 'delete', 'replace', 'sort'])

const dragIndex = ref(null)

function onDragStart(event, index) {
  dragIndex.value = index
  event.dataTransfer.effectAllowed = 'move'
  event.dataTransfer.setData('text/plain', index)
}

function onDragOver(event, index) {
  event.dataTransfer.dropEffect = 'move'
}

function onDrop(event, targetIndex) {
  if (dragIndex.value !== null && dragIndex.value !== targetIndex) {
    const newList = [...props.fileList]
    const [moved] = newList.splice(dragIndex.value, 1)
    newList.splice(targetIndex, 0, moved)
    emit('sort', newList)
  }
  dragIndex.value = null
}

function onDragEnd() {
  dragIndex.value = null
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
  gap: 12px;
}
.file-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 8px;
  width: 120px;
  text-align: center;
  cursor: grab;
  transition: box-shadow 0.2s;
}
.file-card:active {
  cursor: grabbing;
}
.thumbnail {
  width: 100%;
  height: 80px;
  object-fit: cover;
  border-radius: 2px;
}
.file-name {
  display: block;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-top: 4px;
}
.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 6px;
}
.actions button {
  font-size: 11px;
  padding: 2px 6px;
  border: 1px solid #ccc;
  border-radius: 2px;
  background: #fff;
  cursor: pointer;
}
.actions button:hover {
  background: #f0f0f0;
}
</style>