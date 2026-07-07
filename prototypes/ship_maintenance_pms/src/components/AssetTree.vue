<template>
  <div class="asset-tree">
    <div class="tree-toolbar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        :value="filter"
        placeholder="过滤设备 / 系统"
        @input="$emit('filter-change', $event.target.value)"
      />
    </div>

    <div v-if="loading" class="tree-state">
      <span class="skeleton-line" v-for="n in 5" :key="n"></span>
    </div>

    <div v-else-if="error" class="tree-state error">
      <p>资产树加载失败</p>
      <button type="button" @click="$emit('filter-change', filter)">重试</button>
    </div>

    <div v-else-if="!visibleNodes.length" class="tree-state empty">
      <p>暂无匹配设备节点</p>
    </div>

    <ul v-else class="tree-root">
      <AssetNode
        v-for="node in visibleNodes"
        :key="node.id"
        :node="node"
        :selected-id="selectedId"
        :filter="lowerFilter"
        @node-click="$emit('node-click', $event)"
      />
    </ul>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

const props = defineProps({
  nodes: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
  filter: { type: String, default: '' },
  loading: { type: Boolean, default: false },
  error: { type: Boolean, default: false },
})

defineEmits(['node-click', 'node-expand', 'node-collapse', 'filter-change'])

const lowerFilter = computed(() => props.filter.trim().toLowerCase())

function nodeMatches(node) {
  if (!lowerFilter.value) return true
  if (node.label.toLowerCase().includes(lowerFilter.value)) return true
  if (node.children?.some(nodeMatches)) return true
  return false
}

const visibleNodes = computed(() => props.nodes.filter(nodeMatches))

const AssetNode = {
  name: 'AssetNode',
  props: { node: Object, selectedId: String, filter: String },
  emits: ['node-click'],
  setup(nodeProps, { emit }) {
    const expanded = ref(true)
    const isOpen = computed(() => expanded.value)
    const hasChildren = computed(() => nodeProps.node.children?.length)
    const isSelected = computed(() => nodeProps.node.id === nodeProps.selectedId)
    return () =>
      h('li', { class: 'tree-node' }, [
        h(
          'button',
          {
            type: 'button',
            class: ['tree-row', { selected: isSelected.value, 'has-children': hasChildren.value }],
            onClick: () => emit('node-click', nodeProps.node),
          },
          [
            hasChildren.value
              ? h('span', { class: 'caret', onClick: (e) => { e.stopPropagation(); expanded.value = !expanded.value } }, isOpen.value ? '▾' : '▸')
              : h('span', { class: 'caret dot' }),
            h('span', { class: 'row-label' }, nodeProps.node.label),
            nodeProps.node.status ? h('span', { class: ['row-tag', toneOf(nodeProps.node.status)] }, nodeProps.node.status) : null,
          ],
        ),
        hasChildren.value && isOpen.value
          ? h('ul', { class: 'tree-children' }, nodeProps.node.children.map(child => h(AssetNode, { key: child.id, node: child, selectedId: nodeProps.selectedId, filter: nodeProps.filter, onNodeClick: (n) => emit('node-click', n) })))
          : null,
      ])
  },
}

function toneOf(status) {
  if (!status) return ''
  if (/异常|故障|过期/.test(status)) return 'danger'
  if (/闭环|通过|生效|正常/.test(status)) return 'ok'
  if (/进行|审核/.test(status)) return 'active'
  return 'pending'
}

import { ref } from 'vue'
</script>

<style scoped>
.asset-tree {
  display: grid;
  gap: 10px;
}

/* ── 搜索栏（与右侧筛选输入框风格一致）── */
.tree-toolbar { position: relative; }
.tree-toolbar input {
  width: 100%;
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  color: #172033;
  background: #f8fbfe;
  font-size: 13px;
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.tree-toolbar input:focus {
  outline: none;
  border-color: #1e6fd9;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(30, 111, 217, .1);
}
.tree-toolbar input::placeholder { color: #9aa8b8; }
.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: #9aa8b8;
  pointer-events: none;
}

/* ── 加载 / 错误 / 空态 ── */
.tree-state { display: grid; gap: 8px; padding: 8px 4px; }
.tree-state.error p { color: #b4232d; margin: 0 0 8px; font-size: 13px; }
.tree-state.error button {
  border: 1px solid #cfdae6; border-radius: 7px; padding: 6px 14px;
  color: #24415f; background: #f6f9fc; font-weight: 700; font-size: 12px; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.tree-state.error button:hover { background: #edf2f8; border-color: #b9c8d8; }
.tree-state.empty p { color: #8b9aab; margin: 0; font-size: 13px; text-align: center; padding: 20px 0; }

.skeleton-line {
  height: 40px; border-radius: 8px;
  background: linear-gradient(90deg, #edf2f8 25%, #f6f9fc 50%, #edf2f8 75%);
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s ease-in-out infinite;
}
@keyframes skeleton-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ── 树结构 ── */
.tree-root, .tree-children { list-style: none; margin: 0; padding: 0; display: grid; }
.tree-root { gap: 6px; }
.tree-children {
  gap: 4px;
  padding-left: 16px;
  margin-top: 4px;
  position: relative;
}
.tree-children::before {
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  bottom: 12px;
  width: 1px;
  background: #e2eaf3;
}
.tree-node { display: grid; }

/* ── 行：卡片化，与右侧 plan-card 风格一致 ── */
.tree-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #d9e4ef;
  border-left: 3px solid transparent;
  border-radius: 8px;
  padding: 9px 12px;
  text-align: left;
  background: #fff;
  font-size: 13px;
  color: #3e5068;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s, background .15s, color .15s;
  min-height: 42px;
}
.tree-row:hover {
  border-color: #1e6fd9;
  background: #f8fbfe;
  color: #172033;
  box-shadow: 0 4px 14px rgba(30, 111, 217, .1);
}
.tree-row.has-children {
  background: #f8fbfe;
  font-weight: 700;
  color: #172033;
}
.tree-row.has-children:hover {
  background: #edf5ff;
  border-color: #1e6fd9;
  box-shadow: 0 4px 14px rgba(30, 111, 217, .1);
}
.tree-row.selected {
  border-color: #1e6fd9;
  border-left: 3px solid #1e6fd9;
  background: #edf5ff;
  color: #132039;
  font-weight: 700;
  box-shadow: 0 0 0 1px rgba(30, 111, 217, .08);
}
.tree-row.selected:hover {
  box-shadow: 0 4px 14px rgba(30, 111, 217, .14);
}

/* ── 展开/折叠图标 ── */
.caret {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 5px;
  color: #94aab8;
  cursor: pointer;
  font-size: 10px;
  transition: background .12s, color .12s;
  flex-shrink: 0;
  user-select: none;
}
.caret:hover { background: #e2eaf3; color: #1e6fd9; }
.caret.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #c4d2e0;
  margin: 0 8px;
}
.caret.dot::before { display: none; }

.row-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* ── 状态标签：与右侧 StatusBadge 配色一致 ── */
.row-tag {
  font-size: 11px;
  font-weight: 800;
  border-radius: 999px;
  padding: 3px 9px;
  white-space: nowrap;
  flex-shrink: 0;
}
.row-tag.danger { color: #b4232d; background: #ffe1e3; }
.row-tag.ok { color: #11734d; background: #dff6e8; }
.row-tag.active { color: #1f5fbf; background: #e3efff; }
.row-tag.pending { color: #8a5a00; background: #fff2cc; }
</style>
