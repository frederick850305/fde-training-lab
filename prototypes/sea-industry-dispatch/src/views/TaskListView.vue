<template>
  <section class="task-list-placeholder" aria-label="任务列表">
    <ViewHeading
      eyebrow="P0 Prototype Page · 司机端"
      title="任务列表"
      title-id="task-list-title"
      description="司机查看个人任务列表，接收新任务通知，筛选和查看不同状态的任务。"
    />
    <div class="placeholder-body">
      <span class="ph-icon">🚧</span>
      <p>任务列表页面开发中，下一节即将生成。</p>
    </div>
  </section>
</template>

<script setup>
import ViewHeading from '../components/ViewHeading.vue'
</script>

<style scoped>
.task-list-placeholder {
  margin-top: 16px;
}

.placeholder-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
}

.ph-icon {
  font-size: 48px;
}

.placeholder-body p {
  margin-top: 12px;
  color: #94a3b8;
  font-size: 14px;
}
</style>
