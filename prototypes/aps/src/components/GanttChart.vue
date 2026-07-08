<template>
  <div class="gantt-scroll">
    <div class="gantt" :style="{ gridTemplateColumns: `210px minmax(${trackMin}px, 1fr)` }">
      <!-- 日期轴 -->
      <div class="gantt-axis-label">任务 / 资源</div>
      <div class="gantt-axis">
        <div
          v-for="tick in ticks"
          :key="tick.label"
          class="gantt-tick"
          :class="{ weekstart: tick.week }"
          :style="{ left: tick.left + '%' }"
        >
          <span>{{ tick.label }}</span>
        </div>
        <div v-if="todayLeft !== null" class="gantt-today" :style="{ left: todayLeft + '%' }">
          <span>今日</span>
        </div>
      </div>

      <!-- 分组与任务行 -->
      <template v-for="grp in grouped" :key="grp.key">
        <div class="gantt-group-head">{{ grp.key }} <em>({{ grp.tasks.length }})</em></div>
        <div class="gantt-group-track"></div>

        <template v-for="t in grp.tasks" :key="t.id">
          <div class="gantt-label" :title="t.name">
            <span class="dot" :class="barClass(t.status)"></span>{{ t.name }}
            <small v-if="t.critical" class="crit-flag">关键</small>
          </div>
          <div class="gantt-track">
            <div
              class="gantt-bar"
              :class="barClass(t.status)"
              :style="{ left: leftPct(t) + '%', width: widthPct(t) + '%' }"
              :title="`${t.name}\n${t.start} ~ ${t.end} · ${t.status}\n资源：${t.resource}`"
              @click="$emit('select', t)"
            >
              <span class="bar-text">{{ t.status }}</span>
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  tasks: { type: Array, required: true },
  viewBy: { type: String, default: 'resource' }, // resource | profession | package
  today: { type: String, default: '' },
})

defineEmits(['select'])

function parse(s) {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
function diff(a, b) {
  return Math.round((b - a) / 86400000)
}

const groupProp = computed(() => ({ resource: 'resource', profession: 'profession', package: 'pkg' }[props.viewBy] || 'resource'))

const minDate = computed(() => {
  const ds = props.tasks.map((t) => parse(t.start)).filter(Boolean)
  if (!ds.length) return new Date()
  const min = new Date(Math.min(...ds))
  // 对齐到周一，保证周刻度与"今日"线不出现负偏移
  while (min.getDay() !== 1) min.setDate(min.getDate() - 1)
  return min
})
const maxDate = computed(() => {
  const ds = props.tasks.map((t) => parse(t.end)).filter(Boolean)
  return ds.length ? new Date(Math.max(...ds)) : new Date()
})
const totalDays = computed(() => diff(minDate.value, maxDate.value) + 1)

const trackMin = computed(() => Math.max(560, totalDays.value * 26))

function leftPct(t) {
  return (diff(minDate.value, parse(t.start)) / totalDays.value) * 100
}
function widthPct(t) {
  return ((diff(parse(t.start), parse(t.end)) + 1) / totalDays.value) * 100
}

const ticks = computed(() => {
  const out = []
  const cur = new Date(minDate.value)
  // 对齐到周一
  while (cur.getDay() !== 1) cur.setDate(cur.getDate() - 1)
  let i = 0
  while (cur <= maxDate.value) {
    out.push({
      label: `${String(cur.getMonth() + 1).padStart(2, '0')}-${String(cur.getDate()).padStart(2, '0')}`,
      left: (diff(minDate.value, cur) / totalDays.value) * 100,
      week: true,
    })
    cur.setDate(cur.getDate() + 7)
    i++
  }
  return out
})

const todayLeft = computed(() => {
  if (!props.today) return null
  const d = parse(props.today)
  if (d < minDate.value || d > maxDate.value) return null
  return (diff(minDate.value, d) / totalDays.value) * 100
})

const grouped = computed(() => {
  const prop = groupProp.value
  const map = new Map()
  for (const t of props.tasks) {
    const key = t[prop] || '未分类'
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(t)
  }
  return [...map.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], 'zh'))
    .map(([key, tasks]) => ({
      key,
      tasks: tasks.slice().sort((a, b) => parse(a.start) - parse(b.start)),
    }))
})

function barClass(status) {
  return {
    已完成: 'gray',
    执行中: 'green',
    已排程: 'blue',
    待下发: 'cyan',
    待排: 'idle',
    齐套风险: 'yellow',
    资源冲突: 'red',
    外协: 'orange',
    关键路径: 'purple',
  }[status] || 'blue'
}
</script>

<style scoped>
.gantt-scroll { overflow-x: auto; border: 1px solid #e7edf4; border-radius: 10px; background: #fff; }
.gantt { display: grid; align-items: stretch; min-width: 760px; }
.gantt-axis-label, .gantt-label { font-size: 12px; color: #3e5068; }
.gantt-axis-label { padding: 10px 12px; font-weight: 800; color: #63748a; background: #f7fafc; border-bottom: 1px solid #e7edf4; position: sticky; left: 0; z-index: 3; }
.gantt-axis { position: relative; height: 40px; border-bottom: 1px solid #e7edf4; background: #f7fafc; }
.gantt-tick { position: absolute; top: 0; bottom: 0; border-left: 1px dashed #e1e8f0; padding-left: 4px; font-size: 11px; color: #8194a8; }
.gantt-tick span { position: absolute; top: 10px; }
.gantt-today { position: absolute; top: 0; bottom: 0; width: 2px; background: #c43b45; z-index: 2; }
.gantt-today span { position: absolute; top: -2px; left: 4px; font-size: 10px; color: #c43b45; font-weight: 800; }
.gantt-group-head { grid-column: 1 / -1; padding: 8px 12px; background: #eef3f8; font-weight: 800; font-size: 12px; color: #24415f; border-top: 1px solid #e1e8f0; }
.gantt-group-head em { color: #8194a8; font-style: normal; font-weight: 700; }
.gantt-group-track { display: none; }
.gantt-label { padding: 8px 12px; border-bottom: 1px solid #f0f3f7; display: flex; align-items: center; gap: 7px; position: sticky; left: 0; background: #fff; z-index: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.gantt-label .dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.gantt-label .crit-flag { color: #6b3fc4; font-size: 10px; font-weight: 800; }
.gantt-track { position: relative; border-bottom: 1px solid #f0f3f7; }
.gantt-bar { position: absolute; top: 7px; height: 22px; border-radius: 6px; display: flex; align-items: center; padding: 0 8px; cursor: pointer; box-shadow: 0 1px 2px rgba(15,23,42,.12); transition: filter .15s; min-width: 14px; }
.gantt-bar:hover { filter: brightness(1.05); }
.bar-text { font-size: 11px; font-weight: 800; color: #fff; white-space: nowrap; overflow: hidden; }
.gantt-bar.gray { background: #93a4b5; }
.gantt-bar.green { background: #1f9d63; }
.gantt-bar.blue { background: #2f7fe0; }
.gantt-bar.cyan { background: #2bb3c0; }
.gantt-bar.yellow { background: #e0a92b; }
.gantt-bar.red { background: #d64b54; }
.gantt-bar.orange { background: #e8853a; }
.gantt-bar.purple { background: #8b5cf6; }
.gantt-bar.idle { background: repeating-linear-gradient(45deg,#dde6ef,#dde6ef 6px,#eef3f8 6px,#eef3f8 12px); }
.gantt-bar.idle .bar-text { color: #64748b; }
.dot.gray { background: #93a4b5; } .dot.green { background: #1f9d63; } .dot.blue { background: #2f7fe0; }
.dot.cyan { background: #2bb3c0; } .dot.yellow { background: #e0a92b; } .dot.red { background: #d64b54; }
.dot.orange { background: #e8853a; } .dot.purple { background: #8b5cf6; }
</style>
