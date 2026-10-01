// 点击涟漪:挂到 .btn / .gh-btn / .copy-btn 上(与原版逻辑一致)
export default {
  mounted(el) {
    el.addEventListener('click', function (e) {
      var rect = el.getBoundingClientRect()
      var d = Math.max(rect.width, rect.height) * 1.1
      var s = document.createElement('span')
      s.className = 'ripple'
      s.style.width = s.style.height = d + 'px'
      s.style.left = (e.clientX - rect.left - d / 2) + 'px'
      s.style.top = (e.clientY - rect.top - d / 2) + 'px'
      el.appendChild(s)
      setTimeout(function () { s.remove() }, 700)
    })
  },
}
