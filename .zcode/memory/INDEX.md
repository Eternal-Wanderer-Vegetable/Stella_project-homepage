---
summary: 记忆库索引,活跃任务与最近快照指针
created: 2026-09-29 20:35
updated: 2026-09-29 20:37
status: active
---

# 记忆索引

> 本文件是记忆库唯一入口,≤80 行。只放指针与状态,细节在分层文件与快照里。

## 活跃任务

- [2026-09-29] 罗盘玫瑰主页动效与渲染修复 | 已完成 | handoffs/罗盘玫瑰主页与画布渲染修复.memo.md
- [2026-10-01] Vue 3 + Vite 改写并上线 | 已完成 | https://eternal-wanderer-vegetable.github.io/Stella_project-homepage/
- [2026-10-01] 文档页(docs 展示)上线 | 已完成 | 39 篇上游文档快照展示,rail「文档」直达
- [2026-10-05] edition_1 一页化叙事改版 | 已完成 | handoffs/edition1一页化叙事改版.memo.md;8192 首屏钩子 + 四屏滚动叙事,设计稿 docs/design/edition_1.md
- [2026-10-18] 文档页分节改版 + 递归同步 | 已完成 | sync-docs 递归拉上游子目录正文(4 节 29 篇+EN;examples/agent 档案不入站),侧栏=分节索引+篇内标题 TOC,右栏=完整正文
- [2026-10-18] 全站中/英 i18n | 已完成 | src/i18n.js:首次访问按 navigator.languages 检测(任何 zh→简体,其他→英文),手动切换存 localStorage;顶栏中/EN 切换器;文档内容语言跟随全站
- [2026-10-18] 第三屏换真实聊天记录 | 已完成 | memory-chat.json 换 42 条脱敏实录(中/英,Alice→Vegetable);MemorySection 改定高滚动聊天窗,左右两栏同时入场,不自动跟随,底部「向下滚动查看完整对话」提示滚动即收;节奏自适应总时长封顶 ~7s;recall 高亮在首条「又熬夜」
- [2026-10-18] 整页翻页放行内部滚动区 | 已完成 | usePageGlide:滚轮/焦点落在可滚动子区域(聊天窗)且该方向还能滚时不翻页,滚到边界交还翻页;overscroll-behavior contain 仅 pointer:fine,触屏保留自然链式
- [2026-10-18] 聊天记录双注释 | 已完成 | 聊天窗下两行小字(i18n mem.noteTag/note1/note2,网格标签列对齐,空标签占位):①真实群聊记录已脱敏 ②在 qwen3.8-flash-next-iq2_xs 模型下生成、不保证其他模型同效;卡片入场 0.55s 后淡入

## 下一步

- 已知环境项:内嵌浏览器截图会出陈旧帧(顶栏/正文层不同步),以 DOM 探针为准(探针须打叶子元素,隐藏组与动画组要一一对应);真实浏览器无此问题
- 可选:Actions 定时自动 sync-docs;docs 页 h2 TOC 与 mermaid 渲染
- 可选:OG 卡片配图(og:image)目前只有文字卡;深链分享可再美化

## 最近快照

- [2026-09-29 20:35] handoffs/罗盘玫瑰主页与画布渲染修复.memo.md — active
