<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { marked } from 'marked'
import { t, locale, setLocale as setGlobalLocale } from '../../i18n.js'
import manifest from '../../../docs-content/manifest.json'

marked.setOptions({ gfm: true, breaks: false })

const props = defineProps({ active: { type: Boolean, default: false } })
const root = ref(null)
const mainEl = ref(null)

const allItems = computed(() => manifest.categories.flatMap((c) => c.items))
// 默认落地:配置参考(查阅频率最高),缺失时退回首篇
const defaultPath = (manifest.categories.flatMap((c) => c.items).find((i) => i.path === 'docs/reference/configuration.md') || manifest.categories[0].items[0]).path
const currentPath = ref(defaultPath)
const currentItem = computed(() => allItems.value.find((i) => i.path === currentPath.value))
const lang = ref(locale.value)                                  // 'zh' | 'en',随全站语言初始化
// 全站语言切换时,文档内容语言跟随(单篇的中/EN 按钮仍可临时覆盖)
watch(locale, (v) => { lang.value = v })
const loading = ref(false)
const html = ref('')
const filter = ref('')
const sideOpen = ref(false)   // 移动端目录折叠开关
const toc = ref([])           // 当前文档的内部标题索引(渲染后处理时收集)

// 按需懒加载:每篇文档单独成 chunk,首次打开才下载
const mdModules = import.meta.glob('../../../docs-content/**/*.md', { query: '?raw', import: 'default' })
const codeModules = import.meta.glob('../../../docs-content/**/*.{py,toml,yaml,json}', { query: '?raw', import: 'default' })

function docHref(path) {
  return `../../../docs-content/${path.slice('docs/'.length)}`
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// 把文档内的相对链接解析成站内文档;解析不到的回退到上游 GitHub 地址
function resolveDoc(clean) {
  const dir = currentPath.value.split('/').slice(0, -1).join('/')
  const joinPosix = (a, b) => {
    const parts = (a ? a.split('/') : []).concat(b.split('/'))
    const out = []
    for (const p of parts) {
      if (p === '..') out.pop()
      else if (p !== '.') out.push(p)
    }
    return out.join('/')
  }
  const candidates = [clean, joinPosix(dir, clean), joinPosix('docs', clean)]
  for (const c of candidates) {
    const hit = allItems.value.find((i) => i.path === c)
    if (hit) return hit
    const hitEn = allItems.value.find((i) => i.en === c)
    if (hitEn) return { ...hitEn, path: hitEn.path }   // 指向 en 的链接回到 zh 条目
  }
  return null
}

async function refresh() {
  const item = currentItem.value
  if (!item) return
  const path = lang.value === 'en' && item.en ? item.en : item.path
  loading.value = true
  toc.value = []
  try {
    const mdLoader = mdModules[docHref(path)]
    const codeLoader = !mdLoader ? codeModules[docHref(path)] : null
    if (mdLoader) {
      html.value = marked.parse(await mdLoader())
    } else if (codeLoader) {
      html.value = `<pre class="doc-code"><code>${escapeHtml(await codeLoader())}</code></pre>`
    } else {
      html.value = t('docs.missing')
    }
  } finally {
    loading.value = false
  }
  await nextTick()
  postProcess()
  if (mainEl.value) mainEl.value.scrollTop = 0
}

// 侧栏索引:点击文档内标题,正文滚动到对应小节(工具栏吸附高度已用 scroll-margin 预留)。
// 必须 instant:内嵌 webview 里 smooth 滚动会被冻结成 no-op(与 usePageGlide 同一坑)
function scrollToHeading(id) {
  const el = mainEl.value && mainEl.value.querySelector('#' + CSS.escape(id))
  if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' })
}

// 渲染后处理:移除上游自带的首行索引导航;站内文档链接转接内部导航,其余链接新窗口打开
function postProcess() {
  if (!mainEl.value) return
  // 上游文档每篇开头都有纯导航行(「中文 | English · 文档总览」「Agent 导航 · 架构导航」等):
  // 站内工具栏已有 EN 开关、左侧栏已是完整索引,整行冗余。识别特征:
  // 顶层段落里所有可见片段都是链接本身、分隔符(| ·)或中文/English 标签
  mainEl.value.querySelectorAll('.md-body > p').forEach((p) => {
    if (!p.querySelector('a')) return
    const parts = []
    p.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) parts.push({ text: n.textContent.trim(), link: false })
      else parts.push({ text: (n.textContent || '').trim(), link: !!n.querySelector('a') || n.tagName === 'A' })
    })
    if (!parts.length) return
    // 文本片段剔除分隔符与中英文标签后应一无所剩(如「| English ·」这类混合节点)
    const allNav = parts.every((x) =>
      x.link || x.text.replace(/[|·]/g, "").replace(/中文|English/g, "").trim() === "")
    if (allNav) p.remove()
  })
  mainEl.value.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href') || ''
    if (/^(https?:|mailto:)/.test(href)) {
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener')
      return
    }
    const clean = href.split('#')[0]
    if (!clean) return
    const hit = resolveDoc(clean)
    if (hit) {
      a.addEventListener('click', (e) => {
        e.preventDefault()
        currentPath.value = hit.path
      })
      a.classList.add('doc-link')
    } else {
      const dir = currentPath.value.split('/').slice(0, -1).join('/')
      a.setAttribute('href', manifest.githubBase + (clean.startsWith('docs/') || clean.startsWith('../') ? clean : `${dir}/${clean}`.replace('docs/../', '')))
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener')
    }
  })
  // 收集文档内部标题(h2/h3)供侧栏索引;顺序编号作锚点
  const heads = mainEl.value.querySelectorAll('.md-body h2, .md-body h3')
  toc.value = [...heads].map((h, i) => {
    const id = 'sec-' + i
    h.id = id
    return { id, text: h.textContent.trim(), level: h.tagName === 'H2' ? 2 : 3 }
  })
}

watch([currentPath, lang], refresh, { immediate: true })

// 离开时记住阅读位置,回来接着看;所选文档与语言保持不变
let savedTop = 0
watch(() => props.active, async (now, was) => {
  if (was && !now && root.value) savedTop = root.value.scrollTop
  else if (now && !was && root.value) {
    await nextTick()
    root.value.scrollTop = savedTop
  }
})

function open(it) {
  currentPath.value = it.path
  if (lang.value === 'en' && !it.en) lang.value = 'zh'
  sideOpen.value = false   // 移动端选完自动收起目录,正文立即可读
}
function switchLang(v) {
  lang.value = v
}
const filteredCats = computed(() => {
  const q = filter.value.trim().toLowerCase()
  return manifest.categories
    .map((c) => ({ ...c, items: q ? c.items.filter((i) => (i.title + ' ' + i.file).toLowerCase().includes(q)) : c.items }))
    .filter((c) => c.items.length > 0)
})
const ghUrl = computed(() => manifest.githubBase + (lang.value === 'en' && currentItem.value?.en ? currentItem.value.en : currentPath.value))
</script>

<template>
  <div ref="root" class="page docs-page" id="docs" :class="{ active: active }">
    <!-- 窄屏时目录折叠在这个开关后面,不再把正文顶下去一整屏 -->
    <button class="docs-toggle" type="button"
            :aria-expanded="sideOpen ? 'true' : 'false'" aria-controls="docsSide"
            @click="sideOpen = !sideOpen">
      <span aria-hidden="true">☰</span> 文档目录<em v-if="currentItem"> · {{ currentItem.title }}</em>
    </button>
    <aside id="docsSide" class="docs-side" :class="{ open: sideOpen }">
      <input v-model="filter" class="docs-search" type="text" :placeholder="t('docs.filter')" :aria-label="t('docs.filter')">
      <!-- 用 div 而非 nav:原版 style.css 的裸元素选择器 nav{position:fixed} 会劫持文档侧栏 -->
      <div class="docs-nav" role="navigation" :aria-label="t('docs.dir')">
        <template v-for="cat in filteredCats" :key="cat.id">
          <div class="docs-cat">{{ locale === 'en' ? (cat.labelEn || cat.label) : cat.label }}</div>
          <template v-for="it in cat.items" :key="it.path">
            <button type="button" class="docs-item" :class="{ on: it.path === currentPath }"
                    :title="it.title" @click="open(it)">
              <span class="t">{{ locale === 'en' && it.titleEn ? it.titleEn : it.title }}</span>
            </button>
            <!-- 当前文档在侧栏内展开内部标题(文本内的三级标题),点击滚动到对应小节。
                 容器常驻、按 open 状态过渡高度,切换文档时展开/收起顺滑衔接 -->
            <div class="docs-toc" :class="{ open: it.path === currentPath && toc.length }">
              <div class="docs-toc-in">
                <template v-if="it.path === currentPath">
                  <button v-for="(h, i) in toc" :key="h.id" type="button"
                          class="docs-toc-item" :class="'lv' + h.level"
                          :style="{ '--i': i }"
                          :title="h.text" @click="scrollToHeading(h.id)">
                    <span class="t">{{ h.text }}</span>
                  </button>
                </template>
              </div>
            </div>
          </template>
        </template>
        <div v-if="!filteredCats.length" class="docs-empty">{{ t('docs.none') }}</div>
      </div>
    </aside>

    <div class="docs-main" ref="mainEl">
      <div class="docs-toolbar">
        <h3 class="docs-title">{{ (locale === 'en' && currentItem?.titleEn) ? currentItem.titleEn : currentItem?.title || '' }}</h3>
        <div class="docs-tools">
          <span v-if="loading" class="docs-loading">{{ t('docs.loading') }}</span>
          <template v-if="currentItem?.en">
            <button type="button" class="lang-btn" :class="{ on: lang === 'zh' }" @click="switchLang('zh')">中</button>
            <button type="button" class="lang-btn" :class="{ on: lang === 'en' }" @click="switchLang('en')">EN</button>
          </template>
          <a class="gh-link" :href="ghUrl" target="_blank" rel="noopener">{{ t('docs.opengh') }}</a>
        </div>
      </div>
      <!-- 文档内容来自本仓库同步的受信快照,marked 渲染后注入 -->
      <article class="md-body" v-html="html"></article>
    </div>
  </div><!-- /page docs -->
</template>
