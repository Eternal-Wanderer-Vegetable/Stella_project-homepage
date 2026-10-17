import { ref, onMounted, onUnmounted } from 'vue'

/* ================================================================
   屏幕首次进入视口时点亮 entered,供一次性入场编排(第二/三屏共用)。
   纯 CSS 动画按 entered 类分镜播放,离开再回来不重播;
   减弱动效或无 IntersectionObserver 时直接就位,不做隐藏。
   ================================================================ */
export function useEnterOnce(threshold = 0.3) {
  const root = ref(null)
  const entered = ref(false)
  let io = null

  onMounted(function () {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      entered.value = true
      return
    }
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          entered.value = true
          io.disconnect()
          io = null
        }
      })
    }, { threshold })
    io.observe(root.value)
  })
  onUnmounted(function () { if (io) io.disconnect() })

  return { root, entered }
}
