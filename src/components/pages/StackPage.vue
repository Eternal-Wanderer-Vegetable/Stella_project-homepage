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
  <section ref="root" id="stack" class="page section-pad" :class="{ active: active }">
    <div class="container">
      <div class="sec-label reveal" v-reveal>06 · 技术栈</div>
      <h2 class="sec-title reveal" v-reveal>模型无关,工程可验证</h2>
      <p class="sec-desc reveal" v-reveal>通过统一整合层对接任意 OpenAI 兼容端点,框架不绑定任何厂商。</p>

      <div class="stack-group reveal" v-reveal>
        <h4>Bot 后端 <span>核心运行时</span></h4>
        <div class="stack-chips">
          <span class="schip"><i></i>NoneBot 2</span>
          <span class="schip"><i></i>OneBot V11(NapCat 等)</span>
          <span class="schip s-blue"><i></i>SQLite (FTS5)</span>
          <span class="schip s-blue"><i></i>OpenAI 兼容 API(LM Studio / llama.cpp / 在线)</span>
          <span class="schip s-blue"><i></i>FastAPI WebUI(同端口管理面板)</span>
          <span class="schip s-blue"><i></i>APScheduler</span>
          <span class="schip s-blue"><i></i>httpx</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>可选 Runtime <span>本地推理与加速</span></h4>
        <div class="stack-chips">
          <span class="schip s-green"><i></i>Rust runtime-manager(组件监督)</span>
          <span class="schip s-green"><i></i>Rust 记忆检索后端(PyO3,可选)</span>
          <span class="schip s-green"><i></i>llama.cpp / llama-server</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>插件兼容与渲染</h4>
        <div class="stack-chips">
          <span class="schip s-pink"><i></i>AstrBot 插件生态</span>
          <span class="schip s-pink"><i></i>Jinja2</span>
          <span class="schip s-pink"><i></i>Playwright(本地 Chromium)</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>桌面安装器与面板 <span>Tauri 2 + Rust</span></h4>
        <div class="stack-chips">
          <span class="schip"><i></i>Tauri 2</span>
          <span class="schip"><i></i>Rust</span>
          <span class="schip"><i></i>Vue 3 + Vuetify 3 dashboard</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>容器化</h4>
        <div class="stack-chips">
          <span class="schip s-blue"><i></i>Docker</span>
          <span class="schip s-blue"><i></i>docker compose</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>开发与验证</h4>
        <div class="stack-chips">
          <span class="schip s-green"><i></i>pytest(2600+ 测试)</span>
          <span class="schip s-green"><i></i>ruff</span>
          <span class="schip s-green"><i></i>pyright</span>
          <span class="schip s-green"><i></i>pip-audit + bandit</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>持续集成 <span>GitHub Actions</span></h4>
        <div class="stack-chips">
          <span class="schip"><i></i>6 个 job(lint / security / test ×3 / cli / windows 原生)</span>
          <span class="schip"><i></i>Python 3.10 – 3.12 矩阵</span>
        </div>
      </div>
      <div class="stack-group reveal" v-reveal>
        <h4>开发用本地模型 <span>实测配置</span></h4>
        <div class="stack-chips">
          <span class="schip s-pink"><i></i>gemma-4-26b-a4b-qat · GPU 聊天</span>
          <span class="schip s-pink"><i></i>gemma-4-e4b · CPU 记忆整理</span>
          <span class="schip s-pink"><i></i>text-embedding-qwen3-embedding-0.6b</span>
        </div>
      </div>
    </div>
  </section>
</template>
