#!/usr/bin/env node
// SEO 校验:在 generate-static-pages 之后运行,保证构建产物始终可索引(设计见 docs/design/seo-geo.md)。
// 检查失败即退出码 1,部署工作流会因此中断,防止一次同步/改版悄悄破坏 SEO。
import { readFileSync, existsSync } from 'node:fs'
import { dirname, join, posix } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const SITE = 'https://eternal-wanderer-vegetable.github.io/Stella_project-homepage'

const manifest = JSON.parse(readFileSync(join(ROOT, 'docs-content', 'manifest.json'), 'utf-8'))
const faqContent = JSON.parse(readFileSync(join(ROOT, 'src', 'content', 'faq.json'), 'utf-8'))

const problems = []
const fail = (msg) => problems.push(msg)

// 期望的页面清单(与 generate-static-pages 同一推导:中文必有,声明了 en 且译文文件存在才有英文页)
function expectedPages() {
  const out = []
  for (const cat of manifest.categories) {
    for (const item of cat.items) {
      out.push({ lang: 'zh', siteDir: `docs/zh/${item.file.replace(/\.md$/, '')}`, item, title: item.title })
      if (item.en) {
        const enFile = item.en.slice('docs/'.length)
        if (existsSync(join(ROOT, 'docs-content', enFile))) {
          out.push({ lang: 'en', siteDir: `docs/en/${enFile.replace(/\.en\.md$/, '')}`, item, title: item.titleEn || item.title })
        } else {
          fail(`manifest 声明了译文但文件缺失: ${item.en}`)
        }
      }
    }
  }
  for (const lang of ['zh', 'en']) {
    out.push({ lang, siteDir: lang === 'zh' ? 'faq' : `faq/${lang}`, faq: true })
  }
  return out
}

function stripTags(html) {
  return html.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<script[\s\S]*?<\/script>/g, '')
    .replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim()
}

const pages = expectedPages()
const canonicals = new Set()
const seenTitles = new Map()
const fileOf = (p) => join(DIST, p.siteDir, 'index.html')

for (const p of pages) {
  const file = fileOf(p)
  if (!existsSync(file)) { fail(`缺静态页: ${p.siteDir}/index.html`); continue }
  const html = readFileSync(file, 'utf-8')

  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1]
  if (!title || !title.trim()) fail(`${p.siteDir}: <title> 为空`)
  if (title && seenTitles.has(title)) fail(`${p.siteDir}: <title> 与 ${seenTitles.get(title)} 重复`)
  if (title) seenTitles.set(title, p.siteDir)

  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1]
  if (!desc || desc.length < 20) fail(`${p.siteDir}: description 缺失或过短`)
  if (desc && desc.length > 320) fail(`${p.siteDir}: description 超过 320 字符`)

  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1]
  const wantCanonical = `${SITE}/${p.siteDir}/`
  if (canonical !== wantCanonical) fail(`${p.siteDir}: canonical 为 ${canonical},期望 ${wantCanonical}`)
  if (canonical) {
    if (canonicals.has(canonical)) fail(`${p.siteDir}: canonical 重复`)
    canonicals.add(canonical)
  }

  // 正文不依赖 JS:剥掉标签后仍要有足量文字
  const textLen = stripTags(html).length
  if (textLen < 300) fail(`${p.siteDir}: 可读正文过短(${textLen} 字符),疑似依赖 JS`)

  if (!/property="og:image"/.test(html)) fail(`${p.siteDir}: 缺 og:image`)

  // hreflang:中文页与英文页互相引用,x-default 指中文版
  const group = pages.filter((q) => q.item === p.item && q.item)
  const enTwin = group.find((q) => q.lang === 'en')
  const zhSelf = group.find((q) => q.lang === 'zh') || (p.lang === 'zh' ? p : null)
  const zhUrl = zhSelf ? `${SITE}/${zhSelf.siteDir}/` : `${SITE}/faq/`
  const need = [`<link rel="alternate" hreflang="zh-CN" href="${zhUrl}">`,
    `<link rel="alternate" hreflang="x-default" href="${zhUrl}">`]
  if (enTwin) need.push(`<link rel="alternate" hreflang="en" href="${SITE}/${enTwin.siteDir}/">`)
  for (const tag of need) if (!html.includes(tag)) fail(`${p.siteDir}: 缺 hreflang ${tag}`)
}

// FAQ 内容里的深链必须能解析到 manifest 条目(防上游重组后链接悄悄失效)
const itemPaths = new Set(manifest.categories.flatMap((c) => c.items.map((i) => i.path)))
for (const lang of ['zh', 'en']) {
  for (const it of faqContent[lang].items) {
    if (it.link && !itemPaths.has(it.link)) fail(`faq.${lang} 深链无法解析: ${it.link}`)
  }
}

// 静态页内的站内相对链接都要落在真实产物上(抓改写错误)
for (const p of pages) {
  const file = fileOf(p)
  if (!existsSync(file)) continue
  const html = readFileSync(file, 'utf-8')
  const base = p.siteDir + '/'
  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1]
    if (/^(https?:|mailto:|#|data:)/.test(href)) continue
    const target = posix.normalize(posix.join(base, href))
    const ok = existsSync(join(DIST, target)) || existsSync(join(DIST, target, 'index.html'))
      || (href.includes('#') && existsSync(join(DIST, target.split('#')[0], 'index.html')))
    if (!ok) fail(`${p.siteDir}: 站内链接悬空 ${href}`)
  }
}

// 首页 head:canonical / og:image / JSON-LD 可解析
const homeHtml = readFileSync(join(DIST, 'index.html'), 'utf-8')
if (!/<link rel="canonical" href="[^"]+"\/?>/.test(homeHtml)) fail('首页: 缺 canonical')
if (!/property="og:image" content="[^"]+"/.test(homeHtml)) fail('首页: 缺 og:image')
const ld = homeHtml.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
if (!ld) fail('首页: 缺 JSON-LD')
else {
  try {
    const data = JSON.parse(ld[1])
    if (data['@type'] !== 'SoftwareApplication') fail(`首页: JSON-LD @type=${data['@type']},期望 SoftwareApplication`)
  } catch (e) { fail(`首页: JSON-LD 解析失败 ${e.message}`) }
}

// sitemap 与实际产物一一对应(不多不少)
const sm = readFileSync(join(DIST, 'sitemap.xml'), 'utf-8')
const locs = new Set([...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))
const want = new Set([`${SITE}/`, ...pages.map((p) => `${SITE}/${p.siteDir}/`)])
for (const l of locs) if (!want.has(l)) fail(`sitemap 多余 URL: ${l}`)
for (const w of want) if (!locs.has(w)) fail(`sitemap 缺 URL: ${w}`)
if (!/<xhtml:link rel="alternate" hreflang="x-default"/.test(sm)) fail('sitemap: 缺 x-default alternates')

// llms.txt 基本成形
const llms = readFileSync(join(DIST, 'llms.txt'), 'utf-8')
if (!llms.startsWith('# Stella') || !llms.includes(`${SITE}/docs/zh/`)) fail('llms.txt: 内容不完整')

if (problems.length) {
  console.error(`check-seo: ${problems.length} 个问题`)
  for (const p of problems) console.error('  ✗ ' + p)
  process.exit(1)
}
console.log(`check-seo: ${pages.length} 个静态页 + 首页 + sitemap(${locs.size} URLs) + llms.txt 全部通过`)
