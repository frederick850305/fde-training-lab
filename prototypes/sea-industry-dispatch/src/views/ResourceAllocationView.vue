<template>
  <section class="ra-view"><ViewHeading eyebrow="P1 · 管理分析" title="资源配置" title-id="ra-title" description="基于历史数据提供车辆资源配置优化建议和外协费用管理参考。"/>
    <div class="ra-grid">
      <div class="ra-card"><span class="card-title">💡 配置建议</span>
        <div v-for="r in res.recommendations" :key="r.type" class="rec-item"><div class="rec-head"><strong>{{ r.type }}</strong><span class="rec-pri" :class="'p-'+r.priority">{{ {high:'高',medium:'中',low:'低'}[r.priority] }}</span></div><div class="rec-nums">当前 <strong>{{ r.current }}</strong> 辆 → 建议 <strong style="color:#1d4ed8">{{ r.suggested }}</strong> 辆</div><p class="rec-reason">{{ r.reason }}</p></div>
      </div>
      <div class="ra-card"><span class="card-title">💰 费用对比</span>
        <div class="cost-chart">
          <div v-for="c in res.costSummary" :key="c.month" class="cost-row"><span class="cost-month">{{ c.month }}</span><div class="cost-bars"><div class="cost-bar internal" :style="{width:(c.internalCost/35*100)+'%'}">{{ c.internalCost }}万</div><div class="cost-bar external" :style="{width:(c.externalCost/35*100)+'%'}">{{ c.externalCost }}万</div></div></div>
        </div>
        <div class="legend"><span><i class="ldot" style="background:#1d4ed8"></i>内部车辆</span><span><i class="ldot" style="background:#d97706"></i>外协费用</span></div>
      </div>
    </div>
  </section>
</template>
<script setup>import ViewHeading from '../components/ViewHeading.vue';import {resourceMock as res}from'../data/remainingMocks'</script>
<style scoped>
.ra-view{margin-top:16px}.ra-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ra-card{border:1px solid #e2e8f0;border-radius:10px;background:#fff;padding:16px 18px}.card-title{display:block;margin-bottom:12px;font-weight:800;font-size:13px;color:#0f172a}
.rec-item{padding:12px;border:1px solid #f1f5f9;border-radius:8px;margin-bottom:8px}.rec-head{display:flex;justify-content:space-between;align-items:center}.rec-head strong{font-size:14px}.rec-pri{padding:1px 8px;border-radius:8px;font-size:10px;font-weight:800}.rec-pri.p-high{background:#fee2e2;color:#dc2626}.rec-pri.p-medium{background:#fef3c7;color:#d97706}.rec-pri.p-low{background:#dcfce7;color:#16a34a}
.rec-nums{font-size:13px;color:#475569;margin:4px 0}.rec-reason{font-size:12px;color:#94a3b8;margin:4px 0 0}
.cost-row{display:flex;align-items:center;gap:10px;margin-bottom:10px}.cost-month{font-size:12px;font-weight:800;color:#0f172a;width:30px}
.cost-bars{flex:1;display:flex;gap:4px;height:24px}.cost-bar{display:flex;align-items:center;padding:0 6px;border-radius:4px;font-size:11px;font-weight:700;color:#fff;min-width:60px}.cost-bar.internal{background:#1d4ed8}.cost-bar.external{background:#d97706}
.legend{display:flex;gap:14px;margin-top:8px;font-size:11px;color:#64748b}.ldot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:3px}
@media(max-width:700px){.ra-grid{grid-template-columns:1fr}}
</style>
