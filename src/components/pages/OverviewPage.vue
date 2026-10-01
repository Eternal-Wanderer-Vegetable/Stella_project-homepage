<script setup>
import { ref, watch } from 'vue'
import titleImage from '../../assets/title-image.jpg'

const props = defineProps({ active: { type: Boolean, default: false } })

const root = ref(null)
// 离开的页回到页首(与原版一致)
watch(() => props.active, (now, was) => {
  if (was && !now && root.value) root.value.scrollTop = 0
})

const MARQUEE = [
  'NoneBot 2', 'OneBot V11', 'Python 3.10+', 'Rust', 'Tauri 2', 'SQLite FTS5',
  'llama.cpp', 'LM Studio', 'AstrBot 插件生态', 'Playwright', 'Docker', 'pytest × 2600',
]

function hideArt(e) {
  e.target.parentElement.style.display = 'none'
}
</script>

<template>
  <div ref="root" class="page" id="overview" :class="{ active: active }">
    <div class="container">
      <div class="hero-art">
        <img :src="titleImage"
             alt="Stella 项目标题图" loading="lazy" decoding="async"
             width="3168" height="1344"
             @error="hideArt">
        <div class="cap">Stella — Title Image</div>
      </div>

      <div class="stats">
        <div class="stat"><div class="num">8192</div><div class="lbl">token 上下文预算</div></div>
        <div class="stat"><div class="num">7 个</div><div class="lbl">可独立配端的模型角色</div></div>
        <div class="stat"><div class="num">3 种</div><div class="lbl">部署模式</div></div>
        <div class="stat"><div class="num">2600+</div><div class="lbl">单元测试</div></div>
      </div>
    </div>

    <div class="marquee" aria-hidden="true">
      <div class="mq-track">
        <div class="mq-seq" v-for="n in 2" :key="n">
          <template v-for="(it, idx) in MARQUEE" :key="idx"><span>{{ it }}</span><i>✦</i></template>
        </div>
      </div>
    </div>
  </div><!-- /page overview -->
</template>
