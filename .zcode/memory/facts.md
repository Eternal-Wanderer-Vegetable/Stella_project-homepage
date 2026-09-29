---
summary: 环境约束、关键路径与可复用命令
created: 2026-09-29 20:35
updated: 2026-09-29 20:37
status: active
---

# 事实

<!-- 原子事实:环境约束、关键路径、可复用命令、版本号。一条一事,带日期前缀。 -->

## 环境

- [2026-09-29] Windows 11 + Git Bash;`python`/`python3` 是 Windows Store 占位程序(退出码 49),本机无 Node/deno/bun,有 .NET 9 SDK;写脚本用 PowerShell
- [2026-09-29] 内嵌浏览器(IAB)`document.hidden` 恒 true;`devicePixelRatio` 非 1(画布采样需按 dpr 换算坐标)

## 路径与位置

- [2026-09-29] 主页仓库:`F:\SMBD\Stella_project-homepage`(remote: Eternal-Wanderer-Vegetable/Stella_project-homepage,分支 main);上游项目仅 GitHub 远端
- [2026-09-29] 记忆库:`F:\SMBD\Stella_project-homepage\.zcode\memory\`;预览服务器脚本:`.serve.ps1`(仓库根)

## 命令与操作

- [2026-09-29] 本地预览:`powershell -NoProfile -ExecutionPolicy Bypass -File .serve.ps1`(后台)→ http://127.0.0.1:8645/ ;卡死时 `taskkill //F //PID <pid>` 后重启(单线程 TcpListener 会因未完整请求冻死)
- [2026-09-29] 缓存穿透验证:URL 加 `?v=Date.now()`,防止浏览器缓存中间状态的页面
- [2026-09-29] 仓库 git 身份已配置(仓库级):user.name=Vegetable,user.email=3089665724@qq.com
