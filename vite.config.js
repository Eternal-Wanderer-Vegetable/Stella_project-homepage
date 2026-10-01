import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages 项目站点部署在 /Stella_project-homepage/ 子路径下
export default defineConfig({
  base: '/Stella_project-homepage/',
  plugins: [vue()],
})
