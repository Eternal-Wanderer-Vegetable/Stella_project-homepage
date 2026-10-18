import { ref } from 'vue'

/* ================================================================
   全站语言状态:中文(zh)/英文(en)。
   首次访问按系统语言自动选择:任何 zh 变体(含繁体 zh-TW/zh-HK)→ 简体中文,
   其他语言 → 英文。手动切换后写入 localStorage,此后以存储值为准不再检测。
   ================================================================ */

function detect() {
  const langs = (navigator.languages && navigator.languages.length)
    ? navigator.languages
    : [navigator.language]
  for (const l of langs) {
    if (l && String(l).toLowerCase().startsWith('zh')) return 'zh'
  }
  return 'en'
}

let stored = null
try { stored = localStorage.getItem('stella-lang') } catch (e) {}
export const locale = ref(stored === 'en' || stored === 'zh' ? stored : detect())

export function setLocale(l) {
  locale.value = l
  try { localStorage.setItem('stella-lang', l) } catch (e) {}
  applyLangAttr()
  // 语言切换衔接:挂 body.lang-swap 触发各屏文案容器的淡入动画(纯 CSS,内嵌安全)。
  // 先移除再强制重排后加回,连续快速切换也会重播动画
  const body = document.body
  body.classList.remove('lang-swap')
  void body.offsetWidth
  body.classList.add('lang-swap')
  clearTimeout(setLocale._t)
  setLocale._t = setTimeout(() => body.classList.remove('lang-swap'), 700)
}

function applyLangAttr() {
  document.documentElement.lang = locale.value === 'zh' ? 'zh-CN' : 'en'
}
applyLangAttr()

const DICT = {
  zh: {
    'nav.home': '首页',
    'nav.quickstart': '快速开始',
    'nav.docs': '文档',
    'hero.eyebrow': 'Stella · QQ 群聊拟人化 AI',
    'hero.tagline': '会记得你的 AI,只需要 8192 tokens。',
    'hero.cta': '开始使用 →',
    'hero.cue': '为什么 8192 就够？',
    'mech.eyebrow': 'How · 8192 怎么够用',
    'mech.n1': '记忆', 'mech.n1s': '需要才取出',
    'mech.n2': '旧对话', 'mech.n2s': '压缩掉',
    'mech.n3': '工具', 'mech.n3s': '上下文外执行',
    'mech.line1': '不是把所有东西塞进 Context。',
    'mech.line2': '而是让信息待在它该待的地方。',
    'mech.t1': '记住重要的信息',
    'mech.t2': '在上下文之外执行工具',
    'mech.t3': '压缩已经结束的对话',
    'mech.aria': 'Stella 的机制:记忆需要才取出、旧对话压缩掉、工具在上下文外执行,三条通路汇入 8192 tokens 的核心,产出回复。',
    'mem.aside': '她记得。',
    'mem.words': '长期记忆 · 群聊上下文 · 主动参与',
    'mem.scrollHint': '向下滚动查看完整对话',
    'deploy.title': 'Stella 跑在哪里，由你决定。',
    'deploy.c1h': '完全本地', 'deploy.c1p': '聊天和记忆都留在电脑上。',
    'deploy.c2h': '混合运行', 'deploy.c2p': '记忆留在本地，聊天交给更强的模型。',
    'deploy.c3h': '在线运行', 'deploy.c3p': '让轻量设备也可以运行 Stella。',
    'deploy.aria': '部署谱系:完全本地与在线运行两个极端,混合运行居中,Stella 位于中心。',
    'qs.label': '快速开始',
    'qs.title': 'Windows 桌面版，四步跑起来',
    'qs.desc': '桌面安装器基于 Tauri 2 构建，图形界面完成全部配置；Linux 用户与开发者可直接使用命令行部署。',
    'qs.s1h': '下载并安装 OneClick',
    'qs.s1p1': '从 GitHub ',
    'qs.s1p2': ' 下载安装器，内置嵌入式 Python、llama.cpp CPU 后端、NapCat 与 <code>qwen3-embedding-0.6b</code> 向量模型；另有约 1GB 的全离线包与免安装 Standalone 版。',
    'qs.s2h': 'NapCat 扫码登录 QQ',
    'qs.s2p': '在 NapCat WebUI 添加反向 WebSocket 客户端，指向 <code>ws://127.0.0.1:8080/onebot/v11/ws</code>。',
    'qs.s3h': '配置 Stella',
    'qs.s3p': '打开 <code>Stella.exe</code>：填监听端口与群号 → 「模型服务」点一键预设 —— 本地模式填 LM Studio 地址 + 模型 ID（可测试连接），在线模式填地址 + key + 模型 ID，对话与记忆两把 key。',
    'qs.s4h': '保存并检查，启动',
    'qs.s4p': '「保存并检查」会自动运行 doctor 环境自检，通过后启动；在群里 <strong>@ 机器人</strong>即可对话。',
    'qs.budgetH': '8192 tokens 都花在哪了？',
    'qs.budgetP': '整颗“心智”的预算分配——记忆只占其中一小块，这就是 8K 也够用的原因。',
    'qs.reqH': '环境要求',
    'qs.chip1': '<b>Windows 10/11</b> x64 / Ubuntu 22.04+',
    'qs.chip2': 'Python <b>3.10+</b>（安装器已内置，CLI 部署需要）',
    'qs.chip3': '内存 ≥ <b>16 GB</b>',
    'qs.chip4': '显存 ≥ <b>8 GB</b>（仅本地模式需要）',
    'qs.chip5': '磁盘 ≥ <b>30 GB</b>',
    'qs.devH': '开发者部署（源码运行）',
    'qs.copy': '复制', 'qs.copied': '已复制 ✓',
    'qs.c1': '# 克隆仓库并安装依赖',
    'qs.c2': '# 初始化（向导只要求回答 5 个必答项，生成 .env）',
    'qs.c3': '# 环境自检（分层：probe 采集 → checks 判断 → report 渲染）',
    'qs.c4': '# 启动',
    'qs.note': '也提供 stella / napcat 双容器 Docker Compose 部署（可选 llama profile，镜像内置 Chromium 与中文字体），详见仓库 README。',
    'ring.s1': '人格 · 对话历史 · 工具',
    'ring.s2': '记忆注入',
    'ring.s3': '输出 + 安全余量',
    'ring.unit': 'tokens · 整个心智',
    'ring.aria': 'Stella 的上下文预算:总共 8192 tokens,其中人格、对话历史与工具结论占 6342,记忆注入 650,输出与安全余量 1200',
    'docs.filter': '筛选文档…',
    'docs.dir': '文档目录',
    'docs.none': '没有匹配的文档',
    'docs.loading': '加载中…',
    'docs.opengh': '在 GitHub 打开 ↗',
    'docs.missing': '<p class="doc-missing">文档内容缺失，请重跑 <code>npm run sync-docs</code> 同步。</p>',
  },
  en: {
    'nav.home': 'Home',
    'nav.quickstart': 'Quick Start',
    'nav.docs': 'Docs',
    'hero.eyebrow': 'Stella · Human-like AI for QQ group chats',
    'hero.tagline': 'An AI that remembers you — in just 8192 tokens.',
    'hero.cta': 'Get Started →',
    'hero.cue': 'Why is 8192 enough?',
    'mech.eyebrow': 'How · Why 8192 is enough',
    'mech.n1': 'Memory', 'mech.n1s': 'Pulled in on demand',
    'mech.n2': 'Old chats', 'mech.n2s': 'Compressed away',
    'mech.n3': 'Tools', 'mech.n3s': 'Run outside the context',
    'mech.line1': 'Not cramming everything into the context.',
    'mech.line2': 'It’s keeping information where it belongs.',
    'mech.t1': 'Remembers what matters',
    'mech.t2': 'Runs tools outside the context',
    'mech.t3': 'Compresses conversations that have ended',
    'mech.aria': 'How Stella works: memory is pulled in on demand, old chats are compressed away, tools run outside the context — three paths converge into an 8192-token core that produces the reply.',
    'mem.aside': 'She remembers.',
    'mem.words': 'Long-term memory · Group-chat context · Proactive',
    'mem.scrollHint': 'Scroll to read the full conversation',
    'deploy.title': 'Where Stella runs — your call.',
    'deploy.c1h': 'Fully local', 'deploy.c1p': 'Chat and memory stay on your machine.',
    'deploy.c2h': 'Hybrid', 'deploy.c2p': 'Memory stays local; chat goes to a stronger model.',
    'deploy.c3h': 'Online', 'deploy.c3p': 'Run Stella on lightweight devices too.',
    'deploy.aria': 'Deployment spectrum: fully local and online at the two ends, hybrid in the middle, Stella at the center.',
    'qs.label': 'Quick start',
    'qs.title': 'Windows desktop — up and running in four steps',
    'qs.desc': 'The desktop installer is built on Tauri 2 with all configuration done in a GUI; Linux users and developers can deploy straight from the command line.',
    'qs.s1h': 'Download & install OneClick',
    'qs.s1p1': 'From GitHub ',
    'qs.s1p2': ' download the installer — it bundles embedded Python, the llama.cpp CPU backend, NapCat and the <code>qwen3-embedding-0.6b</code> embedding model; a ~1 GB fully-offline pack and a portable Standalone build are also available.',
    'qs.s2h': 'Log in to QQ via NapCat QR code',
    'qs.s2p': 'In the NapCat WebUI, add a reverse-WebSocket client pointing to <code>ws://127.0.0.1:8080/onebot/v11/ws</code>.',
    'qs.s3h': 'Configure Stella',
    'qs.s3p': 'Open <code>Stella.exe</code>: fill in the listen port and group ID → under “Model service” click a one-click preset — for local mode enter the LM Studio URL + model ID (test connection available); for online mode enter URL + key + model ID, one key each for chat and memory.',
    'qs.s4h': 'Save, check & start',
    'qs.s4p': '“Save & check” runs the doctor self-check automatically and starts on success; <strong>@ the bot</strong> in a group chat to talk.',
    'qs.budgetH': 'Where do the 8192 tokens go?',
    'qs.budgetP': 'The budget breakdown of the whole “mind” — memory takes only a small slice; that’s why 8K is enough.',
    'qs.reqH': 'Requirements',
    'qs.chip1': '<b>Windows 10/11</b> x64 / Ubuntu 22.04+',
    'qs.chip2': 'Python <b>3.10+</b> (bundled with the installer; needed for CLI deploys)',
    'qs.chip3': 'RAM ≥ <b>16 GB</b>',
    'qs.chip4': 'VRAM ≥ <b>8 GB</b> (local mode only)',
    'qs.chip5': 'Disk ≥ <b>30 GB</b>',
    'qs.devH': 'Developer deploy (from source)',
    'qs.copy': 'Copy', 'qs.copied': 'Copied ✓',
    'qs.c1': '# Clone the repo and install dependencies',
    'qs.c2': '# Init (wizard asks only the 5 required items; generates .env)',
    'qs.c3': '# Self-check (layered: probe collect → checks judge → report render)',
    'qs.c4': '# Start',
    'qs.note': 'A stella / napcat two-container Docker Compose deploy is also available (optional llama profile; the image ships Chromium and CJK fonts) — see the repo README.',
    'ring.s1': 'Persona · chat history · tools',
    'ring.s2': 'Memory injection',
    'ring.s3': 'Output + safety margin',
    'ring.unit': 'tokens · the whole mind',
    'ring.aria': 'Stella’s context budget: 8192 tokens in total — persona, chat history and tool results 6342, memory injection 650, output and safety margin 1200',
    'docs.filter': 'Filter docs…',
    'docs.dir': 'Document index',
    'docs.none': 'No matching docs',
    'docs.loading': 'Loading…',
    'docs.opengh': 'Open on GitHub ↗',
    'docs.missing': '<p class="doc-missing">Doc content is missing — re-run <code>npm run sync-docs</code> to sync.</p>',
  },
}

// 取词:当前语言缺失时回退中文,再退回键名
export function t(key) {
  const d = DICT[locale.value]
  return (d && d[key] !== undefined) ? d[key]
    : (DICT.zh[key] !== undefined ? DICT.zh[key] : key)
}
