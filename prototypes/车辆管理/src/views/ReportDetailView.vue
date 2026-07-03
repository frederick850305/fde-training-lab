<template>
  <div class="report-detail-view">
    <!-- 面包屑导航及返回概览按钮 -->
    <div class="breadcrumb-bar">
      <a class="breadcrumb-link" @click="goBack">概览工作台</a>
      <span class="separator"> / </span>
      <span class="current-page">报表详情</span>
      <el-button size="small" class="back-btn" @click="goBack">返回概览</el-button>
    </div>

    <!-- 当前筛选条件标签 -->
    <div class="filter-tags" v-if="activeFilters.length > 0">
      <span class="tag-label">当前筛选：</span>
      <el-tag
        v-for="(filter, idx) in activeFilters"
        :key="idx"
        closable
        @close="removeFilter(idx)"
      >{{ filter.label }}: {{ filter.value }}</el-tag>
    </div>

    <!-- 明细类型标签页 -->
    <el-tabs v-model="activeTab" @tab-click="handleTabChange">
      <el-tab-pane label="外协费用明细" name="fee"></el-tab-pane>
      <el-tab-pane label="异常入场记录" name="abnormalEntry"></el-tab-pane>
      <el-tab-pane label="排班排队分析" name="scheduleQueue"></el-tab-pane>
    </el-tabs>

    <!-- 搜索框 -->
    <div class="search-bar">
      <el-input
        v-model="searchKeyword"
        placeholder="搜索（车辆、司机等）"
        clearable
        @keyup.enter="handleSearch"
        style="width: 300px"
      >
        <template #append>
          <el-button icon="Search" @click="handleSearch">搜索</el-button>
        </template>
      </el-input>
      <el-button class="export-btn" @click="handleExport">导出当前明细</el-button>
    </div>

    <!-- 表格区 -->
    <div class="table-container">
      <div v-if="state === 'loading'" class="state-wrapper">
        <el-skeleton :rows="5" animated />
      </div>

      <div v-else-if="state === 'empty'" class="state-wrapper empty-state">
        <img src="../assets/empty.svg" alt="暂无记录" style="width: 120px; height: 120px;" />
        <p>暂无记录</p>
        <el-button size="small" @click="clearFilters">清除筛选条件</el-button>
      </div>

      <div v-else-if="state === 'error'" class="state-wrapper error-state">
        <p>数据加载失败，请重试</p>
        <el-button size="small" @click="fetchData">重试</el-button>
      </div>

      <div v-else class="data-table">
        <el-table
          :data="tableData"
          stripe
          @sort-change="handleSortChange"
          style="width: 100%"
        >
          <el-table-column
            v-for="col in columns"
            :key="col.key"
            :prop="col.key"
            :label="col.title"
            :sortable="col.sortable"
            :width="col.width"
          />
        </el-table>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <el-pagination
            background
            layout="prev, pager, next, total, sizes"
            :total="totalRecords"
            :current-page="currentPage"
            :page-size="pageSize"
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed, provide } from 'vue';
import prototypeContract from '../prototypeContract.js';

// 注入角色上下文
const prototypeContext = inject('prototypeContext');
const currentRole = prototypeContext?.currentRole || 'dispatcher';
const currentRoleKey = prototypeContext?.currentRoleKey || 'dispatcher';

// 从 prototypeContract 获取页面合同（仅用于结构参考）
const pageContract = prototypeContract.pages.find(p => p.file === 'ReportDetailView.vue');

// 状态管理
const state = ref('loading'); // loading | empty | success | error
const activeTab = ref('fee');
const searchKeyword = ref('');
const currentPage = ref(1);
const pageSize = ref(10);
const totalRecords = ref(0);
const tableData = ref([]);
const sortProp = ref(null);
const sortOrder = ref(null);

// 模拟活动筛选条件（从概览继承）
const activeFilters = ref([
  { label: '时间范围', value: '2024-01-01 ~ 2024-12-31' },
]);

// 模拟演示数据（仅供原型演示，不超过3条）
const demoData = {
  fee: [
    { id: 1, vehiclePlate: '京A12345', driverName: '张三', feeAmount: 1500, entryTime: '2024-03-15 08:30', exitTime: '2024-03-15 17:20', status: '已结算' },
    { id: 2, vehiclePlate: '沪B67890', driverName: '李四', feeAmount: 2200, entryTime: '2024-03-16 09:00', exitTime: '2024-03-16 18:00', status: '待结算' },
    { id: 3, vehiclePlate: '粤C11223', driverName: '王五', feeAmount: 800, entryTime: '2024-03-17 10:15', exitTime: '2024-03-17 15:45', status: '已结算' },
  ],
  abnormalEntry: [
    { id: 1, vehiclePlate: '京D44556', driverName: '赵六', abnormalType: '未预约闯入', entryTime: '2024-03-14 12:30', handleTime: '2024-03-14 12:35', status: '已处理' },
    { id: 2, vehiclePlate: '沪E78901', driverName: '孙七', abnormalType: '证照过期', entryTime: '2024-03-15 14:00', handleTime: '2024-03-15 14:10', status: '驳回' },
  ],
  scheduleQueue: [
    { id: 1, queueName: '卸货区1号', scheduledTime: '2024-03-18 10:00', vehiclePlate: '京F33455', driverName: '周八', status: '等待中' },
    { id: 2, queueName: '卸货区2号', scheduledTime: '2024-03-18 10:30', vehiclePlate: '沪G66778', driverName: '吴九', status: '已入场' },
  ],
};

// 列定义（依据演示数据字段）
const columns = computed(() => {
  if (activeTab.value === 'fee') {
    return [
      { key: 'vehiclePlate', title: '车牌号', sortable: true },
      { key: 'driverName', title: '司机', sortable: true },
      { key: 'feeAmount', title: '费用（元）', sortable: true, width: 100 },
      { key: 'entryTime', title: '入场时间', sortable: true },
      { key: 'exitTime', title: '出场时间', sortable: true },
      { key: 'status', title: '结算状态', sortable: true },
    ];
  } else if (activeTab.value === 'abnormalEntry') {
    return [
      { key: 'vehiclePlate', title: '车牌号', sortable: true },
      { key: 'driverName', title: '司机', sortable: true },
      { key: 'abnormalType', title: '异常类型', sortable: true },
      { key: 'entryTime', title: '入场时间', sortable: true },
      { key: 'handleTime', title: '处理时间', sortable: true },
      { key: 'status', title: '处理状态', sortable: true },
    ];
  } else {
    return [
      { key: 'queueName', title: '排队点', sortable: true },
      { key: 'scheduledTime', title: '预约时间', sortable: true },
      { key: 'vehiclePlate', title: '车牌号', sortable: true },
      { key: 'driverName', title: '司机', sortable: true },
      { key: 'status', title: '状态', sortable: true },
    ];
  }
});

// 模拟数据获取
function fetchData() {
  state.value = 'loading';
  // 模拟延迟
  setTimeout(() => {
    const data = demoData[activeTab.value] || [];
    if (data.length === 0) {
      state.value = 'empty';
      tableData.value = [];
      totalRecords.value = 0;
    } else {
      // 应用搜索过滤
      let filtered = data;
      if (searchKeyword.value) {
        const kw = searchKeyword.value.toLowerCase();
        filtered = data.filter(row =>
          Object.values(row).some(val => String(val).toLowerCase().includes(kw))
        );
      }
      // 应用排序
      if (sortProp.value) {
        const order = sortOrder.value === 'ascending' ? 1 : -1;
        filtered = [...filtered].sort((a, b) => {
          if (a[sortProp.value] < b[sortProp.value]) return -1 * order;
          if (a[sortProp.value] > b[sortProp.value]) return 1 * order;
          return 0;
        });
      }
      totalRecords.value = filtered.length;
      // 分页
      const start = (currentPage.value - 1) * pageSize.value;
      const end = start + pageSize.value;
      tableData.value = filtered.slice(start, end);
      state.value = 'success';
    }
  }, 500);
}

onMounted(() => {
  fetchData();
});

function handleTabChange() {
  searchKeyword.value = '';
  currentPage.value = 1;
  sortProp.value = null;
  sortOrder.value = null;
  fetchData();
}

function handleSearch() {
  currentPage.value = 1;
  fetchData();
}

function handleSortChange({ prop, order }) {
  sortProp.value = prop;
  sortOrder.value = order;
  fetchData();
}

function handlePageChange(page) {
  currentPage.value = page;
  fetchData();
}

function handleSizeChange(size) {
  pageSize.value = size;
  currentPage.value = 1;
  fetchData();
}

function handleExport() {
  // 模拟导出
  const blob = new Blob(['模拟导出数据'], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `报表明细_${activeTab.value}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
  // 简单提示
  alert('导出成功（演示）');
}

function goBack() {
  // 模拟返回概览（实际使用 history.back 或路由跳转）
  window.history.back();
}

function removeFilter(index) {
  activeFilters.value.splice(index, 1);
  // 重新加载数据
  fetchData();
}

function clearFilters() {
  activeFilters.value = [];
  fetchData();
}

// 提供一些上下文（虽然不是必须）
provide('pageContext', { currentRole, currentRoleKey });
</script>

<style scoped>
.report-detail-view {
  padding: 20px;
  background: #fff;
  min-height: 100vh;
}

.breadcrumb-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  margin-bottom: 16px;
}

.breadcrumb-link {
  color: #409eff;
  cursor: pointer;
}

.separator {
  color: #999;
}

.current-page {
  color: #333;
  font-weight: bold;
}

.back-btn {
  margin-left: auto;
}

.filter-tags {
  margin-bottom: 16px;
}

.tag-label {
  font-size: 13px;
  color: #666;
  margin-right: 8px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.export-btn {
  margin-left: auto;
}

.table-container {
  min-height: 400px;
}

.state-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-state p,
.error-state p {
  color: #999;
  margin: 12px 0;
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.el-skeleton {
  padding: 20px;
}
</style>
