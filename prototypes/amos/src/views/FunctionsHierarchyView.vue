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
        <div class="bw-options">
          <button class="amos-btn sm" @click="optionsOpen = !optionsOpen" :disabled="!selected || selected.__type !== 'function'">Options ▾</button>
          <div v-if="optionsOpen" class="bw-options-menu" @mouseleave="optionsOpen = false">
            <button @click="openInstall" :disabled="!!selected?.installedComponentId">Install Component</button>
            <button @click="openRemove" :disabled="!selected?.installedComponentId">Remove Component</button>
            <button @click="openChangeStatus" :disabled="!!selected?.installedComponentId">Change Status</button>
            <!-- 手册 P41 末尾：Function Hierarchy Options 菜单的 Component / History -->
            <button @click="openCompInfo" :disabled="!selected?.installedComponentId">Component</button>
            <button @click="openHistory" :disabled="!selected?.installedComponentId">History</button>
          </div>
        </div>
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
        <div class="amos-field"><label>Status</label><div class="ctrl"><input class="amos-input" :value="selected.status" readonly /></div></div>
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

    <!-- Change Function Status 对话框（手册 2 / P38-39 Changing Function Status） -->
    <Modal v-if="changeStatusOpen" title="Change Function Status" width="460px" @close="changeStatusOpen = false">
      <p class="muted">功能位置：<b>{{ selected?.functionNo }}</b>　当前状态：<b>{{ selected?.status }}</b></p>
      <div class="amos-field">
        <label>New Status</label>
        <div class="ctrl">
          <select class="amos-select" v-model="changeStatusTarget">
            <option v-for="s in functionStatusOptions" :key="s" :value="s">{{ s }}</option>
          </select>
        </div>
      </div>
      <label class="row" style="gap:6px;margin-top:8px" :class="{ disabled: !hasSubFunctions }">
        <input type="checkbox" v-model="changeStatusCascade" :disabled="!hasSubFunctions" />
        Change status of sub-functions also
      </label>
      <p v-if="!hasSubFunctions" class="muted" style="margin:4px 0 0;font-size:12px">所选功能位置没有子功能位置。</p>
      <template #footer>
        <button class="amos-btn" @click="changeStatusOpen = false">Cancel</button>
        <button class="amos-btn primary" @click="confirmChangeStatus">OK</button>
      </template>
    </Modal>

    <!-- Install Component 对话框（手册 P40） -->
    <Modal v-if="installOpen" title="Install Component" width="460px" @close="installOpen = false">
      <p class="muted">功能位置：<b>{{ selected?.functionNo }}</b>　Location：<b>{{ selected?.location }}</b></p>
      <div class="amos-field"><label>Component</label><div class="ctrl">
        <select class="amos-select" v-model="installSelected">
          <option v-for="c in installCandidates" :key="c.id" :value="c.number">{{ c.number }} — {{ c.name }}</option>
        </select>
      </div></div>
      <!-- 手册 P40：New Component Location 与功能位置的 location 相同 -->
      <div class="amos-field"><label>New Component Location</label><div class="ctrl"><input class="amos-input" :value="selected?.location" readonly /></div></div>
      <div class="amos-field"><label>Details</label><div class="ctrl"><textarea class="amos-textarea" v-model="installDetails" placeholder="安装评论（可选）" /></div></div>
      <template #footer>
        <button class="amos-btn" @click="installOpen = false">Cancel</button>
        <button class="amos-btn primary" @click="confirmInstall">OK</button>
      </template>
    </Modal>

    <!-- Remove Component 对话框（手册 P42） -->
    <Modal v-if="removeOpen" title="Remove Component" width="480px" @close="removeOpen = false">
      <p class="muted">从功能位置 <b>{{ selected?.functionNo }}</b> 拆卸组件 <b>{{ selected?.installedComponentId }}</b>。</p>
      <div class="amos-field"><label>New Location</label><div class="ctrl"><input class="amos-input" v-model="removeState.newLocation" placeholder="组件拆卸后移动到的新 Location" /></div></div>
      <div class="amos-field"><label>Status</label><div class="ctrl">
        <select class="amos-select" v-model="removeState.status">
          <option value="">（保持当前状态）</option>
          <option>Scrapped</option>
          <option>Transferred</option>
          <option>Available</option>
        </select>
      </div></div>
      <div class="amos-field"><label>Details</label><div class="ctrl"><textarea class="amos-textarea" v-model="removeState.details" placeholder="拆卸评论（可选）" /></div></div>
      <label class="row" style="gap:6px;margin-top:8px" :class="{ disabled: !hasSubFunctions }">
        <input type="checkbox" v-model="removeState.cascadeSubFunctions" :disabled="!hasSubFunctions" />
        Remove components from sub-functions also
      </label>
      <p v-if="!hasSubFunctions" class="muted" style="margin:4px 0 0;font-size:12px">所选功能位置没有子功能位置。</p>
      <template #footer>
        <button class="amos-btn" @click="removeOpen = false">Cancel</button>
        <button class="amos-btn primary" @click="confirmRemove">OK</button>
      </template>
    </Modal>

    <!-- Component 信息对话框（手册 P41 末尾 Options > Component） -->
    <Modal v-if="compInfoOpen" title="Component" width="460px" @close="compInfoOpen = false">
      <div v-if="installedComp" class="amos-field" v-for="f in compInfoFields" :key="f.k">
        <label>{{ f.k }}</label>
        <div class="ctrl"><input class="amos-input" :value="f.v" readonly /></div>
      </div>
      <p v-else class="muted">（未安装组件）</p>
      <template #footer>
        <button class="amos-btn primary" @click="compInfoOpen = false">Close</button>
      </template>
    </Modal>

    <!-- History 对话框（手册 P41 末尾 Options > History：Rotation Log） -->
    <Modal v-if="historyOpen" title="History" width="540px" @close="historyOpen = false">
      <table class="amos-grid sub" v-if="selected?.rotationLog?.length">
        <thead><tr><th>Component</th><th>Action</th><th>By</th><th>Date</th><th>Details</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in selected.rotationLog" :key="i">
            <td>{{ r.componentNo }}</td><td>{{ r.action }}</td><td>{{ r.performedBy }}</td><td>{{ r.performedAt }}</td><td>{{ r.details }}</td>
          </tr>
        </tbody>
      </table>
      <p v-else class="muted">（无安装 / 拆卸历史）</p>
      <template #footer>
        <button class="amos-btn primary" @click="historyOpen = false">Close</button>
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
import { db } from '../mock/index.js'
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
// 手册 2 / P38-39：Options > Change Status
const optionsOpen = ref(false)
const changeStatusOpen = ref(false)
const changeStatusTarget = ref('In Use')
const changeStatusCascade = ref(false)
const functionStatusOptions = ['In Use', 'Scrapped']
const hasSubFunctions = computed(() => selected.value && selected.value.__type === 'function' && db.functions.some((f) => f.parentFunctionNo === selected.value.functionNo))

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

// 手册 Working with Functions：编辑后保存功能位置（Status 为只读指示，改状态统一走 Options > Change Status）
function saveSelected() {
  const s = selected.value
  if (!s || s.__type !== 'function') return
  const prev = functionService.get(s.functionNo)
  const oldLocation = prev ? prev.location : ''
  functionService.update(s.functionNo, {
    description: s.description,
    reference: s.reference,
    parentFunctionNo: s.parentFunctionNo,
    location: s.location,
    criticality: s.criticality,
  })
  // 手册 P40：function location 改变 → 级联更新已安装组件的 location
  if (oldLocation && oldLocation !== s.location) {
    functionService.updateLocation(s.functionNo, s.location)
    showToast('功能位置地点变更，已级联更新安装组件的 Location', 'info')
  }
  showToast('功能位置已保存：' + s.functionNo, 'ok')
}
// 手册 2 / P38-39 Changing Function Status：Options > Change Status
function openChangeStatus() {
  optionsOpen.value = false
  const s = selected.value
  if (!s || s.__type !== 'function') { showToast('请先选择功能位置', 'warn'); return }
  // 手册：不能对当前装有 component 的 function 更改 status
  if (s.installedComponentId) {
    showToast('该功能位置已安装组件，不能更改状态（请先 Remove Component）', 'warn')
    return
  }
  changeStatusTarget.value = s.status
  changeStatusCascade.value = false
  changeStatusOpen.value = true
}
function confirmChangeStatus() {
  const s = selected.value
  if (!s || s.__type !== 'function') return
  const res = functionService.changeStatus(s.functionNo, changeStatusTarget.value, { cascadeSubFunctions: changeStatusCascade.value })
  if (!res.ok) {
    if (res.reason === 'installed') showToast('该功能位置已安装组件，不能更改状态', 'warn')
    else showToast('状态修改失败', 'warn')
    return
  }
  changeStatusOpen.value = false
  // 同步 db 最新值回选中对象
  res.updatedIds.forEach((id) => {
    const f = db.functions.find((x) => x.id === id)
    if (f && selected.value && selected.value.id === id) {
      selected.value.status = f.status
    }
  })
  const extra = changeStatusCascade.value && res.updatedIds.length > 1 ? `（含 ${res.updatedIds.length - 1} 个子功能位置）` : ''
  showToast('功能位置状态已改为 ' + changeStatusTarget.value + extra, 'ok')
}

// ===== Install / Remove Component（手册 P40/P42，Functions Hierarchy 窗口 Options）=====
const installOpen = ref(false)
const installSelected = ref('')
const installDetails = ref('')
const installCandidates = computed(() => {
  if (!selected.value || selected.value.__type !== 'function') return []
  // 当前未安装到任何功能位置（或已安装到本 function）的组件可被选作安装
  return componentService.listSync().filter((c) => !c.functionNo || c.functionNo === selected.value.functionNo)
})
function openInstall() {
  optionsOpen.value = false
  const s = selected.value
  if (!s || s.__type !== 'function') { showToast('请先选择功能位置', 'warn'); return }
  if (s.installedComponentId) { showToast('该功能位置已安装组件，请先 Remove Component', 'warn'); return }
  installSelected.value = installCandidates.value[0]?.number || ''
  installDetails.value = ''
  installOpen.value = true
}
async function confirmInstall() {
  const s = selected.value
  if (!s || !installSelected.value) { showToast('请选择组件', 'warn'); return }
  await functionService.installComponent(s.functionNo, installSelected.value, installDetails.value)
  installOpen.value = false
  showToast(`已将 ${installSelected.value} 安装到 ${s.functionNo}`, 'ok')
}
const removeOpen = ref(false)
const removeState = reactive({ newLocation: '', status: '', details: '', cascadeSubFunctions: false })
function openRemove() {
  optionsOpen.value = false
  const s = selected.value
  if (!s || s.__type !== 'function') { showToast('请先选择功能位置', 'warn'); return }
  if (!s.installedComponentId) { showToast('该功能位置未安装组件', 'warn'); return }
  removeState.newLocation = ''
  removeState.status = ''
  removeState.details = ''
  removeState.cascadeSubFunctions = false
  removeOpen.value = true
}
async function confirmRemove() {
  const s = selected.value
  if (!s) return
  await functionService.removeComponent(s.functionNo, {
    newLocation: removeState.newLocation,
    status: removeState.status,
    details: removeState.details,
    cascadeSubFunctions: removeState.cascadeSubFunctions,
  })
  removeOpen.value = false
  const extra = removeState.cascadeSubFunctions ? '（含子功能位置）' : ''
  showToast(`已从 ${s.functionNo} 拆卸组件${extra}`, 'ok')
}

// 手册 P41 末尾 Options > Component：只读显示已安装组件信息
const compInfoOpen = ref(false)
const installedComp = computed(() => {
  const s = selected.value
  if (!s || s.__type !== 'function' || !s.installedComponentId) return null
  return compByNo.value[s.installedComponentId] || null
})
const compInfoFields = computed(() => {
  const c = installedComp.value
  if (!c) return []
  return [
    { k: 'Component No.', v: c.number }, { k: 'Name', v: c.name }, { k: 'Type No.', v: c.typeNumber },
    { k: 'Status', v: c.status }, { k: 'Location', v: c.location }, { k: 'Maker', v: c.maker }, { k: 'Serial No.', v: c.serialNo },
  ]
})
function openCompInfo() {
  optionsOpen.value = false
  if (!installedComp.value) { showToast('该功能位置未安装组件', 'warn'); return }
  compInfoOpen.value = true
}
// 手册 P41 末尾 Options > History：Rotation Log
const historyOpen = ref(false)
function openHistory() {
  optionsOpen.value = false
  const s = selected.value
  if (!s || s.__type !== 'function' || !s.installedComponentId) { showToast('该功能位置未安装组件', 'warn'); return }
  historyOpen.value = true
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
.bw-options { position: relative; }
.bw-options-menu { position: absolute; right: 0; top: 30px; background: #fff; border: 1px solid var(--amos-border-strong); border-radius: 6px; box-shadow: var(--amos-shadow); z-index: 50; min-width: 200px; padding: 4px; }
.bw-options-menu button { display: block; width: 100%; text-align: left; border: none; background: transparent; padding: 7px 10px; border-radius: 4px; cursor: pointer; font-size: 12.5px; }
.bw-options-menu button:hover { background: var(--amos-blue-soft); }
.row.disabled { opacity: 0.5; cursor: not-allowed; }
.row.disabled input { cursor: not-allowed; }
@media (max-width: 980px) { .hier-body { grid-template-columns: 1fr; } .hier-tree { border-right: none; border-bottom: 1px solid var(--amos-border); } }
</style>
