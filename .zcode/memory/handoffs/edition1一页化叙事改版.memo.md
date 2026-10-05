---
summary: edition_1 一页化叙事改版(8192 首屏钩子 + 四屏)
created: 2026-10-05 21:30
updated: 2026-10-05 21:30
status: active
---

# edition_1 一页化叙事改版(8192 首屏钩子 + 四屏)

## Summary

按用户设计稿 `docs/design/edition_1.md` 把站点从"单屏不滚动 + 抽屉面板"改为"一页滚动叙事 + 抽屉面板"。首屏以巨型 8192 为视觉钩子,四屏依次:吸引(8192)→ 解释(汇聚式机制图)→ 证明(群聊实况 + 她记得。)→ 行动(部署谱系 + 一键安装),收尾整屏 foot。桌面/移动双宽度浏览器实证通过后提交推送上线。

## Done

- [2026-10-05] HeroSection 重写:`.hook-num` 巨型 8192(serif italic 金渐变,clamp 至 12.5rem)→ TOKENS → "Enough to remember you." → 中文主标题「会记得你的 AI,只需要 8192 tokens。」→ [开始使用]/[GitHub];底部滚动暗示「为什么 8192 就够?」;入场按 0.1s~2.1s 分层浮现,reduced-motion 全跳过
- [2026-10-05] FlowDiagram 重写为汇聚式:三来源(记忆/旧对话/工具)经 SVG marker 箭头汇入 184px 8192 圆环 → 回复;窄屏退化为竖排(.fd-merge 隐藏、.fd-drop 显出)
- [2026-10-05] 新增 MechanismSection(整屏 min-height:100svh:眉题 + 大图 + 「不是把所有东西塞进 Context」+ Memory/Tools/Compression 三行小注;注:设计稿中"Comes"按上下文判定为 Tools 笔误)
- [2026-10-05] 新增 MemorySection:群聊卡片(Vegetable 右对齐蓝调/Stella 左对齐金调,翻旧账气泡加金光)+ 右侧「她记得。」金渐变大字 + 长期记忆·群聊上下文·主动参与
- [2026-10-05] 新增 DeploySection:Local ←— Hybrid —→ Online 谱系(箭头指向两端,Stella 挂中心下方)+ 三句话 + [一键安装 Stella](开 quickstart 面板)+ Docker/Standalone/Advanced(开 docs 面板)
- [2026-10-05] 新增 FootSection:✦ / Stella / A small context. A long memory. / [Get Stella] / GitHub·Docs·License(License 已验证指向上游 LICENSE blob)
- [2026-10-05] style.css:解除 html,body overflow:hidden,新增 body.panel-open 滚动锁;删除全部死样式(rail/stats/marquee/cards/quote/flow/principles/deploy/stack/旧footer/badges/hero-art);保留 table(steps 文档面板 Markdown 表格依赖全局 th/td)
- [2026-10-05] index.html 标题/描述改为 8192 钩子定位,补 OG/Twitter 卡片
- [2026-10-05] 浏览器实证:桌面 1440×900 五屏截图、移动 390×844 四屏截图全部达标;面板开合/hash 直链/Esc 关闭/滚动锁/文档表格样式全过;window.__errs 恒空
- [2026-10-05] 用户反馈瑕疵①「分页应不连续」已修:根节点 CSS scroll-snap(y mandatory + stop always),五屏一屏一页,手势不足一屏也吸附整屏边界;收尾屏 96svh 补成 100svh 使末页对齐滚动终点;`main > *, footer.foot` 的 scroll-margin-top:0 需压过全局 section 的 scroll-margin(故置于文件末尾)。实测手势序列 900→1800→2700→回退 1800→末页 3600 全部精确落界
- [2026-10-05] 用户反馈瑕疵②「8192 的 2 右侧缺一小块」已修:background-clip:text 的涂色区=元素盒,斜体末笔墨迹伸出盒外即透明。给 .hook-num/.fd-num/.foot-brand 三个"斜体+渐变裁剪"元素加对称 `padding: 0 0.1em` 外扩涂色区(对称保证光学居中不变)。放大截图取证:修复前「2」右上为垂直切边,修复后钩形收笔完整
- [2026-10-05] IAB 截图二次踩坑:getBoundingClientRect().top 是视口坐标,滚动位置不对时 clip 会截到别的层;先 scrollTo 再量再截

## Decisions

- 首屏定稿取设计稿最后一节的"最大胆"方向:8192 即首屏本身,而非放一行小标题——文档明确"8192 应该成为整个网页的视觉钩子"
- 收尾屏链接区用 div 不用 nav:全局 `nav {}` 选择器是顶栏的 position:fixed 样式,元素选择器会误伤页内所有 nav 元素(本次实测踩坑,foot-links 曾被钉到页顶)
- body 滚动解锁后 computed overflow 显示 "hidden auto" 属正常(全局 overflow-x:hidden)
- 抽屉面板、hash 直链(#quickstart/#docs)、canvas 罗盘全部原样复用,未动 DetailPanel/SiteNav/QuickstartPage/DocsPage

##环境备注

- IAB 截图首帧曾出现"页脚链接钉在页顶"假象,后证实是真实 bug(nav 选择器误伤),DOM 探针 getBoundingClientRect 与截图相互印证定位
