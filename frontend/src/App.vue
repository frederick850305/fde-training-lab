<template>
  <main class="app-shell">
    <AppHeader />

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">VSCode + Codex/Copilot + Vue3 + FastAPI</p>
        <h1>把客户需求快速变成可演示的业务原型</h1>
        <p class="subtitle">
          这个工作台用于沉淀一套 AI 原型工厂方法：先梳理需求，再设计功能、页面和 API 契约，最后生成 Vue3 前端样例并联调 FastAPI。
        </p>
      </div>

      <article class="service-panel">
        <span class="panel-label">后端联调状态</span>
        <strong>FastAPI 待联调</strong>
        <p>下一阶段会接入 `/health` 和 `/requirement/summary`。</p>
        <dl>
          <div>
            <dt>前端端口</dt>
            <dd>5173</dd>
          </div>
          <div>
            <dt>后端地址</dt>
            <dd>127.0.0.1:8000</dd>
          </div>
        </dl>
      </article>
    </section>

    <section class="main-tabs" aria-label="工作台一级导航">
      <button
        v-for="tab in mainTabs"
        :key="tab.key"
        type="button"
        :class="{ active: tab.key === activeMainTab }"
        @click="selectMainTab(tab.key)"
      >
        <span>{{ tab.eyebrow }}</span>
        {{ tab.label }}
      </button>
    </section>

    <template v-if="activeMainTab === 'method'">
      <template v-if="activeWorkspace === 'factoryWorkbench'">
        <FactoryWorkbenchView @open-workspace="selectWorkspace" />

        <section class="section-block" aria-labelledby="capability-title">
          <div class="section-heading">
            <p class="eyebrow">Core Capabilities</p>
            <h2 id="capability-title">原型工作台能力入口</h2>
          </div>
          <div class="capability-grid">
            <FeatureCard
              v-for="item in methodCapabilities"
              :key="item.key"
              :stage="item.stage"
              :title="item.title"
              :description="item.description"
              :action="item.action"
              :active="item.key === activeWorkspace"
              @select="selectWorkspace(item.key)"
            />
          </div>
        </section>
      </template>

      <RequirementInputView v-else-if="activeWorkspace === 'requirementInput'" />
      <ScenarioIdentificationView v-else-if="activeWorkspace === 'scenarioIdentification'" />
      <FeatureDesignView v-else-if="activeWorkspace === 'featureDesign'" />
      <PageDesignView v-else-if="activeWorkspace === 'pageDesign'" />
      <PageInteractionView v-else-if="activeWorkspace === 'pageInteraction'" />
      <ApiContractView v-else-if="activeWorkspace === 'apiContract'" />
      <FrontendPrototypeSuggestionView v-else-if="activeWorkspace === 'frontendSuggestion'" />
      <PrototypeWorkflowView v-else-if="activeWorkspace === 'prototypeWorkflow'" />
      <RequirementSummaryView v-else />
    </template>

    <section v-else-if="activeMainTab === 'progress'" class="section-block progress-panel" aria-labelledby="progress-title">
      <div class="section-heading">
        <p class="eyebrow">Training Progress</p>
        <h2 id="progress-title">第二阶段练习进展</h2>
      </div>
      <ul class="progress-list">
        <li v-for="item in progressItems" :key="item.name">
          <span class="progress-status" :class="item.statusClass">{{ item.status }}</span>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </section>

    <template v-else>
      <PrototypeNav
        :items="prototypeNavItems"
        :active-key="activeWorkspace"
        @select="selectWorkspace"
      />

      <ProjectOverviewView v-if="activeWorkspace === 'projectOverview'" />
      <ScheduleTrackingView v-else-if="activeWorkspace === 'scheduleTracking'" />
      <IssueTrackingView v-else-if="activeWorkspace === 'issueTracking'" />
      <OnsiteDispatchView v-else-if="activeWorkspace === 'onsiteDispatch'" />
      <MaterialTrackingView v-else />
    </template>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import ApiContractView from './views/ApiContractView.vue'
import FeatureCard from './components/FeatureCard.vue'
import FeatureDesignView from './views/FeatureDesignView.vue'
import FactoryWorkbenchView from './views/FactoryWorkbenchView.vue'
import FrontendPrototypeSuggestionView from './views/FrontendPrototypeSuggestionView.vue'
import IssueTrackingView from './views/IssueTrackingView.vue'
import MaterialTrackingView from './views/MaterialTrackingView.vue'
import OnsiteDispatchView from './views/OnsiteDispatchView.vue'
import PageDesignView from './views/PageDesignView.vue'
import PageInteractionView from './views/PageInteractionView.vue'
import ProjectOverviewView from './views/ProjectOverviewView.vue'
import PrototypeNav from './components/PrototypeNav.vue'
import PrototypeWorkflowView from './views/PrototypeWorkflowView.vue'
import RequirementInputView from './views/RequirementInputView.vue'
import RequirementSummaryView from './views/RequirementSummaryView.vue'
import ScheduleTrackingView from './views/ScheduleTrackingView.vue'
import ScenarioIdentificationView from './views/ScenarioIdentificationView.vue'

const activeWorkspace = ref('factoryWorkbench')
const activeMainTab = ref('method')

const mainTabs = [
  { key: 'method', label: '原型工厂方法', eyebrow: 'Method' },
  { key: 'progress', label: '练习进展', eyebrow: 'Progress' },
  { key: 'prototypeSystem', label: '业务原型系统', eyebrow: 'Prototype' },
]

const workspaceTabs = [
  { key: 'requirementInput', label: '需求输入' },
  { key: 'scenarioIdentification', label: '场景识别' },
  { key: 'featureDesign', label: '功能设计' },
  { key: 'pageDesign', label: '页面设计' },
  { key: 'pageInteraction', label: '交互设计' },
  { key: 'apiContract', label: 'API 契约' },
  { key: 'frontendSuggestion', label: '原型建议' },
  { key: 'projectOverview', label: '项目总览' },
  { key: 'scheduleTracking', label: '计划任务' },
  { key: 'issueTracking', label: '异常闭环' },
  { key: 'onsiteDispatch', label: '现场调度' },
  { key: 'materialTracking', label: '物料到货' },
  { key: 'prototypeWorkflow', label: '原型流程' },
  { key: 'requirementSummary', label: '需求分析' },
]

const prototypeNavItems = [
  { key: 'projectOverview', label: '项目总览', stage: 'P0' },
  { key: 'scheduleTracking', label: '计划任务', stage: 'P0' },
  { key: 'issueTracking', label: '异常闭环', stage: 'P0' },
  { key: 'onsiteDispatch', label: '现场调度', stage: 'P0' },
  { key: 'materialTracking', label: '物料到货', stage: 'P0' },
]

const showPrototypeNav = computed(() => {
  return prototypeNavItems.some((item) => item.key === activeWorkspace.value)
})

const methodCapabilities = computed(() => {
  return capabilities.filter((item) => !prototypeNavItems.some((prototypeItem) => prototypeItem.key === item.key))
})

const selectMainTab = (key) => {
  activeMainTab.value = key

  if (key === 'prototypeSystem' && !showPrototypeNav.value) {
    activeWorkspace.value = 'projectOverview'
    return
  }

  if (key === 'method') {
    activeWorkspace.value = 'factoryWorkbench'
  }
}

const selectWorkspace = (key) => {
  activeWorkspace.value = key

  if (prototypeNavItems.some((item) => item.key === key)) {
    activeMainTab.value = 'prototypeSystem'
    return
  }

  activeMainTab.value = 'method'
}

const capabilities = [
  {
    key: 'requirementInput',
    stage: 'P0',
    title: '需求输入工作台',
    description: '输入客户原始需求，模拟生成结构化需求拆解结果。',
    action: '进入工作区',
  },
  {
    key: 'scenarioIdentification',
    stage: 'P1',
    title: '场景识别工作台',
    description: '基于需求拆解结果，模拟识别用户角色、业务场景和任务流程。',
    action: '识别场景',
  },
  {
    key: 'featureDesign',
    stage: 'P1',
    title: '功能模块设计',
    description: '从业务场景反推功能模块、功能点、优先级和页面/API 映射。',
    action: '设计功能',
  },
  {
    key: 'pageDesign',
    stage: 'P2',
    title: '页面清单设计',
    description: '把功能模块转成页面清单、导航结构、页面区域和 Vue 文件建议。',
    action: '设计页面',
  },
  {
    key: 'pageInteraction',
    stage: 'P2',
    title: '页面交互设计',
    description: '细化页面字段、按钮动作、校验规则和 loading/成功/失败状态。',
    action: '设计交互',
  },
  {
    key: 'apiContract',
    stage: 'P2',
    title: 'API 契约设计',
    description: '明确接口路径、请求参数、响应结构、错误码和前端触发来源。',
    action: '设计接口',
  },
  {
    key: 'frontendSuggestion',
    stage: 'P2',
    title: '前端原型建议',
    description: '汇总页面、组件、mock 数据、生成顺序和 Codex/Copilot Prompt。',
    action: '查看建议',
  },
  {
    key: 'projectOverview',
    stage: 'P0',
    title: '项目总览原型',
    description: '使用 mock 数据和通用组件，展示项目进度、关键节点和异常摘要。',
    action: '查看原型',
  },
  {
    key: 'scheduleTracking',
    stage: 'P0',
    title: '计划任务原型',
    description: '使用 mock 数据和通用组件，展示任务筛选、任务列表和调整建议。',
    action: '查看原型',
  },
  {
    key: 'issueTracking',
    stage: 'P0',
    title: '异常闭环原型',
    description: '使用 mock 数据和通用组件，模拟异常登记、状态摘要和问题列表。',
    action: '查看原型',
  },
  {
    key: 'onsiteDispatch',
    stage: 'P0',
    title: '现场调度原型',
    description: '展示多作业面状态、关键资源占用、物料预警和现场调度建议。',
    action: '查看原型',
  },
  {
    key: 'materialTracking',
    stage: 'P0',
    title: '物料到货跟踪原型',
    description: '跟踪关键物料到货状态、延期风险和物资协调动作。',
    action: '查看原型',
  },
  {
    key: 'prototypeWorkflow',
    stage: 'P2',
    title: '原型生成流程',
    description: '查看需求拆解、场景识别、功能设计、页面设计和 API 契约步骤。',
    action: '查看流程',
  },
  {
    key: 'requirementSummary',
    stage: 'P2',
    title: '客户需求分析',
    description: '输入需求文件路径，模拟生成结构化需求分析报告。',
    action: '查看页面',
  },
]

const processSteps = [
  '客户需求输入',
  '需求与场景拆解',
  '功能模块设计',
  '页面与交互设计',
  'API 契约设计',
  'Vue3 页面生成',
  'FastAPI 联调验收',
]

const progressItems = [
  { name: '2-1 到 2-7：原型设计方法资产', status: '完成', statusClass: 'done' },
  { name: '2-8：Vue3 项目初始化', status: '完成', statusClass: 'done' },
  { name: '2-9：工作台首页生成', status: '完成', statusClass: 'done' },
  { name: '2-10：客户需求分析页生成', status: '完成', statusClass: 'done' },
  { name: '2-11：Vue3 组件拆分', status: '完成', statusClass: 'done' },
  { name: '2-12：原型生成流程设计', status: '完成', statusClass: 'done' },
  { name: '2-13：需求输入工作台', status: '完成', statusClass: 'done' },
  { name: '2-14：需求拆解模拟结果', status: '完成', statusClass: 'done' },
  { name: '2-15：工作台页面切换与状态修正', status: '完成', statusClass: 'done' },
  { name: '2-16：场景识别模拟工作台', status: '完成', statusClass: 'done' },
  { name: '2-17：功能模块设计模拟工作台', status: '完成', statusClass: 'done' },
  { name: '2-18：页面清单设计模拟工作台', status: '完成', statusClass: 'done' },
  { name: '2-19：页面字段与交互设计模拟工作台', status: '完成', statusClass: 'done' },
  { name: '2-20：API 契约设计模拟工作台', status: '完成', statusClass: 'done' },
  { name: '2-21：前端原型建议模拟工作台', status: '完成', statusClass: 'done' },
  { name: '2-22：原型 Mock 数据与通用组件准备', status: '完成', statusClass: 'done' },
  { name: '2-23：项目总览原型页', status: '完成', statusClass: 'done' },
  { name: '2-24：计划任务跟踪原型页', status: '完成', statusClass: 'done' },
  { name: '2-25：异常问题闭环原型页', status: '完成', statusClass: 'done' },
  { name: '2-26：现场调度看板原型页', status: '完成', statusClass: 'done' },
  { name: '2-27：物料到货跟踪原型页', status: '完成', statusClass: 'done' },
  { name: '2-28：原型页面统一导航优化', status: '完成', statusClass: 'done' },
  { name: '2-29：工作台一级 Tab 结构重组', status: '完成', statusClass: 'done' },
  { name: '2-30：原型工厂操作台总览', status: '当前', statusClass: 'active' },
]
</script>