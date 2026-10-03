<script setup>
import { ref, computed, onMounted } from 'vue'

// 预算环:分段数据来自上游文档的真实预算表
// 8192 = (人格 + 对话历史 + 工具结论 6342) + (记忆注入 500+150) + (输出 + 安全余量 1200)
// 动画由 rAF 单进度值驱动(JS 计算,不依赖 CSS transition——部分内嵌浏览器会冻结 CSS 动画时钟)
const R = 96
const CX = 130, CY = 130
const C = 2 * Math.PI * R
const GAP = 3
const TOTAL = 8192

const SEGMENTS = [
  { name: '人格 · 对话历史 · 工具', value: 6342, color: 'rgba(201,155,63,0.75)', width: 12 },
  { name: '记忆注入', value: 650, color: '#f6c96b', width: 13, glow: true },
  { name: '输出 + 安全余量', value: 1200, color: '#7aa2f7', width: 12 },
]

const reduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const p = ref(reduced ? 1 : 0)   // 动画进度 0 → 1

const segs = computed(() => {
  let start = 0
  return SEGMENTS.map((s) => {
    const full = (C * s.value) / TOTAL
    const dash = Math.max(0, p.value * (full - GAP))
    const offset = -(start + GAP / 2)
    const mid = ((start + full / 2) / C) * 360 // 段中点角度(自顶部顺时针)
    start += full
    const rad = (mid * Math.PI) / 180
    const lx = CX + 117 * Math.sin(rad)
    const ly = CY - 117 * Math.cos(rad)
    const right = Math.sin(rad) >= -0.05
    const labelOpacity = Math.max(0, Math.min(1, (p.value - 0.55) / 0.35))
    return { ...s, dash, offset, lx, ly, right, labelOpacity }
  })
})

const shown = computed(() => Math.round(TOTAL * (1 - Math.pow(1 - p.value, 3))))

onMounted(() => {
  if (reduced) return
  const t0 = performance.now()
  const DUR = 1600
  const tick = (now) => {
    p.value = Math.min(1, (now - t0) / DUR)
    if (p.value < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <figure class="ring-wrap" aria-label="Stella 的上下文预算:总共 8192 tokens,其中人格、对话历史与工具结论占 6342,记忆注入 650,输出与安全余量 1200">
    <svg viewBox="0 0 260 260" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="ringNumGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.5" stop-color="#ffe3a3"/>
          <stop offset="1" stop-color="#f6c96b"/>
        </linearGradient>
      </defs>
      <!-- 底环 -->
      <circle :cx="CX" :cy="CY" :r="R" fill="none" stroke="rgba(148,163,184,0.12)" stroke-width="12"/>
      <circle v-for="(s, i) in segs" :key="i"
              :cx="CX" :cy="CY" :r="R" fill="none"
              :stroke="s.color" :stroke-width="s.width"
              :stroke-dasharray="`${s.dash} ${C - s.dash}`"
              :stroke-dashoffset="s.offset"
              :transform="`rotate(-90 ${CX} ${CY})`"
              :style="s.glow ? 'filter: drop-shadow(0 0 6px rgba(246,201,107,0.55))' : 'none'"/>
      <!-- 段标注 -->
      <g v-for="(s, i) in segs" :key="'l' + i"
         :transform="`translate(${s.lx} ${s.ly})`"
         :text-anchor="s.right ? 'start' : 'end'"
         :style="{ opacity: s.labelOpacity }">
        <text class="rl-name" y="0">{{ s.name }}</text>
        <text class="rl-val" y="14">{{ s.value }} tok</text>
      </g>
      <!-- 中心数字 -->
      <text class="ring-num" :x="CX" :y="CY + 4" text-anchor="middle">{{ shown }}</text>
      <text class="ring-unit" :x="CX" :y="CY + 26" text-anchor="middle">tokens · 整个心智</text>
    </svg>
  </figure>
</template>

<style scoped>
.ring-wrap {
  margin: 2px auto 10px;
  width: 264px;
  user-select: none;
}
.ring-wrap svg { display: block; width: 100%; height: auto; overflow: visible; }

.rl-name { font-size: 11.5px; fill: var(--muted); }
.rl-val { font-size: 11px; fill: var(--gold-2); font-weight: 600; }
.ring-num {
  font-family: var(--serif); font-style: italic; font-weight: 700;
  font-size: 46px; fill: url(#ringNumGrad);
}
.ring-unit { font-size: 11px; letter-spacing: 0.12em; fill: var(--faint); }

@media (max-height: 760px) {
  .ring-wrap { width: 216px; margin-bottom: 4px; }
}
/* 窄屏收窄:给溢出 viewBox 的两侧文字标注留出空间,避免贴边裁切 */
@media (max-width: 640px) {
  .ring-wrap { width: 216px; }
}
</style>
