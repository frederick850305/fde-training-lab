<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">工单管理 / 工单审核详情</span>
        <h1>工单审核详情</h1>
        <p>查看完整报工数据（工时/物料/发现）、附件照片留痕、逐项核验步骤，执行审核通过/退回并跟踪整改。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span class="wide"></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无工单数据</h2>
      <p>当前没有可审核的工单。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '工单详情加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 工单选择条 -->
      <article class="panel selector-panel">
        <div class="panel-title">
          <h2>选择工单</h2>
          <span>{{ orders.length }} 个待审核/整改工单</span>
        </div>
        <div class="order-tabs">
          <button
            v-for="order in reviewableOrders"
            :key="order.id"
            type="button"
            :class="{ selected: selected?.id === order.id }"
            @click="selectOrder(order)"
          >
            <strong>{{ order.id }}</strong>
            <span class="muted">{{ order.equipment }}</span>
            <StatusBadge :label="order.status" />
          </button>
        </div>
      </article>

      <template v-if="selected">
        <!-- 完整报工数据 -->
        <article class="panel">
          <div class="panel-title">
            <h2>报工数据</h2>
            <span>{{ selected.id }} · {{ selected.type }}</span>
          </div>
          <div class="report-grid">
            <div class="rp-card">
              <strong>实际工时</strong>
              <big>{{ selected.reportData?.actualHours ?? '—' }}</big>
              <small>小时</small>
            </div>
            <div class="rp-card">
              <strong>物料消耗</strong>
              <big>{{ selected.reportData?.materials?.length ?? 0 }}</big>
              <small>项</small>
            </div>
            <div class="rp-card">
              <strong>附件数</strong>
              <big>{{ selected.attachments }}</big>
              <small>个</small>
            </div>
            <div class="rp-card wide">
              <strong>执行发现</strong>
              <p>{{ selected.reportData?.findings || '—' }}</p>
            </div>
          </div>

          <div v-if="selected.reportData?.materials?.length" class="materials-block">
            <h3>物料消耗明细</h3>
            <table>
              <thead>
                <tr><th>物料名称</th><th>数量</th></tr>
              </thead>
              <tbody>
                <tr v-for="(m, i) in selected.reportData.materials" :key="i">
                  <td>{{ m.name }}</td>
                  <td>{{ m.qty }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </article>

        <!-- 附件照片留痕 -->
        <article class="panel">
          <div class="panel-title">
            <h2>附件 / 照片留痕</h2>
            <span>{{ mockFiles.length }} 个附件</span>
          </div>
          <FileUploader :file-list="mockFiles" readonly @preview="previewFile" />
        </article>

        <!-- 逐项核验 -->
        <article class="panel">
          <div class="panel-title">
            <h2>逐项核验</h2>
            <span>{{ doneSteps }}/{{ steps.length }} 步已完成</span>
          </div>
          <ul class="step-checklist">
            <li v-for="step in steps" :key="step.step" :class="{ done: step.done }">
              <label>
                <input type="checkbox" :checked="step.done" :disabled="step.done" @change="toggleStep(step)" />
                <span class="check-mark"></span>
                <div class="step-content">
                  <div class="step-head">
                    <strong>步骤{{ step.step }} · {{ step.name }}</strong>
                    <span v-if="step.done" class="done-tag">已核验</span>
                    <span v-else class="pending-tag">待核验</span>
                  </div>
                  <p>{{ step.desc }}</p>
                </div>
              </label>
            </li>
          </ul>
        </article>

        <!-- 整改跟踪（退回时显示） -->
        <article v-if="selected.status === '需整改'" class="panel rectify-panel">
          <div class="panel-title">
            <h2>整改跟踪</h2>
            <StatusBadge label="需整改" />
          </div>
          <div class="rectify-info">
            <div class="rectify-requirement">
              <strong>整改要求</strong>
              <p>{{ rectifyRequirement }}</p>
            </div>
            <div class="rectify-status">
              <strong>跟踪状态</strong>
              <div class="rectify-progress">
                <div class="progress-bar"><i :style="{ width: '60%' }"></i></div>
                <b>60%</b>
              </div>
              <small class="muted">执行人已提交整改报告，等待复检</small>
            </div>
          </div>
        </article>

        <!-- 审核操作 -->
        <article class="panel">
          <div class="panel-title">
            <h2>审核操作</h2>
            <span>{{ selected.status }}</span>
          </div>
          <ApprovalActions
            ref="approvalRef"
            :loading="submitting"
            :allow-approve="selected.status !== '已闭环'"
            :allow-reject="selected.status !== '已闭环'"
            @approve="onApprove"
            @reject="onReject"
          />
        </article>
      </template>
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
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import FileUploader from '@/components/FileUploader.vue'
import ApprovalActions from '@/components/ApprovalActions.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchWorkOrders, fetchWorkOrderSteps, submitAction } from '@/mock/api.js'

const orders = ref([])
const steps = ref([])
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

const reviewableOrders = computed(() => orders.value.filter((o) => o.status !== '已闭环'))
const doneSteps = computed(() => steps.value.filter((s) => s.done).length)

const mockFiles = computed(() => {
  if (!selected.value) return []
  const count = selected.value.attachments || 0
  return Array.from({ length: count }, (_, i) => ({
    id: `ATT-${selected.value.id}-${i + 1}`,
    name: `${selected.value.equipment.split(' ')[0]}_现场照片_${i + 1}.jpg`,
    type: 'image',
    size: 1024 * 1024 * (1 + i * 0.3),
    uploadedAt: selected.value.submittedAt,
  }))
})

const rectifyRequirement = computed(() => {
  if (selected.value?.status === '需整改') {
    return `${selected.value.equipment} 报工发现的问题未完全解决，需执行人复测并补充证据后重新提交审核。具体要求：${selected.value.reportData?.findings || ''}`
  }
  return ''
})

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [o, s] = await Promise.all([fetchWorkOrders(), fetchWorkOrderSteps()])
    orders.value = o
    steps.value = s.map((step) => ({ ...step }))
    selected.value = o.find((x) => x.status !== '已闭环') || o[0] || null
    uiState.value = o.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function selectOrder(order) {
  selected.value = order
  approvalRef.value?.clear()
}

function toggleStep(step) {
  step.done = !step.done
}

function previewFile(file) {
  // 原型：模拟预览
}

function onApprove(comment) {
  pendingComment.value = comment
  pendingDecision.value = '通过'
  confirmTitle.value = '审核通过确认'
  confirmMessage.value = `确认通过工单 ${selected.value?.id} 的报工审核？工单将闭环并归档。`
  confirmOpen.value = true
}

function onReject(comment) {
  pendingComment.value = comment
  pendingDecision.value = '退回'
  confirmTitle.value = '退回整改确认'
  confirmMessage.value = `确认退回工单 ${selected.value?.id}？将进入整改流程，执行人需按要求整改后重新提交。`
  confirmOpen.value = true
}

async function confirmSubmit() {
  submitting.value = true
  try {
    await submitAction(pendingDecision.value === '通过' ? '工单审核通过' : '工单退回整改', {
      id: selected.value?.id,
      comment: pendingComment.value,
    })
    if (selected.value) {
      selected.value.status = pendingDecision.value === '通过' ? '已闭环' : '需整改'
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
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }

.state-panel { min-height: 240px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(3, 1fr); padding: 24px; }
.skeleton span { height: 140px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.skeleton .wide { grid-column: 1 / -1; height: 80px; }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.selector-panel .order-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; }
.order-tabs button { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; white-space: nowrap; flex-shrink: 0; padding: 10px 14px; text-align: left; }
.order-tabs button.selected { border-color: #1e6fd9; background: #edf5ff; }
.order-tabs strong { font-size: 13px; }
.muted { color: #8b9aab; font-size: 11px; }

.report-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.rp-card { border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #f8fbfe; }
.rp-card.wide { grid-column: 1 / -1; }
.rp-card strong { display: block; color: #64748b; font-size: 11px; font-weight: 800; margin-bottom: 6px; }
.rp-card big { font-size: 28px; color: #1e6fd9; font-weight: 900; }
.rp-card small { color: #8b9aab; font-size: 11px; margin-left: 4px; }
.rp-card.wide strong { margin-bottom: 4px; }
.rp-card.wide p { margin: 0; color: #172033; font-size: 13px; line-height: 1.55; }

.materials-block { margin-top: 16px; }
.materials-block h3 { margin: 0 0 8px; font-size: 14px; color: #172033; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 10px 12px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; font-weight: 900; }

.step-checklist { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.step-checklist li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #f8fbfe; transition: border-color .15s; }
.step-checklist li.done { border-color: #cfe9d8; background: #f0fbf4; }
.step-checklist label { display: flex; gap: 12px; align-items: flex-start; cursor: pointer; }
.step-checklist input { position: absolute; opacity: 0; pointer-events: none; }
.check-mark { width: 20px; height: 20px; border: 2px solid #cbd7e4; border-radius: 5px; flex-shrink: 0; margin-top: 2px; position: relative; }
.step-checklist li.done .check-mark { border-color: #11734d; background: #11734d; }
.step-checklist li.done .check-mark:after { content: "✓"; position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 13px; font-weight: 900; }
.step-content { flex: 1; }
.step-head { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.step-head strong { font-size: 13px; }
.done-tag { font-size: 11px; font-weight: 900; color: #11734d; background: #dff6e8; padding: 2px 8px; border-radius: 999px; }
.pending-tag { font-size: 11px; font-weight: 900; color: #8a5a00; background: #fff2cc; padding: 2px 8px; border-radius: 999px; }
.step-content p { margin: 0; color: #53657c; font-size: 12px; }

.rectify-panel { border-left: 4px solid #b4232d; }
.rectify-info { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.rectify-requirement, .rectify-status { display: grid; gap: 8px; }
.rectify-requirement strong, .rectify-status strong { color: #64748b; font-size: 12px; font-weight: 800; }
.rectify-requirement p { margin: 0; color: #172033; font-size: 13px; line-height: 1.55; }
.rectify-progress { display: flex; align-items: center; gap: 10px; }
.progress-bar { flex: 1; height: 8px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #b4232d; border-radius: 999px; }
.rectify-progress b { color: #b4232d; font-size: 14px; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .report-grid { grid-template-columns: 1fr 1fr; }
  .rectify-info { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .report-grid { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
