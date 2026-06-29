<template>
  <section class="interaction-view" aria-labelledby="interaction-title">
    <ViewHeading
      eyebrow="Page Interaction"
      title="页面字段与交互设计模拟工作台"
      title-id="interaction-title"
      description="基于页面清单设计结果，继续细化字段、按钮、校验规则和页面状态。当前仍为前端模拟数据。"
    />

    <div class="interaction-layout">
      <article class="page-selector">
        <div class="panel-heading">
          <span>页面选择</span>
          <strong>选择一个页面查看交互设计</strong>
        </div>

        <div class="page-options">
          <button
            v-for="page in interactionData.pages"
            :key="page.key"
            type="button"
            class="page-option"
            :class="{ active: page.key === selectedPage.key }"
            @click="selectedKey = page.key"
          >
            <strong>{{ page.name }}</strong>
            <small>{{ page.vueFile }}</small>
          </button>
        </div>
      </article>

      <article class="interaction-detail">
        <span class="detail-label">当前页面</span>
        <h3>{{ selectedPage.name }}</h3>
        <p>{{ selectedPage.vueFile }}</p>

        <section class="field-table" aria-label="字段设计">
          <h4>字段设计</h4>
          <div class="field-row header">
            <span>字段</span>
            <span>类型</span>
            <span>必填</span>
            <span>说明</span>
          </div>
          <div v-for="field in selectedPage.fields" :key="field.name" class="field-row">
            <span>{{ field.label }}</span>
            <span>{{ field.type }}</span>
            <span>{{ field.required ? '是' : '否' }}</span>
            <span>{{ field.description }}</span>
          </div>
        </section>
      </article>
    </div>

    <div class="interaction-grid">
      <article class="interaction-card">
        <span>按钮与动作</span>
        <div class="action-list">
          <section v-for="action in selectedPage.actions" :key="action.label" class="action-item">
            <h4>{{ action.label }}</h4>
            <p><strong>触发：</strong>{{ action.trigger }}</p>
            <p><strong>反馈：</strong>{{ action.feedback }}</p>
          </section>
        </div>
      </article>

      <article class="interaction-card">
        <span>校验规则</span>
        <ul>
          <li v-for="rule in selectedPage.validations" :key="rule">{{ rule }}</li>
        </ul>
      </article>

      <article class="interaction-card">
        <span>页面状态</span>
        <dl>
          <div v-for="(value, key) in selectedPage.states" :key="key">
            <dt>{{ stateLabels[key] || key }}</dt>
            <dd>{{ value }}</dd>
          </div>
        </dl>
      </article>
    </div>

    <section class="common-rules" aria-labelledby="common-rules-title">
      <div class="panel-heading">
        <span>通用交互规范</span>
        <strong id="common-rules-title">后续页面生成都要遵守</strong>
      </div>
      <ul>
        <li v-for="rule in interactionData.commonRules" :key="rule">{{ rule }}</li>
      </ul>
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { pageInteractionMock } from '../data/pageInteractionMock'
import ViewHeading from '../components/ViewHeading.vue'

const interactionData = pageInteractionMock
const selectedKey = ref(interactionData.pages[0].key)

const stateLabels = {
  empty: '空状态',
  loading: '加载中',
  success: '成功',
  error: '失败',
}

const selectedPage = computed(() => {
  return (
    interactionData.pages.find((item) => item.key === selectedKey.value) ||
    interactionData.pages[0]
  )
})
</script>

<style scoped>
.interaction-view {
  margin-top: 16px;
}

.interaction-layout {
  display: grid;
  grid-template-columns: minmax(300px, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;
}

.page-selector,
.interaction-detail,
.interaction-card,
.common-rules {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.page-selector,
.interaction-detail,
.interaction-card,
.common-rules {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-label,
.interaction-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.page-options {
  display: grid;
  gap: 10px;
}

.page-option {
  display: grid;
  gap: 6px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.page-option.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.page-option strong {
  color: #0f172a;
  font-size: 16px;
}

.page-option small,
.interaction-detail p,
.action-item p,
.interaction-card dd {
  color: #526174;
  line-height: 1.65;
}

.interaction-detail h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 26px;
}

.field-table {
  margin-top: 18px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.field-table h4 {
  margin: 0;
  padding: 14px;
  background: #f8fafc;
  color: #0f172a;
}

.field-row {
  display: grid;
  grid-template-columns: 0.75fr 0.75fr 0.55fr minmax(0, 1.7fr);
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding: 12px 14px;
  color: #263244;
  line-height: 1.55;
}

.field-row.header {
  background: #f8fafc;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.interaction-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.8fr) minmax(0, 1.1fr);
  gap: 16px;
  margin-top: 16px;
}

.action-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.action-item {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.action-item h4 {
  margin: 0 0 8px;
  color: #0f172a;
}

.action-item p {
  margin: 0 0 6px;
}

.interaction-card ul,
.common-rules ul {
  display: grid;
  gap: 9px;
  margin: 14px 0 0;
  padding-left: 20px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.interaction-card dl {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
}

.interaction-card dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.interaction-card dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.interaction-card dd {
  margin: 0;
}

.common-rules {
  margin-top: 16px;
}

@media (max-width: 920px) {
  .interaction-layout,
  .interaction-grid {
    grid-template-columns: 1fr;
  }

  .field-row {
    grid-template-columns: 1fr;
  }
}
</style>
