<script setup>
import { ref, computed, watch, provide, onMounted, onUnmounted } from 'vue'
import { PAGES } from './pages.js'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import DetailPanel from './components/DetailPanel.vue'

const panelOpen = ref(false)
const current = ref(0)

function openPanel(target) {
  panelOpen.value = true
  const idx = target ? PAGES.findIndex(function (p) { return p.id === target }) : 0
  current.value = idx < 0 ? 0 : idx
}
function closePanel() {
  panelOpen.value = false
  current.value = 0   // 关闭后回到概览,下次打开从头开始
}
// 顶栏页签:面板未开时打开对应页;已开时直接切换
function onSelect(i) {
  openPanel(PAGES[i].id)
}

watch(panelOpen, function (v) { document.body.classList.toggle('panel-open', v) })

// 供面板内页面(如关于页脚)直达指定分页
provide('openPanelPage', openPanel)

function onKey(e) {
  if (e.key === 'Escape' && panelOpen.value) closePanel()
}
onMounted(function () { document.addEventListener('keydown', onKey) })
onUnmounted(function () { document.removeEventListener('keydown', onKey) })
</script>

<template>
  <SiteNav :current="current" :open="panelOpen" @select="onSelect" @close="closePanel" />
  <HeroSection @open="openPanel()" />
  <DetailPanel :open="panelOpen" :current="current" @close="closePanel" />
</template>
