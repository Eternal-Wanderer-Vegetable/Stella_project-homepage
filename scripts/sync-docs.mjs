#!/usr/bin/env node
// 同步上游仓库 Stella_project 的 docs/ 到本仓库 docs-content/,并生成 manifest.json。
// 文档内容以快照形式进版本库,构建与部署不依赖网络;上游更新后重跑本脚本即可。
//
// 用法:  node scripts/sync-docs.mjs
// 凭据:  优先 GITHUB_TOKEN 环境变量,否则复用 git credential manager 里 github.com 的凭据。
import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync, readdirSync, statSync, rmSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = 'Eternal-Wanderer-Vegetable/Stella_project'
const REF = 'main'
const SRC_PREFIX = 'docs/'
const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'docs-content')

// 核心文档的展示顺序(与 README「文档」表一致,新特性文档排其后);未列出的按文件名追加
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

const langOf = (name) => ({ py: 'python', toml: 'toml', yaml: 'yaml', yml: 'yaml', json: 'json' })[name] || ''

console.log(`拉取 ${REPO}@${REF} 文件树 ...`)
const tree = await (await api(`/repos/${REPO}/git/trees/${REF}?recursive=1`)).json()
const blobs = tree.tree.filter((t) => t.type === 'blob' && t.path.startsWith(SRC_PREFIX))
console.log(`docs/ 下共 ${blobs.length} 个文件,开始下载 ...`)

if (existsSync(OUT)) rmSync(OUT, { recursive: true })
mkdirSync(OUT, { recursive: true })

const core = [], examples = [], migration = [], plans = []
const coreSet = new Map() // zh 路径 → en 路径

for (const t of blobs) {
  const rel = t.path.slice(SRC_PREFIX.length)          // 相对 docs/,如 architecture.md
  const res = await api(`/repos/${REPO}/contents/${t.path}?ref=${REF}`, 'application/vnd.github.raw')
  const buf = Buffer.from(await res.arrayBuffer())
  mkdirSync(join(OUT, dirname(rel)), { recursive: true })
  writeFileSync(join(OUT, rel), buf)

  const item = {
    path: t.path,                       // 上游仓库内的完整路径
    file: rel,                          // docs-content/ 下的相对路径
    size: buf.length,
  }

  let m
  if ((m = rel.match(/^(.+)\.en\.md$/))) {
    item.title = titleFromMd(buf.toString('utf8'), basename(rel))
    coreSet.set(SRC_PREFIX + m[1] + '.md', rel)
    continue                             // en 变体不单独立项,挂到 zh 条目上
  }

  if (rel === 'migration-report-template.md' || rel.startsWith('migration/')) {
    item.title = titleFromMd(buf.toString('utf8'), basename(rel, '.md'))
    migration.push(item)
  } else if (rel.startsWith('plans/')) {
    item.title = titleFromMd(buf.toString('utf8'), basename(rel, '.md'))
    plans.push(item)
  } else if (rel.startsWith('examples/')) {
    if (rel.endsWith('.md')) {
      item.title = titleFromMd(buf.toString('utf8'), basename(rel))
      examples.push(item)
    } else {
      item.kind = 'code'; item.lang = langOf(rel); item.title = basename(rel)
      examples.push(item)
    }
  } else if (/\.md$/.test(rel)) {
    item.title = titleFromMd(buf.toString('utf8'), basename(rel, '.md'))
    core.push(item)
  } else {
    console.warn('跳过非文档文件:', t.path)
  }
}

// 核心文档排序 + 挂 en 变体
core.sort((a, b) => {
  const ia = CORE_ORDER.indexOf(basename(a.file, '.md'))
  const ib = CORE_ORDER.indexOf(basename(b.file, '.md'))
  return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.file.localeCompare(b.file)
})
for (const c of core) if (coreSet.has(c.path)) c.en = SRC_PREFIX + coreSet.get(c.path)
for (const c of core) if (c.en) c.sizeEn = blobs.find((b) => b.path === c.en)?.size

plans.sort((a, b) => b.file.localeCompare(a.file))     // 计划文档按文件名日期,最新在前

const manifest = {
  source: { repo: REPO, ref: REF, syncedAt: new Date().toISOString() },
  githubBase: `https://github.com/${REPO}/blob/${REF}/`,
  categories: [
    { id: 'core', label: '核心文档', items: core },
    { id: 'migration', label: '迁移档案', items: migration },
    { id: 'examples', label: '插件模板示例', items: examples },
    { id: 'plans', label: '开发计划', items: plans },
  ],
}
writeFileSync(join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2))

const count = core.length + migration.length + examples.length + plans.length +
  [...coreSet.values()].length
console.log(`完成:${count} 个文件写入 docs-content/,manifest 含 ${core.length} 核心文档` +
  ` / ${migration.length} 迁移 / ${examples.length} 示例 / ${plans.length} 计划`)
