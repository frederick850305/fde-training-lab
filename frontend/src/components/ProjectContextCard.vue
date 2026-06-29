<template>
  <article class="project-context-card">
    <div class="context-heading">
      <span>Project Context</span>
      <strong>{{ context.projectName || '未选择项目' }}</strong>
    </div>

    <dl>
      <div>
        <dt>客户名称</dt>
        <dd>{{ context.customerName || '待补充' }}</dd>
      </div>
      <div>
        <dt>项目阶段</dt>
        <dd>{{ context.projectStage || '待确认' }}</dd>
      </div>
      <div>
        <dt>当前步骤</dt>
        <dd>{{ context.currentStepLabel || '未开始' }}</dd>
      </div>
      <div>
        <dt>上下文状态</dt>
        <dd>{{ context.contextStatus || '未建立' }}</dd>
      </div>
    </dl>

    <p v-if="context.summary" class="context-summary">{{ context.summary }}</p>
  </article>
</template>

<script setup>
defineProps({
  context: {
    type: Object,
    required: true,
  },
})
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

dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

dd {
  margin: 0;
  color: #172033;
  font-weight: 800;
}

.context-summary {
  margin: 14px 0 0;
  color: #526174;
  line-height: 1.7;
}
</style>