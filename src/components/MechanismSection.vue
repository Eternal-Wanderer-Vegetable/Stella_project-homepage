<script setup>
import FlowDiagram from './FlowDiagram.vue'
import { useEnterOnce } from '../composables/useEnterOnce.js'
import { t } from '../i18n.js'

// 首次入场编排:整屏第一次进入视口时点亮 entered,图与文字按分镜依次就位;
// 只播一次,离开再回来不重播。减弱动效/无 IntersectionObserver 时直接呈现完整画面。
const { root, entered } = useEnterOnce()
</script>

<template>
  <!-- 第二屏:解释为什么 8192 就够。图接管整屏,文字只留一句论点 + 三行小注 -->
  <section id="mechanism" ref="root" class="mech" :class="{ entered: entered }">
    <div class="container mech-inner">
      <p class="mech-eyebrow">{{ t('mech.eyebrow') }}</p>
      <FlowDiagram :entered="entered" />
      <p class="mech-line">
        {{ t('mech.line1') }}<br>
        <b>{{ t('mech.line2') }}</b>
      </p>
      <dl class="mech-trio">
        <dt>Memory</dt><dd>{{ t('mech.t1') }}</dd>
        <dt>Tools</dt><dd>{{ t('mech.t2') }}</dd>
        <dt>Compression</dt><dd>{{ t('mech.t3') }}</dd>
      </dl>
    </div>
  </section>
</template>

<style scoped>
.mech {
  min-height: 100vh;
  min-height: 100svh;
  display: flex; align-items: center;
  padding: calc(var(--nav-h) + 48px) 0 64px;
}
.mech-inner {
  display: flex; flex-direction: column; align-items: center;
  width: 100%; text-align: center;
}
.mech-eyebrow {
  font-size: 0.74rem; font-weight: 600; letter-spacing: 0.3em;
  color: var(--gold); margin-bottom: clamp(36px, 6vh, 64px);
  text-transform: uppercase;
}
.mech-eyebrow::before, .mech-eyebrow::after { content: "·"; margin: 0 12px; opacity: 0.6; }

.mech-line {
  margin-top: clamp(36px, 6vh, 60px);
  font-family: var(--serif); font-weight: 500;
  font-size: clamp(1.3rem, 2.8vw, 1.85rem);
  line-height: 1.7; color: var(--muted);
}
.mech-line b { color: var(--text); font-weight: 700; }

/* 两列网格:金色术语列(dt)右对齐,白色说明列(dd)左对齐——
   dt/dd 必须是 dl 的直接子元素,行宽才能共用同一对列轨 */
.mech-trio {
  margin: clamp(30px, 5vh, 48px) 0 0;
  display: inline-grid;
  grid-template-columns: auto auto;
  align-items: baseline;
  gap: 10px 18px;
}
.mech-trio dt {
  font-family: var(--mono); font-size: 0.78rem; font-weight: 600;
  letter-spacing: 0.18em; color: var(--gold);
  text-align: right;
}
.mech-trio dd { margin: 0; font-size: 0.86rem; color: var(--faint); }

/* —— 首次入场:文字层与图同步编排(图内节奏在 FlowDiagram 内,时轴对齐) —— */
@media (prefers-reduced-motion: no-preference) {
  .mech-eyebrow, .mech-line, .mech-trio { opacity: 0; }
  .mech.entered .mech-eyebrow { animation: mechRise .6s cubic-bezier(.22,.61,.36,1) both; }
  .mech.entered .mech-line { animation: mechRise .7s cubic-bezier(.22,.61,.36,1) 1.05s both; }
  .mech.entered .mech-trio { animation: mechRise .7s cubic-bezier(.22,.61,.36,1) 1.2s both; }
}
@keyframes mechRise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 880px) {
  .mech { padding-bottom: 48px; }
  .mech-trio { grid-template-columns: 1fr; justify-items: center; gap: 12px; }
  .mech-trio dt { text-align: center; }
  .mech-trio dd { text-align: center; }
  .mech-line br { display: none; }
}
</style>
