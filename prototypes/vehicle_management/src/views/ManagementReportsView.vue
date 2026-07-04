<template>
  <div class="management-reports">
    <div v-if="loading" class="loading-state">
      <div class="skeleton" v-for="n in 4" :key="n" style="height:100px;border-radius:10px"></div>
    </div>
    <div v-else-if="error" class="error-state"><span>⚠️</span><p>{{ error }}</p><button @click="loadData">重试</button></div>
    <template v-else>
      <!-- 指标卡片 -->
      <div class="metrics-grid">
        <div class="metric-card" v-for="m in metrics" :key="m.label">
          <strong>{{ m.value }}</strong>
          <span>{{ m.label }}</span>
          <small :class="m.trend > 0 ? 'up' : 'down'">{{ m.trend > 0 ? '↑' : '↓' }} {{ Math.abs(m.trend) }}%</small>
        </div>
      </div>

      <!-- 趋势图（示意） -->
      <div class="chart-placeholder">
        <h4>📈 车辆利用率趋势</h4>
        <div class="bar-chart">
          <div v-for="(bar, i) in chartData" :key="i" class="bar-col">
            <div class="bar" :style="{ height: bar.value + '%' }"></div>
            <span>{{ bar.label }}</span>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <button @click="exportData">📥 导出报表</button>
        <button @click="viewDetail">🔍 查看明细</button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from '../routerShim.js'
import { fetchVehicleData } from '../data/mockVehicles.js'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const metrics = ref([
  { label: '车辆利用率', value: '82%', trend: 5 },
  { label: '任务完成率', value: '94%', trend: 2 },
  { label: '平均等待时长', value: '18min', trend: -8 },
  { label: '空驶率', value: '12%', trend: -3 },
])
const chartData = [
  { label: '周一', value: 78 }, { label: '周二', value: 85 }, { label: '周三', value: 82 },
  { label: '周四', value: 90 }, { label: '周五', value: 88 }, { label: '周六', value: 72 }, { label: '周日', value: 65 },
]

async function loadData() {
  loading.value = true; error.value = ''
  try {
    await fetchVehicleData()
  } catch (e) {
    error.value = '数据加载失败'
  } finally { loading.value = false }
}

function exportData() { alert('导出报表文件...') }
function viewDetail() { router.push('/management/report-detail') }

onMounted(loadData)
</script>

<style scoped>
.management-reports { padding: 16px; display: grid; gap: 16px; }
.metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.metric-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: grid; gap: 4px; }
.metric-card strong { font-size: 24px; color: #1e293b; }
.metric-card span { font-size: 12px; color: #64748b; }
.metric-card small { font-size: 11px; }
.metric-card .up { color: #1a7a1a; }
.metric-card .down { color: #c62828; }
.chart-placeholder { background: #fff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; }
.chart-placeholder h4 { margin: 0 0 16px; font-size: 14px; }
.bar-chart { display: flex; align-items: flex-end; gap: 12px; height: 150px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.bar { width: 100%; max-width: 40px; background: linear-gradient(180deg, #1a56db, #60a5fa); border-radius: 4px 4px 0 0; }
.bar-col span { font-size: 10px; color: #94a3b8; }
.quick-actions { display: flex; gap: 12px; }
.quick-actions button { padding: 10px 20px; border: 1px solid #cbd5e1; border-radius: 10px; background: #fff; font-size: 13px; cursor: pointer; }
.loading-state { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; }
.error-state { padding: 40px; text-align: center; color: #c62828; }
.error-state button { margin-top: 12px; padding: 8px 20px; background: #c62828; color: #fff; border: none; border-radius: 8px; cursor: pointer; }
.skeleton { background: #e2e8f0; animation: shimmer 1.5s infinite; }
@keyframes shimmer { 0% { opacity: .5; } 50% { opacity: 1; } 100% { opacity: .5; } }
</style>
