<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { PAGES } from './pages.js'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import RailNav from './components/RailNav.vue'
import DetailPanel from './components/DetailPanel.vue'

const panelOpen = ref(false)
const current = ref(0)

const fillHeight = computed(() =>
  (PAGES.length > 1 ? (current.value / (PAGES.length - 1)) * 100 : 0).toFixed(2) + '%')

function openPanel(target) {
  panelOpen.value = true
  const idx = target ? PAGES.findIndex(function (p) { return p.id === target }) : 0
  current.value = idx < 0 ? 0 : idx
}
function closePanel() {
  panelOpen.value = false
  current.value = 0   // 关闭后回到概览,下次打开从头开始
}
function onRailSelect(i) {
  if (!panelOpen.value) { openPanel(PAGES[i].id); return }
  current.value = i
}

watch(panelOpen, function (v) { document.body.classList.toggle('panel-open', v) })

function onKey(e) {
  if (e.key === 'Escape' && panelOpen.value) closePanel()
}
onMounted(function () { document.addEventListener('keydown', onKey) })
onUnmounted(function () { document.removeEventListener('keydown', onKey) })
</script>

<template>
  <SiteNav />
  <HeroSection @open="openPanel()" />
  <RailNav :current="current" :fill-height="fillHeight" @select="onRailSelect" />
  <DetailPanel :open="panelOpen" :current="current" @close="closePanel" />
</template>
