<template>
  <div>
    <section class="pill-row" style="margin-bottom:16px">
      <span v-for="s in kittingSummary" :key="s.status" class="tag-pill">
        <span class="tag-dot" :style="{ background: dotColor(s.status) }"></span>{{ s.status }} · {{ s.count }}
      </span>
    </section>

    <div class="mat-layout">
      <div class="panel">
        <div class="panel-head"><h3>施工包 / 构件齐套</h3><span class="sub">{{ records.length }} 项</span></div>
        <div class="filter-chips" style="margin-bottom:12px">
          <button :class="{ active: filter === '全部' }" @click="filter = '全部'">全部</button>
          <button v-for="s in statuses" :key="s" :class="{ active: filter === s }" @click="filter = s">{{ s }}</button>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr><th>任务</th><th>专业</th><th>齐套状态</th><th>趋势</th></tr></thead>
            <tbody>
              <tr v-for="r in filtered" :key="r.id" class="clickable" :class="{ active: selected?.id === r.id }" @click="selected = r">
                <td>{{ r.task }}</td><td>{{ r.profession }}</td><td><StatusTag :status="r.status" /></td><td>{{ r.trend }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="panel" v-if="selected">
        <div class="panel-head"><h3>齐套详情与缺料影响</h3><StatusTag :status="selected.status" /></div>
        <dl class="detail">
          <div><dt>任务</dt><dd>{{ selected.task }}</dd></div>
          <div><dt>专业</dt><dd>{{ selected.profession }}</dd></div>
          <div><dt>齐套状态</dt><dd>{{ selected.status }}</dd></div>
          <div><dt>趋势</dt><dd>{{ selected.trend }}</dd></div>
          <div class="span-2"><dt>缺失项</dt><dd :class="selected.missing !== '无' ? 'warn' : ''">{{ selected.missing }}</dd></div>
          <div class="span-2"><dt>影响分析</dt><dd :class="selected.impact.includes('延期') || selected.impact.includes('禁止') ? 'warn' : ''">{{ selected.impact }}</dd></div>
        </dl>
        <div class="impact-box" :class="impactLevel(selected)">
          <strong>处置建议：</strong>{{ advice(selected) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import { kittingRecords, kittingSummary } from '../mock/index.js'

const statuses = ['齐套', '部分齐套', '风险齐套', '缺关键件', '图纸未冻结']
const records = kittingRecords
const filter = ref('全部')
const selected = ref(records.find((r) => r.status === '缺关键件') || records[0])

const filtered = computed(() => (filter.value === '全部' ? records : records.filter((r) => r.status === filter.value)))

function dotColor(status) {
  return { 齐套: '#1f9d63', 部分齐套: '#e0a92b', 风险齐套: '#e8853a', 缺关键件: '#d64b54', 图纸未冻结: '#8b5cf6' }[status] || '#93a4b5'
}
function impactLevel(r) {
  if (r.impact.includes('延期') || r.impact.includes('禁止')) return 'bad'
  if (r.impact.includes('不影响') || r.impact.includes('可')) return 'ok'
  return 'mid'
}
function advice(r) {
  if (r.status === '齐套') return '图纸、物料、工位均已就绪，可直接下发工作指令开工。'
  if (r.status === '部分齐套') return '部分物料未到，建议先开工不受影响工序，缺件到达后补做并关注后续工序顺延。'
  if (r.status === '风险齐套') return '关键件存在到货风险，建议提前与采购确认到货窗口，必要时启用替代或外协。'
  if (r.status === '缺关键件') return '关键物料未到，禁止开工；触发采购催交并评估对里程碑的延期影响。'
  if (r.status === '图纸未冻结') return '设计图纸尚未发布，工作指令禁止下发；推动设计冻结后方可排程。'
  return '关注齐套变化。'
}
</script>

<style scoped>
.mat-layout { display: grid; grid-template-columns: 1.1fr .9fr; gap: 16px; }
.clickable { cursor: pointer; }
tr.clickable.active { background: #eaf2fb; }
.detail { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; margin: 0; }
.detail div { display: grid; gap: 4px; }
.detail dt { color: #8194a8; font-size: 12px; }
.detail dd { margin: 0; font-weight: 700; color: #24415f; }
.detail dd.warn { color: #c43b45; }
.impact-box { margin-top: 16px; padding: 12px 14px; border-radius: 8px; font-size: 13px; line-height: 1.6; }
.impact-box.ok { background: #e7f7ee; color: #11734d; }
.impact-box.mid { background: #fff6e6; color: #8a5a00; }
.impact-box.bad { background: #fdeaec; color: #b4232d; }
@media (max-width: 1020px) { .mat-layout { grid-template-columns: 1fr; } }
</style>
