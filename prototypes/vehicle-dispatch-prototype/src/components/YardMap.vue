<template>
  <section class="yard-map" aria-label="厂区地图">
    <div class="zone zone-a">总装一区</div>
    <div class="zone zone-b">码头堆场</div>
    <div class="zone zone-c">门岗南区</div>
    <div class="restricted">禁入区域</div>
    <button
      v-for="marker in markers"
      :key="marker.id"
      class="map-marker"
      :class="[marker.status === '异常' ? 'danger' : '', marker.id === selectedId ? 'selected' : '']"
      :style="{ left: marker.x + '%', top: marker.y + '%' }"
      type="button"
      @click="$emit('marker-click', marker)"
    >
      <span>{{ marker.plate }}</span>
    </button>
    <div v-for="route in routes" :key="route" class="route-line" :class="route"></div>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  markers: { type: Array, default: () => [] },
  routes: { type: Array, default: () => [] },
  selectedId: { type: String, default: '' },
})

defineEmits(['marker-click'])
</script>
