<template>
  <section class="page-screen dispatch-command-editor">
    <header class="page-header">
      <div class="header-text">
        <span class="module-label">船舶监控调度 / 调度指令</span>
        <h1>调度指令编辑与下发</h1>
        <p>选择目标船舶并填写航次、时间、航线与任务要求，引用航前健康校验结果；校验不通过则禁止下发，下发后可跟踪指令执行进度。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>船舶与指令数据获取异常，请重试。</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="editor-layout">
        <!-- 左侧编辑表单 -->
        <article class="panel form-panel">
          <div class="panel-title">
            <h2>调度指令编辑</h2>
            <span>带 * 为必填</span>
          </div>
          <div class="form-grid">
            <label class="wide">
              目标船舶 *
              <select v-model="form.vesselId" @change="onVesselChange">
                <option value="">请选择船舶</option>
                <option v-for="v in vessels" :key="v.id" :value="v.id">{{ v.name }}</option>
              </select>
            </label>
            <label>
              航次编号 *
              <input v-model="form.voyageNumber" placeholder="如 V2026-014" />
            </label>
            <label>
              航线 *
              <input v-model="form.route" placeholder="如 宁波→釜山" />
            </label>
            <label>
              出发时间 *
              <input v-model="form.departureTime" type="datetime-local" />
            </label>
            <label>
              预计到达时间 *
              <input v-model="form.estimatedArrivalTime" type="datetime-local" />
            </label>
            <label class="wide">
              任务要求 *
              <textarea v-model="form.taskRequirements" rows="4" placeholder="填写靠泊要求、补给计划、维修窗口或注意事项"></textarea>
            </label>
          </div>

          <!-- 航前健康校验引用 -->
          <div class="health-ref">
            <div class="health-ref-title">
              <h3>航前健康校验结果引用</h3>
              <StatusBadge v-if="form.vesselId" :label="healthCheck.status" />
            </div>
            <div v-if="form.vesselId" class="health-ref-body">
              <div :class="['health-mini', healthTone]">
                <strong>{{ healthCheck.score }}</strong>
                <span>健康分</span>
              </div>
              <dl>
                <div><dt>校验编号</dt><dd>{{ healthCheck.checkId }}</dd></div>
                <div><dt>拦截状态</dt><dd :class="healthTone">{{ healthCheck.interceptStatus }}</dd></div>
                <div><dt>问题数</dt><dd>{{ healthCheck.issues }}</dd></div>
              </dl>
              <div v-if="healthCheck.status === '不通过'" class="block-hint">
                健康校验未通过，当前处于拦截状态，禁止下发调度指令。请先完成问题处置。
              </div>
              <div v-else class="block-hint ok">
                健康校验通过，可正常下发调度指令。
              </div>
            </div>
            <div v-else class="empty-hint">请先选择目标船舶以引用航前健康校验结果</div>
          </div>

          <div class="form-actions">
            <button type="button" @click="resetForm">重置</button>
            <button
              type="button"
              class="primary"
              :disabled="!canDispatch"
              @click="openDispatch"
            >下发指令</button>
          </div>
        </article>

        <!-- 右侧已下发指令列表 -->
        <article class="panel cmd-panel">
          <div class="panel-title">
            <h2>指令执行进度</h2>
            <span>{{ commands.length }} 条</span>
          </div>
          <div class="cmd-list">
            <div v-for="cmd in commands" :key="cmd.id" :class="['cmd-card', cmdTone(cmd.status)]">
              <div class="cmd-head">
                <strong>{{ cmd.id }}</strong>
                <StatusBadge :label="cmd.status" />
              </div>
              <div class="cmd-meta">
                <div><span>船舶</span><b>{{ cmd.vesselName }}</b></div>
                <div><span>航次</span><b>{{ cmd.voyageNumber }}</b></div>
                <div><span>航线</span><b>{{ cmd.route }}</b></div>
                <div><span>出发</span><b>{{ cmd.departureTime || '—' }}</b></div>
                <div><span>到达</span><b>{{ cmd.estimatedArrivalTime || '—' }}</b></div>
                <div><span>下发人</span><b>{{ cmd.issuedBy || '—' }}</b></div>
              </div>
              <div class="cmd-progress">
                <div class="cmd-track"><i :style="{ width: cmd.progress + '%' }"></i></div>
                <b>{{ cmd.progress }}%</b>
              </div>
              <p class="cmd-req">{{ cmd.taskRequirements }}</p>
            </div>
          </div>
        </article>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      title="下发调度指令确认"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="doDispatch"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchVessels, fetchVesselDetail, fetchDispatchCommands, submitAction } from '@/mock/api.js'

const vessels = ref([])
const commands = ref([])
const vesselHealthMap = ref({})
const uiState = ref('loading')
const confirmOpen = ref(false)

const form = reactive({
  vesselId: '',
  voyageNumber: '',
  route: '',
  departureTime: '',
  estimatedArrivalTime: '',
  taskRequirements: '',
})

const healthCheck = computed(() => {
  if (!form.vesselId) return { status: '—', score: '—', checkId: '—', interceptStatus: '—', issues: 0 }
  return vesselHealthMap.value[form.vesselId] || { status: '—', score: '—', checkId: '—', interceptStatus: '—', issues: 0 }
})

const healthTone = computed(() => {
  const s = healthCheck.value.status
  if (s === '不通过') return 'danger'
  if (s === '通过') return 'ok'
  return 'warn'
})

const canDispatch = computed(() => {
  return form.vesselId
    && form.voyageNumber
    && form.route
    && form.departureTime
    && form.estimatedArrivalTime
    && form.taskRequirements
    && healthCheck.value.status === '通过'
})

const confirmMessage = computed(() => {
  const v = vessels.value.find(x => x.id === form.vesselId)
  return `确认向 ${v?.name || form.vesselId} 下发航次 ${form.voyageNumber} 的调度指令？下发后将推送至船端并写入审计日志。`
})

function cmdTone(status) {
  if (status === '执行中') return 'active'
  if (status === '已闭环') return 'ok'
  if (status === '待下发') return 'pending'
  return ''
}

function onVesselChange() {
  // 健康数据已在加载时预取
}

function openDispatch() {
  confirmOpen.value = true
}

async function doDispatch() {
  const v = vessels.value.find(x => x.id === form.vesselId)
  const newCmd = {
    id: `CMD-${Date.now().toString().slice(-6)}`,
    vesselId: form.vesselId,
    vesselName: v?.name || form.vesselId,
    voyageNumber: form.voyageNumber,
    departureTime: form.departureTime.replace('T', ' '),
    estimatedArrivalTime: form.estimatedArrivalTime.replace('T', ' '),
    route: form.route,
    taskRequirements: form.taskRequirements,
    status: '执行中',
    issuedBy: '调度员 当前用户',
    issuedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
    progress: 0,
  }
  await submitAction('下发调度指令', newCmd)
  commands.value = [newCmd, ...commands.value]
  resetForm()
  confirmOpen.value = false
}

function resetForm() {
  form.vesselId = ''
  form.voyageNumber = ''
  form.route = ''
  form.departureTime = ''
  form.estimatedArrivalTime = ''
  form.taskRequirements = ''
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [list, cmds] = await Promise.all([
      fetchVessels(),
      fetchDispatchCommands(),
    ])
    vessels.value = list
    commands.value = cmds
    // 预取每艘船的健康校验结果（原型用同一份 detail 数据简化）
    const detail = await fetchVesselDetail()
    const map = {}
    list.forEach((v, i) => {
      if (i === 0) map[v.id] = detail.healthCheckResult
      else {
        // 其余船舶构造不同结果用于演示
        const scores = [72, 96, 88, null]
        const statuses = ['不通过', '通过', '通过', '—']
        map[v.id] = {
          checkId: `CHK-2026-00${i + 1}`,
          status: statuses[i] || '—',
          score: scores[i] ?? '—',
          interceptStatus: statuses[i] === '不通过' ? '拦截' : (statuses[i] === '通过' ? '放行' : '—'),
          issues: i === 0 ? 4 : (i === 2 ? 1 : 0),
        }
      }
    })
    vesselHealthMap.value = map
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; cursor: pointer; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .5; cursor: not-allowed; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.editor-layout { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(360px, .9fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.form-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.form-grid label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.form-grid .wide { grid-column: 1 / -1; }
.form-grid input, .form-grid select, .form-grid textarea { border: 1px solid #cbd7e4; border-radius: 7px; padding: 10px; background: #fff; color: #172033; font-family: inherit; }
.form-grid textarea { resize: vertical; }

.health-ref { margin-top: 18px; border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #f8fbfe; }
.health-ref-title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
.health-ref-title h3 { margin: 0; font-size: 14px; color: #172033; }
.health-ref-body { display: grid; grid-template-columns: 110px minmax(0,1fr); gap: 16px; align-items: start; }
.health-mini { width: 110px; height: 110px; border-radius: 50%; display: grid; place-content: center; justify-items: center; border: 10px solid; background: #fff; }
.health-mini.ok { border-color: #dff6e8; }
.health-mini.warn { border-color: #fff2cc; }
.health-mini.danger { border-color: #ffe1e3; }
.health-mini strong { font-size: 28px; line-height: 1; }
.health-mini.ok strong { color: #11734d; }
.health-mini.warn strong { color: #8a5a00; }
.health-mini.danger strong { color: #b4232d; }
.health-mini span { color: #64748b; font-size: 11px; font-weight: 800; margin-top: 4px; }
.health-ref dl { display: grid; gap: 8px; margin: 0; }
.health-ref dl div { display: flex; justify-content: space-between; border-bottom: 1px solid #e7edf4; padding-bottom: 6px; font-size: 13px; }
.health-ref dt { color: #64748b; }
.health-ref dd { margin: 0; font-weight: 900; }
.health-ref dd.danger { color: #b4232d; }
.health-ref dd.ok { color: #11734d; }
.block-hint { grid-column: 1 / -1; margin-top: 8px; padding: 8px 10px; border-radius: 6px; background: #ffe1e3; color: #b4232d; font-size: 12px; font-weight: 800; }
.block-hint.ok { background: #dff6e8; color: #11734d; }
.empty-hint { padding: 20px 0; text-align: center; color: #64748b; font-size: 13px; }

.form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 18px; }

.cmd-list { display: grid; gap: 12px; }
.cmd-card { border: 1px solid #e2eaf3; border-radius: 8px; padding: 14px; background: #f8fbfe; border-left: 4px solid #1e6fd9; }
.cmd-card.ok { border-left-color: #11734d; }
.cmd-card.pending { border-left-color: #d97706; }
.cmd-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.cmd-head strong { font-size: 15px; color: #172033; }
.cmd-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 12px; font-size: 12px; }
.cmd-meta div { display: flex; justify-content: space-between; gap: 8px; }
.cmd-meta span { color: #64748b; }
.cmd-meta b { font-weight: 900; color: #172033; text-align: right; }
.cmd-progress { display: grid; grid-template-columns: minmax(0,1fr) 44px; gap: 8px; align-items: center; margin: 10px 0; }
.cmd-track { height: 7px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.cmd-track i { display: block; height: 100%; border-radius: 999px; background: #1e6fd9; }
.cmd-progress b { color: #1e6fd9; text-align: right; }
.cmd-req { margin: 0; color: #53657c; font-size: 12px; line-height: 1.5; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .editor-layout { grid-template-columns: 1fr; }
  .form-grid { grid-template-columns: 1fr; }
  .health-ref-body { grid-template-columns: 1fr; justify-items: center; }
}
</style>
