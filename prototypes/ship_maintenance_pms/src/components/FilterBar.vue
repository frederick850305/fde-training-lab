<template>
  <form class="filter-bar" @submit.prevent="$emit('search')">
    <label>
      关键词
      <input :value="keyword" placeholder="船舶 / 设备 / 编号" @input="$emit('update:keyword', $event.target.value)" />
    </label>
    <label>
      状态
      <select :value="status" @change="$emit('update:status', $event.target.value)">
        <option value="">全部状态</option>
        <option>待处理</option>
        <option>进行中</option>
        <option>异常</option>
        <option>已闭环</option>
      </select>
    </label>
    <label>
      船舶
      <select :value="ship" @change="$emit('update:ship', $event.target.value)">
        <option value="">全部船舶</option>
        <option>HG-01 启航轮</option>
        <option>HG-02 宏远轮</option>
        <option>HG-03 海工保障船</option>
      </select>
    </label>
    <button type="submit">查询</button>
  </form>
</template>

<script setup>
defineProps({
  keyword: { type: String, default: '' },
  status: { type: String, default: '' },
  ship: { type: String, default: '' },
})

defineEmits(['update:keyword', 'update:status', 'update:ship', 'search'])
</script>

<style scoped>
.filter-bar { display: grid; grid-template-columns: 1.2fr .8fr .8fr auto; gap: 10px; align-items: end; }
label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
input, select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; color: #172033; background: #fff; }
button { min-height: 38px; border: 0; border-radius: 7px; padding: 0 16px; color: #fff; background: #1e6fd9; font-weight: 900; }
@media (max-width: 760px) { .filter-bar { grid-template-columns: 1fr; } }
</style>
