<template>
  <div>
    <section class="kpi-grid" style="margin-bottom:18px">
      <KpiCard label="资源总数" :value="resources.length" tone="blue" sub="6 大类" />
      <KpiCard label="超负荷资源" :value="overload.length" tone="red" sub="需重点管控" />
      <KpiCard label="严重超负荷" :value="resources.filter(r => r.status === '严重超负荷').length" tone="violet" sub="关键瓶颈" />
      <KpiCard label="资源冲突" :value="resources.filter(r => r.status === '冲突').length" tone="amber" sub="需协调" />
    </section>

    <div v-for="cat in categories" :key="cat" class="panel" style="margin-bottom:16px">
      <div class="panel-head"><h3>{{ cat }} 类资源</h3><span class="sub">{{ byCat(cat).length }} 项</span></div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>资源</th><th>数量</th><th>日能力</th><th>当前负荷</th><th>负荷率</th><th>状态</th></tr></thead>
          <tbody>
            <tr v-for="r in byCat(cat)" :key="r.id">
              <td><strong>{{ r.name }}</strong></td>
              <td>{{ r.qty }} {{ r.unit }}</td>
              <td>{{ r.dailyCapacity }}</td>
              <td>
                <div class="mini-bar"><div class="mini-fill" :class="loadClass(r.load)" :style="{ width: Math.min(r.load, 160) / 160 * 100 + '%' }"></div></div>
              </td>
              <td :class="r.load > 100 ? 'hot' : ''"><strong>{{ r.load }}%</strong></td>
              <td><StatusTag :status="r.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KpiCard from '../components/KpiCard.vue'
import StatusTag from '../components/StatusTag.vue'
import { resources, resourceCategories } from '../mock/index.js'

const categories = resourceCategories
const overload = computed(() => resources.filter((r) => r.load > 100))
function byCat(cat) {
  return resources.filter((r) => r.category === cat)
}
function loadClass(load) {
  return load > 130 ? 'red' : load > 100 ? 'orange' : 'blue'
}
</script>

<style scoped>
.mini-bar { height: 10px; width: 120px; background: #eef2f6; border-radius: 999px; overflow: hidden; }
.mini-fill { height: 100%; border-radius: 999px; }
.mini-fill.blue { background: #2f7fe0; } .mini-fill.orange { background: #e8853a; } .mini-fill.red { background: #d64b54; }
.hot { color: #d64b54; }
</style>
