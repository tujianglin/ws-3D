import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
export default defineConfig({
  base: './',
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: [
      {
        find: /\/@\//,
        replacement: pathResolve('src') + '/',
      },
      {
        find: /\/#\//,
        replacement: pathResolve('types') + '/',
      },
    ],
  },
  server: {
    port: 3400,
    host: true,
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
      sass: {},
    },
  },
})
