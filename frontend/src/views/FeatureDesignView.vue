<template>
  <section class="feature-design-view" aria-labelledby="feature-design-title">
    <ViewHeading
      eyebrow="Feature Design"
      title="功能模块设计模拟工作台"
      title-id="feature-design-title"
      description="基于场景识别结果，整理功能模块、功能点、优先级、页面建议和 API 方向。当前仍为前端模拟数据。"
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
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { featureDesignMock } from '../data/featureDesignMock'
import ViewHeading from '../components/ViewHeading.vue'

const featureData = featureDesignMock
const activeFilter = ref('全部')
const selectedKey = ref(featureData.modules[0].key)

const filteredModules = computed(() => {
  if (activeFilter.value === '全部') {
    return featureData.modules
  }

  return featureData.modules.filter((item) => item.priority === activeFilter.value)
})

const selectedModule = computed(() => {
  return (
    filteredModules.value.find((item) => item.key === selectedKey.value) ||
    filteredModules.value[0] ||
    featureData.modules[0]
  )
})

function setFilter(filter) {
  activeFilter.value = filter
}

watch(filteredModules, (modules) => {
  if (!modules.some((item) => item.key === selectedKey.value)) {
    selectedKey.value = modules[0]?.key || featureData.modules[0].key
  }
})
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

@media (max-width: 920px) {
  .feature-layout,
  .scope-summary {
    grid-template-columns: 1fr;
  }
}
</style>
