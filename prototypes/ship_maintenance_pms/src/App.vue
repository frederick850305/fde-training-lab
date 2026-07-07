<template>
  <div class="app-shell">
    <aside class="side-nav">
      <div class="brand">
        <span class="brand-mark">PMS</span>
        <div>
          <strong>{{ data.projectName }}</strong>
          <small>{{ data.customerName }} 国产化替代原型</small>
        </div>
      </div>

      <label class="role-picker">
        <span>当前视角</span>
        <select v-model="currentRoleKey" @change="pickFirstVisiblePage">
          <option v-for="role in data.roles" :key="role.key" :value="role.key">{{ role.label }}</option>
        </select>
        <em>{{ currentRole.user }}</em>
      </label>

      <div class="nav-scroll">
        <section v-for="group in visibleGroups" :key="group.key" class="nav-group">
          <button class="nav-group-title" type="button" @click="toggleGroup(group.key)">
            <span><i>{{ group.icon }}</i>{{ group.title }}</span>
            <b>{{ expandedGroups.has(group.key) ? '−' : '+' }}</b>
          </button>
          <div v-if="expandedGroups.has(group.key)" class="route-list">
            <button
              v-for="page in normalizePages(group)"
              :key="page.key"
              class="route-item"
              :class="{ active: page.key === currentPageKey }"
              type="button"
              @click="currentPageKey = page.key"
            >
              <span>{{ page.title }}</span>
              <small>{{ page.priority }}</small>
            </button>
          </div>
        </section>
      </div>
    </aside>

    <main class="workspace">
      <header class="topbar">
        <div>
          <p>来源：{{ data.sourceFile }}</p>
          <h1>{{ currentPage.title }}</h1>
        </div>
        <div class="top-actions">
          <button type="button" @click="setMode('overview')" :class="{ active: mode === 'overview' }">总览</button>
          <button type="button" @click="setMode('states')" :class="{ active: mode === 'states' }">状态</button>
          <button type="button" @click="setMode('interactions')" :class="{ active: mode === 'interactions' }">交互</button>
        </div>
      </header>

      <section class="hero-panel">
        <div class="hero-copy">
          <span class="eyebrow">{{ currentPage.groupTitle }} / {{ currentPage.priority }}</span>
          <h2>{{ currentPage.responsibility }}</h2>
          <div class="metric-row">
            <article v-for="metric in data.metrics" :key="metric.label" :class="['metric-card', metric.tone]">
              <strong>{{ metric.value }}</strong>
              <span>{{ metric.label }}</span>
            </article>
          </div>
        </div>
        <div class="ship-visual" aria-hidden="true">
          <div class="radar-ring"></div>
          <div class="route route-a"></div>
          <div class="route route-b"></div>
          <div class="ship-card main">HG-01<br />健康 {{ pageScore }}%</div>
          <div class="ship-card left">离线队列 {{ queueCount }}</div>
          <div class="ship-card right">告警 {{ alertCount }}</div>
        </div>
      </section>

      <section v-if="mode === 'overview'" class="content-grid">
        <article class="panel wide">
          <div class="panel-head">
            <h3>页面布局</h3>
            <button type="button">导出</button>
          </div>
          <div class="layout-map">
            <div v-for="zone in layoutZones" :key="zone.zone" class="zone-card">
              <strong>{{ zone.zone }}</strong>
              <p>{{ zone.content }}</p>
            </div>
          </div>
        </article>

        <article class="panel">
          <div class="panel-head">
            <h3>业务目标</h3>
          </div>
          <ul class="clean-list">
            <li v-for="goal in data.goals" :key="goal">{{ goal }}</li>
          </ul>
        </article>

        <article class="panel">
          <div class="panel-head">
            <h3>风险痛点</h3>
          </div>
          <ul class="clean-list warning">
            <li v-for="pain in data.painPoints" :key="pain">{{ pain }}</li>
          </ul>
        </article>

        <article class="panel wide">
          <div class="panel-head">
            <h3>模拟数据表</h3>
            <div class="filter-chips">
              <button v-for="chip in tableFilters" :key="chip" type="button">{{ chip }}</button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th v-for="head in tableHeads" :key="head">{{ head }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableRows" :key="row.id">
                <td>{{ row.id }}</td>
                <td>{{ row.asset }}</td>
                <td><span :class="['status', row.statusTone]">{{ row.status }}</span></td>
                <td>{{ row.owner }}</td>
                <td>{{ row.time }}</td>
                <td><button type="button" class="link-btn">查看</button></td>
              </tr>
            </tbody>
          </table>
        </article>
      </section>

      <section v-else-if="mode === 'states'" class="state-grid">
        <article v-for="state in uiStates" :key="state.state" class="state-card">
          <span>{{ state.state }}</span>
          <p>{{ state.content }}</p>
        </article>
      </section>

      <section v-else class="interaction-board">
        <article class="panel">
          <div class="panel-head">
            <h3>关键交互</h3>
          </div>
          <ol class="timeline">
            <li v-for="item in interactions" :key="item">{{ item }}</li>
          </ol>
        </article>
        <article class="panel">
          <div class="panel-head">
            <h3>原型控件</h3>
          </div>
          <div class="control-stack">
            <label>状态筛选<select><option>全部状态</option><option>待处理</option><option>异常</option></select></label>
            <label>时间范围<input type="date" value="2026-07-07" /></label>
            <label>处理意见<textarea rows="5" placeholder="填写审批、退回、豁免或处置说明"></textarea></label>
            <div class="action-row">
              <button type="button" class="primary">提交</button>
              <button type="button">暂存</button>
              <button type="button">重置</button>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { pages, prototypeData as data } from './data/prototypeData.js'

const currentRoleKey = ref('shore_engineer')
const currentPageKey = ref('MaintenancePlanWorkbench')
const mode = ref('overview')
const expandedGroups = ref(new Set(['maintenance', 'voyage', 'workorder']))

const currentRole = computed(() => data.roles.find(role => role.key === currentRoleKey.value) || data.roles[0])

const visibleGroups = computed(() => data.groups.filter(group => group.roles.includes(currentRoleKey.value)))

const currentPage = computed(() =>
  pages.find(page => page.key === currentPageKey.value && page.roles.includes(currentRoleKey.value)) ||
  normalizePages(visibleGroups.value[0] || data.groups[0])[0],
)

const pageScore = computed(() => 88 + (currentPage.value.key.length % 9))
const queueCount = computed(() => 6 + (currentPage.value.title.length % 8))
const alertCount = computed(() => currentPage.value.priority === 'P0' ? 3 : 1)

const layoutZones = computed(() => {
  const title = currentPage.value.title
  return [
    { zone: '顶部区域', content: `${title} 的关键指标、全局搜索、状态统计与高频操作入口。` },
    { zone: '主工作区', content: `${currentPage.value.responsibility}，以表格、详情面板和业务卡片组合呈现。` },
    { zone: '侧边详情区', content: '展示当前选中记录的关联设备、工单、物资、同步状态、审批日志和审计链路。' },
    { zone: '底部操作区', content: '提供提交、审核、退回、导出、重试、同步或下发等闭环操作，并保留操作痕迹。' },
  ]
})

const uiStates = computed(() => [
  { state: 'empty', content: `暂无${currentPage.value.title}数据时，显示空状态、刷新入口和引导创建按钮。` },
  { state: 'loading', content: '表格与统计卡片显示骨架屏；提交、同步、导出等按钮进入加载态。' },
  { state: 'success', content: '正常展示业务数据、状态标签、右侧详情和可执行操作，筛选条件实时生效。' },
  { state: 'error', content: '接口失败时保留已输入内容，显示错误原因、重试按钮和可用缓存数据提示。' },
])

const interactions = computed(() => [
  `点击左侧导航切换到“${currentPage.value.title}”，页面刷新当前业务上下文。`,
  '使用筛选条件缩小数据范围，统计卡片、列表和详情面板同步更新。',
  '点击表格行打开右侧详情，查看关联设备、工单、物资、同步或审计信息。',
  '执行提交、审批、退回、同步、导出等动作时先进行前端校验，再显示确认反馈。',
  '关键操作写入日志，供系统管理员和审计员在审计工作台检索追踪。',
])

const tableHeads = ['编号', '对象', '状态', '负责人', '更新时间', '操作']
const tableFilters = ['全部', '待处理', '异常', '已闭环']
const tableRows = computed(() => [
  { id: `${currentPage.value.key}-001`, asset: '主机燃油泵 / HG-01', status: '待审核', statusTone: 'pending', owner: currentRole.value.label, time: '2026-07-07 09:20' },
  { id: `${currentPage.value.key}-002`, asset: '应急发电机 / HG-02', status: '异常', statusTone: 'danger', owner: '船端机工', time: '2026-07-07 10:45' },
  { id: `${currentPage.value.key}-003`, asset: '消防泵备件 / 仓库A', status: '已闭环', statusTone: 'ok', owner: '岸基机务', time: '2026-07-06 18:10' },
])

function normalizePages(group) {
  return group.pages.map(([key, title, responsibility, priority]) => ({
    key,
    title,
    responsibility,
    priority,
    groupTitle: group.title,
    roles: group.roles,
  }))
}

function pickFirstVisiblePage() {
  const first = normalizePages(visibleGroups.value[0] || data.groups[0])[0]
  currentPageKey.value = first.key
  expandedGroups.value = new Set(visibleGroups.value.slice(0, 3).map(group => group.key))
}

function setMode(nextMode) {
  mode.value = nextMode
}

function toggleGroup(key) {
  const next = new Set(expandedGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedGroups.value = next
}
</script>
