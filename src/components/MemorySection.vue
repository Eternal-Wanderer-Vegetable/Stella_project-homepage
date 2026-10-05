<template>
  <!-- 第三屏:证明她不是概念项目。一次真实群聊 + 一句"她记得。",不做任何解释 -->
  <section id="memory" class="mem">
    <div class="container mem-grid">
      <div class="chat" v-reveal role="img" aria-label="群聊示意:Vegetable 说准备把模块换 Rust,Stella 记得他上次的抱怨并反问,Vegetable 回了一个字。">
        <div class="msg right">
          <span class="ava v" aria-hidden="true">V</span>
          <div class="bubble-wrap">
            <span class="name">Vegetable</span>
            <div class="bubble">最近准备把那个模块换 Rust。</div>
          </div>
        </div>
        <div class="msg left" style="transition-delay:.35s">
          <span class="ava s" aria-hidden="true">✦</span>
          <div class="bubble-wrap">
            <span class="name">Stella</span>
            <div class="bubble s">？</div>
          </div>
        </div>
        <div class="msg left" style="transition-delay:.7s">
          <span class="ava s" aria-hidden="true">✦</span>
          <div class="bubble-wrap">
            <span class="name">Stella</span>
            <div class="bubble s recall">你上次迁移 Python 那块的时候不是还说“以后再也不干这种事了吗”</div>
          </div>
        </div>
        <div class="msg right" style="transition-delay:1.05s">
          <span class="ava v" aria-hidden="true">V</span>
          <div class="bubble-wrap">
            <span class="name">Vegetable</span>
            <div class="bubble">草</div>
          </div>
        </div>
      </div>
      <div class="aside">
        <p class="aside-line" v-reveal style="transition-delay:.5s">她记得。</p>
        <p class="aside-words" v-reveal style="transition-delay:.75s">长期记忆 · 群聊上下文 · 主动参与</p>
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
.msg { display: flex; gap: 12px; align-items: flex-end; }
.msg.right { flex-direction: row-reverse; }
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

@media (max-width: 880px) {
  .mem-grid { grid-template-columns: 1fr; gap: 40px; }
  .chat { margin: 0 auto; width: 100%; }
  .bubble-wrap { max-width: 86%; }
}
</style>
