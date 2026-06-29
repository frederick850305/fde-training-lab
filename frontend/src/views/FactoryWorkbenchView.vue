<template>
  <section class="factory-workbench-view" aria-labelledby="factory-workbench-title">
    <ViewHeading
      eyebrow="Factory Workbench"
      title="原型工厂操作台总览"
      title-id="factory-workbench-title"
      description="把当前练习中的需求输入、场景识别、功能设计、页面设计、交互设计、API 契约和原型建议串成一条未来可实战落地的操作链路。"
    />

    <section class="summary-grid" aria-label="当前阶段摘要">
      <MetricCard
        v-for="item in factoryWorkbenchSummary"
        :key="item.key"
        :label="item.label"
        :value="item.value"
        :helper="item.helper"
        :status="item.status"
      />
    </section>

    <div class="workbench-layout">
      <article class="workbench-panel stage-panel">
        <div class="panel-heading">
          <span>阶段链路</span>
          <strong>先把方法走通，再把每一步替换成真实执行</strong>
        </div>

        <div class="stage-list">
          <article v-for="item in factoryWorkbenchStages" :key="item.key" class="stage-card">
            <div class="stage-head">
              <div>
                <span class="step-tag">{{ item.step }}</span>
                <h3>{{ item.title }}</h3>
              </div>
              <StatusTag :label="item.statusLabel" :type="item.statusType" />
            </div>

            <dl class="stage-meta">
              <div>
                <dt>输入</dt>
                <dd>{{ item.input }}</dd>
              </div>
              <div>
                <dt>输出</dt>
                <dd>{{ item.output }}</dd>
              </div>
            </dl>

            <div class="stage-notes">
              <p>
                <strong>当前：</strong>
                {{ item.currentMode }}
              </p>
              <p>
                <strong>后续：</strong>
                {{ item.futureMode }}
              </p>
            </div>

            <button class="primary-button" type="button" @click="$emit('open-workspace', item.key)">
              {{ item.actionLabel }}
            </button>
          </article>
        </div>
      </article>

      <aside class="workbench-panel target-panel">
        <div class="panel-heading">
          <span>后续重点</span>
          <strong>把演示型工作台升级为真实执行型工作流</strong>
        </div>

        <ol class="target-list">
          <li v-for="item in factoryWorkbenchNextTargets" :key="item">
            {{ item }}
          </li>
        </ol>

        <div class="target-callout">
          <span>实战定位</span>
          <p>
            当前第一 Tab 已不只是方法展示区，而是未来“客户需求分析 -> 结构化产出 -> 原型生成”的操作台主页。
          </p>
        </div>
      </aside>
    </div>
  </section>
</template>

<script setup>
import MetricCard from '../components/MetricCard.vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'
import {
  factoryWorkbenchNextTargets,
  factoryWorkbenchStages,
  factoryWorkbenchSummary,
} from '../data/factoryWorkbenchMock'

defineEmits(['open-workspace'])
</script>

<style scoped>
.factory-workbench-view {
  margin-top: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.workbench-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(320px, 0.6fr);
  gap: 16px;
  margin-top: 16px;
}

.workbench-panel,
.stage-card,
.target-callout {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.workbench-panel {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.target-callout span,
.step-tag {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.stage-list {
  display: grid;
  gap: 12px;
}

.stage-card {
  padding: 16px;
}

.stage-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.step-tag {
  display: inline-block;
  margin-bottom: 8px;
}

.stage-head h3 {
  margin: 0;
  color: #0f172a;
  font-size: 20px;
}

.stage-meta {
  display: grid;
  gap: 10px;
  margin: 16px 0;
}

.stage-meta div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.stage-meta dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.stage-meta dd {
  margin: 0;
  color: #172033;
  line-height: 1.7;
  font-weight: 700;
}

.stage-notes {
  display: grid;
  gap: 10px;
  margin-bottom: 14px;
}

.stage-notes p,
.target-callout p {
  margin: 0;
  color: #526174;
  line-height: 1.7;
}

.target-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding-left: 22px;
  color: #263244;
  line-height: 1.7;
  font-weight: 700;
}

.target-callout {
  margin-top: 16px;
  padding: 16px;
  background: #eff6ff;
}

@media (max-width: 960px) {
  .summary-grid,
  .workbench-layout {
    grid-template-columns: 1fr;
  }
}
</style>