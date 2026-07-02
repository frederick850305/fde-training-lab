<template>
  <section class="ap-view"><ViewHeading eyebrow="P1 · 门岗管理" title="门岗告警" title-id="ap-title" description="处理未授权入场、证照过期等门岗告警，支持确认、解除与上报。"/>
    <div v-if="ap.gateAlerts.length===0" class="empty">✅ 暂无门岗告警</div>
    <div v-for="a in ap.gateAlerts" :key="a.id" class="alert-card">
      <div class="alert-main"><span class="severity-dot"></span><div><strong>{{ a.type }}</strong><p>{{ a.description }}</p><div class="meta"><span>🚛 {{ a.plate }}</span><span>🕐 {{ a.time }}</span></div></div></div>
      <div class="alert-actions"><button class="action-btn confirm">✓ 确认</button><button class="action-btn report">📢 上报</button><button class="action-btn dismiss">⊘ 解除</button></div>
    </div>
  </section>
</template>
<script setup>import ViewHeading from '../components/ViewHeading.vue';import { alertPanelMock as ap } from '../data/remainingMocks'</script>
<style scoped>
.ap-view{margin-top:16px}.empty{text-align:center;padding:40px;color:#94a3b8;border:1px solid #e2e8f0;border-radius:10px;background:#fff}
.alert-card{border:1px solid #e2e8f0;border-radius:8px;background:#fff;margin-bottom:8px;overflow:hidden}.alert-card{border-left:4px solid #dc2626}
.alert-main{display:flex;align-items:flex-start;gap:10px;padding:12px 16px}.severity-dot{width:10px;height:10px;border-radius:50%;background:#dc2626;margin-top:4px;flex-shrink:0}.alert-main strong{font-size:14px;color:#0f172a}.alert-main p{margin:4px 0;font-size:12px;color:#475569}.meta{display:flex;gap:12px;font-size:11px;color:#94a3b8}
.alert-actions{display:flex;gap:6px;padding:0 16px 12px}.action-btn{padding:4px 14px;border:1px solid #e2e8f0;border-radius:6px;background:#fff;font-size:12px;font-weight:700;cursor:pointer}.action-btn.confirm{border-color:#16a34a;color:#16a34a}.action-btn.report{border-color:#d97706;color:#d97706}.action-btn.dismiss{border-color:#94a3b8;color:#64748b}
</style>
