<template>
  <section class="sf-view"><ViewHeading eyebrow="P1 · 司机端" title="现场反馈" title-id="sf-title" description="到达作业点后确认到达，上传现场照片或备注。"/>
    <div class="sf-card">
      <div class="sf-arrived"><span>✅</span><div><strong>已到达</strong><small>{{ fb.jobSite }} · {{ fb.arrivedAt }}</small></div></div>
      <div class="sf-section"><span class="card-title">📷 现场照片</span>
        <div class="photo-grid"><div v-for="i in 4" :key="i" class="photo-slot" @click="addPhoto"><span v-if="fb.photos.length < i">+</span><span v-else>📷</span></div></div>
      </div>
      <div class="sf-section"><span class="card-title">📝 备注</span><textarea rows="3" placeholder="输入现场备注信息…" class="sf-textarea"></textarea></div>
      <div class="sf-actions"><button class="ghost-btn">暂存草稿</button><button class="primary-btn" @click="submit">确认到达并提交</button></div>
    </div>
  </section>
</template>
<script setup>import ViewHeading from '../components/ViewHeading.vue';import { siteFeedbackMock as fb } from '../data/remainingMocks'
function addPhoto(){alert('打开相机/相册（原型演示）')}
function submit(){alert('反馈已提交！')}
</script>
<style scoped>
.sf-view{margin-top:16px}.sf-card{border:1px solid #e2e8f0;border-radius:10px;background:#fff;overflow:hidden}
.sf-arrived{display:flex;align-items:center;gap:12px;padding:16px 20px;background:#f0fdf4;border-bottom:1px solid #bbf7d0}.sf-arrived span{font-size:28px}.sf-arrived strong{display:block;font-size:16px;color:#0f172a}.sf-arrived small{color:#64748b}
.sf-section{padding:14px 20px;border-bottom:1px solid #f1f5f9}.card-title{display:block;margin-bottom:10px;font-weight:800;font-size:13px;color:#0f172a}
.photo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.photo-slot{aspect-ratio:1;border:2px dashed #e2e8f0;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:24px;color:#94a3b8;cursor:pointer;background:#fafbfc}.photo-slot:hover{border-color:#93c5fd}
.sf-textarea{width:100%;padding:8px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;resize:vertical;outline:none;font-family:inherit}
.sf-actions{display:flex;gap:10px;justify-content:flex-end;padding:14px 20px;background:#fafbfc}
.primary-btn{padding:9px 20px;border:none;border-radius:8px;background:#1d4ed8;color:#fff;font-weight:800;cursor:pointer}.ghost-btn{padding:9px 18px;border:1px solid #e2e8f0;border-radius:8px;background:#fff;color:#475569;font-weight:700;cursor:pointer}
</style>
