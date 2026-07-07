<template>
  <section class="page-screen procurement-review">
    <header class="page-header">
      <div>
        <span class="module-label">采购验收协同 / P0</span>
        <h1>采购需求审核</h1>
        <p>采办协同人员审核自动生成的采购需求列表，校验预算与BOM关联后发起采购申请。</p>
      </div>
    </header>

    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span>
    </div>
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>数据加载失败</h2>
      <button type="button" @click="reload">重试</button>
    </div>
    <template v-else>
      <section class="alert-strip" v-if="lowStock.length">
        <strong>缺件预警</strong>
        <div class="alert-items">
          <span v-for="item in lowStock" :key="item.code" class="alert-chip">
            {{ item.name }} 库存{{ item.systemInventory }}/{{ item.safetyStock }} 缺口{{ item.shortage }}
          </span>
        </div>
      </section>

      <section class="review-layout">
        <article class="panel req-list">
          <div class="panel-title">
            <h2>采购需求列表</h2>
            <span>{{ filteredReqs.length }} 条</span>
          </div>
          <div class="filter-row">
            <input v-model="keyword" placeholder="搜索物料 / BOM" />
            <select v-model="statusFilter">
              <option value="">全部状态</option>
              <option>待审核</option>
              <option>已转采购</option>
            </select>
          </div>
          <div class="req-cards">
            <button
              v-for="req in filteredReqs"
              :key="req.id"
              type="button"
              class="req-card"
              :class="{ selected: selectedReq?.id === req.id }"
              @click="selectedReq = req"
            >
              <div class="req-head">
                <strong>{{ req.materialName }}</strong>
                <StatusBadge :label="req.urgency === '高' ? '紧急' : req.urgency" />
              </div>
              <span>{{ req.id }} · {{ req.source }}</span>
              <span>{{ req.bomRef }}</span>
              <div class="req-foot">
                <span>需求 {{ req.requiredQty }}{{ req.unit }}</span>
                <StatusBadge :label="req.status" />
              </div>
            </button>
          </div>
        </article>

        <article class="panel req-detail" v-if="selectedReq">
          <div class="panel-title">
            <h2>需求详情与校验</h2>
          </div>
          <dl class="info-grid">
            <div><dt>需求编号</dt><dd>{{ selectedReq.id }}</dd></div>
            <div><dt>物料编码</dt><dd>{{ selectedReq.materialCode }}</dd></div>
            <div><dt>物料名称</dt><dd>{{ selectedReq.materialName }}</dd></div>
            <div><dt>需求数量</dt><dd>{{ selectedReq.requiredQty }} {{ selectedReq.unit }}</dd></div>
            <div><dt>需求来源</dt><dd>{{ selectedReq.source }}</dd></div>
            <div><dt>生成时间</dt><dd>{{ selectedReq.generatedAt }}</dd></div>
          </dl>

          <div class="check-block">
            <h3>BOM 关联校验</h3>
            <div class="check-result ok">
              <span>✓</span>
              <div>
                <strong>已关联设备 BOM</strong>
                <p>{{ selectedReq.bomRef }}</p>
              </div>
            </div>
          </div>

          <div class="check-block">
            <h3>预算校验</h3>
            <div class="check-result" :class="selectedReq.budgetOk ? 'ok' : 'danger'">
              <span>{{ selectedReq.budgetOk ? '✓' : '✗' }}</span>
              <div>
                <strong>{{ selectedReq.budgetOk ? '预算充足' : '预算不足' }}</strong>
                <p>预算科目：{{ selectedReq.budgetRef }} · 预估成本 ¥{{ selectedReq.estimatedCost }}</p>
              </div>
            </div>
          </div>

          <div class="check-block" v-if="!selectedReq.budgetOk">
            <div class="budget-warn">
              <strong>预算不足，需追加预算或调整数量后方可发起采购</strong>
            </div>
          </div>

          <div class="action-area">
            <button
              type="button"
              class="primary"
              :disabled="!selectedReq.budgetOk || selectedReq.status === '已转采购'"
              @click="openConfirm('发起采购')"
            >
              {{ selectedReq.status === '已转采购' ? '已转采购' : '发起采购申请' }}
            </button>
          </div>
        </article>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      title="发起采购确认"
      :message="`将对 ${selectedReq?.materialName}（${selectedReq?.requiredQty}${selectedReq?.unit}）发起采购申请，预估成本 ¥${selectedReq?.estimatedCost}。`"
      @cancel="confirmOpen = false"
      @confirm="confirmProcure"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchProcurementRequirements, fetchLowStockAlerts, submitAction } from '@/mock/api.js'

const requirements = ref([])
const lowStock = ref([])
const selectedReq = ref(null)
const uiState = ref('loading')
const keyword = ref('')
const statusFilter = ref('')
const confirmOpen = ref(false)

const filteredReqs = computed(() =>
  requirements.value.filter(r => {
    const kw = !keyword.value || `${r.materialName}${r.bomRef}${r.id}`.includes(keyword.value)
    const st = !statusFilter.value || r.status === statusFilter.value
    return kw && st
  }),
)

onMounted(load)

async function load() {
  uiState.value = 'loading'
  try {
    const [reqs, alerts] = await Promise.all([fetchProcurementRequirements(), fetchLowStockAlerts()])
    requirements.value = reqs
    lowStock.value = alerts
    selectedReq.value = reqs[0] || null
    uiState.value = reqs.length ? 'success' : 'empty'
  } catch {
    uiState.value = 'error'
  }
}

function reload() { load() }
function openConfirm() { confirmOpen.value = true }

async function confirmProcure() {
  if (!selectedReq.value) return
  await submitAction('发起采购', selectedReq.value)
  selectedReq.value.status = '已转采购'
  confirmOpen.value = false
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; position: relative; }
.page-header { display: flex; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { margin: 0; color: #53657c; max-width: 760px; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 14px; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .5; cursor: not-allowed; }

.state-panel { min-height: 220px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; gap: 12px; justify-items: center; background: #fff; }
.state-panel.error h2 { color: #b4232d; margin: 0; }
.skeleton { grid-template-columns: repeat(3,1fr); padding: 24px; }
.skeleton span { height: 80px; border-radius: 8px; background: linear-gradient(90deg,#eef3f8,#f8fbfe,#eef3f8); }
.alert-strip { display: flex; align-items: center; gap: 14px; border: 1px solid #f3c2c6; border-radius: 8px; padding: 14px 18px; background: #fff5f6; }
.alert-strip strong { color: #b4232d; white-space: nowrap; }
.alert-items { display: flex; gap: 8px; flex-wrap: wrap; }
.alert-chip { font-size: 12px; font-weight: 800; color: #b4232d; background: #ffe1e3; border-radius: 999px; padding: 4px 10px; }
.review-layout { display: grid; grid-template-columns: 380px minmax(0,1fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }
.filter-row { display: grid; grid-template-columns: 1fr auto; gap: 8px; margin-bottom: 12px; }
.filter-row input, .filter-row select { border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; }
.req-cards { display: grid; gap: 8px; max-height: 560px; overflow-y: auto; }
.req-card { display: grid; gap: 4px; text-align: left; border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; background: #f8fbfe; }
.req-card.selected { border-color: #1e6fd9; background: #edf5ff; }
.req-head { display: flex; justify-content: space-between; align-items: center; }
.req-head strong { font-size: 15px; }
.req-card span { color: #64748b; font-size: 12px; }
.req-foot { display: flex; justify-content: space-between; align-items: center; margin-top: 4px; }
.info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 0 0 18px; }
.info-grid div { display: flex; justify-content: space-between; border-bottom: 1px solid #e7edf4; padding-bottom: 8px; }
.info-grid dt { color: #64748b; font-size: 13px; }
.info-grid dd { margin: 0; font-weight: 800; font-size: 13px; }
.check-block { margin-bottom: 16px; }
.check-block h3 { margin: 0 0 8px; font-size: 14px; color: #53657c; }
.check-result { display: flex; align-items: center; gap: 12px; border-radius: 8px; padding: 14px; }
.check-result.ok { background: #e8f8ef; }
.check-result.danger { background: #ffe8eb; }
.check-result span { width: 28px; height: 28px; border-radius: 50%; display: grid; place-items: center; font-weight: 900; }
.check-result.ok span { color: #11734d; background: #dff6e8; }
.check-result.danger span { color: #b4232d; background: #ffe1e3; }
.check-result strong { display: block; font-size: 14px; }
.check-result p { margin: 4px 0 0; font-size: 12px; color: #64748b; }
.budget-warn { border: 1px solid #f3c2c6; border-radius: 8px; padding: 12px; background: #fff5f6; color: #b4232d; font-size: 13px; }
.action-area { margin-top: 8px; }
.action-area .primary { width: 100%; padding: 12px; font-size: 15px; }
@media (max-width: 900px) { .review-layout { grid-template-columns: 1fr; } .info-grid { grid-template-columns: 1fr; } }
</style>
