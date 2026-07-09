<template>
  <div>
    <section class="kpi-grid" style="margin-bottom:16px">
      <KpiCard label="任务总数" :value="stats.taskCount" tone="blue" />
      <KpiCard label="资源冲突" :value="stats.conflictCount" tone="red" :sub="mode === 'sim' ? '异常模拟后' : ''" />
      <KpiCard label="关键路径任务" :value="stats.criticalTaskCount" tone="violet" />
      <KpiCard label="齐套风险" :value="stats.kittingRiskCount" tone="amber" />
    </section>

    <div class="panel wide">
      <div class="panel-head">
        <h3>短期甘特排程（未来 {{ windowDays }} 天）</h3>
        <div class="gantt-tools">
          <div class="filter-chips">
            <button :class="{ active: viewBy === 'workorder' }" @click="viewBy = 'workorder'">按工单</button>
            <button :class="{ active: viewBy === 'profession' }" @click="viewBy = 'profession'">按专业</button>
            <button :class="{ active: viewBy === 'package' }" @click="viewBy = 'package'">按施工包</button>
          </div>
          <select v-model="scenarioKey" class="mini-select">
            <option v-for="s in exceptionScenarios" :key="s.key" :value="s.key">{{ s.name }}</option>
          </select>
          <button class="btn" @click="runSchedule">运行排程</button>
          <button class="btn" @click="simulate">模拟异常</button>
          <button class="btn primary" @click="doReschedule">重排</button>
          <button class="btn ghost" v-if="mode !== 'base'" @click="reset">重置</button>
          <div class="rg-badges" v-if="viewBy === 'workorder'">
            <span class="rg-badge conflict"><i></i>冲突 {{ stats.conflictCount }}</span>
            <span class="rg-badge delay"><i></i>延期 {{ stats.delayCount }}</span>
          </div>
        </div>
      </div>

      <ResourceGantt v-if="viewBy === 'workorder'" :tasks="displayTasks" :today="today" group-by="resource" />
      <GanttChart v-else :tasks="displayTasks" :view-by="viewBy" :today="today" @select="onSelect" />

      <div class="legend" v-if="viewBy !== 'workorder'">
        <span><i class="lg blue"></i>已排程</span>
        <span><i class="lg green"></i>执行中</span>
        <span><i class="lg gray"></i>已完成</span>
        <span><i class="lg yellow"></i>齐套风险</span>
        <span><i class="lg red"></i>资源冲突</span>
        <span><i class="lg purple"></i>关键路径</span>
        <span><i class="lg orange"></i>外协</span>
      </div>

      <div v-if="selected" class="task-detail">
        <strong>{{ selected.name }}</strong>
        <span class="muted">| 专业：{{ selected.profession }} | 资源：{{ selected.resource }} | 施工包：{{ selected.pkg }} | 工单：{{ selected.wo }}</span>
        <span class="muted">| {{ selected.start }} ~ {{ selected.end }} | <StatusTag :status="selected.status" /></span>
      </div>
    </div>

    <div class="content-grid" v-if="mode === 'sim' && simResult">
      <div class="panel">
        <div class="panel-head"><h3>异常影响分析</h3><StatusTag status="高" :label="simResult.scenario" /></div>
        <ul class="clean-list warning">
          <li><strong>受影响任务：</strong>{{ simResult.affectedTasks.join('、') }}</li>
          <li><strong>影响路径：</strong>{{ simResult.impactPath }}</li>
          <li><strong>预计延期：</strong>{{ simResult.delayDays }} 天</li>
        </ul>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>系统重排建议</h3></div>
        <ul class="clean-list">
          <li v-for="(s, i) in simResult.suggestions" :key="i">{{ s }}</li>
        </ul>
      </div>
    </div>

    <div class="panel wide" v-if="mode === 'reschedule' && resResult">
      <div class="panel-head"><h3>重排结果</h3><StatusTag status="正常" :label="resResult.message" /></div>
      <div class="summary-strip">
        <span>重排前冲突：<strong>{{ resResult.summary.conflictBefore }}</strong></span>
        <span>重排后冲突：<strong class="ok">{{ resResult.summary.conflictAfter }}</strong></span>
        <span>延期天数：<strong>{{ resResult.summary.delayDays }}</strong></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import KpiCard from '../components/KpiCard.vue'
import StatusTag from '../components/StatusTag.vue'
import GanttChart from '../components/GanttChart.vue'
import ResourceGantt from '../components/ResourceGantt.vue'
import {
  ganttTasks, ganttStats, ganttBaseDate, ganttWindowDays,
  runShortTerm, simulateException, reschedule, exceptionScenarios,
} from '../mock/index.js'

const viewBy = ref('workorder')
const today = '2026-10-09'
const windowDays = ganttWindowDays
const scenarioKey = ref(exceptionScenarios[2].key)
const selected = ref(null)

const mode = ref('base') // base | sim | reschedule
const simResult = ref(null)
const resResult = ref(null)
const ran = ref(false)

const displayTasks = computed(() => {
  if (mode.value === 'sim' && simResult.value) return simResult.value.adjustedGantt
  if (mode.value === 'reschedule' && resResult.value) return resResult.value.ganttTasks
  return ganttTasks
})

const stats = computed(() => {
  if (mode.value === 'sim' && simResult.value) {
    const t = simResult.value.adjustedGantt
    return {
      taskCount: t.length,
      conflictCount: t.filter((x) => x.status === '资源冲突').length,
      delayCount: t.filter((x) => x.status === '延期').length,
      criticalTaskCount: t.filter((x) => x.critical).length,
      kittingRiskCount: t.filter((x) => x.status === '齐套风险').length,
    }
  }
  if (mode.value === 'reschedule' && resResult.value) {
    const t = resResult.value.ganttTasks
    return {
      ...ganttStats,
      conflictCount: t.filter((x) => x.status === '资源冲突').length,
      delayCount: t.filter((x) => x.status === '延期').length,
    }
  }
  return ganttStats
})

function onSelect(t) {
  selected.value = t
}
function runSchedule() {
  runShortTerm('JKT-001', '35d', 'normal')
  ran.value = true
  mode.value = 'base'
}
function simulate() {
  simResult.value = simulateException(scenarioKey.value)
  mode.value = 'sim'
}
function doReschedule() {
  resResult.value = reschedule('JKT-001', mode.value === 'sim' ? scenarioKey.value : null)
  mode.value = 'reschedule'
}
function reset() {
  mode.value = 'base'
  simResult.value = null
  resResult.value = null
  selected.value = null
}
</script>

<style scoped>
.gantt-tools { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.mini-select { border: 1px solid #cfdae6; border-radius: 8px; padding: 7px 10px; background: #f6f9fc; font-weight: 700; color: #24415f; }
.legend { display: flex; gap: 16px; flex-wrap: wrap; margin-top: 12px; font-size: 12px; color: #64748b; }
.legend i.lg { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 5px; vertical-align: -1px; }
.lg.blue { background: #2f7fe0; } .lg.green { background: #1f9d63; } .lg.gray { background: #93a4b5; }
.lg.yellow { background: #e0a92b; } .lg.red { background: #d64b54; } .lg.purple { background: #8b5cf6; } .lg.orange { background: #e8853a; }
.task-detail { margin-top: 12px; padding: 10px 14px; background: #f5f8fb; border-radius: 8px; font-size: 13px; display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.summary-strip { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 14px; color: #53657c; font-size: 13px; }
.summary-strip .ok { color: #1f9d63; }
.rg-badges { display: flex; gap: 8px; align-items: center; margin-left: auto; }
.rg-badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: 700; }
.rg-badge.conflict { background: #fee2e2; color: #b91c1c; }
.rg-badge.delay { background: #fef3c7; color: #b45309; }
.rg-badge i { width: 7px; height: 7px; border-radius: 50%; }
.rg-badge.conflict i { background: #ef4444; }
.rg-badge.delay i { background: #f59e0b; }
</style>
