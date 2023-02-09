import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../dist/public',
    assetsInlineLimit: 0,
  },
  server: {
    port: 3000,
  },
  base: '/react',
  root: './src',
  envDir: '../../',
});
