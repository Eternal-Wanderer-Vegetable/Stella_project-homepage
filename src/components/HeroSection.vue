<script setup>
import { ref } from 'vue'
import { useHeroCanvas } from '../composables/useHeroCanvas.js'

// 首屏即钩子:8192 → Enough to remember you. → Stella 一句话 → 行动
// 往下滚交给第二屏解释"为什么 8192 就够"
const emit = defineEmits(['open'])

const canvas = ref(null)
useHeroCanvas(canvas)

function toMechanism() {
  const el = document.getElementById('mechanism')
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
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
        <p class="hero-eyebrow"><span class="star" aria-hidden="true">✦</span>Stella · QQ 群聊拟人化 AI</p>
        <div class="hook-num" aria-hidden="true">8192</div>
        <div class="hook-unit" aria-hidden="true">tokens</div>
        <p class="hook-line">Enough to remember you.</p>
        <h1 class="hook-cn">会记得你的 AI，只需要 <b>8192 tokens</b>。</h1>
        <div class="cta-row">
          <button v-ripple class="btn btn-primary" type="button" @click="emit('open', 'quickstart')">开始使用 →</button>
          <a v-ripple class="btn btn-ghost" href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project" target="_blank" rel="noopener">
            <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor" style="vertical-align:-3px"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>
            GitHub
          </a>
        </div>
      </div>
    </div>
    <button class="scroll-cue" type="button" aria-label="向下滚动:为什么 8192 就够" @click="toMechanism">
      <span>为什么 8192 就够？</span>
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M5 9l7 7 7-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </header>
</template>

<style scoped>
/* 首屏 = 视觉钩子:巨型 8192 独占视觉焦点,信息层级依次收小:
   眉题 → 8192 → TOKENS → 英文钩句 → 中文主标题 → 行动按钮,再无其他 */
.hero-stack {
  display: flex; flex-direction: column; align-items: center;
  width: 100%; text-align: center;
}
.hero-stack .hero-eyebrow {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: clamp(20px, 4vh, 40px);
  font-size: 0.78rem; letter-spacing: 0.3em; opacity: 0.85;
  text-shadow: 0 1px 6px rgba(7, 10, 20, 0.95), 0 0 16px rgba(7, 10, 20, 0.85);
}
.hero-stack .hero-eyebrow .star { color: var(--gold); text-shadow: 0 0 12px rgba(246, 201, 107, 0.7); }

/* 巨型 8192:整个网站的视觉钩子,越大越敢 */
.hook-num {
  font-family: var(--serif); font-style: italic; font-weight: 700;
  font-size: clamp(5.6rem, 17vw, 12.5rem);
  line-height: 0.95; letter-spacing: 0.015em; padding-left: 0.015em;
  background: linear-gradient(120deg, #ffffff 8%, var(--gold-2) 42%, var(--gold) 66%, #c99b3f 96%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  filter: drop-shadow(0 14px 44px rgba(246, 201, 107, 0.22));
}
.hook-unit {
  margin-top: 10px;
  font-size: 0.92rem; font-weight: 600;
  letter-spacing: 0.62em; padding-left: 0.62em;
  color: var(--muted);
  text-shadow: 0 1px 6px rgba(7, 10, 20, 0.9);
}
/* 钩句:数字之下慢慢浮现的一句话,制造"为什么才 8192?"的疑问 */
.hook-line {
  margin-top: clamp(16px, 3vh, 30px);
  font-family: var(--serif); font-style: italic;
  font-size: clamp(1.15rem, 2.4vw, 1.55rem);
  color: var(--gold-2);
  text-shadow: 0 0 24px rgba(246, 201, 107, 0.3), 0 1px 8px rgba(7, 10, 20, 0.9);
}
.hook-cn {
  margin: 14px 0 0;
  font-family: var(--serif); font-weight: 600;
  font-size: clamp(1.28rem, 2.9vw, 1.8rem);
  letter-spacing: 0.02em; line-height: 1.5;
  text-shadow: 0 1px 8px rgba(7, 10, 20, 0.92), 0 0 18px rgba(7, 10, 20, 0.85);
}
.hook-cn b { color: var(--gold-2); font-weight: 700; text-shadow: 0 0 22px rgba(246, 201, 107, 0.3); }

.hero-stack .cta-row { justify-content: center; margin: clamp(24px, 4.5vh, 44px) 0 0; }
.hero-stack .btn { font-size: 1.12rem; padding: 13px 30px; gap: 10px; }

/* 滚动暗示:把"5 秒疑问"直接写在屏底 */
.scroll-cue {
  position: absolute; left: 50%; bottom: 22px; transform: translateX(-50%);
  z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 8px 14px;
  border: none; background: none; cursor: pointer;
  font-family: inherit; font-size: 0.8rem; letter-spacing: 0.14em;
  color: var(--faint);
  transition: color .25s;
}
.scroll-cue:hover { color: var(--gold-2); }
.scroll-cue svg { animation: cuebob 2.2s ease-in-out infinite; }
@keyframes cuebob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(5px); } }

/* 入场:数字先立住,钩句与主标题随后浮现(尊重系统减弱动效) */
@media (prefers-reduced-motion: no-preference) {
  .hero-stack > * , .scroll-cue { animation: rise .85s cubic-bezier(.22,.61,.36,1) both; }
  .hero-stack .hero-eyebrow { animation-delay: .1s; }
  .hook-num { animation-delay: .28s; }
  .hook-unit { animation-delay: .55s; }
  .hook-line { animation-delay: 1s; }
  .hook-cn { animation-delay: 1.3s; }
  .hero-stack .cta-row { animation-delay: 1.6s; }
  .scroll-cue { animation-name: cuefade; animation-delay: 2.1s; animation-duration: 1s; }
}
@keyframes rise { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
@keyframes cuefade { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .scroll-cue svg { animation: none; }
}

@media (max-width: 880px) {
  .hero-stack .hero-eyebrow { letter-spacing: 0.22em; font-size: 0.72rem; }
  .hook-unit { font-size: 0.8rem; }
  .hero-stack .btn { font-size: 1rem; padding: 12px 24px; }
  .scroll-cue { bottom: 12px; }
}
/* 矮屏:收紧数字,保住单屏 */
@media (max-height: 640px) {
  .hook-num { font-size: clamp(4.2rem, 13vh, 7rem); }
  .hero-stack .hero-eyebrow { margin-bottom: 14px; }
  .hook-line { margin-top: 12px; }
  .hero-stack .cta-row { margin-top: 20px; }
}
</style>
