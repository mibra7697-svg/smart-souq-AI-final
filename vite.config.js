import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Helper to generate proxy configs
const createProxy = (target, rewritePath = null, extraHeaders = {}) => ({
  target,
  changeOrigin: true,
  secure: true,
  rewrite: rewritePath
    ? (p) => p.replace(rewritePath.from, rewritePath.to)
    : undefined,
  configure: (proxy) => {
    proxy.on('proxyRes', (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] =
        'Content-Type, Authorization, X-Requested-With, TRON-PRO-API-KEY';

      Object.entries(extraHeaders).forEach(([key, value]) => {
        proxyRes.headers[key] = value;
      });
    });

    proxy.on('error', (err, _req, res) => {
      console.error('Proxy error:', err);
      res.writeHead(500, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      });
      res.end(JSON.stringify({ error: 'Proxy error' }));
    });
  },
});

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],

  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@context': path.resolve(__dirname, './src/contexts'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@constants': path.resolve(__dirname, './src/constants'),
    },
  },

  server: {
    port: 5173, // ← تغيير المنفذ لتجنب التعارض
    open: true,
    host: true,

    proxy: {
      '/api/binance': createProxy(
        'https://api.binance.com',
        { from: /^\/api\/binance/, to: '/api/v3' }
      ),

      '/api/coingecko': createProxy(
        'https://api.coingecko.com',
        { from: /^\/api\/coingecko/, to: '/api/v3' }
      ),

      '/api/ipapi': createProxy(
        'https://ipapi.co',
        { from: /^\/api\/ipapi/, to: '' }
      ),

      '/api/gemini': createProxy(
        'https://generativelanguage.googleapis.com',
        { from: /^\/api\/gemini/, to: '/v1beta' },
        { 'Access-Control-Allow-Credentials': 'true' }
      ),

      '/api/alphavantage': createProxy(
        'https://www.alphavantage.co',
        { from: /^\/api\/alphavantage/, to: '' }
      ),

      '/api/trongrid': createProxy(
        'https://api.trongrid.io',
        { from: /^\/api\/trongrid/, to: '' }
      ),

      // Local backend (must be on a different port)
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,

    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['react-icons', 'framer-motion'],
        },
      },
    },
  },

  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&display=swap');
        `,
      },
    },
  },
});