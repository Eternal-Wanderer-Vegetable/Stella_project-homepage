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
- `src/`——Vue 3 源码:`App.vue`(面板状态中枢)、`components/`(SiteNav / HeroSection / RailNav / DetailPanel)、`components/pages/`(8 个互斥页组件)、`composables/useHeroCanvas.js`(画布动画,自原单文件页原样迁移)、`directives/`(v-reveal 滚动渐显、v-ripple 涟漪)、`style.css`(原版 CSS 逐行保留)、`assets/title-image.jpg`
- `vite.config.js`——`base: '/Stella_project-homepage/'` 适配 GitHub Pages 项目站点
- `.github/workflows/deploy.yml`——构建并发布 dist/ 到 GitHub Pages
- `serve.py`——本地预览 dist/(以 GitHub Pages 同款子路径访问,端口 8645)
- `.zcode/memory/`——meow-handoff 记忆库
- 上游项目 `Stella_project` 未在本地,内容以 GitHub README 为准

## 进行中

- [2026-10-01] Vue 3 + Vite 改写 | 已上线(2e14cac)| Pages 构建源已切 GitHub Actions,推送 main 自动部署;线上已验证画布修复(ResizeObserver 补测)
