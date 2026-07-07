<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">航前管理 / 健康检查触发</span>
        <h1>航前健康检查触发</h1>
        <p>查看待检查船舶，发起自动/手动航前健康检查，跟踪已发起检查任务的执行进度。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" class="primary" @click="batchTrigger">批量发起</button>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span>
    </div>

    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无待检查船舶</h2>
      <p>当前所有船舶均已检查或无待检查任务。</p>
      <button type="button" @click="reload">刷新</button>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <p>{{ errorMsg || '船舶检查数据加载失败，请重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 待检查船舶卡片网格 -->
      <article class="panel">
        <div class="panel-title">
          <h2>待检查船舶</h2>
          <span>{{ pendingShips.length }} 艘待检查</span>
        </div>
        <div v-if="!pendingShips.length" class="empty-inline">所有船舶均已完成航前检查。</div>
        <div v-else class="ship-grid">
          <div v-for="ship in pendingShips" :key="ship.checkId" class="ship-card">
            <div class="ship-card-head">
              <strong>{{ ship.shipName }}</strong>
              <StatusBadge :label="ship.status" />
            </div>
            <dl class="ship-meta">
              <div><dt>航次</dt><dd>{{ ship.voyageNo }}</dd></div>
              <div><dt>上次检查</dt><dd>{{ ship.checkTime || '—' }}</dd></div>
              <div><dt>拦截状态</dt><dd>{{ ship.interceptStatus }}</dd></div>
              <div><dt>问题数</dt><dd>{{ ship.issueCount ?? '—' }}</dd></div>
            </dl>
            <p class="ship-summary" v-if="ship.summary">{{ ship.summary }}</p>
            <div class="ship-actions">
              <button type="button" @click="triggerCheck(ship, 'auto')">自动检查</button>
              <button type="button" class="primary" @click="triggerCheck(ship, 'manual')">手动发起检查</button>
            </div>
          </div>
        </div>
      </article>

      <!-- 已发起任务进度 -->
      <article class="panel">
        <div class="panel-title">
          <h2>检查任务进度</h2>
          <span>{{ tasks.length }} 个任务</span>
        </div>
        <div v-if="!tasks.length" class="empty-inline">暂无已发起的检查任务。</div>
        <ul v-else class="task-list">
          <li v-for="task in tasks" :key="task.checkId" class="task-item">
            <div class="task-head">
              <strong>{{ task.shipName }}</strong>
              <span class="task-type">{{ task.triggerType === 'auto' ? '自动' : '手动' }}</span>
              <StatusBadge :label="task.statusLabel" />
            </div>
            <div class="task-progress">
              <div class="progress-bar"><i :style="{ width: `${task.progress}%` }"></i></div>
              <b>{{ task.progress }}%</b>
            </div>
            <small class="muted">{{ task.checkId }} · 航次 {{ task.voyageNo }} · {{ task.stage }}</small>
          </li>
        </ul>
      </article>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmTrigger"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchVoyageHealthChecks, submitAction } from '@/mock/api.js'

const checks = ref([])
const uiState = ref('loading')
const errorMsg = ref('')
const tasks = ref([])

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingShip = ref(null)
const pendingMode = ref('manual')

const pendingShips = computed(() =>
  checks.value.filter((c) => c.status === '待检查' || !tasks.value.some((t) => t.checkId === c.checkId)),
)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const data = await fetchVoyageHealthChecks()
    checks.value = data
    // 已有检查记录中状态非待检查的视为历史任务
    tasks.value = data
      .filter((c) => c.status !== '待检查')
      .map((c) => ({
        checkId: c.checkId,
        shipName: c.shipName,
        voyageNo: c.voyageNo,
        triggerType: 'auto',
        progress: 100,
        stage: c.status === '通过' ? '检查完成·放行' : c.status === '不通过' ? '检查完成·拦截' : '已完成',
        statusLabel: c.status,
      }))
    uiState.value = data.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function triggerCheck(ship, mode) {
  pendingShip.value = ship
  pendingMode.value = mode
  confirmTitle.value = mode === 'auto' ? '发起自动检查' : '发起手动检查'
  confirmMessage.value = `确认对${ship.shipName}（航次 ${ship.voyageNo}）发起${mode === 'auto' ? '自动' : '手动'}航前健康检查？`
  confirmOpen.value = true
}

function batchTrigger() {
  if (!pendingShips.value.length) return
  confirmTitle.value = '批量发起检查'
  confirmMessage.value = `确认对 ${pendingShips.value.length} 艘待检查船舶批量发起航前健康检查？`
  pendingShip.value = null
  pendingMode.value = 'auto'
  confirmOpen.value = true
}

async function confirmTrigger() {
  try {
    const ships = pendingShip.value ? [pendingShip.value] : pendingShips.value
    for (const ship of ships) {
      await submitAction('发起航前检查', { checkId: ship.checkId, mode: pendingMode.value })
      const newTask = {
        checkId: ship.checkId + '-' + Date.now(),
        shipName: ship.shipName,
        voyageNo: ship.voyageNo,
        triggerType: pendingMode.value,
        progress: 0,
        stage: '已发起·数据采集中',
        statusLabel: '进行中',
      }
      tasks.value.unshift(newTask)
      simulateProgress(newTask)
    }
    confirmOpen.value = false
  } catch (e) {
    errorMsg.value = e?.message
    confirmOpen.value = false
  }
}

function simulateProgress(task) {
  const timer = setInterval(() => {
    task.progress = Math.min(100, task.progress + Math.floor(Math.random() * 20) + 10)
    if (task.progress >= 100) {
      clearInterval(timer)
      task.stage = '检查完成·待判定'
      task.statusLabel = '待检查'
    } else if (task.progress >= 60) {
      task.stage = '校验中·分类评估'
    } else if (task.progress >= 30) {
      task.stage = '数据采集·设备扫描'
    }
  }, 600)
}
</script>

<style scoped>
.page-screen { display: grid; gap: 20px; }
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
.skeleton span { height: 200px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.empty-inline { padding: 20px; text-align: center; color: #64748b; border: 1px dashed #cdd9e6; border-radius: 8px; background: #fafbfc; }

.ship-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; align-items: start; }
.ship-card {
  display: grid;
  gap: 10px;
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  padding: 14px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
  transition: border-color .15s, box-shadow .15s;
  position: relative;
  overflow: hidden;
}
.ship-card:hover { border-color: #1e6fd9; box-shadow: 0 6px 18px rgba(30, 111, 217, .12); }
.ship-card-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
.ship-card-head strong { font-size: 15px; }
.ship-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin: 0; }
.ship-meta div { display: flex; justify-content: space-between; gap: 6px; border-bottom: 1px solid #e7edf4; padding-bottom: 4px; font-size: 12px; }
.ship-meta dt { color: #64748b; }
.ship-meta dd { margin: 0; font-weight: 800; color: #172033; }
.ship-summary { margin: 0; color: #53657c; font-size: 12px; line-height: 1.45; }
.ship-actions { display: flex; gap: 8px; margin-top: 4px; }
.ship-actions button { flex: 1; font-size: 12px; padding: 8px 10px; }

.task-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 10px; }
.task-item { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px 14px; background: #fafbfc; }
.task-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.task-head strong { flex: 1; font-size: 14px; }
.task-type { font-size: 11px; font-weight: 900; color: #1e6fd9; background: #e3efff; border-radius: 999px; padding: 2px 8px; }
.task-progress { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
.progress-bar { flex: 1; height: 8px; border-radius: 999px; background: #e7edf4; overflow: hidden; }
.progress-bar i { display: block; height: 100%; background: #1e6fd9; border-radius: 999px; transition: width .4s; }
.task-progress b { color: #1e6fd9; font-size: 13px; }
.muted { color: #8b9aab; }
.task-item small { font-size: 11px; }

@media (max-width: 720px) {
  .page-header { flex-direction: column; }
  .ship-grid { grid-template-columns: 1fr; }
  .ship-meta { grid-template-columns: 1fr; }
}
</style>
