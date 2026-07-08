<template>
  <div class="dash">
    <section class="kpi-grid">
      <KpiCard v-for="k in project.kpis" :key="k.label" :label="k.label" :value="k.value" :sub="k.sub" :tone="k.tone" />
    </section>

    <div class="content-grid">
      <div class="panel">
        <div class="panel-head">
          <h3>项目里程碑</h3>
          <span class="sub">{{ project.planStart }} → {{ project.planEnd }}</span>
        </div>
        <ProgressTimeline :milestones="project.milestones" />
      </div>

      <div class="panel">
        <div class="panel-head"><h3>交付风险卡片</h3></div>
        <div class="risk-list">
          <RiskCard
            v-for="r in project.recentRisks"
            :key="r.title"
            :level="r.level"
            :title="r.title"
            :desc="r.desc"
            :type="r.time"
            :impact="r.level === '高' ? '需立即处置' : '计划跟踪'"
          />
        </div>
      </div>
    </div>

    <div class="content-grid">
      <div class="panel">
        <div class="panel-head"><h3>专业进度</h3><span class="sub">导管架 / 管线 / 舾装 / 涂装 / 总装</span></div>
        <div class="prog-list">
          <div v-for="p in project.professionProgress" :key="p.name" class="prog-row">
            <span class="prog-name">{{ p.name }}</span>
            <div class="prog-track"><div class="prog-fill" :class="p.tone" :style="{ width: p.value + '%' }"></div></div>
            <span class="prog-val">{{ p.value }}%</span>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-head"><h3>瓶颈资源</h3><span class="sub">负荷率 Top5</span></div>
        <div class="prog-list">
          <div v-for="b in project.bottleneckResources" :key="b.name" class="prog-row">
            <span class="prog-name">{{ b.name }}</span>
            <div class="prog-track"><div class="prog-fill" :class="b.load > 130 ? 'red' : b.load > 100 ? 'orange' : 'blue'" :style="{ width: Math.min(b.load, 160) / 160 * 100 + '%' }"></div></div>
            <span class="prog-val">{{ b.load }}%</span>
          </div>
        </div>
        <p class="note" style="margin-top:12px">提示：高级焊工、NDT、涂装房、总装场地处于严重超负荷，建议在「中期负荷计划」中查看调优建议。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import KpiCard from '../components/KpiCard.vue'
import RiskCard from '../components/RiskCard.vue'
import ProgressTimeline from '../components/ProgressTimeline.vue'
import { project } from '../mock/index.js'
</script>

<style scoped>
.dash { display: grid; gap: 18px; }
.risk-list { display: grid; gap: 10px; }
.prog-list { display: grid; gap: 14px; }
.prog-row { display: grid; grid-template-columns: 92px 1fr 48px; align-items: center; gap: 10px; }
.prog-name { font-size: 13px; color: #3e5068; font-weight: 700; }
.prog-track { height: 12px; background: #eef2f6; border-radius: 999px; overflow: hidden; }
.prog-fill { height: 100%; border-radius: 999px; }
.prog-fill.blue { background: #2f7fe0; } .prog-fill.cyan { background: #2bb3c0; }
.prog-fill.green { background: #1f9d63; } .prog-fill.orange { background: #e8853a; }
.prog-fill.violet { background: #8b5cf6; } .prog-fill.red { background: #d64b54; }
.prog-val { font-size: 13px; font-weight: 800; color: #24415f; text-align: right; }
</style>
