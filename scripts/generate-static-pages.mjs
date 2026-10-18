#!/usr/bin/env node
// 静态索引层:构建后把 docs-content/ 的文档快照与 FAQ 生成为独立可索引的 HTML 页,
// 并输出 sitemap.xml 与 llms.txt。首页 SPA 不动,两层服务同一套内容(设计见 docs/design/seo-geo.md)。
//
// 用法: vite build 之后执行(已接入 npm run build)
//   - dist/docs/<lang>/<section>/<slug>/index.html  每篇文档一页,正文不依赖 JS
//   - dist/faq/ · dist/faq/en/                      GEO 问答页(中/英)
//   - dist/sitemap.xml                              首页 + 全部静态页,含 hreflang alternates
//   - dist/llms.txt                                 机器可读项目索引(由 manifest 自动生成)
import { marked } from 'marked'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://eternal-wanderer-vegetable.github.io/Stella_project-homepage'

const manifest = JSON.parse(readFileSync(join(ROOT, 'docs-content', 'manifest.json'), 'utf-8'))
const faqContent = JSON.parse(readFileSync(join(ROOT, 'src', 'content', 'faq.json'), 'utf-8'))

marked.setOptions({ gfm: true, breaks: false })

// —— 站点内一枚页面的描述 ————————————————————————————————
// siteDir 形如 'docs/zh/guides/deployment-docker'(无首尾斜杠),写入 dist/<siteDir>/index.html
const pages = []

function addPage(page) {
  pages.push(page)
}

// manifest 条目 → 中/英两个页面(译文缺失时只出中文)
for (const cat of manifest.categories) {
  for (const item of cat.items) {
    const md = readFileSync(join(ROOT, 'docs-content', item.file), 'utf-8')
    const lang = 'zh'
    addPage({
      kind: 'doc', cat: cat.id, catLabel: cat.label, item,
      lang, siteDir: `docs/${lang}/${item.file.replace(/\.md$/, '')}`,
      title: item.title, md,
    })
    if (item.en) {
      const enFile = item.en.slice('docs/'.length)
      const mdEn = readFileSync(join(ROOT, 'docs-content', enFile), 'utf-8')
      addPage({
        kind: 'doc', cat: cat.id, catLabel: cat.labelEn || cat.label, item,
        lang: 'en', siteDir: `docs/en/${enFile.replace(/\.en\.md$/, '')}`,
        title: item.titleEn || item.title, md: mdEn,
      })
    }
  }
}

// FAQ 问答页(GEO 解释性内容,回答只陈述可核对的事实并深链到对应文档)
for (const lang of ['zh', 'en']) {
  const c = faqContent[lang]
  addPage({
    kind: 'faq', lang, siteDir: lang === 'zh' ? 'faq' : `faq/${lang}`,
    title: c.title, faq: c,
  })
}

// —— URL 工具 ————————————————————————————————————————
const urlOf = (p) => `${SITE}/${p.siteDir}/`

// 站内两枚页面目录之间的相对链接(目录都当作以 / 结尾解析,末尾补 / 保证浏览器按目录解析)
function relLink(fromDir, toDir) {
  const rel = posix.relative(fromDir + '/', toDir + '/')
  return rel + '/'
}

// 指向站点根(SPA)的相对链接,本地预览与线上同样有效
function relRoot(fromDir, frag) {
  const up = posix.relative(fromDir + '/', '').replace(/\/$/, '')
  return (up || '.') + '/' + (frag || '')
}

// —— Markdown 预处理与渲染 ——————————————————————————————
// 上游文档首段的纯导航行(「中文 | English · 文档总览」)在静态页同样冗余:页眉已有语言切换与返回
function stripNavLine(md) {
  const lines = md.split('\n')
  let i = 0
  while (i < lines.length && !lines[i].trim()) i++
  // 跳过一级标题后再找首段
  if (i < lines.length && lines[i].trim().startsWith('# ')) {
    i++
    while (i < lines.length && !lines[i].trim()) i++
  }
  const block = []
  let j = i
  while (j < lines.length && lines[j].trim()) block.push(lines[j++])
  const text = block.join('\n')
  const links = [...text.matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1])
  const navLike = links.length > 0 && links.every((h) => /\.md(\s*$|#)/.test(h)) &&
    /(中文|English|文档总览|Agent 导航)/.test(text) && text.length < 200
  if (navLike) return lines.slice(0, i).concat(lines.slice(j)).join('\n')
  return md
}

const plainText = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ')
  .replace(/\s+([，。；：、）】》！？])/g, '$1')
  .replace(/\s+/g, ' ').trim()

// 个别文档(如纯目录树的 code-map)没有可提取的正文描述,手写覆盖;键为 manifest 条目路径
const DESCRIPTION_OVERRIDES = {
  'docs/architecture/code-map.md': '以目录树形式速查 Stella 仓库的分层布局:各顶层目录与关键文件的职责,从 bot.py 启动入口到 config、memory、capability 等模块。',
  'docs/architecture/code-map.en.md': 'A directory-tree quick reference to the Stella repository layout: what each top-level directory and key file is for, from the bot.py entrypoint to the config, memory and capability modules.',
}

// 描述提取:首个非空段落(≥40 字符);没有就取剔除代码块后的正文开头;再不行退回标题。
// 上游文档常有空锚点段落(<p><a id=…></a></p>)或以目录树代码块开头,都要跳过
function describeDoc(md, sourcePath, title) {
  if (DESCRIPTION_OVERRIDES[sourcePath]) return DESCRIPTION_OVERRIDES[sourcePath]
  const html = marked.parse(stripNavLine(md)).replace(/<pre[\s\S]*?<\/pre>/g, ' ')
  for (const m of html.matchAll(/<p>([\s\S]*?)<\/p>/g)) {
    const text = plainText(m[1])
    if (text.length >= 40) return excerpt(text, 156)
  }
  const all = plainText(html.replace(/<h1[\s\S]*?<\/h1>/, ' '))
  return excerpt(all.length >= 40 ? all : title, 156)
}

function excerpt(s, max) {
  if (s.length <= max) return s
  return s.slice(0, max - 1).replace(/\s+\S*$/, '') + '…'
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// 标题锚点:文本 slug(CJK 保留),页内去重
function headingSlugs(html) {
  const used = new Map()
  return html.replace(/<h([2-4])>([\s\S]*?)<\/h\1>/g, (all, lv, inner) => {
    let slug = inner.replace(/<[^>]+>/g, '').trim().toLowerCase()
      .replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-')
    if (!slug) slug = 'sec'
    const n = (used.get(slug) || 0) + 1
    used.set(slug, n)
    return `<h${lv} id="${slug}${n > 1 ? '-' + n : ''}">${inner}</h${lv}>`
  })
}

// 文内相对链接 → 对应静态页;解析不到的回退上游 GitHub。
// 候选按上游真实位置解析:链接相对于 docs/<dir>/ 展开,再试 docs/ 根;注意 manifest 条目都带 docs/ 前缀
const allItems = manifest.categories.flatMap((c) => c.items)
function resolveDocLink(clean, fromItem) {
  const dir = fromItem.file.split('/').slice(0, -1).join('/')
  const norm = (base) => posix.normalize(posix.join(base, clean)).replace(/\\/g, '/')
  const candidates = [clean, norm(posix.join('docs', dir)), norm('docs')]
  for (const c of candidates) {
    const hit = allItems.find((i) => i.path === c || i.en === c)
    if (hit) return hit
  }
  return null
}

function rewriteLinks(html, page) {
  const fromItem = page.item
  const dir = fromItem.file.split('/').slice(0, -1).join('/')
  return html.replace(/<a href="([^"]*)"([^>]*)>/g, (all, href, attrs) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all   // 外链与页内锚点不动
    const [clean] = href.split('#')
    const hit = resolveDocLink(clean, fromItem)
    if (hit) {
      const target = pages.find((p) => p.kind === 'doc' && p.lang === page.lang && p.item === hit)
        || pages.find((p) => p.kind === 'doc' && p.item === hit)
      return `<a href="${relLink(page.siteDir, target.siteDir)}"${attrs}>`
    }
    // 上游相对位置:docs/<dir>/<clean>,保留开头的 ..(指向 docs/ 之外的仓库文件)
    const upstream = posix.normalize(posix.join('docs', dir, clean)).replace(/\\/g, '/')
    return `<a href="${manifest.githubBase + upstream}" target="_blank" rel="noopener"${attrs}>`
  })
}

// —— 页面模板(内联样式,零 JS:爬虫与无 JS 环境可直接读正文) ————————————
const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cpath d='M50 5 L58 42 L95 50 L58 58 L50 95 L42 58 L5 50 L42 42 Z' fill='%23f6c96b'/%3E%3C/svg%3E`

// 同一内容的所有语言版本(kind + manifest 条目身份;FAQ 两语言同为 kind 'faq')
function langGroup(page) {
  return pages.filter((p) => p.kind === page.kind && p.item === page.item)
}

function alternates(page) {
  const group = langGroup(page)
  const byLang = (l) => group.find((p) => p.lang === l)
  const zh = byLang('zh')
  const en = byLang('en')
  const tags = [`<link rel="alternate" hreflang="zh-CN" href="${urlOf(zh)}">`]
  if (en) tags.push(`<link rel="alternate" hreflang="en" href="${urlOf(en)}">`)
  tags.push(`<link rel="alternate" hreflang="x-default" href="${urlOf(zh)}">`)
  return tags.join('\n')
}

function langNav(page) {
  const twin = pages.find((p) => p.kind === page.kind && p.item === page.item && p.lang !== page.lang)
  if (!twin) return ''
  return `<a class="lang" href="${relLink(page.siteDir, twin.siteDir)}" hreflang="${twin.lang}">${twin.lang === 'en' ? 'English' : '中文'}</a>`
}

const PAGE_CSS = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#070a14;color:#dfe3ee;font:16px/1.75 "PingFang SC","Microsoft YaHei","Segoe UI",system-ui,sans-serif}
a{color:#8ab4ff;text-decoration:none}
a:hover{text-decoration:underline}
.wrap{max-width:860px;margin:0 auto;padding:0 20px}
header{border-bottom:1px solid #1c2337;background:rgba(7,10,20,.9)}
.bar{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:16px 0}
.brand{display:flex;align-items:center;gap:10px;color:#f6c96b;font-weight:700;font-size:17px;letter-spacing:.02em}
.brand:hover{text-decoration:none}
.lang{color:#8a93ad;font-size:14px}
.crumb{color:#8a93ad;font-size:13px;padding:20px 0 0}
h1{font-size:30px;line-height:1.35;margin:10px 0 8px;color:#f2f4fa}
.meta{color:#69718a;font-size:13px;margin-bottom:8px}
.back{display:inline-block;margin:14px 0 0;padding:7px 14px;border:1px solid #2a3450;border-radius:999px;color:#c8cede;font-size:14px}
.back:hover{border-color:#f6c96b;color:#f6c96b;text-decoration:none}
.md-body{padding:12px 0 40px}
.md-body h2{font-size:23px;color:#f2f4fa;margin:2em 0 .6em;line-height:1.4}
.md-body h3{font-size:19px;color:#e6e9f3;margin:1.6em 0 .5em}
.md-body p,.md-body li{color:#c3c9da}
.md-body code{background:#0e1526;border:1px solid #1c2337;border-radius:5px;padding:.1em .4em;font-size:.88em;font-family:ui-monospace,Consolas,monospace;color:#e8c987}
.md-body pre{background:#0a0f1e;border:1px solid #1c2337;border-radius:10px;padding:14px 16px;overflow:auto;line-height:1.55}
.md-body pre code{background:none;border:none;padding:0;color:#cdd4e6}
.md-body blockquote{margin:1em 0;padding:.2em 1em;border-left:3px solid #2a3450;color:#8a93ad}
.md-body table{border-collapse:collapse;width:100%;margin:1em 0;font-size:.92em;display:block;overflow:auto}
.md-body th,.md-body td{border:1px solid #1c2337;padding:7px 11px;text-align:left}
.md-body th{background:#0e1526;color:#e6e9f3}
.md-body hr{border:none;border-top:1px solid #1c2337;margin:2.2em 0}
footer{border-top:1px solid #1c2337;color:#69718a;font-size:13px;line-height:2}
footer .wrap{padding:22px 20px}
@media (max-width:640px){h1{font-size:24px}.md-body h2{font-size:20px}}
`

function shell(page, bodyHtml, desc) {
  const url = urlOf(page)
  const title = `${page.title} · ${page.lang === 'zh' ? 'Stella 文档' : 'Stella Docs'}`
  const ogType = page.kind === 'doc' ? 'article' : 'website'
  return `<!DOCTYPE html>
<html lang="${page.lang === 'zh' ? 'zh-CN' : 'en'}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(desc)}">
<meta name="theme-color" content="#070a14">
<link rel="canonical" href="${url}">
<link rel="icon" href="${FAVICON}">
${alternates(page)}
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="Stella">
<meta property="og:title" content="${escapeHtml(page.title)}">
<meta property="og:description" content="${escapeHtml(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}/og-cover.png">
<meta name="twitter:card" content="summary_large_image">
</head>
<body>
<header><div class="wrap bar">
<a class="brand" href="${relRoot(page.siteDir)}"><span aria-hidden="true">✦</span> Stella</a>
${langNav(page)}
</div></header>
<main class="wrap">
${bodyHtml}
</main>
<footer><div class="wrap">
<p>${page.footerNote}<br>
${escapeHtml(manifest.githubBase + (page.item ? page.item.path : 'README.md'))} · ${escapeHtml((manifest.source.syncedAt || '').slice(0, 10))}</p>
</div></footer>
<style>${PAGE_CSS}</style>
</body>
</html>
`
}

function docBody(page) {
  // 首个 h1 已用作页面大标题,正文里再去一遍会重复
  let html = marked.parse(stripNavLine(page.md)).replace(/^<h1[^>]*>[\s\S]*?<\/h1>/, '')
  html = headingSlugs(html)
  html = rewriteLinks(html, page)
  const home = relRoot(page.siteDir)
  const panel = relRoot(page.siteDir, '#docs')
  return `<nav class="crumb"><a href="${home}">Stella</a> / ${escapeHtml(page.catLabel)}</nav>
<h1>${escapeHtml(page.title)}</h1>
<p class="meta">${page.lang === 'zh' ? '来自 Stella 主仓库的文档快照' : 'Documentation snapshot from the Stella repository'}</p>
<article class="md-body">${html}</article>
<p><a class="back" href="${panel}">${page.lang === 'zh' ? '✦ 在交互文档中继续浏览' : '✦ Continue in the interactive docs'}</a></p>`
}

function faqBody(page) {
  const c = page.faq
  const items = c.items.map((it) => {
    let link = ''
    if (it.link) {
      // manifest 条目路径 → 对应静态页;当前语言无译文时回退中文页
      const target = pages.find((p) => p.kind === 'doc' && p.lang === page.lang && p.item && p.item.path === it.link)
        || pages.find((p) => p.kind === 'doc' && p.item && p.item.path === it.link)
      if (target) link = `<p><a href="${relLink(page.siteDir, target.siteDir)}">${page.lang === 'zh' ? '详见文档' : 'See the docs'} →</a></p>`
    }
    return `<section><h2>${escapeHtml(it.q)}</h2><p>${escapeHtml(it.a)}</p>${link}</section>`
  }).join('\n')
  const home = relRoot(page.siteDir)
  return `<nav class="crumb"><a href="${home}">Stella</a> / FAQ</nav>
<h1>${escapeHtml(c.title)}</h1>
<p class="meta">${escapeHtml(c.intro)}</p>
<article class="md-body">${items}</article>
<p><a class="back" href="${relRoot(page.siteDir, '#docs')}">${page.lang === 'zh' ? '✦ 阅读完整技术文档' : '✦ Read the full docs'}</a></p>`
}

for (const page of pages) {
  const desc = page.kind === 'doc'
    ? describeDoc(page.md, page.lang === 'zh' ? page.item.path : page.item.en, page.title)
    : excerpt(page.faq.intro, 156)
  page.footerNote = page.kind === 'doc'
    ? (page.lang === 'zh' ? '本文为静态快照,内容以主仓库为准。' : 'Static snapshot; the upstream repository is authoritative.')
    : (page.lang === 'zh' ? '回答基于当前文档快照陈述事实。' : 'Answers state facts from the current docs snapshot.')
  const bodyHtml = page.kind === 'doc' ? docBody(page) : faqBody(page)
  const out = join(DIST, page.siteDir, 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, shell(page, bodyHtml, desc))
}

// —— sitemap.xml(首页 + 全部静态页;每个 URL 列出全部语言版本,含自身,x-default 指中文) ——
const syncedDate = (manifest.source.syncedAt || new Date().toISOString()).slice(0, 10)
const docPages = pages.filter((p) => p.kind === 'doc')

// 按内容身份分组(doc 按 manifest 条目,FAQ 两语言一组);每个语言版本各一条 <url>,互列 alternates
const groups = new Map()
for (const p of pages) {
  const key = p.kind === 'doc' ? 'doc:' + p.item.path : 'faq'
  if (!groups.has(key)) groups.set(key, [])
  groups.get(key).push(p)
}
const urlXml = [
  `  <url><loc>${SITE}/</loc><lastmod>${syncedDate}</lastmod></url>`,
  ...[...groups.values()].flatMap((group) => {
    const zh = group.find((p) => p.lang === 'zh')
    const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${urlOf(zh)}"/>`
    return group.map((p) => {
      const alts = group
        .map((q) => `    <xhtml:link rel="alternate" hreflang="${q.lang === 'zh' ? 'zh-CN' : 'en'}" href="${urlOf(q)}"/>`)
      alts.push(xdefault)
      return `  <url><loc>${urlOf(p)}</loc><lastmod>${syncedDate}</lastmod>\n${alts.join('\n')}\n  </url>`
    })
  }),
].join('\n')
writeFileSync(join(DIST, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlXml}
</urlset>
`)

// —— llms.txt(机器可读项目索引;Google 官方声明不以此作为收录信号,仅备将来) ————
const llms = [`# ${faqContent.llmsTitle || 'Stella'}`, '', `> ${faqContent.llmsDesc}`, '',
  `Home: ${SITE}/`, `Docs: ${SITE}/docs/zh/`, `Docs (English): ${SITE}/docs/en/`,
  `FAQ: ${SITE}/faq/`, `Source: https://github.com/Eternal-Wanderer-Vegetable/Stella_project`, '',
  '## Docs', '',
  ...docPages.filter((p) => p.lang === 'zh').map((p) => `- [${p.title}](${urlOf(p)})`),
  '', '## Docs (English)', '',
  ...docPages.filter((p) => p.lang === 'en').map((p) => `- [${p.title}](${urlOf(p)})`),
  '',
].join('\n')
writeFileSync(join(DIST, 'llms.txt'), llms)

console.log(`generate-static-pages: ${pages.length} pages, sitemap.xml, llms.txt → dist/`)
