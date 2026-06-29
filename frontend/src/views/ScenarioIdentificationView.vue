<template>
  <section class="scenario-view" aria-labelledby="scenario-title">
    <ViewHeading
      eyebrow="Scenario Identification"
      title="场景识别模拟工作台"
      title-id="scenario-title"
      description="基于需求拆解结果，识别用户角色、业务场景、任务流程和页面映射。当前仍为前端模拟数据。"
    />

    <div class="scenario-layout">
      <article class="scenario-panel">
        <div class="panel-heading">
          <span>用户角色</span>
          <strong>谁会使用这个系统</strong>
        </div>

        <div class="role-list">
          <section v-for="role in scenarioData.roles" :key="role.name" class="role-card">
            <h3>{{ role.name }}</h3>
            <p>{{ role.focus }}</p>
            <ul>
              <li v-for="action in role.actions" :key="action">{{ action }}</li>
            </ul>
          </section>
        </div>
      </article>

      <article class="scenario-panel">
        <div class="panel-heading">
          <span>业务场景</span>
          <strong>先识别高频、关键、易验证场景</strong>
        </div>

        <div class="scenario-list" aria-label="业务场景列表">
          <button
            v-for="item in scenarioData.scenarios"
            :key="item.key"
            type="button"
            class="scenario-button"
            :class="{ active: item.key === selectedScenario.key }"
            @click="selectedKey = item.key"
          >
            <span>{{ item.priority }}</span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.description }}</small>
          </button>
        </div>
      </article>
    </div>

    <div class="scenario-detail">
      <article class="detail-card">
        <span>当前场景</span>
        <h3>{{ selectedScenario.name }}</h3>
        <p>{{ selectedScenario.description }}</p>
      </article>

      <article class="detail-card">
        <span>任务流程</span>
        <ol>
          <li v-for="step in selectedScenario.workflow" :key="step">{{ step }}</li>
        </ol>
      </article>

      <article class="detail-card">
        <span>页面映射</span>
        <dl>
          <div>
            <dt>角色</dt>
            <dd>{{ selectedScenario.pageMapping.role }}</dd>
          </div>
          <div>
            <dt>建议页面</dt>
            <dd>{{ selectedScenario.pageMapping.page }}</dd>
          </div>
          <div>
            <dt>页面模块</dt>
            <dd>{{ selectedScenario.pageMapping.modules.join('、') }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { scenarioIdentificationMock } from '../data/scenarioIdentificationMock'
import ViewHeading from '../components/ViewHeading.vue'

const scenarioData = scenarioIdentificationMock
const selectedKey = ref(scenarioData.scenarios[0].key)

const selectedScenario = computed(() => {
  return (
    scenarioData.scenarios.find((item) => item.key === selectedKey.value) ||
    scenarioData.scenarios[0]
  )
})
</script>

<style scoped>
.scenario-view {
  margin-top: 16px;
}

.scenario-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
  gap: 16px;
}

.scenario-panel,
.detail-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.scenario-panel {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.role-list {
  display: grid;
  gap: 12px;
}

.role-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.role-card h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 18px;
}

.role-card p,
.scenario-button small,
.detail-card p {
  color: #526174;
  line-height: 1.65;
}

.role-card p {
  margin: 0 0 10px;
}

.role-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.role-card li {
  border-radius: 999px;
  padding: 5px 9px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

.scenario-list {
  display: grid;
  gap: 10px;
}

.scenario-button {
  display: grid;
  gap: 7px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.scenario-button.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.scenario-button span {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.scenario-button strong {
  color: #0f172a;
  font-size: 16px;
}

.scenario-detail {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 16px;
  margin-top: 16px;
}

.detail-card {
  padding: 20px;
}

.detail-card h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 22px;
}

.detail-card p {
  margin-bottom: 0;
}

.detail-card ol {
  display: grid;
  gap: 9px;
  margin: 12px 0 0;
  padding-left: 22px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.detail-card dl {
  display: grid;
  gap: 10px;
  margin: 12px 0 0;
}

.detail-card dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.detail-card dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.detail-card dd {
  margin: 0;
  color: #172033;
  line-height: 1.6;
  font-weight: 800;
}

@media (max-width: 920px) {
  .scenario-layout,
  .scenario-detail {
    grid-template-columns: 1fr;
  }
}
</style>
