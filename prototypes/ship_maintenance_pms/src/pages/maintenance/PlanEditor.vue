<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">运维管理 / 计划编辑</span>
        <h1>{{ pageTitle }}</h1>
        <p>{{ pageDesc }}</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="goBack">返回工作台</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '设备树或计划数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="editor-layout">
        <!-- 左侧设备选择 -->
        <article class="panel tree-panel">
          <div class="panel-title">
            <h2>选择设备</h2>
            <span>{{ selectedNode ? selectedNode.label : '未选择' }}</span>
          </div>
          <AssetTree
            :nodes="tree"
            :selected-id="form.equipmentId"
            :filter="treeFilter"
            :loading="false"
            :error="false"
            @node-click="onNodeClick"
            @filter-change="(v) => (treeFilter = v)"
          />
        </article>

        <!-- 中间参数表单 -->
        <article class="panel form-panel">
          <div class="panel-title">
            <h2>计划参数</h2>
            <span>带 * 为必填</span>
          </div>
          <div class="form-grid">
            <label>
              <span>计划类型 *</span>
              <select v-model="form.planType" :disabled="readOnly">
                <option value="运行小时">运行小时</option>
                <option value="日历周期">日历周期</option>
                <option value="工况触发">工况触发</option>
              </select>
            </label>
            <label>
              <span>周期数值 *</span>
              <input v-model.number="form.cycleValue" type="number" min="1" placeholder="如 500" :disabled="readOnly" />
            </label>
            <label>
              <span>周期单位 *</span>
              <select v-model="form.cycleUnit" :disabled="readOnly">
                <option value="小时">小时</option>
                <option value="月">月</option>
                <option value="次/航次">次/航次</option>
                <option value="天">天</option>
              </select>
            </label>
            <label>
              <span>预警天数 *</span>
              <input v-model.number="form.advanceWarningDays" type="number" min="0" placeholder="如 15" :disabled="readOnly" />
            </label>
            <label>
              <span>优先级 *</span>
              <select v-model="form.priority" :disabled="readOnly">
                <option value="高">高</option>
                <option value="中">中</option>
                <option value="低">低</option>
              </select>
            </label>
            <label>
              <span>生效日期 *</span>
              <input v-model="form.startDate" type="date" :disabled="readOnly" />
            </label>
            <label class="wide">
              <span>工单模板 *</span>
              <select v-model="form.workOrderTemplate" :disabled="readOnly">
                <option value="">请选择工单模板</option>
                <option>主机燃油泵月度保养模板</option>
                <option>应急发电机季度试车模板</option>
                <option>主机气缸大修模板</option>
                <option>舵机液压站保养模板</option>
                <option>消防泵工况检查模板</option>
              </select>
            </label>
          </div>
        </article>

        <!-- 右侧冲突检测 + 提交 -->
        <div class="side-stack">
          <article class="panel conflict-panel">
            <div class="panel-title">
              <h2>冲突检测</h2>
            <button type="button" :disabled="!form.equipmentId || conflictChecking" @click="detectConflict">
                {{ conflictChecking ? '检测中…' : '检测冲突' }}
              </button>
            </div>
            <div v-if="!conflictChecked" class="empty-inline">点击"检测冲突"查看与现有计划的冲突。</div>
            <div v-else-if="!conflicts.length" class="conflict-ok">
              <span class="ok-icon">✓</span>
              <div>
                <strong>未检测到冲突</strong>
                <p>该设备现有计划与新计划无时间/资源冲突。</p>
              </div>
            </div>
            <ul v-else class="conflict-list">
              <li v-for="c in conflicts" :key="c.id" class="conflict-item">
                <div class="conflict-head">
                  <strong>{{ c.equipmentName }}</strong>
                  <StatusBadge :label="c.status" />
                </div>
                <p>{{ c.id }} · {{ c.planType }} {{ c.cycleValue }}{{ c.cycleUnit }} · 下次到期 {{ c.nextDue }}</p>
              </li>
            </ul>
          </article>

          <article class="panel submit-panel">
            <div class="panel-title">
              <h2>提交审核</h2>
            </div>
            <label class="textarea-label">
              <span>提交说明 *</span>
              <textarea v-model="form.submitComment" rows="4" placeholder="说明本次计划设定依据、调整原因或注意事项" :disabled="readOnly"></textarea>
            </label>
            <button v-if="!readOnly" type="button" class="primary full" :disabled="!canSubmit" @click="openSubmit">提交审核</button>
            <button v-else type="button" class="full" @click="goBack">返回工作台</button>
            <p class="hint">提交后将生成审批单进入机务主任审核流程。</p>
          </article>
        </div>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      title="提交计划审核"
      :message="`确认提交${selectedNode ? '「' + selectedNode.label + '」' : ''}的维保计划审核申请？提交后进入审批流程。`"
      @cancel="confirmOpen = false"
      @confirm="doSubmit"
    />
  </section>
</template>

<script setup>
import { computed, inject, onMounted, reactive, ref } from 'vue'
import AssetTree from '@/components/AssetTree.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import {
  createMaintenancePlan,
  fetchEquipmentTree,
  fetchMaintenancePlans,
  validateMaintenancePlanConflicts,
} from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const tree = ref([])
const plans = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const treeFilter = ref('')

const form = reactive({
  equipmentId: null,
  planType: '运行小时',
  cycleValue: 500,
  cycleUnit: '小时',
  advanceWarningDays: 15,
  priority: '中',
  startDate: new Date().toISOString().slice(0, 10),
  workOrderTemplate: '',
  submitComment: '',
})

const conflictChecked = ref(false)
const conflictChecking = ref(false)
const conflicts = ref([])

const confirmOpen = ref(false)

const routeContext = computed(() => navigation?.routeContext?.value || {})
const mode = computed(() => routeContext.value.mode || 'create')
const readOnly = computed(() => mode.value === 'view')
const editingPlan = computed(() => routeContext.value.plan || plans.value.find((p) => p.id === routeContext.value.planId) || null)
const selectedNode = computed(() => findNode(tree.value, form.equipmentId))
const pageTitle = computed(() => {
  if (readOnly.value) return '维保计划详情'
  return mode.value === 'edit' ? '调整维保计划' : '新建维保计划'
})
const pageDesc = computed(() => {
  if (readOnly.value) return '查看计划参数、设备资产和冲突检测结果，必要时返回工作台发起调整。'
  return '选择设备资产，设定计划参数与工单模板，检测与现有计划冲突并提交审核。'
})

const canSubmit = computed(
  () =>
    !readOnly.value &&
    !!form.equipmentId &&
    !!form.planType &&
    !!form.cycleValue &&
    !!form.cycleUnit &&
    form.advanceWarningDays >= 0 &&
    !!form.startDate &&
    !!form.workOrderTemplate &&
    form.submitComment.trim().length > 0,
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [t, p] = await Promise.all([fetchEquipmentTree(), fetchMaintenancePlans()])
    tree.value = t
    plans.value = p
    applyRouteContext()
    uiState.value = 'success'
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
      const f = findNode(n.children, id)
      if (f) return f
    }
  }
  return null
}

function onNodeClick(node) {
  if (readOnly.value) return
  form.equipmentId = node.id
  conflictChecked.value = false
  conflicts.value = []
}

async function detectConflict() {
  if (!form.equipmentId) return
  conflictChecking.value = true
  conflicts.value = []
  try {
    const result = await validateMaintenancePlanConflicts({
      ...form,
      planId: routeContext.value.planId,
    })
    conflicts.value = result.conflicts
    conflictChecked.value = true
  } catch (e) {
    errorMsg.value = e?.message || '冲突检测失败'
  } finally {
    conflictChecking.value = false
  }
}

function openSubmit() {
  if (!canSubmit.value) return
  confirmOpen.value = true
}

async function doSubmit() {
  try {
    if (!conflictChecked.value) await detectConflict()
    const result = await createMaintenancePlan({
      ...form,
      mode: mode.value,
      planId: routeContext.value.planId,
      before: editingPlan.value
        ? {
            planType: editingPlan.value.planType,
            cycleValue: `${editingPlan.value.cycleValue} ${editingPlan.value.cycleUnit}`,
            advanceWarningDays: editingPlan.value.advanceWarningDays,
            priority: editingPlan.value.priority,
            workOrderTemplate: form.workOrderTemplate,
          }
        : null,
      equipmentName: selectedNode.value?.label,
      conflictCount: conflicts.value.length,
    })
    sessionStorage.setItem('pms-maintenance-created-approval', JSON.stringify(result.approval))
    confirmOpen.value = false
    navigation?.navigateTo?.('PlanApproval', {
      approvalId: result.approval.id,
      approval: result.approval,
      planId: result.plan.id,
    })
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
}

function applyRouteContext() {
  const plan = editingPlan.value
  if (plan) {
    form.equipmentId = plan.equipmentId
    form.planType = plan.planType
    form.cycleValue = plan.cycleValue
    form.cycleUnit = plan.cycleUnit
    form.advanceWarningDays = plan.advanceWarningDays
    form.priority = plan.priority
    form.startDate = plan.startDate
    form.workOrderTemplate = templateForPlan(plan)
    form.submitComment = mode.value === 'edit' ? `调整 ${plan.id} 的维保周期和预警参数` : ''
  } else if (routeContext.value.equipmentId) {
    form.equipmentId = routeContext.value.equipmentId
  }
  conflictChecked.value = false
  conflicts.value = []
}

function templateForPlan(plan) {
  if (/燃油泵/.test(plan.equipmentName)) return '主机燃油泵月度保养模板'
  if (/应急发电机/.test(plan.equipmentName)) return '应急发电机季度试车模板'
  if (/气缸/.test(plan.equipmentName)) return '主机气缸大修模板'
  if (/舵机/.test(plan.equipmentName)) return '舵机液压站保养模板'
  if (/消防泵/.test(plan.equipmentName)) return '消防泵工况检查模板'
  return form.workOrderTemplate
}

function goBack() {
  navigation?.navigateTo?.('MaintenancePlanWorkbench', {
    equipmentId: form.equipmentId,
    planId: routeContext.value.planId,
  })
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button:disabled { opacity: .5; cursor: not-allowed; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button.full { width: 100%; }

.state-panel { min-height: 240px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(3, 1fr); padding: 24px; }
.skeleton span { height: 160px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.editor-layout { display: grid; grid-template-columns: 280px minmax(0, 1fr) 320px; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.tree-panel { position: sticky; top: 0; }

.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.form-grid label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.form-grid label.wide { grid-column: 1 / -1; }
.form-grid input, .form-grid select { border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; background: #fff; color: #172033; font: inherit; }

.side-stack { display: grid; gap: 16px; }

.empty-inline { padding: 18px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; }
.conflict-ok { display: flex; gap: 12px; align-items: flex-start; padding: 14px; border: 1px solid #cfe9d8; border-radius: 8px; background: #f0fbf4; }
.conflict-ok .ok-icon { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; color: #fff; background: #11734d; font-weight: 900; flex-shrink: 0; }
.conflict-ok strong { display: block; color: #11734d; }
.conflict-ok p { margin: 4px 0 0; color: #53657c; font-size: 12px; }

.conflict-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.conflict-item { border: 1px solid #f3c2c6; border-radius: 8px; padding: 12px; background: #fff5f6; }
.conflict-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; }
.conflict-item p { margin: 0; color: #53657c; font-size: 12px; }

.submit-panel .textarea-label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; margin-bottom: 12px; }
.submit-panel textarea { width: 100%; border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; resize: vertical; font: inherit; }
.hint { margin: 10px 0 0; color: #8b9aab; font-size: 12px; }

@media (max-width: 1100px) {
  .editor-layout { grid-template-columns: 1fr; }
  .tree-panel { position: static; }
}
@media (max-width: 720px) {
  .page-header { flex-direction: column; }
  .form-grid { grid-template-columns: 1fr; }
}
</style>
