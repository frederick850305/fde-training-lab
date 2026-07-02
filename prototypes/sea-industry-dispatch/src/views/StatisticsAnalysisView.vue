<template>
  <section class="statistics-view" aria-labelledby="stats-title">
    <ViewHeading
      eyebrow="P1 Prototype Page · 管理分析"
      title="统计分析"
      title-id="stats-title"
      description="车辆利用率、任务完成率、平均等待时长、空驶率、排队情况、外协车辆使用次数等核心统计指标的图表展示。"
    />

    <!-- KPI 卡片 -->
    <div class="kpi-grid">
      <article v-for="kpi in kpiCards" :key="kpi.key" class="kpi-card">
        <span class="kpi-label">{{ kpi.label }}</span>
        <strong class="kpi-value">{{ kpi.value }}</strong>
        <div class="kpi-change" :class="'trend-' + kpi.trend">
          <span>{{ kpi.change }}</span>
        </div>
        <small>{{ kpi.helper }}</small>
      </article>
    </div>

    <!-- 图表区 -->
    <div class="chart-grid">
      <!-- 每日任务统计柱状图 -->
      <div class="chart-card">
        <span class="chart-title">📊 每日任务统计（近7天）</span>
        <div class="bar-chart">
          <div v-for="d in dailyStats" :key="d.date" class="bar-group">
            <div class="bars">
              <div class="bar bar-completed" :style="{ height: d.completed * 1.8 + 'px' }" :title="'完成: ' + d.completed"></div>
              <div class="bar bar-pending" :style="{ height: d.pending * 1.8 + 'px' }" :title="'待执行: ' + d.pending"></div>
              <div class="bar bar-cancelled" :style="{ height: d.cancelled * 1.8 + 'px' }" :title="'取消: ' + d.cancelled"></div>
            </div>
            <span class="bar-label">{{ d.date }}</span>
          </div>
        </div>
        <div class="chart-legend">
          <span><i class="dot" style="background:#16a34a"></i> 已完成</span>
          <span><i class="dot" style="background:#d97706"></i> 待执行</span>
          <span><i class="dot" style="background:#94a3b8"></i> 已取消</span>
        </div>
      </div>

      <!-- 告警分布 -->
      <div class="chart-card">
        <span class="chart-title">🚨 告警类型分布</span>
        <div class="hbar-list">
          <div v-for="a in alertSummary" :key="a.type" class="hbar-item">
            <div class="hbar-label">
              <span>{{ a.type }}</span>
              <strong>{{ a.count }}次</strong>
            </div>
            <div class="hbar-track">
              <div class="hbar-fill" :style="{ width: a.ratio, background: a.color }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 车辆类型统计 -->
    <div class="chart-card full-width">
      <span class="chart-title">🚛 车辆类型分布（共 {{ totalVehicles }} 辆）</span>
      <div class="type-grid">
        <div v-for="v in vehicleTypeStats" :key="v.type" class="type-card">
          <span class="type-name">{{ v.type }}</span>
          <strong>{{ v.total }} 辆</strong>
          <div class="type-bars">
            <div class="type-segment active" :style="{ flex: v.active }" title="运行中">{{ v.active }}</div>
            <div class="type-segment idle" :style="{ flex: v.idle }" title="空闲">{{ v.idle }}</div>
            <div class="type-segment maint" :style="{ flex: v.maintenance }" title="维修">{{ v.maintenance }}</div>
          </div>
          <div class="type-legend">
            <span><i class="dot" style="background:#16a34a"></i>运行</span>
            <span><i class="dot" style="background:#94a3b8"></i>空闲</span>
            <span><i class="dot" style="background:#dc2626"></i>维修</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 区域效率排名 -->
    <div class="chart-card full-width">
      <span class="chart-title">📍 区域作业效率排名</span>
      <table class="area-table">
        <thead>
          <tr><th>区域</th><th>任务量</th><th>平均耗时</th><th>效率评分</th><th>进度</th></tr>
        </thead>
        <tbody>
          <tr v-for="a in areaStats" :key="a.area">
            <td><strong>{{ a.area }}</strong></td>
            <td>{{ a.taskCount }}</td>
            <td>{{ a.avgDuration }}</td>
            <td>
              <span class="eff-badge" :class="a.efficiency >= 90 ? 'high' : a.efficiency >= 80 ? 'mid' : 'low'">
                {{ a.efficiency }}分
              </span>
            </td>
            <td>
              <div class="eff-bar">
                <div class="eff-fill" :style="{ width: a.efficiency + '%', background: a.efficiency >= 90 ? '#16a34a' : a.efficiency >= 80 ? '#d97706' : '#dc2626' }"></div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'
import {
  alertSummary,
  areaStats,
  dailyStats,
  kpiCards,
  vehicleTypeStats,
} from '../data/statisticsMock'

const totalVehicles = computed(() =>
  vehicleTypeStats.reduce((sum, v) => sum + v.total, 0),
)
</script>

<style scoped>
.statistics-view { margin-top: 16px; }

/* KPI */
.kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
.kpi-card {
  padding: 16px; border: 1px solid #e2e8f0; border-radius: 10px;
  background: #fff; text-align: center;
}
.kpi-label { font-size: 12px; color: #64748b; font-weight: 700; }
.kpi-value { display: block; margin: 6px 0 4px; font-size: 28px; color: #0f172a; }
.kpi-change { font-size: 12px; font-weight: 800; }
.kpi-change.trend-up { color: #16a34a; }
.kpi-change.trend-down { color: #dc2626; }
.kpi-card small { display: block; margin-top: 4px; font-size: 11px; color: #94a3b8; }

/* 图表网格 */
.chart-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }

.chart-card {
  border: 1px solid #e2e8f0; border-radius: 10px;
  background: #fff; padding: 16px 18px;
}
.chart-card.full-width { grid-column: 1 / -1; margin-bottom: 14px; }
.chart-title {
  display: block; margin-bottom: 14px;
  color: #0f172a; font-size: 14px; font-weight: 800;
}

/* 柱状图 */
.bar-chart {
  display: flex; align-items: flex-end; gap: 10px;
  height: 140px; padding: 0 4px;
}
.bar-group { display: flex; flex-direction: column; align-items: center; gap: 6px; flex: 1; }
.bars { display: flex; gap: 3px; align-items: flex-end; height: 100px; }
.bar { width: 14px; border-radius: 3px 3px 0 0; transition: height 0.3s; }
.bar-completed { background: #16a34a; }
.bar-pending { background: #d97706; }
.bar-cancelled { background: #94a3b8; }
.bar-label { font-size: 10px; color: #94a3b8; font-weight: 700; }
.chart-legend { display: flex; gap: 14px; margin-top: 10px; font-size: 11px; color: #64748b; }
.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 3px; }

/* 水平柱状图 */
.hbar-list { display: grid; gap: 10px; }
.hbar-item { display: grid; gap: 4px; }
.hbar-label { display: flex; justify-content: space-between; font-size: 12px; color: #475569; }
.hbar-label strong { color: #0f172a; }
.hbar-track { height: 8px; border-radius: 4px; background: #f1f5f9; overflow: hidden; }
.hbar-fill { height: 100%; border-radius: 4px; transition: width 0.3s; }

/* 车辆类型 */
.type-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.type-card {
  padding: 14px; border: 1px solid #f1f5f9; border-radius: 8px;
  background: #f8fafc; text-align: center;
}
.type-name { font-size: 12px; color: #64748b; font-weight: 700; }
.type-card strong { display: block; margin: 4px 0 8px; font-size: 22px; color: #0f172a; }
.type-bars { display: flex; height: 8px; border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.type-segment.active { background: #16a34a; }
.type-segment.idle { background: #94a3b8; }
.type-segment.maint { background: #dc2626; }
.type-legend { display: flex; justify-content: center; gap: 10px; font-size: 10px; color: #94a3b8; }

/* 区域表格 */
.area-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.area-table th {
  padding: 8px 12px; background: #f8fafc; color: #94a3b8;
  font-weight: 700; text-align: left; border-bottom: 1px solid #e2e8f0;
}
.area-table td { padding: 8px 12px; border-bottom: 1px solid #f8fafc; color: #475569; }
.area-table strong { color: #0f172a; }
.eff-badge {
  display: inline-block; padding: 2px 8px; border-radius: 10px;
  font-size: 11px; font-weight: 800;
}
.eff-badge.high { background: #dcfce7; color: #16a34a; }
.eff-badge.mid { background: #fef3c7; color: #d97706; }
.eff-badge.low { background: #fee2e2; color: #dc2626; }
.eff-bar { width: 100px; height: 6px; border-radius: 3px; background: #f1f5f9; overflow: hidden; }
.eff-fill { height: 100%; border-radius: 3px; }

@media (max-width: 820px) {
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .chart-grid { grid-template-columns: 1fr; }
  .type-grid { grid-template-columns: repeat(2, 1fr); }
}
</style>
