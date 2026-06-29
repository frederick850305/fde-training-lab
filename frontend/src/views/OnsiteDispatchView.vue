<template>
  <section class="onsite-dispatch-view" aria-labelledby="onsite-dispatch-title">
    <ViewHeading
      eyebrow="P0 Prototype Page"
      title="现场调度看板原型页"
      title-id="onsite-dispatch-title"
      description="面向现场调度员，集中展示作业面状态、关键资源占用、物料预警和调度建议。当前使用本地 mock 数据。"
    />

    <section class="dispatch-filter-panel" aria-label="现场调度筛选">
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
        <span>工序</span>
        <select v-model="filters.process">
          <option>全部工序</option>
          <option>切割</option>
          <option>组对</option>
          <option>焊接</option>
          <option>打磨</option>
        </select>
      </label>

      <label>
        <span>状态</span>
        <select v-model="filters.status">
          <option>全部状态</option>
          <option>进行中</option>
          <option>预警</option>
          <option>阻塞</option>
        </select>
      </label>

      <button class="primary-button" type="button">刷新看板</button>
    </section>

    <section class="dispatch-summary" aria-label="现场状态摘要">
      <MetricCard
        v-for="item in onsiteDispatchMock.summary"
        :key="item.key"
        :label="item.label"
        :value="item.value"
        :helper="item.helper"
        :status="item.status"
      />
    </section>

    <div class="dispatch-grid">
      <article class="dispatch-panel workface-panel">
        <div class="panel-heading">
          <span>作业面状态</span>
          <strong>优先处理预警与阻塞作业面</strong>
        </div>

        <DataTable
          :columns="workfaceColumns"
          :rows="filteredWorkfaces"
          empty-title="暂无作业面"
          empty-description="当前筛选条件下没有作业面数据。"
        >
          <template #status="{ row }">
            <StatusTag :label="statusOptions[row.status] || row.status" :type="row.status" />
          </template>
        </DataTable>
      </article>

      <article class="dispatch-panel advice-panel">
        <div class="panel-heading">
          <span>调度建议</span>
          <strong>从资源、物料、作业面三个角度协调</strong>
        </div>

        <ul class="dispatch-advice-list">
          <li>
            <strong>先处理 B 区焊接作业面阻塞</strong>
            <p>保护气低于安全库存，建议立即协调补给，避免焊接节拍持续拖延。</p>
          </li>
          <li>
            <strong>协调 80T 履带吊资源</strong>
            <p>B 区组对等待吊装资源，建议确认吊车占用窗口并调整作业顺序。</p>
          </li>
          <li>
            <strong>用叉车资源支撑短驳</strong>
            <p>叉车当前可用率较高，可优先支撑 B 区物料转运与临时补给。</p>
          </li>
        </ul>
      </article>
    </div>

    <div class="dispatch-grid secondary-grid">
      <article class="dispatch-panel">
        <div class="panel-heading">
          <span>关键资源占用</span>
          <strong>识别资源冲突与可调配资源</strong>
        </div>

        <div class="resource-card-list">
          <article v-for="resource in onsiteDispatchMock.resources" :key="resource.id" class="resource-card">
            <div>
              <span>{{ resource.type }}</span>
              <strong>{{ resource.name }}</strong>
            </div>
            <StatusTag :label="statusOptions[resource.status] || resource.status" :type="resource.status" />
            <p class="resource-usage">占用率：{{ resource.usage }}</p>
            <p>{{ resource.advice }}</p>
          </article>
        </div>
      </article>

      <article class="dispatch-panel">
        <div class="panel-heading">
          <span>物料预警</span>
          <strong>关注低于安全库存的现场物料</strong>
        </div>

        <DataTable
          :columns="materialColumns"
          :rows="onsiteDispatchMock.materialWarnings"
          empty-title="暂无物料预警"
          empty-description="当前没有低库存物料。"
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
import { computed, reactive } from 'vue'
import DataTable from '../components/DataTable.vue'
import MetricCard from '../components/MetricCard.vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'
import { onsiteDispatchMock, statusOptions } from '../data/prototypeMockData'

const filters = reactive({
  area: '全部区域',
  process: '全部工序',
  status: '全部状态',
})

const workfaceColumns = [
  { key: 'id', label: '编号' },
  { key: 'name', label: '作业面' },
  { key: 'area', label: '区域' },
  { key: 'process', label: '工序' },
  { key: 'owner', label: '负责人' },
  { key: 'status', label: '状态' },
  { key: 'risk', label: '风险说明' },
]

const materialColumns = [
  { key: 'id', label: '编号' },
  { key: 'name', label: '物料' },
  { key: 'area', label: '区域' },
  { key: 'stock', label: '当前库存' },
  { key: 'safeStock', label: '安全库存' },
  { key: 'status', label: '状态' },
]

const statusTextMap = {
  进行中: 'running',
  预警: 'warning',
  阻塞: 'blocked',
}

const filteredWorkfaces = computed(() => {
  return onsiteDispatchMock.workfaces.filter((item) => {
    const matchedArea = filters.area === '全部区域' || item.area === filters.area
    const matchedProcess = filters.process === '全部工序' || item.process === filters.process
    const matchedStatus = filters.status === '全部状态' || item.status === statusTextMap[filters.status]

    return matchedArea && matchedProcess && matchedStatus
  })
})
</script>

<style scoped>
.onsite-dispatch-view {
  margin-top: 16px;
}

.dispatch-filter-panel,
.dispatch-panel,
.resource-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.dispatch-filter-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: end;
  padding: 18px;
}

.dispatch-filter-panel label {
  display: grid;
  gap: 8px;
}

.dispatch-filter-panel span,
.panel-heading span,
.resource-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.dispatch-filter-panel select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  background: #ffffff;
  color: #172033;
}

.dispatch-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.dispatch-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(320px, 0.7fr);
  gap: 16px;
  margin-top: 16px;
}

.secondary-grid {
  grid-template-columns: minmax(320px, 0.8fr) minmax(0, 1.2fr);
}

.dispatch-panel {
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

.dispatch-advice-list,
.resource-card-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.dispatch-advice-list li,
.resource-card {
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.dispatch-advice-list strong,
.resource-card strong {
  display: block;
  margin-bottom: 8px;
  color: #0f172a;
}

.dispatch-advice-list p,
.resource-card p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.resource-card {
  display: grid;
  gap: 10px;
  box-shadow: none;
}

.resource-usage {
  font-weight: 900;
}

@media (max-width: 920px) {
  .dispatch-filter-panel,
  .dispatch-summary,
  .dispatch-grid,
  .secondary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
