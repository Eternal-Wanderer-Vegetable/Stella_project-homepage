---
summary: Stella 主页:罗盘玫瑰动效 Vue 单页
created: 2026-09-29 20:35
updated: 2026-10-01 12:00
status: active
---

# 项目状态

## 目标

为 Stella(QQ 群聊 AI 代理)项目做一个 GitHub Pages 单页主页:深色金星光主题、罗盘玫瑰主视觉、动效丰富。已从单文件页改写为 Vue 3 + Vite 工程(视觉与交互保持原样),上游项目仓库为 `Eternal-Wanderer-Vegetable/Stella_project`(AGPL v3.0)。

## 结构

- `index.html`——Vite 入口(meta/标题/favicon + `#app` 挂载点)
- `src/`——Vue 3 源码:`App.vue`(面板状态中枢)、`components/`(SiteNav 含顶栏页签 / HeroSection / DetailPanel)、`components/pages/`(仅 QuickstartPage + DocsPage,其余 7 页已删)、`composables/useHeroCanvas.js`(画布动画)、`directives/`(v-reveal、v-ripple)、`style.css`(原版 CSS 逐行保留)、`topnav.css`(顶栏页签)、`docs.css`(文档页专用,勿改 style.css)、`assets/title-image.jpg`
- `scripts/sync-docs.mjs` + `docs-content/`——从上游 Stella_project 同步 docs 快照与 manifest;`npm run sync-docs` 刷新
- `vite.config.js`——`base: '/Stella_project-homepage/'`;`.github/workflows/deploy.yml`——Actions 发布
- `serve.py`——本地预览 dist/(子路径访问,端口 8645);上游项目 `Stella_project` 未在本地

## 进行中

- [2026-10-01] 首屏图形化改版上线(1381354)| 左右两栏:左项目名+右机制汇聚图(FlowDiagram),BudgetRing 降级至快速开始页 | 已验证线上
