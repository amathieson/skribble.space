import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import Icons from 'unplugin-icons/vite'
import {webfontDownload} from "vite-plugin-webfont-dl";
import { VitePWA } from 'vite-plugin-pwa'
import manifest from './manifest.json'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
    Icons({autoInstall: true, compiler: 'jsx', jsx: 'react' }),
    webfontDownload(),
    VitePWA({ registerType: 'autoUpdate',devOptions: {
        enabled: true
      }, manifest})
  ],
  server: {
    host: '0.0.0.0',
    port: 5173, 
  },
  resolve: {
    alias: {
      '@scss': path.resolve(__dirname, 'src/styles'),
      '@lang': path.resolve(__dirname, 'src/locales'),
      '@ctx': path.resolve(__dirname, 'src/components/contexts'),
      '@nav': path.resolve(__dirname, 'src/components/navigation'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@util': path.resolve(__dirname, 'src/components/utilities')
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
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/styles/mixins/_variables.scss";
          @use "/src/styles/mixins/_colours.scss";
        `
      }
    }
  },

})
