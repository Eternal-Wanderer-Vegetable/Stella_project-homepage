<script setup>
import FlowDiagram from './FlowDiagram.vue'
</script>

<template>
  <!-- 第二屏:解释为什么 8192 就够。图接管整屏,文字只留一句论点 + 三行小注 -->
  <section id="mechanism" class="mech">
    <div class="container mech-inner">
      <p class="mech-eyebrow" v-reveal>How · 8192 怎么够用</p>
      <FlowDiagram v-reveal />
      <p class="mech-line" v-reveal style="transition-delay:.1s">
        不是把所有东西塞进 Context。<br>
        <b>而是让信息待在它该待的地方。</b>
      </p>
      <dl class="mech-trio" v-reveal style="transition-delay:.2s">
        <dt>Memory</dt><dd>记住重要的信息</dd>
        <dt>Tools</dt><dd>在上下文之外执行工具</dd>
        <dt>Compression</dt><dd>压缩已经结束的对话</dd>
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

@media (max-width: 880px) {
  .mech { padding-bottom: 48px; }
  .mech-trio { grid-template-columns: 1fr; justify-items: center; gap: 12px; }
  .mech-trio dt { text-align: center; }
  .mech-trio dd { text-align: center; }
  .mech-line br { display: none; }
}
</style>
