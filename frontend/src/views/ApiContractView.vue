<template>
  <section class="api-contract-view" aria-labelledby="api-contract-title">
    <ViewHeading
      eyebrow="API Contract"
      title="API 契约设计模拟工作台"
      title-id="api-contract-title"
      description="基于页面字段与交互设计结果，明确接口路径、请求参数、响应结构和错误码。当前仍为前端模拟数据。"
    />

    <div class="api-layout">
      <article class="api-list-panel">
        <div class="panel-heading">
          <span>API 列表</span>
          <strong>共 {{ apiData.contracts.length }} 个接口</strong>
        </div>

        <div class="api-list">
          <button
            v-for="item in apiData.contracts"
            :key="item.key"
            type="button"
            class="api-button"
            :class="{ active: item.key === selectedContract.key }"
            @click="selectedKey = item.key"
          >
            <span class="method-tag">{{ item.method }}</span>
            <strong>{{ item.name }}</strong>
            <small>{{ item.path }}</small>
          </button>
        </div>
      </article>

      <article class="api-detail-panel">
        <span class="detail-label">当前接口</span>
        <h3>{{ selectedContract.name }}</h3>
        <p>{{ selectedContract.goal }}</p>

        <dl class="api-meta">
          <div>
            <dt>请求方法</dt>
            <dd>{{ selectedContract.method }}</dd>
          </div>
          <div>
            <dt>接口路径</dt>
            <dd>{{ selectedContract.path }}</dd>
          </div>
          <div>
            <dt>来源页面</dt>
            <dd>{{ selectedContract.sourcePage }}</dd>
          </div>
          <div>
            <dt>前端触发</dt>
            <dd>{{ selectedContract.trigger }}</dd>
          </div>
        </dl>
      </article>
    </div>

    <div class="contract-grid">
      <article class="contract-card wide">
        <span>请求参数</span>
        <div class="param-row header">
          <strong>参数</strong>
          <strong>类型</strong>
          <strong>必填</strong>
          <strong>说明</strong>
        </div>
        <div v-for="param in selectedContract.requestParams" :key="param.name" class="param-row">
          <span>{{ param.name }}</span>
          <span>{{ param.type }}</span>
          <span>{{ param.required ? '是' : '否' }}</span>
          <span>{{ param.description }}</span>
        </div>
      </article>

      <article class="contract-card">
        <span>成功响应</span>
        <pre>{{ formatJson(selectedContract.successResponse) }}</pre>
      </article>

      <article class="contract-card">
        <span>失败响应</span>
        <pre>{{ formatJson(selectedContract.errorResponse) }}</pre>
      </article>

      <article class="contract-card wide">
        <span>错误码</span>
        <div class="error-code-list">
          <section v-for="item in selectedContract.errorCodes" :key="item.code" class="error-code-item">
            <strong>{{ item.code }}</strong>
            <p>{{ item.meaning }}</p>
            <small>{{ item.frontendAdvice }}</small>
          </section>
        </div>
      </article>
    </div>

    <section class="response-standard" aria-labelledby="response-standard-title">
      <div class="panel-heading">
        <span>统一响应格式</span>
        <strong id="response-standard-title">后续 FastAPI 接口都按这个结构返回</strong>
      </div>
      <dl>
        <div v-for="(value, key) in apiData.responseStandard" :key="key">
          <dt>{{ key }}</dt>
          <dd>{{ value }}</dd>
        </div>
      </dl>
    </section>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { apiContractMock } from '../data/apiContractMock'
import ViewHeading from '../components/ViewHeading.vue'

const apiData = apiContractMock
const selectedKey = ref(apiData.contracts[0].key)

const selectedContract = computed(() => {
  return apiData.contracts.find((item) => item.key === selectedKey.value) || apiData.contracts[0]
})

function formatJson(value) {
  return JSON.stringify(value, null, 2)
}
</script>

<style scoped>
.api-contract-view {
  margin-top: 16px;
}

.api-layout {
  display: grid;
  grid-template-columns: minmax(320px, 0.8fr) minmax(0, 1.2fr);
  gap: 16px;
}

.api-list-panel,
.api-detail-panel,
.contract-card,
.response-standard {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.api-list-panel,
.api-detail-panel,
.contract-card,
.response-standard {
  padding: 22px;
}

.panel-heading {
  display: grid;
  gap: 6px;
  margin-bottom: 16px;
}

.panel-heading span,
.detail-label,
.contract-card span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.panel-heading strong {
  color: #0f172a;
  font-size: 18px;
}

.api-list {
  display: grid;
  gap: 10px;
}

.api-button {
  display: grid;
  gap: 8px;
  width: 100%;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px;
  background: #f8fafc;
  text-align: left;
}

.api-button.active {
  border-color: #93c5fd;
  background: #eff6ff;
}

.method-tag {
  width: max-content;
  border-radius: 999px;
  padding: 4px 8px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 900;
}

.api-button strong {
  color: #0f172a;
  font-size: 16px;
}

.api-button small,
.api-detail-panel p,
.api-meta dd,
.error-code-item p,
.error-code-item small,
.response-standard dd {
  color: #526174;
  line-height: 1.65;
}

.api-detail-panel h3 {
  margin: 10px 0;
  color: #0f172a;
  font-size: 26px;
}

.api-meta,
.response-standard dl {
  display: grid;
  gap: 10px;
  margin: 18px 0 0;
}

.api-meta div,
.response-standard dl div {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.api-meta dt,
.response-standard dt {
  margin-bottom: 6px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

.api-meta dd,
.response-standard dd {
  margin: 0;
  color: #172033;
  font-weight: 800;
}

.contract-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.contract-card.wide {
  grid-column: 1 / -1;
}

.param-row {
  display: grid;
  grid-template-columns: 0.8fr 0.75fr 0.55fr minmax(0, 1.9fr);
  gap: 10px;
  border-top: 1px solid #e2e8f0;
  padding: 12px 0;
  color: #263244;
  line-height: 1.55;
}

.param-row.header {
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
  font-weight: 900;
}

pre {
  overflow-x: auto;
  margin: 14px 0 0;
  border-radius: 8px;
  padding: 14px;
  background: #0f172a;
  color: #e2e8f0;
  line-height: 1.55;
}

.error-code-list {
  display: grid;
  gap: 10px;
  margin-top: 14px;
}

.error-code-item {
  border-radius: 8px;
  padding: 12px;
  background: #f8fafc;
}

.error-code-item strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
}

.error-code-item p,
.error-code-item small {
  display: block;
  margin: 0 0 4px;
}

.response-standard {
  margin-top: 16px;
}

@media (max-width: 920px) {
  .api-layout,
  .contract-grid {
    grid-template-columns: 1fr;
  }

  .param-row {
    grid-template-columns: 1fr;
  }
}
</style>
