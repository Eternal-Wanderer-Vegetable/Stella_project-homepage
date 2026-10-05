import { onMounted, onUnmounted } from 'vue'

/* ================================================================
   整页平滑翻页:一次手势(滚轮/键盘)= 一整页,自绘 easeInOutCubic 缓动。
   不用原生 smooth scroll:部分环境完全失效,且 mandatory snap 会把逐帧
   滚动强行吸回整屏位,与动画天然打架。因此精确指针设备上关闭 CSS snap、
   由本模块接管;触屏设备保留 CSS scroll-snap 走原生惯性翻页,本模块不介入。

   动画驱动为 rAF + postMessage 双通道:后台标签页/内嵌 webview 的
   document.hidden 恒为 true 时 rAF 会被冻结,而 postMessage 任务不受
   节流——两通道互相取消,正常环境走 rAF 档,冻结环境自动落到消息档。
   ================================================================ */
export function usePageGlide() {
  let sections = []
  let gliding = false
  let acc = 0                 // 滚轮增量累积:过阈值才翻页,过滤触摸板细碎增量
  let lastTs = 0              // 上个滚轮事件时间:识别新手势,防惯性尾连翻
  let settleUntil = 0         // 翻页结束后的静默期:吞掉触摸板惯性尾

  const TOKEN = 'stella-glide-frame:' + Math.random().toString(36).slice(2)
  let rafId = 0
  let onMsg = null

  const finePointer = () => window.matchMedia('(pointer: fine)').matches
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const panelOpen = () => document.body.classList.contains('panel-open')

  function collect() {
    // 与 style.css 触屏吸附规则保持同一份选择器
    sections = [...document.querySelectorAll('main > *, footer.foot')]
  }

  function currentIndex() {
    const y = window.scrollY
    let best = 0, bestDist = Infinity
    sections.forEach((s, i) => {
      const d = Math.abs(s.offsetTop - y)
      if (d < bestDist) { bestDist = d; best = i }
    })
    return best
  }

  function cancelDrive() {
    cancelAnimationFrame(rafId)
    if (onMsg) window.removeEventListener('message', onMsg)
  }

  function glideTo(i) {
    if (!sections.length) return
    const idx = Math.max(0, Math.min(sections.length - 1, i))
    const targetY = sections[idx].offsetTop
    // 减弱动效、触屏设备(仅点按触发时):直接就位,不做动画。
    // 必须显式 instant:html 的 scroll-behavior:smooth 会让无 behavior 的
    // scrollTo 变成平滑动画,在后台标签页/内嵌 webview 里被冻结成 no-op
    if (reduced() || !finePointer()) {
      window.scrollTo({ top: targetY, behavior: 'instant' })
      return
    }
    if (gliding) return
    gliding = true
    const startY = window.scrollY
    const delta = targetY - startY
    if (!delta) { gliding = false; return }
    const DUR = 850
    const t0 = performance.now()
    const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)   // easeInOutCubic
    let lastT = -1
    function tick(now) {
      cancelDrive()   // 双通道互斥:谁先触发就取消另一个,保证单链推进
      const t = Math.min(1, (now - t0) / DUR)
      if (t > lastT) {
        lastT = t
        // 显式 instant:否则两参 scrollTo 继承 html 的 scroll-behavior:smooth,
        // 在 rAF 冻结的环境里每帧动画都启动即冻结,页面纹丝不动
        window.scrollTo({ top: Math.round(startY + delta * ease(t)), behavior: 'instant' })
      }
      if (t < 1) schedule()
      else {
        gliding = false
        settleUntil = performance.now() + 220   // 吞掉触摸板惯性尾,防连翻
      }
    }
    function schedule() {
      rafId = requestAnimationFrame(tick)
      onMsg = function (e) {
        if (e.data === TOKEN) tick(performance.now())
      }
      window.addEventListener('message', onMsg)
      window.postMessage(TOKEN, '*')
    }
    schedule()
  }

  function turn(dir) { glideTo(currentIndex() + dir) }

  function onWheel(e) {
    // ctrl+滚轮是缩放手势;面板打开时面板内部自滚动;减弱动效/触屏走原生——均不接管
    if (e.ctrlKey || panelOpen() || reduced() || !finePointer()) return
    if (!e.deltaY) return
    e.preventDefault()
    const now = performance.now()
    if (now - lastTs > 120) acc = 0   // 与上次事件间隔较久 = 新手势,清零重累积
    lastTs = now
    if (gliding || now < settleUntil) return
    const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY   // 行模式的滚轮(如 Firefox)
    acc += d
    if (Math.abs(acc) >= 60) {
      const dir = acc > 0 ? 1 : -1
      acc = 0
      turn(dir)
    }
  }

  function onKey(e) {
    if (panelOpen() || reduced() || !finePointer() || e.altKey || e.ctrlKey || e.metaKey) return
    // 焦点在交互元素上时保持原生(空格点按钮、方向键在输入框里移动光标)。
    // 无焦点时 target 是 document,没有 closest,需先判型
    const t = e.target
    if (t && typeof t.closest === 'function' && t.closest('a, button, input, textarea, select, [contenteditable]')) return
    if (e.key === 'Home') { e.preventDefault(); glideTo(0) }
    else if (e.key === 'End') { e.preventDefault(); glideTo(sections.length - 1) }
    else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); turn(1) }
    else if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); turn(-1) }
  }

  onMounted(() => {
    collect()
    window.addEventListener('wheel', onWheel, { passive: false })
    document.addEventListener('keydown', onKey)
  })
  onUnmounted(() => {
    cancelDrive()
    window.removeEventListener('wheel', onWheel)
    document.removeEventListener('keydown', onKey)
  })

  return { glideTo }
}
