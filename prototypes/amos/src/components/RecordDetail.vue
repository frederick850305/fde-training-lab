<template>
  <div class="record-detail">
    <div class="tab-row">
      <div
        v-for="t in tabs"
        :key="t.id"
        class="tab"
        :class="{ active: active === t.id }"
        @click="active = t.id"
      >{{ t.label }}</div>
    </div>
    <div class="tab-body" style="border-top:none">
      <div v-for="t in tabs" v-show="active === t.id" :key="t.id">
        <div v-for="f in t.fields" :key="f.key" class="amos-field">
          <p v-if="f.key === '_note'" class="rd-note">{{ f.value }}</p>
          <template v-else>
          <label>{{ f.label }}</label>
          <div class="ctrl">
            <template v-if="f.type === 'lookup'">
              <input class="amos-input" :value="model[f.key]" readonly :placeholder="f.placeholder || '选择…'" />
              <button class="lookup-btn" type="button" @click="openLookup(f)">…</button>
            </template>
            <select v-else-if="f.type === 'select'" v-model="model[f.key]" class="amos-select" :disabled="f.readonly">
              <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
            </select>
            <textarea v-else-if="f.type === 'textarea'" v-model="model[f.key]" class="amos-textarea" :readonly="f.readonly" />
            <input v-else-if="f.type === 'number'" type="number" v-model.number="model[f.key]" class="amos-input" :readonly="f.readonly" />
            <input v-else-if="f.type === 'date'" type="date" v-model="model[f.key]" class="amos-input" :readonly="f.readonly" />
            <input v-else-if="f.type === 'readonly'" type="text" class="amos-input" :value="model[f.key] !== undefined && model[f.key] !== '' ? model[f.key] : f.value" readonly />
            <input v-else type="text" v-model="model[f.key]" class="amos-input" :readonly="f.readonly" :placeholder="f.placeholder || ''" />
          </div>
          </template>
        </div>
        <slot :name="'extra-' + t.id" :model="model" />
      </div>
    </div>

    <LookupDialog
      v-if="lookupField"
      :title="lookupField.label"
      :options="lookupOptions"
      @select="onLookupSelect"
      @cancel="lookupField = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import LookupDialog from './LookupDialog.vue'
import { lookups } from '../mock/index.js'

const props = defineProps({
  tabs: { type: Array, required: true },
  model: { type: Object, required: true },
})
const emit = defineEmits(['change'])

const active = ref(props.tabs[0]?.id || '')
const lookupField = ref(null)
const lookupOptions = ref([])

function openLookup(f) {
  lookupField.value = f
  lookupOptions.value = (lookups[f.lookupKey] && lookups[f.lookupKey]()) || []
}
function onLookupSelect(code) {
  if (lookupField.value) {
    props.model[lookupField.value.key] = code
    emit('change', { key: lookupField.value.key, value: code })
  }
  lookupField.value = null
}
</script>

<style scoped>
.record-detail { display: flex; flex-direction: column; height: 100%; min-width: 0; }
.tab-row { display: flex; flex-wrap: wrap; gap: 2px; }
.tab { padding: 6px 12px; cursor: pointer; border: 1px solid var(--amos-border); border-bottom: none; border-radius: 6px 6px 0 0; background: #f3f6fa; color: var(--amos-text-soft); font-size: 12.5px; white-space: nowrap; }
.tab:hover { background: #fff; }
.tab.active { background: #fff; color: var(--amos-blue); font-weight: 700; box-shadow: inset 0 -2px 0 var(--amos-blue); }
.tab-body { flex: 1; min-height: 0; overflow: auto; padding: 12px; border: 1px solid var(--amos-border); border-radius: 0 0 6px 6px; }
.rd-note { margin: 0 0 10px; color: var(--amos-text-soft); font-size: 13px; line-height: 1.6; }
</style>
