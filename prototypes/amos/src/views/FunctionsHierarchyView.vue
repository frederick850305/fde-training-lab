<template>
  <div class="biz-win">
    <div class="bw-head">
      <h2>Functions Hierarchy</h2>
      <div class="row" style="gap:6px">
        <button class="amos-btn sm" :class="{ primary: showNumber }" @click="showNumber = !showNumber">
          Toggle number（显示 SFI 编码）
        </button>
        <button class="amos-btn sm" @click="expandAll(true)">Expand All</button>
        <button class="amos-btn sm" @click="expandAll(false)">Collapse All</button>
        <button class="amos-btn sm" @click="onFind">Find… (F3)</button>
        <button class="amos-btn sm primary" @click="openNew">New Function</button>
      </div>
    </div>

    <div class="hier-body">
      <div class="hier-tree">
        <TreeNode
          v-for="node in roots"
          :key="node.id"
          :node="node"
          :show-number="showNumber"
          :depth="0"
          :selected-id="selectedId"
          :expanded-ids="expandedIds"
          @select="onSelect"
          @open-component="openComponent"
          @toggle="onToggle"
        />
      </div>
      <div class="hier-info" v-if="selected && selected.__type === 'function'">
        <h3>Function：{{ selected.functionNo }}</h3>
        <div class="amos-field"><label>Function No.</label><div class="ctrl"><input class="amos-input" :value="selected.functionNo" readonly /></div></div>
        <div class="amos-field"><label>Description</label><div class="ctrl"><input class="amos-input" v-model="selected.description" /></div></div>
        <div class="amos-field"><label>Reference</label><div class="ctrl"><input class="amos-input" v-model="selected.reference" /></div></div>
        <div class="amos-field"><label>Parent Function</label><div class="ctrl">
          <select class="amos-select" v-model="selected.parentFunctionNo">
            <option value="">（无）</option>
            <option v-for="o in parentOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
          </select>
        </div></div>
        <div class="amos-field"><label>Location</label><div class="ctrl">
          <select class="amos-select" v-model="selected.location">
            <option v-for="o in locationOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
          </select>
        </div></div>
        <div class="amos-field"><label>Criticality</label><div class="ctrl">
          <select class="amos-select" v-model="selected.criticality">
            <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
          </select>
        </div></div>
        <div class="amos-field"><label>Status</label><div class="ctrl">
          <select class="amos-select" v-model="selected.status">
            <option>In Use</option><option>Scrapped</option>
          </select>
        </div></div>
        <div class="amos-field"><label>Installed Component</label><div class="ctrl"><input class="amos-input" :value="selected.installedComponentId" readonly /></div></div>
        <button class="amos-btn sm primary" @click="saveSelected">Save</button>
      </div>
      <div class="hier-info" v-else-if="selected && selected.__type === 'component'">
        <h3>Component：{{ selected.number }}</h3>
        <div class="amos-field" v-for="f in infoFields" :key="f.k">
          <label>{{ f.k }}</label>
          <div class="ctrl"><input class="amos-input" :value="f.v" readonly /></div>
        </div>
        <button class="amos-btn sm primary" @click="openComponent(selected.number)">打开 Components 窗口</button>
      </div>
      <div class="hier-info empty" v-else>
        <p class="muted">Function（功能位置）是固定的，部件可在不同功能位置间轮换（手册 2.5）。点击 Toggle number 显示 / 隐藏 SFI 编码。选中功能位置可编辑并保存，或点击 New Function 创建。</p>
      </div>
    </div>

    <Modal v-if="findOpen" title="Find Function" width="460px" @close="findOpen = false">
      <div class="amos-field">
        <label>Search（编码或名称片段）</label>
        <div class="ctrl"><input class="amos-input" v-model="findText" placeholder="如 ENG 或 Boiler" @keyup.enter="doFind" /></div>
      </div>
      <div v-if="findHits.length" class="find-hits">
        <button v-for="h in findHits" :key="h.id" class="hit" @click="jumpTo(h)">{{ h.no }} — {{ h.label }}</button>
      </div>
      <p v-else-if="findText" class="muted">无匹配项。</p>
      <template #footer>
        <button class="amos-btn" @click="findOpen = false">Close</button>
        <button class="amos-btn primary" @click="doFind">Find</button>
      </template>
    </Modal>

    <!-- 手册 Working with Functions：在 Functions Hierarchy 窗口创建新功能位置 -->
    <Modal v-if="newOpen" title="New Function" width="480px" @close="newOpen = false">
      <div class="amos-field"><label>Function No.</label><div class="ctrl"><input class="amos-input" v-model="newForm.functionNo" placeholder="如 FN-AUX-01" /></div></div>
      <div class="amos-field"><label>Description</label><div class="ctrl"><input class="amos-input" v-model="newForm.description" /></div></div>
      <div class="amos-field"><label>Reference</label><div class="ctrl"><input class="amos-input" v-model="newForm.reference" /></div></div>
      <div class="amos-field"><label>Parent Function</label><div class="ctrl">
        <select class="amos-select" v-model="newForm.parentFunctionNo">
          <option value="">（无）</option>
          <option v-for="o in allFunctionOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
        </select>
      </div></div>
      <div class="amos-field"><label>Location</label><div class="ctrl">
        <select class="amos-select" v-model="newForm.location">
          <option v-for="o in locationOptions" :key="o.code" :value="o.code">{{ o.label }}</option>
        </select>
      </div></div>
      <div class="amos-field"><label>Criticality</label><div class="ctrl">
        <select class="amos-select" v-model="newForm.criticality">
          <option>Critical</option><option>High</option><option>Medium</option><option>Low</option>
        </select>
      </div></div>
      <div class="amos-field"><label>Status</label><div class="ctrl">
        <select class="amos-select" v-model="newForm.status">
          <option>In Use</option><option>Scrapped</option>
        </select>
      </div></div>
      <template #footer>
        <button class="amos-btn" @click="newOpen = false">Cancel</button>
        <button class="amos-btn primary" @click="createFunction">OK</button>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Modal from '../components/Modal.vue'
import TreeNode from '../components/TreeNode.vue'
import { componentService } from '../services/componentService.js'
import { functionService } from '../services/functionService.js'
import { lookups } from '../mock/index.js'
import { openWindow, setPresetFilter, showToast } from '../store.js'

const showNumber = ref(true)
const selected = ref(null)
const selectedId = ref('')
const findOpen = ref(false)
const findText = ref('')
const findHits = ref([])
const newOpen = ref(false)
const newForm = ref(blankForm())
// 展开/折叠状态独立于树结构
const expandedIds = ref(new Set())

const compByNo = computed(() => componentService.byNo())
const funcByNo = computed(() => functionService.byNo())

const locationOptions = computed(() => lookups.locations())
const allFunctionOptions = computed(() => lookups.functions())
const parentOptions = computed(() => lookups.functions().filter((o) => o.code !== (selected.value && selected.value.functionNo)))

function blankForm() {
  return { functionNo: '', description: '', reference: '', parentFunctionNo: '', location: 'Engine Room', criticality: 'Medium', status: 'In Use' }
}

// ===== 功能位置树：按 parentFunctionNo 嵌套；已安装部件作为叶子 =====
const roots = computed(() => {
  const nodes = {}
  functionService.list().forEach((f) => {
    nodes[f.functionNo] = { id: 'fn:' + f.functionNo, type: 'function', no: f.functionNo, label: f.description, status: f.status, children: [] }
  })
  functionService.list().forEach((f) => {
    const node = nodes[f.functionNo]
    if (f.installedComponentId && compByNo.value[f.installedComponentId]) {
      const c = compByNo.value[f.installedComponentId]
      node.children.push({ id: 'co:' + c.number, type: 'component', no: c.number, label: c.name + '（已安装）', status: c.status, children: [] })
    }
    if (f.parentFunctionNo && nodes[f.parentFunctionNo]) nodes[f.parentFunctionNo].children.push(node)
  })
  return functionService.roots().map((f) => nodes[f.functionNo])
})

const infoFields = computed(() => {
  const s = selected.value
  if (!s || s.__type !== 'component') return []
  return [
    { k: 'Number', v: s.number }, { k: 'Name', v: s.name }, { k: 'Type No.', v: s.typeNumber },
    { k: 'Function (SFI)', v: s.functionNo }, { k: 'Status', v: s.status },
  ]
})

function onSelect(node) {
  selectedId.value = node.id
  if (node.type === 'function') {
    // 取 db 对象引用，编辑直接作用于内存数据，Save 时持久化
    selected.value = functionService.get(node.no)
    if (selected.value) selected.value.__type = 'function'
  } else {
    const c = compByNo.value[node.no]
    if (c) { c.__type = 'component'; selected.value = c }
    else selected.value = null
  }
}
function onToggle(id) {
  const s = new Set(expandedIds.value)
  if (s.has(id)) s.delete(id)
  else s.add(id)
  expandedIds.value = s
}
function openComponent(no) { setPresetFilter({ number: no }); openWindow('components') }
function expandAll(v) {
  const s = v ? new Set(roots.value.flatMap(collectIds)) : new Set()
  expandedIds.value = s
}
function collectIds(n) {
  const ids = [n.id]
  if (n.children) n.children.forEach((c) => ids.push(...collectIds(c)))
  return ids
}
function onFind() { findText.value = ''; findHits.value = []; findOpen.value = true }
function doFind() {
  const s = findText.value.trim().toLowerCase()
  if (!s) { findHits.value = []; return }
  findHits.value = functionService.search(s)
    .map((f) => ({ id: 'fn:' + f.functionNo, no: f.functionNo, label: f.description, type: 'function' }))
}
function jumpTo(h) { onSelect(h); findOpen.value = false; showToast('已定位：' + h.no, 'info') }

// 手册 Working with Functions：编辑后保存功能位置
function saveSelected() {
  const s = selected.value
  if (!s || s.__type !== 'function') return
  functionService.update(s.functionNo, {
    description: s.description,
    reference: s.reference,
    parentFunctionNo: s.parentFunctionNo,
    location: s.location,
    criticality: s.criticality,
    status: s.status,
  })
  showToast('功能位置已保存：' + s.functionNo, 'ok')
}
function openNew() { newForm.value = blankForm(); newOpen.value = true }
function createFunction() {
  const f = newForm.value
  if (!f.functionNo || !f.description) { showToast('请填写 Function No. 与 Description', 'warn'); return }
  if (functionService.get(f.functionNo)) { showToast('该 Function No. 已存在', 'warn'); return }
  functionService.add({ ...f })
  newOpen.value = false
  expandedIds.value = new Set(functionService.list().map((x) => 'fn:' + x.functionNo))
  showToast('已创建功能位置：' + f.functionNo, 'ok')
}

// 手册 2.5：F3 打开查找窗口
function onKey(e) { if (e.key === 'F3') { e.preventDefault(); onFind() } }
onMounted(() => {
  // 初始化：Function 节点默认展开
  expandedIds.value = new Set(functionService.list().map((f) => 'fn:' + f.functionNo))
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<style scoped>
.biz-win { display: flex; flex-direction: column; height: 100%; }
.bw-head { display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-bottom: 1px solid var(--amos-border); }
.bw-head h2 { margin: 0; font-size: 15px; color: #2c486a; }
.hier-body { flex: 1; display: grid; grid-template-columns: 1.3fr 1fr; min-height: 0; }
.hier-tree { border-right: 1px solid var(--amos-border); padding: 10px; overflow: auto; }
.hier-info { padding: 14px; overflow: auto; }
.hier-info.empty { display: flex; align-items: center; }
.hier-info .amos-field { margin-bottom: 8px; }
.find-hits { margin-top: 8px; display: flex; flex-direction: column; gap: 4px; max-height: 220px; overflow: auto; }
.hit { text-align: left; border: 1px solid var(--amos-border); background: #fff; border-radius: 6px; padding: 6px 8px; cursor: pointer; font-size: 12.5px; }
.hit:hover { background: #eef3fb; border-color: var(--amos-blue); }
@media (max-width: 980px) { .hier-body { grid-template-columns: 1fr; } .hier-tree { border-right: none; border-bottom: 1px solid var(--amos-border); } }
</style>
