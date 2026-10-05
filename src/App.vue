<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { PAGES } from './pages.js'
import SiteNav from './components/SiteNav.vue'
import HeroSection from './components/HeroSection.vue'
import MechanismSection from './components/MechanismSection.vue'
import MemorySection from './components/MemorySection.vue'
import DeploySection from './components/DeploySection.vue'
import FootSection from './components/FootSection.vue'
import DetailPanel from './components/DetailPanel.vue'
import { usePageGlide } from './composables/usePageGlide.js'

usePageGlide()

const panelOpen = ref(false)
const current = ref(0)
let lastTrigger = null   // 打开面板时的触发元素,关闭后把焦点还给它

// 整页平滑翻页(滚轮/键盘接管),滚动暗示按钮共用同一缓动通道
const { glideTo } = usePageGlide()

// —— 面板状态 ↔ URL hash:#quickstart / #docs 可直链分享,浏览器返回键可退出面板 ——
function pageFromHash() {
  const id = location.hash.replace(/^#/, '')
  return PAGES.findIndex(function (p) { return p.id === id })
}
function syncFromHash() {
  const idx = pageFromHash()
  if (idx >= 0) {
    panelOpen.value = true
    current.value = idx
  } else if (panelOpen.value) {
    panelOpen.value = false
    current.value = 0
  }
}
function openPanel(target) {
  const idx = target ? PAGES.findIndex(function (p) { return p.id === target }) : 0
  current.value = idx < 0 ? 0 : idx
  if (!panelOpen.value) {
    lastTrigger = document.activeElement
    panelOpen.value = true
    const id = PAGES[current.value].id
    if (location.hash !== '#' + id) history.pushState(null, '', '#' + id)
    // 焦点移入面板,Tab 从面板内开始,不在被遮住的首页里游走
    nextTick(function () {
      const el = document.getElementById('panel')
      if (el) el.focus({ preventScroll: true })
    })
  } else {
    // 面板内换页不新增历史记录,保证浏览器返回键一次即可退出面板
    history.replaceState(null, '', '#' + PAGES[current.value].id)
  }
}
function closePanel() {
  if (pageFromHash() >= 0) {
    history.replaceState(null, '', location.pathname + location.search)
  }
  panelOpen.value = false
  current.value = 0   // 关闭后回到概览,下次打开从头开始
}
// 顶栏页签:面板未开时打开对应页;已开时直接切换
function onSelect(i) {
  openPanel(PAGES[i].id)
}

watch(panelOpen, function (v, was) {
  document.body.classList.toggle('panel-open', v)
  // 关闭时把焦点还给触发元素(若它还在文档里)
  if (!v && was && lastTrigger && document.contains(lastTrigger)) {
    try { lastTrigger.focus() } catch (e) {}
  }
  if (!v) lastTrigger = null
})

function onKey(e) {
  if (e.key === 'Escape' && panelOpen.value) closePanel()
}
onMounted(function () {
  syncFromHash()   // 支持 #quickstart / #docs 直链进入
  window.addEventListener('hashchange', syncFromHash)
  window.addEventListener('popstate', syncFromHash)
  document.addEventListener('keydown', onKey)
})
onUnmounted(function () {
  window.removeEventListener('hashchange', syncFromHash)
  window.removeEventListener('popstate', syncFromHash)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <SiteNav :current="current" :open="panelOpen" @select="onSelect" @close="closePanel" />
  <main>
    <HeroSection :glide-to="glideTo" @open="openPanel" />
    <MechanismSection />
    <MemorySection />
    <DeploySection @open="openPanel" />
  </main>
  <FootSection @open="openPanel" />
  <DetailPanel :open="panelOpen" :current="current" @close="closePanel" />
</template>
