<script setup>
import OverviewPage from './pages/OverviewPage.vue'
import PhilosophyPage from './pages/PhilosophyPage.vue'
import FeaturesPage from './pages/FeaturesPage.vue'
import MemoryPage from './pages/MemoryPage.vue'
import DeployPage from './pages/DeployPage.vue'
import QuickstartPage from './pages/QuickstartPage.vue'
import StackPage from './pages/StackPage.vue'
import DocsPage from './pages/DocsPage.vue'
import AboutPage from './pages/AboutPage.vue'

defineProps({
  open: { type: Boolean, default: false },
  current: { type: Number, required: true },
})
</script>

<template>
  <div class="panel" id="panel" :class="{ open }" :aria-hidden="String(!open)">
    <OverviewPage :active="current === 0" />
    <PhilosophyPage :active="current === 1" />
    <FeaturesPage :active="current === 2" />
    <MemoryPage :active="current === 3" />
    <DeployPage :active="current === 4" />
    <QuickstartPage :active="current === 5" />
    <StackPage :active="current === 6" />
    <DocsPage :active="current === 7" />
    <AboutPage :active="current === 8" />
  </div>
</template>
