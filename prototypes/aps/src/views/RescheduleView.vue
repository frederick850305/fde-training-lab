<template>
  <div>
    <div class="panel wide">
      <div class="panel-head"><h3>预置异常场景</h3><span class="sub">点击场景模拟 APS 影响评估与重排</span></div>
      <div class="scenario-grid">
        <button
          v-for="s in exceptionScenarios"
          :key="s.key"
          class="scenario-card"
          :class="{ active: activeKey === s.key }"
          @click="run(s.key)"
        >
          <span class="sc-icon">{{ s.icon }}</span>
          <strong>{{ s.name }}</strong>
          <small>{{ s.profession }}专业</small>
        </button>
      </div>
    </div>

    <div v-if="result" class="content-grid">
      <div class="panel">
        <div class="panel-head"><h3>异常影响</h3><StatusTag status="高" :label="result.scenario" /></div>
        <ul class="clean-list warning">
          <li><strong>受影响任务：</strong>{{ result.affectedTasks.join('、') }}</li>
          <li><strong>影响路径：</strong>{{ result.impactPath }}</li>
          <li><strong>预计延期：</strong>{{ result.delayDays }} 天</li>
        </ul>
        <button class="btn primary" style="margin-top:14px" @click="doReschedule">应用系统重排</button>
      </div>
      <div class="panel">
        <div class="panel-head"><h3>系统建议</h3></div>
        <ul class="clean-list">
          <li v-for="(s, i) in result.suggestions" :key="i">{{ s }}</li>
        </ul>
      </div>
    </div>

    <div v-if="displayTasks.length" class="panel wide" style="margin-top:16px">
      <div class="panel-head">
        <h3>{{ result ? '调整后甘特图（模拟重排）' : '当前甘特图' }}</h3>
        <div class="filter-chips">
          <button :class="{ active: viewBy === 'resource' }" @click="viewBy = 'resource'">按资源</button>
          <button :class="{ active: viewBy === 'profession' }" @click="viewBy = 'profession'">按专业</button>
          <button :class="{ active: viewBy === 'package' }" @click="viewBy = 'package'">按施工包</button>
        </div>
      </div>
      <GanttChart :tasks="displayTasks" :view-by="viewBy" :today="today" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import GanttChart from '../components/GanttChart.vue'
import { simulateException, reschedule, exceptionScenarios, ganttTasks } from '../mock/index.js'

const today = '2026-10-09'
const viewBy = ref('resource')
const activeKey = ref(null)
const result = ref(null)
const displayTasks = ref([])

function run(key) {
  activeKey.value = key
  result.value = simulateException(key)
  displayTasks.value = result.value.adjustedGantt
}
function doReschedule() {
  const res = reschedule('JKT-001', activeKey.value)
  displayTasks.value = res.ganttTasks
  result.value = {
    ...result.value,
    scenario: res.message,
    affectedTasks: [],
    impactPath: `已基于约束重排，资源冲突由 ${res.summary.conflictBefore} 降为 ${res.summary.conflictAfter}`,
    delayDays: res.summary.delayDays,
    suggestions: ['资源冲突已消解，关键路径保持稳定', '建议持续监控焊工与涂装房负荷'],
  }
}
</script>

<style scoped>
.scenario-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px; }
.scenario-card { display: grid; gap: 6px; text-align: left; border: 1px solid #d9e4ef; border-radius: 12px; padding: 16px; background: #fff; transition: border-color .15s, box-shadow .15s; }
.scenario-card:hover { border-color: #1e6fd9; box-shadow: 0 6px 18px rgba(30,111,217,.12); }
.scenario-card.active { border-color: #1e6fd9; background: #eef5ff; }
.sc-icon { font-size: 22px; }
.scenario-card strong { font-size: 14px; color: #132039; }
.scenario-card small { color: #8194a8; font-size: 12px; }
</style>
