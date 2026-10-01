"""本地预览服务器:服务 npm run build 产出的 dist/。

用法:  python serve.py [端口]     (默认 8645,先 `npm run build`)

为了和 GitHub Pages 完全一致,页面以项目子路径访问:
    http://127.0.0.1:8645/Stella_project-homepage/

开发热更新请用 `npm run dev`(Vite dev server)。
"""
import http.server
import os
import sys
import webbrowser
from http.server import ThreadingHTTPServer

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8645
BASE = "/Stella_project-homepage"
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "dist")


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def translate_path(self, path):
        # 去掉项目子路径前缀,映射到 dist 内
        if path.startswith(BASE):
            path = path[len(BASE):] or "/"
        return super().translate_path(path)

    def end_headers(self):
        # 修改后刷新即生效,避免浏览器缓存旧页面
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


def main():
    server = ThreadingHTTPServer(("127.0.0.1", PORT), Handler)
    url = f"http://127.0.0.1:{PORT}{BASE}/"
    print(f"Serving {ROOT} at {url}  (Ctrl+C to stop)")
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nBye.")


if __name__ == "__main__":
    main()
