<template>
  <section class="rm-view"><ViewHeading eyebrow="P1 · 门岗管理" title="放行管理" title-id="rm-title" description="根据核验结果执行放行或拒绝，记录放行时间、车辆信息。"/>
    <div class="rm-grid">
      <div class="rm-card"><span class="card-title">⏳ 待处理</span>
        <div v-if="rm.pendingVehicles.length===0" class="empty">暂无待处理车辆</div>
        <div v-for="v in rm.pendingVehicles" :key="v.id" class="pending-row" :class="'result-'+v.checkResult">
          <div><strong>{{ v.plate }}</strong><small>{{ v.checkResult==='pass'?'核验通过':'核验不通过' }}</small></div>
          <div class="pending-actions"><button v-if="v.checkResult==='pass'" class="primary-btn sm" @click="release(v)">放行</button><button v-else class="danger-btn sm" @click="reject(v)">拒绝</button></div>
        </div>
      </div>
      <div class="rm-card"><span class="card-title">📋 放行日志</span>
        <div v-for="l in rm.releaseLog" :key="l.id" class="log-row"><span class="log-badge" :class="l.action==='放行'?'pass':'reject'">{{ l.action }}</span><strong>{{ l.plate }}</strong><span class="log-time">{{ l.time }}</span><span>{{ l.operator }}</span></div>
      </div>
    </div>
  </section>
</template>
<script setup>import ViewHeading from '../components/ViewHeading.vue';import { releaseMock as rm } from '../data/remainingMocks'
function release(v){alert(`放行：${v.plate}`)}
function reject(v){alert(`拒绝：${v.plate} — ${v.reason||'核验不通过'}`)}
</script>
<style scoped>
.rm-view{margin-top:16px}.rm-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.rm-card{border:1px solid #e2e8f0;border-radius:10px;background:#fff;padding:16px 18px}.card-title{display:block;margin-bottom:12px;font-weight:800;font-size:13px;color:#0f172a}
.empty{padding:30px;text-align:center;color:#94a3b8;font-size:13px}
.pending-row{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:8px;margin-bottom:6px}.pending-row.result-pass{background:#f0fdf4}.pending-row.result-reject{background:#fef2f2}.pending-row strong{font-size:14px;color:#0f172a}.pending-row small{display:block;font-size:11px;color:#64748b}
.pending-actions{display:flex;gap:6px}.primary-btn.sm,.danger-btn.sm{padding:5px 14px;border:none;border-radius:6px;font-weight:800;font-size:12px;cursor:pointer}.primary-btn.sm{background:#1d4ed8;color:#fff}.danger-btn.sm{background:#dc2626;color:#fff}
.log-row{display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #f8fafc;font-size:13px}.log-badge{padding:1px 8px;border-radius:8px;font-size:10px;font-weight:800}.log-badge.pass{background:#dcfce7;color:#16a34a}.log-badge.reject{background:#fee2e2;color:#dc2626}.log-time{color:#94a3b8;margin-left:auto}
@media(max-width:700px){.rm-grid{grid-template-columns:1fr}}
</style>
