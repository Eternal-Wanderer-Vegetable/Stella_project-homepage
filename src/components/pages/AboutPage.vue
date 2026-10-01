<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ active: { type: Boolean, default: false } })
const root = ref(null)
// 离开的页回到页首(与原版一致)
watch(() => props.active, (now, was) => {
  if (was && !now && root.value) root.value.scrollTop = 0
})
</script>

<template>
  <div ref="root" class="page" id="about" :class="{ active: active }">
    <footer>
      <div class="container">
        <div class="foot-grid">
          <div>
            <div class="foot-brand"><span class="star">✦</span>Stella</div>
            <p class="foot-desc">一个依托记忆系统进行拟人化聊天的 QQ 群聊机器人。为 8K 上下文窗口而设计,同时兼容本地小模型与在线 API。</p>
          </div>
          <div>
            <h5>项目</h5>
            <div class="foot-links">
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project" target="_blank" rel="noopener"><svg viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>GitHub 仓库</a>
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/releases" target="_blank" rel="noopener">Releases 下载</a>
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/blob/main/README.md" target="_blank" rel="noopener">完整文档(README)</a>
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/tree/main/docs" target="_blank" rel="noopener">使用文档(docs)</a>
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/tree/main/design_docs" target="_blank" rel="noopener">设计文档(design_docs)</a>
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/issues" target="_blank" rel="noopener">问题反馈</a>
            </div>
          </div>
          <div>
            <h5>社区与许可</h5>
            <div class="foot-links">
              <a href="https://qm.qq.com/q/263402786" target="_blank" rel="noopener">QQ 交流群 263402786</a>
              <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/blob/main/LICENSE" target="_blank" rel="noopener">AGPL v3.0 + 附加条款</a>
            </div>
            <p class="foot-desc" style="margin-top:16px;font-size:0.82rem">
              本项目受 AGPL v3.0 及附加条款约束:版权与免责声明须保留、修改须显著标注、禁止用于付费服务或有偿分发。
            </p>
          </div>
        </div>

        <p class="dedication">特别致谢 <b>Freya</b>,这是献给你的作品。</p>
        <p class="copyright">
          © 2026 Stella Project · 由
          <a href="https://github.com/Eternal-Wanderer-Vegetable/" target="_blank" rel="noopener">Eternal-Wanderer-Vegetable</a>
          开发维护 · 感谢 NoneBot2 / NapCatQQ / AstrBot / Qwen3 / Gemma / Playwright / llama.cpp / LM Studio 等开源项目
        </p>
      </div>
    </footer>
  </div><!-- /page about -->
</template>
