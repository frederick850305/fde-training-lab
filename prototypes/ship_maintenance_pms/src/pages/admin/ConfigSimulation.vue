<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">系统管理 / 配置模拟</span>
        <h1>权限与流程配置模拟</h1>
        <p>选择角色模拟其视角查看权限矩阵预览，选择流程试运行模拟流转步骤，验证通过后发布配置。用于配置变更上线前的预演校验。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" @click="runFlow" :disabled="!selectedWorkflowId" class="primary">试运行流程</button>
        <button type="button" @click="askPublish" class="primary">发布配置</button>
      </div>
    </header>

    <!-- 加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <!-- 空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无配置数据</h2>
      <p>未加载到角色或流程数据，无法进行模拟。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>配置数据加载失败</h2>
      <p>{{ errorMsg || '请检查权限中心与流程引擎状态后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="sim-controls">
        <label>
          <span>模拟角色视角</span>
          <select v-model="selectedRoleId" @change="onRoleChange">
            <option value="">请选择角色</option>
            <option v-for="r in roles" :key="r.roleId" :value="r.roleId">{{ r.roleName }}</option>
          </select>
        </label>
        <label>
          <span>试运行流程</span>
          <select v-model="selectedWorkflowId">
            <option value="">请选择流程</option>
            <option v-for="wf in workflows" :key="wf.id" :value="wf.id">{{ wf.processType }}（{{ wf.versionLabel }}）</option>
          </select>
        </label>
        <div class="sim-status">
          <StatusBadge :label="selectedRole ? '模拟中' : '待选择'" />
          <StatusBadge v-if="runSteps.length" label="通过" />
        </div>
      </section>

      <section class="sim-layout">
        <!-- 权限验证结果 -->
        <article class="panel perm-panel">
          <div class="panel-title">
            <h2>权限验证结果</h2>
            <span v-if="selectedRole">{{ selectedRole.roleName }} · {{ permStats.enabled }} 项已授权 / {{ permStats.total }} 项可配置</span>
          </div>
          <div v-if="!selectedRole" class="empty-inline">请选择一个角色以预览其权限矩阵。</div>
          <template v-else>
            <div class="perm-summary">
              <div :class="['perm-stat', permStats.blocked ? 'danger' : 'ok']">
                <strong>{{ permStats.blocked }}</strong>
                <span>受限模块</span>
              </div>
              <div class="perm-stat ok">
                <strong>{{ permStats.enabled }}</strong>
                <span>已授权操作</span>
              </div>
              <div class="perm-stat">
                <strong>{{ selectedRole.userCount }}</strong>
                <span>影响用户数</span>
              </div>
              <div :class="['perm-stat', permStats.blocked ? 'danger' : 'ok']">
                <strong>{{ permStats.blocked ? '需关注' : '通过' }}</strong>
                <span>验证结论</span>
              </div>
            </div>
            <div class="matrix-scroll">
              <table class="perm-matrix">
                <thead>
                  <tr>
                    <th class="col-mod">模块</th>
                    <th v-for="op in allOps" :key="op">{{ opLabel(op) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="mod in modules" :key="mod.key">
                    <td class="col-mod"><strong>{{ mod.label }}</strong></td>
                    <td v-for="op in allOps" :key="op" :class="permCellClass(mod.key, op)">
                      <span v-if="!mod.ops.includes(op)">—</span>
                      <span v-else-if="hasPerm(mod.key, op)">✓</span>
                      <span v-else class="denied">×</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>
        </article>

        <!-- 流程试运行 -->
        <article class="panel flow-panel">
          <div class="panel-title">
            <h2>流程试运行</h2>
            <span v-if="selectedWorkflow">{{ selectedWorkflow.processType }} · {{ selectedWorkflow.versionLabel }}</span>
          </div>
          <div v-if="!selectedWorkflowId" class="empty-inline">请选择一个流程并点击"试运行流程"。</div>
          <template v-else>
            <div class="flow-info">
              <span><b>审批人链</b>{{ (selectedWorkflow.approvers || []).join(' → ') || '—' }}</span>
              <span><b>超时规则</b>{{ selectedWorkflow.timeoutRule }}</span>
              <span><b>转交规则</b>{{ selectedWorkflow.transferRule }}</span>
            </div>
            <ol v-if="runSteps.length" class="run-timeline">
              <li v-for="(step, idx) in runSteps" :key="idx" :class="step.status">
                <div class="run-dot"></div>
                <div class="run-body">
                  <div class="run-head">
                    <strong>{{ step.node }}</strong>
                    <StatusBadge :label="step.statusLabel" />
                  </div>
                  <p>{{ step.detail }}</p>
                  <small v-if="step.actor">模拟执行人：{{ step.actor }} · {{ step.time }}</small>
                </div>
              </li>
            </ol>
            <div v-else class="empty-inline">点击顶部"试运行流程"按钮开始模拟流转。</div>
          </template>
        </article>
      </section>

      <!-- 发布确认摘要 -->
      <section class="panel publish-panel">
        <div class="panel-title">
          <h2>发布确认摘要</h2>
          <span>发布前请确认模拟结果无异常</span>
        </div>
        <div class="publish-grid">
          <div class="publish-item">
            <b>权限验证</b>
            <span :class="selectedRole && !permStats.blocked ? 'ok' : 'warn'">
              {{ selectedRole ? (permStats.blocked ? `${permStats.blocked} 个模块受限` : '全部通过') : '未选择角色' }}
            </span>
          </div>
          <div class="publish-item">
            <b>流程试运行</b>
            <span :class="runSteps.length ? 'ok' : 'warn'">{{ runSteps.length ? `${runSteps.length} 步全部通过` : '未试运行' }}</span>
          </div>
          <div class="publish-item">
            <b>影响范围</b>
            <span>{{ selectedRole ? `${selectedRole.userCount} 个用户` : '—' }}</span>
          </div>
          <div class="publish-item">
            <b>审计追溯</b>
            <span>发布将写入 configAuditLogs</span>
          </div>
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
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchRoles, fetchPermissionModules, fetchWorkflows, submitAction } from '@/mock/api.js'

const roles = ref([])
const modules = ref([])
const workflows = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const selectedRoleId = ref('')
const selectedWorkflowId = ref('')
const runSteps = ref([])

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

const selectedRole = computed(() => roles.value.find(r => r.roleId === selectedRoleId.value) || null)
const selectedWorkflow = computed(() => workflows.value.find(w => w.id === selectedWorkflowId.value) || null)

const allOps = computed(() => {
  const set = new Set()
  modules.value.forEach(m => m.ops.forEach(o => set.add(o)))
  return [...set]
})

const permStats = computed(() => {
  let enabled = 0
  let total = 0
  let blocked = 0
  if (!selectedRole.value) return { enabled, total, blocked }
  for (const mod of modules.value) {
    const perms = selectedRole.value.permissions?.[mod.key] || []
    if (perms.length === 0 && mod.ops.length > 0) blocked++
    for (const op of mod.ops) {
      total++
      if (perms.includes(op)) enabled++
    }
  }
  return { enabled, total, blocked }
})

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [r, m, w] = await Promise.all([fetchRoles(), fetchPermissionModules(), fetchWorkflows()])
    roles.value = r
    modules.value = m
    workflows.value = w
    if (r.length) {
      selectedRoleId.value = r[0].roleId
    }
    if (w.length) {
      selectedWorkflowId.value = w[0].id
    }
    uiState.value = (r.length || w.length) ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function onRoleChange() {
  // 切换角色时清空试运行结果
  runSteps.value = []
}

function hasPerm(modKey, op) {
  return (selectedRole.value?.permissions?.[modKey] || []).includes(op)
}

function permCellClass(modKey, op) {
  const mod = modules.value.find(m => m.key === modKey)
  if (!mod || !mod.ops.includes(op)) return 'cell-na'
  return hasPerm(modKey, op) ? 'cell-ok' : 'cell-denied'
}

function opLabel(op) {
  const map = { view: '查看', edit: '编辑', approve: '审批', execute: '执行', export: '导出', dispatch: '调度', resolve: '处置', scan: '扫码', offline: '离线', publish: '发布', simulate: '模拟', mark: '标记', receipt: '验收' }
  return map[op] || op
}

async function runFlow() {
  if (!selectedWorkflow.value) return
  runSteps.value = []
  const approvers = selectedWorkflow.value.approvers || []
  const nodes = selectedWorkflow.value.canvasData || []
  for (let i = 0; i < nodes.length; i++) {
    // 模拟延迟，逐步展示
    await new Promise(resolve => setTimeout(resolve, 120))
    const isEnd = i === nodes.length - 1
    const isBranch = /分支|退回|驳回|豁免/.test(nodes[i])
    runSteps.value.push({
      node: nodes[i],
      status: isEnd ? 'end' : isBranch ? 'branch' : 'normal',
      statusLabel: isEnd ? '已通过' : isBranch ? '分支通过' : '已执行',
      detail: isBranch
        ? `条件分支节点「${nodes[i]}」，模拟判定条件成立，继续向下流转。`
        : isEnd
          ? `终止节点「${nodes[i]}」，流程模拟试运行全部通过，可进入发布。`
          : `模拟审批节点「${nodes[i]}」，审批人执行通过操作，流转至下一节点。`,
      actor: approvers[i] || '系统模拟',
      time: new Date(Date.now() + i * 60000).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    })
  }
}

function askPublish() {
  pendingAction.value = { type: 'publish' }
  const permOk = selectedRole.value && permStats.value.blocked === 0
  const flowOk = runSteps.value.length > 0
  confirmTitle.value = '发布配置确认'
  confirmMessage.value = `将发布当前模拟的权限与流程配置。权限验证：${permOk ? '通过' : '需关注'}；流程试运行：${flowOk ? `${runSteps.value.length}步通过` : '未试运行'}。发布后立即生效并写入审计日志。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  try {
    await submitAction('publishConfig', {
      roleId: selectedRoleId.value,
      workflowId: selectedWorkflowId.value,
      permStats: permStats.value,
      runSteps: runSteps.value.length,
    })
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '发布失败：' + (e?.message || '未知错误')
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .55; cursor: not-allowed; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.sim-controls { display: flex; gap: 24px; align-items: flex-end; flex-wrap: wrap; border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px 18px; background: #fff; }
.sim-controls label { display: grid; gap: 5px; color: #53657c; font-size: 12px; font-weight: 900; }
.sim-controls select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; min-width: 240px; }
.sim-status { display: flex; gap: 8px; align-items: center; margin-left: auto; }

.sim-layout { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }
.empty-inline { padding: 36px; text-align: center; color: #8b9aab; border: 1px dashed #cdd9e6; border-radius: 8px; }

.perm-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 14px; }
.perm-stat { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; text-align: center; background: #f8fbfe; }
.perm-stat strong { display: block; font-size: 22px; color: #1e6fd9; }
.perm-stat span { color: #64748b; font-size: 11px; font-weight: 800; }
.perm-stat.ok strong { color: #11734d; }
.perm-stat.danger strong { color: #b4232d; }

.matrix-scroll { overflow-x: auto; border: 1px solid #e7edf4; border-radius: 8px; }
.perm-matrix { width: 100%; border-collapse: collapse; font-size: 12px; }
.perm-matrix th, .perm-matrix td { padding: 8px; border-bottom: 1px solid #e7edf4; text-align: center; }
.perm-matrix th { color: #63748a; background: #f7fafc; }
.col-mod { text-align: left !important; min-width: 130px; }
.cell-ok { background: #e8f8ef; color: #11734d; font-weight: 900; }
.cell-denied { background: #fff0f1; color: #b4232d; font-weight: 900; }
.cell-na { color: #cdd9e6; }
.denied { color: #b4232d; }

.flow-info { display: grid; gap: 6px; margin-bottom: 14px; padding: 12px; border: 1px solid #e2eaf3; border-radius: 8px; background: #f8fbfe; }
.flow-info span { display: flex; gap: 8px; color: #53657c; font-size: 12px; }
.flow-info b { color: #8b9aab; min-width: 70px; font-weight: 900; }

.run-timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 12px; }
.run-timeline li { display: grid; grid-template-columns: 24px 1fr; gap: 12px; }
.run-dot { width: 14px; height: 14px; border-radius: 50%; margin-top: 4px; background: #1e6fd9; }
.run-timeline li.branch .run-dot { background: #b8860b; }
.run-timeline li.end .run-dot { background: #11734d; }
.run-body { border-left: 2px solid #e7edf4; padding-left: 12px; }
.run-head { display: flex; align-items: center; gap: 8px; }
.run-head strong { font-size: 13px; }
.run-body p { margin: 4px 0; color: #53657c; font-size: 12px; line-height: 1.5; }
.run-body small { color: #8b9aab; font-size: 11px; }

.publish-panel { }
.publish-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.publish-item { border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #f8fbfe; }
.publish-item b { display: block; color: #64748b; font-size: 12px; margin-bottom: 6px; }
.publish-item span { font-size: 14px; font-weight: 900; color: #172033; }
.publish-item span.ok { color: #11734d; }
.publish-item span.warn { color: #b4232d; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .sim-layout { grid-template-columns: 1fr; }
  .perm-summary, .publish-grid { grid-template-columns: 1fr 1fr; }
}
</style>
