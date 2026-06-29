<template>
  <section class="material-tracking-view" aria-labelledby="material-tracking-title">
    <ViewHeading
      eyebrow="P0 Prototype Page"
      title="物料到货跟踪原型页"
      title-id="material-tracking-title"
      description="面向物资协调员和现场调度员，跟踪关键物料到货状态、延期风险和协调动作。当前使用本地 mock 数据。"
    />

    <section class="material-filter-panel" aria-label="物料到货筛选">
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
        <span>物料类别</span>
        <select v-model="filters.category">
          <option>全部类别</option>
          <option>焊接辅材</option>
          <option>切割辅材</option>
          <option>吊装索具</option>
          <option>保护气体</option>
        </select>
      </label>

      <label>
        <span>到货状态</span>
        <select v-model="filters.status">
          <option>全部状态</option>
          <option>已到货</option>
          <option>在途</option>
          <option>待确认</option>
          <option>延期</option>
        </select>
      </label>

      <button class="primary-button" type="button">刷新物料</button>
    </section>

    <section class="material-summary" aria-label="物料到货摘要">
      <MetricCard
        v-for="item in materialTrackingMock.summary"
        :key="item.key"
        :label="item.label"
        :value="item.value"
        :helper="item.helper"
        :status="item.status"
      />
    </section>

    <div class="material-grid">
      <article class="material-panel delivery-panel">
        <div class="panel-heading">
          <span>物料到货跟踪</span>
          <strong>优先关注延期与待确认物料</strong>
        </div>

        <DataTable
          :columns="deliveryColumns"
          :rows="filteredDeliveries"
          empty-title="暂无物料记录"
          empty-description="当前筛选条件下没有物料到货数据。"
        >
          <template #status="{ row }">
            <StatusTag :label="statusOptions[row.status] || row.status" :type="row.status" />
          </template>
        </DataTable>
      </article>

      <article class="material-panel risk-panel">
        <div class="panel-heading">
          <span>到货风险提示</span>
          <strong>把物料问题前置暴露给计划与现场</strong>
        </div>

        <ul class="risk-list">
          <li v-for="risk in materialTrackingMock.risks" :key="risk.id">
            <div>
              <strong>{{ risk.title }}</strong>
              <StatusTag :label="statusOptions[risk.level] || risk.level" :type="risk.level" />
            </div>
            <p>{{ risk.description }}</p>
          </li>
        </ul>
      </article>
    </div>

    <article class="material-panel action-panel">
      <div class="panel-heading">
        <span>协调动作建议</span>
        <strong>从物资、计划、现场三个角色推动闭环</strong>
      </div>

      <div class="action-list">
        <article v-for="action in materialTrackingMock.actions" :key="action.id" class="action-card">
          <span>{{ action.role }}</span>
          <strong>{{ action.title }}</strong>
          <p>{{ action.description }}</p>
        </article>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, reactive } from 'vue'
import DataTable from '../components/DataTable.vue'
import MetricCard from '../components/MetricCard.vue'
import StatusTag from '../components/StatusTag.vue'
import ViewHeading from '../components/ViewHeading.vue'
import { materialTrackingMock, statusOptions } from '../data/prototypeMockData'

const filters = reactive({
  area: '全部区域',
  category: '全部类别',
  status: '全部状态',
})

const deliveryColumns = [
  { key: 'id', label: '编号' },
  { key: 'name', label: '物料名称' },
  { key: 'category', label: '类别' },
  { key: 'area', label: '使用区域' },
  { key: 'requiredDate', label: '需求日期' },
  { key: 'expectedDate', label: '预计到货' },
  { key: 'owner', label: '责任人' },
  { key: 'status', label: '状态' },
]

const statusTextMap = {
  已到货: 'arrived',
  在途: 'in_transit',
  待确认: 'pending',
  延期: 'overdue',
}

const filteredDeliveries = computed(() => {
  return materialTrackingMock.deliveries.filter((item) => {
    const matchedArea = filters.area === '全部区域' || item.area === filters.area
    const matchedCategory = filters.category === '全部类别' || item.category === filters.category
    const matchedStatus = filters.status === '全部状态' || item.status === statusTextMap[filters.status]

    return matchedArea && matchedCategory && matchedStatus
  })
})
</script>

<style scoped>
.material-tracking-view {
  margin-top: 16px;
}

.material-filter-panel,
.material-panel,
.action-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.material-filter-panel {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 12px;
  align-items: end;
  padding: 18px;
}

.material-filter-panel label {
  display: grid;
  gap: 8px;
}

.material-filter-panel span,
.panel-heading span,
.action-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.material-filter-panel select {
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 11px 12px;
  background: #ffffff;
  color: #172033;
}

.material-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 16px;
}

.material-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 16px;
  margin-top: 16px;
}

.material-panel {
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

.risk-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.risk-list li {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.risk-list div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.risk-list strong,
.action-card strong {
  color: #172033;
}

.risk-list p,
.action-card p {
  margin: 8px 0 0;
  color: #526174;
  line-height: 1.6;
}

.action-panel {
  margin-top: 16px;
}

.action-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.action-card {
  padding: 16px;
}

.action-card strong {
  display: block;
  margin-top: 8px;
}

@media (max-width: 980px) {
  .material-filter-panel,
  .material-summary,
  .material-grid,
  .action-list {
    grid-template-columns: 1fr;
  }
}
</style>
