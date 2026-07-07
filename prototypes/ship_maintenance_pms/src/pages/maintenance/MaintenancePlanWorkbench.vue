<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">运维管理 / 维保计划</span>
        <h1>维保计划工作台</h1>
        <p>按设备资产树组织维保计划，监控生效/审核/到期/过期状态，查看维保历史并快速发起计划调整。</p>
      </div>
    </header>

    <!-- 状态：加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
      <span class="wide"></span>
    </div>

    <!-- 状态：空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无维保计划数据</h2>
      <p>当前资产树没有可显示的维保计划，可刷新数据或新增计划。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 状态：错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '设备树或计划数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- KPI 总览 -->
      <section class="kpi-grid">
        <article class="kpi-card ok">
          <strong>{{ kpi.effective }}</strong>
          <span>生效计划</span>
        </article>
        <article class="kpi-card active">
          <strong>{{ kpi.reviewing }}</strong>
          <span>审核中</span>
        </article>
        <article class="kpi-card warn">
          <strong>{{ kpi.expiring }}</strong>
          <span>即将到期</span>
        </article>
        <article class="kpi-card danger">
          <strong>{{ kpi.expired }}</strong>
          <span>已过期</span>
        </article>
      </section>

      <section class="status-filter" aria-label="维保计划状态筛选">
        <button
          v-for="item in statusFilters"
          :key="item"
          type="button"
          :class="{ active: statusFilter === item }"
          @click="statusFilter = item"
        >
          {{ item }}
        </button>
      </section>

      <section class="workbench-layout">
        <!-- 左侧资产树 -->
        <article class="panel tree-panel">
          <div class="panel-title">
            <h2>设备资产树</h2>
            <span>按系统/设备</span>
          </div>
          <AssetTree
            :nodes="tree"
            :selected-id="selectedNodeId"
            :filter="treeFilter"
            :loading="false"
            :error="false"
            @node-click="onNodeClick"
            @filter-change="(v) => (treeFilter = v)"
          />
        </article>

        <!-- 右侧主体 -->
        <div class="main-stack">
          <!-- 选中设备详情 + 计划卡片 -->
          <article class="panel">
            <div class="panel-title">
              <h2>{{ selectedNode ? selectedNode.label : '全部设备' }} 维保计划</h2>
              <span>{{ filteredPlans.length }} 条</span>
            </div>

            <div v-if="!filteredPlans.length" class="empty-inline">
              该设备暂无维保计划，点击右上角"新增计划"创建。
            </div>

            <div v-else class="plan-grid">
              <div
                v-for="plan in filteredPlans"
                :key="plan.id"
                class="plan-card"
                @click="selectPlan(plan)"
              >
                <div class="plan-card-head">
                  <strong>{{ plan.equipmentName }}</strong>
                  <StatusBadge :label="plan.status" />
                </div>
                <div class="plan-card-meta">
                  <span>{{ plan.ship }}</span>
                  <span>{{ plan.planType }} · {{ plan.cycleValue }} {{ plan.cycleUnit }}</span>
                </div>
                <div class="plan-progress">
                  <span>执行进度</span>
                  <b>{{ plan.progress }}%</b>
                  <i :style="{ width: `${plan.progress}%` }"></i>
                </div>
                <div class="plan-card-foot">
                  <small>下次到期：{{ plan.nextDue }}</small>
                  <small>上次完成：{{ plan.lastDone }}</small>
                </div>
              </div>
            </div>
          </article>

          <!-- 维保历史时间线 -->
          <article class="panel">
            <div class="panel-title">
              <h2>维保历史（已完成工单时间线）</h2>
              <span>{{ historyPlans.length }} 条已闭环/已生效记录</span>
            </div>
            <ol v-if="historyPlans.length" class="timeline">
              <li v-for="plan in historyPlans" :key="plan.id" :class="toneClass(plan.status)">
                <div class="tl-dot"></div>
                <div class="tl-body">
                  <div class="tl-head">
                    <strong>{{ plan.equipmentName }}</strong>
                    <StatusBadge :label="plan.status" />
                  </div>
                  <p>{{ plan.ship }} · {{ plan.planType }} {{ plan.cycleValue }}{{ plan.cycleUnit }} · 上次完成 {{ plan.lastDone }}</p>
                  <small>计划编号 {{ plan.id }} · 下次到期 {{ plan.nextDue }}</small>
                </div>
              </li>
            </ol>
            <div v-else class="empty-inline">暂无已完成维保历史。</div>
          </article>

          <!-- 快速操作 -->
          <article class="panel actions-panel">
            <div class="panel-title">
              <h2>快速操作</h2>
            </div>
            <div class="quick-actions">
              <button type="button" class="primary" @click="quickAdd">新增计划</button>
              <button type="button" :disabled="!selectedPlan" @click="viewDetail">查看详情</button>
              <button type="button" :disabled="!selectedPlan" @click="adjustPlan">调整周期</button>
              <button type="button" :disabled="!selectedPlan" @click="generateWorkOrder">生成工单</button>
            </div>
            <p v-if="selectedPlan" class="selected-tip">
              当前选中：<b>{{ selectedPlan.id }}</b> · {{ selectedPlan.equipmentName }} · {{ selectedPlan.ship }}
            </p>
          </article>
        </div>
      </section>
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
import { computed, inject, onMounted, ref } from 'vue'
import AssetTree from '@/components/AssetTree.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchEquipmentTree, fetchMaintenancePlans, submitAction } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const tree = ref([])
const plans = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const selectedNodeId = ref(null)
const treeFilter = ref('')
const selectedPlan = ref(null)
const statusFilters = ['全部', '已生效', '审核中', '即将到期', '已过期']
const statusFilter = ref('全部')

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref('')

const selectedNode = computed(() => findNode(tree.value, selectedNodeId.value))

const kpi = computed(() => ({
  effective: plans.value.filter((p) => p.status === '已生效').length,
  reviewing: plans.value.filter((p) => p.status === '审核中').length,
  expiring: plans.value.filter((p) => p.status === '即将到期').length,
  expired: plans.value.filter((p) => p.status === '已过期').length,
}))

const filteredPlans = computed(() => {
  const byDevice = selectedNodeId.value
    ? plans.value.filter((p) => p.equipmentId === selectedNodeId.value)
    : plans.value
  if (statusFilter.value === '全部') return byDevice
  return byDevice.filter((p) => p.status === statusFilter.value)
})

const historyPlans = computed(() =>
  plans.value.filter((p) => p.status === '已生效' || p.status === '已闭环'),
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [t, p] = await Promise.all([
      fetchEquipmentTree(),
      fetchMaintenancePlans(),
    ])
    tree.value = t
    plans.value = p
    const context = navigation?.routeContext?.value || {}
    selectedNodeId.value = context.equipmentId || selectedNodeId.value || null
    selectedPlan.value = context.planId
      ? p.find((plan) => plan.id === context.planId) || null
      : filteredPlans.value[0] || p[0] || null
    uiState.value = p.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function findNode(nodes, id) {
  if (!id) return null
  for (const n of nodes || []) {
    if (n.id === id) return n
    if (n.children?.length) {
      const found = findNode(n.children, id)
      if (found) return found
    }
  }
  return null
}

function onNodeClick(node) {
  selectedNodeId.value = node.id
  selectedPlan.value = filteredPlans.value[0] || null
}

function selectPlan(plan) {
  selectedPlan.value = plan
}

function toneClass(status) {
  if (/过期|异常|故障/.test(status)) return 'danger'
  if (/闭环|通过|生效|正常/.test(status)) return 'ok'
  if (/进行|审核/.test(status)) return 'active'
  return 'pending'
}

function openConfirm(title, message, action) {
  confirmTitle.value = title
  confirmMessage.value = message
  pendingAction.value = action
  confirmOpen.value = true
}

function quickAdd() {
  navigation?.navigateTo?.('PlanEditor', {
    mode: 'create',
    equipmentId: selectedNodeId.value,
    equipmentName: selectedNode.value?.label,
  })
}

function viewDetail() {
  if (!selectedPlan.value) return
  navigation?.navigateTo?.('PlanEditor', {
    mode: 'view',
    planId: selectedPlan.value.id,
    equipmentId: selectedPlan.value.equipmentId,
    plan: selectedPlan.value,
  })
}

function adjustPlan() {
  if (!selectedPlan.value) return
  navigation?.navigateTo?.('PlanEditor', {
    mode: 'edit',
    planId: selectedPlan.value.id,
    equipmentId: selectedPlan.value.equipmentId,
    plan: selectedPlan.value,
  })
}

function generateWorkOrder() {
  if (!selectedPlan.value) return
  openConfirm('生成工单', `将根据 ${selectedPlan.value.id} 生成预防性维护工单。`, '生成工单')
}

async function confirmAction() {
  try {
    await submitAction(pendingAction.value, selectedPlan.value)
    confirmOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 4px 0 0; font-size: 22px; }
.page-header p { max-width: 920px; margin: 8px 0 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; align-items: flex-start; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button:disabled { opacity: .5; cursor: not-allowed; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(4, minmax(0, 1fr)); padding: 24px; }
.skeleton span { height: 90px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.skeleton .wide { grid-column: 1 / -1; height: 200px; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.kpi-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 15px; background: #fff; border-left: 4px solid #1e6fd9; }
.kpi-card.ok { border-left-color: #11734d; }
.kpi-card.active { border-left-color: #1f5fbf; }
.kpi-card.warn { border-left-color: #b8860b; }
.kpi-card.danger { border-left-color: #b4232d; }
.kpi-card strong { display: block; color: #172033; font-size: 30px; }
.kpi-card span { color: #64748b; font-size: 12px; font-weight: 800; }

.status-filter { display: flex; gap: 8px; flex-wrap: wrap; }
.status-filter button { min-height: 34px; padding: 7px 12px; }
.status-filter button.active { color: #fff; border-color: #24415f; background: #24415f; }

.workbench-layout { display: grid; grid-template-columns: 300px minmax(0, 1fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.tree-panel { position: sticky; top: 0; }

.main-stack { display: grid; gap: 16px; }

.empty-inline { padding: 24px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; }

.plan-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 12px; }
.plan-card { display: grid; gap: 8px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 14px; background: #f8fbfe; cursor: pointer; transition: border-color .15s, box-shadow .15s; }
.plan-card:hover { border-color: #1e6fd9; box-shadow: 0 6px 18px rgba(30,111,217,.12); }
.plan-card-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.plan-card-head strong { font-size: 15px; }
.plan-card-meta { display: flex; flex-direction: column; gap: 2px; color: #64748b; font-size: 12px; }
.plan-progress { position: relative; display: grid; grid-template-columns: 1fr auto; gap: 8px; padding-bottom: 10px; color: #53657c; font-size: 12px; font-weight: 900; }
.plan-progress:before, .plan-progress i { content: ""; position: absolute; left: 0; bottom: 0; height: 6px; border-radius: 999px; }
.plan-progress:before { width: 100%; background: #e7edf4; }
.plan-progress i { background: #1e6fd9; }
.plan-card-foot { display: flex; justify-content: space-between; gap: 8px; }
.plan-card-foot small { color: #8b9aab; font-size: 11px; }

.timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.timeline li { position: relative; padding-left: 26px; }
.timeline .tl-dot { position: absolute; left: 6px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #1e6fd9; box-shadow: 0 0 0 4px #edf5ff; }
.timeline li.ok .tl-dot { background: #11734d; box-shadow: 0 0 0 4px #dff6e8; }
.timeline li.danger .tl-dot { background: #b4232d; box-shadow: 0 0 0 4px #ffe1e3; }
.timeline li.active .tl-dot { background: #1f5fbf; box-shadow: 0 0 0 4px #e3efff; }
.timeline li:not(:last-child):before { content: ""; position: absolute; left: 11px; top: 18px; bottom: -14px; width: 2px; background: #e2eaf3; }
.tl-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.tl-body p { margin: 2px 0; color: #53657c; font-size: 13px; }
.tl-body small { color: #8b9aab; }

.actions-panel .quick-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.selected-tip { margin: 12px 0 0; color: #53657c; font-size: 13px; }
.selected-tip b { color: #1e6fd9; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .workbench-layout { grid-template-columns: 1fr; }
  .tree-panel { position: static; }
}
</style>
