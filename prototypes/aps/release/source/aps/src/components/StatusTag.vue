<template>
  <span class="status" :class="tone">{{ label || status }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: '' },
  label: { type: String, default: '' },
})

const map = {
  齐套: 'green', 部分齐套: 'yellow', 缺关键件: 'red', 风险齐套: 'orange', 图纸未冻结: 'purple',
  已完成: 'gray', 执行中: 'green', 已排程: 'blue', 待下发: 'cyan', 待排: 'gray',
  齐套风险: 'yellow', 资源冲突: 'red', 外协: 'orange', 关键路径: 'purple',
  正常: 'green', 超负荷: 'orange', 严重超负荷: 'red', 冲突: 'red', 临界: 'yellow',
  低: 'green', 中: 'yellow', 高: 'red',
  稳定: 'green', 关注: 'yellow', 告警: 'red', 阻碍: 'purple', 风险: 'yellow', 阻断: 'purple',
}

const tone = computed(() => map[props.status] || 'gray')
</script>
