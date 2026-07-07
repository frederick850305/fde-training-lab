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
        :depth="0"
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
  props: { node: Object, selectedId: String, filter: String, depth: Number },
  emits: ['node-click', 'node-expand', 'node-collapse'],
  setup(nodeProps, { emit }) {
    const expanded = ref(true)
    const isOpen = computed(() => expanded.value)
    const hasChildren = computed(() => nodeProps.node.children?.length)
    const isSelected = computed(() => nodeProps.node.id === nodeProps.selectedId)
    const depth = computed(() => nodeProps.depth || 0)
    const toggle = (event) => {
      event.stopPropagation()
      expanded.value = !expanded.value
      emit(expanded.value ? 'node-expand' : 'node-collapse', nodeProps.node)
    }
    return () =>
      h('li', { class: ['tree-node', `depth-${depth.value}`] }, [
        h(
          'button',
          {
            type: 'button',
            class: ['tree-row', { selected: isSelected.value, 'has-children': hasChildren.value, leaf: !hasChildren.value }],
            onClick: () => emit('node-click', nodeProps.node),
          },
          [
            hasChildren.value
              ? h('span', { class: ['caret', { open: isOpen.value }], onClick: toggle }, isOpen.value ? '⌄' : '›')
              : h('span', { class: ['leaf-dot', toneOf(nodeProps.node.status)] }),
            hasChildren.value
              ? h('span', { class: 'system-icon' }, iconOf(nodeProps.node.label))
              : null,
            h('span', { class: 'row-label' }, nodeProps.node.label),
            hasChildren.value
              ? h('span', { class: 'child-count' }, String(nodeProps.node.children.length))
              : nodeProps.node.status
                ? h('span', { class: ['row-tag', toneOf(nodeProps.node.status)] }, nodeProps.node.status)
                : null,
          ],
        ),
        hasChildren.value && isOpen.value
          ? h('ul', { class: 'tree-children' }, nodeProps.node.children.map(child => h(AssetNode, { key: child.id, node: child, selectedId: nodeProps.selectedId, filter: nodeProps.filter, depth: depth.value + 1, onNodeClick: (n) => emit('node-click', n), onNodeExpand: (n) => emit('node-expand', n), onNodeCollapse: (n) => emit('node-collapse', n) })))
          : null,
      ])
  },
}

function iconOf(label) {
  if (/电力|电气|发电/.test(label)) return '↯'
  if (/消防|救生/.test(label)) return '盾'
  if (/甲板|机械|锚/.test(label)) return '锚'
  return '▤'
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

<style>
.asset-tree {
  display: grid;
  gap: 10px;
}

/* ── 搜索栏（与右侧筛选输入框风格一致）── */
.asset-tree .tree-toolbar { position: relative; }
.asset-tree .tree-toolbar input {
  width: 100%;
  border: 1px solid #d9e4ef;
  border-radius: 8px;
  padding: 9px 12px 9px 34px;
  color: #172033;
  background: #f8fbfe;
  font-size: 13px;
  transition: border-color .15s, background .15s, box-shadow .15s;
}
.asset-tree .tree-toolbar input:focus {
  outline: none;
  border-color: #1e6fd9;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(30, 111, 217, .1);
}
.asset-tree .tree-toolbar input::placeholder { color: #9aa8b8; }
.asset-tree .search-icon {
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
.asset-tree .tree-state { display: grid; gap: 8px; padding: 8px 4px; }
.asset-tree .tree-state.error p { color: #b4232d; margin: 0 0 8px; font-size: 13px; }
.asset-tree .tree-state.error button {
  border: 1px solid #cfdae6; border-radius: 7px; padding: 6px 14px;
  color: #24415f; background: #f6f9fc; font-weight: 700; font-size: 12px; cursor: pointer;
  transition: background .15s, border-color .15s;
}
.asset-tree .tree-state.error button:hover { background: #edf2f8; border-color: #b9c8d8; }
.asset-tree .tree-state.empty p { color: #8b9aab; margin: 0; font-size: 13px; text-align: center; padding: 20px 0; }

.asset-tree .skeleton-line {
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
.asset-tree .tree-root, .asset-tree .tree-children { list-style: none; margin: 0; padding: 0; display: grid; }
.asset-tree .tree-root { gap: 8px; }
.asset-tree .tree-children {
  gap: 3px;
  padding-left: 37px;
  margin-top: 4px;
  position: relative;
}
.asset-tree .tree-children::before {
  content: '';
  position: absolute;
  left: 18px;
  top: 0;
  bottom: 10px;
  width: 1px;
  background: #dde7f2;
}
.asset-tree .tree-node { display: grid; position: relative; }
.asset-tree .tree-children > .tree-node::before {
  content: '';
  position: absolute;
  left: -19px;
  top: 17px;
  width: 18px;
  height: 1px;
  background: #dde7f2;
}

/* ── 行：参考图 1 的轻量树形列表 ── */
.asset-tree .tree-row {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 7px;
  border: 1px solid transparent;
  border-radius: 7px;
  padding: 7px 9px;
  text-align: left;
  background: transparent;
  font-size: 13px;
  color: #172033;
  cursor: pointer;
  transition: border-color .15s, box-shadow .15s, background .15s, color .15s;
  min-height: 34px;
}
.asset-tree .tree-row:hover {
  background: #f3f8fe;
  border-color: #d9e8f8;
}
.asset-tree .tree-row.has-children {
  padding-left: 0;
  background: transparent;
  font-weight: 700;
  color: #172033;
}
.asset-tree .tree-row.has-children:hover {
  background: #f3f8fe;
  border-color: transparent;
  box-shadow: none;
}
.asset-tree .tree-row.leaf {
  color: #3e5068;
}
.asset-tree .tree-row.selected {
  border-color: transparent;
  background: #eaf3ff;
  color: #132039;
  font-weight: 700;
  box-shadow: none;
}
.asset-tree .tree-row.selected:hover { background: #e2efff; }

/* ── 展开/折叠图标 ── */
.asset-tree .caret {
  width: 18px;
  height: 18px;
  display: grid;
  place-items: center;
  border-radius: 4px;
  color: #31577e;
  cursor: pointer;
  font-size: 17px;
  line-height: 1;
  transition: background .12s, color .12s;
  flex-shrink: 0;
  user-select: none;
}
.asset-tree .caret:hover { background: #dcecff; color: #1e6fd9; }
.asset-tree .caret.open { color: #1e5d9d; }
.asset-tree .leaf-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid #0f9f7a;
  background: #fff;
  margin-left: 2px;
  margin-right: 8px;
  flex-shrink: 0;
}
.asset-tree .tree-row.selected .leaf-dot { border-color: #1e6fd9; background: #fffbe8; }
.asset-tree .leaf-dot.danger { border-color: #d83b47; }
.asset-tree .leaf-dot.ok { border-color: #0f9f7a; }
.asset-tree .leaf-dot.active { border-color: #1e6fd9; }
.asset-tree .leaf-dot.pending { border-color: #d29a16; }

.asset-tree .system-icon {
  width: 24px;
  height: 24px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  color: #fff;
  background: linear-gradient(135deg, #4e9af1, #1e6fd9);
  box-shadow: 0 5px 12px rgba(30,111,217,.18);
  font-size: 13px;
}

.asset-tree .row-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.asset-tree .child-count {
  min-width: 25px;
  height: 24px;
  border-radius: 999px;
  padding: 0 8px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: #5c7189;
  background: #eaf0f7;
  font-size: 12px;
  font-weight: 900;
}

/* ── 状态标签：与右侧 StatusBadge 配色一致 ── */
.asset-tree .row-tag {
  font-size: 11px;
  font-weight: 800;
  border-radius: 999px;
  padding: 4px 10px;
  white-space: nowrap;
  flex-shrink: 0;
}
.asset-tree .row-tag.danger { color: #b4232d; background: #ffe1e3; }
.asset-tree .row-tag.ok { color: #11734d; background: #dff6e8; }
.asset-tree .row-tag.active { color: #1f5fbf; background: #e3efff; }
.asset-tree .row-tag.pending { color: #8a5a00; background: #fff2cc; }
</style>
