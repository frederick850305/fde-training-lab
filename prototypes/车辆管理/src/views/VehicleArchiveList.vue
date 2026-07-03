<template>
  <div class="vehicle-archive-list">
    <!-- 顶部操作栏 -->
    <div class="top-actions">
      <el-button type="primary" @click="handleAdd">新增车辆</el-button>
      <el-button @click="handleExport">导出</el-button>
      <el-button v-if="currentRoleKey === 'admin'" @click="handleBatchToggle">批量停用/启用</el-button>
    </div>

    <!-- 筛选区 -->
    <DataFilterBar
      :filters="filterConfig"
      v-model="filterValues"
      :showSearchButton="false"
      :autoSearchDelay="300"
      @update:modelValue="fetchVehicles"
    />

    <!-- 状态展示 -->
    <div v-if="uiState === 'loading'" class="state-loading">
      <el-skeleton :rows="5" animated />
    </div>
    <div v-else-if="uiState === 'error'" class="state-error">
      <p>网络异常或接口错误，请重试</p>
      <el-button @click="fetchVehicles">重试</el-button>
    </div>
    <div v-else-if="uiState === 'empty'" class="state-empty">
      <img src="" alt="暂无车辆" />
      <p>暂无车辆，请点击新增</p>
      <el-button type="primary" @click="handleAdd">新增车辆</el-button>
    </div>

    <!-- 到期提醒横幅 -->
    <div v-if="expiringVehicles.length > 0 && uiState === 'success'" class="expiring-banner">
      <span class="banner-title">到期提醒（30天内）</span>
      <div class="expiring-list">
        <div
          v-for="item in expiringVehicles"
          :key="item.vehicleId"
          class="expiring-item"
          @click="goToEdit(item.vehicleId)"
        >
          <span>{{ item.plateNumber }}</span>
          <span>{{ item.expireType === 'inspection' ? '年检' : '保险' }}到期</span>
          <span>剩余{{ item.remainingDays }}天</span>
        </div>
      </div>
    </div>

    <!-- 车辆列表主体 -->
    <div v-if="uiState === 'success'" class="vehicle-table">
      <DataTable
        :columns="tableColumns"
        :data="tableData"
        :loading="uiState === 'loading'"
        :emptyText="'暂无车辆'"
        :pagination="pagination"
        rowKey="vehicleId"
      >
        <template #customStatus="{ row }">
          <StatusTag :status="row.status" :text="row.status === 'active' ? '正常' : '停用'" />
        </template>
        <template #customActions="{ row }">
          <el-button size="small" @click="goToEdit(row.vehicleId)">编辑</el-button>
          <el-button
            size="small"
            :type="row.status === 'active' ? 'warning' : 'success'"
            @click="handleToggleStatus(row)"
          >
            {{ row.status === 'active' ? '停用' : '启用' }}
          </el-button>
        </template>
      </DataTable>

      <el-pagination
        v-if="pagination.total > pagination.pageSize"
        v-model:currentPage="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        @current-change="fetchVehicles"
        background
        layout="prev, pager, next"
      />
    </div>

    <!-- 停用/启用确认弹窗 -->
    <ConfirmDialog
      :visible="confirmVisible"
      :title="confirmTitle"
      :content="confirmContent"
      confirmText="确定"
      cancelText="取消"
      :loading="confirmLoading"
      @confirm="handleConfirm"
      @cancel="confirmVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from 'vue'
import prototypeContract from '../prototypeContract.js'
import { fetchVehiclesData } from '../data/mockVehicles.js'
import DataFilterBar from '../components/DataFilterBar.vue'
import DataTable from '../components/DataTable.vue'
import StatusTag from '../components/StatusTag.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const prototypeContext = inject('prototypeContext')
const currentRoleKey = computed(() => prototypeContext?.currentRoleKey || 'admin')

// 页面状态
const uiState = ref('loading')
const tableData = ref([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

// 筛选配置
const filterConfig = ref([
  { type: 'select', label: '车辆类型', key: 'vehicleType', placeholder: '全部', options: [] },
  { type: 'select', label: '所属单位', key: 'department', placeholder: '全部', options: [] },
  { type: 'select', label: '车辆状态', key: 'status', placeholder: '全部', options: [{ label: '正常', value: 'active' }, { label: '停用', value: 'inactive' }] },
  { type: 'select', label: '有效期状态', key: 'validityStatus', placeholder: '全部', options: [{ label: '正常', value: 'valid' }, { label: '即将到期', value: 'expiring' }, { label: '已过期', value: 'expired' }] },
  { type: 'input', label: '车牌号/司机姓名', key: 'keyword', placeholder: '请输入车牌号或司机姓名' }
])
const filterValues = ref({})

// 表格列定义
const tableColumns = ref([
  { key: 'plateNumber', title: '车牌号', width: 120 },
  { key: 'vehicleType', title: '车辆类型', width: 100 },
  { key: 'department', title: '所属单位', width: 150 },
  { key: 'driverName', title: '司机', width: 80 },
  { key: 'validityStatus', title: '有效期状态', width: 120, customRender: 'customStatus' },
  { key: 'status', title: '车辆状态', width: 80, customRender: 'customStatus' },
  { key: 'actions', title: '操作', width: 160, customRender: 'customActions' }
])

// 到期提醒数据
const expiringVehicles = ref([])

// 确认弹窗
const confirmVisible = ref(false)
const confirmTitle = ref('')
const confirmContent = ref('')
const confirmLoading = ref(false)
const pendingAction = ref(null) // { type: 'toggle', vehicle: ... }

onMounted(() => {
  fetchVehicles()
})

// 不同角色默认筛选差异
function setDefaultFilterByRole() {
  if (currentRoleKey.value === 'manager') {
    filterValues.value.status = 'active' // 管理层只看正常车辆
  } else if (currentRoleKey.value === 'admin') {
    // 管理员看全部
  }
}

// 获取车辆列表
async function fetchVehicles() {
  uiState.value = 'loading'
  try {
    const params = {
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      ...filterValues.value
    }
    const result = await fetchVehiclesData(params)
    const list = result.list || []
    tableData.value = list.map(normalizeVehicle)
    pagination.value.total = result.total || list.length

    // 计算到期提醒
    const now = new Date()
    const expiring = []
    list.forEach(v => {
      if (v.inspectionExpiry) {
        const days = Math.ceil((new Date(v.inspectionExpiry) - now) / (1000 * 60 * 60 * 24))
        if (days >= 0 && days <= 30) {
          expiring.push({ vehicleId: v.vehicleId, plateNumber: v.plateNumber, expireType: 'inspection', remainingDays: days })
        }
      }
      if (v.insuranceExpiry) {
        const days = Math.ceil((new Date(v.insuranceExpiry) - now) / (1000 * 60 * 60 * 24))
        if (days >= 0 && days <= 30) {
          expiring.push({ vehicleId: v.vehicleId, plateNumber: v.plateNumber, expireType: 'insurance', remainingDays: days })
        }
      }
    })
    expiringVehicles.value = expiring

    uiState.value = tableData.value.length === 0 ? 'empty' : 'success'
  } catch (e) {
    uiState.value = 'error'
  }
}

// 标准化车辆数据
function normalizeVehicle(item) {
  return {
    vehicleId: item.vehicleId,
    plateNumber: item.plateNumber,
    vehicleType: item.vehicleType,
    department: item.department,
    driverName: item.driverName || item.driver?.name,
    driverPhone: item.driverPhone || item.driver?.phone,
    status: item.status || 'active',
    inspectionExpiry: item.inspectionExpiry,
    insuranceExpiry: item.insuranceExpiry,
    validityStatus: item.status === 'active' ? '正常' : '停用'
  }
}

// 新增车辆
function handleAdd() {
  window.location.href = '#/management/vehicle-archive/edit'
}

// 导出
function handleExport() {
  alert('导出功能，将导出当前筛选结果或全部列表为Excel')
}

// 批量停用/启用
function handleBatchToggle() {
  alert('批量停用/启用功能，弹出弹窗选择车辆')
}

// 跳转编辑页
function goToEdit(vehicleId) {
  window.location.href = '#/management/vehicle-archive/edit?id=' + vehicleId
}

// 单条停用/启用
function handleToggleStatus(vehicle) {
  const newStatus = vehicle.status === 'active' ? 'inactive' : 'active'
  confirmTitle.value = newStatus === 'inactive' ? '停用车辆' : '启用车辆'
  confirmContent.value = newStatus === 'inactive'
    ? `确定要停用车辆 ${vehicle.plateNumber} 吗？请填写停用原因。`
    : `确定要启用车辆 ${vehicle.plateNumber} 吗？`
  pendingAction.value = { type: 'toggle', vehicle, newStatus }
  confirmVisible.value = true
}

async function handleConfirm() {
  if (!pendingAction.value) return
  const { vehicle, newStatus } = pendingAction.value
  confirmLoading.value = true
  try {
    // 调用接口更新状态
    await fetchVehiclesData({ vehicleId: vehicle.vehicleId, status: newStatus })
    confirmVisible.value = false
    pendingAction.value = null
    fetchVehicles()
  } catch (e) {
    alert('操作失败，请重试')
  } finally {
    confirmLoading.value = false
  }
}

setDefaultFilterByRole()
</script>

<style scoped>
.vehicle-archive-list {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}
.top-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 16px;
}
.state-loading,
.state-error,
.state-empty {
  text-align: center;
  padding: 40px;
}
.expiring-banner {
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 16px;
}
.banner-title {
  font-weight: bold;
  font-size: 14px;
  color: #d48806;
  margin-bottom: 8px;
  display: block;
}
.expiring-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.expiring-item {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: center;
}
.expiring-item:hover {
  border-color: #1890ff;
}
.vehicle-table {
  margin-top: 16px;
}
</style>