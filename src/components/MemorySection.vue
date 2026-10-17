<script setup>
import { useEnterOnce } from '../composables/useEnterOnce.js'
import chat from '../content/memory-chat.json'

// 聊天内容外置:编辑 src/content/memory-chat.json 即可改写本屏对话,改完重新构建生效。
// 字段:aria — 整卡读屏描述;messages[] —
//   from: "vegetable"(右侧蓝 V)/ "stella"(左侧金 ✦),决定方向与头像
//   text: 气泡正文;name: 可选,覆盖显示名;recall: true 时气泡金色高亮(「翻旧账」重点)

// 首次入场编排:卡片浮起后气泡按条铺开(每条间隔 .4s),recall 落定后金光脉冲,
// 「她记得。」等最后一条气泡落地才浮现——punchline 在证据之后
const { root, entered } = useEnterOnce()

const MSG_START = 0.25
const MSG_STEP = 0.4
const LAST = MSG_START + (chat.messages.length - 1) * MSG_STEP
const msgDelay = (i) => (MSG_START + i * MSG_STEP).toFixed(2) + 's'
const pulseDelay = (i) => (MSG_START + i * MSG_STEP + 0.55).toFixed(2) + 's'
const asideDelay = (LAST + 0.5).toFixed(2) + 's'
const asideWordsDelay = (LAST + 0.75).toFixed(2) + 's'
</script>

<template>
  <!-- 第三屏:证明她不是概念项目。一次真实群聊 + 一句"她记得。",不做任何解释 -->
  <section id="memory" ref="root" class="mem" :class="{ entered: entered }">
    <div class="container mem-grid">
      <div class="chat" role="img" :aria-label="chat.aria">
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
      <div class="aside">
        <p class="aside-line" :style="{ animationDelay: asideDelay }">她记得。</p>
        <p class="aside-words" :style="{ animationDelay: asideWordsDelay }">长期记忆 · 群聊上下文 · 主动参与</p>
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

/* 群聊卡片:暗色气泡,Stella 靠左金调,Vegetable 靠右中性 */
.chat {
  display: flex; flex-direction: column; gap: 22px;
  max-width: 520px;
  padding: clamp(22px, 3.4vw, 38px);
  border: 1px solid var(--border-soft);
  border-radius: 22px;
  background: linear-gradient(160deg, rgba(255, 255, 255, 0.035), rgba(255, 255, 255, 0.012));
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.42);
}
.msg {
  display: flex; gap: 12px; align-items: flex-end;
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

/* —— 首次入场:卡片浮起 → 气泡像收消息一样逐条弹出(间隔 .4s,由行内
   animationDelay 按条数铺开)→ recall 落定后来一次金光脉冲 → 「她记得。」压轴 —— */
@media (prefers-reduced-motion: no-preference) {
  .chat, .msg, .aside-line, .aside-words { opacity: 0; }
  .mem.entered .chat { animation: cardIn .5s cubic-bezier(.22,.61,.36,1) both; }
  .mem.entered .msg { animation: bubbleIn .5s cubic-bezier(.34,1.45,.64,1) both; }
  .mem.entered .aside-line { animation: asideIn .7s cubic-bezier(.22,.61,.36,1) both; }
  .mem.entered .aside-words { animation: asideIn .7s cubic-bezier(.22,.61,.36,1) both; }
  .mem.entered .bubble.recall::after { animation: recallPulse 1.2s ease-out both; animation-delay: var(--pulse-delay, 1.5s); }
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

@media (max-width: 880px) {
  .mem-grid { grid-template-columns: 1fr; gap: 40px; }
  .chat { margin: 0 auto; width: 100%; }
  .bubble-wrap { max-width: 86%; }
}
</style>
