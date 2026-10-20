<script setup>
// entered:父屏(第二屏)首次进入视口时点亮,触发本图的一次性入场编排
import { t } from '../i18n.js'
defineProps({ entered: { type: Boolean, default: false } })
</script>

<template>
  <!-- 机制主图:三来源(记忆/旧对话/工具)从左侧汇入 8192 核心,产出回复。
       桌面为横向汇聚,窄屏退化为竖排:来源列表 → 8192 → 回复 -->
  <figure class="fd" :class="{ entered: entered }" :aria-label="t('mech.aria')">
    <div class="fd-sources">
      <div class="fd-node"><span class="fd-label">{{ t('mech.n1') }}</span><span class="fd-verb">{{ t('mech.n1s') }}</span></div>
      <div class="fd-node"><span class="fd-label">{{ t('mech.n2') }}</span><span class="fd-verb">{{ t('mech.n2s') }}</span></div>
      <div class="fd-node"><span class="fd-label">{{ t('mech.n3') }}</span><span class="fd-verb">{{ t('mech.n3s') }}</span></div>
    </div>
    <!-- 汇聚连接线:三线收拢进入核心(桌面);pathLength=1 供描线动画归一化 -->
    <svg class="fd-merge" viewBox="0 0 64 192" width="64" height="192" aria-hidden="true" fill="none">
      <defs>
        <marker id="fdah" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="rgba(246,201,107,0.55)"/>
        </marker>
      </defs>
      <line pathLength="1" x1="2" y1="20" x2="52" y2="88" stroke="rgba(246,201,107,0.4)" stroke-width="1.5" marker-end="url(#fdah)"/>
      <line pathLength="1" x1="2" y1="96" x2="50" y2="96" stroke="rgba(246,201,107,0.5)" stroke-width="1.5" marker-end="url(#fdah)"/>
      <line pathLength="1" x1="2" y1="172" x2="52" y2="104" stroke="rgba(246,201,107,0.4)" stroke-width="1.5" marker-end="url(#fdah)"/>
    </svg>
    <!-- 竖排衔接箭头(窄屏) -->
    <svg class="fd-drop" viewBox="0 0 12 34" width="12" height="34" aria-hidden="true" fill="none">
      <line x1="6" y1="0" x2="6" y2="24" stroke="rgba(246,201,107,0.5)" stroke-width="1.6"/>
      <path d="M1 24 L6 33 L11 24 Z" fill="rgba(246,201,107,0.55)"/>
    </svg>
    <div class="fd-core">
      <span class="fd-ring" aria-hidden="true"></span>
      <span class="fd-halo" aria-hidden="true"></span>
      <div class="fd-numwrap"><span class="fd-num">8192</span><span class="fd-unit">tokens</span></div>
    </div>
    <svg class="fd-sep" viewBox="0 0 56 12" width="46" aria-hidden="true" fill="none">
      <line x1="0" y1="6" x2="44" y2="6" stroke="rgba(246,201,107,0.5)" stroke-width="1.6"/>
      <path d="M44 1 L54 6 L44 11 z" fill="rgba(246,201,107,0.55)"/>
    </svg>
    <div class="fd-out">{{ t('mech.out') }}</div>
  </figure>
</template>

<style scoped>
.fd {
  display: flex; align-items: center; justify-content: center;
  margin: 0;
  user-select: none;
}
.fd-sources { display: flex; flex-direction: column; gap: 36px; }
.fd-node {
  display: inline-flex; align-items: baseline; gap: 9px;
  padding: 8px 18px;
  border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 999px;
  background: rgba(255, 255, 255, 0.028);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  white-space: nowrap;
}
.fd-label {
  font-size: 1.02rem; font-weight: 600; color: var(--text);
  /* 固定宽标签盒:白色标签左对齐,金色动词越过它集体左对齐成一列 */
  min-width: 3.2em;
}
.fd-verb { font-size: 0.8rem; color: var(--gold-2); letter-spacing: 0.05em; opacity: 0.9; }

/* 核心:8192 圆环,占屏主视觉 */
.fd-core {
  position: relative; flex: 0 0 auto;
  display: flex; align-items: center; justify-content: center;
  width: 184px; height: 184px; margin: 0 10px;
}
.fd-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px dashed rgba(246, 201, 107, 0.32);
}
.fd-halo {
  position: absolute; inset: -26px; border-radius: 50%;
  background: radial-gradient(circle, rgba(246, 201, 107, 0.1), transparent 68%);
}
@media (prefers-reduced-motion: no-preference) {
  .fd-ring { animation: fdspin 60s linear infinite; }
}
@keyframes fdspin { to { transform: rotate(360deg); } }
.fd-numwrap { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.fd-num {
  font-family: var(--serif); font-style: italic; font-weight: 700;
  font-size: 58px;
  /* 同 .hook-num:斜体墨迹伸出盒外,background-clip:text 需内边距外扩涂色区 */
  padding: 0 0.1em;
  background: linear-gradient(120deg, #ffffff 10%, var(--gold-2) 50%, var(--gold) 90%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.fd-unit { margin-top: 7px; font-size: 10.5px; letter-spacing: 0.3em; padding-left: 0.3em; color: var(--faint); }

.fd-merge { flex: 0 0 auto; }
.fd-drop { display: none; }
.fd-sep { flex: 0 0 auto; margin: 0 2px; }
.fd-out {
  padding: 11px 26px; border-radius: 999px;
  background: linear-gradient(135deg, #f9d98c, #eeb54d);
  color: #241a05; font-size: 1.02rem; font-weight: 700; letter-spacing: 0.06em;
  box-shadow: 0 4px 20px rgba(246, 201, 107, 0.18);
  white-space: nowrap;
}

/* —— 首次入场编排(父屏点亮 entered 后播一次,纯 CSS 不吃节流):
   来源左滑入 → 汇聚线描向核心 → 8192 弹出 → 箭头亮起 → 「回复」落位。
   汇聚线 dasharray 略长于 pathLength(1.02),抵消描线结束时的亚像素缺口 —— */
@media (prefers-reduced-motion: no-preference) {
  .fd-node, .fd-core, .fd-sep, .fd-out, .fd-drop, .fd-merge line { opacity: 0; }
  .fd-sources { --enter-x: -26px; --enter-y: 0px; }
  .fd.entered .fd-sources .fd-node { animation: fdNodeIn .5s cubic-bezier(.22,.61,.36,1) both; }
  .fd.entered .fd-sources .fd-node:nth-child(1) { animation-delay: .18s; }
  .fd.entered .fd-sources .fd-node:nth-child(2) { animation-delay: .32s; }
  .fd.entered .fd-sources .fd-node:nth-child(3) { animation-delay: .46s; }

  .fd-merge line { stroke-dasharray: 1.02; stroke-dashoffset: 1.02; }
  .fd.entered .fd-merge line:nth-of-type(1) { animation: fdDraw .55s ease-out .6s both; }
  .fd.entered .fd-merge line:nth-of-type(2) { animation: fdDraw .55s ease-out .72s both; }
  .fd.entered .fd-merge line:nth-of-type(3) { animation: fdDraw .55s ease-out .84s both; }

  .fd.entered .fd-drop { animation: fdDropIn .5s cubic-bezier(.22,.61,.36,1) .7s both; }
  .fd.entered .fd-core { animation: fdCoreIn .65s cubic-bezier(.34,1.45,.64,1) .95s both; }
  .fd.entered .fd-sep { animation: fdFade .45s ease-out 1.3s both; }
  .fd.entered .fd-out { animation: fdOutIn .5s cubic-bezier(.34,1.56,.64,1) 1.42s both; }
}
@keyframes fdNodeIn {
  from { opacity: 0; transform: translate(var(--enter-x), var(--enter-y)); }
  to { opacity: 1; transform: translate(0, 0); }
}
@keyframes fdDraw {
  0% { stroke-dashoffset: 1.02; opacity: 0; }
  70% { opacity: 1; }
  100% { stroke-dashoffset: 0; opacity: 1; }
}
@keyframes fdDropIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fdCoreIn {
  from { opacity: 0; transform: scale(.68); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes fdFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes fdOutIn {
  from { opacity: 0; transform: scale(.62); }
  to { opacity: 1; transform: scale(1); }
}

/* 窄屏:竖排叙事 来源 → 8192 → 回复 */
@media (max-width: 880px) {
  .fd { flex-direction: column; gap: 14px; }
  .fd-sources { flex-direction: column; gap: 10px; align-items: center; --enter-x: 0px; --enter-y: -16px; }
  .fd-merge { display: none; }
  .fd-drop { display: block; }
  .fd-sep { transform: rotate(90deg); margin: 0; }
  .fd-core { width: 150px; height: 150px; margin: 4px 0; }
  .fd-num { font-size: 46px; }
}
</style>
