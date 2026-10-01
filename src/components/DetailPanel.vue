<script setup>
import OverviewPage from './pages/OverviewPage.vue'
import PhilosophyPage from './pages/PhilosophyPage.vue'
import FeaturesPage from './pages/FeaturesPage.vue'
import MemoryPage from './pages/MemoryPage.vue'
import DeployPage from './pages/DeployPage.vue'
import QuickstartPage from './pages/QuickstartPage.vue'
import StackPage from './pages/StackPage.vue'
import AboutPage from './pages/AboutPage.vue'

defineProps({
  open: { type: Boolean, default: false },
  current: { type: Number, required: true },
})
defineEmits(['close'])
</script>

<template>
  <div class="panel" id="panel" :class="{ open }" :aria-hidden="String(!open)">
    <div class="panel-head">
      <div class="brand"><span class="star">✦</span><b>Stella</b><span class="panel-tag">深入了解</span></div>
      <button class="panel-close" type="button" aria-label="关闭详情" @click="$emit('close')">✕</button>
    </div>
    <OverviewPage :active="current === 0" />
    <PhilosophyPage :active="current === 1" />
    <FeaturesPage :active="current === 2" />
    <MemoryPage :active="current === 3" />
    <DeployPage :active="current === 4" />
    <QuickstartPage :active="current === 5" />
    <StackPage :active="current === 6" />
    <AboutPage :active="current === 7" />
  </div>
</template>
