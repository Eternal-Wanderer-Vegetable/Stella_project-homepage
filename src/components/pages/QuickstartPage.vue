<script setup>
import { ref, watch, nextTick } from 'vue'
import BudgetRing from '../BudgetRing.vue'
import { t } from '../../i18n.js'

const props = defineProps({ active: { type: Boolean, default: false } })
const root = ref(null)
// 离开时记住阅读位置,回来接着看(不再强制回到页首)
let savedTop = 0
watch(() => props.active, async (now, was) => {
  if (was && !now && root.value) savedTop = root.value.scrollTop
  else if (now && !was && root.value) {
    await nextTick()
    root.value.scrollTop = savedTop
  }
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
      <div class="sec-label reveal" v-reveal>{{ t('qs.label') }}</div>
      <h2 class="sec-title reveal" v-reveal>{{ t('qs.title') }}</h2>
      <p class="sec-desc reveal" v-reveal>{{ t('qs.desc') }}</p>

      <div class="steps">
        <div class="step reveal" v-reveal>
          <div class="n">1</div>
          <div>
            <h4>{{ t('qs.s1h') }}</h4>
            <p>{{ t('qs.s1p1') }}<a href="https://github.com/Eternal-Wanderer-Vegetable/Stella_project/releases" target="_blank" rel="noopener">Releases</a>{{ t('qs.s1p2') }}</p>
          </div>
        </div>
        <div class="step reveal" v-reveal>
          <div class="n">2</div>
          <div>
            <h4>{{ t('qs.s2h') }}</h4>
            <p v-html="t('qs.s2p')"></p>
          </div>
        </div>
        <div class="step reveal" v-reveal>
          <div class="n">3</div>
          <div>
            <h4>{{ t('qs.s3h') }}</h4>
            <p v-html="t('qs.s3p')"></p>
          </div>
        </div>
        <div class="step reveal" v-reveal>
          <div class="n">4</div>
          <div>
            <h4>{{ t('qs.s4h') }}</h4>
            <p v-html="t('qs.s4p')"></p>
          </div>
        </div>
      </div>

      <h3 class="reveal" v-reveal style="font-size:1.05rem;margin-bottom:2px">{{ t('qs.budgetH') }}</h3>
      <p class="code-note reveal" v-reveal style="margin-bottom:4px">{{ t('qs.budgetP') }}</p>
      <BudgetRing />

      <h3 class="reveal" v-reveal style="font-size:1.05rem;margin-bottom:16px">{{ t('qs.reqH') }}</h3>
      <div class="req-chips reveal" v-reveal>
        <span class="chip" v-html="t('qs.chip1')"></span>
        <span class="chip" v-html="t('qs.chip2')"></span>
        <span class="chip" v-html="t('qs.chip3')"></span>
        <span class="chip" v-html="t('qs.chip4')"></span>
        <span class="chip" v-html="t('qs.chip5')"></span>
      </div>

      <h3 class="reveal" v-reveal style="font-size:1.05rem;margin-bottom:16px">{{ t('qs.devH') }}</h3>
      <div class="code-block reveal" v-reveal>
        <div class="dots"><i></i><i></i><i></i></div>
        <button v-ripple class="copy-btn" @click="copyCode">{{ copied ? t('qs.copied') : t('qs.copy') }}</button>
<pre ref="devcode" id="devcode"><span class="cm">{{ t('qs.c1') }}</span>
git clone https://github.com/Eternal-Wanderer-Vegetable/Stella_project.git
cd Stella_project
pip install -r requirements.txt

<span class="cm">{{ t('qs.c2') }}</span>
python -m deploy init
<span class="cm">{{ t('qs.c3') }}</span>
python -m deploy doctor
<span class="cm">{{ t('qs.c4') }}</span>
python -m deploy start</pre>
      </div>
      <p class="code-note">{{ t('qs.note') }}</p>
    </div>
  </section>
</template>
