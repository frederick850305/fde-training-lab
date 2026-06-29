<script setup>
import { computed, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import { prototypeWorkflowSteps } from '../data/prototypeWorkflow'

const selectedKey = ref(prototypeWorkflowSteps[0].key)

const selectedStep = computed(() => {
  return (
    prototypeWorkflowSteps.find((item) => item.key === selectedKey.value) ||
    prototypeWorkflowSteps[0]
  )
})
</script>

<template>
  <section class="workflow-section" aria-labelledby="workflow-title">
    <ViewHeading
      eyebrow="Prototype Generator"
      title="原型生成流程工作台"
      title-id="workflow-title"
      description="后续用户输入客户需求后，系统会按这条流程逐步完成需求、场景、功能、页面、交互和 API 契约拆解。"
    />

    <div class="workflow-layout">
      <div class="workflow-steps" aria-label="原型生成步骤">
        <button
          v-for="item in prototypeWorkflowSteps"
          :key="item.key"
          class="workflow-step"
          :class="{ active: item.key === selectedStep.key }"
          type="button"
          @click="selectedKey = item.key"
        >
          <span class="step-index">{{ item.step }}</span>

          <span class="step-copy">
            <strong>{{ item.title }}</strong>
            <small>{{ item.output }}</small>
          </span>
        </button>
      </div>

      <article class="workflow-detail">
        <p class="detail-label">Step {{ selectedStep.step }}</p>
        <h3>{{ selectedStep.title }}</h3>
        <p class="detail-goal">{{ selectedStep.goal }}</p>

        <dl class="detail-grid">
          <div>
            <dt>输入</dt>
            <dd>{{ selectedStep.input }}</dd>
          </div>

          <div>
            <dt>输出</dt>
            <dd>{{ selectedStep.output }}</dd>
          </div>

          <div>
            <dt>方法资产</dt>
            <dd>{{ selectedStep.templateFile }}</dd>
          </div>

          <div>
            <dt>Prompt 提示</dt>
            <dd>{{ selectedStep.promptHint }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<style scoped>
.workflow-section {
  margin-top: 24px;
}

.workflow-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.9fr) minmax(0, 1.1fr);
  gap: 24px;
}

.workflow-steps,
.workflow-detail {
  border: 1px solid #d8e1ef;
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.05);
}

.workflow-steps {
  display: grid;
  gap: 10px;
  padding: 16px;
}

.workflow-step {
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 14px;
  align-items: start;
  width: 100%;
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: #f8fafc;
  color: #111827;
  text-align: left;
  cursor: pointer;
}

.workflow-step:hover {
  border-color: #bfdbfe;
  background: #eff6ff;
}

.workflow-step.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.step-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 14px;
  font-weight: 900;
}

.step-copy {
  display: grid;
  gap: 6px;
}

.step-copy strong {
  color: #111827;
  font-size: 15px;
}

.step-copy small {
  display: -webkit-box;
  color: #64748b;
  font-size: 13px;
  line-height: 1.5;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.workflow-detail {
  padding: 30px;
}

.detail-label {
  margin: 0 0 12px;
  color: #2454e6;
  font-size: 14px;
  font-weight: 900;
}

.workflow-detail h3 {
  margin: 0 0 14px;
  color: #111827;
  font-size: 30px;
  line-height: 1.2;
}

.detail-goal {
  margin: 0 0 22px;
  color: #64748b;
  font-size: 16px;
  line-height: 1.8;
}

.detail-grid {
  display: grid;
  gap: 14px;
  margin: 0;
}

.detail-grid div {
  padding: 16px;
  border-radius: 10px;
  background: #f8fafc;
}

.detail-grid dt {
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.detail-grid dd {
  margin: 0;
  color: #111827;
  font-size: 15px;
  line-height: 1.7;
}

@media (max-width: 960px) {
  .workflow-layout {
    grid-template-columns: 1fr;
  }
}
</style>