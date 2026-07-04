<template>
  <span class="status-tag" :class="[`status-${computedColor}`, `size-${size}`, customClass]">
    {{ displayText }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
  text: { type: String, default: '' },
  size: { type: String, default: 'default' },
  customClass: { type: String, default: '' },
})

const displayText = computed(() => props.text || props.status)

const colorMap = {
  '空闲': 'green', '任务中': 'blue', '排队': 'orange', '异常': 'red',
  '成功': 'green', '失败': 'red', '待处理': 'orange', '已完成': 'green',
  '进行中': 'blue', '待派车': 'orange', '待审批': 'orange',
  '已处理': 'green', '已忽略': 'gray', '已通过': 'green', '已驳回': 'red',
  '已同步': 'green', '同步失败': 'red', '待同步': 'orange',
  '启用': 'green', '停用': 'gray', '已接单': 'blue', '待接单': 'orange',
  '处理中': 'blue', '已过期': 'gray', '未使用': 'blue', '已使用': 'green',
  '已取消': 'gray', '已派发': 'blue', '已同步': 'green',
}

const computedColor = computed(() => {
  return colorMap[props.status] || colorMap[props.text] || 'gray'
})
</script>

<style scoped>
.status-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 6px;
  font-weight: 700;
  white-space: nowrap;
  line-height: 1;
}
.size-small { padding: 2px 6px; font-size: 11px; }
.size-default { padding: 3px 8px; font-size: 12px; }
.size-large { padding: 5px 12px; font-size: 13px; }

.status-green { background: #e6f7e6; color: #1a7a1a; }
.status-blue { background: #e6f0ff; color: #1a56db; }
.status-orange { background: #fff3e0; color: #d84315; }
.status-red { background: #ffeaea; color: #c62828; }
.status-gray { background: #f1f5f9; color: #475569; }
</style>
