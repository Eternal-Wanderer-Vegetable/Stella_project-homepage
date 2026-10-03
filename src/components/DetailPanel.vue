<script setup>
import QuickstartPage from './pages/QuickstartPage.vue'
import DocsPage from './pages/DocsPage.vue'

defineProps({
  open: { type: Boolean, default: false },
  current: { type: Number, required: true },
})
</script>

<template>
  <div class="panel" id="panel" :class="{ open }" :aria-hidden="String(!open)" tabindex="-1">
    <QuickstartPage :active="current === 0" />
    <DocsPage :active="current === 1" />
  </div>
</template>
