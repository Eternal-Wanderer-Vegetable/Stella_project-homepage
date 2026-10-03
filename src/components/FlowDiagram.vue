<script setup>
import { ref, onMounted } from 'vue'

// 右栏实现流程图(图形主导,文字辅助):
// 三个图标源节点经曲线汇入核心「8192」,再落入「拟人化输出」
// 动画由 rAF 单进度值驱动(部分内嵌浏览器冻结 CSS 动画时钟,不依赖 CSS transition)
const SOURCES = [
  { x: 110, emoji: '🧠', label: '记忆库', verb: '筛完才注入', vx: 122, vy: 172, anchor: 'start' },
  { x: 280, emoji: '🧰', label: '工具调用', verb: '上下文外执行', vx: 292, vy: 152, anchor: 'start' },
  { x: 450, emoji: '💬', label: '旧对话', verb: '滚出即压缩', vx: 438, vy: 172, anchor: 'end' },
]
const CX = 280, CY = 242, R = 62

const reduced = typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const p = ref(reduced ? 1 : 0)     // 主进度
const spin = ref(reduced ? 0 : 0)  // 装饰环旋转角

const clamp01 = (x) => Math.max(0, Math.min(1, x))
const nodeP = (i) => clamp01((p.value - (0.04 + i * 0.13)) / 0.26)
const pathP = (i) => clamp01((p.value - (0.14 + i * 0.13)) / 0.3)
const coreP = () => clamp01((p.value - 0.5) / 0.28)
const outP = () => clamp01((p.value - 0.72) / 0.28)

onMounted(() => {
  if (reduced) return
  const t0 = performance.now()
  const DUR = 1900
  const tick = (now) => {
    p.value = Math.min(1, (now - t0) / DUR)
    spin.value = ((now - t0) / 40) % 360
    if (p.value < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})
</script>

<template>
  <figure class="fd-wrap" aria-label="Stella 的实现流程:记忆库经筛完才注入、工具调用经上下文外执行、旧对话经滚出即压缩,三条通路汇入 8192 tokens 的核心,产出拟人化输出。">
    <svg viewBox="0 0 560 392" role="img" aria-hidden="true">
      <defs>
        <linearGradient id="fdNumGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#ffffff"/>
          <stop offset="0.5" stop-color="#ffe3a3"/>
          <stop offset="1" stop-color="#f6c96b"/>
        </linearGradient>
        <linearGradient id="fdPillGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#f9d98c"/>
          <stop offset="1" stop-color="#eeb54d"/>
        </linearGradient>
        <linearGradient id="fdCoreGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="rgba(246,201,107,0.85)"/>
          <stop offset="1" stop-color="rgba(201,155,63,0.45)"/>
        </linearGradient>
        <marker id="fdArrow" viewBox="0 0 10 10" refX="8" refY="5"
                markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="rgba(246,201,107,0.6)"/>
        </marker>
        <radialGradient id="fdCoreFill" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stop-color="rgba(255,236,190,0.14)"/>
          <stop offset="1" stop-color="rgba(246,201,107,0.03)"/>
        </radialGradient>
      </defs>

      <!-- 汇聚曲线(先画,置于节点下层) -->
      <g fill="none" stroke="rgba(246,201,107,0.5)" stroke-width="1.6">
        <path d="M110 118 C 110 185, 195 195, 226 206" pathLength="1"
              :style="{ strokeDasharray: 1, strokeDashoffset: 1 - pathP(0) }" marker-end="url(#fdArrow)"/>
        <path d="M280 118 L 280 172" pathLength="1"
              :style="{ strokeDasharray: 1, strokeDashoffset: 1 - pathP(1) }" marker-end="url(#fdArrow)"/>
        <path d="M450 118 C 450 185, 365 195, 334 206" pathLength="1"
              :style="{ strokeDasharray: 1, strokeDashoffset: 1 - pathP(2) }" marker-end="url(#fdArrow)"/>
      </g>

      <!-- 动词标注(辅助文字) -->
      <g class="fd-verbs">
        <text v-for="(s, i) in SOURCES" :key="'v' + i"
              :x="s.vx" :y="s.vy" :text-anchor="s.anchor"
              :style="{ opacity: pathP(i) }">{{ s.verb }}</text>
      </g>

      <!-- 源节点:图标圆 + 辅助标签 -->
      <g v-for="(s, i) in SOURCES" :key="'n' + i"
         :style="{ opacity: nodeP(i), transform: `translateY(${(1 - nodeP(i)) * 10}px)` }">
        <circle :cx="s.x" cy="74" r="40" fill="rgba(255,255,255,0.03)" stroke="rgba(148,163,184,0.2)"/>
        <text :x="s.x" y="70" text-anchor="middle" class="fd-emoji">{{ s.emoji }}</text>
        <text :x="s.x" y="93" text-anchor="middle" class="fd-label">{{ s.label }}</text>
      </g>

      <!-- 核心:8192 -->
      <g :style="{ opacity: coreP() }">
        <circle :cx="CX" :cy="CY" r="74" fill="none" stroke="rgba(246,201,107,0.3)"
                stroke-width="1" stroke-dasharray="3 7"
                :transform="`rotate(${spin} ${CX} ${CY})`"/>
        <circle :cx="CX" :cy="CY" :r="R" fill="url(#fdCoreFill)" stroke="url(#fdCoreGrad)"
                stroke-width="2" style="filter: drop-shadow(0 0 10px rgba(246,201,107,0.35))"/>
        <text :x="CX" :y="CY + 10" text-anchor="middle" class="fd-num">8192</text>
        <text :x="CX" :y="CY + 30" text-anchor="middle" class="fd-unit">tokens</text>
      </g>

      <!-- 输出:拟人化输出 -->
      <g :style="{ opacity: outP(), transform: `translateY(${(1 - outP()) * 8}px)` }">
        <line :x1="CX" y1="312" :x2="CX" y2="330" stroke="rgba(246,201,107,0.55)"
              stroke-width="1.6" marker-end="url(#fdArrow)"/>
        <rect x="195" y="338" width="170" height="38" rx="19" fill="url(#fdPillGrad)"/>
        <text x="280" y="362" text-anchor="middle" class="fd-out">拟人化输出</text>
      </g>
    </svg>
  </figure>
</template>

<style scoped>
.fd-wrap {
  margin: 0 auto;
  max-width: 540px;
  width: 100%;
  user-select: none;
}
.fd-wrap svg { display: block; width: 100%; height: auto; overflow: visible; }

.fd-emoji { font-size: 26px; }
.fd-label { font-size: 12px; fill: var(--muted); }
.fd-verbs text {
  font-size: 12px; fill: var(--gold-2); letter-spacing: 0.04em;
  paint-order: stroke; stroke: rgba(7, 10, 20, 0.85); stroke-width: 3px;
}
.fd-num {
  font-family: var(--serif); font-style: italic; font-weight: 700;
  font-size: 38px; fill: url(#fdNumGrad);
}
.fd-unit { font-size: 11px; letter-spacing: 0.14em; fill: var(--faint); }
.fd-out {
  font-size: 14.5px; font-weight: 700; fill: #241a05; letter-spacing: 0.06em;
}
</style>
