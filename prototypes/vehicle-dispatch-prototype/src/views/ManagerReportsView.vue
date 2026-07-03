<template>
  <section class="page-grid reports-view">
    <header class="page-header">
      <div>
        <span class="eyebrow">报表分析</span>
        <h1>运营报表与资源优化</h1>
        <p>管理人员查看车辆利用率、任务完成率、空驶率、外协使用和异常入场趋势。</p>
      </div>
      <div class="header-actions">
        <select v-model="metric">
          <option>利用率</option>
          <option>故障率</option>
          <option>外协费用</option>
        </select>
        <button class="secondary-btn" type="button" @click="exportReport('Excel')">导出 Excel</button>
        <button class="primary-btn" type="button" @click="generateAdvice">生成建议</button>
      </div>
    </header>

    <section class="kpi-grid full-row">
      <KpiCard label="总车辆数" :value="128" unit="台" trend-text="较上周 +6 台" @select="drill('总车辆数')" />
      <KpiCard label="车辆利用率" :value="82" unit="%" trend-text="较昨日 +4%" @select="drill('车辆利用率')" />
      <KpiCard label="任务完成率" :value="95" unit="%" trend-text="稳定" @select="drill('任务完成率')" />
      <KpiCard label="空驶率" :value="12" unit="%" trend-text="较昨日 -2%" trend-direction="down" @select="drill('空驶率')" />
    </section>

    <section class="panel chart-panel">
      <div class="panel-title">
        <strong>运营趋势</strong>
        <span>{{ metric }}</span>
      </div>
      <div class="bar-chart">
        <button
          v-for="row in reportRows"
          :key="row.date"
          type="button"
          :style="{ height: row.vehicleUtilizationRate + '%' }"
          @click="selectedDate = row.date"
        >
          <span>{{ row.vehicleUtilizationRate }}%</span>
          <small>{{ row.date }}</small>
        </button>
      </div>
    </section>

    <section class="panel">
      <div class="panel-title">
        <strong>资源分布</strong>
        <span>外协与异常入场</span>
      </div>
      <div class="donut-grid">
        <div class="donut">
          <strong>23</strong>
          <span>外协车辆使用</span>
        </div>
        <div class="recommend-list">
          <p>高峰集中在 09:00-11:00，建议提前锁定 8 台生产车。</p>
          <p>门岗南区异常入场下降，预约核验链路稳定。</p>
          <p>码头堆场空驶率偏高，可合并低优先级配送任务。</p>
        </div>
      </div>
    </section>

    <section class="panel full-row">
      <div class="panel-title">
        <strong>明细表格</strong>
        <span>点击图表可下钻日期：{{ selectedDate || '未选择' }}</span>
      </div>
      <DataTable :columns="reportColumns" :rows="reportRows" row-key="date" />
    </section>

    <aside v-if="advice" class="decision-panel">
      <strong>决策建议报告</strong>
      <p>{{ advice }}</p>
      <button class="secondary-btn" type="button" @click="exportReport('PDF')">导出 PDF</button>
    </aside>

    <div v-if="toast" class="toast">{{ toast }}</div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from '../components/DataTable.vue'
import KpiCard from '../components/KpiCard.vue'
import { reportRows } from '../data/mockData'

const metric = ref('利用率')
const selectedDate = ref('')
const advice = ref('')
const toast = ref('')

const reportColumns = [
  { key: 'date', label: '日期' },
  { key: 'vehicleUtilizationRate', label: '利用率%' },
  { key: 'taskCompletionRate', label: '完成率%' },
  { key: 'emptyDrivingRate', label: '空驶率%' },
  { key: 'outsourceVehicleCount', label: '外协次数' },
  { key: 'abnormalEntryCount', label: '异常入场' },
]

function drill(label) {
  toast.value = `已下钻查看 ${label} 的明细趋势。`
}

function exportReport(format) {
  toast.value = `${format} 报表已生成，可在下载中心查看。`
}

function generateAdvice() {
  advice.value = '建议将总装一区与码头堆场任务按 30 分钟窗口合并派发；对外协车辆设置预约到场缓冲；对空驶率超过 15% 的线路启用调度复核。'
}
</script>
