<template>
  <div class="vehicle-archive-list">
    <header class="page-header">
      <h2>车辆档案列表</h2>
      <span class="role-badge">当前角色：{{ currentRoleLabel }}</span>
    </header>

    <!-- 操作栏 -->
    <div class="action-bar">
      <button class="btn btn-primary" @click="handleAdd">新增车辆</button>
      <button class="btn btn-default" @click="handleExport">导出</button>
      <button class="btn btn-default" @click="handleBatchToggle(true)" :disabled="!selectedIds.length">批量停用</button>
      <button class="btn btn-default" @click="handleBatchToggle(false)" :disabled="!selectedIds.length">批量启用</button>
    </div>

    <!-- 筛选区 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filters"
      :show-search-button="false"
      :auto-search-delay="300"
      @update:modelValue="onFilterChange"
    />

    <!-- 到期提醒横幅 -->
    <div v-if="expiringVehicles.length > 0" class="expiring-banner">
      <span class="expiring-icon">⏰</span>
      <span class="expiring-text">以下车辆将在30天内到期，请及时处理：</span>
      <div class="expiring-list">
        <span
          v-for="v in expiringVehicles"
          :key="v.vehicleId"
          class="expiring-item"
          @click="goToEdit(v.vehicleId)"
        >
          {{ v.plateNumber }} ({{ v.expiryType }}剩余{{ v.remainingDays }}天)
        </span>
      </div>
    </div>

    <!-- 主体区域：列表 + 状态 -->
    <div class="list-wrapper">
      <!-- 空状态 -->
      <div v-if="uiState === 'empty'" class="state-empty">
        <img src="../assets/empty.svg" alt="空态" />
        <p>暂无车辆，请点击新增</p>
        <button class="btn btn-primary" @click="handleAdd">新增车辆</button>
      </div>

      <!-- 加载中 -->
      <div v-else-if="uiState === 'loading'" class="state-loading">
        <div class="skeleton-row" v-for="i in 5" :key="i"></div>
      </div>

      <!-- 错误状态 -->
      <div v-else-if="uiState === 'error'" class="state-error">
        <p>数据加载失败，请重试</p>
        <button class="btn btn-default" @click="loadData">重试</button>
      </div>

      <!-- 正常列表 -->
      <DataTable
        v-else
        ref="tableRef"
        :columns="tableColumns"
        :data="vehicleList"
        :loading="uiState === 'loading'"
        :pagination="paginationConfig"
        :row-key="'vehicleId'"
        @selection-change="onSelectionChange"
        @page-change="onPageChange"
      >
        <template #body-cell="{ column, row }">
          <template v-if="column.key === 'status'">
            <StatusTag :status="row.status" :text="row.status === 'active' ? '启用' : '停用'" size="small" />
          </template>
          <template v-else-if="column.key === 'expiryStatus'">
            <StatusTag
              :status="row.expiryStatus === 'normal' ? 'success' : 'warning'"
              :text="row.expiryStatus === 'normal' ? '正常' : '到期预警'"
              size="small"
            />
          </template>
          <template v-else-if="column.key === 'actions'">
            <button class="btn btn-link" @click="goToEdit(row.vehicleId)">编辑</button>
            <button
              class="btn btn-link"
              :class="{ 'text-danger': row.status === 'active' }"
              @click="handleToggle(row)"
            >
              {{ row.status === 'active' ? '停用' : '启用' }}
            </button>
          </template>
        </template>
      </DataTable>
    </div>

    <!-- 停用/启用确认弹窗 -->
    <ConfirmDialog
      v-model:visible="confirmDialog.visible"
      :title="confirmDialog.title"
      :content="confirmDialog.content"
      :confirm-text="confirmDialog.confirmText"
      @confirm="onConfirmToggle"
    />

    <!-- 批量操作确认弹窗 -->
    <ConfirmDialog
      v-model:visible="batchConfirmDialog.visible"
      :title="batchConfirmDialog.title"
      :content="batchConfirmDialog.content"
      :confirm-text="'确定'"
      @confirm="onBatchConfirm"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, defineComponent } from 'vue'
// 从 prototypeContract 导入（实际运行时通过原型框架注入）
import prototypeContract from '../prototypeContract.js'
// 必须使用 pageContract.mocks 指定的 mock 入口
import { fetchVehiclesData } from '../data/mockVehicles.js'

// 组件引入
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

// 注入角色上下文
const prototypeContext = inject('prototypeContext', { currentRole: 'admin', currentRoleKey: 'admin' })
const currentRoleKey = computed(() => prototypeContext.currentRoleKey)
const currentRoleLabel = computed(() => {
  const role = prototypeContract.roles.find(r => r.key === currentRoleKey.value)
  return role ? role.label : '未知'
})

// 页面状态
const uiState = ref('loading') // 'loading' | 'success' | 'error' | 'empty'
const vehicleList = ref([])
const selectedIds = ref([])
const tableRef = ref(null)

// 筛选条件
const filters = reactive({
  vehicleType: '',
  department: '',
  status: '',
  expiryStatus: '',
  keyword: ''
})

// 根据角色设置默认筛选
if (currentRoleKey.value === 'manager') {
  filters.department = '默认部门' // 模拟管理层默认只看本单位
}

const filterConfig = [
  { type: 'select', label: '车辆类型', key: 'vehicleType', options: ['轿车', '卡车', '客车', '货车'] },
  { type: 'select', label: '所属单位', key: 'department', options: ['一车间', '二车间', '后勤部', '外协单位'] },
  { type: 'select', label: '车辆状态', key: 'status', options: [{ value: 'active', label: '启用' }, { value: 'inactive', label: '停用' }] },
  { type: 'select', label: '有效期状态', key: 'expiryStatus', options: [{ value: 'normal', label: '正常' }, { value: 'expiring', label: '临近到期' }] },
  { type: 'input', label: '车牌号/司机姓名', key: 'keyword', placeholder: '输入搜索' }
]

// 表格列定义
const tableColumns = [
  { key: 'plateNumber', title: '车牌号', sortable: true },
  { key: 'vehicleType', title: '车辆类型' },
  { key: 'department', title: '所属单位' },
  { key: 'driverName', title: '司机' },
  { key: 'expiryStatus', title: '有效期状态' },
  { key: 'status', title: '车辆状态' },
  { key: 'actions', title: '操作', width: 150 }
]

// 分页配置
const paginationConfig = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

// 到期提醒数据
const expiringVehicles = ref([])

// 确认弹窗数据
const confirmDialog = reactive({
  visible: false,
  title: '',
  content: '',
  confirmText: '确定',
  resolve: null
})

const batchConfirmDialog = reactive({
  visible: false,
  title: '',
  content: '',
  actionType: null // 'enable' or 'disable'
})

// 加载数据
async function loadData() {
  uiState.value = 'loading'
  try {
    const params = {
      type: filters.vehicleType || undefined,
      department: filters.department || undefined,
      status: filters.status || undefined,
      expiryStatus: filters.expiryStatus || undefined,
      keyword: filters.keyword || undefined,
      page: paginationConfig.current,
      pageSize: paginationConfig.pageSize
    }
    // 调用 mock 读取函数
    const result = await fetchVehiclesData(params)
    // 适配数据格式
    const rawList = result.records || result.data || result || []
    // 模拟分页总量
    paginationConfig.total = rawList.length || 30
    // 对每辆车做 normalize 映射，确保字段存在
    vehicleList.value = rawList.slice(0, paginationConfig.pageSize).map(normalizeVehicle)
    // 计算到期提醒：剩余天数 <=30 且状态为启用
    expiringVehicles.value = rawList
      .filter(v => v.expiryDaysLeft !== undefined && v.expiryDaysLeft <= 30 && v.status === 'active')
      .slice(0, 5)
      .map(v => ({
        vehicleId: v.vehicleId,
        plateNumber: v.plateNumber,
        expiryType: v.expiryDaysLeft === v.annualInspectionDays ? '年检' : '保险',
        remainingDays: v.expiryDaysLeft
      }))

    uiState.value = vehicleList.value.length === 0 ? 'empty' : 'success'
  } catch (err) {
    console.error('加载车辆数据失败:', err)
    uiState.value = 'error'
  }
}

// 数据字段标准化
function normalizeVehicle(item) {
  return {
    vehicleId: item.vehicleId || item.id || '',
    plateNumber: item.plateNumber || '未知',
    vehicleType: item.vehicleType || '未知',
    department: item.department || '未知',
    driverName: item.driverName || item.driver || '未知',
    expiryStatus: item.expiryStatus || 'normal',
    status: item.status || 'active',
    annualInspectionExpiry: item.annualInspectionExpiry || '',
    insuranceExpiry: item.insuranceExpiry || ''
  }
}

// 筛选变化
function onFilterChange() {
  paginationConfig.current = 1
  loadData()
}

// 分页变化
function onPageChange(page) {
  paginationConfig.current = page
  loadData()
}

// 选择变化
function onSelectionChange(selection) {
  selectedIds.value = selection.map(item => item.vehicleId)
}

// 新增车辆
function handleAdd() {
  // 原型演示直接跳转编辑页（通过路由，但此处不引入路由库，使用 window.location 模拟）
  window.location.href = '#/management/vehicle-archive/edit'
}

// 导出
function handleExport() {
  alert('导出功能：将当前列表导出为 Excel 文件（原型演示）')
}

// 行内停用/启用
function handleToggle(row) {
  const action = row.status === 'active' ? '停用' : '启用'
  confirmDialog.title = `${action}车辆`
  confirmDialog.content = action === '停用'
    ? `确定要停用车牌号为 ${row.plateNumber} 的车辆吗？请填写停用原因。`
    : `确定要启用 ${row.plateNumber} 吗？`
  confirmDialog.confirmText = '确定'
  confirmDialog.resolve = () => {
    // 调用 POST /api/vehicles 更新状态
    updateVehicleStatus(row.vehicleId, action === '停用' ? 'inactive' : 'active')
  }
  confirmDialog.visible = true
}

function onConfirmToggle() {
  if (confirmDialog.resolve) {
    confirmDialog.resolve()
  }
  confirmDialog.visible = false
}

// 批量操作
function handleBatchToggle(enable) {
  const action = enable ? '启用' : '停用'
  batchConfirmDialog.title = `批量${action}`
  batchConfirmDialog.content = `确定要批量${action}选中的 ${selectedIds.value.length} 辆车吗？`
  batchConfirmDialog.actionType = enable ? 'enable' : 'disable'
  batchConfirmDialog.visible = true
}

function onBatchConfirm() {
  const newStatus = batchConfirmDialog.actionType === 'enable' ? 'active' : 'inactive'
  // 逐个更新（原型模拟）
  selectedIds.value.forEach(id => updateVehicleStatus(id, newStatus))
  batchConfirmDialog.visible = false
}

// 模拟更新车辆状态（调用 API）
async function updateVehicleStatus(vehicleId, newStatus) {
  try {
    // 实际使用 POST /api/vehicles，此处模拟成功
    console.log(`更新车辆 ${vehicleId} 状态为 ${newStatus}`)
    // 刷新列表
    await loadData()
  } catch (e) {
    console.error('状态更新失败')
  }
}

// 跳转到编辑页
function goToEdit(vehicleId) {
  window.location.href = `#/management/vehicle-archive/edit?id=${vehicleId}`
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.vehicle-archive-list {
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 22px;
}

.role-badge {
  background: #e8e8e8;
  border-radius: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: #333;
}

.action-bar {
  margin-bottom: 12px;
}

.action-bar .btn {
  margin-right: 8px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 16px;
  font-size: 14px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.btn-default {
  background: white;
  color: #333;
}

.btn-link {
  border: none;
  background: none;
  color: #1890ff;
  padding: 0 4px;
  cursor: pointer;
}

.btn-link.text-danger {
  color: #ff4d4f;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.expiring-banner {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  padding: 10px 16px;
  margin-bottom: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.expiring-icon {
  margin-right: 8px;
  font-size: 18px;
}

.expiring-text {
  font-weight: 500;
  margin-right: 12px;
}

.expiring-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.expiring-item {
  cursor: pointer;
  color: #d48806;
  text-decoration: underline;
  font-size: 13px;
}

.list-wrapper {
  min-height: 300px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 16px;
}

.state-empty,
.state-loading,
.state-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: #999;
}

.state-empty img {
  width: 120px;
  margin-bottom: 12px;
}

.state-loading .skeleton-row {
  height: 20px;
  background: linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%);
  background-size: 200% 100%;
  animation: loading-shimmer 1.5s infinite;
  margin-bottom: 12px;
  border-radius: 4px;
}

@keyframes loading-shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.state-error p {
  margin-bottom: 12px;
}
</style>