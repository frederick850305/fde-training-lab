<template>
  <div class="report-detail-view">
    <!-- 面包屑和返回 -->
    <div class="breadcrumb">
      <span class="breadcrumb-item" @click="goBack">概览工作台</span>
      <span class="separator">/</span>
      <span class="breadcrumb-item active">报表详情</span>
      <button class="back-btn" @click="goBack">返回概览</button>
    </div>
    <!-- 筛选条件标签 -->
    <div class="filter-bar">
      <span v-for="(filter, index) in currentFilters" :key="index" class="filter-tag">
        {{ filter.label }}: {{ filter.value }}
        <button class="edit-btn" @click="editFilter(index)">编辑</button>
      </span>
    </div>
    <!-- 明细类型标签页 -->
    <div class="tabs">
      <button
        v-for="tab in tabList"
        :key="tab.key"
        :class="['tab', { active: currentTab === tab.key }]"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>
    <!-- 表格区 -->
    <div class="table-area">
      <!-- 搜索框 -->
      <div class="search-bar">
        <input v-model="searchKeyword" placeholder="搜索..." @keyup.enter="doSearch" />
        <button @click="doSearch">搜索</button>
      </div>
      <!-- 表格 -->
      <div v-if="loading" class="loading-state">加载中...</div>
      <div v-else-if="error" class="error-state">
        <p>加载失败</p>
        <button @click="fetchData">重试</button>
      </div>
      <div v-else-if="paginatedData.length === 0" class="empty-state">
        <p>暂无记录</p>
        <button @click="clearFilters">清除筛选</button>
      </div>
      <table v-else class="data-table">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" @click="toggleSort(col.key)">
              {{ col.title }}
              <span v-if="sortColumn === col.key">{{ sortOrder === 'asc' ? '↑' : '↓' }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedData" :key="row.id">
            <td v-for="col in columns" :key="col.key">{{ row[col.key] }}</td>
          </tr>
        </tbody>
      </table>
      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button :disabled="currentPage <= 1" @click="changePage(currentPage - 1)">上一页</button>
        <span>第 {{ currentPage }} / {{ totalPages }} 页</span>
        <button :disabled="currentPage >= totalPages" @click="changePage(currentPage + 1)">下一页</button>
      </div>
    </div>
    <!-- 导出按钮 -->
    <button class="export-btn" @click="exportData">导出当前明细</button>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { prototypeContract } from '../prototypeContract.js';

const prototypeContext = inject('prototypeContext', { currentRole: 'manager', currentRoleKey: 'manager' });
const currentRoleKey = computed(() => prototypeContext.currentRoleKey || 'manager');

// 根据角色设置默认标签页
const tabList = [
  { key: 'externalCost', label: '外协费用明细' },
  { key: 'abnormalEntry', label: '异常入场记录' },
  { key: 'scheduleQueue', label: '排班排队分析' },
];
const defaultTabMap = {
  dispatcher: 'scheduleQueue',
  gate: 'abnormalEntry',
  manager: 'externalCost',
  admin: 'externalCost',
  driver: 'externalCost',
};
const currentTab = ref(defaultTabMap[currentRoleKey.value] || 'externalCost');

// 筛选条件（从概览继承）
const currentFilters = ref([
  { label: '时间范围', value: '2024-01-01 ~ 2024-01-31' },
  { label: '车辆类型', value: '全部' },
]);

// 模拟数据（每个标签页最多3条）
const mockData = {
  externalCost: [
    { id: 1, vehiclePlate: '京A12345', driver: '张三', cost: 1200, date: '2024-01-15', unit: '运输公司A' },
    { id: 2, vehiclePlate: '京B67890', driver: '李四', cost: 850, date: '2024-01-16', unit: '物流公司B' },
    { id: 3, vehiclePlate: '京C11111', driver: '王五', cost: 2000, date: '2024-01-17', unit: '运输公司C' },
  ],
  abnormalEntry: [
    { id: 4, vehiclePlate: '京D22222', driver: '赵六', reason: '无预约', time: '2024-01-14 10:30', handler: '门岗小李' },
    { id: 5, vehiclePlate: '京E33333', driver: '钱七', reason: '证照过期', time: '2024-01-14 11:00', handler: '门岗小王' },
    { id: 6, vehiclePlate: '京F44444', driver: '孙八', reason: '超时未出', time: '2024-01-14 12:00', handler: '门岗小李' },
  ],
  scheduleQueue: [
    { id: 7, vehiclePlate: '京G55555', driver: '周九', queuePosition: 3, estimatedTime: '2024-01-14 14:00', status: '排队中' },
    { id: 8, vehiclePlate: '京H66666', driver: '吴十', queuePosition: 1, estimatedTime: '2024-01-14 13:30', status: '正在装货' },
    { id: 9, vehiclePlate: '京I77777', driver: '郑十一', queuePosition: 2, estimatedTime: '2024-01-14 13:45', status: '等待中' },
  ],
};

// 列定义（根据当前标签页动态）
const columns = computed(() => {
  if (currentTab.value === 'externalCost') {
    return [
      { key: 'vehiclePlate', title: '车牌号', sortable: true },
      { key: 'driver', title: '司机', sortable: true },
      { key: 'cost', title: '费用', sortable: true },
      { key: 'date', title: '日期', sortable: true },
      { key: 'unit', title: '所属单位', sortable: true },
    ];
  } else if (currentTab.value === 'abnormalEntry') {
    return [
      { key: 'vehiclePlate', title: '车牌号', sortable: true },
      { key: 'driver', title: '司机', sortable: true },
      { key: 'reason', title: '异常原因', sortable: true },
      { key: 'time', title: '时间', sortable: true },
      { key: 'handler', title: '处理人', sortable: true },
    ];
  } else {
    return [
      { key: 'vehiclePlate', title: '车牌号', sortable: true },
      { key: 'driver', title: '司机', sortable: true },
      { key: 'queuePosition', title: '排队位置', sortable: true },
      { key: 'estimatedTime', title: '预计时间', sortable: true },
      { key: 'status', title: '状态', sortable: true },
    ];
  }
});

const rawData = ref([]);
const loading = ref(false);
const error = ref(false);
const searchKeyword = ref('');
const sortColumn = ref('');
const sortOrder = ref('asc');
const currentPage = ref(1);
const pageSize = 5;

const filteredData = computed(() => {
  let data = rawData.value;
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    data = data.filter(row =>
      Object.values(row).some(val => String(val).toLowerCase().includes(keyword))
    );
  }
  if (sortColumn.value) {
    const col = sortColumn.value;
    data = [...data].sort((a, b) => {
      const aVal = a[col], bVal = b[col];
      if (typeof aVal === 'string') {
        return sortOrder.value === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      } else {
        return sortOrder.value === 'asc' ? aVal - bVal : bVal - aVal;
      }
    });
  }
  return data;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  return filteredData.value.slice(start, start + pageSize);
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize));

function fetchData() {
  loading.value = true;
  error.value = false;
  setTimeout(() => {
    try {
      const tabData = mockData[currentTab.value] || [];
      rawData.value = tabData;
      loading.value = false;
    } catch (e) {
      error.value = true;
      loading.value = false;
    }
  }, 500);
}

function switchTab(tab) {
  currentTab.value = tab;
  currentPage.value = 1;
  searchKeyword.value = '';
  sortColumn.value = '';
  fetchData();
}

function doSearch() {
  currentPage.value = 1;
}

function toggleSort(colKey) {
  if (sortColumn.value === colKey) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortColumn.value = colKey;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1;
}

function changePage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

function clearFilters() {
  searchKeyword.value = '';
  currentPage.value = 1;
}

function editFilter(index) {
  alert('编辑筛选条件：' + currentFilters.value[index].label);
}

function goBack() {
  window.history.back();
}

function exportData() {
  alert('导出当前明细（模拟）');
}

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.report-detail-view {
  padding: 16px;
  font-family: sans-serif;
}
.breadcrumb {
  margin-bottom: 12px;
}
.breadcrumb-item {
  cursor: pointer;
  color: #1890ff;
}
.breadcrumb-item.active {
  color: #333;
  cursor: default;
}
.separator {
  margin: 0 8px;
}
.back-btn {
  margin-left: 16px;
  padding: 4px 8px;
}
.filter-bar {
  margin-bottom: 12px;
}
.filter-tag {
  display: inline-block;
  background: #f0f0f0;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
}
.edit-btn {
  margin-left: 8px;
  font-size: 12px;
}
.tabs {
  margin-bottom: 12px;
}
.tab {
  padding: 8px 16px;
  cursor: pointer;
  border: 1px solid #d9d9d9;
  background: #fff;
  margin-right: 4px;
}
.tab.active {
  background: #1890ff;
  color: #fff;
  border-color: #1890ff;
}
.search-bar {
  margin-bottom: 12px;
}
.search-bar input {
  padding: 4px;
  margin-right: 8px;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table th,
.data-table td {
  border: 1px solid #e8e8e8;
  padding: 8px;
  text-align: left;
}
.data-table th {
  cursor: pointer;
  background: #fafafa;
}
.pagination {
  margin-top: 12px;
}
.pagination button {
  margin: 0 8px;
}
.export-btn {
  margin-top: 12px;
  padding: 8px 16px;
}
.loading-state,
.error-state,
.empty-state {
  padding: 40px;
  text-align: center;
}
</style>