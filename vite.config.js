import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    Icons({autoInstall: true, compiler: 'jsx', jsx: 'react' }),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173, 
  },
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/styles'),
      '@lang': path.resolve(__dirname, 'src/locales')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('.png'))
            return null;
          if (id.includes('iconify'))
            return 'iconify'
          if (id.includes('react') && id.includes('node_modules'))
            return 'react'
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return null;
        }
      }
    }
  }
})
