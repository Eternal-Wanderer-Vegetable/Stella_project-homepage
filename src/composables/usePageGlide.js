import { onMounted, onUnmounted } from 'vue'

/* ================================================================
   整页翻页(滚轮/键盘),三段式手感:
   ① 阻力进入:滚轮增量先累积并让当前屏微幅位移(≤7px)——稍微滚一下
      只会被"顶住"后弹回,不会误翻页;增量过阈值才放行;
   ② 快速切换:过阈值整页滑动,rAF + postMessage 双驱动 easeOutQuart,
      起步即快;
   ③ 阻力收停:曲线尾段强减速,平稳落在整屏吸附点后自然停住。

   阻力段不用 setTimeout:后台标签页/内嵌 webview 会把定时器钳到 1 秒
   以上、把 rAF 整体冻结,弹回会严重滞后。故弹回与增量衰减统一放进
   rAF + postMessage 双通道驱动的弹簧模拟(两通道互相取消,postMessage
   已实证不被节流);CSS 过渡动画本身不受节流,视觉无碍。

   触屏设备保留 CSS scroll-snap 原生翻页;面板打开/减弱动效时不接管。
   所有滚动显式 instant,避免被 html 的 scroll-behavior:smooth 冻结。
   ================================================================ */
export function usePageGlide() {
  let sections = []
  let gliding = false
  let acc = 0                 // 滚轮增量累积:过阈值才翻页
  let settleUntil = 0         // 翻页结束后的静默期:吞掉触摸板惯性尾
  let nudgeEl = null          // 正被"顶住"微位移的当前屏
  let nudgeOffset = 0         // 当前微位移 px(弹簧模拟值)
  let lastInput = 0           // 最后一次滚轮输入时间

  const THRESHOLD = 85        // 累积增量阈值:单格滚轮(≈100)即放行,轻扫半格仍顶住弹回
  const PULL_RATE = 0.045     // 阻力位移比例:每单位增量顶住 0.045px
  const MAX_PULL = 7          // 阻力位移上限
  const DUR = 560             // 翻页动画时长
  const IDLE_MS = 150         // 输入停止多久视为"松手":弹回 + 增量衰减

  const GLIDE_TOKEN = 'stella-glide-frame:' + Math.random().toString(36).slice(2)
  const SPRING_TOKEN = 'stella-glide-spring:' + Math.random().toString(36).slice(2)
  let rafId = 0, glideMsg = null
  let springRaf = 0, springMsg = null, springLast = 0, springRunning = false

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

  // ---- 阻力弹簧:位移追随输入;输入停即弹回归零,增量同步衰减 ----
  function cancelSpringDrive() {
    cancelAnimationFrame(springRaf)
    if (springMsg) { window.removeEventListener('message', springMsg); springMsg = null }
  }

  // 松开阻力:animated=CSS 弹簧过渡弹回,否则立即复位
  function stopSpring(animated) {
    cancelSpringDrive()
    springRunning = false
    const el = nudgeEl
    nudgeEl = null
    nudgeOffset = 0
    if (!el) return
    if (!animated) {
      el.style.transition = ''
      el.style.transform = ''
      return
    }
    el.style.transition = 'transform .18s cubic-bezier(.22,.61,.36,1)'
    el.style.transform = 'translate3d(0,0,0)'
    // 延迟清理内联样式;若该屏已被新一轮微位移接管则不清理
    setTimeout(function () {
      if (nudgeEl !== el) { el.style.transition = ''; el.style.transform = '' }
    }, 220)
  }

  function springTick(now) {
    cancelSpringDrive()   // 双通道互斥:谁先触发就取消另一个,保证单链推进
    if (gliding) { springRunning = false; return }   // 翻页动画已接管:弹簧退出
    const dt = Math.min(50, Math.max(1, now - springLast))
    springLast = now
    const idle = now - lastInput > IDLE_MS
    if (idle) {
      acc *= Math.pow(0.35, dt / IDLE_MS)   // 松手后增量指数衰减:每 150ms 剩 35%
      if (Math.abs(acc) < 2) acc = 0
    }
    const target = idle ? 0 : Math.max(-MAX_PULL, Math.min(MAX_PULL, -acc * PULL_RATE))
    nudgeOffset += (target - nudgeOffset) * Math.min(1, dt * 0.02)
    if (nudgeEl) {
      if (idle && acc === 0 && Math.abs(nudgeOffset) < 0.05) {
        // 归位完成:弹簧自然收摊
        nudgeEl.style.transition = ''
        nudgeEl.style.transform = ''
        nudgeEl = null
        springRunning = false
        return
      }
      nudgeEl.style.transform = 'translate3d(0,' + nudgeOffset.toFixed(2) + 'px,0)'
    } else if (acc === 0) {
      springRunning = false
      return
    }
    springRaf = requestAnimationFrame(springTick)
    springMsg = function (e) {
      if (e.data === SPRING_TOKEN) springTick(performance.now())
    }
    window.addEventListener('message', springMsg)
    window.postMessage(SPRING_TOKEN)
  }

  function ensureSpring() {
    if (springRunning) return
    springRunning = true
    springLast = performance.now()
    springTick(springLast)
  }

  // ---- 翻页滑动 ----
  function cancelGlideDrive() {
    cancelAnimationFrame(rafId)
    if (glideMsg) { window.removeEventListener('message', glideMsg); glideMsg = null }
  }

  function glideTo(i) {
    if (!sections.length) return
    const idx = Math.max(0, Math.min(sections.length - 1, i))
    const targetY = sections[idx].offsetTop
    // 减弱动效、触屏设备(仅点按触发时):直接就位,不做动画。
    // 必须显式 instant:html 的 scroll-behavior:smooth 会让无 behavior 的
    // scrollTo 变成平滑动画,在后台标签页/内嵌 webview 里被冻结成 no-op
    if (reduced() || !finePointer()) {
      stopSpring(false)
      window.scrollTo({ top: targetY, behavior: 'instant' })
      return
    }
    if (gliding) return
    gliding = true
    const startY = window.scrollY
    const delta = targetY - startY
    if (!delta) { gliding = false; return }
    stopSpring(true)   // 弹回与翻页叠合,衔接成"松阻放行"
    const t0 = performance.now()
    const ease = t => 1 - Math.pow(1 - t, 4)   // easeOutQuart:起步即快,尾段强减速
    let lastT = -1
    function tick(now) {
      cancelGlideDrive()
      const t = Math.min(1, (now - t0) / DUR)
      if (t > lastT) {
        lastT = t
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
      glideMsg = function (e) {
        if (e.data === GLIDE_TOKEN) tick(performance.now())
      }
      window.addEventListener('message', glideMsg)
      window.postMessage(GLIDE_TOKEN)
    }
    schedule()
  }

  function turn(dir) { glideTo(currentIndex() + dir) }

  function onWheel(e) {
    // ctrl+滚轮是缩放手势;面板打开时面板内部自滚动;减弱动效/触屏走原生——均不接管
    if (e.ctrlKey || panelOpen() || reduced() || !finePointer()) return
    if (!e.deltaY) return
    e.preventDefault()
    if (gliding || performance.now() < settleUntil) return
    const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY   // 行模式的滚轮(如 Firefox)
    acc += d
    lastInput = performance.now()
    // ① 阻力进入:内容随输入被"顶住"微幅位移(弹簧模拟渲染),过阈值才放行
    const cur = sections[currentIndex()]
    if (cur) {
      if (nudgeEl && nudgeEl !== cur) {
        nudgeEl.style.transition = ''
        nudgeEl.style.transform = ''
      }
      nudgeEl = cur
      cur.style.transition = 'none'
      ensureSpring()
    }
    if (Math.abs(acc) >= THRESHOLD) {
      const dir = acc > 0 ? 1 : -1
      acc = 0
      stopSpring(true)
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
    cancelGlideDrive()
    stopSpring(false)
    window.removeEventListener('wheel', onWheel)
    document.removeEventListener('keydown', onKey)
  })

  return { glideTo }
}
