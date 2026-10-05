<template>
  <!-- 机制主图:三来源(记忆/旧对话/工具)从左侧汇入 8192 核心,产出回复。
       桌面为横向汇聚,窄屏退化为竖排:来源列表 → 8192 → 回复 -->
  <figure class="fd" aria-label="Stella 的机制:记忆需要才取出、旧对话压缩掉、工具在上下文外执行,三条通路汇入 8192 tokens 的核心,产出回复。">
    <div class="fd-sources">
      <div class="fd-node"><span class="fd-label">记忆</span><span class="fd-verb">需要才取出</span></div>
      <div class="fd-node"><span class="fd-label">旧对话</span><span class="fd-verb">压缩掉</span></div>
      <div class="fd-node"><span class="fd-label">工具</span><span class="fd-verb">上下文外执行</span></div>
    </div>
    <!-- 汇聚连接线:三线收拢进入核心(桌面) -->
    <svg class="fd-merge" viewBox="0 0 64 192" width="64" height="192" aria-hidden="true" fill="none">
      <defs>
        <marker id="fdah" viewBox="0 0 8 8" refX="6.5" refY="4" markerWidth="6.5" markerHeight="6.5" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" fill="rgba(246,201,107,0.55)"/>
        </marker>
      </defs>
      <line x1="2" y1="20" x2="52" y2="88" stroke="rgba(246,201,107,0.4)" stroke-width="1.5" marker-end="url(#fdah)"/>
      <line x1="2" y1="96" x2="50" y2="96" stroke="rgba(246,201,107,0.5)" stroke-width="1.5" marker-end="url(#fdah)"/>
      <line x1="2" y1="172" x2="52" y2="104" stroke="rgba(246,201,107,0.4)" stroke-width="1.5" marker-end="url(#fdah)"/>
    </svg>
    <!-- 竖排衔接箭头(窄屏) -->
    <svg class="fd-drop" viewBox="0 0 12 34" width="12" height="34" aria-hidden="true" fill="none">
      <line x1="6" y1="0" x2="6" y2="24" stroke="rgba(246,201,107,0.5)" stroke-width="1.6"/>
      <path d="M1 24 L6 33 L11 24 Z" fill="rgba(246,201,107,0.55)"/>
    </svg>
    <div class="fd-core">
      <span class="fd-ring" aria-hidden="true"></span>
      <span class="fd-halo" aria-hidden="true"></span>
      <div class="fd-numwrap"><span class="fd-num">8192</span><span class="fd-unit">tokens</span></div>
    </div>
    <svg class="fd-sep" viewBox="0 0 56 12" width="46" aria-hidden="true" fill="none">
      <line x1="0" y1="6" x2="44" y2="6" stroke="rgba(246,201,107,0.5)" stroke-width="1.6"/>
      <path d="M44 1 L54 6 L44 11 z" fill="rgba(246,201,107,0.55)"/>
    </svg>
    <div class="fd-out">回复</div>
  </figure>
</template>

<style scoped>
.fd {
  display: flex; align-items: center; justify-content: center;
  margin: 0;
  user-select: none;
}
.fd-sources { display: flex; flex-direction: column; gap: 36px; }
.fd-node {
  display: inline-flex; align-items: baseline; gap: 9px;
  padding: 8px 18px;
  border: 1px solid rgba(148, 163, 184, 0.18); border-radius: 999px;
  background: rgba(255, 255, 255, 0.028);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  white-space: nowrap;
}
.fd-label { font-size: 1.02rem; font-weight: 600; color: var(--text); }
.fd-verb { font-size: 0.8rem; color: var(--gold-2); letter-spacing: 0.05em; opacity: 0.9; }

/* 核心:8192 圆环,占屏主视觉 */
.fd-core {
  position: relative; flex: 0 0 auto;
  display: flex; align-items: center; justify-content: center;
  width: 184px; height: 184px; margin: 0 10px;
}
.fd-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px dashed rgba(246, 201, 107, 0.32);
}
.fd-halo {
  position: absolute; inset: -26px; border-radius: 50%;
  background: radial-gradient(circle, rgba(246, 201, 107, 0.1), transparent 68%);
}
@media (prefers-reduced-motion: no-preference) {
  .fd-ring { animation: fdspin 60s linear infinite; }
}
@keyframes fdspin { to { transform: rotate(360deg); } }
.fd-numwrap { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.fd-num {
  font-family: var(--serif); font-style: italic; font-weight: 700;
  font-size: 58px;
  background: linear-gradient(120deg, #ffffff 10%, var(--gold-2) 50%, var(--gold) 90%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.fd-unit { margin-top: 7px; font-size: 10.5px; letter-spacing: 0.3em; padding-left: 0.3em; color: var(--faint); }

.fd-merge { flex: 0 0 auto; }
.fd-drop { display: none; }
.fd-sep { flex: 0 0 auto; margin: 0 2px; }
.fd-out {
  padding: 11px 26px; border-radius: 999px;
  background: linear-gradient(135deg, #f9d98c, #eeb54d);
  color: #241a05; font-size: 1.02rem; font-weight: 700; letter-spacing: 0.06em;
  box-shadow: 0 4px 20px rgba(246, 201, 107, 0.18);
  white-space: nowrap;
}

/* 窄屏:竖排叙事 来源 → 8192 → 回复 */
@media (max-width: 880px) {
  .fd { flex-direction: column; gap: 14px; }
  .fd-sources { flex-direction: column; gap: 10px; align-items: center; }
  .fd-merge { display: none; }
  .fd-drop { display: block; }
  .fd-sep { transform: rotate(90deg); margin: 0; }
  .fd-core { width: 150px; height: 150px; margin: 4px 0; }
  .fd-num { font-size: 46px; }
}
</style>
