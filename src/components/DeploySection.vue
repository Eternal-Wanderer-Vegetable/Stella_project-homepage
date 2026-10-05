<script setup>
const emit = defineEmits(['open'])
</script>

<template>
  <!-- 第四屏:部署方式一眼解决,然后给出行动 -->
  <section id="deploy" class="dep">
    <div class="container dep-inner">
      <h2 class="dep-title" v-reveal>Stella 跑在哪里，由你决定。</h2>

      <div class="spectrum" v-reveal role="img"
           aria-label="部署谱系:完全本地与在线运行两个极端,混合运行居中,Stella 位于中心。">
        <div class="spec-end">
          <span class="spec-side">Your PC</span>
          <span class="spec-node local">Local</span>
        </div>
        <div class="spec-link to-local" aria-hidden="true"><i></i></div>
        <span class="spec-node hybrid">Hybrid</span>
        <div class="spec-link to-cloud" aria-hidden="true"><i></i></div>
        <div class="spec-end">
          <span class="spec-side">Cloud</span>
          <span class="spec-node online">Online</span>
        </div>
        <div class="spec-drop" aria-hidden="true">
          <i></i>
          <span class="spec-node stella">✦ Stella</span>
        </div>
      </div>

      <div class="dep-grid">
        <div class="dep-col" v-reveal>
          <h4>完全本地</h4>
          <p>聊天和记忆都留在电脑上。</p>
        </div>
        <div class="dep-col" v-reveal style="transition-delay:.12s">
          <h4>混合运行</h4>
          <p>记忆留在本地，聊天交给更强的模型。</p>
        </div>
        <div class="dep-col" v-reveal style="transition-delay:.24s">
          <h4>在线运行</h4>
          <p>让轻量设备也可以运行 Stella。</p>
        </div>
      </div>

      <div class="dep-cta" v-reveal>
        <button v-ripple class="btn btn-primary" type="button" @click="emit('open', 'quickstart')">一键安装 Stella</button>
        <button class="dep-more" type="button" @click="emit('open', 'docs')">Docker / Standalone / Advanced →</button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.dep {
  min-height: 100vh;
  min-height: 100svh;
  display: flex; align-items: center;
  padding: calc(var(--nav-h) + 48px) 0 64px;
}
.dep-inner {
  display: flex; flex-direction: column; align-items: center;
  width: 100%; text-align: center;
}
.dep-title {
  font-family: var(--serif); font-weight: 600;
  font-size: clamp(1.7rem, 3.8vw, 2.5rem);
  letter-spacing: 0.02em;
  margin-bottom: clamp(52px, 9vh, 92px);
}

/* 谱系图:Local ←— Hybrid —→ Online,Stella 挂在中心下方 */
.spectrum {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: min(680px, 100%);
  margin-bottom: clamp(96px, 15vh, 128px);   /* 给下方悬挂的 Stella 留位 */
}
.spec-end { display: flex; flex-direction: column; align-items: center; gap: 9px; }
.spec-side {
  font-size: 0.64rem; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--faint);
}
.spec-node {
  display: inline-flex; align-items: center;
  padding: 9px 22px; border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.2);
  background: rgba(255, 255, 255, 0.03);
  font-size: 0.94rem; font-weight: 600;
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  white-space: nowrap;
}
.spec-node.local { color: var(--green); border-color: rgba(158, 206, 106, 0.32); background: var(--green-dim); }
.spec-node.online { color: var(--blue); border-color: rgba(122, 162, 247, 0.32); background: var(--blue-dim); }
.spec-node.hybrid {
  color: var(--gold-2);
  border-color: rgba(246, 201, 107, 0.5);
  background: var(--gold-dim);
  box-shadow: 0 0 24px rgba(246, 201, 107, 0.1);
}
.spec-node.stella {
  color: var(--gold-2);
  border-color: rgba(246, 201, 107, 0.45);
  background: rgba(246, 201, 107, 0.08);
}
.spec-link { position: relative; flex: 1; height: 1.5px; max-width: 150px; }
.spec-link.to-local { background: linear-gradient(90deg, rgba(158, 206, 106, 0.5), rgba(246, 201, 107, 0.5)); }
.spec-link.to-cloud { background: linear-gradient(90deg, rgba(246, 201, 107, 0.5), rgba(122, 162, 247, 0.5)); }
/* 箭头指向两端:部署谱系可双向选择 */
.spec-link i {
  position: absolute; top: 50%;
  width: 9px; height: 9px;
  border-top: 1.5px solid; border-right: 1.5px solid;
}
.spec-link.to-local i {
  left: 1px; transform: translateY(-50%) rotate(-135deg);
  border-color: rgba(158, 206, 106, 0.6);
}
.spec-link.to-cloud i {
  right: 1px; transform: translateY(-50%) rotate(45deg);
  border-color: rgba(122, 162, 247, 0.6);
}
/* Stella 悬挂于谱系中心(Hybrid 居中,即容器中线) */
.spec-drop {
  position: absolute; top: calc(100% + 2px); left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center;
}
.spec-drop i { width: 1.5px; height: 30px; background: linear-gradient(180deg, rgba(246, 201, 107, 0.55), rgba(246, 201, 107, 0.25)); }
.spec-drop .spec-node { margin-top: 2px; }

.dep-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  width: min(860px, 100%);
  margin-bottom: clamp(40px, 7vh, 60px);
}
.dep-col {
  padding-top: 18px;
  border-top: 1px solid rgba(246, 201, 107, 0.28);
}
.dep-col h4 { font-size: 1rem; font-weight: 700; margin-bottom: 6px; color: var(--text); }
.dep-col p { font-size: 0.9rem; color: var(--muted); }

.dep-cta { display: flex; flex-direction: column; align-items: center; gap: 16px; }
.dep-cta .btn { font-size: 1.08rem; padding: 14px 34px; }
.dep-more {
  border: none; background: none; cursor: pointer;
  font-family: var(--mono); font-size: 0.8rem; letter-spacing: 0.06em;
  color: var(--faint);
  padding: 4px 8px;
  transition: color .25s;
}
.dep-more:hover { color: var(--gold-2); }

@media (max-width: 880px) {
  .dep-grid { grid-template-columns: 1fr; gap: 18px; width: min(420px, 100%); }
  .spec-node { padding: 8px 14px; font-size: 0.84rem; }
  .spec-link { max-width: 64px; }
  .spec-side { letter-spacing: 0.22em; }
}
</style>
