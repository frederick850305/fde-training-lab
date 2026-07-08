<template>
  <div>
    <div class="content-grid">
      <div class="panel">
        <div class="panel-head">
          <h3>资源负荷（未来 3~6 个月）</h3>
          <div class="filter-chips">
            <button :class="{ active: dim === '资源' }" @click="dim = '资源'">按资源</button>
            <button :class="{ active: dim === '专业' }" @click="dim = '专业'">按专业</button>
          </div>
        </div>
        <LoadChart :periods="periods" :rows="rows" />
      </div>

      <div class="panel">
        <div class="panel-head"><h3>负荷明细与判断</h3></div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>资源</th><th v-for="p in periods" :key="p">{{ p }}</th><th>判断</th></tr></thead>
            <tbody>
              <tr v-for="r in table" :key="r.name">
                <td><strong>{{ r.name }}</strong></td>
                <td v-for="(v, i) in r.values" :key="i" :class="v > 100 ? 'hot' : ''">{{ v }}%</td>
                <td><StatusTag :status="r.judge" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="panel wide">
      <div class="panel-head">
        <h3>模拟调优建议</h3>
        <button class="btn primary" @click="run">{{ ran ? '重新运行中期排程' : '运行中期排程' }}</button>
      </div>
      <p v-if="!ran" class="note">点击「运行中期排程」调用 Mock 接口 <code>POST /api/schedule/run-midterm</code>，系统将给出超负荷资源与调优建议。</p>
      <ul v-else class="clean-list">
        <li v-for="(s, i) in result.suggestions" :key="i">{{ s }}</li>
      </ul>
      <div v-if="ran" class="summary-strip">
        <span>超负荷资源：<strong>{{ result.summary.overloadCount }}</strong> 类</span>
        <span>关键瓶颈：{{ result.summary.overloadResources.join('、') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import LoadChart from '../components/LoadChart.vue'
import StatusTag from '../components/StatusTag.vue'
import { runMidterm } from '../mock/index.js'

const periods = ['10月', '11月', '12月']
const dim = ref('资源')

// 按资源的负荷数据
const resourceTable = [
  { name: '切割', values: [76, 83, 71], judge: '正常' },
  { name: '焊接', values: [112, 135, 128], judge: '超负荷' },
  { name: 'NDT', values: [96, 148, 132], judge: '严重超负荷' },
  { name: '涂装', values: [62, 88, 156], judge: '后期瓶颈' },
  { name: '总装场地', values: [40, 95, 142], judge: '场地冲突' },
]

// 按专业的负荷数据
const professionTable = [
  { name: '导管架结构', values: [82, 95, 88], judge: '正常' },
  { name: '管线', values: [68, 78, 72], judge: '正常' },
  { name: '舾装', values: [90, 110, 105], judge: '超负荷' },
  { name: '涂装', values: [55, 70, 145], judge: '后期瓶颈' },
  { name: '总装', values: [35, 85, 138], judge: '场地冲突' },
]

// 根据 dim 切换表格与图表行
const table = computed(() => dim.value === '资源' ? resourceTable : professionTable)
const rows = computed(() => table.value.map((r) => ({ name: r.name, values: r.values })))

const ran = ref(false)
const result = ref({ summary: { overloadCount: 0, overloadResources: [] }, suggestions: [] })
function run() {
  result.value = runMidterm('JKT-001', 'normal')
  ran.value = true
}
</script>

<style scoped>
.hot { color: #d64b54; font-weight: 800; }
.summary-strip { display: flex; gap: 24px; flex-wrap: wrap; margin-top: 14px; padding-top: 12px; border-top: 1px solid #eef2f6; color: #53657c; font-size: 13px; }
code { background: #eef3f8; padding: 2px 6px; border-radius: 5px; color: #1e6fd9; font-size: 12px; }
</style>
