<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">航前管理 / 问题处置</span>
        <h1>航前健康问题详情</h1>
        <p>查看拦截问题基本信息、关联设备/物资/证书数据，发起紧急工单、物资调拨或豁免审批，跟踪处置进度。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="goBack">返回看板</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无拦截问题</h2>
      <p>{{ emptyMessage }}</p>
      <button type="button" @click="goBack">返回看板</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '问题数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 问题选择条 -->
      <article class="panel selector-panel">
        <div class="panel-title">
          <h2>拦截问题列表</h2>
          <span>{{ issues.length }} 项</span>
        </div>
        <div class="issue-tabs">
          <button
            v-for="issue in issues"
            :key="issue.issueId"
            type="button"
            :class="{ selected: selected?.issueId === issue.issueId }"
            @click="selectIssue(issue)"
          >
            <span class="sev-dot" :class="sevClass(issue.severity)"></span>
            <span class="tab-title">{{ issue.title }}</span>
            <StatusBadge :label="issue.status" />
          </button>
        </div>
      </article>

      <template v-if="selected">
        <!-- 问题基本信息 -->
        <article class="panel">
          <div class="panel-title">
            <h2>问题基本信息</h2>
            <StatusBadge :label="selected.status" />
          </div>
          <div class="info-grid">
            <div><dt>问题编号</dt><dd>{{ selected.issueId }}</dd></div>
            <div><dt>分类</dt><dd>{{ selected.category }}</dd></div>
            <div><dt>严重程度</dt><dd><span class="sev-badge" :class="sevClass(selected.severity)">{{ selected.severity }}</span></dd></div>
            <div><dt>到期日期</dt><dd>{{ selected.expireDate }}</dd></div>
            <div class="wide"><dt>标题</dt><dd>{{ selected.title }}</dd></div>
            <div class="wide"><dt>关联对象</dt><dd>{{ selected.relatedObject }}</dd></div>
            <div class="wide"><dt>问题描述</dt><dd>{{ selected.description }}</dd></div>
          </div>
        </article>

        <!-- 关联数据三栏 -->
        <article class="panel">
          <div class="panel-title">
            <h2>关联数据</h2>
            <span>设备 / 物资 / 证书</span>
          </div>
          <div class="link-grid">
            <div class="link-card" :class="{ empty: !selected.linkedWorkOrderId }">
              <div class="link-head"><span class="link-icon">🔧</span><strong>关联工单</strong></div>
              <p v-if="selected.linkedWorkOrderId">{{ selected.linkedWorkOrder }} · {{ selected.linkedWorkOrderStatus }}</p>
              <p v-else class="muted">无关联工单</p>
              <button v-if="selected.linkedWorkOrderId" type="button" @click="viewWorkOrder">查看工单</button>
            </div>
            <div class="link-card" :class="{ empty: !selected.linkedMaterial }">
              <div class="link-head"><span class="link-icon">📦</span><strong>关联物资</strong></div>
              <p v-if="selected.linkedMaterial">{{ selected.linkedMaterial }}</p>
              <p v-else class="muted">无关联物资</p>
              <button v-if="selected.linkedMaterial" type="button" @click="viewMaterial">查看物资</button>
            </div>
            <div class="link-card" :class="{ empty: !selected.linkedCertificate }">
              <div class="link-head"><span class="link-icon">📜</span><strong>关联证书</strong></div>
              <p v-if="selected.linkedCertificate">{{ selected.linkedCertificate }}</p>
              <p v-else class="muted">无关联证书</p>
              <button v-if="selected.linkedCertificate" type="button" @click="viewCertificate">查看证书</button>
            </div>
          </div>
        </article>

        <!-- 处置操作 -->
        <article class="panel">
          <div class="panel-title">
            <h2>处置操作</h2>
            <span>
              <template v-if="selected.exemptionStatus === '已批准'">豁免通过·已闭环</template>
              <template v-else-if="selected.exemptionStatus === '已驳回'">豁免已驳回</template>
              <template v-else-if="selected.exemptionStatus">豁免待审批</template>
              <template v-else-if="isClosed">已闭环</template>
              <template v-else-if="selected.linkedWorkOrderId">工单处置中</template>
              <template v-else>选择处置方式</template>
            </span>
          </div>
          <p v-if="lastFlow && !selected.exemptionStatus" class="flow-tip">已创建 {{ lastFlow.action }} 流程：{{ lastFlow.flowId }}</p>

          <!-- 豁免审批：进行中 -->
          <template v-if="selected.exemptionStatus && !['已批准', '已驳回'].includes(selected.exemptionStatus)">
            <div class="exemption-area">
              <p class="status-tip">已提交豁免申请 <b>{{ selected.exemptionFlowId }}</b>，理由：{{ selected.exemptionReason }}；有效期至 {{ selected.exemptionValidUntil }}。</p>
              <ol class="exempt-steps">
                <li v-for="step in EXEMPTION_STEPS" :key="step" :class="{ done: isExemptionStepDone(step), current: selected.exemptionStatus === step }">{{ step }}</li>
              </ol>
              <div class="exemption-actions">
                <button type="button" class="primary" @click="advanceExemption" :disabled="exemptBusy">推进下一审批节点</button>
                <button type="button" class="danger" @click="rejectExemption" :disabled="exemptBusy">驳回</button>
              </div>
            </div>
          </template>

          <!-- 豁免审批：已批准 -->
          <template v-else-if="selected.exemptionStatus === '已批准'">
            <div class="reinspection-area">
              <p class="status-tip">豁免申请 <b>{{ selected.exemptionFlowId }}</b> 已批准（{{ selected.exemptionApprovedAt }}），问题闭环放行。</p>
              <p class="status-tip">处置进度 100%，可直接下发调度指令。</p>
            </div>
          </template>

          <!-- 豁免审批：已驳回 -->
          <template v-else-if="selected.exemptionStatus === '已驳回'">
            <div class="linked-workorder-area">
              <p class="status-tip">豁免申请 <b>{{ selected.exemptionFlowId }}</b> 已驳回：{{ selected.rejectReason }}。请选择其他处置方式。</p>
              <button type="button" @click="resetExemption">重新选择处置方式</button>
            </div>
          </template>

          <template v-else-if="!selected.linkedWorkOrderId">
            <div class="action-cards">
              <button type="button" class="action-card danger" @click="openAction('紧急工单')">
                <strong>发起紧急工单</strong>
                <span>立即创建故障维修工单并指派执行人</span>
              </button>
              <button type="button" class="action-card warn" @click="openAction('物资调拨')">
                <strong>物资调拨</strong>
                <span>从其他船舶或仓库调拨备件物资</span>
              </button>
              <button type="button" class="action-card primary" @click="openExemptionForm">
                <strong>申请豁免审批</strong>
                <span>申请临时豁免并承诺后续整改</span>
              </button>
            </div>
          </template>

          <template v-else-if="canReinspect">
            <div class="reinspection-area">
              <p class="status-tip">关联工单 <b>{{ selected.linkedWorkOrder }}</b> 已闭环，待复检确认。</p>
              <button type="button" class="primary" @click="openReinspectConfirm">发起复检</button>
            </div>
          </template>

          <template v-else-if="selected.linkedWorkOrderStatus === '已闭环'">
            <p class="status-tip">已复检通过，问题闭环。</p>
          </template>

          <template v-else>
            <div class="linked-workorder-area">
              <p class="status-tip">关联工单 <b>{{ selected.linkedWorkOrder }}</b> 当前状态：<b>{{ selected.linkedWorkOrderStatus }}</b>，处置完成后可发起复检。</p>
              <button type="button" @click="viewWorkOrder">查看工单</button>
            </div>
          </template>
        </article>

        <!-- 处置进度 -->
        <article class="panel">
          <div class="panel-title">
            <h2>处置进度</h2>
            <span>{{ displayProgress }}%</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar"><i :style="{ width: `${displayProgress}%` }"></i></div>
            <b>{{ displayProgress }}%</b>
          </div>
          <ol class="step-list">
            <li :class="{ done: true }">
              <span class="step-dot"></span>
              <div><strong>问题识别</strong><small>航前检查发现并登记</small></div>
            </li>
            <li :class="{ done: displayProgress > 0 }">
              <span class="step-dot"></span>
              <div><strong>处置方案确定</strong><small>{{ displayProgress > 0 ? '已确定处置方案' : '待确定处置方案' }}</small></div>
            </li>
            <li :class="{ done: displayProgress >= 60 || isFinalStepDone }">
              <span class="step-dot"></span>
              <div><strong>处置执行中</strong><small>{{ (displayProgress >= 60 || isFinalStepDone) ? '正在执行处置' : '等待执行' }}</small></div>
            </li>
            <li :class="{ done: isFinalStepDone }">
              <span class="step-dot"></span>
              <div><strong>{{ finalStepLabel }}</strong><small>{{ isFinalStepDone ? finalStepDoneText : finalStepPendingText }}</small></div>
            </li>
          </ol>
        </article>
      </template>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="doAction"
    />

    <ExemptionFormDialog
      :open="exemptionFormOpen"
      title="申请豁免审批"
      :message="`请填写对问题 ${selected?.issueId}（${selected?.title}）的豁免理由及有效期，提交后进入审批链路。`"
      @cancel="exemptionFormOpen = false"
      @confirm="submitExemptionForm"
    />
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import ExemptionFormDialog from '@/components/ExemptionFormDialog.vue'
import { advanceExemptionApproval, createVoyageHealthIssueDisposal, fetchIssueLinkedWorkOrder, fetchVoyageHealthIssues, reinspectIssue, submitAction } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const issues = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const selected = ref(null)

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref('')
const lastFlow = ref(null)
const linkedWorkOrder = ref(null)
const exemptionFormOpen = ref(false)
const exemptBusy = ref(false)
const EXEMPTION_STEPS = ['待审批', '机务评估中', '船级社备案中', '已批准']
const routeContext = computed(() => navigation?.routeContext?.value || {})

const canReinspect = computed(() => {
  if (!selected.value) return false
  return selected.value.linkedWorkOrderStatus === '已闭环' && selected.value.reinspectionStatus !== '复检通过'
})
const isClosed = computed(() => selected.value?.status === '已闭环')
const isExemptionClosed = computed(() => {
  return !!selected.value?.exemptionStatus && ['已批准'].includes(selected.value.exemptionStatus)
})
const isFinalStepDone = computed(() => isClosed.value || isExemptionClosed.value)
const displayProgress = computed(() => {
  if (isFinalStepDone.value) return 100
  if (selected.value?.exemptionStatus) return Math.max(selected.value.disposalProgress ?? 0, 30)
  return selected.value?.disposalProgress ?? 0
})
const finalStepLabel = computed(() => isExemptionClosed.value ? '豁免放行' : '复检通过')
const finalStepDoneText = computed(() => isExemptionClosed.value ? '豁免审批通过，已闭环放行' : '已复检通过')
const finalStepPendingText = computed(() => '待复检')
const emptyMessage = computed(() =>
  routeContext.value.checkId
    ? '当前航前检查无拦截问题需要处置。'
    : '请先在健康校验看板的问题清单中选择一条不通过项。',
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const data = await fetchVoyageHealthIssues()
    issues.value = routeContext.value.checkId
      ? data.filter((issue) => issue.checkId === routeContext.value.checkId)
      : []
    selected.value = routeContext.value.issueId
      ? issues.value.find((issue) => issue.issueId === routeContext.value.issueId) || issues.value[0] || null
      : issues.value[0] || null
    if (selected.value) {
      linkedWorkOrder.value = await fetchIssueLinkedWorkOrder(selected.value.issueId)
    }
    uiState.value = issues.value.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

async function selectIssue(issue) {
  selected.value = issue
  linkedWorkOrder.value = await fetchIssueLinkedWorkOrder(issue.issueId)
}

function sevClass(sev) {
  if (sev === '高') return 'danger'
  if (sev === '中') return 'warn'
  return 'pending'
}

function openAction(action) {
  pendingAction.value = action
  confirmTitle.value = `${action}确认`
  confirmMessage.value = `确认对问题 ${selected.value?.issueId}（${selected.value?.title}）发起${action}？将创建对应流程单据。`
  confirmOpen.value = true
}

// 豁免审批：弹出表单
function openExemptionForm() {
  exemptionFormOpen.value = true
}

async function submitExemptionForm(payload) {
  if (!selected.value) return
  try {
    lastFlow.value = await createVoyageHealthIssueDisposal({
      issueId: selected.value.issueId,
      checkId: selected.value.checkId,
      action: '豁免审批',
      reason: payload.reason,
      validUntil: payload.validUntil,
    })
    selected.value.exemptionStatus = '待审批'
    selected.value.exemptionReason = payload.reason
    selected.value.exemptionValidUntil = payload.validUntil
    selected.value.exemptionFlowId = lastFlow.value.flowId
    selected.value.status = '豁免待审批'
    selected.value.disposalProgress = 30
    exemptionFormOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message || '豁免申请提交失败'
  }
}

function isExemptionStepDone(step) {
  const cur = selected.value?.exemptionStatus
  if (!cur) return false
  if (step === '已批准') return cur === '已批准'
  return EXEMPTION_STEPS.indexOf(step) < EXEMPTION_STEPS.indexOf(cur)
}

async function advanceExemption() {
  if (!selected.value) return
  exemptBusy.value = true
  try {
    const issue = await advanceExemptionApproval(selected.value.issueId, { approve: true })
    Object.assign(selected.value, issue)
    if (issue.exemptionStatus === '已批准') {
      selected.value.disposalProgress = 100
      lastFlow.value = null
    }
  } catch (e) {
    errorMsg.value = e?.message || '审批推进失败'
  } finally {
    exemptBusy.value = false
  }
}

async function rejectExemption() {
  if (!selected.value) return
  exemptBusy.value = true
  try {
    const issue = await advanceExemptionApproval(selected.value.issueId, { approve: false, rejectReason: '机务主管评估后驳回' })
    Object.assign(selected.value, issue)
  } catch (e) {
    errorMsg.value = e?.message || '审批驳回失败'
  } finally {
    exemptBusy.value = false
  }
}

function resetExemption() {
  if (!selected.value) return
  selected.value.exemptionStatus = null
  selected.value.exemptionReason = ''
  selected.value.exemptionValidUntil = ''
  selected.value.exemptionFlowId = null
  selected.value.status = '处置中'
  selected.value.disposalProgress = 0
  lastFlow.value = null
}

async function doAction() {
  try {
    if (pendingAction.value === '复检') {
      await doReinspect()
      confirmOpen.value = false
      return
    }
    if (['紧急工单', '物资调拨', '豁免审批'].includes(pendingAction.value)) {
      lastFlow.value = await createVoyageHealthIssueDisposal({
        issueId: selected.value?.issueId,
        checkId: selected.value?.checkId,
        action: pendingAction.value,
      })
    } else {
      await submitAction(pendingAction.value, { issueId: selected.value?.issueId })
      lastFlow.value = null
    }
    if (selected.value && lastFlow.value) {
      selected.value.status = lastFlow.value.status || '处置中'
      selected.value.disposalProgress = lastFlow.value.disposalProgress || selected.value.disposalProgress
      linkedWorkOrder.value = await fetchIssueLinkedWorkOrder(selected.value.issueId)
    }
    confirmOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
}

function viewWorkOrder() {
  if (!selected.value?.linkedWorkOrderId) return
  navigation?.navigateTo?.('WorkOrderAuditDetail', {
    workOrderId: selected.value.linkedWorkOrderId,
    from: 'VoyageHealthIssueDetail',
  })
}
function viewMaterial() { openAction('查看物资') }
function viewCertificate() { openAction('查看证书') }

async function doReinspect() {
  if (!selected.value) return
  try {
    await reinspectIssue(selected.value.issueId)
    selected.value.reinspectionStatus = '复检通过'
    selected.value.disposalProgress = 100
    selected.value.status = '已闭环'
    linkedWorkOrder.value = await fetchIssueLinkedWorkOrder(selected.value.issueId)
    lastFlow.value = { action: '复检', flowId: 'REINSPECT-' + selected.value.issueId }
  } catch (e) {
    errorMsg.value = e?.message || '复检失败'
    throw e
  }
}

function openReinspectConfirm() {
  pendingAction.value = '复检'
  confirmTitle.value = '复检确认'
  confirmMessage.value = `确认对问题 ${selected.value?.issueId}（${selected.value?.title}）执行复检？复检通过后问题将闭环。`
  confirmOpen.value = true
}
function goBack() {
  navigation?.navigateTo?.('VoyageHealthDashboard', {
    checkId: selected.value?.checkId || routeContext.value.checkId,
  })
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; min-width: 0; max-width: 100%; overflow-x: hidden; }
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
.skeleton { grid-template-columns: 1fr 1fr; padding: 24px; }
.skeleton span { height: 180px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.selector-panel .issue-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
.selector-panel .issue-tabs::-webkit-scrollbar { display: none; }
.issue-tabs button { display: flex; align-items: center; gap: 8px; white-space: nowrap; flex-shrink: 0; }
.issue-tabs button.selected { border-color: #1e6fd9; background: #edf5ff; color: #1e6fd9; }
.sev-dot { width: 8px; height: 8px; border-radius: 50%; background: #64748b; flex-shrink: 0; }
.sev-dot.danger { background: #b4232d; }
.sev-dot.warn { background: #b8860b; }
.sev-dot.pending { background: #64748b; }
.tab-title { max-width: 200px; overflow: hidden; text-overflow: ellipsis; }

.info-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.info-grid > div { display: grid; gap: 4px; border-bottom: 1px solid #e7edf4; padding-bottom: 8px; }
.info-grid > div.wide { grid-column: 1 / -1; }
.info-grid dt { color: #64748b; font-size: 12px; font-weight: 800; }
.info-grid dd { margin: 0; font-weight: 800; color: #172033; font-size: 14px; }
.sev-badge { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; }
.sev-badge.danger { color: #b4232d; background: #ffe1e3; }
.sev-badge.warn { color: #8a5a00; background: #fff2cc; }
.sev-badge.pending { color: #53657c; background: #e7edf4; }

.link-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.link-card { display: grid; gap: 8px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 14px; background: #f8fbfe; }
.link-card.empty { opacity: .7; background: #fafbfc; }
.link-head { display: flex; align-items: center; gap: 8px; }
.link-icon { font-size: 18px; }
.link-card p { margin: 0; color: #172033; font-weight: 700; word-break: break-all; }
.link-card .muted { color: #8b9aab; font-weight: 600; }
.link-card button { justify-self: start; font-size: 12px; padding: 5px 10px; }

.action-cards { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.flow-tip { margin: 0 0 12px; color: #11734d; font-size: 12px; font-weight: 900; }
.action-card { display: grid; gap: 6px; text-align: left; padding: 16px; border-radius: 8px; border: 1px solid; cursor: pointer; font: inherit; }
.action-card strong { font-size: 15px; }
.action-card span { font-size: 12px; color: #53657c; font-weight: 600; }
.action-card.danger { border-color: #f3c2c6; background: #fff5f6; color: #b4232d; }
.action-card.danger strong { color: #b4232d; }
.action-card.warn { border-color: #f0e3b8; background: #fff9e8; color: #8a5a00; }
.action-card.warn strong { color: #8a5a00; }
.action-card.primary { border-color: #1e6fd9; background: #edf5ff; color: #1e6fd9; }
.action-card.primary strong { color: #1e6fd9; }

.progress-wrap { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; }
.progress-bar { flex: 1; height: 10px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #1e6fd9; border-radius: 999px; transition: width .3s; }
.progress-wrap b { color: #1e6fd9; font-size: 16px; }

.step-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.step-list li { position: relative; display: flex; gap: 12px; align-items: flex-start; padding-left: 0; }
.step-dot { width: 14px; height: 14px; border-radius: 50%; background: #e7edf4; border: 2px solid #cbd7e4; flex-shrink: 0; margin-top: 3px; }
.step-list li.done .step-dot { background: #1e6fd9; border-color: #1e6fd9; }
.step-list li:not(:last-child):before { content: ""; position: absolute; left: 6px; top: 18px; bottom: -18px; width: 2px; background: #e2eaf3; }
.step-list li.done:not(:last-child):before { background: #1e6fd9; }
.step-list strong { display: block; font-size: 13px; }
.step-list small { color: #64748b; font-size: 11px; }
.muted { color: #8b9aab; }
.reinspection-area { display: grid; gap: 12px; padding: 12px; border: 1px dashed #1e6fd9; border-radius: 8px; background: #f5f9ff; }
.exemption-area { display: grid; gap: 14px; padding: 14px; border: 1px solid #1e6fd9; border-radius: 8px; background: #f5f9ff; }
.exempt-steps { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.exempt-steps li { font-size: 12px; font-weight: 800; padding: 6px 12px; border-radius: 999px; border: 1px solid #cbd7e4; background: #fff; color: #64748b; }
.exempt-steps li.done { color: #1e6fd9; border-color: #1e6fd9; background: #edf5ff; }
.exempt-steps li.current { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
.exemption-actions { display: flex; gap: 10px; flex-wrap: wrap; }
button.danger { color: #fff; border-color: #b4232d; background: #b4232d; }
button.primary:disabled, button.danger:disabled { opacity: .5; cursor: not-allowed; }
.linked-workorder-area { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; border: 1px solid #d9e4ef; border-radius: 8px; background: #f8fbfe; }
.status-tip { margin: 0; color: #53657c; font-size: 13px; }
.status-tip b { color: #172033; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .info-grid { grid-template-columns: 1fr 1fr; }
  .link-grid, .action-cards { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .info-grid { grid-template-columns: 1fr; }
}
</style>
