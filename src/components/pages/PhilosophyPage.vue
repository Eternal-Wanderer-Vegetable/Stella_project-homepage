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
  <section ref="root" id="philosophy" class="page section-pad" :class="{ active: active }">
    <div class="container">
      <div class="sec-label reveal" v-reveal>01 · 核心理念</div>
      <h2 class="sec-title reveal" v-reveal>为什么是 8K 上下文?</h2>
      <p class="sec-desc reveal" v-reveal>
        Stella 的设计前提是<strong>上下文窗口很小</strong>——基准上限是 <strong>8192 tokens</strong>。人格、记忆、历史对话、工具结果要在这么小的预算里共存,靠堆 prompt 是不可能的。Stella 的解法是把预算拆开:窗口减去 <code>1000</code> 输出预留与 <code>200</code> 安全余量才是输入预算,超出就从最旧的尾巴开始丢。
      </p>

      <div class="grid-3">
        <div class="card reveal" v-reveal>
          <div class="icon">🧮</div>
          <h3>记忆在库里筛完才注入</h3>
          <p>过滤与排序在数据库层完成,候选与置信度不占对话预算;聊天素材区注入上限 <code>500</code> tokens(技术场景 <code>1000</code>),行为约束区只有 <code>150</code>。</p>
        </div>
        <div class="card blue reveal" v-reveal>
          <div class="icon">🧰</div>
          <h3>工具在聊天上下文之外执行</h3>
          <p>插件调用不发生在对话窗口内,<code>Result.data</code> 全程不进 prompt,只把不超过 <code>300</code> 字的一句结论交回给 Stella —— 插件装再多,占的也不是对话窗口。</p>
        </div>
        <div class="card green reveal" v-reveal>
          <div class="icon">🗜️</div>
          <h3>滚出窗口的对话自动压缩</h3>
          <p>会话摘要 / 最近 <code>12</code> 条原始尾巴 / 话题摘要三层按消息 id 划分、绝不重叠;压缩在回复发出后异步进行,不阻塞当前回复,摘要下一轮生效。</p>
        </div>
      </div>

      <div class="quote reveal" v-reveal>
        <p>小窗口能跑,大窗口自然更宽裕;但反过来不成立 —— 假设窗口无限的架构,换到 8K 上会直接失控。</p>
        <div class="who">—— Stella 的架构取舍</div>
      </div>
    </div>
  </section>
</template>
