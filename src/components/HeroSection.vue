<script setup>
import { ref } from 'vue'
import { useHeroCanvas } from '../composables/useHeroCanvas.js'
import FlowDiagram from './FlowDiagram.vue'

defineEmits(['open'])

const canvas = ref(null)
useHeroCanvas(canvas)
</script>

<template>
  <header class="hero" id="top">
    <div class="hero-stage" aria-hidden="true">
      <canvas id="heroCanvas" ref="canvas"></canvas>
    </div>
    <div class="hero-frost" aria-hidden="true"></div>
    <svg class="corner-stars" viewBox="0 0 720 560" aria-hidden="true">
      <defs>
        <path id="spk" d="M12 0C13.2 7.6 16.4 10.8 24 12C16.4 13.2 13.2 16.4 12 24C10.8 16.4 7.6 13.2 0 12C7.6 10.8 10.8 7.6 12 0Z"/>
      </defs>
      <!-- 角落密丛:大而亮 -->
      <use href="#spk" fill="#fff2d0" transform="translate(26 18) scale(0.9)" opacity="0.95"/>
      <use href="#spk" fill="#f6c96b" transform="translate(84 52) scale(0.42)" opacity="0.8"/>
      <use href="#spk" fill="#f6c96b" transform="translate(138 26) scale(0.55)" opacity="0.85" class="tw"/>
      <use href="#spk" fill="#fff2d0" transform="translate(48 98) scale(0.3)" opacity="0.7"/>
      <use href="#spk" fill="#c99b3f" transform="translate(110 108) scale(0.26)" opacity="0.55"/>
      <use href="#spk" fill="#f6c96b" transform="translate(138 128) scale(0.45)" opacity="0.65"/>
      <use href="#spk" fill="#fff2d0" transform="translate(188 68) scale(0.36)" opacity="0.7" class="tw" style="animation-delay:-2s"/>
      <use href="#spk" fill="#f6c96b" transform="translate(18 178) scale(0.4)" opacity="0.7"/>
      <use href="#spk" fill="#c99b3f" transform="translate(76 198) scale(0.22)" opacity="0.5"/>
      <use href="#spk" fill="#fff2d0" transform="translate(138 140) scale(0.28)" opacity="0.55" class="tw" style="animation-delay:-4s"/>
      <!-- 向外渐散:渐稀渐淡 -->
      <use href="#spk" fill="#f6c96b" transform="translate(368 32) scale(0.44)" opacity="0.6"/>
      <use href="#spk" fill="#fff2d0" transform="translate(306 58) scale(0.26)" opacity="0.45"/>
      <use href="#spk" fill="#f6c96b" transform="translate(430 82) scale(0.22)" opacity="0.4" class="tw" style="animation-delay:-1s"/>
      <use href="#spk" fill="#f6c96b" transform="translate(508 112) scale(0.34)" opacity="0.32"/>
      <use href="#spk" fill="#c99b3f" transform="translate(560 62) scale(0.26)" opacity="0.26"/>
      <use href="#spk" fill="#f6c96b" transform="translate(380 168) scale(0.3)" opacity="0.36"/>
      <use href="#spk" fill="#fff2d0" transform="translate(462 152) scale(0.24)" opacity="0.3"/>
      <use href="#spk" fill="#f6c96b" transform="translate(556 204) scale(0.2)" opacity="0.24"/>
      <use href="#spk" fill="#c99b3f" transform="translate(614 66) scale(0.26)" opacity="0.24"/>
      <use href="#spk" fill="#f6c96b" transform="translate(646 152) scale(0.2)" opacity="0.18"/>
      <use href="#spk" fill="#f6c96b" transform="translate(418 276) scale(0.22)" opacity="0.24"/>
      <use href="#spk" fill="#fff2d0" transform="translate(500 302) scale(0.26)" opacity="0.2" class="tw" style="animation-delay:-3s"/>
      <use href="#spk" fill="#c99b3f" transform="translate(580 332) scale(0.18)" opacity="0.16"/>
      <use href="#spk" fill="#f6c96b" transform="translate(662 276) scale(0.2)" opacity="0.14"/>
      <use href="#spk" fill="#f6c96b" transform="translate(348 342) scale(0.18)" opacity="0.18"/>
      <use href="#spk" fill="#f6c96b" transform="translate(298 422) scale(0.2)" opacity="0.14"/>
      <use href="#spk" fill="#fff2d0" transform="translate(452 422) scale(0.16)" opacity="0.12"/>
      <use href="#spk" fill="#c99b3f" transform="translate(558 442) scale(0.24)" opacity="0.12"/>
      <use href="#spk" fill="#f6c96b" transform="translate(622 482) scale(0.16)" opacity="0.1"/>
      <use href="#spk" fill="#f6c96b" transform="translate(238 482) scale(0.2)" opacity="0.12"/>
      <use href="#spk" fill="#f6c96b" transform="translate(138 422) scale(0.26)" opacity="0.16"/>
      <use href="#spk" fill="#fff2d0" transform="translate(88 322) scale(0.3)" opacity="0.3"/>
      <use href="#spk" fill="#f6c96b" transform="translate(38 298) scale(0.26)" opacity="0.36"/>
      <use href="#spk" fill="#c99b3f" transform="translate(58 258) scale(0.18)" opacity="0.4"/>
      <!-- 微尘星点 -->
      <g fill="#f6c96b">
        <circle cx="70" cy="140" r="1.3" opacity="0.4"/><circle cx="180" cy="110" r="1.1" opacity="0.35"/>
        <circle cx="260" cy="40" r="1.2" opacity="0.3"/><circle cx="340" cy="110" r="1" opacity="0.28"/>
        <circle cx="470" cy="50" r="1.2" opacity="0.25"/><circle cx="540" cy="150" r="1" opacity="0.2"/>
        <circle cx="600" cy="230" r="1.1" opacity="0.18"/><circle cx="330" cy="250" r="1" opacity="0.22"/>
        <circle cx="420" cy="350" r="1.2" opacity="0.18"/><circle cx="520" cy="380" r="1" opacity="0.15"/>
        <circle cx="180" cy="360" r="1.2" opacity="0.25"/><circle cx="60" cy="360" r="1" opacity="0.3"/>
        <circle cx="300" cy="480" r="1.1" opacity="0.14"/><circle cx="480" cy="480" r="1" opacity="0.12"/>
      </g>
    </svg>
    <div class="container">
      <div class="hero-stack">
        <div class="hero-brand">
          <div class="hero-eyebrow"><i></i>QQ 群聊 · 拟人化 · 记忆系统</div>
          <h1>Stella</h1>
          <p class="brand-line">依托<strong>记忆系统</strong>的 <strong>QQ 群聊拟人化 AI</strong></p>
        </div>
        <FlowDiagram class="hero-flow" />
        <div class="badges hero-badges">
          <span class="badge b-gold"><i></i>本地小模型</span>
          <span class="badge b-blue"><i></i>在线大 API</span>
          <span class="badge"><i></i>任意混搭</span>
        </div>
        <div class="cta-row">
          <button v-ripple class="btn btn-primary" type="button" data-open-panel @click="$emit('open')">快速开始 →</button>
          <a v-ripple class="btn btn-ghost" href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project" target="_blank" rel="noopener">
            <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" style="vertical-align:-3px"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            前往 GitHub
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 居中三段叙事:是什么 → 8192 公式带(重点) → 跑在什么模型 → 去哪做
   信息权重自上而下递减:主标题绝对主导(字距拉宽占地),其余层级依次收小压暗 */
.hero-stack {
  display: flex; flex-direction: column; align-items: center;
  width: 100%; text-align: center;
}
.hero-stack .hero-eyebrow {
  display: flex; align-items: center; gap: 14px;
  margin-bottom: 26px;
  font-size: 0.75rem; letter-spacing: 0.3em; opacity: 0.88;
  /* 罗盘光晕垫在标题后方,小字加深色描影保证可读 */
  text-shadow: 0 1px 6px rgba(7, 10, 20, 0.95), 0 0 16px rgba(7, 10, 20, 0.85);
}
/* 眉题两侧金色细线,夹持出"题签"感 */
.hero-stack .hero-eyebrow::before,
.hero-stack .hero-eyebrow::after { content: ""; width: 44px; height: 1px; flex: 0 0 auto; }
.hero-stack .hero-eyebrow::before { background: linear-gradient(90deg, transparent, rgba(246, 201, 107, 0.42)); }
.hero-stack .hero-eyebrow::after { background: linear-gradient(90deg, rgba(246, 201, 107, 0.42), transparent); }
.hero-stack h1 {
  margin: 0 0 6px;
  /* 字间距拉宽占地;末字符右侧多出一份字距,padding 等量补回保持光学居中 */
  font-size: clamp(4.2rem, 9.2vw, 7.5rem);
  letter-spacing: 0.1em; padding-left: 0.1em; line-height: 1.04;
  filter: drop-shadow(0 10px 32px rgba(246, 201, 107, 0.18));
}
.brand-line {
  font-size: 1.15rem; letter-spacing: 0.02em; color: rgba(232, 236, 244, 0.8);
  margin-bottom: 34px;
  text-shadow: 0 1px 6px rgba(7, 10, 20, 0.9), 0 0 14px rgba(7, 10, 20, 0.8);
}
.brand-line strong { color: var(--gold-2); font-weight: 600; text-shadow: 0 0 22px rgba(246, 201, 107, 0.26); }
/* 徽章带:顶部细线与公式带轻隔开 */
.hero-badges {
  justify-content: center; width: 100%;
  margin: 0 0 26px; padding-top: 24px; position: relative;
}
.hero-badges::before {
  content: ""; position: absolute; top: 0; left: 50%; transform: translateX(-50%);
  width: min(560px, 72%); height: 1px;
  background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.22), transparent);
}
.hero-stack .cta-row { justify-content: center; margin-bottom: 0; }
.hero-stack .btn { font-size: 1.15rem; padding: 14px 32px; gap: 10px; }

@media (max-width: 880px) {
  .hero-stack .hero-eyebrow { gap: 12px; letter-spacing: 0.22em; margin-bottom: 16px; }
  .hero-stack .hero-eyebrow::before,
  .hero-stack .hero-eyebrow::after { width: 30px; }
  .hero-stack h1 { font-size: clamp(3.2rem, 14vw, 4.6rem); margin-bottom: 8px; }
  .brand-line { margin-bottom: 24px; font-size: 1rem; }
  .hero-badges { margin-bottom: 20px; padding-top: 20px; }
  .hero-stack .btn { font-size: 1.02rem; padding: 12px 26px; }
}
/* 矮屏:收紧标题,保住单屏 */
@media (max-height: 640px) {
  .hero-stack h1 { font-size: clamp(3rem, 8vw, 5rem); }
  .hero-stack .hero-eyebrow { margin-bottom: 16px; }
  .brand-line { margin-bottom: 20px; }
  .fd { margin-bottom: 18px; }
  .hero-badges { margin-bottom: 16px; padding-top: 16px; }
}
</style>
