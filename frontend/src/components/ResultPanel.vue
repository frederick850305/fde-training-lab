<template>
  <aside class="result-panel" :class="resolvedStatus">
    <span class="result-label">{{ label }}</span>

    <template v-if="resolvedStatus === 'empty'">
      <h3>{{ emptyTitle }}</h3>
      <p>{{ emptyDescription }}</p>
    </template>

    <template v-else-if="resolvedStatus === 'loading'">
      <h3>{{ loadingTitle }}</h3>
      <p>{{ loadingDescription }}</p>
    </template>

    <template v-else-if="resolvedStatus === 'success'">
      <h3>{{ message }}</h3>
      <dl>
        <div v-for="item in details" :key="item.label">
          <dt>{{ item.label }}</dt>
          <dd>{{ item.value }}</dd>
        </div>
      </dl>
    </template>

    <template v-else>
      <h3>{{ message }}</h3>
      <p class="error-code">错误码：{{ errorCode || 'UNKNOWN_ERROR' }}</p>
    </template>
  </aside>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    default: 'empty',
  },
  label: {
    type: String,
    default: '执行结果',
  },
  message: {
    type: String,
    default: '',
  },
  errorCode: {
    type: String,
    default: '',
  },
  details: {
    type: Array,
    default: () => [],
  },
  emptyTitle: {
    type: String,
    default: '等待执行',
  },
  emptyDescription: {
    type: String,
    default: '提交任务后，这里会展示执行状态、输出结果和错误信息。',
  },
  loadingTitle: {
    type: String,
    default: '正在处理',
  },
  loadingDescription: {
    type: String,
    default: '任务正在执行，请稍候。',
  },
})

const validStatuses = ['empty', 'loading', 'success', 'error']

const resolvedStatus = computed(() => {
  return validStatuses.includes(props.status) ? props.status : 'empty'
})
</script>

<style scoped>
.result-panel {
  min-height: 280px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 24px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.result-label {
  display: block;
  margin-bottom: 14px;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

h3 {
  margin: 0 0 12px;
  color: #0f172a;
  font-size: 22px;
}

p {
  margin-top: 0;
  color: #526174;
  line-height: 1.7;
}

.result-panel.success {
  border-color: #bbf7d0;
  background: #f0fdf4;
}

.result-panel.loading {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.result-panel.error {
  border-color: #fecaca;
  background: #fef2f2;
}

dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

dl div {
  border-radius: 8px;
  padding: 12px;
  background: rgb(255 255 255 / 0.72);
}

dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 800;
}

dd {
  margin: 0;
  color: #0f172a;
  font-weight: 800;
  overflow-wrap: anywhere;
}

.error-code {
  color: #b91c1c;
  font-weight: 800;
}
</style>
