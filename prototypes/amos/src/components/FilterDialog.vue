<template>
  <Modal title="Filter" width="560px" @close="$emit('cancel')">
    <div class="tab-row" style="border-radius:6px 6px 0 0">
      <div class="tab" :class="{ active: tab === 'basic' }" @click="tab = 'basic'">Basic</div>
      <div class="tab" :class="{ active: tab === 'advanced' }" @click="tab = 'advanced'">Advanced</div>
    </div>
    <div style="padding:14px 4px 0">
      <div v-for="f in currentFields" :key="f.key" class="amos-field">
        <label>{{ f.label }}</label>
        <div class="ctrl">
          <select v-if="f.type === 'select'" v-model="model[f.key]" class="amos-select">
            <option value="">（全部）</option>
            <option v-for="o in f.options" :key="o" :value="o">{{ o }}</option>
          </select>
          <input v-else-if="f.type === 'date'" type="date" v-model="model[f.key]" class="amos-input" />
          <label v-else-if="f.type === 'checkbox'" class="row" style="gap:6px">
            <input type="checkbox" v-model="model[f.key]" /> <span class="muted">{{ f.hint || '启用' }}</span>
          </label>
          <input v-else type="text" v-model="model[f.key]" class="amos-input" :placeholder="f.placeholder || ''" />
        </div>
      </div>
      <p v-if="!currentFields.length" class="muted" style="padding:6px 0">该标签页暂无过滤条件。</p>
    </div>
    <template #footer>
      <button class="amos-btn sm" @click="selectAll">Select All</button>
      <button class="amos-btn sm" @click="clearAll">Clear</button>
      <span class="spacer" />
      <button class="amos-btn" @click="$emit('cancel')">Cancel</button>
      <button class="amos-btn primary" @click="ok">OK</button>
    </template>
  </Modal>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import Modal from './Modal.vue'

const props = defineProps({
  basic: { type: Array, default: () => [] },
  advanced: { type: Array, default: () => [] },
})
const emit = defineEmits(['ok', 'cancel'])

const tab = ref('basic')
const currentFields = computed(() => (tab.value === 'basic' ? props.basic : props.advanced))
const model = reactive({})

function ok() {
  emit('ok', { ...model })
}
function selectAll() {
  currentFields.value.forEach((f) => {
    if (f.type === 'checkbox') model[f.key] = true
    else if (f.type === 'select') model[f.key] = ''
    else model[f.key] = ''
  })
}
function clearAll() {
  Object.keys(model).forEach((k) => {
    if (typeof model[k] === 'boolean') model[k] = false
    else model[k] = ''
  })
}
</script>
