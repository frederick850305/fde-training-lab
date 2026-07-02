<template>
  <section class="nav-view"><ViewHeading eyebrow="P1 · 司机端" title="导航" title-id="nav-title" description="从当前位置导航至指定作业点，实时路径和预计到达时间。"/>
    <div class="nav-card">
      <div class="nav-map"><div class="nav-route"><div class="route-start">📍 当前位置</div><div class="route-path"></div><div class="route-end">📍 {{ nav.destination }}</div></div></div>
      <div class="nav-info">
        <div class="nav-stat"><span>剩余距离</span><strong>{{ nav.remainingDistance }}</strong></div>
        <div class="nav-stat"><span>预计到达</span><strong style="color:#1d4ed8">{{ nav.eta }}</strong></div>
      </div>
      <div class="nav-steps"><span class="card-title">🧭 路径指引</span>
        <div v-for="(s,i) in nav.steps" :key="i" class="step"><span class="step-num">{{ i+1 }}</span><div><p>{{ s.instruction }}</p><small>{{ s.distance }}</small></div></div>
      </div>
      <div class="nav-actions"><button class="ghost-btn">结束导航</button><button class="primary-btn">重新规划</button></div>
    </div>
  </section>
</template>
<script setup>import ViewHeading from '../components/ViewHeading.vue';import { navigationMock as nav } from '../data/remainingMocks'</script>
<style scoped>
.nav-view{margin-top:16px}.nav-card{border:1px solid #e2e8f0;border-radius:10px;background:#fff;overflow:hidden}
.nav-map{height:200px;background:linear-gradient(135deg,#dbeafe,#eff6ff);display:flex;align-items:center;justify-content:center;border-bottom:1px solid #e2e8f0}
.nav-route{text-align:center}.route-start,.route-end{font-weight:800;font-size:14px;color:#0f172a}.route-path{width:2px;height:40px;background:#2563eb;margin:8px auto;position:relative}
.route-path::after{content:'';position:absolute;bottom:-4px;left:-3px;border:5px solid transparent;border-top-color:#2563eb}
.nav-info{display:flex;gap:16px;padding:14px 18px}.nav-stat{flex:1;text-align:center}.nav-stat span{display:block;font-size:11px;color:#94a3b8}.nav-stat strong{font-size:22px;color:#0f172a}
.nav-steps{padding:14px 18px;border-top:1px solid #f1f5f9}.card-title{display:block;margin-bottom:10px;font-weight:800;font-size:13px}.step{display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #f8fafc}.step-num{width:22px;height:22px;border-radius:50%;background:#2563eb;color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:900;flex-shrink:0}.step p{margin:0;font-size:13px;color:#0f172a}.step small{color:#94a3b8;font-size:11px}
.nav-actions{display:flex;gap:10px;justify-content:flex-end;padding:12px 18px;border-top:1px solid #e2e8f0;background:#fafbfc}
.primary-btn{padding:9px 20px;border:none;border-radius:8px;background:#1d4ed8;color:#fff;font-weight:800;cursor:pointer}.ghost-btn{padding:9px 18px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#475569;font-weight:700;cursor:pointer}
</style>
