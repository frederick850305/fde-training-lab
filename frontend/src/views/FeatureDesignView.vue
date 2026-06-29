<template>
  <section class="feature-design-view" aria-labelledby="feature-design-title">
    <ViewHeading
      eyebrow="Feature Design"
      title="功能模块设计模拟工作台"
      title-id="feature-design-title"
      description="基于场景识别结果，整理功能模块、功能点、优先级、页面建议和 API 方向。当前仍为前端模拟数据。"
    />

    <StepHandoffCard
      v-if="projectContext.selectedScenario"
      eyebrow="来源场景确认"
      :title="projectContext.selectedScenario.name"
      :summary="projectContext.selectedScenario.description"
      :items="scenarioItems"
    />

    <StepHandoffCard
      v-if="hasRequirementContext"
      eyebrow="上一步结果"
      title="来自需求输入阶段的拆解摘要"
      :summary="requirementContextSummary"
      :items="requirementItems"
    />

    <StepHandoffCard
      v-if="hasRequirementContext"
      eyebrow="需求分析详情"
      title="客户输入的结构化拆解结果"
      :summary="requirementAnalysisSummary"
      :items="requirementAnalysisItems"
    />

    <div class="feature-toolbar" aria-label="功能优先级筛选">
      <button
        v-for="filter in featureData.filters"
        :key="filter"
        type="button"
        :class="{ active: filter === activeFilter }"
        @click="setFilter(filter)"
      >
        {{ filter }}
      </button>
    </div>

    <div class="feature-layout">
      <article class="feature-panel">
        <div class="panel-heading">
          <span>功能模块</span>
          <strong>共 {{ filteredModules.length }} 个模块</strong>
        </div>

        <div class="module-list">
          <button
            v-for="item in filteredModules"
            :key="item.key"
            type="button"
            class="module-button"
            :class="{ active: item.key === selectedModule.key }"
            @click="selectedKey = item.key"
          >
            <span class="priority-tag">{{ item.priority }}</span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.description }}</small>
          </button>
        </div>
      </article>

      <article class="feature-detail">
        <span class="detail-label">当前模块</span>
        <h3>{{ selectedModule.name }}</h3>
        <p>{{ selectedModule.description }}</p>

        <dl class="module-meta">
          <div>
            <dt>来源场景</dt>
            <dd>{{ selectedModule.sourceScenario }}</dd>
          </div>
          <div>
            <dt>建议页面</dt>
            <dd>{{ selectedModule.pageSuggestion }}</dd>
          </div>
          <div>
            <dt>API 方向</dt>
            <dd>{{ selectedModule.apiSuggestion }}</dd>
          </div>
        </dl>

        <section class="feature-points" aria-label="功能点">
          <h4>功能点</h4>
          <ul>
            <li v-for="item in selectedModule.features" :key="item">{{ item }}</li>
          </ul>
        </section>

        <section class="scope-note" aria-label="范围控制说明">
          <h4>范围控制</h4>
          <p>{{ selectedModule.scopeNote }}</p>
        </section>
      </article>
    </div>

    <section class="scope-summary" aria-labelledby="scope-summary-title">
      <div>
        <span>P0</span>
        <strong>一期必须做</strong>
        <p>支撑项目总览、计划跟踪和异常闭环，保证原型有完整业务闭环。</p>
      </div>
      <div>
        <span>P1</span>
        <strong>可以增强</strong>
        <p>物料、资源等能力可以增强演示效果，但不影响核心闭环验证。</p>
      </div>
      <div>
        <span>P2</span>
        <strong>暂不进入一期</strong>
        <p>AI 辅助建议等能力等后续接入 DeepSeek 后再深化。</p>
      </div>
    </section>

    <div class="next-action">
      <button class="primary-button" type="button" @click="confirmAndNext">
        下一步：进入页面设计
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { featureDesignMock } from '../data/featureDesignMock'
import ViewHeading from '../components/ViewHeading.vue'
import StepHandoffCard from '../components/StepHandoffCard.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['feature-confirm'])

const featureData = featureDesignMock
const activeFilter = ref('全部')

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

const dynamicModules = computed(() => {
  const domain = detectDomainLabel(requirementText.value)

  return featureData.modules.map((item) => {
    if (item.key === 'projectOverview') {
      return {
        ...item,
        name: `${domain.item}总览`,
        description: `为管理者提供${domain.item}进度、关键节点、风险异常和资源占用的一屏式总览。`,
        features: [
          `展示${domain.item}总体进度与完成率`,
          '展示关键节点状态',
          '展示延期任务和异常问题数量',
          `支持按${domain.item}和状态筛选风险事项`,
        ],
      }
    }

    if (item.key === 'scheduleTracking') {
      return {
        ...item,
        name: `${domain.item}任务跟踪`,
        description: `为执行人员提供${domain.item}计划任务、工序状态、延期标记和调整建议的操作入口。`,
        features: [
          `展示${domain.item}计划任务列表`,
          `支持按${domain.item}、区域、工序状态筛选`,
          '标记延期、阻塞和已完成任务',
          `展示${domain.item}计划调整建议`,
        ],
      }
    }

    if (item.key === 'issueTracking') {
      return {
        ...item,
        name: `${domain.item}异常反馈`,
        description: `支撑${domain.item}日常作业中的异常登记、责任分派、处理进展跟踪和状态更新。`,
        features: [
          `新增${domain.item}异常问题记录`,
          '设置责任人和处理时限',
          '更新异常处理状态',
          '查看异常问题处理历史',
        ],
      }
    }

    if (item.key === 'siteResourceBoard') {
      const resourceName = domain.item === '车辆' ? '车辆和司机' : '人员和设备'
      return {
        ...item,
        name: `${domain.item}现场资源看板`,
        description: `展示${resourceName}、作业面和关键资源占用情况，辅助现场调度。`,
        features: [
          '展示当日作业面',
          `展示${resourceName}占用`,
          '提示资源冲突',
          '查看资源使用明细',
        ],
      }
    }

    if (item.key === 'materialArrival') {
      return {
        ...item,
        name: `${domain.item}到货/就绪跟踪`,
        description: `跟踪关键${domain.item}状态，帮助执行人员判断任务是否具备开工条件。`,
        features: [
          `展示关键${domain.item}清单`,
          '展示到货、缺料和延期状态',
          '关联受影响任务',
          `提示${domain.item}风险`,
        ],
      }
    }

    return item
  })
})

const selectedKey = ref(dynamicModules.value[0].key)

watch(dynamicModules, (modules) => {
  if (!modules.some((m) => m.key === selectedKey.value)) {
    selectedKey.value = modules[0]?.key
  }
}, { immediate: true })

const allowedScenarioNames = computed(() => {
  const roles = props.projectContext.requirementAnalysis?.userRoles || []
  return roles.map((item) => item.name)
})

const filteredByScenario = computed(() => {
  if (!props.projectContext.selectedScenario) {
    return dynamicModules.value
  }

  const scenarioName = (props.projectContext.selectedScenario.name || '').toLowerCase()
  const scenarioRole = (props.projectContext.selectedScenario.pageMapping?.role || '').toLowerCase()

  return dynamicModules.value.filter((item) => {
    const itemScenario = (item.sourceScenario || '').toLowerCase()
    return (
      itemScenario === scenarioName ||
      itemScenario.includes(scenarioRole) ||
      scenarioName.includes(itemScenario) ||
      allowedScenarioNames.value.some((role) => itemScenario.includes(role.toLowerCase()))
    )
  })
})

const filteredModules = computed(() => {
  const source = filteredByScenario.value

  if (activeFilter.value === '全部') {
    return source
  }

  return source.filter((item) => item.priority === activeFilter.value)
})

const selectedModule = computed(() => {
  return (
    filteredModules.value.find((item) => item.key === selectedKey.value) ||
    filteredModules.value[0] ||
    dynamicModules.value[0]
  )
})

const hasRequirementContext = computed(() => {
  return Boolean(props.projectContext?.requirementAnalysis)
})

const requirementContextSummary = computed(() => {
  if (!hasRequirementContext.value) {
    return ''
  }

  const analysis = props.projectContext.requirementAnalysis
  const background = analysis.businessBackground || '暂无背景摘要'
  return `基于当前输入，项目背景可归纳为：${background}。功能设计会继续承接痛点、目标、角色和待确认问题。`
})

const requirementAnalysisSummary = computed(() => {
  if (!hasRequirementContext.value) {
    return '暂无需求分析结果'
  }

  const analysis = props.projectContext.requirementAnalysis
  const background = analysis.businessBackground || '暂无背景摘要'
  const painPoints = (analysis.painPoints || []).map((item) => item.description || item).filter(Boolean)
  const goals = (analysis.businessGoals || analysis.goals || []).map((item) => item.description || item).filter(Boolean)
  const roles = (analysis.userRoles || []).map((item) => `${item.name}：${item.responsibility}`).filter(Boolean)
  const questions = (analysis.questions || []).filter(Boolean)

  const summaryParts = [
    `业务背景：${background}`,
    `客户痛点：${painPoints.length ? painPoints.join('；') : '暂无客户痛点信息'}`,
    `业务目标：${goals.length ? goals.join('；') : '暂无业务目标信息'}`,
    `用户角色：${roles.length ? roles.join('；') : '暂无用户角色信息'}`,
    `待确认问题：${questions.length ? questions.join('；') : '暂无待确认问题'}`,
  ]

  return `需求分析已从客户原始输入中提炼出完整结构，供后续功能设计持续承接。\n${summaryParts.join('\n')}`
})

const painPointsPreview = computed(() => {
  if (!hasRequirementContext.value) {
    return '暂无客户痛点信息'
  }

  const painPoints = props.projectContext.requirementAnalysis.painPoints || []
  if (!painPoints.length) {
    return '暂无客户痛点信息'
  }

  return painPoints.map((item) => item.description || '').filter(Boolean).join('；')
})

const goalsPreview = computed(() => {
  if (!hasRequirementContext.value) {
    return '暂无业务目标信息'
  }

  const goals = props.projectContext.requirementAnalysis.goals || []
  if (!goals.length) {
    return '暂无业务目标信息'
  }

  return goals.map((item) => item.description || '').filter(Boolean).join('；')
})

const scenarioItems = computed(() => [
  {
    label: '角色',
    value: props.projectContext.selectedScenario?.pageMapping?.role || '暂无角色',
  },
  {
    label: '建议页面',
    value: props.projectContext.selectedScenario?.pageMapping?.page || '暂无建议页面',
  },
  {
    label: '场景说明',
    value: props.projectContext.selectedScenario?.description || '暂无场景说明',
  },
])

const requirementItems = computed(() => [
  {
    label: '客户痛点',
    value: painPointsPreview.value,
  },
  {
    label: '业务目标',
    value: goalsPreview.value,
  },
  {
    label: '用户角色',
    value: (props.projectContext.requirementAnalysis?.userRoles || [])
      .map((item) => `${item.name}：${item.responsibility}`)
      .filter(Boolean)
      .join('；') || '暂无用户角色信息',
  },
  {
    label: '待确认问题',
    value: props.projectContext.requirementAnalysis?.questions?.join('；') || '暂无待确认问题',
  },
])

const requirementAnalysisItems = computed(() => {
  if (!hasRequirementContext.value) {
    return []
  }

  const analysis = props.projectContext.requirementAnalysis
  const painPoints = (analysis.painPoints || []).map((item) => item.description || item).filter(Boolean)
  const goals = (analysis.businessGoals || analysis.goals || []).map((item) => item.description || item).filter(Boolean)
  const roles = (analysis.userRoles || []).map((item) => `${item.name}：${item.responsibility}`).filter(Boolean)
  const questions = (analysis.questions || []).filter(Boolean)

  return [
    {
      label: '业务背景',
      value: analysis.businessBackground || '暂无背景摘要',
    },
    {
      label: '客户痛点',
      value: painPoints.length ? painPoints.join('；') : '暂无客户痛点信息',
    },
    {
      label: '业务目标',
      value: goals.length ? goals.join('；') : '暂无业务目标信息',
    },
    {
      label: '用户角色',
      value: roles.length ? roles.join('；') : '暂无用户角色信息',
    },
    {
      label: '待确认问题',
      value: questions.length ? questions.join('；') : '暂无待确认问题',
    },
  ]
})

function setFilter(filter) {
  activeFilter.value = filter
}

watch(filteredModules, (modules) => {
  if (!modules.some((item) => item.key === selectedKey.value)) {
    selectedKey.value = modules[0]?.key || featureData.modules[0].key
  }
}, { immediate: true })

watch(
  () => props.projectContext.selectedScenario,
  () => {
    const matchedModule = filteredModules.value[0] || featureData.modules[0]
    if (matchedModule && selectedKey.value === featureData.modules[0].key) {
      selectedKey.value = matchedModule.key
    }
  },
  { immediate: true },
)

function confirmAndNext() {
  emit('feature-confirm', {
    module: selectedModule.value,
  })
}
</script>

<style scoped>
.feature-design-view {
  margin-top: 16px;
}

.feature-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 12px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.feature-toolbar button {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  background: #ffffff;
  color: #1e293b;
  font-weight: 800;
}

.feature-toolbar button.active {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}

.feature-layout {
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
}

.feature-panel,
.feature-detail,
.scope-summary {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.feature-panel,
.feature-detail {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-label,
.scope-summary span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.module-list {
  display: grid;
  gap: 10px;
}

.module-button {
  display: grid;
  gap: 8px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.module-button.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.priority-tag {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.module-button strong {
  color: #0f172a;
  font-size: 16px;
}

.module-button small,
.feature-detail p,
.scope-note p,
.scope-summary p {
  color: #526174;
  line-height: 1.65;
}

.feature-detail h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 26px;
}

.module-meta {
  display: grid;
  gap: 10px;
  margin: 18px 0;
}

.module-meta div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.module-meta dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.module-meta dd {
  margin: 0;
  color: #172033;
  line-height: 1.6;
  font-weight: 800;
}

.feature-points,
.scope-note {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.feature-points {
  margin-bottom: 12px;
}

.feature-points h4,
.scope-note h4 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 16px;
}

.feature-points ul {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.scope-note p {
  margin: 0;
}

.scope-summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
  padding: 18px;
}

.scope-summary div {
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.scope-summary strong {
  display: block;
  margin: 8px 0;
  color: #0f172a;
  font-size: 17px;
}

.scope-summary p {
  margin: 0;
}

.next-action {
  margin-top: 16px;
}

@media (max-width: 920px) {
  .feature-layout,
  .scope-summary {
    grid-template-columns: 1fr;
  }
}
</style>
