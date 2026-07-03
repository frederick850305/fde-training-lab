<template>
  <section class="prototype-center" aria-labelledby="prototype-center-title">
    <ViewHeading
      eyebrow="Prototype Center"
      title="原型中心"
      title-id="prototype-center-title"
      description="选择已生成的原型系统，首次启动会安装依赖，随后启动本地服务并访问运行中的原型。"
    />

    <p v-if="statusMessage" class="status-msg" :class="{ err: statusMessage.includes('失败') || statusMessage.includes('请先') }">{{ statusMessage }}</p>

    <div class="center-actions">
      <button type="button" class="secondary-btn" :disabled="isLoading" @click="loadProjects">
        {{ isLoading ? '刷新中...' : '刷新列表' }}
      </button>
    </div>

    <div v-if="!projects.length" class="empty-panel">
      <strong>还没有可访问的原型系统</strong>
      <p>请先完成「生成原型」，系统会写入 prototypes/ 目录。</p>
    </div>

    <div v-else class="project-grid">
      <article v-for="project in projects" :key="project.slug" class="project-card">
        <div>
          <h3>{{ project.name }}</h3>
          <p>{{ project.output_dir }}</p>
          <small>{{ project.file_count }} 个文件 · {{ project.has_package ? '可启动' : '缺少 package.json' }}</small>
        </div>
        <div class="project-actions">
          <a v-if="project.url" class="open-link" :href="project.url" target="_blank" rel="noreferrer">访问原型</a>
          <button type="button" class="primary-btn" :disabled="isStarting === project.slug || !project.has_package" @click="startProject(project)">
            {{ isStarting === project.slug ? '启动中...' : project.running ? '重新启动' : '启动服务' }}
          </button>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001'

const projects = ref([])
const isLoading = ref(false)
const isStarting = ref('')
const statusMessage = ref('')

async function loadProjects() {
  isLoading.value = true
  statusMessage.value = ''
  try {
    const response = await fetch(`${API_BASE_URL}/prototype-projects`)
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.detail || `读取失败：${response.status}`)
    projects.value = payload.projects || []
  } catch (error) {
    statusMessage.value = `读取原型项目失败：${error.message || error}`
  } finally {
    isLoading.value = false
  }
}

async function startProject(project) {
  isStarting.value = project.slug
  statusMessage.value = `正在启动 ${project.name} ...`
  try {
    const response = await fetch(`${API_BASE_URL}/prototype-projects/${encodeURIComponent(project.slug)}/dev-server`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ auto_install: true, restart: Boolean(project.running) }),
    })
    const payload = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(payload.detail || `启动失败：${response.status}`)
    statusMessage.value = `已启动 ${project.name}：${payload.url}`
    await loadProjects()
    window.open(payload.url, '_blank', 'noreferrer')
  } catch (error) {
    statusMessage.value = `启动失败：${error.message || error}`
  } finally {
    isStarting.value = ''
  }
}

onMounted(loadProjects)
</script>

<style scoped>
.prototype-center {
  display: grid;
  gap: 16px;
}

.center-actions {
  display: flex;
  justify-content: flex-end;
}

.status-msg {
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #eff6ff;
  color: #1d4ed8;
  font-size: 13px;
  font-weight: 800;
}

.status-msg.err {
  background: #fef2f2;
  color: #dc2626;
}

.empty-panel,
.project-card {
  border: 1px solid #dbe3ef;
  border-radius: 8px;
  padding: 18px;
  background: #ffffff;
  box-shadow: 0 16px 40px rgb(15 23 42 / 0.06);
}

.empty-panel {
  color: #64748b;
}

.empty-panel strong {
  display: block;
  margin-bottom: 6px;
  color: #0f172a;
}

.empty-panel p {
  margin: 0;
}

.project-grid {
  display: grid;
  gap: 12px;
}

.project-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.project-card h3 {
  margin: 0 0 6px;
  color: #0f172a;
  font-size: 18px;
}

.project-card p {
  margin: 0 0 6px;
  color: #64748b;
  font-size: 13px;
}

.project-card small {
  color: #94a3b8;
  font-weight: 700;
}

.project-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.primary-btn,
.secondary-btn,
.open-link {
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 13px;
  font-weight: 900;
  text-decoration: none;
}

.primary-btn {
  border: none;
  background: #2563eb;
  color: #ffffff;
}

.secondary-btn,
.open-link {
  border: 1px solid #cbd5e1;
  background: #ffffff;
  color: #1d4ed8;
}

.primary-btn:disabled,
.secondary-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 760px) {
  .project-card {
    align-items: stretch;
    flex-direction: column;
  }

  .project-actions {
    justify-content: flex-start;
  }
}
</style>
