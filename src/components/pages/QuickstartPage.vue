<script setup>
import { ref, watch } from 'vue'
import BudgetRing from '../BudgetRing.vue'

const props = defineProps({ active: { type: Boolean, default: false } })
const root = ref(null)
// 离开的页回到页首(与原版一致)
watch(() => props.active, (now, was) => {
  if (was && !now && root.value) root.value.scrollTop = 0
})

const devcode = ref(null)
const copied = ref(false)

function copyCode() {
  const text = devcode.value.innerText
  function done() {
    copied.value = true
    setTimeout(function () { copied.value = false }, 1800)
  }
  function fallback() {
    const ta = document.createElement('textarea')
    ta.value = text; document.body.appendChild(ta)
    ta.select(); try { document.execCommand('copy') } catch (e) {}
    document.body.removeChild(ta); done()
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(function () { fallback() })
  } else { fallback() }
}
</script>

<template>
  <section ref="root" id="quickstart" class="page section-pad" :class="{ active: active }">
    <div class="container">
      <div class="sec-label reveal" v-reveal>快速开始</div>
      <h2 class="sec-title reveal" v-reveal>Windows 桌面版,四步跑起来</h2>
      <p class="sec-desc reveal" v-reveal>桌面安装器基于 Tauri 2 构建,图形界面完成全部配置;Linux 用户与开发者可直接使用命令行部署。</p>

      <div class="steps">
        <div class="step reveal" v-reveal>
          <div class="n">1</div>
          <div>
            <h4>下载并安装 OneClick</h4>
            <p>从 GitHub <a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/releases" target="_blank" rel="noopener">Releases</a> 下载安装器,内置嵌入式 Python、llama.cpp CPU 后端、NapCat 与 <code>qwen3-embedding-0.6b</code> 向量模型;另有约 1GB 的全离线包与免安装 Standalone 版。</p>
          </div>
        </div>
        <div class="step reveal" v-reveal>
          <div class="n">2</div>
          <div>
            <h4>NapCat 扫码登录 QQ</h4>
            <p>在 NapCat WebUI 添加反向 WebSocket 客户端,指向 <code>ws://127.0.0.1:8080/onebot/v11/ws</code>。</p>
          </div>
        </div>
        <div class="step reveal" v-reveal>
          <div class="n">3</div>
          <div>
            <h4>配置 Stella</h4>
            <p>打开 <code>Stella.exe</code>:填监听端口与群号 → 「模型服务」点一键预设 —— 本地模式填 LM Studio 地址 + 模型 ID(可测试连接),在线模式填地址 + key + 模型 ID,对话与记忆两把 key。</p>
          </div>
        </div>
        <div class="step reveal" v-reveal>
          <div class="n">4</div>
          <div>
            <h4>保存并检查,启动</h4>
            <p>「保存并检查」会自动运行 doctor 环境自检,通过后启动;在群里 <strong>@ 机器人</strong>即可对话。</p>
          </div>
        </div>
      </div>

      <h3 class="reveal" v-reveal style="font-size:1.05rem;margin-bottom:2px">8192 tokens 都花在哪了?</h3>
      <p class="code-note reveal" v-reveal style="margin-bottom:4px">整颗"心智"的预算分配——记忆只占其中一小块,这就是 8K 也够用的原因。</p>
      <BudgetRing />

      <h3 class="reveal" v-reveal style="font-size:1.05rem;margin-bottom:16px">环境要求</h3>
      <div class="req-chips reveal" v-reveal>
        <span class="chip"><b>Windows 10/11</b> x64 / Ubuntu 22.04+</span>
        <span class="chip">Python <b>3.10+</b>(安装器已内置,CLI 部署需要)</span>
        <span class="chip">内存 ≥ <b>16 GB</b></span>
        <span class="chip">显存 ≥ <b>8 GB</b>(仅本地模式需要)</span>
        <span class="chip">磁盘 ≥ <b>30 GB</b></span>
      </div>

      <h3 class="reveal" v-reveal style="font-size:1.05rem;margin-bottom:16px">开发者部署(源码运行)</h3>
      <div class="code-block reveal" v-reveal>
        <div class="dots"><i></i><i></i><i></i></div>
        <button v-ripple class="copy-btn" @click="copyCode">{{ copied ? '已复制 ✓' : '复制' }}</button>
<pre ref="devcode" id="devcode"><span class="cm"># 克隆仓库并安装依赖</span>
git clone https://github.com/Eternal-Wanderer-Vegetable/Stella_project.git
cd Stella_project
pip install -r requirements.txt

<span class="cm"># 初始化(向导只要求回答 5 个必答项,生成 .env)</span>
python -m deploy init
<span class="cm"># 环境自检(分层:probe 采集 → checks 判断 → report 渲染)</span>
python -m deploy doctor
<span class="cm"># 启动</span>
python -m deploy start</pre>
      </div>
      <p class="code-note">也提供 stella / napcat 双容器 Docker Compose 部署(可选 llama profile,镜像内置 Chromium 与中文字体),详见仓库 README。</p>
    </div>
  </section>
</template>
