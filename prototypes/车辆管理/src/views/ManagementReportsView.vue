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
    <div v-if="state === 'loading'" class="loading-container">
      <div class="skeleton-card-row">
        <div v-for="i in 5" :key="i" class="skeleton-card"></div>
      </div>
      <div class="skeleton-chart"></div>
    </div>

    <!-- 空态 -->
    <div v-else-if="state === 'empty'" class="empty-container">
      <div class="empty-card-row">
        <div v-for="i in 5" :key="i" class="card-placeholder">
          <p>暂无数据</p>
        </div>
      </div>
      <div class="empty-chart">
        <img src="@/assets/empty-chart.svg" alt="暂无图表" />
        <p>暂无统计数据</p>
      </div>
    </div>

    <!-- 错误态 -->
    <div v-else-if="state === 'error'" class="error-container">
      <p class="error-message">加载失败，请重试</p>
      <button class="retry-button" @click="retryLoad">重试</button>
    </div>

    <!-- 成功态 -->
    <div v-else class="content-container">
      <!-- 指标卡片区 -->
      <div class="card-row">
        <div
          v-for="(card, index) in overviewData.cards"
          :key="index"
          class="metric-card"
          @click="drillDownCard(card)"
        >
          <div class="card-label">{{ card.label }}</div>
          <div class="card-value">{{ card.value }}</div>
          <div class="card-change" :class="card.change > 0 ? 'up' : 'down'">
            {{ card.change > 0 ? '+' : '' }}{{ card.change }}%
          </div>
        </div>
      </div>

      <!-- 趋势图区域 -->
      <div class="chart-section">
        <div class="chart-controls">
          <select v-model="selectedMetric" @change="changeMetric">
            <option v-for="opt in metricOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
          <select v-model="selectedGranularity" @change="changeGranularity">
            <option v-for="opt in granularityOptions" :key="opt.value" :value="opt.value">
              {{ opt.label }}
            </option>
          </select>
        </div>
        <div class="chart-container">
          <!-- 此处用简单div模拟图表，实际原型可集成ECharts -->
          <div class="mock-chart">
            <p>趋势图（{{ selectedMetric }} - {{ selectedGranularity }}）</p>
            <div
              v-for="(point, idx) in overviewData.trendData"
              :key="idx"
              class="data-point"
              @click="drillDownPoint(point)"
            >
              {{ point.date }}: {{ point.value }}
            </div>
          </div>
        </div>
      </div>

      <!-- 导出操作区 -->
      <div class="export-section">
        <select v-model="exportRange">
          <option value="current">当前视图</option>
          <option value="all">全部数据</option>
        </select>
        <button @click="exportExcel">导出Excel</button>
        <button @click="exportPDF">导出PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import DataFilterBar from '@/components/DataFilterBar.vue'
// 模拟数据导入（实际原型可替换为真实数据）
import { mockOverviewData } from '@/data/reports'

// 筛选配置
const filterConfig = [
  {
    type: 'dateRange',
    label: '时间范围',
    key: 'dateRange',
    placeholder: '选择时间'
  },
  {
    type: 'select',
    label: '车辆类型',
    key: 'vehicleType',
    options: [
      { label: '全部', value: '' },
      { label: '卡车', value: 'truck' },
      { label: '轿车', value: 'car' },
      { label: '客车', value: 'bus' }
    ],
    multiple: true
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
    ],
    multiple: true
  }
]

const filterValues = ref({
  dateRange: [],
  vehicleType: [],
  area: []
})

// 页面状态
const state = ref('loading')
const overviewData = ref({
  cards: [],
  trendData: []
})

// 趋势图控制
const selectedMetric = ref('totalTrips')
const metricOptions = [
  { label: '总行程', value: 'totalTrips' },
  { label: '运行时长', value: 'totalHours' },
  { label: '车辆数', value: 'vehicleCount' }
]
const selectedGranularity = ref('day')
const granularityOptions = [
  { label: '按天', value: 'day' },
  { label: '按周', value: 'week' },
  { label: '按月', value: 'month' }
]

// 导出范围
const exportRange = ref('current')

// 模拟加载数据
function loadData(params = {}) {
  state.value = 'loading'
  // 模拟异步请求
  setTimeout(() => {
    try {
      // 模拟数据源，实际可从mockOverviewData获取并过滤
      const data = mockOverviewData
      if (!data || data.cards.length === 0) {
        state.value = 'empty'
      } else {
        overviewData.value = data
        state.value = 'success'
      }
    } catch (e) {
      state.value = 'error'
    }
  }, 800)
}

// 查询
function handleSearch() {
  loadData(filterValues.value)
}

// 重试
function retryLoad() {
  loadData(filterValues.value)
}

// 下钻指标卡片
function drillDownCard(card) {
  // 原型中简单跳转，携带筛选条件
  const query = {
    filter: JSON.stringify(filterValues.value),
    cardKey: card.key
  }
  // 假设使用 Vue Router
  // router.push({ name: 'Detail', query })
  console.log('下钻卡片', card.label, query)
}

// 下钻数据点
function drillDownPoint(point) {
  const query = {
    filter: JSON.stringify(filterValues.value),
    date: point.date
  }
  console.log('下钻数据点', point, query)
}

// 切换指标
function changeMetric() {
  // 重新加载趋势图数据
  console.log('切换指标', selectedMetric.value)
}

// 切换粒度
function changeGranularity() {
  console.log('切换粒度', selectedGranularity.value)
}

// 导出Excel
function exportExcel() {
  if (!exportRange.value) {
    alert('请选择导出范围')
    return
  }
  // 模拟导出
  console.log('导出Excel', exportRange.value)
}

// 导出PDF
function exportPDF() {
  if (!exportRange.value) {
    alert('请选择导出范围')
    return
  }
  console.log('导出PDF', exportRange.value)
}

onMounted(() => {
  loadData()
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
  gap: 20px;
}
.skeleton-card-row {
  display: flex;
  gap: 16px;
}
.skeleton-card {
  flex: 1;
  height: 100px;
  background: #e0e0e0;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
.skeleton-chart {
  height: 300px;
  background: #e0e0e0;
  border-radius: 8px;
  animation: pulse 1.5s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.empty-container {
  text-align: center;
  color: #999;
}
.empty-card-row {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 20px;
}
.card-placeholder {
  width: 180px;
  height: 100px;
  background: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.empty-chart {
  margin-top: 20px;
}

.error-container {
  text-align: center;
  padding: 40px;
}
.error-message {
  color: #e74c3c;
  font-size: 18px;
  margin-bottom: 16px;
}
.retry-button {
  padding: 8px 24px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.content-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.card-row {
  display: flex;
  gap: 16px;
}
.metric-card {
  flex: 1;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: box-shadow 0.2s;
}
.metric-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.card-label {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}
.card-value {
  font-size: 28px;
  font-weight: bold;
}
.card-change {
  font-size: 12px;
  margin-top: 4px;
}
.card-change.up {
  color: #27ae60;
}
.card-change.down {
  color: #e74c3c;
}

.chart-section {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 16px;
}
.chart-controls {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
select {
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.chart-container {
  min-height: 250px;
  background: #f9f9f9;
  border: 1px solid #eee;
  border-radius: 4px;
  padding: 12px;
}
.mock-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.data-point {
  cursor: pointer;
  padding: 4px 8px;
  background: #eaf2f8;
  border-radius: 4px;
  display: inline-block;
}
.data-point:hover {
  background: #d4e6f1;
}

.export-section {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-top: 1px solid #eee;
}
.export-section button {
  padding: 8px 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.export-section button:hover {
  background: #34495e;
}
</style>