import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import './topnav.css'
import './docs.css'
import reveal from './directives/reveal'
import ripple from './directives/ripple'

/* 错误钩子:诊断用 */
window.__errs = []
window.addEventListener('error', function (e) { window.__errs.push(e.message + ' @' + e.lineno) })

createApp(App)
  .directive('reveal', reveal)
  .directive('ripple', ripple)
  .mount('#app')
