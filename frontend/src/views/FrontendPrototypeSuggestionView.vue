<template>
  <section class="prototype-suggestion-view" aria-labelledby="prototype-suggestion-title">
    <ViewHeading
      eyebrow="Frontend Prototype"
      title="前端原型建议模拟工作台"
      title-id="prototype-suggestion-title"
      description="汇总页面、组件、mock 数据、生成顺序和代码生成 Prompt，为后续 Codex/Copilot 生成 Vue3 原型做准备。"
    />

    <div class="suggestion-tabs" aria-label="建议类型切换">
      <button
        v-for="item in suggestionTabs"
        :key="item.key"
        type="button"
        :class="{ active: item.key === activeTab }"
        @click="activeTab = item.key"
      >
        {{ item.label }}
      </button>
    </div>

    <section class="suggestion-panel">
      <template v-if="activeTab === 'views'">
        <div class="panel-heading">
          <span>Vue 页面文件建议</span>
          <strong>先生成 P0 核心页面</strong>
        </div>
        <div class="suggestion-list">
          <article v-for="item in suggestionData.viewFiles" :key="item.file" class="suggestion-card">
            <h3>{{ item.file }}</h3>
            <p>{{ item.responsibility }}</p>
            <small>{{ item.source }}</small>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'components'">
        <div class="panel-heading">
          <span>组件拆分建议</span>
          <strong>先抽通用组件，再生成页面</strong>
        </div>
        <div class="suggestion-list">
          <article v-for="item in suggestionData.componentFiles" :key="item.file" class="suggestion-card">
            <h3>{{ item.file }}</h3>
            <p>{{ item.responsibility }}</p>
            <small>复用页面：{{ item.reusedBy.join('、') }}</small>
          </article>
        </div>
      </template>

      <template v-else-if="activeTab === 'mockData'">
        <div class="panel-heading">
          <span>Mock 数据建议</span>
          <strong>先让前端原型独立跑起来</strong>
        </div>
        <div class="suggestion-list">
          <article v-for="item in suggestionData.mockDataFiles" :key="item.file" class="suggestion-card">
            <h3>{{ item.file }}</h3>
            <p>{{ item.content }}</p>
            <small>服务对象：{{ item.usedBy.join('、') }}</small>
          </article>
        </div>
      </template>

      <template v-else>
        <div class="panel-heading">
          <span>生成顺序建议</span>
          <strong>降低一次性生成失败概率</strong>
        </div>
        <ol class="generation-list">
          <li v-for="item in suggestionData.generationSteps" :key="item.step">
            <span>{{ item.step }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </div>
          </li>
        </ol>
      </template>
    </section>

    <section class="prompt-panel" aria-labelledby="prototype-prompt-title">
      <div class="panel-heading">
        <span>Codex/Copilot Prompt</span>
        <strong id="prototype-prompt-title">后续可复制给 AI 生成前端原型</strong>
      </div>
      <pre>{{ suggestionData.prompt }}</pre>
    </section>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { frontendPrototypeSuggestionMock } from '../data/frontendPrototypeSuggestionMock'
import ViewHeading from '../components/ViewHeading.vue'

const suggestionData = frontendPrototypeSuggestionMock
const activeTab = ref('views')

const suggestionTabs = [
  { key: 'views', label: '页面文件' },
  { key: 'components', label: '组件拆分' },
  { key: 'mockData', label: 'Mock 数据' },
  { key: 'steps', label: '生成顺序' },
]
</script>

<style scoped>
.prototype-suggestion-view {
  margin-top: 16px;
}

.suggestion-tabs {
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

.suggestion-tabs button {
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 14px;
  background: #ffffff;
  color: #1e293b;
  font-weight: 800;
}

.suggestion-tabs button.active {
  border-color: #1d4ed8;
  background: #1d4ed8;
  color: #ffffff;
}

.suggestion-panel,
.prompt-panel {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 22px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.suggestion-list {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.suggestion-card {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  background: #f8fafc;
}

.suggestion-card h3 {
  margin: 0 0 10px;
  color: #0f172a;
  font-size: 18px;
}

.suggestion-card p {
  margin: 0 0 10px;
  color: #526174;
  line-height: 1.65;
}

.suggestion-card small {
  color: #2563eb;
  line-height: 1.55;
  font-weight: 800;
}

.generation-list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.generation-list li {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
}

.generation-list span {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-weight: 900;
}

.generation-list strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
}

.generation-list p {
  margin: 0;
  color: #526174;
  line-height: 1.65;
}

.prompt-panel {
  margin-top: 16px;
}

pre {
  overflow-x: auto;
  margin: 0;
  border-radius: 8px;
  padding: 16px;
  background: #0f172a;
  color: #e2e8f0;
  line-height: 1.65;
  white-space: pre-wrap;
}

@media (max-width: 920px) {
  .suggestion-list {
    grid-template-columns: 1fr;
  }
}
</style>
