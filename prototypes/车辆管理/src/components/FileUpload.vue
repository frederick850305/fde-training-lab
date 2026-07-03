<template>
  <div class="file-upload-wrapper">
    <!-- 触发上传按钮区域（通过插槽自定义） -->
    <div v-if="$slots.trigger" class="upload-trigger" @click="$emit('triggerClick')">
      <slot name="trigger" />
    </div>
    <div v-else class="upload-trigger default-trigger" @click="$emit('triggerClick')">
      <span>点击上传</span>
    </div>

    <!-- 文件列表（可拖拽排序） -->
    <draggable
      v-model="localFileList"
      class="file-list"
      item-key="id"
      ghost-class="ghost"
      @change="onSortChange"
    >
      <template #item="{ element, index }">
        <div class="file-card">
          <!-- 自定义文件卡片插槽 -->
          <slot name="fileCard" :file="element" :index="index">
            <!-- 默认渲染 -->
            <div class="file-thumbnail" @click="$emit('preview', element)">
              <img v-if="element.thumbnail" :src="element.thumbnail" alt="preview" />
              <span v-else class="file-icon">{{ getFileIcon(element.name) }}</span>
            </div>
            <div class="file-info">
              <span class="file-name" :title="element.name">{{ element.name }}</span>
              <div class="file-actions">
                <button @click.stop="$emit('preview', element)">预览</button>
                <button @click.stop="$emit('replace', element)">替换</button>
                <button @click.stop="$emit('delete', element)">删除</button>
              </div>
            </div>
          </slot>
        </div>
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  fileList: {
    type: Array,
    required: false,
    default: () => []
  },
  accept: {
    type: String,
    required: false,
    default: 'image/*'
  },
  multiple: {
    type: Boolean,
    required: false,
    default: true
  },
  maxCount: {
    type: Number,
    required: false,
    default: 9
  },
  uploadUrl: {
    type: String,
    required: true,
    default: ''
  },
  headers: {
    type: Object,
    required: false,
    default: () => ({})
  }
})

const emit = defineEmits(['update:fileList', 'uploadSuccess', 'uploadError', 'preview', 'replace', 'delete', 'triggerClick'])

const localFileList = ref([...props.fileList])

watch(() => props.fileList, (newVal) => {
  localFileList.value = [...newVal]
})

function onSortChange() {
  emit('update:fileList', localFileList.value)
}

function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase()
  const iconMap = {
    pdf: '📄',
    doc: '📝',
    docx: '📝',
    xls: '📊',
    xlsx: '📊',
    ppt: '📽',
    pptx: '📽',
    zip: '📦',
    rar: '📦',
    default: '📁'
  }
  return iconMap[ext] || iconMap.default
}
</script>

<style scoped>
.file-upload-wrapper {
  font-family: sans-serif;
}

.upload-trigger {
  display: inline-block;
  cursor: pointer;
  margin-bottom: 12px;
}

.default-trigger {
  padding: 8px 16px;
  background-color: #1890ff;
  color: white;
  border-radius: 4px;
}

.file-list {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.file-card {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 8px;
  width: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: grab;
}

.file-card:active {
  cursor: grabbing;
}

.ghost {
  opacity: 0.4;
}

.file-thumbnail {
  width: 80px;
  height: 80px;
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

.file-thumbnail img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 32px;
}

.file-info {
  margin-top: 8px;
  text-align: center;
  width: 100%;
}

.file-name {
  display: block;
  font-size: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-actions {
  margin-top: 4px;
  display: flex;
  gap: 4px;
  justify-content: center;
}

.file-actions button {
  font-size: 11px;
  padding: 2px 6px;
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 2px;
  cursor: pointer;
}

.file-actions button:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>