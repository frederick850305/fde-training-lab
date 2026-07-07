<template>
  <section class="page">
    <header class="page-head">
      <div class="title-block">
        <span class="eyebrow">物资库存 / 工作台</span>
        <h1>物资库存工作台</h1>
        <p>盘点任务、领料提示、退料记录统一入口，顶部展示网络状态与同步进度，提供四个快速入口。</p>
      </div>
    </header>

    <!-- 网络状态 + 同步进度 -->
    <div class="net-panel" :class="netTone">
      <div class="net-left">
        <span class="net-dot"></span>
        <strong>网络状态：{{ wb.networkStatus }}</strong>
      </div>
      <div class="sync-stats">
        <span>待同步 {{ wb.syncProgress?.pending || 0 }}</span>
        <span>已同步 {{ wb.syncProgress?.synced || 0 }}</span>
        <span>失败 {{ wb.syncProgress?.failed || 0 }}</span>
      </div>
    </div>

    <!-- 待办任务卡片 -->
    <div v-if="uiState === 'loading'" class="skeleton-grid">
      <div class="skeleton-card" v-for="n in 3" :key="n">
        <span class="sk-line w40"></span>
        <span class="sk-line w70"></span>
      </div>
    </div>

    <div v-else-if="uiState === 'error'" class="state-panel">
      <h2>数据加载失败</h2>
      <p>请检查网络后重试。</p>
      <button @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- 三类待办 -->
      <section class="pending-grid">
        <article class="pending-card inventory">
          <div class="card-head">
            <span class="card-icon">盘</span>
            <h3>盘点任务</h3>
          </div>
          <strong class="big-num">{{ wb.pendingTasks?.inventory || 0 }}</strong>
          <span class="sub">项待办盘点</span>
          <ul class="mini-list">
            <li v-for="r in physicalRecords.slice(0, 3)" :key="r.taskId">
              <span>{{ r.materialName }}</span>
              <em>{{ r.status }}</em>
            </li>
            <li v-if="!physicalRecords.length" class="empty-mini">暂无盘点记录</li>
          </ul>
        </article>

        <article class="pending-card requisition">
          <div class="card-head">
            <span class="card-icon">领</span>
            <h3>领料提示</h3>
          </div>
          <strong class="big-num">{{ wb.pendingTasks?.requisition || 0 }}</strong>
          <span class="sub">项待办领料</span>
          <ul class="mini-list">
            <li v-for="r in requisitionRecords.slice(0, 3)" :key="r.orderId">
              <span>{{ r.materialName }} ×{{ r.quantity }}</span>
              <em>{{ r.status }}</em>
            </li>
            <li v-if="!requisitionRecords.length" class="empty-mini">暂无领料记录</li>
          </ul>
        </article>

        <article class="pending-card return">
          <div class="card-head">
            <span class="card-icon">退</span>
            <h3>退料记录</h3>
          </div>
          <strong class="big-num">{{ wb.pendingTasks?.return || 0 }}</strong>
          <span class="sub">项待办退料</span>
          <ul class="mini-list">
            <li v-for="r in returnRecords.slice(0, 3)" :key="r.orderId">
              <span>{{ r.materialName }} ×{{ r.returnQuantity }}</span>
              <em>{{ r.status }}</em>
            </li>
            <li v-if="!returnRecords.length" class="empty-mini">暂无退料记录</li>
          </ul>
        </article>
      </section>

      <!-- 快速入口 -->
      <section class="quick-entry">
        <h3 class="block-title">快速入口</h3>
        <div class="entry-grid">
          <button class="entry-btn" @click="goEntry('BarcodeScanInventory')">
            <span class="entry-icon">📷</span>
            <strong>扫码盘点</strong>
            <small>BarcodeScanInventory</small>
          </button>
          <button class="entry-btn" @click="goEntry('MaterialRequisition')">
            <span class="entry-icon">📋</span>
            <strong>领料</strong>
            <small>MaterialRequisition</small>
          </button>
          <button class="entry-btn" @click="goEntry('MaterialReturn')">
            <span class="entry-icon">↩</span>
            <strong>退料</strong>
            <small>MaterialReturn</small>
          </button>
          <button class="entry-btn" @click="goEntry('MobileSyncStatus')">
            <span class="entry-icon">🔄</span>
            <strong>同步状态</strong>
            <small>MobileSyncStatus</small>
          </button>
        </div>
      </section>

      <!-- 低库存预警 -->
      <section class="alert-panel">
        <h3 class="block-title">低库存预警 <em>{{ lowStocks.length }}</em></h3>
        <table>
          <thead>
            <tr><th>编码</th><th>名称</th><th>当前库存</th><th>安全库存</th><th>缺口</th></tr>
          </thead>
          <tbody>
            <tr v-for="a in lowStocks" :key="a.code">
              <td>{{ a.code }}</td>
              <td>{{ a.name }}</td>
              <td class="danger">{{ a.systemInventory }}</td>
              <td>{{ a.safetyStock }}</td>
              <td class="danger">{{ a.shortage }}</td>
            </tr>
            <tr v-if="!lowStocks.length"><td colspan="5" class="empty-row">暂无低库存预警</td></tr>
          </tbody>
        </table>
      </section>

      <!-- 最近操作 -->
      <section class="recent-panel">
        <h3 class="block-title">最近操作</h3>
        <ul class="recent-list">
          <li v-for="op in wb.recentOperations" :key="op.id">
            <span class="op-type" :class="opTypeTone(op.type)">{{ op.type }}</span>
            <div class="op-body">
              <strong>{{ op.material }}</strong>
              <small>{{ op.time }}</small>
            </div>
            <span class="op-status" :class="opStatusTone(op.status)">{{ op.status }}</span>
          </li>
        </ul>
      </section>
    </template>
  </section>
</template>

<script setup>
import { computed, inject, onMounted, ref } from 'vue'
import {
  fetchInventoryWorkbench,
  fetchPhysicalCountRecords,
  fetchRequisitionOrders,
  fetchReturnOrders,
  fetchLowStockAlerts,
} from '@/mock/api.js'

const nav = inject('prototypeNavigation', null)

const uiState = ref('loading')
const wb = ref({ pendingTasks: {}, networkStatus: '', syncProgress: {}, recentOperations: [] })
const physicalRecords = ref([])
const requisitionRecords = ref([])
const returnRecords = ref([])
const lowStocks = ref([])

function goEntry(pageKey) {
  if (nav) nav.navigateTo(pageKey)
}

const netTone = computed(() => (wb.value.networkStatus === '弱网' ? 'weak' : 'online'))

function opTypeTone(t) {
  if (t === '盘点') return 'inv'
  if (t === '领料') return 'req'
  return 'ret'
}
function opStatusTone(s) {
  if (s === '已同步') return 'ok'
  return 'pending'
}

async function reload() {
  uiState.value = 'loading'
  try {
    const [w, pc, req, ret, ls] = await Promise.all([
      fetchInventoryWorkbench(),
      fetchPhysicalCountRecords(),
      fetchRequisitionOrders(),
      fetchReturnOrders(),
      fetchLowStockAlerts(),
    ])
    wb.value = w
    physicalRecords.value = pc
    requisitionRecords.value = req
    returnRecords.value = ret
    lowStocks.value = ls
    uiState.value = 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

onMounted(reload)
</script>

<style scoped>
.page { display: grid; gap: 16px; position: relative; }
.page-head { position: relative; border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 20px; background: #fff; }
.eyebrow { color: #1e6fd9; font-size: 12px; font-weight: 900; }
.page-head h1 { margin: 6px 0 6px; font-size: 22px; color: #172033; }
.page-head p { margin: 6px 0 0; color: #64748b; font-size: 13px; max-width: 760px; }

.net-panel { display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-weight: 900; }
.net-panel.weak { background: #fff3d8; color: #8a5a00; }
.net-panel.online { background: #dff6e8; color: #11734d; }
.net-left { display: flex; align-items: center; gap: 8px; }
.net-dot { width: 9px; height: 9px; border-radius: 50%; background: currentColor; }
.sync-stats { display: flex; gap: 16px; }

.skeleton-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.skeleton-card { background: #fff; border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; display: grid; gap: 10px; }
.sk-line { height: 14px; border-radius: 6px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.sk-line.w40 { width: 40%; } .sk-line.w70 { width: 70%; }

.state-panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 32px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0 0 8px; color: #b4232d; }
.state-panel p { color: #64748b; margin: 0 0 14px; }
.state-panel button { border: 1px solid #1e6fd9; border-radius: 8px; padding: 8px 18px; background: #1e6fd9; color: #fff; font-weight: 900; }

.pending-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.pending-card { border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; background: #fff; display: grid; gap: 6px; align-content: start; }
.pending-card.inventory { border-top: 4px solid #1e6fd9; }
.pending-card.requisition { border-top: 4px solid #7256c8; }
.pending-card.return { border-top: 4px solid #d4743f; }
.card-head { display: flex; align-items: center; gap: 8px; }
.card-icon { width: 28px; height: 28px; border-radius: 6px; display: grid; place-items: center; color: #fff; font-weight: 900; font-size: 14px; }
.inventory .card-icon { background: #1e6fd9; }
.requisition .card-icon { background: #7256c8; }
.return .card-icon { background: #d4743f; }
.card-head h3 { margin: 0; font-size: 14px; color: #172033; }
.big-num { font-size: 32px; font-weight: 900; color: #172033; }
.sub { color: #64748b; font-size: 12px; font-weight: 800; }
.mini-list { list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 5px; }
.mini-list li { display: flex; justify-content: space-between; font-size: 12px; color: #3e5068; padding: 5px 8px; background: #f8fbfe; border-radius: 6px; }
.mini-list em { font-style: normal; color: #64748b; font-size: 11px; }
.empty-mini { color: #8b9aab; justify-content: center !important; }

.block-title { margin: 0 0 12px; font-size: 15px; color: #172033; display: flex; align-items: center; gap: 8px; }
.block-title em { font-size: 12px; color: #64748b; font-style: normal; font-weight: 800; background: #eef3f8; padding: 2px 8px; border-radius: 999px; }

.quick-entry { border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; background: #fff; }
.entry-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.entry-btn { border: 1px solid #d9e4ef; border-radius: 10px; padding: 18px 12px; background: #f8fbfe; display: grid; gap: 6px; justify-items: center; text-align: center; transition: all .15s; }
.entry-btn:hover { border-color: #1e6fd9; background: #edf5ff; }
.entry-btn.active { border-color: #1e6fd9; background: #1e6fd9; color: #fff; }
.entry-icon { font-size: 28px; }
.entry-btn strong { font-size: 15px; }
.entry-btn small { font-size: 11px; color: #64748b; }
.entry-btn.active small { color: rgba(255,255,255,.8); }

.alert-panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; background: #fff; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 10px; border-bottom: 1px solid #e7edf4; text-align: left; }
th { color: #63748a; background: #f7fafc; font-weight: 900; }
td.danger { color: #b4232d; font-weight: 900; }
.empty-row { text-align: center; color: #8b9aab; }

.recent-panel { border: 1px solid #d9e4ef; border-radius: 10px; padding: 16px; background: #fff; }
.recent-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.recent-list li { display: grid; grid-template-columns: 60px 1fr auto; gap: 12px; align-items: center; padding: 10px; border: 1px solid #e2eaf3; border-radius: 8px; background: #f8fbfe; }
.op-type { font-size: 11px; font-weight: 900; padding: 4px 8px; border-radius: 6px; text-align: center; }
.op-type.inv { color: #1e6fd9; background: #e3efff; }
.op-type.req { color: #7256c8; background: #efe8ff; }
.op-type.ret { color: #d4743f; background: #fff0e6; }
.op-body strong { display: block; font-size: 13px; color: #172033; }
.op-body small { color: #64748b; font-size: 11px; }
.op-status { font-size: 11px; font-weight: 900; padding: 3px 8px; border-radius: 999px; }
.op-status.ok { color: #11734d; background: #dff6e8; }
.op-status.pending { color: #8a5a00; background: #fff2cc; }

@media (max-width: 980px) {
  .pending-grid, .entry-grid, .skeleton-grid { grid-template-columns: 1fr; }
}
</style>
