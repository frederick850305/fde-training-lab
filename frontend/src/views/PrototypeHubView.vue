<template>
  <section class="prototype-hub" aria-labelledby="hub-title">
    <ViewHeading
      eyebrow="Generated Prototypes"
      title="原型系统中心"
      title-id="hub-title"
      description="以下是由 FDE 方法链路生成的独立可运行原型系统。每个原型可单独启动，无需经过 FDE 工作流。"
    />

    <div class="hub-grid">
      <article
        v-for="proto in prototypeList"
        :key="proto.id"
        class="hub-card"
      >
        <div class="hub-card-header">
          <span class="hub-icon">{{ proto.icon }}</span>
          <div>
            <h3>{{ proto.name }}</h3>
            <small>{{ proto.description }}</small>
          </div>
        </div>
        <div class="hub-card-body">
          <div class="hub-meta">
            <span>
              <strong>{{ proto.pageCount }}</strong> 个页面
            </span>
            <span>
              <strong>{{ proto.priority }}</strong> 优先级
            </span>
            <span>{{ proto.generatedAt }}</span>
          </div>
          <div class="hub-tags">
            <span v-for="tag in proto.tags" :key="tag" class="hub-tag">{{ tag }}</span>
          </div>
        </div>
        <div class="hub-card-footer">
          <code class="hub-dir">prototypes/{{ proto.id }}/</code>
          <div class="hub-actions">
            <a
              v-if="proto.isRunning"
              :href="proto.url"
              target="_blank"
              class="primary-button small"
            >
              🚀 打开原型
            </a>
            <button
              v-else
              type="button"
              class="secondary-button small"
              @click="startPrototype(proto.id)"
            >
              启动原型
            </button>
            <span class="hub-copy" @click="copyCommand(proto.id)">
              📋 复制启动命令
            </span>
          </div>
        </div>
      </article>

      <!-- 空状态 -->
      <div v-if="!prototypeList.length" class="hub-empty">
        <span class="empty-icon">📦</span>
        <h3>暂无生成的原型系统</h3>
        <p>完成 01-07 步 FDE 方法链路后，生成的原型将自动出现在这里。</p>
      </div>
    </div>

    <!-- 快速入口提示 -->
    <div class="hub-quickstart">
      <span>💡 快速启动</span>
      <p>每个原型系统都是独立的 Vite + Vue3 项目，可直接在终端中启动：</p>
      <pre>cd prototypes/sea-industry-dispatch && npm run dev</pre>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import ViewHeading from '../components/ViewHeading.vue'

const props = defineProps({
  projectContext: {
    type: Object,
    required: true,
  },
  generatedPrototypes: {
    type: Array,
    default: () => [],
  },
})

const prototypeList = computed(() => {
  const staticList = [
    {
      id: 'sea-industry-dispatch',
      name: '海工生产调度原型',
      icon: '🏭',
      description: '现场调度地图监控、车辆管理、任务派发、异常告警',
      pageCount: 2,
      priority: 'P0/P1',
      tags: ['调度指挥', '地图监控', '任务管理', '告警处理'],
      generatedAt: '2026-07-02',
      url: 'http://127.0.0.1:5180',
      isRunning: true,
    },
  ]

  const dynamicList = (props.generatedPrototypes || []).map((gp) => ({
    ...gp,
    isRunning: false,
  }))

  return [...staticList, ...dynamicList]
})

function startPrototype(id) {
  window.open(`http://127.0.0.1:5180`, '_blank')
}

function copyCommand(id) {
  navigator.clipboard?.writeText(`cd prototypes/${id} && npm install && npm run dev`)
}
</script>

<style scoped>
.prototype-hub {
  margin-top: 16px;
}

.hub-grid {
  display: grid;
  gap: 16px;
}

.hub-card {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #ffffff;
  overflow: hidden;
  transition: box-shadow 0.15s;
}

.hub-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}

.hub-card-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px 18px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.hub-icon {
  font-size: 28px;
  flex-shrink: 0;
}

.hub-card-header h3 {
  margin: 0 0 4px;
  color: #0f172a;
  font-size: 16px;
}

.hub-card-header small {
  color: #64748b;
  font-size: 12px;
  line-height: 1.5;
}

.hub-card-body {
  padding: 12px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

.hub-meta {
  display: flex;
  gap: 14px;
  font-size: 12px;
  color: #64748b;
}

.hub-meta strong {
  color: #0f172a;
}

.hub-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.hub-tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  background: #eff6ff;
  color: #2563eb;
  font-size: 11px;
  font-weight: 700;
}

.hub-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  border-top: 1px solid #f8fafc;
  background: #fafbfc;
  flex-wrap: wrap;
  gap: 8px;
}

.hub-dir {
  background: #f1f5f9;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 11px;
  color: #475569;
}

.hub-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.primary-button.small,
.secondary-button.small {
  padding: 6px 14px;
  font-size: 13px;
  text-decoration: none;
}

.secondary-button.small {
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  font-weight: 700;
}

.hub-copy {
  font-size: 12px;
  color: #64748b;
  cursor: pointer;
  font-weight: 700;
}

.hub-copy:hover {
  color: #1d4ed8;
}

.hub-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 40px;
  border: 1px dashed #e2e8f0;
  border-radius: 10px;
  background: #fafbfc;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
}

.hub-empty h3 {
  margin: 12px 0 6px;
}

.hub-empty p {
  color: #94a3b8;
  font-size: 14px;
}

.hub-quickstart {
  margin-top: 20px;
  padding: 14px 18px;
  border: 1px solid #dbe3ef;
  border-radius: 10px;
  background: #f8fafc;
}

.hub-quickstart span {
  color: #2563eb;
  font-size: 13px;
  font-weight: 900;
}

.hub-quickstart p {
  margin: 6px 0 8px;
  color: #475569;
  font-size: 13px;
}
</style>
