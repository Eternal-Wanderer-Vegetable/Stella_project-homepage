<script setup>
const emit = defineEmits(['open'])
</script>

<template>
  <!-- 最后一屏:把用户送出去。没有博客、没有 Roadmap,只有一句话和一个按钮 -->
  <footer class="foot">
    <div class="foot-inner">
      <span class="foot-star" v-reveal aria-hidden="true">✦</span>
      <p class="foot-brand" v-reveal style="transition-delay:.12s">Stella</p>
      <p class="foot-line" v-reveal style="transition-delay:.24s">A small context.<br>A long memory.</p>
      <div class="foot-cta" v-reveal style="transition-delay:.36s">
        <button v-ripple class="btn btn-primary" type="button" @click="emit('open', 'quickstart')">Get Stella</button>
      </div>
      <!-- 用 div 而非 nav:全局 nav 选择器是顶栏的 position:fixed 样式,会误伤此处 -->
      <div class="foot-links" v-reveal style="transition-delay:.48s">
        <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project" target="_blank" rel="noopener">GitHub</a>
        <span class="dot" aria-hidden="true">·</span>
        <button type="button" @click="emit('open', 'docs')">Docs</button>
        <span class="dot" aria-hidden="true">·</span>
        <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/blob/main/LICENSE" target="_blank" rel="noopener">License</a>
      </div>
      <p class="foot-copy" v-reveal style="transition-delay:.6s">© 2026 Eternal-Wanderer-Vegetable · Stella Project</p>
    </div>
  </footer>
</template>

<style scoped>
.foot {
  min-height: 100vh;
  min-height: 100svh;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  position: relative;
  padding: calc(var(--nav-h) + 32px) 0 40px;
  border-top: 1px solid var(--border-soft);
  background:
    radial-gradient(720px 420px at 50% 108%, rgba(246, 201, 107, 0.07), transparent 70%),
    linear-gradient(180deg, var(--bg), var(--bg-2));
}
.foot-inner {
  display: flex; flex-direction: column; align-items: center;
}
.foot-star {
  font-size: 1.5rem; color: var(--gold);
  text-shadow: 0 0 22px rgba(246, 201, 107, 0.8);
  margin-bottom: 22px;
}
.foot-brand {
  font-family: var(--serif); font-style: italic; font-weight: 600;
  font-size: clamp(2.6rem, 6.5vw, 4rem); line-height: 1.1;
  background: linear-gradient(120deg, #ffffff 12%, var(--gold-2) 46%, var(--gold) 64%, #c99b3f 96%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  filter: drop-shadow(0 12px 36px rgba(246, 201, 107, 0.2));
}
.foot-line {
  margin-top: 18px;
  font-family: var(--serif); font-style: italic;
  font-size: clamp(1.02rem, 2vw, 1.25rem);
  line-height: 1.8; letter-spacing: 0.04em;
  color: var(--muted);
}
.foot-cta { margin-top: clamp(30px, 5vh, 46px); }
.foot-cta .btn { font-size: 1.05rem; padding: 13px 32px; }
.foot-links {
  margin-top: clamp(28px, 5vh, 42px);
  display: flex; align-items: center; gap: 14px;
  font-size: 0.9rem;
}
.foot-links a, .foot-links button {
  border: none; background: none; cursor: pointer;
  font-family: inherit; font-size: 0.9rem;
  color: var(--muted); padding: 4px 2px;
  transition: color .25s;
}
.foot-links a:hover, .foot-links button:hover { color: var(--gold-2); }
.foot-links .dot { color: var(--faint); }
.foot-copy {
  margin-top: clamp(36px, 6vh, 56px);
  font-size: 0.74rem; letter-spacing: 0.06em;
  color: var(--faint); opacity: 0.75;
}
</style>
