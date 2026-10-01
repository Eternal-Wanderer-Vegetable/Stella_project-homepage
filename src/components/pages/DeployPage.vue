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
  <section ref="root" id="deploy" class="page section-pad" :class="{ active: active }">
    <div class="container">
      <div class="sec-label reveal" v-reveal>04 · 部署模式</div>
      <h2 class="sec-title reveal" v-reveal>三种模式,隐私与成本自己选</h2>
      <p class="sec-desc reveal" v-reveal>
        <strong>4 个端点槽 × 7 个模型角色</strong>,聊天、记忆、整理、工具可以拆开,分别交给本地模型或在线 API。切换部署模式只需在安装器里<strong>一键预设</strong>,配置不丢数据。
      </p>

      <div class="grid-3">
        <div class="card deploy-card reveal" v-reveal>
          <span class="mode-tag">模式一</span>
          <div class="kw">关键词:零出网</div>
          <p>聊天、记忆、embedding、整理、工具全部由本地模型完成,不需要任何 API key。OneClick 包内置 llama.cpp CPU 后端与 qwen3-embedding 向量模型,消息不出家门,可在完全离线的环境运行;代价是响应延迟与硬件占用。</p>
          <div class="mode-rows">
            <div class="mr"><span>聊天</span><span class="local">本地</span></div>
            <div class="mr"><span>记忆 / embedding</span><span class="local">本地</span></div>
            <div class="mr"><span>整理 / 工具</span><span class="local">本地</span></div>
          </div>
        </div>
        <div class="card deploy-card rec reveal" v-reveal>
          <span class="mode-tag">模式二 · 推荐</span>
          <div class="kw">关键词:聊天与记忆分离</div>
          <p>只有对话生成出网,群聊原文不发给服务商;敏感的记忆整理留在本地。对话与记忆各用一把 key——两者提示词前缀完全不同,共用一把会互相冲刷厂商前缀缓存,命中率塌到接近 0。</p>
          <div class="mode-rows">
            <div class="mr"><span>聊天 / 整理</span><span class="cloud">API</span></div>
            <div class="mr"><span>记忆 / embedding</span><span class="local">本地</span></div>
            <div class="mr"><span>工具</span><span>本地 / API</span></div>
          </div>
        </div>
        <div class="card deploy-card reveal" v-reveal>
          <span class="mode-tag">模式三</span>
          <div class="kw">关键词:最低硬件门槛</div>
          <p>双 key 直连在线 API,不需要本地大模型,树莓派也能跑。隐私信息仍会经手第三方,不满足零出网条件。</p>
          <div class="mode-rows">
            <div class="mr"><span>聊天 / 整理</span><span class="cloud">API</span></div>
            <div class="mr"><span>记忆 / embedding</span><span class="cloud">API</span></div>
            <div class="mr"><span>工具</span><span class="cloud">API</span></div>
          </div>
        </div>
      </div>

      <ul class="deploy-notes reveal" v-reveal>
        <li>三种模式共用同一套记忆、人格与插件配置,换模式只改预设,数据不迁移。</li>
        <li>向量检索恒定走本机模型:换 embedding 模型等于换向量维度、整库重算,不参与模式切换;未启用时退回 SQLite 全文索引。</li>
        <li>每日 token 预算按本地日期零点翻滚、重启不清零;撞线后默认 pause_memory 只停记忆整理,群里照常说话。</li>
      </ul>
    </div>
  </section>
</template>
