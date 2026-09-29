---
summary: 踩坑记录:现象、根因与规避方式
created: 2026-09-29 20:35
updated: 2026-09-29 20:37
status: active
---

# 教训

<!-- 踩过的坑:现象 → 根因 → 修复/规避方式。未经验证的猜测不写。格式: -->

- [2026-09-29] **画布整层消失、罗盘不渲染**:render 循环调用已被删除的 `crossBeam`(编辑中被贴图系统取代但调用点漏改)→ ReferenceError 杀死循环;规避:重命名/删除函数时全文件 grep 调用点;运行时用 `window.__errs` 错误钩子(脚本首行)定位
- [2026-09-29] **罗盘画好后每帧被擦掉**:标题图渐进加载引发滚动条抖动 → window resize 反复触发 → `canvas.width` 赋值即清空画布;规避:resize 守卫仅在宽高真变时赋值 + img 显式 width/height 防布局抖动
- [2026-09-29] **内嵌浏览器画布动画不跑**:IAB `document.hidden` 恒 true,循环用其做暂停条件刚启动即退出;规避:改用 IntersectionObserver 几何判断;浏览器自动化诊断时画布像素采样比截图更可靠
- [2026-09-29] **Edit 后浏览器出现假错(如函数未定义)**:编辑写入中途浏览器 reload 读到残缺文件;规避:报错先带时间戳参数强制重载再下结论,勿凭旧截图或缓存状态断言
- [2026-09-29] **python 命令退出码 49**:`python`/`python3` 是 Windows Store 占位程序,本机无 Node/deno/bun;规避:本地静态服务用 PowerShell TcpListener 脚本(.serve.ps1)
- [2026-09-29] **PowerShell 预览服务器冻死**:单线程 TcpListener 的 ReadLine 被未完整请求的连接阻塞;规避:`taskkill //F //PID <pid>` 强杀重启,或改用多线程/异步方案
- [2026-09-29] **上下文压缩后凭记忆改文件失配**:Edit 的 old_string 与文件真实内容不一致("String to replace not found");规避:先 sed/grep 读真实内容再编辑,不凭压缩前的记忆
