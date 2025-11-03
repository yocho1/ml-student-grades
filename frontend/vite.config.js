// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    port: 5173,
    proxy: {
      // Proxy all /api requests to Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error:', err)
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(
              '📤 Proxying request:',
              req.method,
              req.url,
              '→',
              options.target + req.url
            )
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('📥 Proxy response:', proxyRes.statusCode, req.url)
          })
        },
      },
    },
  },
})
