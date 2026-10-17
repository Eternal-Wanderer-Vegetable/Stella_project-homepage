<script setup>
import { useEnterOnce } from '../composables/useEnterOnce.js'

// 首次入场编排:标题先立,Hybrid 从中心弹出,连线向两侧画开,两端药丸就位,
// 竖线垂下把 Stella 送到谱系中心,三列说明错峰跟上。只播一次,减弱动效直接呈现。
const { root, entered } = useEnterOnce()
</script>

<template>
  <!-- 第四屏:部署方式一眼解决。安装行动统一收在尾屏 Get Stella,此处不再放跳转 -->
  <section id="deploy" ref="root" class="dep" :class="{ entered: entered }">
    <div class="container dep-inner">
      <h2 class="dep-title">Stella 跑在哪里，由你决定。</h2>

      <div class="spectrum" role="img"
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
        <div class="dep-col">
          <h4>完全本地</h4>
          <p>聊天和记忆都留在电脑上。</p>
        </div>
        <div class="dep-col">
          <h4>混合运行</h4>
          <p>记忆留在本地，聊天交给更强的模型。</p>
        </div>
        <div class="dep-col">
          <h4>在线运行</h4>
          <p>让轻量设备也可以运行 Stella。</p>
        </div>
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

/* 谱系图:Local ←— Hybrid —→ Online,Stella 挂在中心下方。
   两端标签绝对定位悬浮在药丸上方:行高即药丸高,连接线/箭头正好对准药丸中心;
   两端列等宽(flex:1 1 0),宽度不同的 Local/Online 不再把 Hybrid 挤离中线,
   悬挂的 Stella 竖线才能落在 Hybrid 正中 */
.spectrum {
  position: relative;
  display: flex; align-items: center; justify-content: center;
  width: min(680px, 100%);
  margin-bottom: clamp(96px, 15vh, 128px);   /* 给下方悬挂的 Stella 留位 */
}
.spec-end {
  position: relative;
  flex: 1 1 0;
  display: flex; flex-direction: column; align-items: center;
}
.spec-side {
  position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%);
  font-size: 0.64rem; font-weight: 600;
  letter-spacing: 0.32em; text-transform: uppercase;
  color: var(--faint);
  white-space: nowrap;
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
/* 连线从 Hybrid 侧向外画开:动画走 background-size,箭头是子元素不会被压扁 */
.spec-link { position: relative; flex: 1; height: 1.5px; max-width: 150px; background-repeat: no-repeat; }
.spec-link.to-local { background-image: linear-gradient(90deg, rgba(158, 206, 106, 0.5), rgba(246, 201, 107, 0.5)); background-position: 100% 0; }
.spec-link.to-cloud { background-image: linear-gradient(90deg, rgba(246, 201, 107, 0.5), rgba(122, 162, 247, 0.5)); background-position: 0 0; }
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
.spec-drop i {
  width: 1.5px; height: 30px;
  transform-origin: top;
  background: linear-gradient(180deg, rgba(246, 201, 107, 0.55), rgba(246, 201, 107, 0.25));
}
.spec-drop .spec-node { margin-top: 2px; }

.dep-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 26px;
  width: min(860px, 100%);
}
.dep-col {
  padding-top: 18px;
  border-top: 1px solid rgba(246, 201, 107, 0.28);
}
.dep-col h4 { font-size: 1rem; font-weight: 700; margin-bottom: 6px; color: var(--text); }
.dep-col p { font-size: 0.9rem; color: var(--muted); }

/* —— 首次入场:中心开花。Hybrid 弹出(.15s)→ 连线向两侧画开(.35s)→
   箭头亮起(.6s)→ Local/Online 就位(.7s)→ 竖线垂下(.85s)→
   Stella 落到谱系中心(1.05s),三列说明错峰跟上(.9s 起)。
   整体前压、全屏 1.7s 内落定:两端药丸是视觉锚点,晚到会被当成缺失 —— */
@media (prefers-reduced-motion: no-preference) {
  .dep-title, .spec-node, .spec-end, .spec-link, .spec-link i,
  .spec-drop .spec-node, .spec-drop i, .dep-col { opacity: 0; }

  .dep.entered .dep-title { animation: depRise .6s cubic-bezier(.22,.61,.36,1) both; }
  .dep.entered .spec-node.hybrid { animation: depPop .5s cubic-bezier(.34,1.45,.64,1) .15s both; }
  .dep.entered .spec-link { animation: depWire .45s ease-out .35s both; }
  .dep.entered .spec-link i { animation: depFade .25s ease-out .6s both; }
  .dep.entered .spec-end { animation: depRise .45s cubic-bezier(.22,.61,.36,1) .7s both; }
  .dep.entered .spec-drop i { animation: depDrop .35s ease-out .85s both; }
  .dep.entered .spec-drop .spec-node { animation: depPop .45s cubic-bezier(.34,1.45,.64,1) 1.05s both; }
  .dep.entered .dep-col { animation: depRise .55s cubic-bezier(.22,.61,.36,1) both; }
  .dep.entered .dep-col:nth-child(1) { animation-delay: .9s; }
  .dep.entered .dep-col:nth-child(2) { animation-delay: 1.05s; }
  .dep.entered .dep-col:nth-child(3) { animation-delay: 1.2s; }
}
@keyframes depRise {
  from { opacity: 0; transform: translateY(22px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes depPop {
  from { opacity: 0; transform: scale(.7); }
  to { opacity: 1; transform: scale(1); }
}
/* 连线画开:0% 即显形(尺寸为零不可见),背景从 Hybrid 侧长向两端 */
@keyframes depWire {
  0% { background-size: 0 100%; opacity: 1; }
  100% { background-size: 100% 100%; opacity: 1; }
}
@keyframes depFade { from { opacity: 0; } to { opacity: 1; } }
@keyframes depDrop {
  from { transform: scaleY(0); opacity: 1; }
  to { transform: scaleY(1); opacity: 1; }
}

@media (max-width: 880px) {
  .dep-grid { grid-template-columns: 1fr; gap: 18px; width: min(420px, 100%); }
  .spec-node { padding: 8px 14px; font-size: 0.84rem; }
  .spec-link { max-width: 64px; }
  .spec-side { letter-spacing: 0.22em; }
}
</style>
