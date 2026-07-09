<template>
  <div class="res-gantt-scroll">
    <div class="res-gantt">
      <!-- 表头 -->
      <div class="rg-corner">资源</div>
      <div class="rg-axis">
        <div v-for="(d, i) in dayHeaders" :key="'h'+i"
          class="rg-day-hd" :class="{ weekend: d.isWeekend, today: d.isToday }"
          :style="{ minWidth: cellW + 'px', width: cellW + 'px' }">
          <span class="rg-wk">{{ d.weekDay }}</span>
          <span class="rg-dt">{{ d.dateNum }}</span>
        </div>
      </div>

      <!-- 资源行 -->
      <template v-for="(row, ri) in rows" :key="row.resource">
        <div class="rg-label">{{ row.resource }}</div>
        <div class="rg-track">
          <!-- 背景日格 -->
          <template v-for="(d, i) in totalDays" :key="'bg'+ri+'-'+i">
            <div class="rg-day-cell" :class="{ weekend: dayHeaders[i]?.isWeekend }"
              :style="{ width: cellW + 'px', flexShrink: 0 }"></div>
          </template>
          <!-- 任务条（绝对定位覆盖） -->
          <div v-for="t in row.tasks" :key="t.id"
            class="rg-bar" :style="barStyle(t)"
            :title="`${t.name}\n工单：${t.wo}\n${t.start} ~ ${t.end}`"
          >
            <span v-if="t.spanDays >= 2" class="rg-bar-txt">{{ t.wo }}</span>
          </div>
        </div>
      </template>
    </div>

    <!-- 图例 -->
    <div class="rg-legend" v-if="legendItems.length">
      <span v-for="c in legendItems" :key="c.label" class="rg-leg-item">
        <i :style="{ background: c.color }"></i>{{ c.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: { type: Array, required: true },
  today: { type: String, default: '' },
})

const cellW = 42
const WEEK_DAYS = ['日', '一', '二', '三', '四', '五', '六']

function parse(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function diff(a, b) { return Math.round((b - a) / 86400000) }

// ── 时间轴 ──
const minDate = computed(() => {
  const ds = props.tasks.map((t) => parse(t.start)).filter(Boolean)
  if (!ds.length) return new Date()
  const m = new Date(Math.min(...ds))
  while (m.getDay() !== 1) m.setDate(m.getDate() - 1)
  return m
})
const maxDate = computed(() => {
  const ds = props.tasks.map((t) => parse(t.end)).filter(Boolean)
  return ds.length ? new Date(Math.max(...ds)) : new Date()
})
const totalDays = computed(() => diff(minDate.value, maxDate.value) + 1)

const dayHeaders = computed(() => {
  const td = props.today ? parse(props.today) : null
  const base = new Date(minDate.value)
  const arr = []
  for (let i = 0; i < totalDays.value; i++) {
    const d = new Date(base); d.setDate(base.getDate() + i)
    arr.push({
      dateNum: String(d.getDate()).padStart(2, '0'),
      weekDay: WEEK_DAYS[d.getDay()],
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: td && d.toDateString() === td.toDateString(),
    })
  }
  return arr
})

// ── 按资源聚合 ──
const rows = computed(() => {
  const map = new Map()
  for (const t of props.tasks) {
    const r = t.resource || '未分类'
    if (!map.has(r)) map.set(r, [])
    const s = parse(t.start), e = parse(t.end)
    map.get(r).push({ ...t, leftIdx: diff(minDate.value, s), spanDays: diff(s, e) + 1 })
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'zh'))
    .map(([resource, tasks]) => ({
      resource,
      tasks: tasks.sort((a, b) => a.leftIdx - b.leftIdx),
    }))
})

// ── 工单调色板（5色循环）──
const PALETTE = ['#3b82f6','#ef4444','#22c55e','#f59e0b','#8b5cf6']
const woColorMap = computed(() => {
  const wos = [...new Set(props.tasks.map(t => t.wo))].sort()
  const m = {}
  wos.forEach((w, i) => { m[w] = PALETTE[i % PALETTE.length] })
  return m
})

function barStyle(t) {
  return {
    left: (t.leftIdx * cellW + 2) + 'px',
    width: Math.max(t.spanDays * cellW - 4, 14) + 'px',
    background: woColorMap.value[t.wo] || '#94a3b8',
  }
}

const legendItems = computed(() =>
  Object.entries(woColorMap.value).map(([label, color]) => ({ label, color }))
)
</script>

<style scoped>
.res-gantt-scroll { overflow-x: auto; border: 1px solid #e7edf4; border-radius: 10px; background: #fff; }

/* 网格：固定标签列 + 自适应时间轴列 */
.res-gantt {
  display: grid;
  grid-template-columns: 130px minmax(auto, 1fr);
  align-items: stretch;
}

.rg-corner {
  padding: 10px 12px; font-size: 12px; font-weight: 800;
  color: #63748a; background: #f7fafc;
  border-bottom: 1px solid #e7edf4; border-right: 1px solid #e7edf4;
}

.rg-axis {
  display: flex; border-bottom: 1px solid #e7edf4;
  background: #f7fafc; overflow: hidden;
}
.rg-day-hd {
  text-align: center; border-right: 1px solid #eef2f7;
  padding: 5px 0; flex-shrink: 0; box-sizing: border-box;
}
.rg-day-hd.weekend { background: #f0f3f7; }
.rg-day-hd.today { background: #fee2e2; }
.rg-wk { display: block; font-size: 10px; color: #93a4b5; line-height: 1.2; }
.rg-dt { display: block; font-size: 13px; font-weight: 800; color: #334155; line-height: 1.3; }
.rg-day-hd.today .rg-dt { color: #dc2626; }

/* 行标签 */
.rg-label {
  padding: 9px 12px; font-size: 11px; font-weight: 700; color: #334155;
  border-bottom: 1px solid #f0f3f7; border-right: 1px solid #e7edf4;
  white-space: nowrap; background: #fff; vertical-align: middle;
  display: flex; align-items: center;
}

/* 轨道区 */
.rg-track {
  position: relative; display: flex; align-items: stretch;
  border-bottom: 1px solid #f0f3f7; min-height: 38px;
}
.rg-day-cell { border-right: 1px solid #f0f3f7; height: 100%; box-sizing: border-box; }
.rg-day-cell.weekend { background: #fafbfc; }

/* 任务条 */
.rg-bar {
  position: absolute; top: 7px; height: 24px; border-radius: 4px;
  cursor: pointer; transition: filter .15s, transform .15s;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,.15); z-index: 1;
}
.rg-bar:hover { filter: brightness(1.08); transform: scaleY(1.08); z-index: 2; }
.rg-bar-txt { font-size: 10px; font-weight: 800; color: #fff; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.35); }

/* 图例 */
.rg-legend { display: flex; flex-wrap: wrap; gap: 10px 20px; padding: 12px 16px; border-top: 1px solid #e7edf4; background: #fafbfc; }
.rg-leg-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #475569; font-weight: 600; }
.rg-leg-item i { display: inline-block; width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; }
</style>
