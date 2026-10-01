<script setup>
import { PAGES } from '../pages.js'

defineProps({
  current: { type: Number, required: true },
  fillHeight: { type: String, default: '0%' },
})
defineEmits(['select'])
</script>

<template>
  <aside class="rail" aria-label="内容导航">
    <div class="rail-nav">
      <button v-for="(p, i) in PAGES" :key="p.id" type="button"
              :class="{ active: i === current }" @click="$emit('select', i)">
        <span>{{ p.label }}</span>
      </button>
    </div>
    <div class="rail-progress" aria-hidden="true"><i :style="{ height: fillHeight }"></i></div>
  </aside>
</template>
