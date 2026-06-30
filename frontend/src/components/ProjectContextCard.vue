<template>
  <article class="project-context-card">
    <div class="context-heading">
      <span>项目基础信息</span>
      <strong>用于本轮需求拆解和后续场景识别</strong>
    </div>

    <div class="context-form">
      <label>
        <span>项目名称</span>
        <input :value="context.projectName || ''" type="text" placeholder="请输入项目名称" @input="updateField('projectName', $event.target.value)" />
      </label>

      <label>
        <span>客户名称</span>
        <input :value="context.customerName || ''" type="text" placeholder="请输入客户名称" @input="updateField('customerName', $event.target.value)" />
      </label>

      <label>
        <span>项目阶段</span>
        <input :value="context.projectStage || ''" type="text" placeholder="请输入当前阶段" @input="updateField('projectStage', $event.target.value)" />
      </label>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
  context: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['context-update'])

function updateField(field, value) {
  emit('context-update', {
    ...props.context,
    [field]: value,
  })
}
</script>

<style scoped>
.project-context-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.context-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
}

.context-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.context-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.context-form {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

label {
  display: grid;
  gap: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

input {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  color: #172033;
  background: #ffffff;
  font-weight: 800;
}

input:focus {
  border-color: #2563eb;
  outline: 3px solid #dbeafe;
}

@media (max-width: 920px) {
  .context-form {
    grid-template-columns: 1fr;
  }
}
</style>
