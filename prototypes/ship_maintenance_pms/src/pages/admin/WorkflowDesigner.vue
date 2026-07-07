<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">系统管理 / 流程设计</span>
        <h1>审批流程设计器</h1>
        <p class="page-desc">可视化编辑审批流程，画布展示节点与连线，支持节点选中、条件分支、审批人/超时/转交策略配置。顶部切换流程，编辑后可保存发布。</p>
      </div>
      </header>

    <div class="workflow-topbar">
      <label>
        <span>选择流程</span>
        <select v-model="selectedWorkflowId" @change="onWorkflowChange">
          <option v-for="wf in workflows" :key="wf.id" :value="wf.id">{{ wf.processType }}（{{ wf.versionLabel }}）</option>
        </select>
      </label>
      <div v-if="selectedWorkflow" class="wf-meta">
        <span><b>流程编号</b>{{ selectedWorkflow.id }}</span>
        <span><b>状态</b><StatusBadge :label="selectedWorkflow.status" /></span>
        <span><b>更新时间</b>{{ selectedWorkflow.updatedAt }}</span>
      </div>
    </div>

    <!-- 加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <!-- 空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无流程数据</h2>
      <p>流程引擎未返回任何审批流程配置。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>流程数据加载失败</h2>
      <p>{{ errorMsg || '请检查流程引擎服务后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="designer-layout">
        <!-- 画布 -->
        <article class="panel canvas-panel">
          <div class="panel-title">
            <h2>流程画布</h2>
            <span>{{ canvasNodes.length }} 个节点 · 点击节点配置</span>
          </div>
          <div class="canvas">
            <template v-for="(node, idx) in canvasNodes" :key="idx">
              <div
                :class="['wf-node', node.branch ? 'branch' : '', node.end ? 'end' : '', selectedNodeIndex === idx ? 'selected' : '']"
                @click="selectNode(idx)"
              >
                <span class="node-idx">{{ idx + 1 }}</span>
                <strong>{{ node.name }}</strong>
                <small v-if="node.approver">{{ node.approver }}</small>
                <small v-else class="node-hint">未配置审批人</small>
              </div>
              <div v-if="idx < canvasNodes.length - 1" class="wf-edge">
                <i></i>
                <span v-if="canvasNodes[idx + 1].branch" class="edge-label">条件分支</span>
              </div>
            </template>
          </div>
          <div class="canvas-legend">
            <span><i class="dot normal"></i> 普通节点</span>
            <span><i class="dot branch"></i> 条件分支</span>
            <span><i class="dot end"></i> 终止节点</span>
          </div>
          <div class="canvas-actions">
            <button type="button" class="primary" :disabled="!selectedWorkflow" :title="selectedWorkflow ? '保存并发布流程' : '请先选择流程'" @click="askPublish">保存发布</button>
            <button type="button" :disabled="!selectedWorkflow" :title="selectedWorkflow ? '追加节点' : '请先选择流程'" @click="addNode">追加节点</button>
          </div>
        </article>

        <!-- 节点配置 -->
        <aside class="panel config-panel">
          <div class="panel-title">
            <h2>{{ selectedNode ? '节点配置' : '流程配置' }}</h2>
            <span v-if="selectedNode">第 {{ selectedNodeIndex + 1 }} 步</span>
          </div>

          <div v-if="!selectedNode" class="empty-inline">
            请在画布中点击一个节点以配置审批人、超时与转交策略。
          </div>

          <form v-else class="node-form" @submit.prevent>
            <label>
              <span>节点名称 <em>*</em></span>
              <input v-model="selectedNode.name" @input="markDirty" />
            </label>
            <label>
              <span>节点类型</span>
              <select v-model="selectedNode.branch" @change="markDirty">
                <option :value="false">普通审批</option>
                <option :value="true">条件分支</option>
              </select>
            </label>
            <label>
              <span>审批人</span>
              <input v-model="selectedNode.approver" placeholder="如：机务主管" @input="markDirty" />
            </label>
            <label>
              <span>超时策略</span>
              <select v-model="selectedNode.timeout" @change="markDirty">
                <option value="">不设置</option>
                <option>24小时未审核升级</option>
                <option>48小时未处理自动催办</option>
                <option>72小时自动通过</option>
              </select>
            </label>
            <label>
              <span>转交策略</span>
              <select v-model="selectedNode.transfer" @change="markDirty">
                <option value="">不可转交</option>
                <option>可转交同级人员</option>
                <option>可转交上级</option>
                <option>可转交指定人员</option>
              </select>
            </label>
            <div class="node-actions">
              <button type="button" class="danger" @click="removeNode" :disabled="canvasNodes.length <= 2">删除节点</button>
              <button type="button" @click="selectedNode = null; selectedNodeIndex = null">取消选中</button>
            </div>
          </form>

          <!-- 流程级配置 -->
          <div class="flow-config">
            <div class="panel-title"><h2>流程级策略</h2></div>
            <label>
              <span>流程类型</span>
              <input :value="selectedWorkflow?.processType" disabled />
            </label>
            <label>
              <span>版本号</span>
              <input :value="selectedWorkflow?.versionLabel" disabled />
            </label>
            <div class="approvers-list">
              <span>默认审批人链</span>
              <div class="chips">
                <em v-for="(a, i) in (selectedWorkflow?.approvers || [])" :key="i">{{ a }}</em>
              </div>
            </div>
            <p class="flow-tip" v-if="dirty">存在未保存的画布或节点变更，请点击"保存发布"。</p>
          </div>
        </aside>
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
import { fetchWorkflows, submitAction } from '@/mock/api.js'

const workflows = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const selectedWorkflowId = ref('')
const selectedNodeIndex = ref(null)
const dirty = ref(false)

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

const selectedWorkflow = computed(() => workflows.value.find(w => w.id === selectedWorkflowId.value) || null)

// 画布节点：由 canvasData 转换为可编辑节点对象
const canvasNodes = ref([])
const selectedNode = ref(null)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const list = await fetchWorkflows()
    workflows.value = list
    if (list.length) {
      selectedWorkflowId.value = list[0].id
      buildCanvas(list[0])
    }
    uiState.value = list.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function buildCanvas(wf) {
  // 标记最后一个为 end，中间含"分支"/"退回"字样的为 branch
  const nodes = wf.canvasData.map((name, idx) => {
    const isBranch = /分支|退回|驳回|豁免/.test(name)
    const isEnd = idx === wf.canvasData.length - 1 || /归档|生效|批准/.test(name)
    const approver = wf.approvers[idx] || ''
    return {
      name,
      branch: isBranch,
      end: isEnd,
      approver,
      timeout: wf.timeoutRule || '',
      transfer: wf.transferRule || '',
    }
  })
  canvasNodes.value = nodes
  selectedNodeIndex.value = null
  selectedNode.value = null
  dirty.value = false
}

function onWorkflowChange() {
  if (selectedWorkflow.value) buildCanvas(selectedWorkflow.value)
}

function selectNode(idx) {
  selectedNodeIndex.value = idx
  selectedNode.value = canvasNodes.value[idx]
}

function markDirty() {
  dirty.value = true
}

function addNode() {
  canvasNodes.value.splice(canvasNodes.value.length - 1, 0, {
    name: '新审批节点',
    branch: false,
    end: false,
    approver: '',
    timeout: '',
    transfer: '',
  })
  dirty.value = true
}

function removeNode() {
  if (selectedNodeIndex.value === null) return
  if (canvasNodes.value.length <= 2) return
  canvasNodes.value.splice(selectedNodeIndex.value, 1)
  selectedNodeIndex.value = null
  selectedNode.value = null
  dirty.value = true
}

function askPublish() {
  if (!selectedWorkflow.value) return
  pendingAction.value = { type: 'publish' }
  confirmTitle.value = '保存并发布流程'
  confirmMessage.value = `将保存「${selectedWorkflow.value.processType}」的画布与节点配置（${canvasNodes.value.length} 个节点）并发布为新版本，发布后立即生效。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  try {
    await submitAction('publishWorkflow', {
      workflowId: selectedWorkflow.value.id,
      nodes: canvasNodes.value,
    })
    // 同步画布数据回原 workflow
    if (selectedWorkflow.value) {
      selectedWorkflow.value.canvasData = canvasNodes.value.map(n => n.name)
      selectedWorkflow.value.approvers = canvasNodes.value.map(n => n.approver || '').filter(Boolean)
      selectedWorkflow.value.status = '已发布'
    }
    dirty.value = false
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '发布失败：' + (e?.message || '未知错误')
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button.danger { color: #b4232d; border-color: #f3c2c6; background: #fff0f1; }
button:disabled { opacity: .55; cursor: not-allowed; }

.workflow-topbar { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; border: 1px solid #d9e4ef; border-radius: 8px; padding: 14px 18px; background: #fff; }
.workflow-topbar label { display: grid; gap: 5px; color: #53657c; font-size: 12px; font-weight: 900; }
.workflow-topbar select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; min-width: 240px; }
.wf-meta { display: flex; gap: 22px; flex-wrap: wrap; color: #53657c; font-size: 13px; }
.wf-meta span { display: inline-flex; align-items: center; gap: 6px; }
.wf-meta b { color: #8b9aab; font-size: 11px; font-weight: 900; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.designer-layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.canvas-panel { min-height: 460px; }
.canvas { display: flex; align-items: center; gap: 0; overflow-x: auto; padding: 30px 12px; min-height: 360px; background: linear-gradient(180deg, #f8fbfe, #eef3f8); border-radius: 8px; border: 1px dashed #cdd9e6; }
.wf-node { flex: 0 0 auto; min-width: 130px; min-height: 100px; border: 2px solid #1e6fd9; border-radius: 10px; padding: 12px; background: #fff; cursor: pointer; display: grid; gap: 5px; align-content: center; text-align: center; box-shadow: 0 6px 18px rgba(30,111,217,.12); transition: transform .15s, border-color .15s; }
.wf-node:hover { transform: translateY(-2px); }
.wf-node.selected { border-color: #11734d; background: #e8f8ef; }
.wf-node.branch { border-color: #b8860b; background: #fffdf2; }
.wf-node.end { border-color: #11734d; background: #dff6e8; }
.node-idx { display: inline-block; width: 22px; height: 22px; line-height: 22px; border-radius: 50%; background: #1e6fd9; color: #fff; font-size: 11px; font-weight: 900; margin: 0 auto; }
.wf-node.branch .node-idx { background: #b8860b; }
.wf-node.end .node-idx { background: #11734d; }
.wf-node strong { font-size: 13px; color: #172033; }
.wf-node small { font-size: 11px; color: #64748b; }
.node-hint { color: #b4232d !important; }
.wf-edge { flex: 0 0 auto; display: grid; place-items: center; min-width: 50px; position: relative; }
.wf-edge i { display: block; width: 40px; height: 2px; background: #9eb3ca; }
.edge-label { position: absolute; top: -20px; font-size: 10px; color: #b8860b; font-weight: 900; background: #fffdf2; padding: 2px 6px; border: 1px solid #f0d68a; border-radius: 4px; }

.canvas-legend { display: flex; gap: 18px; margin-top: 14px; color: #64748b; font-size: 12px; font-weight: 800; }
.canvas-legend .dot { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 5px; vertical-align: middle; }
.dot.normal { background: #1e6fd9; }
.dot.branch { background: #b8860b; }
.dot.end { background: #11734d; }

.config-panel { position: sticky; top: 0; display: grid; gap: 18px; }
.empty-inline { padding: 40px; text-align: center; color: #8b9aab; border: 1px dashed #cdd9e6; border-radius: 8px; }
.node-form { display: grid; gap: 12px; }
.node-form label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.node-form em { color: #b4232d; font-style: normal; }
.node-form input, .node-form select { min-height: 36px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; }
.node-actions { display: flex; gap: 8px; }

.flow-config { display: grid; gap: 12px; border-top: 1px solid #e7edf4; padding-top: 14px; }
.flow-config label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.flow-config input { min-height: 36px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #f3f6fa; color: #64748b; }
.approvers-list { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chips em { font-style: normal; background: #e3efff; color: #1f5fbf; padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; }
.flow-tip { margin: 0; color: #b4232d; font-size: 12px; font-weight: 800; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .designer-layout { grid-template-columns: 1fr; }
  .config-panel { position: static; }
  .canvas { overflow-x: auto; }
}
</style>
