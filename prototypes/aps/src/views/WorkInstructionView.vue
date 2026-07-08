<template>
  <div>
    <div class="wi-head">
      <div class="panel-head" style="margin:0">
        <h3>今日工作指令</h3>
        <span class="sub">{{ today }} · 共 {{ instructions.length }} 条</span>
      </div>
      <div class="filter-chips">
        <button :class="{ active: f === '全部' }" @click="f = '全部'">全部</button>
        <button :class="{ active: f === '执行中' }" @click="f = '执行中'">执行中</button>
        <button :class="{ active: f === '待开工' }" @click="f = '待开工'">待开工</button>
        <button :class="{ active: f === '已完成' }" @click="f = '已完成'">已完成</button>
      </div>
    </div>

    <div v-if="toast" class="toast">{{ toast }}</div>

    <div class="wi-grid">
      <div v-for="wi in filtered" :key="wi.id" class="wi-card" :class="{ done: wi.status === '已完成' }">
        <div class="wi-top">
          <div>
            <strong class="wi-task">{{ wi.task }}</strong>
            <div class="muted">{{ wi.project }} · {{ wi.profession }}</div>
          </div>
          <StatusTag :status="wi.status === '已排程' ? '已排程' : wi.status === '执行中' ? '执行中' : wi.status === '已完成' ? '已完成' : '待下发'" />
        </div>
        <dl class="wi-detail">
          <div><dt>班组</dt><dd>{{ wi.team }}</dd></div>
          <div><dt>工位</dt><dd>{{ wi.station }}</dd></div>
          <div><dt>计划时间</dt><dd>{{ wi.planStart }} ~ {{ wi.planEnd }}</dd></div>
          <div><dt>图纸版本</dt><dd>{{ wi.drawing }}</dd></div>
          <div><dt>齐套状态</dt><dd>{{ wi.kitting }}</dd></div>
          <div><dt>前序 / 后序</dt><dd class="seq-flow">{{ wi.prev }}<svg class="seq-arrow" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#7fb4ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>{{ wi.next }}</dd></div>
          <div class="span-2"><dt>质量要求</dt><dd>{{ wi.quality }}</dd></div>
        </dl>
        <div class="wi-actions">
          <button class="btn" @click="act(wi, '开始作业', '执行中')">开始作业</button>
          <button class="btn" @click="act(wi, '暂停', '待开工')">暂停</button>
          <button class="btn primary" @click="act(wi, '完工反馈', '已完成')">完工反馈</button>
          <button class="btn danger" @click="act(wi, '异常上报', '待开工')">异常上报</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import { workInstructions } from '../mock/index.js'

const today = '2026-10-09'
const instructions = ref(workInstructions.map((w) => ({ ...w })))
const f = ref('全部')
const toast = ref('')

const filtered = computed(() => (f.value === '全部' ? instructions.value : instructions.value.filter((w) => w.status === f.value)))

function act(wi, action, nextStatus) {
  wi.status = nextStatus
  toast.value = `「${wi.task}」已${action}（${nextStatus}）`
  setTimeout(() => (toast.value = ''), 2200)
}
</script>

<style scoped>
.wi-head { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }
.wi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 16px; }
.wi-card { border: 1px solid #d9e4ef; border-radius: 12px; background: #fff; padding: 16px; display: grid; gap: 12px; }
.wi-card.done { opacity: .72; }
.wi-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.wi-task { font-size: 15px; color: #132039; }
.wi-detail { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 14px; margin: 0; }
.wi-detail div { display: grid; gap: 3px; }
.wi-detail dt { color: #8194a8; font-size: 11px; }
.wi-detail dd { margin: 0; font-size: 13px; color: #24415f; font-weight: 700; }
.wi-actions { display: flex; gap: 8px; flex-wrap: wrap; border-top: 1px solid #eef2f6; padding-top: 12px; }
.seq-flow { display: inline-flex; align-items: center; gap: 4px; }
.seq-arrow { width: 16px; height: 16px; flex-shrink: 0; }
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #132039; color: #fff; padding: 11px 18px; border-radius: 10px; font-size: 13px; box-shadow: 0 8px 24px rgba(0,0,0,.25); z-index: 20; }
</style>
