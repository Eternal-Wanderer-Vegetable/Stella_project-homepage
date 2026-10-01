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
  <section ref="root" id="features" class="page section-pad" :class="{ active: active }">
    <div class="container">
      <div class="sec-label reveal" v-reveal>02 · 特性</div>
      <h2 class="sec-title reveal" v-reveal>在 8192 tokens 的预算里工作</h2>
      <p class="sec-desc reveal" v-reveal>
        Stella 不只是把消息丢给大模型换一句回复。它把群聊里零散的信息沉淀成<strong>可检索、可验证、会遗忘</strong>的记忆,并在合适的时机主动开口了解你。
      </p>

      <div class="grid-3">
        <div class="card reveal" v-reveal>
          <div class="icon">🧰</div>
          <h3>工具能力与人格解耦</h3>
          <p>Router 先判断这句话需要什么能力,人格 Prompt 只保留角色设定。工具执行在聊天上下文之外完成,只回传结论。</p>
        </div>
        <div class="card reveal" v-reveal>
          <div class="icon">🗜️</div>
          <h3>长对话不断线</h3>
          <p>会话摘要、原始尾部、话题摘要三层按 id 切分、互不重叠,群聊刷屏一整天也追得上进度。</p>
        </div>
        <div class="card reveal" v-reveal>
          <div class="icon">🎯</div>
          <h3>记忆分区注入</h3>
          <p>记忆分七类(事实 / 偏好 / 事件 / 计划 / 关系 / 风格 / 群语境),带十种用途标签与四级可见性。<code>受限级</code>永不作为聊天素材,只用于行为约束。</p>
        </div>
        <div class="card blue reveal" v-reveal>
          <div class="icon">🧠</div>
          <h3>两层记忆过滤</h3>
          <p>捕获宽松、晋升严格:候选每被复现一次置信度 +0.12,≥ 0.85 直接转正,0.6 – 0.85 进观察区等证据。宁可漏记,不可错记。</p>
        </div>
        <div class="card pink reveal" v-reveal>
          <div class="icon">🔄</div>
          <h3>模型可替换</h3>
          <p>CHAT / ROUTER / PLUGIN / COMPACT / CONSOLIDATION / EXTRACT / VISION 七个角色可各自指定端点,4 个端点槽本地 / 在线任意混搭,框架不绑定任何厂商。</p>
        </div>
        <div class="card green reveal" v-reveal>
          <div class="icon">🌙</div>
          <h3>有作息,也有账单</h3>
          <p>默认 <code>23:30 – 07:30</code> 是睡觉时间(支持时区),被 @ 仍会回复;token 用量按角色 / 端点记日账,每日预算撞线默认只暂停记忆整理,群里照常说话。</p>
        </div>
      </div>
    </div>
  </section>
</template>
