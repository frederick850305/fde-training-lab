<template>
  <section class="page-screen">
    <header class="page-header">
      <div>
        <span class="module-label">系统管理 / 用户管理</span>
        <h1>用户管理</h1>
        <p>维护系统账号、部门归属与角色分配，支持新增/编辑/启停用户，以及批量导入导出。选中用户行可在右侧编辑表单中调整信息并分配角色。</p>
      </div>
      <div class="header-actions">
        <button type="button" @click="reload">刷新</button>
        <button type="button" @click="importUsers">批量导入</button>
        <button type="button" @click="exportUsers">导出</button>
        <button type="button" class="primary" @click="openCreate">新增用户</button>
      </div>
    </header>

    <!-- 状态：加载骨架 -->
    <div v-if="uiState === 'loading'" class="state-panel skeleton">
      <span></span><span></span><span></span><span></span>
      <span class="wide"></span>
    </div>

    <!-- 状态：空 -->
    <div v-else-if="uiState === 'empty'" class="state-panel">
      <h2>暂无用户数据</h2>
      <p>当前筛选条件下没有用户记录，可刷新数据或新增用户。</p>
      <button type="button" @click="reload">刷新数据</button>
    </div>

    <!-- 状态：错误 -->
    <div v-else-if="uiState === 'error'" class="state-panel error">
      <h2>用户数据加载失败</h2>
      <p>{{ errorMsg || '请检查网络或权限中心状态后重试。' }}</p>
      <button type="button" @click="reload">重试</button>
    </div>

    <template v-else>
      <!-- KPI 概览 -->
      <section class="kpi-grid">
        <article class="kpi-card active"><strong>{{ users.length }}</strong><span>用户总数</span></article>
        <article class="kpi-card ok"><strong>{{ enabledCount }}</strong><span>启用中</span></article>
        <article class="kpi-card warn"><strong>{{ disabledCount }}</strong><span>已禁用</span></article>
        <article class="kpi-card"><strong>{{ roleOptions.length }}</strong><span>可分配角色</span></article>
      </section>

      <section class="user-layout">
        <!-- 用户列表 -->
        <article class="panel user-list-panel">
          <div class="panel-title">
            <h2>用户列表</h2>
            <span>{{ filteredUsers.length }} / {{ users.length }} 人</span>
          </div>
          <div class="filter-row">
            <input v-model="keyword" placeholder="搜索账号 / 姓名 / 部门" />
            <select v-model="statusFilter">
              <option value="">全部状态</option>
              <option value="启用">启用</option>
              <option value="禁用">禁用</option>
            </select>
            <select v-model="roleFilter">
              <option value="">全部角色</option>
              <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </div>
          <table>
            <thead>
              <tr>
                <th>账号</th>
                <th>姓名</th>
                <th>部门</th>
                <th>角色</th>
                <th>状态</th>
                <th>最后登录</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in filteredUsers"
                :key="u.id"
                :class="{ selected: selectedUser?.id === u.id }"
                @click="selectUser(u)"
              >
                <td><strong>{{ u.account }}</strong><small>{{ u.email }}</small></td>
                <td>{{ u.name }}</td>
                <td>{{ u.department }}</td>
                <td>{{ u.role }}</td>
                <td><StatusBadge :label="u.status" /></td>
                <td>{{ u.lastLogin }}</td>
                <td>
                  <button type="button" class="mini" @click.stop="selectUser(u)">编辑</button>
                  <button
                    v-if="u.status === '启用'"
                    type="button"
                    class="mini danger"
                    @click.stop="askDisable(u)"
                  >禁用</button>
                  <button
                    v-else
                    type="button"
                    class="mini ok"
                    @click.stop="askEnable(u)"
                  >启用</button>
                </td>
              </tr>
            </tbody>
          </table>
        </article>

        <!-- 用户表单 -->
        <aside class="panel user-form-panel">
          <div class="panel-title">
            <h2>{{ formMode === 'create' ? '新增用户' : '编辑用户' }}</h2>
            <span v-if="selectedUser">{{ selectedUser.id }}</span>
          </div>
          <form class="user-form" @submit.prevent="saveUser">
            <label>
              <span>账号 <em>*</em></span>
              <input v-model="form.account" placeholder="登录账号" :disabled="formMode === 'edit'" />
            </label>
            <label>
              <span>姓名 <em>*</em></span>
              <input v-model="form.name" placeholder="真实姓名" />
            </label>
            <label>
              <span>部门 <em>*</em></span>
              <input v-model="form.department" placeholder="所属部门" />
            </label>
            <label>
              <span>邮箱</span>
              <input v-model="form.email" placeholder="name@hg.com" />
            </label>
            <label>
              <span>角色 <em>*</em></span>
              <select v-model="form.role">
                <option value="">请选择角色</option>
                <option v-for="r in roleOptions" :key="r" :value="r">{{ r }}</option>
              </select>
            </label>
            <label>
              <span>状态</span>
              <select v-model="form.status">
                <option value="启用">启用</option>
                <option value="禁用">禁用</option>
              </select>
            </label>
            <div class="form-actions">
              <button type="button" @click="resetForm">重置</button>
              <button type="submit" class="primary">{{ formMode === 'create' ? '创建' : '保存' }}</button>
            </div>
            <p v-if="formTip" class="form-tip">{{ formTip }}</p>
          </form>
        </aside>
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
import { computed, onMounted, reactive, ref } from 'vue'
import StatusBadge from '@/components/StatusBadge.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { fetchUsers, fetchRoles, submitAction } from '@/mock/api.js'

const users = ref([])
const roles = ref([])
const uiState = ref('loading')
const errorMsg = ref('')

const keyword = ref('')
const statusFilter = ref('')
const roleFilter = ref('')

const selectedUser = ref(null)
const formMode = ref('create')
const form = reactive({
  id: '',
  account: '',
  name: '',
  department: '',
  email: '',
  role: '',
  status: '启用',
})
const formTip = ref('')

const confirmOpen = ref(false)
const confirmTitle = ref('')
const confirmMessage = ref('')
const pendingAction = ref(null)

const roleOptions = computed(() => roles.value.map(r => r.roleName))

const filteredUsers = computed(() =>
  users.value.filter(u => {
    const kw = keyword.value.trim()
    const kwHit = !kw || `${u.account}${u.name}${u.department}${u.email}`.includes(kw)
    const stHit = !statusFilter.value || u.status === statusFilter.value
    const rlHit = !roleFilter.value || u.role === roleFilter.value
    return kwHit && stHit && rlHit
  }),
)

const enabledCount = computed(() => users.value.filter(u => u.status === '启用').length)
const disabledCount = computed(() => users.value.filter(u => u.status === '禁用').length)

onMounted(reload)

async function reload() {
  uiState.value = 'loading'
  errorMsg.value = ''
  try {
    const [u, r] = await Promise.all([fetchUsers(), fetchRoles()])
    users.value = u
    roles.value = r
    selectedUser.value = u[0] || null
    if (selectedUser.value) fillForm(selectedUser.value)
    uiState.value = u.length ? 'success' : 'empty'
  } catch (e) {
    errorMsg.value = e?.message || '加载失败'
    uiState.value = 'error'
  }
}

function selectUser(u) {
  selectedUser.value = u
  formMode.value = 'edit'
  fillForm(u)
}

function fillForm(u) {
  form.id = u.id
  form.account = u.account
  form.name = u.name
  form.department = u.department
  form.email = u.email
  form.role = u.role
  form.status = u.status
  formTip.value = ''
}

function openCreate() {
  formMode.value = 'create'
  selectedUser.value = null
  form.id = ''
  form.account = ''
  form.name = ''
  form.department = ''
  form.email = ''
  form.role = ''
  form.status = '启用'
  formTip.value = ''
}

function resetForm() {
  if (formMode.value === 'edit' && selectedUser.value) {
    fillForm(selectedUser.value)
  } else {
    openCreate()
  }
}

async function saveUser() {
  if (!form.account || !form.name || !form.department || !form.role) {
    formTip.value = '请填写必填项（账号、姓名、部门、角色）'
    return
  }
  formTip.value = '提交中…'
  try {
    await submitAction(formMode.value === 'create' ? 'createUser' : 'updateUser', { ...form })
    if (formMode.value === 'create') {
      const newUser = {
        id: `U${String(users.value.length + 100).padStart(3, '0')}`,
        account: form.account,
        name: form.name,
        department: form.department,
        email: form.email,
        role: form.role,
        status: form.status,
        lastLogin: '—',
      }
      users.value = [newUser, ...users.value]
      selectedUser.value = newUser
      formMode.value = 'edit'
    } else if (selectedUser.value) {
      Object.assign(selectedUser.value, {
        name: form.name,
        department: form.department,
        email: form.email,
        role: form.role,
        status: form.status,
      })
    }
    formTip.value = '保存成功'
  } catch (e) {
    formTip.value = '保存失败：' + (e?.message || '未知错误')
  }
}

function askDisable(u) {
  pendingAction.value = { type: 'disable', user: u }
  confirmTitle.value = '禁用用户'
  confirmMessage.value = `将禁用账号「${u.account}（${u.name}）」，禁用后该用户无法登录系统。`
  confirmOpen.value = true
}

function askEnable(u) {
  pendingAction.value = { type: 'enable', user: u }
  confirmTitle.value = '启用用户'
  confirmMessage.value = `将启用账号「${u.account}（${u.name}）」，启用后该用户可正常登录。`
  confirmOpen.value = true
}

async function confirmAction() {
  const action = pendingAction.value
  if (!action) return
  try {
    await submitAction(action.type, { id: action.user.id })
    action.user.status = action.type === 'disable' ? '禁用' : '启用'
    if (selectedUser.value?.id === action.user.id) form.status = action.user.status
    confirmOpen.value = false
  } catch (e) {
    confirmMessage.value = '操作失败：' + (e?.message || '未知错误')
  }
}

function importUsers() {
  pendingAction.value = { type: 'import' }
  confirmTitle.value = '批量导入用户'
  confirmMessage.value = '将通过模板文件批量导入用户，导入前请下载标准模板并按格式填写。'
  confirmOpen.value = true
}

function exportUsers() {
  pendingAction.value = { type: 'export' }
  confirmTitle.value = '导出用户列表'
  confirmMessage.value = `将导出当前 ${users.value.length} 个用户数据（含账号、姓名、部门、角色、状态、最后登录）为 Excel 文件。`
  confirmOpen.value = true
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
button.mini { padding: 5px 10px; font-size: 12px; }
button.mini.danger { color: #b4232d; border-color: #f3c2c6; background: #fff0f1; }
button.mini.ok { color: #11734d; border-color: #bfe6cf; background: #e8f8ef; }

.state-panel { min-height: 260px; border: 1px solid #d9e4ef; border-radius: 8px; display: grid; place-content: center; justify-items: center; gap: 12px; text-align: center; background: #fff; }
.state-panel h2 { margin: 0; font-size: 20px; }
.state-panel.error h2 { color: #b4232d; }
.skeleton { grid-template-columns: repeat(2, minmax(180px, 1fr)); padding: 24px; }
.skeleton span { width: 100%; height: 96px; border-radius: 8px; background: linear-gradient(90deg, #eef3f8, #f8fbfe, #eef3f8); }
.skeleton .wide { grid-column: 1 / -1; height: 60px; }

.kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
.kpi-card { border: 1px solid #d9e4ef; border-radius: 8px; padding: 15px; background: #fff; }
.kpi-card strong { display: block; color: #1e6fd9; font-size: 28px; }
.kpi-card span { color: #64748b; font-size: 12px; font-weight: 800; }
.kpi-card.ok strong { color: #11734d; }
.kpi-card.warn strong { color: #b4232d; }
.kpi-card.active strong { color: #1e6fd9; }

.user-layout { display: grid; grid-template-columns: minmax(0, 1fr) 380px; gap: 16px; align-items: start; }
.panel { border: 1px solid #d9e4ef; border-radius: 8px; padding: 16px; background: #fff; }
.panel-title { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 12px; }
.panel-title h2 { margin: 0; font-size: 16px; }
.panel-title span { color: #64748b; font-size: 12px; font-weight: 800; }

.filter-row { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 10px; margin-bottom: 12px; }
.filter-row input, .filter-row select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 8px 10px; color: #172033; background: #fff; }

table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { padding: 11px 10px; border-bottom: 1px solid #e7edf4; text-align: left; vertical-align: middle; }
th { color: #63748a; background: #f7fafc; }
td small { display: block; color: #8b9aab; margin-top: 3px; font-size: 11px; }
tr { cursor: pointer; }
tr.selected td { background: #edf5ff; }
td .mini + .mini { margin-left: 4px; }

.user-form-panel { position: sticky; top: 0; }
.user-form { display: grid; gap: 14px; }
.user-form label { display: grid; gap: 6px; color: #53657c; font-size: 12px; font-weight: 900; }
.user-form em { color: #b4232d; font-style: normal; }
.user-form input, .user-form select { min-height: 38px; border: 1px solid #cbd7e4; border-radius: 7px; padding: 9px 10px; color: #172033; background: #fff; }
.user-form input:disabled { background: #f3f6fa; color: #8b9aab; }
.form-actions { display: flex; gap: 10px; justify-content: flex-end; }
.form-tip { margin: 0; font-size: 12px; color: #1e6fd9; font-weight: 800; }

@media (max-width: 980px) {
  .page-header { flex-direction: column; }
  .kpi-grid { grid-template-columns: 1fr 1fr; }
  .user-layout { grid-template-columns: 1fr; }
  .user-form-panel { position: static; }
  .filter-row { grid-template-columns: 1fr; }
  table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>
