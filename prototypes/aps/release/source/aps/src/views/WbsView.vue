<template>
  <div class="content-grid">
    <div class="panel">
      <div class="panel-head"><h3>WBS 结构树</h3><span class="sub">{{ flat.length }} 个节点</span></div>
      <div class="tree">
        <div
          v-for="node in flat"
          :key="node.id"
          class="tree-row"
          :class="{ active: selected?.id === node.id }"
          :style="{ paddingLeft: 12 + node.depth * 18 + 'px' }"
        >
          <button
            class="tw"
            :class="{ on: node.hasChildren }"
            :style="{ visibility: node.hasChildren ? 'visible' : 'hidden' }"
            @click.stop="toggle(node.id)"
          >{{ expanded.has(node.id) ? '▾' : '▸' }}</button>
          <span class="tc" @click="selected = node">{{ node.code }}</span>
          <span class="tn" @click="selected = node">{{ node.name }}</span>
          <span class="tp" @click="selected = node">{{ node.progress }}%</span>
        </div>
      </div>
    </div>

    <div class="panel" v-if="selected">
      <div class="panel-head"><h3>节点详情</h3><StatusTag :status="selected.risk === '高' ? '高' : selected.risk === '中' ? '中' : '低'" /></div>
      <dl class="detail">
        <div><dt>WBS 编码</dt><dd>{{ selected.code }}</dd></div>
        <div><dt>节点名称</dt><dd>{{ selected.name }}</dd></div>
        <div><dt>专业</dt><dd>{{ selected.profession }}</dd></div>
        <div><dt>责任部门</dt><dd>{{ selected.dept }}</dd></div>
        <div><dt>计划开始</dt><dd>{{ selected.planStart }}</dd></div>
        <div><dt>计划完成</dt><dd>{{ selected.planEnd }}</dd></div>
        <div><dt>当前进度</dt><dd>{{ selected.progress }}%</dd></div>
        <div><dt>风险状态</dt><dd>{{ selected.risk }}风险</dd></div>
      </dl>
      <div class="mini-bar"><div class="mini-fill" :style="{ width: selected.progress + '%' }"></div></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusTag from '../components/StatusTag.vue'
import { buildWbsForest } from '../mock/index.js'

const forest = buildWbsForest()

const expanded = ref(new Set())
// 默认只展开第一层（根节点）
forest.forEach((n) => { if (n.children?.length) expanded.value.add(n.id) })

function toggle(id) {
  const s = new Set(expanded.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expanded.value = s
}

const flat = computed(() => {
  const result = []
  ;(function walk(nodes, depth) {
    for (const n of nodes) {
      result.push({ ...n, depth, hasChildren: !!(n.children?.length) })
      if (n.children?.length && expanded.value.has(n.id)) {
        walk(n.children, depth + 1)
      }
    }
  })(forest, 0)
  return result
})

const selected = ref(flat.value.find((n) => n.id === 'STRUCT') || flat.value[0])
</script>

<style scoped>
.tree { display: grid; gap: 2px; max-height: 560px; overflow-y: auto; }
.tree-row { display: grid; grid-template-columns: 16px 130px 1fr 42px; align-items: center; gap: 8px; border: 0; background: transparent; padding: 9px 8px; border-radius: 7px; text-align: left; color: #3e5068; font-size: 13px; cursor: default; }
.tree-row:hover, .tree-row.active { background: #eaf2fb; color: #132039; }
.tw { color: #9cb0c8; font-size: 11px; cursor: pointer; border: none; background: none; padding: 0; width: 16px; text-align: center; line-height: 1; font-weight: 700; }
.tw.on:hover { color: #1e6fd9; }
.tc { color: #1e6fd9; font-weight: 800; font-size: 12px; cursor: pointer; }
.tc:hover { text-decoration: underline; }
.tn { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }
.tp { color: #64748b; font-size: 12px; text-align: right; cursor: pointer; }
.detail { display: grid; grid-template-columns: 1fr 1fr; gap: 14px 18px; margin: 0; }
.detail div { display: grid; gap: 4px; }
.detail dt { color: #8194a8; font-size: 12px; }
.detail dd { margin: 0; font-weight: 700; color: #24415f; }
.mini-bar { margin-top: 16px; height: 12px; background: #eef2f6; border-radius: 999px; overflow: hidden; }
.mini-fill { height: 100%; background: #2f7fe0; }
</style>
