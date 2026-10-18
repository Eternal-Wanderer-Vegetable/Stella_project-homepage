#!/usr/bin/env node
// 同步上游仓库 Stella_project 的文档到本仓库 docs-content/,并生成 manifest.json。
// 文档内容以快照形式进版本库,构建与部署不依赖网络;上游更新后重跑本脚本即可。
//
// 上游 docs/ 已重组为「顶层导航壳 + 子目录正文」结构。本站呈现方式:
//   - 侧栏 = 索引(分节标题 + 篇目),右侧 = 完整正文;
//   - 索引类文本(各节 README)只用作分节标题,不写入快照、不作可读条目;
//   - 顶层 compat 壳与档案类(plans/reports/migration 验收证据)不入站。
//
// 用法:  npm run sync-docs
// 凭据:  优先 GITHUB_TOKEN 环境变量,否则复用 git credential manager 里 github.com 的凭据。
import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'Eternal-Wanderer-Vegetable/Stella_project'
const REF = 'main'
const SRC_PREFIX = 'docs/'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs-content')

// 站内分节(与上游 docs/README.md 总览表一致,顺序即侧栏顺序)。
// label 优先取该节 README 的一级标题,取不到时用 fallback。
// 插件模板(examples/)与 Agent 工作文档(agent/)刻意不入站:
// 前者是代码模板请读者直接看上游仓库,后者是给 AI 的工作规则,不是给人读的文档。
const SECTIONS = [
  { dir: 'guides', label: '使用指南' },
  { dir: 'architecture', label: '架构' },
  { dir: 'reference', label: '配置与接口参考' },
  { dir: 'development', label: '开发' },
]

function getToken() {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN
  const r = spawnSync('git', ['credential', 'fill'], {
    input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8',
  })
  if (r.status === 0) {
    const m = r.stdout.match(/^password=(.*)$/m)
    if (m) return m[1]
  }
  return null
}

const headers = { Accept: 'application/vnd.github.raw' }
const token = getToken()
if (token) headers.Authorization = `Bearer ${token}`
else console.warn('未找到 GitHub 凭据,匿名调用 API(60 次/小时,可能不够)')

async function api(path, accept) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: accept ? { ...headers, Accept: accept } : headers,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${path}`)
  return res
}

function titleFromMd(text, fallback) {
  const m = text.match(/^#\s+(.+)$/m)
  return m ? m[1].trim().replace(/[#*`]/g, '') : fallback
}

function writeSnap(rel, buf) {
  const file = join(OUT, rel)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, buf)
}

console.log(`拉取 ${REPO}@${REF} 文件树 ...`)
const tree = await (await api(`/repos/${REPO}/git/trees/${REF}?recursive=1`)).json()

// 收集各分节文件;md 与(模板节会出现的)代码文件入站,其余忽略
const wanted = new Map()   // 'dir/' → blobs[]
for (const s of SECTIONS) wanted.set(s.dir + '/', [])
for (const t of tree.tree) {
  if (t.type !== 'blob' || !t.path.startsWith(SRC_PREFIX)) continue
  if (!t.path.endsWith('.md')) continue
  const rel = t.path.slice(SRC_PREFIX.length)
  for (const [prefix, list] of wanted) {
    if (rel.startsWith(prefix)) list.push(t)
  }
}

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

const categories = []
let enCount = 0

for (const s of SECTIONS) {
  const blobs = wanted.get(s.dir + '/')
  const items = []
  const enByItem = new Map()   // item.path → en 相对路径(不带 docs/ 前缀)
  let label = s.label

  for (const t of blobs) {
    const rel = t.path.slice(SRC_PREFIX.length)          // 如 guides/install.md
    const inSection = rel.slice(s.dir.length + 1)        // 如 install.md
    const res = await api(`/repos/${REPO}/contents/${t.path}?ref=${REF}`, 'application/vnd.github.raw')
    const buf = Buffer.from(await res.arrayBuffer())
    const text = buf.toString('utf8')

    // 分节 README = 索引:只取一级标题作分节名,不写入快照、不作条目。
    // 标题若是目录名本身(如模板插件以其仓库名为标题),退回固定 label
    if (inSection === 'README.md' || inSection === 'README.en.md') {
      if (inSection === 'README.md') {
        const t = titleFromMd(text, s.label)
        label = t && t.toLowerCase() !== s.dir.split('/').pop().toLowerCase() ? t : s.label
      }
      continue
    }

    writeSnap(rel, buf)

    const enMatch = rel.match(/^(.+)\.en\.md$/)
    if (enMatch) {
      enCount++
      continue   // 英文变体入快照但不单列条目,由对应中文条目的 EN 开关加载
    }

    items.push({
      path: t.path,
      file: rel,
      size: buf.length,
      title: t.path.endsWith('.md') ? titleFromMd(text, basename(rel, '.md')) : basename(rel),
    })
    if (t.path.endsWith('.md')) {
      const enRel = rel.slice(0, -'.md'.length) + '.en.md'
      if (blobs.some((b) => b.path === SRC_PREFIX + enRel)) enByItem.set(t.path, enRel)
    }
  }

  for (const it of items) {
    const enRel = enByItem.get(it.path)
    if (enRel) it.en = SRC_PREFIX + enRel
  }
  items.sort((a, b) => a.file.localeCompare(b.file))

  if (items.length) {
    categories.push({ id: s.dir.replace(/\//g, '-'), label, items })
  }
}

const manifest = {
  source: { repo: REPO, ref: REF, syncedAt: new Date().toISOString() },
  githubBase: `https://github.com/${REPO}/blob/${REF}/`,
  categories,
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))

console.log(`完成:${categories.length} 个分节,${categories.reduce((s, c) => s + c.items.length, 0)} 篇正文(+${enCount} 个英文文件)写入 docs-content/`)
