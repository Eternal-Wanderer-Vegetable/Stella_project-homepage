<script setup>
import { computed, ref } from 'vue'
import { useEnterOnce } from '../composables/useEnterOnce.js'
import { t, locale } from '../i18n.js'
import chatData from '../content/memory-chat.json'

// 聊天内容外置:编辑 src/content/memory-chat.json 即可改写本屏对话,改完重新构建生效。
// 字段:aria — 整卡读屏描述;messages[] —
//   from: "vegetable"(右侧蓝 V)/ "stella"(左侧金 ✦),决定方向与头像
//   text: 气泡正文;name: 可选,覆盖显示名;recall: true 时气泡金色高亮(记忆的证据)
// en 块为英文版对话(可选),缺失时回退中文。

// 首次入场编排:左右两栏同时浮起,左栏气泡按条铺开,recall 落定后金光脉冲。
// 间隔随条数自适应(总时长封顶约 7s):短对话仍 .4s/条,长对话压缩节奏。
const { root, entered } = useEnterOnce()

const chat = computed(() => (locale.value === 'en' && chatData.en) ? chatData.en : chatData)

const MSG_START = 0.25
const MSG_STEP = Math.min(0.4, 7 / Math.max(1, chatData.messages.length - 1))
const msgDelay = (i) => (MSG_START + i * MSG_STEP).toFixed(2) + 's'
const pulseDelay = (i) => (MSG_START + i * MSG_STEP + 0.55).toFixed(2) + 's'
const asideDelay = '0.1s'
const asideWordsDelay = '0.35s'

// 聊天窗可滚动但不自动跟随;入场后给一个「可向下滚动」的提示,一开始滚动就收掉。
const chatEl = ref(null)
const hintGone = ref(false)
function onChatScroll() {
  const el = chatEl.value
  if (el && el.scrollTop > 8) hintGone.value = true
}
</script>

<template>
  <!-- 第三屏:证明她不是概念项目。一段真实聊天记录 + 一句"她记得。",不做任何解释 -->
  <section id="memory" ref="root" class="mem" :class="{ entered: entered }">
    <div class="container mem-grid">
      <div class="chat-col">
        <div class="chat-wrap">
          <div class="chat" role="log" tabindex="0" :aria-label="chat.aria"
               ref="chatEl" @scroll="onChatScroll">
            <div v-for="(m, i) in chat.messages" :key="i"
                 class="msg" :class="m.from === 'stella' ? 'left' : 'right'"
                 :style="{ animationDelay: msgDelay(i) }">
              <span class="ava" :class="m.from === 'stella' ? 's' : 'v'" aria-hidden="true">{{ m.from === 'stella' ? '✦' : 'V' }}</span>
              <div class="bubble-wrap">
                <span class="name">{{ m.name || (m.from === 'stella' ? 'Stella' : 'Vegetable') }}</span>
                <div class="bubble" :class="{ s: m.from === 'stella', recall: m.recall }"
                     :style="m.recall ? { '--pulse-delay': pulseDelay(i) } : null">{{ m.text }}</div>
              </div>
            </div>
          </div>
          <span class="scroll-hint" :class="{ gone: hintGone }" aria-hidden="true">
            <span class="chev">↓</span>{{ t('mem.scrollHint') }}
          </span>
        </div>
        <p class="chat-note">{{ t('mem.note1') }}</p>
        <p class="chat-note">{{ t('mem.note2') }}</p>
      </div>
      <div class="aside">
        <p class="aside-line" :style="{ animationDelay: asideDelay }">{{ t('mem.aside') }}</p>
        <p class="aside-words" :style="{ animationDelay: asideWordsDelay }">{{ t('mem.words') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.mem {
  min-height: 100vh;
  min-height: 100svh;
  display: flex; align-items: center;
  padding: calc(var(--nav-h) + 48px) 0 64px;
}
.mem-grid {
  display: grid; grid-template-columns: minmax(0, 30fr) minmax(0, 22fr);
  gap: clamp(36px, 6vw, 84px);
  align-items: center;
  width: 100%;
}

/* 聊天窗口:定高滚动,像真的聊天界面;Stella 靠左金调,Vegetable 靠右中性。
   列容器限宽,wrap 承载滚动提示定位,卡片下方两行小字注释 */
.chat-col {
  max-width: 520px;
}
.chat-wrap {
  position: relative;
}
.chat {
  display: flex; flex-direction: column; gap: 12px;
  width: 100%;
  max-height: min(72vh, 660px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
  padding: clamp(22px, 3.4vw, 38px);
  border: 1px solid var(--border-soft);
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
}
.chat::-webkit-scrollbar { width: 6px; }
.chat::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.16); border-radius: 3px; }
.chat:focus-visible { outline: 1px solid rgba(246, 201, 107, 0.45); outline-offset: 3px; }
/* 精细指针:聊天窗边界由整页翻页接管(见 usePageGlide),不放行链式滚动;
   触屏设备保留自然链式,避免近全宽的聊天窗困住触摸翻页 */
@media (pointer: fine) {
  .chat { overscroll-behavior: contain; }
}
.scroll-hint {
  position: absolute; left: 50%; bottom: 12px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 7px;
  padding: 5px 14px;
  border: 1px solid var(--border-soft);
  border-radius: 999px;
  background: rgba(10, 12, 18, 0.82);
  font-size: 0.72rem; letter-spacing: 0.08em;
  color: var(--faint);
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity .4s ease;
}
.mem.entered .scroll-hint { opacity: 1; transition-delay: .9s; }
.mem.entered .scroll-hint.gone { opacity: 0; transition-delay: 0s; }
.scroll-hint .chev { color: var(--gold); }
.chat-note {
  margin: 14px 6px 0;
  font-size: 0.68rem;
  line-height: 1.6;
  letter-spacing: 0.02em;
  color: var(--faint);
}
.chat-note + .chat-note { margin-top: 4px; }
.msg {
  display: flex; gap: 12px; align-items: flex-start;
  transform-origin: left bottom;
}
.msg.right { flex-direction: row-reverse; transform-origin: right bottom; }
.ava {
  flex: 0 0 auto;
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 0.86rem; font-weight: 700;
}
.ava.v { background: rgba(122, 162, 247, 0.16); border: 1px solid rgba(122, 162, 247, 0.3); color: var(--blue); }
.ava.s { background: rgba(246, 201, 107, 0.14); border: 1px solid rgba(246, 201, 107, 0.4); color: var(--gold); text-shadow: 0 0 8px rgba(246, 201, 107, 0.6); }
.bubble-wrap { display: flex; flex-direction: column; gap: 5px; max-width: 78%; }
.msg.right .bubble-wrap { align-items: flex-end; }
.name { font-size: 0.7rem; letter-spacing: 0.08em; color: var(--faint); }
.bubble {
  position: relative;
  padding: 10px 16px;
  border-radius: 4px 16px 16px 16px;
  background: rgba(255, 255, 255, 0.055);
  border: 1px solid var(--border-soft);
  font-size: 0.95rem; line-height: 1.65;
}
.msg.right .bubble { border-radius: 16px 4px 16px 16px; }
.bubble.s {
  background: rgba(246, 201, 107, 0.08);
  border-color: rgba(246, 201, 107, 0.26);
}
/* 那句"翻旧账"是全场重点:轻微金光,不解释 */
.bubble.recall {
  border-color: rgba(246, 201, 107, 0.42);
  background: linear-gradient(135deg, rgba(246, 201, 107, 0.13), rgba(246, 201, 107, 0.05));
  box-shadow: 0 0 26px rgba(246, 201, 107, 0.08);
}
/* 落定后的金色微光脉冲层:只动这张覆盖层,不碰气泡本体样式 */
.bubble.recall::after {
  content: ""; position: absolute; inset: -1px;
  border-radius: inherit;
  background: radial-gradient(130% 170% at 18% 25%, rgba(246, 201, 107, 0.3), transparent 62%);
  opacity: 0; pointer-events: none;
}

.aside { text-align: center; }
.aside-line {
  font-family: var(--serif); font-weight: 700;
  font-size: clamp(2.4rem, 5.4vw, 3.8rem);
  letter-spacing: 0.06em;
  background: linear-gradient(120deg, #ffffff 10%, var(--gold-2) 55%, var(--gold) 95%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  filter: drop-shadow(0 10px 30px rgba(246, 201, 107, 0.16));
}
.aside-words {
  margin-top: 22px;
  font-size: 0.8rem; letter-spacing: 0.22em;
  color: var(--faint);
}

/* —— 首次入场:左右两栏同时浮起 → 左栏气泡像收消息一样逐条弹出(间隔自适应,
   行内 animationDelay 按条数铺开)→ recall 落定后来一次金光脉冲;
   「可向下滚动」提示在窗口落定后淡入,一开始滚动即收起 —— */
@media (prefers-reduced-motion: no-preference) {
  .chat, .msg, .aside-line, .aside-words, .chat-note { opacity: 0; }
  .mem.entered .chat { animation: cardIn .5s cubic-bezier(.22,.61,.36,1) both; }
  .mem.entered .msg { animation: bubbleIn .5s cubic-bezier(.34,1.45,.64,1) both; }
  .mem.entered .aside-line { animation: asideIn .7s cubic-bezier(.22,.61,.36,1) both; }
  .mem.entered .aside-words { animation: asideIn .7s cubic-bezier(.22,.61,.36,1) both; }
  .mem.entered .chat-note { animation: asideIn .7s cubic-bezier(.22,.61,.36,1) both; animation-delay: .55s; }
  .mem.entered .bubble.recall::after { animation: recallPulse 1.2s ease-out both; animation-delay: var(--pulse-delay, 1.5s); }
  .mem.entered .scroll-hint .chev { animation: chevBob 1.6s ease-in-out infinite; }
}
@keyframes cardIn {
  from { opacity: 0; transform: translateY(26px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes bubbleIn {
  from { opacity: 0; transform: translateY(12px) scale(.92); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes asideIn {
  from { opacity: 0; transform: translateY(18px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes recallPulse {
  0% { opacity: 0; }
  45% { opacity: 0.85; }
  100% { opacity: 0; }
}
@keyframes chevBob {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}

@media (max-width: 880px) {
  .mem-grid { grid-template-columns: 1fr; gap: 40px; }
  .chat-col { margin: 0 auto; width: 100%; }
  .bubble-wrap { max-width: 86%; }
}
</style>
