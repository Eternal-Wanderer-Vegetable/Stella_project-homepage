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
  <section ref="root" id="memory" class="page section-pad" :class="{ active: active }">
    <div class="container">
      <div class="sec-label reveal" v-reveal>03 · 记忆系统</div>
      <h2 class="sec-title reveal" v-reveal>记忆是沉淀出来的,不是堆出来的</h2>
      <p class="sec-desc reveal" v-reveal>
        Stella 的记忆围绕<strong>证据</strong>构建:每条长期记忆都能追溯到来源消息,可信度不足的候选会被打回继续观察。
      </p>

      <div class="flow-wrap reveal" v-reveal>
        <div class="flow-title">记忆形成流程</div>
        <div class="flow">
          <div class="fnode">群聊消息<small>主动 @ / 被动旁听</small></div>
          <div class="farrow">→</div>
          <div class="fnode">两阶段抽取<small>小模型初筛 + 大模型精选</small></div>
          <div class="farrow">→</div>
          <div class="fnode">观察区<small>复现 1 次 +0.12</small></div>
          <div class="farrow">→</div>
          <div class="fnode">Gate 1<small>≥0.85 转正 · 0.6–0.85 观察</small></div>
          <div class="farrow">→</div>
          <div class="fnode hot">长期记忆</div>
        </div>
        <div class="flow-branches">
          <div class="fbranch good"><b>Policy 过滤 → 分区注入 Prompt</b><br>按相关度筛选后进入对话,不占额外预算</div>
          <div class="fbranch"><b>归档</b><br>超期或低价值记忆退出活跃区,需要时可再检索</div>
        </div>
        <div class="loop-note">验证不通过 = <b>证据不足,继续观察</b> —— 宁可漏记,不可错记</div>
      </div>

      <div class="grid-3">
        <div class="card reveal" v-reveal>
          <div class="icon">🔍</div>
          <h3>记忆需要证据</h3>
          <p>来源分三级:对 Stella 亲口说的单次即可采信;旁听到的需复现确认;Stella 自己的话只作上下文,绝不产出候选。</p>
        </div>
        <div class="card blue reveal" v-reveal>
          <div class="icon">💬</div>
          <h3>主动获取信息</h3>
          <p>Stella 会自己开口问:每日 2 次(高活跃群最多 +2),同一用户 2 小时冷却,连续 2 次没被回应就不再追问——信息来自用户亲口所说,而不是模型的猜测。</p>
        </div>
        <div class="card green reveal" v-reveal>
          <div class="icon">🏠</div>
          <h3>多群共享空间</h3>
          <p>记忆空间按"人"组织而非按"群"隔离,换个群也能认出你;消息尾巴与话题状态按群隔离,隐私分区仍受 Policy 约束。</p>
        </div>
        <div class="card pink reveal" v-reveal>
          <div class="icon">🔎</div>
          <h3>六维加权检索</h3>
          <p>SQLite FTS5 关键词 + 向量语义双路召回,按语义 0.35 / 上下文 0.25 / 用途 0.20 / 新近 0.10 / 置信 0.05 / 重要 0.05 排序,8 种行为模式动态决定取几条。</p>
        </div>
        <div class="card reveal" v-reveal>
          <div class="icon">♻️</div>
          <h3>会遗忘</h3>
          <p>类型化生命周期:群语境 30 天、事件 / 计划 60 天、偏好 / 关系 180 天、风格 1 年、事实 2 年;每用户 25 条配额,超限竞争淘汰——但只归档,不物理删除。</p>
        </div>
        <div class="card blue reveal" v-reveal>
          <div class="icon">🧩</div>
          <h3>工程上可依赖</h3>
          <p>2600+ 单元测试覆盖记忆晋升、防编造护栏、跨用户隔离与路由降级,全部不依赖真实机器人与网络;AstrBot 插件生态直接兼容。</p>
        </div>
      </div>

      <div class="principles">
        <div class="principle reveal" v-reveal>
          <div class="no">原则 一</div>
          <h4>各司其职</h4>
          <p>检索、过滤、注入各自独立演进;记忆系统不与任何具体模型绑定。</p>
        </div>
        <div class="principle reveal" v-reveal>
          <div class="no">原则 二</div>
          <h4>上下文预算守恒</h4>
          <p>任何新能力都要在 8K 预算内自洽,不允许"先塞进 prompt 再说"。</p>
        </div>
        <div class="principle reveal" v-reveal>
          <div class="no">原则 三</div>
          <h4>优先级是动态的</h4>
          <p>记忆、人格、历史、工具结果的占比随对话状态调整,不是固定模板。</p>
        </div>
      </div>

      <div class="tbl-wrap reveal" v-reveal>
        <table>
          <thead>
            <tr><th>注入分区</th><th>内容</th><th>上下文预算</th></tr>
          </thead>
          <tbody>
            <tr><td>聊天素材区</td><td>按六维排序筛出的记忆内容,与技术场景下放宽到 1000</td><td class="pct">≤ 500 tok</td></tr>
            <tr><td>行为约束区</td><td>"Stella 应如何改变行为"的约束,与素材严格分离、绝不混合</td><td class="pct">≤ 150 tok</td></tr>
            <tr><td>输出预留 + 安全余量</td><td>回复生成空间与截断保护,不参与输入</td><td class="pct">1200 tok</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
