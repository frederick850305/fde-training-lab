<template>
  <div class="management-reports-view">
    <!-- 筛选区 -->
    <div class="filter-bar">
      <div class="filter-item">
        <label>时间范围</label>
        <select v-model="filters.timeRange">
          <option value="today">今日</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
          <option value="custom">自定义</option>
        </select>
      </div>
      <div class="filter-item">
        <label>车辆类型</label>
        <select v-model="filters.vehicleType">
          <option value="">全部</option>
          <option value="truck">货车</option>
          <option value="van">厢式车</option>
          <option value="trailer">挂车</option>
        </select>
      </div>
      <div class="filter-item">
        <label>作业区域</label>
        <select v-model="filters.area">
          <option value="">全部</option>
          <option value="A">A区</option>
          <option value="B">B区</option>
          <option value="C">C区</option>
        </select>
      </div>
      <button class="btn-query" @click="loadData">查询</button>
    </div>

    <!-- 加载态 -->
    <div v-if="state === 'loading'" class="loading-placeholder">
      <div class="skeleton skeleton-card" v-for="n in 5" :key="n"></div>
      <div class="skeleton skeleton-chart"></div>
    </div>

    <!-- 空态 -->
    <div v-else-if="state === 'empty'" class="empty-state">
      <p>暂无统计数据</p>
      <p class="hint">当前筛选条件下没有数据，请调整筛选条件</p>
    </div>

    <!-- 错误态 -->
    <div v-else-if="state === 'error'" class="error-state">
      <p>加载失败，请重试</p>
      <button @click="loadData">重试</button>
    </div>

    <!-- 成功态 -->
    <div v-else class="dashboard">
      <!-- 指标卡片 -->
      <div class="cards-row">
        <div
          class="indicator-card"
          v-for="(card, idx) in indicatorCards"
          :key="idx"
          @click="drillDown(card)"
        >
          <div class="card-title">{{ card.label }}</div>
          <div class="card-value">{{ card.value }}</div>
          <div class="card-extra">
            <span :class="card.trend > 0 ? 'up' : 'down'">
              {{ card.trend > 0 ? '↑' : '↓' }}{{ Math.abs(card.trend) }}%
            </span>
          </div>
        </div>
      </div>

      <!-- 趋势图 -->
      <div class="chart-section">
        <div class="chart-controls">
          <select v-model="chartMetric">
            <option value="taskCount">任务量</option>
            <option value="revenue">收入</option>
            <option value="efficiency">效率</option>
          </select>
          <select v-model="chartGranularity">
            <option value="day">日</option>
            <option value="week">周</option>
            <option value="month">月</option>
          </select>
        </div>
        <div class="chart-area">
          <!-- 模拟柱状图，每根柱子用 div 表示高度 -->
          <div class="bar-wrapper" v-for="(item, i) in chartData" :key="i">
            <div class="bar" :style="{ height: item.height + '%' }"></div>
            <div class="bar-label">{{ item.label }}</div>
          </div>
        </div>
      </div>

      <!-- 导出操作 -->
      <div class="export-bar">
        <button @click="exportReport('excel')">导出Excel</button>
        <button @click="exportReport('pdf')">导出PDF</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import prototypeContract from '../prototypeContract.js'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey || 'manager')
const currentRole = computed(() => prototypeContext?.currentRole || { label: '管理层' })

const state = ref('loading')
const filters = reactive({
  timeRange: 'today',
  vehicleType: '',
  area: ''
})
const indicatorCards = ref([])
const chartMetric = ref('taskCount')
const chartGranularity = ref('day')
const chartData = ref([])

// 模拟指标数据（不超过3条大块 mock，此处为5个简单对象）
const demoIndicators = [
  { label: '总任务数', value: 128, trend: 5.2 },
  { label: '完成率', value: '94%', trend: -1.3 },
  { label: '平均时长', value: '45min', trend: -3.7 },
  { label: '异常率', value: '2.1%', trend: 0.4 },
  { label: '运营收入', value: '¥' + 35800, trend: 8.1 }
]

// 模拟趋势图数据（模拟一周数据）
const demoChartData = {
  day: [
    { label: '周一', height: 60 },
    { label: '周二', height: 75 },
    { label: '周三', height: 45 },
    { label: '周四', height: 80 },
    { label: '周五', height: 90 },
    { label: '周六', height: 50 },
    { label: '周日', height: 65 }
  ],
  week: [
    { label: '第1周', height: 55 },
    { label: '第2周', height: 70 },
    { label: '第3周', height: 85 },
    { label: '第4周', height: 60 }
  ],
  month: [
    { label: '1月', height: 50 },
    { label: '2月', height: 65 },
    { label: '3月', height: 80 },
    { label: '4月', height: 75 },
    { label: '5月', height: 90 }
  ]
}

function loadData() {
  state.value = 'loading'
  // 模拟异步
  setTimeout(() => {
    try {
      // 根据角色调整默认筛选（示例：管理层看所有，管理员看更广）
      if (currentRoleKey.value === 'admin') {
        filters.area = ''
        filters.vehicleType = ''
      } else {
        // 其他角色可能有预设
      }
      indicatorCards.value = demoIndicators
      updateChart()
      state.value = 'success'
    } catch (e) {
      state.value = 'error'
    }
  }, 300)
}

function updateChart() {
  const granularity = chartGranularity.value
  chartData.value = demoChartData[granularity] || []
  if (chartData.value.length === 0) {
    state.value = 'empty'
  }
}

function drillDown(card) {
  // 原型中提示下钻，实际跳转由外部路由实现，此处仅alert模拟
  alert('下钻至明细：' + card.label)
}

function exportReport(type) {
  alert('导出' + type.toUpperCase() + '报表（原型演示）')
}

watch(chartMetric, updateChart)
watch(chartGranularity, updateChart)

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.management-reports-view {
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.filter-bar {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.filter-item label {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 4px;
}
.filter-item select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  min-width: 120px;
}
.btn-query {
  padding: 6px 20px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.loading-placeholder {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.skeleton {
  background: #f0f0f0;
  border-radius: 6px;
  animation: pulse 1.5s infinite;
}
.skeleton-card {
  height: 80px;
}
.skeleton-chart {
  height: 200px;
}
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
.empty-state,
.error-state {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.cards-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}
.indicator-card {
  flex: 1;
  min-width: 150px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: transform 0.15s;
}
.indicator-card:hover {
  transform: translateY(-2px);
}
.card-title {
  font-size: 13px;
  color: #888;
  margin-bottom: 4px;
}
.card-value {
  font-size: 28px;
  font-weight: 600;
}
.card-extra {
  font-size: 13px;
  margin-top: 6px;
}
.up { color: #52c41a; }
.down { color: #ff4d4f; }
.chart-section {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  border-radius: 8px;
  padding: 16px;
}
.chart-controls {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.chart-controls select {
  padding: 4px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
}
.chart-area {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 200px;
  padding-top: 10px;
}
.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
}
.bar {
  width: 100%;
  max-width: 40px;
  background: #1890ff;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s;
}
.bar-label {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.export-bar {
  display: flex;
  gap: 12px;
}
.export-bar button {
  padding: 8px 20px;
  border: 1px solid #d9d9d9;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.export-bar button:hover {
  border-color: #1890ff;
  color: #1890ff;
}
</style>