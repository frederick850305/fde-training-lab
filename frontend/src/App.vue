<template>
  <main class="app-shell">
    <header class="topbar">
      <div>
        <span class="brand-mark">FDE</span>
        <span class="brand-name">Prototype Factory</span>
      </div>
      <span class="stage-badge">第二阶段 · Vue3 Web 原型</span>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">VSCode + Codex/Copilot + Vue3 + FastAPI</p>
        <h1>把客户需求快速变成可演示的业务原型</h1>
        <p class="subtitle">
          这个工作台用于沉淀一套 AI 原型工厂方法：先梳理需求，再设计功能、页面和 API 契约，最后生成 Vue3 前端样例并联调 FastAPI。
        </p>
        <div class="hero-actions" aria-label="主要操作">
          <button class="primary-button" type="button">进入客户需求分析</button>
          <button class="secondary-button" type="button">查看 Prompt 模板</button>
        </div>
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

    <section class="section-block" aria-labelledby="capability-title">
      <div class="section-heading">
        <p class="eyebrow">Core Capabilities</p>
        <h2 id="capability-title">原型工作台能力入口</h2>
      </div>
      <div class="capability-grid">
        <article
          v-for="item in capabilities"
          :key="item.title"
          class="capability-card"
        >
          <span class="card-tag">{{ item.stage }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <button type="button">{{ item.action }}</button>
        </article>
      </div>
    </section>

    <section class="two-column">
      <article class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Prototype Flow</p>
          <h2>从需求到原型的标准路径</h2>
        </div>
        <ol class="process-list">
          <li v-for="step in processSteps" :key="step">
            <span>{{ step }}</span>
          </li>
        </ol>
      </article>

      <article class="section-block">
        <div class="section-heading">
          <p class="eyebrow">Training Progress</p>
          <h2>第二阶段练习进展</h2>
        </div>
        <ul class="progress-list">
          <li v-for="item in progressItems" :key="item.name">
            <span class="progress-status" :class="item.statusClass">{{ item.status }}</span>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>

<script setup>
const capabilities = [
  {
    stage: 'P0',
    title: '客户需求分析',
    description: '输入需求文件路径，调用 FastAPI 生成结构化需求分析报告。',
    action: '即将生成页面',
  },
  {
    stage: 'P1',
    title: '后端健康检查',
    description: '检查 FastAPI 服务状态，为前后端联调提供第一道确认。',
    action: '待联调',
  },
  {
    stage: 'P1',
    title: 'Prompt 模板资产',
    description: '沉淀需求拆解、页面生成、API 联调和排错 Prompt。',
    action: '查看模板',
  },
  {
    stage: 'P2',
    title: '故障案例与 Excel 摘要',
    description: '后续复用第一阶段能力，扩展更多 FDE 工具页面。',
    action: '后续扩展',
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
  { name: '2-9：工作台首页生成', status: '当前', statusClass: 'active' },
  { name: '2-10：客户需求分析页生成', status: '下一步', statusClass: 'next' },
]
</script>
