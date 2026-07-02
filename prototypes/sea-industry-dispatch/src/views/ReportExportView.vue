<template>
  <section class="re-view"><ViewHeading eyebrow="P1 · 管理分析" title="报告导出" title-id="re-title" description="将统计分析结果导出为 Excel、PDF 等格式。"/>
    <div class="re-card">
      <div class="re-filters"><div class="fi"><label>日期范围</label><input type="date" :value="rpt.dateRange.from"/> — <input type="date" :value="rpt.dateRange.to"/></div><div class="fi"><label>导出格式</label><select><option v-for="f in rpt.formats" :key="f">{{ f }}</option></select></div></div>
      <span class="card-title">📊 可导出报告</span>
      <div v-for="r in rpt.availableReports" :key="r.name" class="re-item"><div><strong>{{ r.name }}</strong><small>{{ r.description }}</small></div><div class="re-right"><span>{{ r.size }}</span><button class="primary-btn sm" @click="exportReport(r.name)">导出</button></div></div>
    </div>
  </section>
</template>
<script setup>import ViewHeading from '../components/ViewHeading.vue';import {reportMock as rpt}from'../data/remainingMocks'
function exportReport(name){alert(`正在导出：${name}`)}
</script>
<style scoped>
.re-view{margin-top:16px}.re-card{border:1px solid #e2e8f0;border-radius:10px;background:#fff;padding:18px 20px}
.re-filters{display:flex;gap:16px;margin-bottom:16px;flex-wrap:wrap}.fi{display:grid;gap:4px}.fi label{font-size:12px;color:#64748b;font-weight:700}.fi input,.fi select{padding:6px 10px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;outline:none}
.card-title{display:block;margin-bottom:10px;font-weight:800;font-size:13px;color:#0f172a}
.re-item{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border:1px solid #f1f5f9;border-radius:8px;margin-bottom:6px}.re-item strong{font-size:14px;color:#0f172a;display:block}.re-item small{font-size:11px;color:#94a3b8}.re-right{display:flex;align-items:center;gap:10px}.re-right span{font-size:12px;color:#94a3b8}
.primary-btn.sm{padding:6px 14px;border:none;border-radius:6px;background:#1d4ed8;color:#fff;font-weight:800;cursor:pointer;font-size:12px}
</style>
