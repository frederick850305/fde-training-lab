<template>
  <div class="vehicle-archive-list">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <el-button type="primary" @click="handleAdd">新增车辆</el-button>
      <el-button @click="handleExport">导出</el-button>
      <el-button v-if="showBatchActions" @click="handleBatchStop">批量停用</el-button>
      <el-button v-if="showBatchActions" @click="handleBatchEnable">批量启用</el-button>
    </div>

    <!-- 到期提醒横幅 -->
    <div v-if="expiringList.length > 0" class="expiring-banner">
      <el-alert
        :title="`有 ${expiringList.length} 项即将到期`"
        type="warning"
        show-icon
        :closable="false"
      >
        <template #default>
          <div class="expiring-items">
            <span
              v-for="item in expiringList"
              :key="item.id"
              class="expiring-item"
              @click="goToEdit(item.id)"
            >
              {{ item.plateNumber }} - {{ item.expireType }} 剩余{{ item.remainingDays }}天
            </span>
          </div>
        </template>
      </el-alert>
    </div>

    <!-- 筛选区 -->
    <div class="filter-area">
      <DataFilterBar
        :filters="filterConfig"
        v-model="filterValues"
        :show-search-button="false"
        :auto-search-delay="300"
        @update:model-value="handleFilterChange"
      />
    </div>

    <!-- 数据表格 -->
    <div class="table-area">
      <DataTable
        :columns="tableColumns"
        :data="vehicleList"
        :loading="loading"
        :empty-text="emptyText"
        :pagination="pagination"
        @page-change="handlePageChange"
        row-key="id"
      >
        <template #status="{ row }">
          <StatusTag :status="row.status" :text="row.statusText" />
        </template>
        <template #actions="{ row }">
          <el-button type="text" size="small" @click="handleEdit(row)">编辑</el-button>
          <el-button
            type="text"
            size="small"
            :class="{ 'text-green-500': row.status === 'disabled', 'text-red-500': row.status !== 'disabled' }"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'disabled' ? '启用' : '停用' }}
          </el-button>
        </template>
      </DataTable>
    </div>

    <!-- 停用/启用确认弹窗（使用ConfirmDialog） -->
    <ConfirmDialog
      v-if="confirmDialog.visible"
      v-model:visible="confirmDialog.visible"
      :title="confirmDialog.title"
      :content="confirmDialog.content"
      :loading="confirmDialog.submitting"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- 空态 -->
    <div v-if="!loading && vehicleList.length === 0" class="empty-state">
      <el-empty description="暂无车辆，请点击新增">
        <el-button type="primary" @click="handleAdd">新增车辆</el-button>
      </el-empty>
    </div>

    <!-- 错误态 -->
    <div v-if="error" class="error-state">
      <el-result icon="error" title="加载失败" sub-title="请检查网络后重试">
        <template #extra>
          <el-button type="primary" @click="loadData">重试</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import DataFilterBar from '@/components/DataFilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import StatusTag from '@/components/StatusTag.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'
// 导入mock数据（原型用）
import { getVehicleList, toggleVehicleStatus } from '@/data/mockVehicles'

const router = useRouter()

// 筛选配置
const filterConfig = [
  { type: 'select', label: '车辆类型', key: 'vehicleType', options: ['轿车', '货车', '客车', '特种车'] },
  { type: 'select', label: '所属单位', key: 'department', options: ['一分公司', '二分公司', '三分公司'] },
  { type: 'select', label: '车辆状态', key: 'status', options: ['正常', '停用', '维修', '报废'] },
  { type: 'select', label: '有效期状态', key: 'expireStatus', options: ['正常', '即将到期', '已过期'] },
  { type: 'input', label: '车牌号/司机姓名', key: 'keyword', placeholder: '请输入车牌号或司机姓名' }
]

const filterValues = ref({})

// 表格列定义
const tableColumns = [
  { key: 'plateNumber', title: '车牌号', width: 120 },
  { key: 'vehicleType', title: '车辆类型', width: 100 },
  { key: 'department', title: '所属单位', width: 120 },
  { key: 'driver', title: '司机', width: 100 },
  { key: 'expireStatus', title: '有效期状态', width: 120 },
  { key: 'status', title: '车辆状态', width: 100, slot: 'status' },
  { key: 'actions', title: '操作', width: 180, slot: 'actions' }
]

// 数据状态
const loading = ref(false)
const error = ref(false)
const vehicleList = ref([])
const pagination = reactive({
  current: 1,
  pageSize: 20,
  total: 0
})

// 到期提醒列表
const expiringList = ref([])

// 弹窗状态
const confirmDialog = reactive({
  visible: false,
  title: '',
  content: '',
  submitting: false,
  // 弹窗类型: 'stop' | 'enable'
  actionType: '',
  // 选中的车辆ID列表（批量）
  selectedIds: [],
  // 停用原因
  reason: ''
})

// 计算空态文本
const emptyText = computed(() => loading.value ? '' : '暂无车辆数据')

// 是否显示批量操作按钮（原型简化，可固定为true）
const showBatchActions = ref(true)

// 页面加载
onMounted(() => {
  loadData()
  loadExpiringList()
})

// 加载车辆列表
async function loadData() {
  loading.value = true
  error.value = false
  try {
    const params = {
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filterValues.value
    }
    const res = await getVehicleList(params) // mock
    vehicleList.value = res.list
    pagination.total = res.total
  } catch (e) {
    error.value = true
    vehicleList.value = []
  } finally {
    loading.value = false
  }
}

// 加载到期提醒
function loadExpiringList() {
  // 原型中直接从mock获取
  import('@/data/mockVehicles').then(m => {
    expiringList.value = m.getExpiringVehicles()
  }).catch(() => {
    expiringList.value = [
      { id: 1, plateNumber: '京A12345', expireType: '年检', remainingDays: 15 },
      { id: 2, plateNumber: '京B67890', expireType: '保险', remainingDays: 8 }
    ]
  })
}

// 筛选变化
let filterTimer = null
function handleFilterChange() {
  clearTimeout(filterTimer)
  filterTimer = setTimeout(() => {
    pagination.current = 1
    loadData()
  }, 300)
}

// 分页变化
function handlePageChange(page) {
  pagination.current = page
  loadData()
}

// 新增车辆
function handleAdd() {
  router.push('/vehicles/add')
}

// 导出
function handleExport() {
  // 原型中简单提示
  alert('导出功能（原型演示）')
}

// 批量停用
function handleBatchStop() {
  confirmDialog.title = '批量停用'
  confirmDialog.content = '请选择要停用的车辆（原型中暂未实现选择）'
  confirmDialog.actionType = 'batchStop'
  confirmDialog.visible = true
}

// 批量启用
function handleBatchEnable() {
  confirmDialog.title = '批量启用'
  confirmDialog.content = '确认批量启用所有已停用车辆？'
  confirmDialog.actionType = 'batchEnable'
  confirmDialog.visible = true
}

// 行内编辑
function handleEdit(row) {
  router.push(`/vehicles/edit/${row.id}`)
}

// 行内停用/启用切换
function handleToggleStatus(row) {
  const isDisabled = row.status === 'disabled'
  confirmDialog.title = isDisabled ? '启用车辆' : '停用车辆'
  if (isDisabled) {
    confirmDialog.content = `确认启用车辆 ${row.plateNumber}？`
    confirmDialog.actionType = 'enableSingle'
  } else {
    confirmDialog.content = `确认停用车辆 ${row.plateNumber}？请填写停用原因（必填）。`
    confirmDialog.actionType = 'stopSingle'
  }
  confirmDialog.selectedIds = [row.id]
  confirmDialog.visible = true
}

// 弹窗确认
async function handleConfirm() {
  confirmDialog.submitting = true
  try {
    if (confirmDialog.actionType === 'stopSingle') {
      await toggleVehicleStatus(confirmDialog.selectedIds[0], 'disabled', '原型演示停用')
    } else if (confirmDialog.actionType === 'enableSingle') {
      await toggleVehicleStatus(confirmDialog.selectedIds[0], 'enabled')
    } else if (confirmDialog.actionType === 'batchStop') {
      // 批量停用（原型简化）
      await toggleVehicleStatus('batch', 'disabled', '批量停用')
    } else if (confirmDialog.actionType === 'batchEnable') {
      await toggleVehicleStatus('batch', 'enabled')
    }
    // 刷新列表
    loadData()
    loadExpiringList()
    confirmDialog.visible = false
  } catch (e) {
    // 错误处理
    alert('操作失败')
  } finally {
    confirmDialog.submitting = false
  }
}

// 弹窗取消
function handleCancel() {
  confirmDialog.visible = false
}

// 跳转编辑页并定位到有效期
function goToEdit(id) {
  router.push(`/vehicles/edit/${id}?focus=expire`)
}
</script>

<style scoped>
.vehicle-archive-list {
  padding: 20px;
}

.top-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}

.expiring-banner {
  margin-bottom: 16px;
}

.expiring-items {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.expiring-item {
  cursor: pointer;
  color: #e6a23c;
  text-decoration: underline;
  font-size: 13px;
}

.filter-area {
  margin-bottom: 16px;
}

.table-area {
  margin-bottom: 16px;
}

.empty-state,
.error-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 0;
}

.text-green-500 {
  color: #67c23a;
}

.text-red-500 {
  color: #f56c6c;
}
</style>
