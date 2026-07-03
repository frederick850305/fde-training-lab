export default {
  name: 'DraggableShim',
  props: {
    modelValue: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue', 'change'],
  template: `
    <div>
      <slot
        v-for="(element, index) in modelValue"
        name="item"
        :element="element"
        :index="index"
      />
    </div>
  `,
}
