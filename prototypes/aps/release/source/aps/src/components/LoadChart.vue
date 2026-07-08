<template>
  <div class="load-chart">
    <div class="load-axis">
      <span v-for="g in gridLines" :key="g" class="load-gridlabel" :style="{ bottom: (g / maxScale) * 100 + '%' }">{{ g }}%</span>
    </div>
    <div class="load-plot">
      <div class="load-100" :style="{ bottom: (100 / maxScale) * 100 + '%' }"><span>100% 满负荷</span></div>
      <div v-for="row in rows" :key="row.name" class="load-col">
        <div class="load-bars">
          <div
            v-for="(v, i) in row.values"
            :key="i"
            class="load-bar"
            :class="level(v)"
            :style="{ height: Math.min(v, maxScale) / maxScale * 100 + '%' }"
            :title="`${row.name} · ${periods[i]}\n负荷 ${v}%`"
          ></div>
        </div>
        <div class="load-name">{{ row.name }}</div>
      </div>
    </div>
    <div class="load-legend">
      <span><i class="lg green"></i>正常 (&lt;90%)</span>
      <span><i class="lg amber"></i>临界 (90-100%)</span>
      <span><i class="lg red"></i>超负荷 (&gt;100%)</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  periods: { type: Array, required: true },
  rows: { type: Array, required: true }, // [{ name, values: number[] }]
  maxScale: { type: Number, default: 160 },
})

const gridLines = [0, 50, 100, 150]

function level(v) {
  if (v > 100) return 'red'
  if (v >= 90) return 'amber'
  return 'green'
}
</script>

<style scoped>
.load-chart { display: grid; grid-template-columns: 38px 1fr; gap: 6px; align-items: stretch; }
.load-axis { position: relative; }
.load-gridlabel { position: absolute; right: 2px; transform: translateY(50%); font-size: 10px; color: #a4b3c4; }
.load-plot { position: relative; border-left: 1px solid #e7edf4; border-bottom: 1px solid #e7edf4; height: 220px; display: flex; align-items: flex-end; gap: 10px; padding: 0 6px; }
.load-100 { position: absolute; left: 0; right: 0; border-top: 1px dashed #d64b54; z-index: 1; }
.load-100 span { position: absolute; right: 4px; top: -16px; font-size: 10px; color: #d64b54; font-weight: 800; }
.load-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; min-width: 0; }
.load-bars { display: flex; align-items: flex-end; gap: 3px; height: 100%; width: 100%; justify-content: center; }
.load-bar { width: 14px; border-radius: 3px 3px 0 0; transition: height .2s; }
.load-bar.green { background: linear-gradient(180deg,#37c28a,#1f9d63); }
.load-bar.amber { background: linear-gradient(180deg,#f0c34d,#e0a92b); }
.load-bar.red { background: linear-gradient(180deg,#e56b73,#d64b54); }
.load-name { margin-top: 6px; font-size: 11px; color: #53657c; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
.load-legend { grid-column: 1 / -1; display: flex; gap: 16px; justify-content: center; font-size: 11px; color: #64748b; margin-top: 4px; }
.load-legend i.lg { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 4px; vertical-align: -1px; }
.lg.green { background: #1f9d63; } .lg.amber { background: #e0a92b; } .lg.red { background: #d64b54; }
</style>
