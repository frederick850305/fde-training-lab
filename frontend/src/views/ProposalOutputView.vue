<template>
  <section class="proposal-output" aria-labelledby="proposal-title">
    <ViewHeading
      eyebrow="Solution Proposal"
      title="方案输出"
      title-id="proposal-title"
      description="将需求拆解、场景设计、交互API、前端原型方案及系统建设方案打包，供客户评审和项目交付。"
    />

    <div class="proposal-layout">
      <!-- 文件清单 -->
      <div class="file-panel">
        <h3>📄 方案文件清单</h3>
        <div class="file-list">
          <div v-for="file in fileList" :key="file.key" class="file-item" :class="{ missing: !file.exists }">
            <span class="file-icon">{{ file.exists ? '✅' : '⚠️' }}</span>
            <div class="file-info">
              <strong>{{ file.name }}</strong>
              <small>{{ file.description }}</small>
              <small v-if="!file.exists" class="missing-hint">尚未生成，请先完成对应步骤</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 操作面板 -->
      <div class="action-panel">
        <h3>📦 打包下载</h3>
        <p>将以下文件打包为一个 zip，保存到 <code>prototypes/{{ projectName }}/</code> 目录：</p>

        <ul class="package-list">
          <li v-for="file in fileList.filter(f => f.exists)" :key="file.key">
            <span>📋</span> {{ file.name }}
          </li>
          <li>
            <span>📋</span> generate_solution_word.md（系统建设方案模板）
          </li>
        </ul>

        <button
          class="package-btn"
          type="button"
          :disabled="isPackaging || !hasAnyFile"
          @click="createPackage"
        >
          {{ isPackaging ? '打包中...' : '📦 打包方案文件' }}
        </button>

        <div v-if="packageResult" class="result-box" :class="{ error: packageResult.error }">
          <template v-if="packageResult.error">
            <p class="err-msg">❌ {{ packageResult.error }}</p>
          </template>
          <template v-else>
            <p class="success-msg">✅ 打包完成！</p>
            <p><strong>文件名：</strong>{{ packageResult.zip_filename }}</p>
            <p><strong>保存路径：</strong><code>{{ packageResult.zip_path }}</code></p>
            <p><strong>包含文件：</strong>{{ packageResult.included_files?.length || 0 }} 个</p>
            <ul class="included-list">
              <li v-for="name in packageResult.included_files" :key="name">{{ name }}</li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const isPackaging = ref(false)
const packageResult = ref(null)

const projectName = computed(() => {
  return props.projectContext?.projectName || '未命名项目'
})

const fileList = computed(() => {
  const stepResults = props.projectContext?.stepResults || {}
  return [
    {
      key: 'requirement',
      name: 'requirement.md',
      description: '01 需求拆解：业务背景、痛点、目标、角色',
      exists: !!stepResults.requirement,
    },
    {
      key: 'scenarioPageDesign',
      name: 'scenariopagedesign.md',
      description: '02 场景→页面：角色、场景、功能模块、页面清单',
      exists: !!stepResults.scenarioPageDesign,
    },
    {
      key: 'interactionApi',
      name: 'interactionapi.md',
      description: '03 交互与API：字段、按钮、状态、API 契约',
      exists: !!stepResults.interactionApi,
    },
    {
      key: 'prototype',
      name: 'prototype.md',
      description: '04 前端原型方案：页面规格、API映射、导航、组件、Mock',
      exists: !!stepResults.prototype,
    },
  ]
})

const hasAnyFile = computed(() => fileList.value.some(f => f.exists))

async function createPackage() {
  isPackaging.value = true
  packageResult.value = null

  try {
    const response = await fetch(`${API_BASE_URL}/method-files/solution-package`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const payload = await response.json().catch(() => ({}))
    if (!response.ok) {
      throw new Error(payload.detail || `打包失败（${response.status}）`)
    }

    packageResult.value = payload
  } catch (e) {
    packageResult.value = {
      error: e.message || '打包失败，请确认 FastAPI 后端已启动（bash scripts/start_api.sh）',
    }
  } finally {
    isPackaging.value = false
  }
}

onMounted(() => {
  packageResult.value = null
})
</script>

<style scoped>
.proposal-output {
  margin-top: 16px;
}

.proposal-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.file-panel,
.action-panel {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.file-panel h3,
.action-panel h3 {
  margin: 0 0 12px;
  font-size: 16px;
}

.file-list {
  display: grid;
  gap: 12px;
}

.file-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.file-item.missing {
  border-color: #fecaca;
  background: #fef2f2;
}

.file-icon {
  font-size: 18px;
  margin-top: 2px;
}

.file-info {
  display: grid;
  gap: 4px;
}

.file-info strong {
  font-size: 13px;
  color: #1e293b;
}

.file-info small {
  font-size: 12px;
  color: #64748b;
}

.missing-hint {
  color: #c62828 !important;
  font-weight: 600;
}

.action-panel p {
  color: #64748b;
  font-size: 13px;
  margin: 0 0 12px;
}

.action-panel code {
  background: #f1f5f9;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.package-list {
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 6px;
}

.package-list li {
  font-size: 13px;
  color: #475569;
}

.package-btn {
  display: block;
  width: 100%;
  padding: 12px;
  background: #1d4ed8;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 800;
  cursor: pointer;
}

.package-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.result-box {
  margin-top: 16px;
  padding: 14px;
  border-radius: 10px;
  background: #f0fdf4;
  border: 1px solid #86efac;
}

.result-box p {
  margin: 0 0 6px;
  font-size: 13px;
  color: #166534;
}

.result-box error {
  background: #fef2f2;
  border-color: #fecaca;
}

.result-box code {
  background: #dcfce7;
}

.err-msg {
  color: #c62828 !important;
  font-weight: 700;
}

.success-msg {
  font-weight: 800;
  font-size: 14px !important;
}

.included-list {
  margin: 6px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 2px;
}

.included-list li {
  font-size: 12px;
  color: #166534;
}
</style>
