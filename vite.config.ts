import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'patch-sec-fetch-dest',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          const url = req.url ?? ''
          const isModule =
            /\.[mc]?[jt]sx?(\?|$)/.test(url) || url.includes('/@vite/') || url.includes('/@fs/')
          if (isModule && !req.headers['sec-fetch-dest']) {
            req.headers['sec-fetch-dest'] = 'script'
          }
          next()
        })
      },
    },
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  base: '/',
  build: {
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    cssTarget: 'chrome87',
  },
  server: {
    port: 3000,
    host: true,
    open: true,
    cors: true,
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
