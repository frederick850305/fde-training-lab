<template>
  <section class="schedule-tracking-view" aria-labelledby="schedule-tracking-title">
    <ViewHeading
      eyebrow="P0 Prototype Page"
      title="计划任务跟踪原型页"
      title-id="schedule-tracking-title"
      description="面向计划员的任务跟踪页面。当前使用本地 mock 数据，后续可替换为 FastAPI 接口。"
    />

    <section class="filter-panel" aria-label="任务筛选">
      <label>
        <span>项目</span>
        <select v-model="filters.project">
          <option>海工生产运营示范项目</option>
        </select>
      </label>

      <label>
        <span>区域</span>
        <select v-model="filters.area">
          <option>全部区域</option>
          <option>A 区</option>
          <option>B 区</option>
          <option>C 区</option>
        </select>
      </label>

      <label>
        <span>任务状态</span>
        <select v-model="filters.status">
          <option>全部状态</option>
          <option>进行中</option>
          <option>延期</option>
          <option>阻塞</option>
        </select>
      </label>

      <button class="primary-button" type="button">筛选任务</button>
    </section>

    <section class="status-summary" aria-label="任务状态摘要">
      <article v-for="item in summaryItems" :key="item.label">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
        <p>{{ item.description }}</p>
      </article>
    </section>

    <div class="schedule-grid">
      <article class="schedule-panel">
        <div class="panel-heading">
          <span>计划任务列表</span>
          <strong>识别延期、阻塞和关键任务</strong>
        </div>

        <DataTable
          :columns="taskColumns"
          :rows="scheduleTasksMock"
          empty-title="暂无计划任务"
          empty-description="当前筛选条件下没有计划任务。"
        >
          <template #status="{ row }">
            <StatusTag :label="statusOptions[row.status] || row.status" :type="row.status" />
          </template>
        </DataTable>
      </article>

      <article class="schedule-panel">
        <div class="panel-heading">
          <span>计划调整建议</span>
          <strong>基于延期和阻塞任务的模拟建议</strong>
        </div>

        <ul class="advice-list">
          <li>
            <strong>优先处理 B 区关键焊接延期</strong>
            <p>建议协调焊接资源，并确认是否受物料或质检等待影响。</p>
          </li>
          <li>
            <strong>推动 C 区物料齐套确认</strong>
            <p>当前任务处于阻塞状态，建议同步物料到货计划并明确责任人。</p>
          </li>
          <li>
            <strong>保持 A 区结构件组对节奏</strong>
            <p>任务进行中，建议继续跟踪完成率，避免后续工序等待。</p>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'
import { scheduleTasksMock, statusOptions } from '../data/prototypeMockData'

const filters = reactive({
  project: '海工生产运营示范项目',
  area: '全部区域',
  status: '全部状态',
})

const taskColumns = [
  { key: 'id', label: '编号' },
  { key: 'name', label: '任务名称' },
  { key: 'area', label: '区域' },
  { key: 'owner', label: '责任人' },
  { key: 'status', label: '状态' },
  { key: 'dueDate', label: '截止日期' },
]

const summaryItems = computed(() => {
  const runningCount = scheduleTasksMock.filter((item) => item.status === 'running').length
  const delayedCount = scheduleTasksMock.filter((item) => item.status === 'delayed').length
  const blockedCount = scheduleTasksMock.filter((item) => item.status === 'blocked').length

  return [
    {
      label: '全部任务',
      value: scheduleTasksMock.length,
      description: '当前 mock 数据中的计划任务数',
    },
    {
      label: '进行中',
      value: runningCount,
      description: '需要持续跟踪完成率',
    },
    {
      label: '延期',
      value: delayedCount,
      description: '需要优先协调资源',
    },
    {
      label: '阻塞',
      value: blockedCount,
      description: '需要明确阻塞原因',
    },
  ]
})
</script>

<style scoped>
.schedule-tracking-view {
  margin-top: 16px;
}

.filter-panel,
.status-summary article,
.schedule-panel {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.filter-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: end;
  padding: 18px;
}

.filter-panel label {
  display: grid;
  gap: 8px;
}

.filter-panel span,
.panel-heading span,
.status-summary span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.filter-panel select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  background: #ffffff;
  color: #172033;
}

.status-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.status-summary article {
  padding: 16px;
}

.status-summary strong {
  display: block;
  margin: 8px 0;
  color: #0f172a;
  font-size: 28px;
}

.status-summary p {
  margin: 0;
  color: #526174;
  line-height: 1.55;
}

.schedule-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
  gap: 16px;
  margin-top: 16px;
}

.schedule-panel {
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

.advice-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.advice-list li {
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.advice-list strong {
  display: block;
  margin-bottom: 8px;
  color: #0f172a;
}

.advice-list p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

@media (max-width: 920px) {
  .filter-panel,
  .status-summary,
  .schedule-grid {
    grid-template-columns: 1fr;
  }
}
</style>
