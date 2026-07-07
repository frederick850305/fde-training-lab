<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">工单管理 / 工单审核</span>
        <h1>工单审核列表</h1>
        <p>聚合查看待审核、需整改、已闭环工单，多维筛选定位工单，点击卡片内联展开查看摘要详情。</p>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span class="wide"></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无工单数据</h2>
      <p>当前筛选条件下没有工单记录。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '工单数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- Tab 切换 -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          type="button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
          <span class="tab-count">{{ tab.count }}</span>
        </button>
      </div>

      <!-- 多维筛选 -->
      <article class="panel">
        <div class="panel-title">
          <h2>多维筛选</h2>
          <span>{{ filteredOrders.length }} 条</span>
        </div>
        <FilterBar
          v-model:keyword="filters.keyword"
          v-model:status="filters.status"
          v-model:ship="filters.ship"
          :status-options="workOrderStatusOptions"
          @search="applyFilters"
        />
      </article>

      <!-- 工单卡片 -->
      <article class="panel">
        <div class="panel-title">
          <h2>{{ activeTabLabel }}工单</h2>
          <span>点击卡片展开详情</span>
        </div>
        <div v-if="!filteredOrders.length" class="empty-inline">当前 Tab 与筛选条件下无工单。</div>
        <div v-else class="order-list">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="order-card"
            :class="{ expanded: expandedId === order.id }"
          >
            <div class="order-head" @click="toggleExpand(order)">
              <div class="order-id">
                <strong>{{ order.id }}</strong>
                <span class="order-type">{{ order.type }}</span>
              </div>
              <div class="order-meta">
                <span>{{ order.ship }}</span>
                <span>{{ order.equipment }}</span>
              </div>
              <div class="order-tags">
                <span class="pri-badge" :class="priClass(order.priority)">{{ order.priority }}优先级</span>
                <StatusBadge :label="order.status" />
              </div>
              <div class="order-foot">
                <small>执行人 {{ order.executor }}</small>
                <small>计划日期 {{ order.planDate }}</small>
              </div>
              <span class="expand-icon">{{ expandedId === order.id ? '▾' : '▸' }}</span>
            </div>
            <div v-if="expandedId === order.id" class="order-detail">
              <dl>
                <div><dt>工单编号</dt><dd>{{ order.id }}</dd></div>
                <div><dt>关联计划</dt><dd>{{ order.planId || '无（故障维修）' }}</dd></div>
                <div><dt>提交时间</dt><dd>{{ order.submittedAt }}</dd></div>
                <div><dt>附件数</dt><dd>{{ order.attachments }}</dd></div>
              </dl>
              <div v-if="order.reportData" class="report-summary">
                <div class="rp-block">
                  <strong>实际工时</strong>
                  <span>{{ order.reportData.actualHours }} 小时</span>
                </div>
                <div class="rp-block">
                  <strong>物料消耗</strong>
                  <span>{{ order.reportData.materials.length }} 项</span>
                </div>
                <div class="rp-block wide">
                  <strong>执行发现</strong>
                  <p>{{ order.reportData.findings }}</p>
                </div>
              </div>
              <div class="detail-actions">
                <button type="button" class="primary" @click.stop="goDetail(order)">查看完整详情</button>
                <button type="button" @click.stop="quickApprove(order)">快速通过</button>
              </div>
            </div>
          </div>
        </div>
      </article>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmAction"
    />
  </section>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import FilterBar from '@/components/FilterBar.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { auditWorkOrder, fetchWorkOrders } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const orders = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const activeTab = ref('pending')
const expandedId = ref(null)
const filters = reactive({ keyword: '', status: '', ship: '' })

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingOrder = ref(null)
const pendingActionType = ref('')
const workOrderStatusOptions = ['待审核', '需整改', '已闭环']

const tabs = computed(() => [
  { key: 'pending', label: '待审核', count: orders.value.filter((o) => o.status === '待审核').length },
  { key: 'rectify', label: '需整改', count: orders.value.filter((o) => o.status === '需整改').length },
  { key: 'closed', label: '已闭环', count: orders.value.filter((o) => o.status === '已闭环').length },
])

const activeTabLabel = computed(() => tabs.value.find((t) => t.key === activeTab.value)?.label || '')

const tabFiltered = computed(() => {
  const map = { pending: '待审核', rectify: '需整改', closed: '已闭环' }
  return orders.value.filter((o) => o.status === map[activeTab.value])
})

const filteredOrders = computed(() =>
  tabFiltered.value.filter((o) => {
    const kw = !filters.keyword || `${o.id}${o.ship}${o.equipment}${o.executor}`.includes(filters.keyword)
    const st = !filters.status || o.status === filters.status
    const sh = !filters.ship || o.ship === filters.ship
    return kw && st && sh
  }),
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const data = await fetchWorkOrders()
    orders.value = data
    expandedId.value = null
    uiState.value = data.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function toggleExpand(order) {
  expandedId.value = expandedId.value === order.id ? null : order.id
}

function applyFilters() {
  expandedId.value = null
}

function priClass(pri) {
  if (pri === '高') return 'danger'
  if (pri === '中') return 'warn'
  return 'pending'
}

function goDetail(order) {
  navigation?.navigateTo?.('WorkOrderAuditDetail', {
    workOrderId: order.id,
    status: order.status,
  })
}

function quickApprove(order) {
  confirmTitle.value = '快速通过工单'
  confirmMessage.value = `确认通过工单 ${order.id}（${order.equipment}）的报工审核？`
  pendingOrder.value = order
  pendingActionType.value = 'approve'
  confirmOpen.value = true
}

async function confirmAction() {
  try {
    if (pendingActionType.value === 'approve') {
      await auditWorkOrder(pendingOrder.value?.id, { decision: '通过', comment: '列表快速通过' })
      if (pendingOrder.value) pendingOrder.value.status = '已闭环'
    }
    confirmOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }

.state-panel { min-height: 240px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(3, 1fr); padding: 24px; }
.skeleton span { height: 140px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.skeleton .wide { grid-column: 1 / -1; height: 80px; }

.tab-bar { display: flex; gap: 8px; flex-wrap: wrap; }
.tab-bar button { display: inline-flex; align-items: center; gap: 8px; }
.tab-bar button.active { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
.tab-count { font-size: 11px; padding: 2px 7px; border-radius: 999px; background: rgba(255,255,255,.3); }
.tab-bar button:not(.active) .tab-count { background: #e7edf4; color: #53657c; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.empty-inline { padding: 20px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; }

.order-list { display: grid; gap: 10px; }
.order-card { border: 1px solid #d9e4ef; border-radius: 8px; background: #f8fbfe; overflow: hidden; transition: border-color .15s; }
.order-card:hover { border-color: #9eb3ca; }
.order-card.expanded { border-color: #1e6fd9; }
.order-head { display: grid; grid-template-columns: minmax(160px, auto) 1fr auto; grid-template-areas: "id meta tags" "foot foot foot"; gap: 8px 12px; padding: 14px 16px; cursor: pointer; align-items: center; position: relative; }
.order-id { grid-area: id; display: flex; align-items: center; gap: 8px; }
.order-id strong { font-size: 14px; }
.order-type { font-size: 11px; font-weight: 900; color: #1e6fd9; background: #e3efff; padding: 2px 8px; border-radius: 999px; }
.order-meta { grid-area: meta; display: flex; gap: 12px; color: #53657c; font-size: 13px; flex-wrap: wrap; }
.order-tags { grid-area: tags; display: flex; align-items: center; gap: 8px; }
.pri-badge { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; }
.pri-badge.danger { color: #b4232d; background: #ffe1e3; }
.pri-badge.warn { color: #8a5a00; background: #fff2cc; }
.pri-badge.pending { color: #53657c; background: #e7edf4; }
.order-foot { grid-area: foot; display: flex; gap: 16px; }
.order-foot small { color: #8b9aab; font-size: 11px; }
.expand-icon { position: absolute; right: 16px; top: 14px; color: #86a1bf; }

.order-detail { border-top: 1px solid #e2eaf3; padding: 16px; background: #fff; display: grid; gap: 14px; }
.order-detail dl { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 0; }
.order-detail dl div { display: grid; gap: 3px; border-bottom: 1px solid #e7edf4; padding-bottom: 6px; }
.order-detail dt { color: #64748b; font-size: 11px; font-weight: 800; }
.order-detail dd { margin: 0; font-weight: 800; font-size: 13px; }

.report-summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.rp-block { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; }
.rp-block.wide { grid-column: span 1; }
.rp-block strong { display: block; color: #64748b; font-size: 11px; font-weight: 800; margin-bottom: 4px; }
.rp-block span { font-size: 16px; font-weight: 900; color: #1e6fd9; }
.rp-block p { margin: 4px 0 0; color: #172033; font-size: 12px; line-height: 1.5; }

.detail-actions { display: flex; gap: 10px; flex-wrap: wrap; }

@media (max-width: 760px) {
  .page-header { flex-direction: column; }
  .order-head { grid-template-columns: 1fr; grid-template-areas: "id" "meta" "tags" "foot"; }
  .expand-icon { display: none; }
  .order-detail dl { grid-template-columns: 1fr 1fr; }
  .report-summary { grid-template-columns: 1fr; }
}
</style>
