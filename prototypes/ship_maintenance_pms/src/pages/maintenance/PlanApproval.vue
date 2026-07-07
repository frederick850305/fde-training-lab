<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">运维管理 / 计划审批</span>
        <h1>维保计划审批</h1>
        <p>审核待审批的维保计划变更申请，对比变更前后差异，填写审批意见并查看审核日志。</p>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无待审批申请</h2>
      <p>当前没有待审批的维保计划变更申请。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '审批数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="approval-layout">
        <!-- 左侧待审申请列表 -->
        <article class="panel list-panel">
          <div class="panel-title">
            <h2>待审申请</h2>
            <span>{{ approvals.length }} 条</span>
          </div>
          <div v-if="!approvals.length" class="empty-inline">暂无审批申请。</div>
          <ul class="approval-list">
            <li
              v-for="app in approvals"
              :key="app.id"
              :class="{ selected: selected?.id === app.id }"
              @click="selectApp(app)"
            >
              <div class="app-head">
                <strong>{{ app.id }}</strong>
                <StatusBadge :label="app.status" />
              </div>
              <div class="app-meta">
                <span>{{ app.action }} · {{ app.planId }}</span>
                <span class="muted">{{ app.applicant }}</span>
              </div>
              <p class="app-summary">{{ app.summary }}</p>
              <small class="muted">提交时间 {{ app.submitAt }} · 优先级 {{ app.priority }}</small>
            </li>
          </ul>
        </article>

        <!-- 右侧详情 -->
        <div class="detail-stack" v-if="selected">
          <!-- 变更差异对比 -->
          <article class="panel">
            <div class="panel-title">
              <h2>变更差异对比</h2>
              <span>{{ selected.action }}</span>
            </div>
            <DiffView
              :left="selected.before || {}"
              :right="selected.after || {}"
              :fields="diffFields"
              mode="side-by-side"
              left-label="变更前"
              right-label="变更后"
            />
          </article>

          <!-- 审核日志时间线 -->
          <article class="panel">
            <div class="panel-title">
              <h2>审核日志</h2>
              <span>{{ selected.history.length }} 条</span>
            </div>
            <ol class="timeline">
              <li v-for="(h, idx) in selected.history" :key="idx" :class="toneClass(h.action)">
                <div class="tl-dot"></div>
                <div class="tl-body">
                  <div class="tl-head">
                    <strong>{{ h.operator }}</strong>
                    <span class="tl-action">{{ h.action }}</span>
                  </div>
                  <small class="muted">{{ h.time }}</small>
                  <p v-if="h.comment">{{ h.comment }}</p>
                </div>
              </li>
            </ol>
          </article>

          <!-- 审批操作 -->
          <article class="panel" v-if="selected.status === '待审批'">
            <div class="panel-title">
              <h2>审批操作</h2>
              <span>审批意见必填</span>
            </div>
            <ApprovalActions
              ref="approvalRef"
              :loading="submitting"
              @approve="onApprove"
              @reject="onReject"
            />
          </article>
          <article class="panel" v-else>
            <div class="panel-title">
              <h2>审批结果</h2>
              <StatusBadge :label="selected.status" />
            </div>
            <p class="muted">该申请已处理，状态：{{ selected.status }}。如需重新审批请联系申请人修改后重新提交。</p>
          </article>
        </div>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmSubmit"
    />
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import DiffView from '@/components/DiffView.vue'
import ApprovalActions from '@/components/ApprovalActions.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchApprovals, submitApprovalAction } from '@/mock/api.js'

const navigation = inject('prototypeNavigation', null)
const approvals = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const selected = ref(null)
const approvalRef = ref(null)
const submitting = ref(false)

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingComment = ref('')
const pendingDecision = ref('')
const routeContext = computed(() => navigation?.routeContext?.value || {})

const diffFields = [
  { key: 'planType', label: '计划类型' },
  { key: 'cycleValue', label: '周期数值' },
  { key: 'advanceWarningDays', label: '预警天数' },
  { key: 'priority', label: '优先级' },
  { key: 'workOrderTemplate', label: '工单模板' },
]

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const data = await fetchApprovals()
    const generated = readGeneratedApproval()
    approvals.value = mergeApprovals(data, generated)
    selected.value = routeContext.value.approvalId
      ? approvals.value.find((item) => item.id === routeContext.value.approvalId) || approvals.value[0] || null
      : approvals.value[0] || null
    uiState.value = approvals.value.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function selectApp(app) {
  selected.value = app
  approvalRef.value?.clear()
}

function toneClass(action) {
  if (/驳回|退回/.test(action)) return 'danger'
  if (/通过/.test(action)) return 'ok'
  if (/提交/.test(action)) return 'active'
  return 'pending'
}

function onApprove(comment) {
  pendingComment.value = comment
  pendingDecision.value = '通过'
  confirmTitle.value = '审批通过确认'
  confirmMessage.value = `确认通过申请 ${selected.value?.id}？将通过并记录审批意见。`
  confirmOpen.value = true
}

function onReject(comment) {
  pendingComment.value = comment
  pendingDecision.value = '驳回'
  confirmTitle.value = '驳回申请确认'
  confirmMessage.value = `确认驳回申请 ${selected.value?.id}？将驳回并记录审批意见。`
  confirmOpen.value = true
}

async function confirmSubmit() {
  submitting.value = true
  try {
    await submitApprovalAction(selected.value?.id, {
      decision: pendingDecision.value,
      comment: pendingComment.value,
    })
    if (selected.value) {
      selected.value.status = pendingDecision.value === '通过' ? '已通过' : '已驳回'
      selected.value.history.push({
        operator: '当前用户',
        action: pendingDecision.value === '通过' ? '通过' : '驳回',
        time: new Date().toISOString().replace('T', ' ').slice(0, 16),
        comment: pendingComment.value,
      })
    }
    approvalRef.value?.clear()
    confirmOpen.value = false
  } catch (e) {
    approvalRef.value?.setError(e?.message || '提交失败')
    confirmOpen.value = false
  } finally {
    submitting.value = false
  }
}

function readGeneratedApproval() {
  if (routeContext.value.approval) return routeContext.value.approval
  try {
    return JSON.parse(sessionStorage.getItem('pms-maintenance-created-approval') || 'null')
  } catch {
    return null
  }
}

function mergeApprovals(data, generated) {
  if (!generated) return data
  return [generated, ...data.filter((item) => item.id !== generated.id)]
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

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: 320px 1fr 1fr; padding: 24px; }
.skeleton span { height: 300px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.approval-layout { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.list-panel { position: sticky; top: 0; max-height: calc(100vh - 40px); overflow-y: auto; }
.empty-inline { padding: 18px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; }
.approval-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.approval-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; cursor: pointer; transition: border-color .15s, background .15s; }
.approval-list li:hover { border-color: #9eb3ca; }
.approval-list li.selected { border-color: #1e6fd9; background: #edf5ff; }
.app-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 6px; }
.app-meta { display: flex; justify-content: space-between; gap: 8px; font-size: 12px; color: #53657c; margin-bottom: 4px; }
.muted { color: #8b9aab; }
.app-summary { margin: 4px 0; font-size: 13px; color: #172033; }
.approval-list small { font-size: 11px; }

.detail-stack { display: grid; gap: 16px; }

.timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 14px; }
.timeline li { position: relative; padding-left: 26px; }
.timeline .tl-dot { position: absolute; left: 6px; top: 4px; width: 12px; height: 12px; border-radius: 50%; background: #1e6fd9; box-shadow: 0 0 0 4px #edf5ff; }
.timeline li.ok .tl-dot { background: #11734d; box-shadow: 0 0 0 4px #dff6e8; }
.timeline li.danger .tl-dot { background: #b4232d; box-shadow: 0 0 0 4px #ffe1e3; }
.timeline li.active .tl-dot { background: #1f5fbf; box-shadow: 0 0 0 4px #e3efff; }
.timeline li:not(:last-child):before { content: ""; position: absolute; left: 11px; top: 18px; bottom: -14px; width: 2px; background: #e2eaf3; }
.tl-head { display: flex; align-items: center; gap: 10px; margin-bottom: 2px; }
.tl-action { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.tl-body p { margin: 4px 0 0; color: #53657c; font-size: 13px; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .approval-layout { grid-template-columns: 1fr; }
  .list-panel { position: static; max-height: none; }
  .skeleton { grid-template-columns: 1fr; }
}
</style>
