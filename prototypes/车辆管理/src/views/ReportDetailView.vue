<template>
  <div class="report-detail-view">
    <!-- 面包屑导航及返回概览 -->
    <div class="breadcrumb-bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item @click="goBack">概览工作台</el-breadcrumb-item>
        <el-breadcrumb-item>明细详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button type="primary" size="small" @click="goBack">返回概览</el-button>
    </div>

    <!-- 筛选条件标签 -->
    <div class="filter-bar">
      <DataFilterBar
        :filters="filterConfig"
        v-model="filterValues"
        @search="onSearch"
      />
    </div>

    <!-- 明细类型标签页 -->
    <el-tabs v-model="activeTab" @tab-click="onTabChange">
      <el-tab-pane label="外协费用明细" name="externalCost"></el-tab-pane>
      <el-tab-pane label="异常入场记录" name="abnormalEntry"></el-tab-pane>
      <el-tab-pane label="排班排队分析" name="scheduleQueue"></el-tab-pane>
    </el-tabs>

    <!-- 表格区域 -->
    <div class="table-area">
      <div class="toolbar">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索..."
          clearable
          @keyup.enter="onSearch"
          style="width: 240px"
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-button type="primary" @click="exportData">导出当前明细</el-button>
      </div>

      <!-- 加载骨架屏 -->
      <template v-if="loading">
        <el-skeleton :rows="5" animated />
      </template>

      <!-- 空状态 -->
      <template v-else-if="empty">
        <el-empty description="暂无记录">
          <el-button type="primary" @click="clearFilters">清除筛选条件</el-button>
        </el-empty>
      </template>

      <!-- 错误状态 -->
      <template v-else-if="error">
        <el-result status="error" title="数据加载失败" sub-title="请稍后重试">
          <template #extra>
            <el-button type="primary" @click="retry">重试</el-button>
          </template>
        </el-result>
      </template>

      <!-- 正常数据表格 -->
      <template v-else>
        <DataTable
          :columns="tableColumns"
          :data="tableData"
          :loading="false"
          :pagination="pagination"
          @sort-change="onSortChange"
          @page-change="onPageChange"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import DataFilterBar from '@/components/DataFilterBar.vue'
import DataTable from '@/components/DataTable.vue'
import { getReportDetail } from '@/data/mockReportDetail'

const router = useRouter()

// 状态
const activeTab = ref('externalCost')
const searchKeyword = ref('')
const filterValues = ref({})
const loading = ref(false)
const error = ref(false)
const tableData = ref([])
const pagination = ref({ current: 1, pageSize: 10, total: 0 })

// 计算空状态
const empty = computed(() => !loading.value && !error.value && tableData.value.length === 0)

// 筛选配置
const filterConfig = [
  { type: 'dateRange', label: '日期范围', key: 'dateRange' },
  { type: 'select', label: '供应商', key: 'supplier', options: [] },
  { type: 'input', label: '车牌号', key: 'plateNumber', placeholder: '输入车牌号' }
]

// 表格列配置（根据tab动态调整，这里简化）
const tableColumns = computed(() => {
  const base = [
    { key: 'id', title: 'ID', sortable: true },
    { key: 'plateNumber', title: '车牌号', sortable: true },
    { key: 'date', title: '日期', sortable: true },
    { key: 'amount', title: '费用（元）', sortable: true }
  ]
  if (activeTab.value === 'abnormalEntry') {
    return [
      { key: 'id', title: 'ID', sortable: true },
      { key: 'plateNumber', title: '车牌号', sortable: true },
      { key: 'entryTime', title: '入场时间', sortable: true },
      { key: 'reason', title: '异常原因', sortable: false }
    ]
  } else if (activeTab.value === 'scheduleQueue') {
    return [
      { key: 'id', title: 'ID', sortable: true },
      { key: 'driver', title: '司机', sortable: true },
      { key: 'scheduleTime', title: '排班时间', sortable: true },
      { key: 'queuePosition', title: '排队位置', sortable: true }
    ]
  }
  return base
})

// 加载数据
async function loadData() {
  loading.value = true
  error.value = false
  try {
    const params = {
      tab: activeTab.value,
      page: pagination.value.current,
      pageSize: pagination.value.pageSize,
      keyword: searchKeyword.value,
      filters: filterValues.value
    }
    const res = await getReportDetail(params)
    tableData.value = res.data
    pagination.value.total = res.total
  } catch (err) {
    error.value = true
  } finally {
    loading.value = false
  }
}

// 交互事件
function onTabChange() {
  pagination.value.current = 1
  searchKeyword.value = ''
  loadData()
}

function onSearch() {
  pagination.value.current = 1
  loadData()
}

function onSortChange({ prop, order }) {
  // 简单处理，实际需要传递排序参数
  loadData()
}

function onPageChange(page) {
  pagination.value.current = page
  loadData()
}

function exportData() {
  // 原型演示，直接提示
  alert('导出中... 实际将调用导出接口')
}

function goBack() {
  router.push({ path: '/dashboard' })
}

function clearFilters() {
  filterValues.value = {}
  searchKeyword.value = ''
  loadData()
}

function retry() {
  loadData()
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.report-detail-view {
  padding: 20px;
  background: #fff;
  min-height: 100%;
}
.breadcrumb-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.filter-bar {
  margin-bottom: 16px;
}
.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.table-area {
  margin-top: 12px;
}
</style>