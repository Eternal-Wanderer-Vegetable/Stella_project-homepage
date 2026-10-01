// 滚动渐显:进入视口即加 visible 并停止观察(与原版单文件页逻辑一致)
let io = null

function ensureObserver() {
  if (io) return io
  io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target) }
    })
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
  return io
}

export default {
  mounted(el) {
    if (!('IntersectionObserver' in window)) { el.classList.add('visible'); return }
    ensureObserver().observe(el)
  },
  unmounted(el) {
    if (io) io.unobserve(el)
  },
}
