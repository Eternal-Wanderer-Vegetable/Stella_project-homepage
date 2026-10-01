import { onMounted, onUnmounted } from 'vue'

/* ================================================================
   首屏星幕:主星罗盘 + S 形碎星带 + 流星 + 视差 + 点击迸发
   (自原单文件页原样迁移,仅把 canvas 的获取方式换成模板引用)
   ================================================================ */
export function useHeroCanvas(canvasRef) {
  let cleanup = null

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const finePointer = window.matchMedia('(pointer: fine)').matches

    const GOLD = '246,201,107', GOLD_L = '255,227,163', COOL = '158,178,214'
    let W = 0, H = 0
    let meteors = [], particles = [], bursts = [], stardust = []
    let SP = null;               // S 形贝塞尔路径控制点
    const star = { x: 0, y: 0, r: 0 }
    let mx = 0, my = 0, smx = 0, smy = 0;   // 鼠标视差(目标值/平滑值)
    let lastScrollY = 0, scrollVelS = 0, scrollGust = 0, pathFlow = 0;   // 滚动风:速度平滑/强度/沿S线滑移量
    let visible = true, running = false

    function rand(a, b) { return a + Math.random() * (b - a) }

    function bez(t) {
      const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t
      return {
        x: a * SP.p0.x + b * SP.c1.x + c * SP.c2.x + d * SP.p3.x,
        y: a * SP.p0.y + b * SP.c1.y + c * SP.c2.y + d * SP.p3.y
      }
    }

    // 四角星光路径(外尖内凹,贝塞尔过渡)——用于碎星
    function sparklePath(cx, cy, r, rot) {
      const inner = r * 0.12
      let i, a, midA, nx, ny
      ctx.beginPath()
      for (i = 0; i < 4; i++) {
        a = rot + i * Math.PI / 2
        nx = cx + Math.cos(a) * r; ny = cy + Math.sin(a) * r
        if (i === 0) ctx.moveTo(nx, ny)
        midA = rot + (i + 0.5) * Math.PI / 2
        ctx.quadraticCurveTo(cx + Math.cos(midA) * inner, cy + Math.sin(midA) * inner,
                             cx + Math.cos(a + Math.PI / 2) * r, cy + Math.sin(a + Math.PI / 2) * r)
      }
      ctx.closePath()
    }

    // (主星已改为球形星体,四角星骨架仅保留给碎星 sparklePath)

    function spawnMeteor() {
      const fromRight = Math.random() < 0.65
      meteors.push({
        x: fromRight ? rand(0.5, 1.12) * W : rand(-0.05, 0.45) * W,
        y: rand(-0.05, 0.32) * H,
        vx: (fromRight ? -1 : 1) * rand(1.8, 3.8),
        vy: rand(0.5, 1.6),
        len: rand(90, 210),
        life: 1,
        decay: rand(0.0035, 0.007),
        w: rand(1, 2.2),
        cool: Math.random() < 0.18
      })
    }

    function buildScene() {
      star.x = W * 0.20; star.y = H * 0.30
      star.r = Math.max(80, Math.min(190, W * 0.125))   // 主星直径约占画面宽度 1/4

      // 动态流星:持续划过的光痕,多数自右上向左下,少量反向
      meteors = []
      if (!reduced) { spawnMeteor(); spawnMeteor(); spawnMeteor() }

      // 主星 → 碎星的 S 形路径(整体走右半区,避开中央文字)
      SP = {
        p0: { x: star.x + star.r * 0.4, y: star.y + star.r * 0.4 },
        c1: { x: W * 0.88, y: H * 0.10 },
        c2: { x: W * 1.04, y: H * 0.68 },
        p3: { x: W * 0.60, y: H * 0.90 }
      }

      // 远景星尘:铺满画面的微光尘埃
      stardust = []
      for (let d = 0; d < 46; d++) {
        stardust.push({
          x: rand(0, W), y: rand(0, H * 0.96),
          size: rand(0.5, 1.4),
          alpha: rand(0.08, 0.3),
          phase: rand(0, Math.PI * 2),
          twSpeed: rand(0.0006, 0.0016),
          cool: Math.random() < 0.3
        })
      }

      particles = []
      const N = 135
      for (let j = 0; j < N; j++) {
        const t = Math.min(1, Math.max(0, j / (N - 1) + rand(-0.012, 0.012)))
        const sa = rand(0, Math.PI * 2)   // 各自的飘散方向
        particles.push({
          t: t,
          spread: (5 + t * 40) * Math.sqrt(Math.random()),
          ang: rand(0, Math.PI * 2),
          size: 0.8 + Math.pow(t, 1.5) * 4.8,           // 由远到近:小 → 大
          alpha: 0.24 + t * 0.66,                        // 由远到近:暗 → 亮
          phase: rand(0, Math.PI * 2),
          twSpeed: rand(0.0008, 0.0022),
          driftSpeed: rand(0.0002, 0.0006),
          driftAmp: rand(0.004, 0.013),
          sparkle: Math.random() < 0.35,
          big: false,
          sdx: Math.cos(sa), sdy: Math.sin(sa),          // 滚动风吹散的方向
          color: (t < 0.22 && Math.random() < 0.3) ? COOL : (Math.random() < 0.32 ? GOLD_L : GOLD)
        })
      }
      // 几颗较大的近景碎星
      for (let k = 0; k < 6; k++) {
        const ka = rand(0, Math.PI * 2)
        particles.push({
          t: rand(0.55, 0.96), spread: rand(10, 46), ang: rand(0, Math.PI * 2),
          size: rand(5.5, 8.5), alpha: rand(0.75, 0.95),
          phase: rand(0, Math.PI * 2), twSpeed: rand(0.0008, 0.0018),
          driftSpeed: rand(0.0002, 0.0005), driftAmp: rand(0.003, 0.01),
          sparkle: true, big: true,
          sdx: Math.cos(ka), sdy: Math.sin(ka),
          color: GOLD_L
        })
      }
      particles.sort(function (a, b) { return a.t - b.t })   // 远的先画,近的压在上层
    }

    // 方位光芒贴图:初始化时烘焙一次(重 blur + 多层叠加,柔边为连续渐变,无梯度带),
    // 运行时仅做旋转贴图,零梯度、零成本
    let beamSprite = null; const BEAM = { w: 240, h: 150 }
    function buildBeamSprite() {
      const c = document.createElement('canvas')
      c.width = BEAM.w; c.height = BEAM.h
      const b = c.getContext('2d')
      const oy = BEAM.h / 2, len = BEAM.w - 6
      b.globalCompositeOperation = 'lighter'
      if (typeof b.filter === 'string') b.filter = 'blur(7px)'
      const layers = [
        { w: 34, a: 0.10 },   // 等宽平行边:光条形状沿长度对称
        { w: 25, a: 0.14 },
        { w: 17, a: 0.19 },
        { w: 10, a: 0.26 },
        { w: 5, a: 0.36 }     // 窄亮核心
      ]
      for (let i = 0; i < layers.length; i++) {
        const ly = layers[i]
        const g = b.createLinearGradient(0, oy, len, oy)
        g.addColorStop(0, 'rgba(255,236,190,0.55)')
        g.addColorStop(0.5, 'rgba(250,215,150,0.32)')
        g.addColorStop(0.85, 'rgba(246,201,107,0.10)')
        g.addColorStop(1, 'rgba(246,201,107,0)')
        b.fillStyle = g
        b.beginPath()
        b.moveTo(0, oy - ly.w)
        b.lineTo(len, oy - ly.w)
        b.lineTo(len, oy + ly.w)
        b.lineTo(0, oy + ly.w)
        b.closePath()
        b.fill()
      }
      b.filter = 'none'
      beamSprite = c
      window.beamSprite = c   // 诊断用:暴露贴图供外部采样验证
    }

    // 罗盘玫瑰:4 长臂(基本方位)+ 4 短臂(斜方位)的折纸风菱形,明暗双面交替,中心轴帽
    function compassRose(cx, cy, R, rot) {
      const lightA = 'rgba(255,238,190,0.96)', darkA = 'rgba(210,152,66,0.96)'
      const lightB = 'rgba(243,199,122,0.96)', darkB = 'rgba(188,132,52,0.96)'
      const stroke = 'rgba(112,76,24,0.5)'
      function point(phi, L, wHalf, tone) {
        const ux = Math.cos(phi), uy = Math.sin(phi)
        const tipX = cx + ux * L, tipY = cy + uy * L
        const s1x = cx + Math.cos(phi - wHalf) * L * 0.30, s1y = cy + Math.sin(phi - wHalf) * L * 0.30
        const s2x = cx + Math.cos(phi + wHalf) * L * 0.30, s2y = cy + Math.sin(phi + wHalf) * L * 0.30
        const bx = cx + ux * L * 0.07, by = cy + uy * L * 0.07
        const li = tone ? lightB : lightA, da = tone ? darkB : darkA
        ctx.lineWidth = 1
        ctx.strokeStyle = stroke
        ctx.beginPath()
        ctx.moveTo(tipX, tipY); ctx.lineTo(s1x, s1y); ctx.lineTo(bx, by)
        ctx.closePath()
        ctx.fillStyle = li; ctx.fill(); ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(tipX, tipY); ctx.lineTo(s2x, s2y); ctx.lineTo(bx, by)
        ctx.closePath()
        ctx.fillStyle = da; ctx.fill(); ctx.stroke()
      }
      let i
      for (i = 0; i < 4; i++) point(rot + Math.PI / 4 + i * Math.PI / 2, R * 0.62, 0.155, 0)
      for (i = 0; i < 4; i++) point(rot + i * Math.PI / 2, R, 0.105, 1)
      // 中心轴帽:指数式淡出 + blur 柔边——无硬边无描边无梯度带
      ctx.save()
      if (typeof ctx.filter === 'string') ctx.filter = 'blur(3px)'
      const hub = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 0.16)
      hub.addColorStop(0, 'rgba(255,246,221,0.98)')
      hub.addColorStop(0.3, 'rgba(244,192,100,0.94)')
      hub.addColorStop(0.55, 'rgba(224,168,74,0.78)')
      hub.addColorStop(0.75, 'rgba(200,144,52,0.5)')
      hub.addColorStop(0.9, 'rgba(176,124,44,0.22)')
      hub.addColorStop(1, 'rgba(160,110,40,0)')
      ctx.fillStyle = hub
      ctx.beginPath()
      ctx.arc(cx, cy, R * 0.16, 0, Math.PI * 2)
      ctx.fill()
      if (typeof ctx.filter === 'string') ctx.filter = 'none'
      ctx.restore()
    }

    function render(time) {
      ctx.clearRect(0, 0, W, H)
      smx += (mx - smx) * 0.05
      smy += (my - smy) * 0.05
      const px = smx, py = smy   // -0.5 ~ 0.5

      // ---- 滚动风:滚动越快,碎星飘散越远;停止后缓缓归位 ----
      const nowScroll = window.pageYOffset || document.documentElement.scrollTop || 0
      const vel = nowScroll - lastScrollY
      lastScrollY = nowScroll
      if (!reduced) {
        scrollVelS += (vel - scrollVelS) * 0.2
        const g = Math.abs(scrollVelS)
        if (g > 0.5) scrollGust = Math.min(1.4, scrollGust + g * 0.03)
        scrollGust *= 0.93
        // 碎星沿 S 线的滑移量:跟随页面滚动位置,惰性趋近(往下滑=向下游)
        const flowTarget = Math.min(0.16, nowScroll * 0.0002)
        pathFlow += (flowTarget - pathFlow) * 0.05
      }

      // ---- 远景星尘 ----
      for (let d = 0; d < stardust.length; d++) {
        const s = stardust[d]
        const stw = reduced ? 1 : (0.5 + 0.5 * Math.sin(time * s.twSpeed + s.phase))
        ctx.fillStyle = 'rgba(' + (s.cool ? COOL : GOLD) + ',' + (s.alpha * stw).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(s.x + px * 3, s.y + py * 2, s.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // ---- 动态流星 ----
      if (!reduced) {
        if (meteors.length < 4 && Math.random() < 0.025) spawnMeteor()
        for (let m = meteors.length - 1; m >= 0; m--) {
          const mt = meteors[m]
          mt.x += mt.vx; mt.y += mt.vy; mt.life -= mt.decay
          if (mt.life <= 0 || mt.x < -mt.len * 2 || mt.x > W + mt.len * 2 || mt.y > H + mt.len) {
            meteors.splice(m, 1); continue
          }
          const sp = Math.sqrt(mt.vx * mt.vx + mt.vy * mt.vy) || 1
          const tx = mt.x - (mt.vx / sp) * mt.len, ty = mt.y - (mt.vy / sp) * mt.len
          const mcol = mt.cool ? COOL : GOLD
          const mg = ctx.createLinearGradient(mt.x, mt.y, tx, ty)
          mg.addColorStop(0, 'rgba(' + mcol + ',' + (0.85 * mt.life).toFixed(3) + ')')
          mg.addColorStop(1, 'rgba(' + mcol + ',0)')
          ctx.strokeStyle = mg
          ctx.lineWidth = mt.w
          ctx.lineCap = 'round'
          ctx.beginPath()
          ctx.moveTo(mt.x, mt.y)
          ctx.lineTo(tx, ty)
          ctx.stroke()
          ctx.save()
          ctx.shadowColor = 'rgba(' + mcol + ',0.9)'
          ctx.shadowBlur = 8
          ctx.fillStyle = 'rgba(255,240,210,' + (0.9 * mt.life).toFixed(3) + ')'
          ctx.beginPath()
          ctx.arc(mt.x, mt.y, 1.6, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      }

      // ---- 主星光晕 ----
      const sx = star.x + px * 18, sy = star.y + py * 14
      const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, star.r * 2.5)
      halo.addColorStop(0, 'rgba(246,201,107,0.08)')
      halo.addColorStop(0.5, 'rgba(246,201,107,0.03)')
      halo.addColorStop(1, 'rgba(246,201,107,0)')
      ctx.fillStyle = halo
      ctx.fillRect(sx - star.r * 2.5, sy - star.r * 2.5, star.r * 5, star.r * 5)

      // ---- 主星参数 ----
      const pulse = reduced ? 1 : 1 + 0.02 * Math.sin(time / 900)
      const r = star.r * pulse
      const rot = -Math.PI / 2   // 固定方位:长臂指向上下左右,不旋转

      // ---- 方位光芒(预烘焙柔边光束贴图,加法混合,图层在罗盘之下) ----
      if (beamSprite) {
        const sc = r / 100   // 贴图按 r=100 基准烘焙
        for (let f = 0; f < 8; f++) {
          const ang = rot + f * Math.PI / 4        // 4 正 4 斜
          const aMul = (f % 2 === 0) ? 1 : 0.35
          ctx.save()
          ctx.globalCompositeOperation = 'lighter'
          if (typeof ctx.filter === 'string') ctx.filter = 'blur(3px)'
          ctx.globalAlpha = (reduced ? 0.75 : 0.5 + 0.12 * Math.sin(time / 700 + ang * 2)) * aMul
          ctx.translate(sx, sy)
          ctx.rotate(ang)
          ctx.drawImage(beamSprite, 0, -BEAM.h / 2 * sc, BEAM.w * sc, BEAM.h * sc)
          ctx.restore()
        }
      }

      // ---- 罗盘玫瑰星体 ----
      ctx.save()
      ctx.shadowColor = 'rgba(246,201,107,0.22)'
      ctx.shadowBlur = 16
      compassRose(sx, sy, r, rot)
      ctx.restore()

      // ---- 自发光核心(加法混合,罩在罗盘中心) ----
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'
      const core = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 0.75)
      core.addColorStop(0, 'rgba(255,244,214,0.22)')
      core.addColorStop(0.55, 'rgba(246,201,107,0.08)')
      core.addColorStop(1, 'rgba(246,201,107,0)')
      ctx.fillStyle = core
      ctx.beginPath()
      ctx.arc(sx, sy, r * 0.75, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ---- S 形碎星带 ----
      for (let j = 0; j < particles.length; j++) {
        const p = particles[j]
        const tt = reduced ? p.t
          : Math.min(1, Math.max(0, p.t + p.driftAmp * Math.sin(time * p.driftSpeed + p.phase)))
        // 沿 S 线向下游动:滚动越多滑得越多,近处碎星滑得更远
        const flow = reduced ? 0 : pathFlow * (0.6 + p.t * 0.8)
        const tt2 = Math.min(1, tt + flow)
        const pos = bez(tt2)
        const depth = 4 + p.t * 20
        // 滚动风:垂直于路线的小幅 flutter,飘而不乱
        const pa = bez(Math.max(0, tt2 - 0.01)), pb = bez(Math.min(1, tt2 + 0.01))
        const tlx = pb.x - pa.x, tly = pb.y - pa.y
        const tl = Math.sqrt(tlx * tlx + tly * tly) || 1
        const flr = reduced ? 0 : scrollGust * Math.sin(time * 0.004 + p.phase) * (2 + p.t * 7)
        const x = pos.x + Math.cos(p.ang) * p.spread + px * depth - (tly / tl) * flr
        const y = pos.y + Math.sin(p.ang) * p.spread + py * depth + (tlx / tl) * flr
        const tw = reduced ? 1 : (0.55 + 0.45 * Math.sin(time * p.twSpeed + p.phase))
        const a = p.alpha * tw
        if (a <= 0.02) continue
        ctx.fillStyle = 'rgba(' + p.color + ',' + a.toFixed(3) + ')'
        if (p.sparkle) {
          ctx.save()
          ctx.shadowColor = 'rgba(246,201,107,0.5)'
          ctx.shadowBlur = p.big ? 14 : 6
          sparklePath(x, y, p.size * 2.1, p.phase)
          ctx.fill()
          ctx.restore()
        } else {
          ctx.beginPath()
          ctx.arc(x, y, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ---- 点击迸发 ----
      for (let k = bursts.length - 1; k >= 0; k--) {
        const b = bursts[k]
        b.x += b.vx; b.y += b.vy; b.vx *= 0.955; b.vy *= 0.955; b.life -= 0.022
        if (b.life <= 0) { bursts.splice(k, 1); continue }
        ctx.fillStyle = 'rgba(' + b.color + ',' + (b.life * 0.9).toFixed(3) + ')'
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    function loop(now) {
      if (!visible) { running = false; return }
      render(now)
      requestAnimationFrame(loop)
    }
    function start() {
      if (!running && !reduced) { running = true; requestAnimationFrame(loop) }
    }

    function resize() {
      const rect = canvas.parentElement.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(320, rect.width); H = Math.max(520, rect.height)
      const tw = Math.round(W * dpr), th = Math.round(H * dpr)
      // 仅在尺寸真变时重设:canvas.width 赋值即清空画布,标题图渐进加载引发的
      // 滚动条抖动会让 resize 反复触发,若无条件赋值会把罗盘每帧擦掉
      if (canvas.width !== tw || canvas.height !== th) {
        canvas.width = tw; canvas.height = th
        canvas.style.width = W + 'px'; canvas.style.height = H + 'px'
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        buildScene()
        if (reduced) render(0)
      }
    }

    buildBeamSprite()
    resize()
    let rsTimer
    const onResize = function () { clearTimeout(rsTimer); rsTimer = setTimeout(resize, 160) }
    window.addEventListener('resize', onResize)

    let observer = null
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting
        if (visible) start()
      }, { threshold: 0.02 })
      observer.observe(canvas)
    }
    start()

    const onMouseMove = function (e) {
      mx = e.clientX / window.innerWidth - 0.5
      my = e.clientY / window.innerHeight - 0.5
    }
    if (!reduced && finePointer) {
      window.addEventListener('mousemove', onMouseMove, { passive: true })
    }

    // 点击首屏空白处:迸发一小把碎星
    const hero = canvas.closest('.hero')
    const onHeroClick = function (e) {
      if (e.target.closest('a, button, input')) return
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left, y = e.clientY - rect.top
      if (y < 0 || y > rect.height) return
      for (let i = 0; i < 14; i++) {
        const a = rand(0, Math.PI * 2), sp = rand(0.6, 3.2)
        bursts.push({
          x: x, y: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          life: 1, size: rand(1.2, 2.8),
          color: Math.random() < 0.4 ? GOLD_L : GOLD
        })
      }
    }
    if (hero) hero.addEventListener('click', onHeroClick)

    cleanup = function () {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouseMove)
      if (hero) hero.removeEventListener('click', onHeroClick)
      if (observer) observer.disconnect()
      visible = false
    }
  })

  onUnmounted(() => { if (cleanup) cleanup() })
}
