<template>
  <section class="rr-view"><ViewHeading eyebrow="P1 · 门岗管理" title="放行记录查询" title-id="rr-title" description="按时间、车牌、类型检索放行记录，查看核验详情，支持导出。"/>
    <div class="filter"><input v-model="search" placeholder="搜索车牌号…" class="search"/><select v-model="actionFilter" class="sel"><option value="">全部操作</option><option>放行</option><option>拒绝</option></select></div>
    <table class="tbl"><thead><tr><th>时间</th><th>车牌</th><th>类型</th><th>核验结果</th><th>操作</th><th>操作员</th></tr></thead><tbody>
      <tr v-for="r in filteredRecords" :key="r.id"><td>{{ r.time }}</td><td><strong>{{ r.plate }}</strong></td><td>{{ r.type }}</td><td><span :class="r.checkResult==='通过'?'badge-pass':'badge-reject'">{{ r.checkResult }}</span></td><td><span :class="r.action==='放行'?'badge-pass':'badge-reject'">{{ r.action }}</span></td><td>{{ r.operator }}</td></tr>
    </tbody></table>
  </section>
</template>
<script setup>import {computed,ref} from 'vue';import ViewHeading from '../components/ViewHeading.vue';import {releaseRecordsMock}from '../data/remainingMocks'
const search=ref('');const actionFilter=ref('')
const filteredRecords=computed(()=>{let r=[...releaseRecordsMock];if(search.value)r=r.filter(x=>x.plate.includes(search.value));if(actionFilter.value)r=r.filter(x=>x.action===actionFilter.value);return r})
</script>
<style scoped>
.rr-view{margin-top:16px}.filter{display:flex;gap:10px;margin-bottom:12px}.search{padding:7px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;outline:none;flex:1}.sel{padding:7px 12px;border:1px solid #e2e8f0;border-radius:6px;font-size:13px;outline:none}
.tbl{width:100%;border-collapse:collapse;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;font-size:13px}.tbl th{padding:8px 12px;background:#f8fafc;color:#94a3b8;text-align:left;border-bottom:1px solid #e2e8f0}.tbl td{padding:8px 12px;border-bottom:1px solid #f8fafc;color:#475569}.badge-pass{display:inline-block;padding:2px 8px;border-radius:10px;background:#dcfce7;color:#16a34a;font-size:11px;font-weight:800}.badge-reject{display:inline-block;padding:2px 8px;border-radius:10px;background:#fee2e2;color:#dc2626;font-size:11px;font-weight:800}
</style>
