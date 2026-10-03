<template>
  <!-- 重构后的实现导图:单行平铺——三条来源通路依次汇入 8192 核心,产出拟人化输出(轻权重装饰) -->
  <figure class="fd" aria-label="Stella 的实现流程:记忆库经筛完才注入、工具调用经上下文外执行、旧对话经滚出即压缩,三条通路汇入 8192 tokens 的核心,产出拟人化输出。">
    <div class="fd-sources">
      <div class="fd-node"><span class="fd-label">记忆库</span><span class="fd-verb">筛完才注入</span></div>
      <div class="fd-node"><span class="fd-label">工具调用</span><span class="fd-verb">上下文外执行</span></div>
      <div class="fd-node"><span class="fd-label">旧对话</span><span class="fd-verb">滚出即压缩</span></div>
    </div>
    <svg class="fd-sep" viewBox="0 0 56 12" width="40" aria-hidden="true" fill="none">
      <line x1="0" y1="6" x2="44" y2="6" stroke="rgba(246,201,107,0.5)" stroke-width="1.6"/>
      <path d="M44 1 L54 6 L44 11 z" fill="rgba(246,201,107,0.55)"/>
    </svg>
    <div class="fd-core">
      <span class="fd-ring" aria-hidden="true"></span>
      <div class="fd-numwrap"><span class="fd-num">8192</span><span class="fd-unit">tokens</span></div>
    </div>
    <svg class="fd-sep" viewBox="0 0 56 12" width="40" aria-hidden="true" fill="none">
      <line x1="0" y1="6" x2="44" y2="6" stroke="rgba(246,201,107,0.5)" stroke-width="1.6"/>
      <path d="M44 1 L54 6 L44 11 z" fill="rgba(246,201,107,0.55)"/>
    </svg>
    <div class="fd-out">拟人化输出</div>
  </figure>
</template>

<style scoped>
.fd {
  display: flex; align-items: center; justify-content: center;
  margin: 0 0 30px;
  user-select: none;
}
.fd-sources { display: flex; flex-direction: row; align-items: center; }
.fd-node {
  position: relative;
  display: inline-flex; align-items: baseline; gap: 7px;
  padding: 6px 13px;
  border: 1px solid rgba(148, 163, 184, 0.16); border-radius: 999px;
  background: rgba(255, 255, 255, 0.028);
  backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
  white-space: nowrap;
}
/* 来源之间的行内小箭头 */
.fd-sources .fd-node + .fd-node { margin-left: 30px; }
.fd-sources .fd-node + .fd-node::before {
  content: ""; position: absolute; left: -22px; top: 50%;
  width: 13px; height: 1.4px; background: rgba(246, 201, 107, 0.42);
}
.fd-sources .fd-node + .fd-node::after {
  content: ""; position: absolute; left: -11px; top: 50%; transform: translateY(-50%);
  border-left: 5px solid rgba(246, 201, 107, 0.48);
  border-block: 3.5px solid transparent;
}
.fd-label { font-size: 0.85rem; font-weight: 600; color: var(--text); }
.fd-verb { font-size: 0.72rem; color: var(--gold-2); letter-spacing: 0.04em; opacity: 0.9; }
.fd-core {
  position: relative; flex: 0 0 auto;
  display: flex; align-items: center; justify-content: center;
  width: 112px; height: 112px; margin: 0 8px;
}
.fd-ring {
  position: absolute; inset: 0; border-radius: 50%;
  border: 1px dashed rgba(246, 201, 107, 0.24);
}
@media (prefers-reduced-motion: no-preference) {
  .fd-ring { animation: fdspin 60s linear infinite; }
}
@keyframes fdspin { to { transform: rotate(360deg); } }
.fd-numwrap { display: flex; flex-direction: column; align-items: center; line-height: 1; }
.fd-num {
  font-family: var(--serif); font-style: italic; font-weight: 700;
  font-size: 42px;
  background: linear-gradient(120deg, #ffffff 10%, var(--gold-2) 50%, var(--gold) 90%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
}
.fd-unit { margin-top: 5px; font-size: 9.5px; letter-spacing: 0.24em; color: var(--faint); }
.fd-sep { flex: 0 0 auto; margin: 0 4px; }
.fd-out {
  padding: 8px 20px; border-radius: 999px;
  background: linear-gradient(135deg, #f9d98c, #eeb54d);
  color: #241a05; font-size: 0.88rem; font-weight: 700; letter-spacing: 0.05em;
  box-shadow: 0 4px 16px rgba(246, 201, 107, 0.16);
  white-space: nowrap;
}

/* 窄屏:恢复竖排叙事,来源列表 → 8192 → 输出 */
@media (max-width: 880px) {
  .fd { flex-direction: column; gap: 10px; margin-bottom: 22px; }
  .fd-sources { flex-direction: column; gap: 8px; }
  .fd-sources .fd-node + .fd-node { margin-left: 0; }
  .fd-sources .fd-node + .fd-node::before,
  .fd-sources .fd-node + .fd-node::after { display: none; }
  .fd-sep { transform: rotate(90deg); margin: 0; }
}
</style>
