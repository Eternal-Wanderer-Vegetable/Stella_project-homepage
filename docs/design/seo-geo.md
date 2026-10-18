# SEO / GEO 优化方案（展示层与索引层并行）

> 依据 2026-10-18 ChatGPT 对话《SEO与GEO优化方案》制定，结合当日仓库现状核对修订。
> 原则：**不额外制造一套 SEO 内容，让已有的优质内容更容易被发现。** 首页 SPA 的视觉与交互不动。

## 现状核对（2026-10-18，本地 main）

| 检查项 | 现状 | 处置 |
|---|---|---|
| Title / Meta Description / OG 文字 / Twitter Card | 已有 | 标题改为含产品类别的搜索友好版 |
| Canonical / og:image / JSON-LD | 缺 | P0 补齐 |
| sitemap.xml / robots.txt | 缺 | 生成 sitemap；robots.txt 因 GitHub Pages 项目子路径非标准位置，**不做**（公开页默认可爬，靠 GSC/Bing 主动提交） |
| 文档独立 URL | 无（`#docs` 面板内状态切换） | P0 核心：构建时生成静态文档页 |
| 中英文独立索引 | 客户端切换 | 静态页按 `/docs/zh|en/…` 分 URL + hreflang 配对 |
| 可索引内容存量 | docs-content/ 29 篇 × 中英，manifest.json 含标题与对应关系 | 直接复用，marked 已是依赖 |

i18n 不改写 `document.title`，静态标题对人与爬虫一致。上游文档自带「6.1.0」等版本字样属上游内容，非本仓库问题。

## 架构：两层服务同一套内容

- **交互展示层** = 现有 Vue SPA（动画、面板、双语切换），服务人类访客，基本不动。
- **静态索引层** = 构建时从 `docs-content/` 预生成的 HTML 文档页（独立 URL、元信息、无需 JS 即可读正文），服务搜索引擎与 AI。

URL 结构（GitHub Pages 项目子路径下）：

```text
/                                     首页（SPA）
/docs/zh/<section>/<slug>/            中文静态文档页
/docs/en/<section>/<slug>/            英文静态文档页（仅存在的译文）
/faq/ · /faq/en/                      GEO 问答页（中/英）
/sitemap.xml · /llms.txt              自动生成
```

slug 取 manifest 条目 `file` 去扩展名（如 `guides/deployment-docker`）。

## 改动清单

### P0 技术基础

1. **index.html head**：搜索友好标题 `Stella — 开源 QQ 群聊 AI Agent｜长期记忆与本地部署`；描述补「开源」；`rel=canonical`；`og:image`（og-cover.png）+ `og:image:width/height`；`twitter:card=summary_large_image`；JSON-LD `SoftwareApplication`（不编造评分/价格，核实 LICENSE 后附 `codeRepository`/`license`/`downloadUrl`）。
2. **public/og-cover.png**：1200×630 分享图，沿用深色 + 星芒 + 8192 tokens 视觉语言（HTML 渲染后浏览器截图生成）。
3. **scripts/generate-static-pages.mjs**（构建后执行）：
   - 读 manifest + md，marked 渲染，每篇输出 `dist/docs/<lang>/<section>/<slug>/index.html`；
   - 页面自带内联样式（深色、衬线层级沿用站点气质），**正文不依赖 JS**；页眉回首页/`#docs` 面板，页脚标来源仓库与同步时间；
   - 文内相对链接改写为对应静态页 URL（解析不到回退 GitHub）；站内互链形成可爬网；
   - 每页唯一 title/description/canonical（描述取正文首段纯文本，~150 字）；中英互为 `hreflang` alternate + `x-default→zh`；
   - 生成 `sitemap.xml`（首页 + 全部静态页，含 alternates）与 `llms.txt`（简介 + 官网/源码/关键文档链接，由 manifest 自动生成）。

### P1 内容与验证

4. **FAQ 静态页**（GEO）：内容源 `src/content/faq.json`（中英双语），回答只用可核对的事实（记忆管理/能力路由/8192 语义/部署模式），生成 `/faq/`、`/faq/en/`，进 sitemap 与 llms.txt；SPA 不加视觉入口。
5. **SPA 文档工具栏**加一枚「独立分享页」小链接（跳当篇静态页），解决面板内文档无法深链分享的旧问题，也是爬虫入口。
6. **scripts/check-seo.mjs**：校验 manifest 每篇有产物且正文非空、title/description/canonical 唯一、sitemap 与产物一一对应、hreflang 配对完整、JSON-LD 可解析、关键页正文不依赖 JS；`build = vite build && generate && check`，部署工作流自动携带。

### P2 后续（人工/另行）

- Google Search Console / Bing Webmaster Tools 提交 sitemap（需账号，人工）；
- 独立域名时再管 robots.txt；`SoftwareApplication.offers` 待核实分发条款；
- GEO 评测集（用真实提问定期检验各 AI 是否能找到并正确描述 Stella）。

## 验收

构建后 `check-seo` 全绿；本地静态服务实测：任一静态页禁 JS 可读全文、hreflang/canonical 正确、`#docs` 面板与首页无回归；og-cover.png 在分享预览中为 1200×630 深色卡片。
