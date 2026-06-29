<template>
  <section class="page-design-view" aria-labelledby="page-design-title">
    <ViewHeading
      eyebrow="Page Design"
      title="页面清单设计模拟工作台"
      title-id="page-design-title"
      description="基于功能模块设计结果，整理页面清单、页面区域、导航结构和 Vue 文件建议。当前仍为前端模拟数据。"
    />

    <div class="page-layout">
      <article class="page-list-panel">
        <div class="panel-heading">
          <span>页面清单</span>
          <strong>共 {{ pageData.pages.length }} 个页面</strong>
        </div>

        <div class="page-list">
          <button
            v-for="page in pageData.pages"
            :key="page.key"
            type="button"
            class="page-button"
            :class="{ active: page.key === selectedPage.key }"
            @click="selectedKey = page.key"
          >
            <span class="priority-tag">{{ page.priority }}</span>
            <strong>{{ page.name }}</strong>
            <small>{{ page.type }} / {{ page.vueFile }}</small>
          </button>
        </div>
      </article>

      <article class="page-detail-panel">
        <span class="detail-label">当前页面</span>
        <h3>{{ selectedPage.name }}</h3>
        <p>{{ selectedPage.goal }}</p>

        <dl class="page-meta">
          <div>
            <dt>页面类型</dt>
            <dd>{{ selectedPage.type }}</dd>
          </div>
          <div>
            <dt>Vue 文件</dt>
            <dd>{{ selectedPage.vueFile }}</dd>
          </div>
          <div>
            <dt>承载功能</dt>
            <dd>{{ selectedPage.features.join('、') }}</dd>
          </div>
        </dl>

        <section class="section-list" aria-label="页面区域">
          <h4>页面区域</h4>
          <ol>
            <li v-for="section in selectedPage.sections" :key="section">{{ section }}</li>
          </ol>
        </section>
      </article>
    </div>

    <div class="design-summary">
      <article class="summary-card">
        <span>导航结构</span>
        <ul>
          <li v-for="item in pageData.navigation" :key="item.target">
            <strong>{{ item.label }}</strong>
            <small>{{ item.target }}{{ item.default ? ' / 默认入口' : '' }}</small>
          </li>
        </ul>
      </article>

      <article class="summary-card">
        <span>文件结构建议</span>
        <dl>
          <div>
            <dt>views</dt>
            <dd>{{ pageData.fileStructure.views.join('、') }}</dd>
          </div>
          <div>
            <dt>components</dt>
            <dd>{{ pageData.fileStructure.components.join('、') }}</dd>
          </div>
          <div>
            <dt>data</dt>
            <dd>{{ pageData.fileStructure.data.join('、') }}</dd>
          </div>
        </dl>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { pageDesignMock } from '../data/pageDesignMock'
import ViewHeading from '../components/ViewHeading.vue'

const pageData = pageDesignMock
const selectedKey = ref(pageData.pages[0].key)

const selectedPage = computed(() => {
  return pageData.pages.find((item) => item.key === selectedKey.value) || pageData.pages[0]
})
</script>

<style scoped>
.page-design-view {
  margin-top: 16px;
}

.page-layout {
  display: grid;
  grid-template-columns: minmax(340px, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
}

.page-list-panel,
.page-detail-panel,
.summary-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.page-list-panel,
.page-detail-panel,
.summary-card {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-label,
.summary-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.page-list {
  display: grid;
  gap: 10px;
}

.page-button {
  display: grid;
  gap: 8px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.page-button.active {
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

.page-button strong {
  color: #0f172a;
  font-size: 16px;
}

.page-button small,
.page-detail-panel p,
.summary-card small,
.summary-card dd {
  color: #526174;
  line-height: 1.65;
}

.page-detail-panel h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 26px;
}

.page-meta {
  display: grid;
  gap: 10px;
  margin: 18px 0;
}

.page-meta div,
.summary-card dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.page-meta dt,
.summary-card dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.page-meta dd,
.summary-card dd {
  margin: 0;
  color: #172033;
  font-weight: 800;
}

.section-list {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.section-list h4 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 16px;
}

.section-list ol {
  display: grid;
  gap: 8px;
  margin: 0;
  padding-left: 20px;
  color: #263244;
  line-height: 1.65;
  font-weight: 700;
}

.design-summary {
  display: grid;
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
  gap: 16px;
  margin-top: 16px;
}

.summary-card ul {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
  padding: 0;
  list-style: none;
}

.summary-card li {
  display: grid;
  gap: 4px;
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.summary-card strong {
  color: #0f172a;
}

.summary-card dl {
  display: grid;
  gap: 10px;
  margin: 14px 0 0;
}

@media (max-width: 920px) {
  .page-layout,
  .design-summary {
    grid-template-columns: 1fr;
  }
}
</style>
