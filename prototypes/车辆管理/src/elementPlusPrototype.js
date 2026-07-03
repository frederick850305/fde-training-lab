import { defineComponent, h } from 'vue'

function emitValue(emit, value) {
  emit('update:modelValue', value)
  emit('change', value)
}

const ElButton = defineComponent({
  name: 'ElButton',
  props: { type: String, size: String, loading: Boolean, disabled: Boolean },
  emits: ['click'],
  setup(props, { slots, emit }) {
    return () => h('button', {
      class: ['el-button-lite', props.type && `el-button-lite--${props.type}`, props.size && `el-button-lite--${props.size}`],
      disabled: props.disabled || props.loading,
      onClick: event => emit('click', event),
    }, props.loading ? '处理中...' : slots.default?.())
  },
})

const ElInput = defineComponent({
  name: 'ElInput',
  props: { modelValue: [String, Number], type: String, placeholder: String, rows: [String, Number], readonly: Boolean, clearable: Boolean },
  emits: ['update:modelValue', 'keyup'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'el-input-lite' }, [
      props.type === 'textarea'
        ? h('textarea', {
            value: props.modelValue || '',
            rows: props.rows || 3,
            placeholder: props.placeholder,
            readonly: props.readonly,
            onInput: event => emit('update:modelValue', event.target.value),
            onKeyup: event => emit('keyup', event),
          })
        : h('input', {
            value: props.modelValue || '',
            placeholder: props.placeholder,
            readonly: props.readonly,
            onInput: event => emit('update:modelValue', event.target.value),
            onKeyup: event => emit('keyup', event),
          }),
      slots.prefix ? h('span', { class: 'el-input-lite__prefix' }, slots.prefix()) : null,
    ])
  },
})

const ElDialog = defineComponent({
  name: 'ElDialog',
  props: { modelValue: Boolean, title: String, width: String },
  emits: ['update:modelValue'],
  setup(props, { emit, slots }) {
    return () => props.modelValue ? h('div', { class: 'el-dialog-lite-mask', onClick: () => emit('update:modelValue', false) }, [
      h('section', { class: 'el-dialog-lite', style: { width: props.width || '520px' }, onClick: event => event.stopPropagation() }, [
        h('header', [h('strong', props.title || ''), h('button', { onClick: () => emit('update:modelValue', false) }, '×')]),
        h('div', { class: 'el-dialog-lite__body' }, slots.default?.()),
      ]),
    ]) : null
  },
})

const ElRadioGroup = defineComponent({
  name: 'ElRadioGroup',
  props: { modelValue: String },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit, slots }) {
    return () => h('div', { class: 'el-radio-group-lite' },
      slots.default?.().map(node => h('button', {
        class: ['el-radio-button-lite', node.props?.value === props.modelValue && 'active'],
        onClick: () => emitValue(emit, node.props?.value),
      }, node.children?.default?.() || node.children || node.props?.value))
    )
  },
})

const ElRadioButton = defineComponent({
  name: 'ElRadioButton',
  props: { value: String },
  setup(props, { slots }) {
    return () => h('span', { value: props.value }, slots.default?.())
  },
})

const ElDatePicker = defineComponent({
  name: 'ElDatePicker',
  props: { modelValue: [String, Date], placeholder: String },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    return () => h('input', {
      class: 'el-date-picker-lite',
      type: 'datetime-local',
      value: props.modelValue || '',
      placeholder: props.placeholder,
      onInput: event => emit('update:modelValue', event.target.value),
    })
  },
})

const ElUpload = defineComponent({
  name: 'ElUpload',
  setup(props, { slots }) {
    return () => h('div', { class: 'el-upload-lite' }, slots.default?.())
  },
})

const ElTable = defineComponent({
  name: 'ElTable',
  props: { data: { type: Array, default: () => [] } },
  emits: ['rowClick'],
  setup(props, { emit }) {
    return () => h('div', { class: 'el-table-lite' },
      props.data.map(row => h('button', { class: 'el-table-lite__row', onClick: () => emit('rowClick', row) }, [
        h('strong', row.name || row.plate || row.plateNo || row.id || '-'),
        h('span', row.plate || row.plateNo || row.location || ''),
        h('span', row.distance || row.status || ''),
      ]))
    )
  },
})

const ElTableColumn = defineComponent({ name: 'ElTableColumn', setup: () => () => null })
const ElBreadcrumb = defineComponent({ name: 'ElBreadcrumb', setup: (props, { slots }) => () => h('nav', { class: 'el-breadcrumb-lite' }, slots.default?.()) })
const ElBreadcrumbItem = defineComponent({ name: 'ElBreadcrumbItem', emits: ['click'], setup: (props, { slots, emit }) => () => h('button', { onClick: event => emit('click', event) }, slots.default?.()) })
const ElIcon = defineComponent({ name: 'ElIcon', setup: (props, { slots }) => () => h('span', { class: 'el-icon-lite' }, slots.default?.()) })
const ElTabs = defineComponent({ name: 'ElTabs', setup: (props, { slots }) => () => h('div', { class: 'el-tabs-lite' }, slots.default?.()) })
const ElTabPane = defineComponent({ name: 'ElTabPane', props: { label: String }, setup: props => () => h('button', { class: 'el-tab-pane-lite' }, props.label) })
const ElSkeleton = defineComponent({ name: 'ElSkeleton', props: { rows: Number }, setup: props => () => h('div', { class: 'el-skeleton-lite' }, Array.from({ length: props.rows || 3 }, (_, i) => h('span', { key: i }))) })
const ElEmpty = defineComponent({ name: 'ElEmpty', props: { description: String }, setup: (props, { slots }) => () => h('div', { class: 'el-empty-lite' }, [h('p', props.description || '暂无数据'), slots.default?.()]) })
const ElResult = defineComponent({ name: 'ElResult', props: { title: String, subTitle: String }, setup: (props, { slots }) => () => h('div', { class: 'el-result-lite' }, [h('h3', props.title), h('p', props.subTitle), slots.extra?.()]) })
const ElAlert = defineComponent({ name: 'ElAlert', props: { title: String, type: String }, setup: (props, { slots }) => () => h('div', { class: ['el-alert-lite', props.type] }, [h('strong', props.title), slots.default?.()]) })

export function installElementPlusPrototype(app) {
  Object.entries({
    ElButton,
    ElInput,
    ElDialog,
    ElRadioGroup,
    ElRadioButton,
    ElDatePicker,
    ElUpload,
    ElTable,
    ElTableColumn,
    ElBreadcrumb,
    ElBreadcrumbItem,
    ElIcon,
    ElTabs,
    ElTabPane,
    ElSkeleton,
    ElEmpty,
    ElResult,
    ElAlert,
  }).forEach(([name, component]) => app.component(name, component))
}
