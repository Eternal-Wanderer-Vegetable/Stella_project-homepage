#!/usr/bin/env node
// 同步上游仓库 Stella_project 的核心文档(docs/ 顶层 *.md)到本仓库 docs-content/,
// 并生成 manifest.json。文档内容以快照形式进版本库,构建与部署不依赖网络;
// 上游更新后重跑本脚本即可。
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

// 展示顺序(与 README「文档」表一致,新特性文档排其后);未列出的按文件名追加
const CORE_ORDER = [
  'architecture', 'memory-system', 'capability-system', 'plugin-spec', 'configuration',
  'deployment-docker', 'development', 'cometa', 'scheduling', 'skills',
  'knowledge-base', 'webui', 'memory-rust-backend',
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

console.log(`拉取 ${REPO}@${REF} 文件树 ...`)
const tree = await (await api(`/repos/${REPO}/git/trees/${REF}?recursive=1`)).json()
// 只保留核心文档:docs/ 顶层 *.md(含 .en.md 变体);迁移档案/示例/计划等子目录
// 一律排除;migration-report-template 是迁移工具模板,也排除
const EXCLUDED = new Set(['migration-report-template.md', 'migration-report-template.en.md'])
const blobs = tree.tree.filter((t) =>
  t.type === 'blob' && t.path.startsWith(SRC_PREFIX) &&
  !t.path.slice(SRC_PREFIX.length).includes('/') && t.path.endsWith('.md') &&
  !EXCLUDED.has(t.path.slice(SRC_PREFIX.length)))
console.log(`docs/ 顶层文档 ${blobs.length} 个,开始下载 ...`)

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

const core = []
const enSet = new Map()   // zh 路径 → en 相对路径

for (const t of blobs) {
  const rel = t.path.slice(SRC_PREFIX.length)          // 如 architecture.md
  const res = await api(`/repos/${REPO}/contents/${t.path}?ref=${REF}`, 'application/vnd.github.raw')
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(join(OUT, rel), buf)

  const item = {
    path: t.path,                       // 上游仓库内的完整路径
    file: rel,                          // docs-content/ 下的相对路径
    size: buf.length,
    title: titleFromMd(buf.toString('utf8'), basename(rel, '.md')),
  }

  const enMatch = rel.match(/^(.+)\.en\.md$/)
  if (enMatch) enSet.set(SRC_PREFIX + enMatch[1] + '.md', rel)
  else core.push(item)
}

// 排序 + 挂 en 变体
core.sort((a, b) => {
  const ia = CORE_ORDER.indexOf(basename(a.file, '.md'))
  const ib = CORE_ORDER.indexOf(basename(b.file, '.md'))
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.file.localeCompare(b.file)
})
for (const c of core) if (enSet.has(c.path)) c.en = SRC_PREFIX + enSet.get(c.path)

const manifest = {
  source: { repo: REPO, ref: REF, syncedAt: new Date().toISOString() },
  githubBase: `https://github.com/${REPO}/blob/${REF}/`,
  categories: [
    { id: 'core', label: '核心文档', items: core },
  ],
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))

console.log(`完成:${core.length} 篇核心文档(+${enSet.size} 个英文版)写入 docs-content/`)
