<template>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-head"><h3>制造 BOM / 施工包</h3><span class="sub">{{ bomTree.length }} 个对象</span></div>
      <div class="tree">
        <button
          v-for="node in flat"
          :key="node.id"
          class="tree-row"
          :class="{ active: selected?.id === node.id }"
          :style="{ paddingLeft: 12 + node.depth * 18 + 'px' }"
          @click="selected = node"
        >
          <span class="tc">{{ node.code }}</span>
          <span class="tn">{{ node.name }}</span>
          <StatusTag :status="node.kitting" />
        </button>
      </div>
      <div class="pill-row" style="margin-top:14px">
        <span v-for="b in bomStats.kittingBreakdown" :key="b.status" class="tag-pill">
          <span class="tag-dot" :style="{ background: dotColor(b.status) }"></span>{{ b.status }} · {{ b.count }}
        </span>
      </div>
    </div>

    <div class="panel" v-if="selected">
      <div class="panel-head"><h3>构件明细</h3><StatusTag :status="selected.status === '待面漆' ? '部分齐套' : '齐套'" :label="selected.status" /></div>
      <dl class="detail">
        <div><dt>构件编号</dt><dd>{{ selected.code }}</dd></div>
        <div><dt>类型</dt><dd>{{ selected.type }}</dd></div>
        <div><dt>重量</dt><dd>{{ selected.weight }}</dd></div>
        <div><dt>材质</dt><dd>{{ selected.material }}</dd></div>
        <div><dt>所属区域</dt><dd>{{ selected.zone }}</dd></div>
        <div><dt>工艺路线</dt><dd>{{ selected.route }}</dd></div>
        <div><dt>当前状态</dt><dd>{{ selected.status }}</dd></div>
        <div><dt>齐套状态</dt><dd>{{ selected.kitting }}</dd></div>
      </dl>
      <div class="panel-head" style="margin-top:8px"><h3>工序任务</h3><span class="sub">{{ selected.tasks?.length || 0 }} 道工序</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>工序</th><th>前序</th><th>后序</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="t in selected.tasks" :key="t.op">
              <td>{{ t.op }}</td><td>{{ t.prev }}</td><td>{{ t.next }}</td><td><StatusTag :status="t.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import { bomTree, bomStats } from '../mock/index.js'

const flat = []
;(function walk(nodes, depth) {
  for (const n of nodes) {
    flat.push({ ...n, depth })
    if (n.children?.length) walk(n.children, depth + 1)
  }
})(bomTree, 0)

const selected = ref(flat.find((n) => n.id === 'BRACE-001') || flat[0])

function dotColor(status) {
  return { 齐套: '#1f9d63', 部分齐套: '#e0a92b', 风险齐套: '#e8853a', 缺关键件: '#d64b54', 图纸未冻结: '#8b5cf6' }[status] || '#93a4b5'
}
</script>

<style scoped>
.tree { display: grid; gap: 2px; max-height: 520px; overflow-y: auto; }
.tree-row { display: grid; grid-template-columns: 120px 1fr auto; align-items: center; gap: 8px; border: 0; background: transparent; padding: 9px 8px; border-radius: 7px; text-align: left; color: #3e5068; font-size: 13px; }
.tree-row:hover, .tree-row.active { background: #eaf2fb; color: #132039; }
.tc { color: #1e6fd9; font-weight: 800; font-size: 12px; }
.tn { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.detail { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; margin: 0; }
.detail div { display: grid; gap: 4px; }
.detail dt { color: #8194a8; font-size: 12px; }
.detail dd { margin: 0; font-weight: 700; color: #24415f; }
</style>
