---
summary: Stella 主页:罗盘玫瑰动效单文件页
created: 2026-09-29 20:35
updated: 2026-09-29 20:37
status: active
---

# 项目状态

## 目标

为 Stella(QQ 群聊 AI 代理)项目做一个 GitHub Pages 单页主页:深色金星光主题、罗盘玫瑰主视觉、动效丰富、单文件零依赖。上游项目仓库为 `Eternal-Wanderer-Vegetable/Stella_project`(AGPL v3.0)。

## 结构

- `index.html`——主页本体(内联 CSS/JS,~1440 行):hero 画布(罗盘玫瑰+方位光+S 碎星带+流星+星尘)、理念/特性/记忆系统/部署/快速开始/技术栈六节、页脚
- `.serve.ps1`——本地预览服务器(PowerShell TcpListener,端口 8645)
- `.zcode/memory/`——meow-handoff 记忆库
- 上游项目 `Stella_project` 未在本地,内容以 GitHub README 为准

## 进行中

- [2026-09-29] 罗盘玫瑰主视觉与全部动效 | 已完成并推送(eee8311) | 待浏览器硬刷新终验与 GitHub Pages 启用
