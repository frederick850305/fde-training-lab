<template>
  <section class="scenario-view" aria-labelledby="scenario-title">
    <ViewHeading
      eyebrow="Scenario Identification"
      title="场景识别模拟工作台"
      title-id="scenario-title"
      description="基于需求拆解结果，识别用户角色、业务场景、任务流程和页面映射。当前仍为前端模拟数据。"
    />

    <section class="context-handoff" aria-label="场景结果写回">
      <div>
        <span>上下文写回</span>
        <strong>确认当前场景并传给功能设计</strong>
      </div>
      <button class="primary-button" type="button" @click="confirmScenario">
        写入场景并进入功能设计
      </button>
    </section>

    <article v-if="projectContext.requirementAnalysis" class="context-summary-card">
      <div class="panel-heading">
        <span>上一步结果</span>
        <strong>来自需求输入阶段的拆解摘要</strong>
      </div>
      <p>{{ requirementSummaryPreview }}</p>
      <dl>
        <div>
          <dt>客户痛点</dt>
          <dd>{{ requirementPainPointsPreview }}</dd>
        </div>
        <div>
          <dt>业务目标</dt>
          <dd>{{ requirementGoalsPreview }}</dd>
        </div>
        <div>
          <dt>用户角色</dt>
          <dd>{{ requirementRolesPreview }}</dd>
        </div>
        <div>
          <dt>待确认问题</dt>
          <dd>{{ requirementQuestionsPreview }}</dd>
        </div>
      </dl>
    </article>

    <div class="scenario-layout">
      <article class="scenario-panel">
        <div class="panel-heading">
          <span>用户角色</span>
          <strong>谁会使用这个系统</strong>
        </div>

        <div class="role-list">
              <section v-for="role in roleCards" :key="role.name" class="role-card">
            <h3>{{ role.name }}</h3>
            <p>{{ role.focus }}</p>
            <ul>
              <li v-for="action in role.actions" :key="action">{{ action }}</li>
            </ul>
          </section>
        </div>
      </article>

      <article class="scenario-panel">
        <div class="panel-heading">
          <span>业务场景</span>
          <strong>先识别高频、关键、易验证场景</strong>
        </div>

        <div class="scenario-list" aria-label="业务场景列表">
          <button
            v-for="item in scenarioRecommendations"
            :key="item.key"
            type="button"
            class="scenario-button"
            :class="{ active: item.key === selectedScenario.key }"
            @click="selectedKey = item.key"
          >
            <span>{{ item.priority }}</span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.description }}</small>
          </button>
        </div>
      </article>
    </div>

    <div class="scenario-detail">
      <article class="detail-card">
        <span>当前场景</span>
        <h3>{{ selectedScenario.name }}</h3>
        <p>{{ selectedScenario.description }}</p>
      </article>

      <article class="detail-card">
        <span>任务流程</span>
        <ol>
          <li v-for="step in selectedScenario.workflow" :key="step">{{ step }}</li>
        </ol>
      </article>

      <article class="detail-card">
        <span>页面映射</span>
        <dl>
          <div>
            <dt>角色</dt>
            <dd>{{ selectedScenario.pageMapping.role }}</dd>
          </div>
          <div>
            <dt>建议页面</dt>
            <dd>{{ selectedScenario.pageMapping.page }}</dd>
          </div>
          <div>
            <dt>页面模块</dt>
            <dd>{{ selectedScenario.pageMapping.modules.join('、') }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { scenarioIdentificationMock } from '../data/scenarioIdentificationMock'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['scenario-confirm'])

const scenarioData = scenarioIdentificationMock

const requirementText = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const painPoints = (analysis.painPoints || [])
    .map((item) => item.description || item)
    .filter(Boolean)
  const userRoles = (analysis.userRoles || [])
    .map((item) => `${item.name} ${item.responsibility || ''}`.trim())
    .filter(Boolean)

  return [
    props.projectContext.sourceRequirement || '',
    analysis.businessBackground || '',
    ...painPoints,
    ...userRoles,
    ...(analysis.questions || []),
  ].join(' ')
})

const inferredScenarioKey = computed(() => {
  const source = requirementText.value.toLowerCase()

  if (
    source.includes('车辆') ||
    source.includes('车队') ||
    source.includes('司机') ||
    source.includes('临时') ||
    source.includes('外协') ||
    source.includes('预约') ||
    source.includes('审批') ||
    source.includes('入场') ||
    source.includes('出场') ||
    source.includes('调度') ||
    source.includes('现场') ||
    source.includes('异常') ||
    source.includes('告警') ||
    source.includes('安全')
  ) {
    return 'siteDispatch'
  }

  if (
    source.includes('计划') ||
    source.includes('工序') ||
    source.includes('进度') ||
    source.includes('任务') ||
    source.includes('到货') ||
    source.includes('审批') ||
    source.includes('仓储') ||
    source.includes('库存') ||
    source.includes('物料')
  ) {
    return 'scheduleTracking'
  }

  return 'siteDispatch'
})

const selectedKey = ref(inferredScenarioKey.value)

const requirementSummaryPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  return analysis.businessBackground || '暂无业务背景'
})

const requirementPainPointsPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const painPoints = analysis.painPoints || []
  return painPoints.map((item) => item.description || item).filter(Boolean).join('；') || '暂无客户痛点'
})

const requirementGoalsPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const goals = analysis.businessGoals || analysis.goals || []
  return goals.map((item) => item.description || item).filter(Boolean).join('；') || '暂无业务目标'
})

const requirementRolesPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  const roles = analysis.userRoles || []
  return roles.map((item) => `${item.name}：${item.responsibility}`).filter(Boolean).join('；') || '暂无用户角色'
})

const requirementQuestionsPreview = computed(() => {
  const analysis = props.projectContext.requirementAnalysis || {}
  return analysis.questions?.filter(Boolean).join('；') || '暂无待确认问题'
})

function detectDomainLabel(text) {
  const source = text.toLowerCase()

  if (source.includes('车辆') || source.includes('车队') || source.includes('司机')) {
    return {
      item: '车辆',
      process: '车辆运营',
    }
  }

  if (source.includes('物料') || source.includes('库存') || source.includes('仓储')) {
    return {
      item: '物料',
      process: '物料流转',
    }
  }

  if (source.includes('计划') || source.includes('工序') || source.includes('任务') || source.includes('进度')) {
    return {
      item: '项目',
      process: '计划执行',
    }
  }

  return {
    item: '业务',
    process: '业务协同',
  }
}

function buildRoleActions(roleName) {
  if (roleName.includes('项目经理')) {
    return ['查看总览', '关注异常风险', '确认关键节点', '推动问题闭环']
  }

  if (roleName.includes('计划员')) {
    return ['维护计划任务', '跟踪工序状态', '识别进度偏差', '发起调整建议']
  }

  if (roleName.includes('现场') || roleName.includes('调度')) {
    return ['查看当日作业', '协调现场资源', '反馈异常问题', '更新处置进展']
  }

  if (roleName.includes('仓储') || roleName.includes('物料')) {
    return ['查看到货状态', '核对缺料风险', '协调补货节奏', '跟踪受影响任务']
  }

  return ['查看业务状态', '处理待办事项', '跟踪执行进展', '反馈异常问题']
}

const roleCards = computed(() => {
  const analysis = props.projectContext.requirementAnalysis
  const roles = analysis?.userRoles || []

  if (!roles.length) {
    return scenarioData.roles
  }

  return roles.map((role) => ({
    name: role.name,
    focus: role.responsibility,
    actions: buildRoleActions(role.name),
  }))
})

const scenarioRecommendations = computed(() => {
  const domain = detectDomainLabel(requirementText.value)

  return scenarioData.scenarios.map((item) => {
    if (item.key === 'projectOverview') {
      return {
        ...item,
        name: '项目经理查看项目总览',
        description: `项目经理进入系统后，快速了解${domain.item}总览、关键节点、异常风险和资源占用情况。`,
        workflow: [
          '进入项目总览页',
          `查看${domain.item}总览、关键节点和风险状态`,
          '筛选异常问题和延期任务',
          '查看异常详情与责任人',
          '确认是否需要召开协调会或发起处理要求',
        ],
      }
    }

    if (item.key === 'scheduleTracking') {
      return {
        ...item,
        name: '计划员跟踪关键工序',
        description: `计划员基于${domain.item}任务清单，跟踪关键工序执行状态，识别延期、阻塞和待协调事项。`,
        workflow: [
          '进入计划任务页',
          '按项目、区域、工序状态筛选任务',
          '查看关键工序完成情况',
          '标记延期或阻塞任务',
          '生成计划调整建议',
        ],
      }
    }

    return {
      ...item,
      key: 'issueTracking',
      name: '现场调度员处理异常闭环',
      priority: 'P0',
      description: `现场调度员发现${domain.item}异常后，登记问题、分派责任人并跟踪闭环。`,
      workflow: [
        '进入异常问题闭环页',
        `查看${domain.item}异常列表`,
        '登记异常问题并选择责任人',
        '设置处理时限并更新进展',
        '确认异常处理完成并关闭记录',
      ],
      pageMapping: {
        role: '现场调度员',
        page: 'IssueTrackingView.vue',
        modules: ['异常问题登记', '处理进展跟踪', '状态更新操作'],
      },
    }
  })
})

const selectedScenario = computed(() => {
  return (
    scenarioRecommendations.value.find((item) => item.key === selectedKey.value) ||
    scenarioRecommendations.value[0]
  )
})

watch(scenarioRecommendations, (items) => {
  if (!items.some((item) => item.key === selectedKey.value)) {
    selectedKey.value = items[0]?.key || inferredScenarioKey.value || 'projectOverview'
  }
}, { immediate: true })

watch(inferredScenarioKey, (key) => {
  if (!scenarioRecommendations.value.some((item) => item.key === selectedKey.value)) {
    selectedKey.value = key
  }
})

function confirmScenario() {
    emit('scenario-confirm', {
      scenario: selectedScenario.value,
    })
}
</script>

<style scoped>
.scenario-view {
  margin-top: 16px;
}

.context-handoff {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 14px 16px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.context-handoff span {
  display: block;
  margin-bottom: 6px;
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.context-handoff strong {
  color: #0f172a;
  font-size: 16px;
}

.context-summary-card,
.scenario-panel,
.detail-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.context-summary-card {
  margin-bottom: 16px;
  padding: 20px;
}

.context-summary-card p {
  margin: 0 0 14px;
  color: #526174;
  line-height: 1.7;
}

.context-summary-card dl {
  display: grid;
  gap: 10px;
  margin: 0;
}

.context-summary-card dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.context-summary-card dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.context-summary-card dd {
  margin: 0;
  color: #172033;
  line-height: 1.7;
  font-weight: 700;
}

.scenario-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(340px, 0.9fr);
  gap: 16px;
}

.scenario-panel {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.role-list {
  display: grid;
  gap: 12px;
}

.role-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.role-card h3 {
  margin: 0 0 8px;
  color: #0f172a;
  font-size: 18px;
}

.role-card p,
.scenario-button small,
.detail-card p {
  color: #526174;
  line-height: 1.65;
}

.role-card p {
  margin: 0 0 10px;
}

.role-card ul {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.role-card li {
  border-radius: 999px;
  padding: 5px 9px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

.scenario-list {
  display: grid;
  gap: 10px;
}

.scenario-button {
  display: grid;
  gap: 7px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.scenario-button.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.scenario-button span {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.scenario-button strong {
  color: #0f172a;
  font-size: 16px;
}

.scenario-detail {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1fr) minmax(0, 1.15fr);
  gap: 16px;
  margin-top: 16px;
}

.detail-card {
  padding: 20px;
}

.detail-card h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 22px;
}

.detail-card p {
  margin-bottom: 0;
}

.detail-card ol {
  display: grid;
  gap: 9px;
  margin: 12px 0 0;
  padding-left: 22px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.detail-card dl {
  display: grid;
  gap: 10px;
  margin: 12px 0 0;
}

.detail-card dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.detail-card dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.detail-card dd {
  margin: 0;
  color: #172033;
  line-height: 1.6;
  font-weight: 800;
}

@media (max-width: 920px) {
  .context-handoff {
    align-items: flex-start;
    flex-direction: column;
  }

  .scenario-layout,
  .scenario-detail {
    grid-template-columns: 1fr;
  }
}
</style>
