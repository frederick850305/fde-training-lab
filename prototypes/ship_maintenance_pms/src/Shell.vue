<template>
  <div class="app-shell">
    <aside class="side-nav">
      <div class="brand">
        <span class="brand-mark">PMS</span>
        <div>
          <strong>{{ data.projectName }}</strong>
          <small>{{ data.customerName }} 船舶维护平台</small>
        </div>
      </div>

      <label class="role-picker">
        <span>当前业务角色</span>
        <select v-model="currentRoleKey" @change="resetRoute">
          <option v-for="role in data.roles" :key="role.key" :value="role.key">{{ role.label }}</option>
        </select>
        <em>{{ currentRole.user }}</em>
      </label>

      <div class="nav-scroll">
        <section v-for="group in visibleGroups" :key="group.key" class="nav-group">
          <button class="nav-group-title" type="button" @click="toggleGroup(group.key)">
            <span>{{ group.title }}</span>
            <b>{{ expandedGroups.has(group.key) ? '-' : '+' }}</b>
          </button>
          <div v-if="expandedGroups.has(group.key)" class="route-list">
            <button
              v-for="page in pagesOf(group)"
              :key="page.key"
              class="route-item"
              :class="{ active: page.key === currentPageKey }"
              type="button"
              @click="currentPageKey = page.key"
            >
              <span>{{ page.title }}</span>
              <small>{{ page.priority }}</small>
            </button>
          </div>
        </section>
      </div>
    </aside>

    <main class="workspace">
      <component :is="currentComponent" />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { pageComponents } from './pages/index.js'
import { pages, prototypeData as data } from './data/prototypeData.js'

const currentRoleKey = ref('shore_engineer')
const currentPageKey = ref('MaintenancePlanWorkbench')
const expandedGroups = ref(new Set(['maintenance', 'voyage', 'workorder']))

const currentRole = computed(() => data.roles.find(role => role.key === currentRoleKey.value) || data.roles[0])
const visibleGroups = computed(() => data.groups.filter(group => group.roles.includes(currentRoleKey.value)))
const currentComponent = computed(() => pageComponents[currentPageKey.value] || pageComponents.MaintenancePlanWorkbench)

function pagesOf(group) {
  return pages.filter(page => page.groupKey === group.key)
}

function resetRoute() {
  const firstGroup = visibleGroups.value[0]
  const firstPage = firstGroup ? pagesOf(firstGroup)[0] : pages[0]
  currentPageKey.value = firstPage.key
  expandedGroups.value = new Set(visibleGroups.value.slice(0, 3).map(group => group.key))
}

function toggleGroup(key) {
  const next = new Set(expandedGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  expandedGroups.value = next
}
</script>

<style scoped>
.app-shell { height: 100vh; display: grid; grid-template-columns: 292px minmax(0, 1fr); overflow: hidden; }
.side-nav { min-height: 0; background: #10213d; color: #d9e5f2; padding: 18px 14px; display: flex; flex-direction: column; gap: 16px; }
.brand { display: flex; align-items: center; gap: 12px; padding: 4px 4px 10px; }
.brand-mark { width: 48px; height: 48px; border-radius: 8px; display: grid; place-items: center; background: #1e6fd9; color: #fff; font-weight: 900; }
.brand strong { display: block; color: #fff; font-size: 18px; letter-spacing: 0; }
.brand small { display: block; margin-top: 4px; color: #9cb0c8; font-size: 12px; }
.role-picker { display: grid; gap: 8px; padding: 12px; border: 1px solid rgba(216, 226, 239, .18); border-radius: 8px; background: rgba(255,255,255,.06); }
.role-picker span { font-size: 12px; color: #9cb0c8; font-weight: 800; }
.role-picker select { width: 100%; border: 1px solid rgba(216, 226, 239, .25); border-radius: 7px; padding: 9px 10px; color: #fff; background: #142a4c; }
.role-picker em { color: #bdd0e4; font-size: 12px; font-style: normal; }
.nav-scroll { min-height: 0; overflow-y: auto; display: grid; align-content: start; gap: 8px; padding-right: 2px; }
.nav-group { display: grid; gap: 4px; }
.nav-group-title { width: 100%; min-height: 38px; border: 0; border-radius: 8px; padding: 9px 10px; color: #d9e5f2; background: transparent; display: flex; align-items: center; justify-content: space-between; text-align: left; }
.nav-group-title:hover { background: rgba(255,255,255,.08); }
.nav-group-title span { min-width: 0; font-weight: 800; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.nav-group-title b { color: #86a1bf; }
.route-list { display: grid; gap: 2px; padding-left: 18px; }
.route-item { border: 0; border-radius: 7px; padding: 8px 9px; color: #a9bad0; background: transparent; display: flex; align-items: center; justify-content: space-between; gap: 8px; text-align: left; }
.route-item span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.route-item small { color: #89a2bd; font-size: 11px; }
.route-item:hover, .route-item.active { background: rgba(54, 133, 230, .23); color: #fff; }
.workspace { min-width: 0; min-height: 0; overflow-y: auto; padding: 22px 26px 34px; background: #eef3f8; }
@media (max-width: 920px) {
  .app-shell { grid-template-columns: 1fr; }
  .side-nav { max-height: 42vh; }
  .workspace { padding: 16px; }
}
</style>
