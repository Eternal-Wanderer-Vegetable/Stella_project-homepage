import { onMounted, onUnmounted } from 'vue'

/* ================================================================
   整页翻页(滚轮/键盘),三段式手感:
   ① 阻力进入:滚轮增量先累积并让当前屏微幅位移(≤9px)——稍微滚一下
      只会被"顶住"后弹回,不会误翻页;增量过阈值才放行;
   ② 快速切换:过阈值整页滑动,rAF + postMessage 双驱动 easeOutQuart,
      起步即快;
   ③ 阻力收停:曲线尾段强减速,平稳落在整屏吸附点后自然停住。
   触屏设备保留 CSS scroll-snap 原生翻页;面板打开/减弱动效时不接管。
   后台标签页/内嵌 webview 的 rAF 会冻结(document.hidden 恒 true),
   双通道互相取消兜底;所有滚动显式 instant,避免被 html 的
   scroll-behavior:smooth 冻结成 no-op。
   ================================================================ */
export function usePageGlide() {
  let sections = []
  let gliding = false
  let acc = 0                 // 滚轮增量累积:过阈值才翻页
  let settleUntil = 0         // 翻页结束后的静默期:吞掉触摸板惯性尾
  let nudgeEl = null          // 正被"顶住"微位移的当前屏
  let nudgeTimer = 0

  const THRESHOLD = 130       // 累积增量阈值:约 1.5 个滚轮刻度/一小段触屏滑动
  const PULL_RATE = 0.06      // 阻力位移比例:每单位增量顶住 0.06px
  const MAX_PULL = 9          // 阻力位移上限
  const DUR = 560             // 翻页动画时长

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

  // 松开阻力:顶住的位移弹回;animated=弹簧过渡,否则立即复位
  function releaseNudge(animated) {
    clearTimeout(nudgeTimer)
    const el = nudgeEl
    nudgeEl = null
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

  // 增量衰减链:输入停止 150ms 后开始衰减,直到归零。
  // 只在闲置时衰减、事件间不衰减——否则滚轮"咔哒"节奏(>150ms/格)会被
  // 双重衰减扣光,永远攒不过阈值。衰减链保证半截增量不会隔秒误触发。
  function armDecay() {
    clearTimeout(nudgeTimer)
    nudgeTimer = setTimeout(function decay() {
      releaseNudge(true)   // 输入已停:顶住的位移弹回(清的是已执行的定时器,无碍)
      acc *= 0.35
      if (Math.abs(acc) < 25) acc = 0
      else nudgeTimer = setTimeout(decay, 150)
    }, 150)
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
      releaseNudge(false)
      window.scrollTo({ top: targetY, behavior: 'instant' })
      return
    }
    if (gliding) return
    gliding = true
    const startY = window.scrollY
    const delta = targetY - startY
    if (!delta) { gliding = false; return }
    releaseNudge(true)   // 弹回与翻页叠合,衔接成"松阻放行"
    const t0 = performance.now()
    const ease = t => 1 - Math.pow(1 - t, 4)   // easeOutQuart:起步即快,尾段强减速
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
    if (gliding || performance.now() < settleUntil) return
    const d = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY   // 行模式的滚轮(如 Firefox)
    acc += d
    // ① 阻力进入:内容随输入被"顶住"微幅位移,增量过阈值才放行翻页
    const cur = sections[currentIndex()]
    if (cur) {
      if (nudgeEl && nudgeEl !== cur) releaseNudge(false)
      nudgeEl = cur
      cur.style.transition = 'none'
      cur.style.transform = 'translate3d(0,' +
        Math.max(-MAX_PULL, Math.min(MAX_PULL, -acc * PULL_RATE)).toFixed(1) + 'px,0)'
    }
    if (Math.abs(acc) >= THRESHOLD) {
      const dir = acc > 0 ? 1 : -1
      acc = 0
      releaseNudge(true)
      turn(dir)
    } else {
      armDecay()
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
    releaseNudge(false)
    window.removeEventListener('wheel', onWheel)
    document.removeEventListener('keydown', onKey)
  })

  return { glideTo }
}
