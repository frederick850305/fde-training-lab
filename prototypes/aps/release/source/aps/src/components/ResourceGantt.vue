<template>
  <div class="res-gantt-wrap">
    <div class="res-gantt-scroll">
      <div class="res-gantt">
        <!-- 表头 -->
        <div class="rg-corner">资源 / 机台</div>
        <div class="rg-axis" :style="axisStyle">
          <div v-for="(d, i) in dayHeaders" :key="'h'+i"
            class="rg-day-hd" :class="{ weekend: d.isWeekend, today: d.isToday }"
            :style="{ gridColumn: i + 1 }">
            <span class="rg-wk">{{ d.weekDay }}</span>
            <span class="rg-dt">{{ d.dateNum }}</span>
          </div>
        </div>

        <!-- 资源行 -->
        <template v-for="row in rows" :key="row.resource">
          <div class="rg-label">
            <div class="rg-res-code">{{ row.code }}</div>
            <div class="rg-res-meta">
              <span class="rg-res-name">{{ row.resourceName }}</span>
              <span class="rg-res-load">负载 {{ row.load }}%</span>
            </div>
          </div>
          <div class="rg-track" :style="trackStyle">
            <!-- 背景日格 -->
            <template v-for="(d, i) in totalDays" :key="'bg'+row.resource+'-'+i">
              <div class="rg-day-cell"
                :class="{ weekend: dayHeaders[i]?.isWeekend }"
                :style="{ gridColumn: i + 1 }"></div>
            </template>
            <!-- 任务条 -->
            <div v-for="t in row.tasks" :key="t.id"
              class="rg-bar" :class="barClass(t)" :style="barStyle(t)"
              :title="`${t.name}\n工单：${t.wo}\n资源：${t.code} ${t.resourceName}\n${t.start} ~ ${t.end}\n状态：${t.status}`"
            >
              <span class="rg-bar-txt">{{ barLabel(t) }}</span>
            </div>
          </div>
        </template>
      </div>
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
  groupBy: { type: String, default: 'resource' },
})

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
      dateNum: `${d.getMonth() + 1}/${d.getDate()}`,
      weekDay: WEEK_DAYS[d.getDay()],
      isWeekend: d.getDay() === 0 || d.getDay() === 6,
      isToday: td && d.toDateString() === td.toDateString(),
    })
  }
  return arr
})

const axisStyle = computed(() => ({
  '--cols': totalDays.value,
}))
const trackStyle = computed(() => ({
  '--cols': totalDays.value,
}))

// ── 按资源聚合 ──
const rows = computed(() => {
  const map = new Map()
  for (const t of props.tasks) {
    const r = t.resource || '未分类'
    if (!map.has(r)) {
      map.set(r, {
        resource: r,
        code: t.code || r,
        resourceName: t.resourceName || r,
        load: t.load ?? '-',
        order: t.order ?? 999,
        tasks: [],
      })
    }
    const s = parse(t.start), e = parse(t.end)
    map.get(r).tasks.push({ ...t, leftIdx: diff(minDate.value, s), spanDays: diff(s, e) + 1 })
  }
  return [...map.values()]
    .sort((a, b) => a.order - b.order)
    .map((row) => ({
      ...row,
      tasks: row.tasks.sort((a, b) => a.leftIdx - b.leftIdx),
    }))
})

// ── 工单调色板（5色循环）──
const PALETTE = ['#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6']
const woColorMap = computed(() => {
  const wos = [...new Set(props.tasks.map(t => t.wo))].sort()
  const m = {}
  wos.forEach((w, i) => { m[w] = PALETTE[i % PALETTE.length] })
  return m
})

function barClass(t) {
  return {
    conflict: t.status === '资源冲突',
    delayed: t.status === '延期',
    completed: t.status === '已完成',
    critical: t.status === '关键路径' || t.critical,
  }
}

function barStyle(t) {
  return {
    gridColumn: `${t.leftIdx + 1} / span ${t.spanDays}`,
    gridRow: 1,
    backgroundColor: woColorMap.value[t.wo] || '#94a3b8',
  }
}

function barLabel(t) {
  if (t.spanDays <= 1) return t.wo
  return `${t.wo} ${t.name}`
}

const legendItems = computed(() =>
  Object.entries(woColorMap.value).map(([label, color]) => ({ label, color }))
)
</script>

<style scoped>
.res-gantt-wrap { border: 1px solid #e7edf4; border-radius: 10px; background: #fff; overflow: hidden; }
.res-gantt-scroll { overflow-x: auto; }

/* 外层网格：固定标签列 + 自适应时间轴列 */
.res-gantt {
  display: grid;
  grid-template-columns: 170px minmax(auto, 1fr);
  align-items: stretch;
  min-width: max-content;
}

.rg-corner {
  padding: 10px 12px; font-size: 12px; font-weight: 800;
  color: #63748a; background: #f7fafc;
  border-bottom: 1px solid #e7edf4; border-right: 1px solid #e7edf4;
}

/* 时间轴：每天列等分剩余宽度，最小 70px */
.rg-axis, .rg-track {
  display: grid;
  grid-template-columns: repeat(var(--cols), minmax(70px, 1fr));
  border-bottom: 1px solid #e7edf4;
}
.rg-axis { background: #f7fafc; }
.rg-track { min-height: 44px; }

.rg-day-hd {
  text-align: center; border-right: 1px solid #eef2f7;
  padding: 5px 0; box-sizing: border-box; grid-row: 1;
}
.rg-day-hd.weekend { background: #f0f3f7; }
.rg-day-hd.today { background: #fee2e2; }
.rg-wk { display: block; font-size: 10px; color: #93a4b5; line-height: 1.2; }
.rg-dt { display: block; font-size: 12px; font-weight: 800; color: #334155; line-height: 1.3; }
.rg-day-hd.today .rg-dt { color: #dc2626; }

/* 行标签 */
.rg-label {
  padding: 8px 10px; border-bottom: 1px solid #f0f3f7; border-right: 1px solid #e7edf4;
  white-space: nowrap; background: #fff; vertical-align: middle;
  display: flex; align-items: center; gap: 8px;
}
.rg-res-code {
  width: 52px; flex-shrink: 0;
  font-size: 12px; font-weight: 800; color: #334155;
  background: #f1f5f9; border-radius: 4px; text-align: center; padding: 2px 0;
}
.rg-res-meta { display: flex; flex-direction: column; gap: 1px; }
.rg-res-name { font-size: 12px; font-weight: 700; color: #334155; }
.rg-res-load { font-size: 10px; color: #94a3b8; }

/* 轨道背景日格 */
.rg-day-cell { border-right: 1px solid #f0f3f7; height: 100%; grid-row: 1; }
.rg-day-cell.weekend { background: #fafbfc; }

/* 任务条：按 grid-column 跨列 */
.rg-bar {
  grid-row: 1; align-self: center;
  height: 26px; border-radius: 4px; margin: 0 2px;
  cursor: pointer; transition: filter .15s, transform .15s;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,.15); z-index: 1;
}
.rg-bar:hover { filter: brightness(1.08); transform: scaleY(1.08); z-index: 2; }
.rg-bar-txt { font-size: 10px; font-weight: 800; color: #fff; white-space: nowrap; text-shadow: 0 1px 2px rgba(0,0,0,.35); padding: 0 6px; overflow: hidden; text-overflow: ellipsis; }

/* 状态样式 */
.rg-bar.conflict {
  background-image: repeating-linear-gradient(
    45deg,
    rgba(255,255,255,.28),
    rgba(255,255,255,.28) 5px,
    transparent 5px,
    transparent 10px
  );
}
.rg-bar.delayed {
  background-image: repeating-linear-gradient(
    -45deg,
    rgba(0,0,0,.15),
    rgba(0,0,0,.15) 4px,
    transparent 4px,
    transparent 8px
  );
}
.rg-bar.completed { opacity: 0.72; filter: grayscale(0.35); }
.rg-bar.critical { box-shadow: 0 0 0 1.5px #8b5cf6, 0 1px 3px rgba(0,0,0,.2); }

/* 图例 */
.rg-legend { display: flex; flex-wrap: wrap; gap: 10px 20px; padding: 12px 16px; border-top: 1px solid #e7edf4; background: #fafbfc; }
.rg-leg-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #475569; font-weight: 600; }
.rg-leg-item i { display: inline-block; width: 14px; height: 14px; border-radius: 3px; flex-shrink: 0; }
</style>
