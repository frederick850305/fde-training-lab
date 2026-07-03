<template>
  <div class="management-reports-view">
    <!-- 顶部筛选区 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="true"
      @search="handleSearch"
    />

    <!-- 加载态 -->
    <div v-if="loadingState === 'loading'" class="loading-container">
      <div class="skeleton-card" v-for="i in 5" :key="i"></div>
      <div class="skeleton-chart"></div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="loadingState === 'error'" class="error-container">
      <p>加载失败，请重试</p>
      <button @click="retryLoad">重试</button>
    </div>

    <!-- 空态 -->
    <div v-else-if="loadingState === 'empty'" class="empty-container">
      <p>暂无统计数据</p>
      <p>请调整筛选条件后重新查询</p>
    </div>

    <!-- 成功态 -->
    <div v-else-if="loadingState === 'success'" class="content">
      <!-- 指标卡片区 -->
      <div class="indicator-cards">
        <div
          class="indicator-card"
          v-for="card in indicatorCards"
          :key="card.key"
          @click="drillDown(card)"
        >
          <div class="card-title">{{ card.label }}</div>
          <div class="card-value">{{ card.value }}</div>
          <div class="card-subtitle">{{ card.subtitle }}</div>
        </div>
      </div>

      <!-- 趋势图区域 -->
      <div class="trend-chart-area">
        <div class="chart-controls">
          <select v-model="selectedMetric" @change="loadTrendData">
            <option v-for="metric in metrics" :key="metric.key" :value="metric.key">{{ metric.label }}</option>
          </select>
          <select v-model="selectedGranularity" @change="loadTrendData">
            <option value="daily">按日</option>
            <option value="weekly">按周</option>
            <option value="monthly">按月</option>
          </select>
        </div>
        <div class="chart-placeholder">
          <!-- 实际原型中可替换为图表组件，此处用简单表格模拟 -->
          <table v-if="trendData.length">
            <tr>
              <th>时间</th>
              <th>数值</th>
            </tr>
            <tr v-for="item in trendData" :key="item.time" @click="pointClick(item)">
              <td>{{ item.time }}</td>
              <td>{{ item.value }}</td>
            </tr>
          </table>
          <p v-else>暂无趋势数据</p>
        </div>
      </div>

      <!-- 导出操作区 -->
      <div class="export-area">
        <button @click="exportExcel">导出Excel</button>
        <button @click="exportPDF">导出PDF</button>
        <select v-model="exportRange">
          <option value="all">全部数据</option>
          <option value="filtered">当前筛选</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from 'vue'
import DataFilterBar from '../components/DataFilterBar.vue'

// 注入上下文
const prototypeContext = inject('prototypeContext')
const currentRole = prototypeContext?.currentRole || 'manager'
const currentRoleKey = prototypeContext?.currentRoleKey || 'manager'

// 筛选配置
const filterConfig = [
  {
    type: 'dateRange',
    label: '时间范围',
    key: 'timeRange',
    placeholder: '选择时间'
  },
  {
    type: 'select',
    label: '车辆类型',
    key: 'vehicleType',
    options: [
      { label: '全部', value: '' },
      { label: '货车', value: 'truck' },
      { label: '挂车', value: 'trailer' },
      { label: '特种车', value: 'special' }
    ]
  },
  {
    type: 'select',
    label: '作业区域',
    key: 'area',
    options: [
      { label: '全部', value: '' },
      { label: 'A区', value: 'A' },
      { label: 'B区', value: 'B' },
      { label: 'C区', value: 'C' }
    ]
  }
]
const filterValues = ref({
  timeRange: [],
  vehicleType: '',
  area: ''
})

// 根据当前角色调整默认筛选（演示）
if (currentRoleKey === 'dispatcher') {
  filterValues.value.vehicleType = 'truck'
}

// 状态管理
const loadingState = ref('loading') // loading | success | empty | error
const indicatorCards = ref([])
const trendData = ref([])
const selectedMetric = ref('totalOrders')
const selectedGranularity = ref('daily')
const exportRange = ref('all')

// 指标配置
const metrics = [
  { key: 'totalOrders', label: '总订单数' },
  { key: 'completedRate', label: '完成率' },
  { key: 'onTimeRate', label: '准点率' },
  { key: 'avgTransitTime', label: '平均运输时长' },
  { key: 'exceptionCount', label: '异常次数' }
]

// 模拟从 API 获取数据（原型演示）
async function fetchOverview() {
  loadingState.value = 'loading'
  try {
    // 模拟异步请求，实际可替换为 fetch('/api/reports/overview')
    await new Promise(resolve => setTimeout(resolve, 500))
    // 模拟返回数据
    const mockResponse = {
      indicators: [
        { key: 'totalOrders', label: '总订单数', value: 2456, subtitle: '较昨日 +5.2%' },
        { key: 'completedRate', label: '完成率', value: '93.2%', subtitle: '较昨日 +1.1%' },
        { key: 'onTimeRate', label: '准点率', value: '87.6%', subtitle: '较昨日 -0.3%' },
        { key: 'avgTransitTime', label: '平均运输时长', value: '2.5h', subtitle: '较昨日 -0.2h' },
        { key: 'exceptionCount', label: '异常次数', value: 12, subtitle: '较昨日 +2' }
      ],
      trend: [
        { time: '2025-03-01', value: 120 },
        { time: '2025-03-02', value: 135 },
        { time: '2025-03-03', value: 110 },
        { time: '2025-03-04', value: 145 },
        { time: '2025-03-05', value: 130 }
      ]
    }
    // 空数据判断
    if (!mockResponse.indicators.length && !mockResponse.trend.length) {
      loadingState.value = 'empty'
      return
    }
    indicatorCards.value = mockResponse.indicators
    trendData.value = mockResponse.trend
    loadingState.value = 'success'
  } catch (e) {
    loadingState.value = 'error'
  }
}

// 筛选查询
function handleSearch() {
  fetchOverview()
}

// 重试
function retryLoad() {
  fetchOverview()
}

// 下钻指标卡片
function drillDown(card) {
  console.log('下钻指标', card.key, '携带筛选条件', filterValues.value)
  // 实际跳转路由：router.push({ path: '/management/report-detail', query: { ...filterValues.value, indicator: card.key } })
}

// 加载趋势图数据（模拟）
async function loadTrendData() {
  // 实际可根据 selectedMetric 和 selectedGranularity 重新请求
  trendData.value = [
    { time: '2025-03-01', value: Math.floor(Math.random() * 200) },
    { time: '2025-03-02', value: Math.floor(Math.random() * 200) }
  ]
}

// 点击趋势图数据点
function pointClick(item) {
  console.log('下钻时间点', item.time, '携带筛选条件', filterValues.value)
  // 跳转至明细列表
}

// 导出
function exportExcel() {
  console.log('导出Excel，范围：', exportRange.value)
}
function exportPDF() {
  console.log('导出PDF，范围：', exportRange.value)
}

onMounted(() => {
  fetchOverview()
})
</script>

<style scoped>
.management-reports-view {
  padding: 20px;
  font-family: sans-serif;
}

.loading-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.skeleton-card {
  height: 80px;
  background: #e0e0e0;
  border-radius: 4px;
}
.skeleton-chart {
  height: 300px;
  background: #e0e0e0;
  border-radius: 4px;
}

.error-container {
  text-align: center;
  color: red;
}
.empty-container {
  text-align: center;
  color: #888;
  margin-top: 40px;
}

.indicator-cards {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}
.indicator-card {
  flex: 1;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.indicator-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.card-title {
  font-size: 14px;
  color: #666;
}
.card-value {
  font-size: 28px;
  font-weight: bold;
  margin: 8px 0;
}
.card-subtitle {
  font-size: 12px;
  color: #999;
}

.chart-controls {
  margin-bottom: 12px;
}
.chart-controls select {
  margin-right: 8px;
}
.chart-placeholder {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  min-height: 200px;
}
.chart-placeholder table {
  width: 100%;
  border-collapse: collapse;
}
.chart-placeholder th, .chart-placeholder td {
  border: 1px solid #e0e0e0;
  padding: 8px;
  text-align: left;
}
.chart-placeholder td {
  cursor: pointer;
}

.export-area {
  margin-top: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
}
</style>