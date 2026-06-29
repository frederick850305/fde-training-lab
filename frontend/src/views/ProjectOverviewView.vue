<template>
  <section class="project-overview-view" aria-labelledby="project-overview-title">
    <ViewHeading
      eyebrow="P0 Prototype Page"
      title="项目总览原型页"
      title-id="project-overview-title"
      description="面向项目经理的一屏式项目运营总览。当前使用本地 mock 数据，后续可替换为 FastAPI 接口。"
    />

    <section class="overview-hero">
      <div>
        <span>当前项目</span>
        <h3>{{ projectOverviewMock.projectName }}</h3>
        <p>展示项目进度、关键节点、异常问题和资源占用，用于快速判断项目运行风险。</p>
      </div>
      <strong>Mock 数据模式</strong>
    </section>

    <section class="metric-grid" aria-label="项目指标">
      <MetricCard
        v-for="metric in projectOverviewMock.metrics"
        :key="metric.key"
        :label="metric.label"
        :value="metric.value"
        :helper="metric.helper"
        :status="metric.status"
      />
    </section>

    <div class="overview-grid">
      <article class="overview-panel">
        <div class="panel-heading">
          <span>关键节点</span>
          <strong>关注延期和预警节点</strong>
        </div>

        <ul class="milestone-list">
          <li v-for="item in projectOverviewMock.milestones" :key="item.name">
            <div>
              <strong>{{ item.name }}</strong>
              <small>{{ item.date }}</small>
            </div>
            <StatusTag :label="statusOptions[item.status] || item.status" :type="item.status" />
          </li>
        </ul>
      </article>

      <article class="overview-panel">
        <div class="panel-heading">
          <span>异常问题摘要</span>
          <strong>优先处理未关闭问题</strong>
        </div>

        <DataTable
          :columns="issueColumns"
          :rows="issueListMock"
          empty-title="暂无异常问题"
          empty-description="当前项目没有需要处理的异常。"
        >
          <template #status="{ row }">
            <StatusTag :label="statusOptions[row.status] || row.status" :type="row.status" />
          </template>
        </DataTable>
      </article>
    </div>
  </section>
</template>

<script setup>
import DataTable from '../components/DataTable.vue'
import MetricCard from '../components/MetricCard.vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'
import { issueListMock, projectOverviewMock, statusOptions } from '../data/prototypeMockData'

const issueColumns = [
  { key: 'id', label: '编号' },
  { key: 'title', label: '异常标题' },
  { key: 'owner', label: '责任人' },
  { key: 'status', label: '状态' },
  { key: 'deadline', label: '截止日期' },
]
</script>

<style scoped>
.project-overview-view {
  margin-top: 16px;
}

.overview-hero,
.overview-panel {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.overview-hero {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  padding: 24px;
}

.overview-hero span,
.panel-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.overview-hero h3 {
  margin: 8px 0 10px;
  color: #0f172a;
  font-size: 26px;
}

.overview-hero p {
  margin: 0;
  color: #526174;
  line-height: 1.7;
}

.overview-hero > strong {
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 7px 11px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.overview-grid {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;
  margin-top: 16px;
}

.overview-panel {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.milestone-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.milestone-list li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.milestone-list strong {
  display: block;
  margin-bottom: 4px;
  color: #0f172a;
}

.milestone-list small {
  color: #64748b;
  font-weight: 700;
}

@media (max-width: 920px) {
  .overview-hero,
  .milestone-list li {
    flex-direction: column;
    align-items: flex-start;
  }

  .metric-grid,
  .overview-grid {
    grid-template-columns: 1fr;
  }
}
</style>
