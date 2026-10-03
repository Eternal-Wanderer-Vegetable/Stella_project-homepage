<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { marked } from 'marked'
import manifest from '../../../docs-content/manifest.json'

marked.setOptions({ gfm: true, breaks: false })

const props = defineProps({ active: { type: Boolean, default: false } })
const root = ref(null)
const mainEl = ref(null)

const allItems = computed(() => manifest.categories.flatMap((c) => c.items))
const currentPath = ref(manifest.categories[0].items[0].path)   // 默认:架构说明
const currentItem = computed(() => allItems.value.find((i) => i.path === currentPath.value))
const lang = ref('zh')                                          // 'zh' | 'en'
const loading = ref(false)
const html = ref('')
const filter = ref('')
const sideOpen = ref(false)   // 移动端目录折叠开关

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
  try {
    const mdLoader = mdModules[docHref(path)]
    const codeLoader = !mdLoader ? codeModules[docHref(path)] : null
    if (mdLoader) {
      html.value = marked.parse(await mdLoader())
    } else if (codeLoader) {
      html.value = `<pre class="doc-code"><code>${escapeHtml(await codeLoader())}</code></pre>`
    } else {
      html.value = '<p class="doc-missing">文档内容缺失,请重跑 <code>npm run sync-docs</code> 同步。</p>'
    }
  } finally {
    loading.value = false
  }
  await nextTick()
  postProcess()
  if (mainEl.value) mainEl.value.scrollTop = 0
}

// 渲染后处理:站内文档链接转接内部导航,其余链接新窗口打开
function postProcess() {
  if (!mainEl.value) return
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
      <input v-model="filter" class="docs-search" type="text" placeholder="筛选文档…" aria-label="筛选文档">
      <!-- 用 div 而非 nav:原版 style.css 的裸元素选择器 nav{position:fixed} 会劫持文档侧栏 -->
      <div class="docs-nav" role="navigation" aria-label="文档目录">
        <template v-for="cat in filteredCats" :key="cat.id">
          <div class="docs-cat">{{ cat.label }}</div>
          <button v-for="it in cat.items" :key="it.path"
                  type="button" class="docs-item" :class="{ on: it.path === currentPath }"
                  :title="it.title" @click="open(it)">
            <span class="t">{{ it.title }}</span>
            <span v-if="it.en" class="en-flag" aria-hidden="true">EN</span>
            <span v-else class="en-flag off" aria-hidden="true" title="暂无英文版">EN</span>
          </button>
        </template>
        <div v-if="!filteredCats.length" class="docs-empty">没有匹配的文档</div>
      </div>
    </aside>

    <div class="docs-main" ref="mainEl">
      <div class="docs-toolbar">
        <h3 class="docs-title">{{ currentItem?.title || '' }}</h3>
        <div class="docs-tools">
          <span v-if="loading" class="docs-loading">加载中…</span>
          <template v-if="currentItem?.en">
            <button type="button" class="lang-btn" :class="{ on: lang === 'zh' }" @click="switchLang('zh')">中</button>
            <button type="button" class="lang-btn" :class="{ on: lang === 'en' }" @click="switchLang('en')">EN</button>
          </template>
          <a class="gh-link" :href="ghUrl" target="_blank" rel="noopener">在 GitHub 打开 ↗</a>
        </div>
      </div>
      <!-- 文档内容来自本仓库同步的受信快照,marked 渲染后注入 -->
      <article class="md-body" v-html="html"></article>
    </div>
  </div><!-- /page docs -->
</template>
