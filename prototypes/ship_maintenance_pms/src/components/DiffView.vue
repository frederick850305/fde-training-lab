<template>
  <div class="diff-view">
    <div v-if="!diffFields.length" class="diff-empty">无变更字段</div>

    <template v-else>
      <div class="diff-head">
        <span>字段</span>
        <span class="left">{{ leftLabel }}</span>
        <span v-if="mode === 'side-by-side'" class="right">{{ rightLabel }}</span>
        <span v-if="resolveMode">采用版本</span>
      </div>

      <div v-for="field in diffFields" :key="field.key" :class="['diff-row', field.tone]">
        <span class="field-name">{{ field.label }}</span>

        <template v-if="mode === 'side-by-side'">
          <span class="field-value old" :class="{ strike: field.tone === 'changed' }">{{ display(field.left) }}</span>
          <span class="field-value new">{{ display(field.right) }}</span>
        </template>

        <template v-else>
          <span class="field-value inline">
            <del v-if="field.tone === 'changed'">{{ display(field.left) }}</del>
            <ins>{{ display(field.right) }}</ins>
          </span>
        </template>

        <div v-if="resolveMode" class="resolve">
          <label><input type="radio" :name="`resolve-${field.key}`" :checked="resolved[field.key] === 'left'" @change="$emit('resolve', { field: field.key, selectedVersion: 'left' })" />左</label>
          <label><input type="radio" :name="`resolve-${field.key}`" :checked="resolved[field.key] === 'right'" @change="$emit('resolve', { field: field.key, selectedVersion: 'right' })" />右</label>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'

const props = defineProps({
  left: { type: Object, required: true },
  right: { type: Object, required: true },
  fields: { type: Array, default: null },
  mode: { type: String, default: 'side-by-side' },
  resolveMode: { type: Boolean, default: false },
  leftLabel: { type: String, default: '变更前' },
  rightLabel: { type: String, default: '变更后' },
})

const emit = defineEmits(['resolve'])

const resolved = reactive({})
watch(() => [props.left, props.right], () => { for (const k in resolved) delete resolved[k] }, { deep: true })

const allFields = computed(() => {
  if (props.fields?.length) return props.fields
  const keys = new Set([...Object.keys(props.left || {}), ...Object.keys(props.right || {})])
  return [...keys].map(key => ({ key, label: key }))
})

const diffFields = computed(() =>
  allFields.value.map(({ key, label }) => {
    const left = props.left?.[key]
    const right = props.right?.[key]
    const changed = JSON.stringify(left) !== JSON.stringify(right)
    return { key, label: label || key, left, right, tone: changed ? 'changed' : 'same' }
  }),
)

function display(value) {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'boolean') return value ? '是' : '否'
  return String(value)
}
</script>

<style scoped>
.diff-view { border: 1px solid #d9e4ef; border-radius: 8px; overflow: hidden; }
.diff-empty { padding: 24px; text-align: center; color: #64748b; }
.diff-head { display: grid; grid-template-columns: 1.1fr 1fr 1fr auto; gap: 8px; padding: 10px 14px; background: #f7fafc; color: #63748a; font-size: 12px; font-weight: 900; }
.diff-head:has(.inline) { grid-template-columns: 1.1fr 1fr auto; }
.diff-row { display: grid; grid-template-columns: 1.1fr 1fr 1fr auto; gap: 8px; padding: 11px 14px; border-top: 1px solid #e7edf4; font-size: 13px; align-items: center; }
.diff-row.changed { background: #fffdf2; }
.field-name { color: #53657c; font-weight: 800; }
.field-value.old { color: #8b9aab; }
.field-value.old.strike { text-decoration: line-through; }
.field-value.new { color: #172033; font-weight: 700; }
.diff-row.changed .field-value.new { color: #b8860b; }
.field-value.inline del { color: #b4232d; margin-right: 8px; }
.field-value.inline ins { color: #11734d; text-decoration: none; font-weight: 700; }
.resolve { display: flex; gap: 10px; font-size: 12px; }
.resolve label { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
@media (max-width: 720px) { .diff-head, .diff-row { grid-template-columns: 1fr 1fr; } .resolve { grid-column: 1 / -1; } }
</style>
