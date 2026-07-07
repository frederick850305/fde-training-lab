<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">系统管理 / 角色权限</span>
        <h1>角色权限管理</h1>
        <p>按角色管理菜单与操作权限矩阵，支持角色复制、权限勾选与保存发布。左侧选择角色，右侧以"模块 × 操作"矩阵形式展示并编辑权限。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" @click="copyRole" :disabled="!selectedRole">复制角色</button>
        <button type="button" class="primary" @click="askSave" :disabled="!selectedRole">保存权限</button>
      </div>
    </header>

    <!-- 加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
    </div>

    <!-- 空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无角色数据</h2>
      <p>权限中心未返回角色或权限模块数据，可刷新重试。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>角色权限加载失败</h2>
      <p>{{ errorMsg || '请检查权限中心服务状态后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <section class="kpi-grid">
        <article class="kpi-card active"><strong>{{ roles.length }}</strong><span>角色总数</span></article>
        <article class="kpi-card ok"><strong>{{ totalUserCount }}</strong><span>关联用户</span></article>
        <article class="kpi-card warn"><strong>{{ permissionModules.length }}</strong><span>权限模块</span></article>
        <article class="kpi-card"><strong>{{ dirty ? '未保存' : '已同步' }}</strong><span>变更状态</span></article>
      </section>

      <section class="role-layout">
        <!-- 左侧角色列表 -->
        <article class="panel role-list-panel">
          <div class="panel-title">
            <h2>角色列表</h2>
            <span>{{ roles.length }} 个</span>
          </div>
          <input v-model="roleKeyword" class="role-search" placeholder="搜索角色名称" />
          <ul class="role-list">
            <li
              v-for="r in filteredRoles"
              :key="r.roleId"
              :class="{ selected: selectedRole?.roleId === r.roleId }"
              @click="selectRole(r)"
            >
              <div class="role-head">
                <strong>{{ r.roleName }}</strong>
                <StatusBadge :label="r.userCount > 0 ? '使用中' : '空闲'" />
              </div>
              <p>{{ r.description }}</p>
              <small>{{ r.userCount }} 人关联 · {{ r.roleId }}</small>
            </li>
          </ul>
        </article>

        <!-- 右侧权限矩阵 -->
        <article class="panel matrix-panel">
          <div class="panel-title">
            <h2>{{ selectedRole ? selectedRole.roleName + ' 权限矩阵' : '请选择角色' }}</h2>
            <span v-if="selectedRole">版本 {{ selectedRole.roleId }} · {{ enabledPermCount }} 项已授权</span>
          </div>

          <div v-if="!selectedRole" class="empty-inline">请从左侧选择一个角色以查看和编辑权限。</div>

          <template v-else>
            <div class="role-desc">
              <label><span>角色名称</span><input v-model="editingRole.roleName" /></label>
              <label><span>角色描述</span><input v-model="editingRole.description" /></label>
            </div>

            <div class="matrix-scroll">
              <table class="matrix-table">
                <thead>
                  <tr>
                    <th class="col-module">权限模块</th>
                    <th v-for="op in allOps" :key="op">{{ opLabel(op) }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="mod in permissionModules" :key="mod.key">
                    <td class="col-module">
                      <strong>{{ mod.label }}</strong>
                      <small>{{ mod.key }}</small>
                    </td>
                    <td v-for="op in allOps" :key="op" class="col-check">
                      <input
                        type="checkbox"
                        :checked="hasPerm(mod.key, op)"
                        :disabled="!mod.ops.includes(op)"
                        @change="togglePerm(mod.key, op, $event.target.checked)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="matrix-legend">
              <span><i class="dot enabled"></i> 已授权</span>
              <span><i class="dot disabled"></i> 不可用（模块未提供该操作）</span>
              <span class="dirty-tip" v-if="dirty">存在未保存的变更，请点击"保存权限"。</span>
            </div>
          </template>
        </article>
      </section>
    </template>

    <ConfirmationDialog
      :open="confirmOpen"
      :title="confirmTitle"
      :message="confirmMessage"
      @cancel="confirmOpen = false"
      @confirm="confirmAction"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchRoles, fetchPermissionModules, submitAction } from '@/mock/api.js'

const roles = ref([])
const modules = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const roleKeyword = ref('')
const selectedRole = ref(null)
const editingRole = reactive({ roleId: '', roleName: '', description: '' })
const editingPerms = ref({})

const dirty = ref(false)
const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

const permissionModules = computed(() => modules.value)

const allOps = computed(() => {
  const set = new Set()
  modules.value.forEach(m => m.ops.forEach(o => set.add(o)))
  return [...set]
})

const filteredRoles = computed(() => {
  const kw = roleKeyword.value.trim()
  if (!kw) return roles.value
  return roles.value.filter(r => r.roleName.includes(kw) || r.description.includes(kw))
})

const totalUserCount = computed(() => roles.value.reduce((sum, r) => sum + (r.userCount || 0), 0))

const enabledPermCount = computed(() => {
  let n = 0
  for (const mod of modules.value) {
    for (const op of mod.ops) {
      if (editingPerms.value[mod.key]?.includes(op)) n++
    }
  }
  return n
})

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [r, m] = await Promise.all([fetchRoles(), fetchPermissionModules()])
    roles.value = r
    modules.value = m
    if (r.length) selectRole(r[0])
    uiState.value = r.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function selectRole(r) {
  selectedRole.value = r
  editingRole.roleId = r.roleId
  editingRole.roleName = r.roleName
  editingRole.description = r.description
  // 深拷贝权限到编辑态
  const copy = {}
  for (const key of Object.keys(r.permissions || {})) {
    copy[key] = [...(r.permissions[key] || [])]
  }
  editingPerms.value = copy
  dirty.value = false
}

watch(editingPerms, () => { dirty.value = true }, { deep: true })
watch(() => editingRole.roleName, () => { dirty.value = true })
watch(() => editingRole.description, () => { dirty.value = true })

function hasPerm(modKey, op) {
  return (editingPerms.value[modKey] || []).includes(op)
}

function togglePerm(modKey, op, checked) {
  const cur = editingPerms.value[modKey] ? [...editingPerms.value[modKey]] : []
  const idx = cur.indexOf(op)
  if (checked && idx === -1) cur.push(op)
  if (!checked && idx !== -1) cur.splice(idx, 1)
  editingPerms.value = { ...editingPerms.value, [modKey]: cur }
  dirty.value = true
}

function opLabel(op) {
  const map = { view: '查看', edit: '编辑', approve: '审批', execute: '执行', export: '导出', dispatch: '调度', resolve: '处置', scan: '扫码', offline: '离线', publish: '发布', simulate: '模拟', mark: '标记', receipt: '验收' }
  return map[op] || op
}

function copyRole() {
  if (!selectedRole.value) return
  pendingAction.value = { type: 'copy' }
  confirmTitle.value = '复制角色'
  confirmMessage.value = `将基于「${selectedRole.value.roleName}」创建一个角色副本（含全部权限），副本名称默认追加"_副本"。`
  confirmOpen.value = true
}

function askSave() {
  if (!selectedRole.value) return
  pendingAction.value = { type: 'save' }
  confirmTitle.value = '保存权限配置'
  confirmMessage.value = `将保存「${editingRole.roleName}」的权限矩阵（${enabledPermCount.value} 项已授权），并写入配置审计日志。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  try {
    if (action.type === 'copy') {
      await submitAction('copyRole', { sourceRoleId: selectedRole.value.roleId })
      const src = selectedRole.value
      const newRole = {
        roleId: `R${String(roles.value.length + 1).padStart(2, '0')}`,
        roleName: src.roleName + '_副本',
        description: src.description + '（复制）',
        userCount: 0,
        permissions: JSON.parse(JSON.stringify(editingPerms.value)),
      }
      roles.value = [...roles.value, newRole]
      selectRole(newRole)
    } else if (action.type === 'save') {
      await submitAction('saveRolePermission', {
        roleId: editingRole.roleId,
        roleName: editingRole.roleName,
        description: editingRole.description,
        permissions: editingPerms.value,
      })
      // 同步回原角色
      const target = roles.value.find(r => r.roleId === editingRole.roleId)
      if (target) {
        target.roleName = editingRole.roleName
        target.description = editingRole.description
        target.permissions = JSON.parse(JSON.stringify(editingPerms.value))
      }
      dirty.value = false
    }
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '操作失败：' + (e?.message || '未知错误')
  }
}
</script>

<style scoped>
.page-screen { display: grid; gap: 16px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; border: 1px solid #d9e4ef; border-radius: 8px; padding: 20px; background: #fff; }
.module-label { color: #1e6fd9; font-size: 12px; font-weight: 900; }
h1 { margin: 6px 0 8px; font-size: 24px; }
.page-header p { max-width: 920px; margin: 0; color: #53657c; line-height: 1.55; }
.header-actions { display: flex; gap: 9px; flex-wrap: wrap; }
button { border: 1px solid #cfdae6; border-radius: 7px; padding: 8px 13px; color: #24415f; background: #f6f9fc; font-weight: 900; }
button.primary { color: #fff; border-color: #1e6fd9; background: #1e6fd9; }
button:disabled { opacity: .55; cursor: not-allowed; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }

.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.kpi-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 15px; background: #fff; }
.kpi-card strong { display: block; color: #1e6fd9; font-size: 24px; }
.kpi-card span { color: #64748b; font-size: 12px; font-weight: 800; }
.kpi-card.ok strong { color: #11734d; }
.kpi-card.warn strong { color: #1e6fd9; }

.role-layout { display: grid; grid-template-columns: 320px minmax(0, 1fr); gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.role-search { width: 100%; min-height: 36px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; margin-bottom: 10px; background: #fff; }
.role-list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
.role-list li { border: 1px solid #e2eaf3; border-radius: 8px; padding: 12px; cursor: pointer; background: #f8fbfe; }
.role-list li:hover { border-color: #1e6fd9; }
.role-list li.selected { border-color: #1e6fd9; background: #edf5ff; }
.role-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.role-head strong { font-size: 14px; }
.role-list p { margin: 6px 0 4px; color: #64748b; font-size: 12px; line-height: 1.4; }
.role-list small { color: #8b9aab; font-size: 11px; }

.matrix-panel { min-height: 420px; }
.empty-inline { padding: 40px; text-align: center; color: #8b9aab; border: 1px dashed #cdd9e6; border-radius: 8px; }

.role-desc { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
.role-desc label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.role-desc input { min-height: 36px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; background: #fff; }

.matrix-scroll { overflow-x: auto; border: 1px solid #e7edf4; border-radius: 8px; }
.matrix-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.matrix-table th, .matrix-table td { padding: 10px; border-bottom: 1px solid #e7edf4; text-align: center; }
.matrix-table th { color: #63748a; background: #f7fafc; font-weight: 900; }
.col-module { text-align: left !important; min-width: 160px; }
.col-module strong { display: block; }
.col-module small { color: #8b9aab; font-size: 11px; }
.col-check { width: 70px; }
.col-check input { width: 18px; height: 18px; cursor: pointer; }
.col-check input:disabled { cursor: not-allowed; opacity: .35; }
.matrix-table tr:hover td { background: #f8fbfe; }

.matrix-legend { display: flex; gap: 18px; flex-wrap: wrap; margin-top: 12px; color: #64748b; font-size: 12px; font-weight: 800; }
.matrix-legend .dot { display: inline-block; width: 12px; height: 12px; border-radius: 3px; margin-right: 5px; vertical-align: middle; }
.dot.enabled { background: #1e6fd9; }
.dot.disabled { background: #e2eaf3; }
.dirty-tip { color: #b4232d; margin-left: auto; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .role-layout { grid-template-columns: 1fr; }
  .role-desc { grid-template-columns: 1fr; }
}
</style>
