import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../extensions/directus-extension-react/public',
    assetsInlineLimit: 0,
  },
  server: {
    port: 3000,
  },
  base: '/react',
  envDir: '../../',
});