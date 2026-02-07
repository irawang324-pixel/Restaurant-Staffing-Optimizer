
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  // 將環境變數注入到前端程式碼中
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY || '')
  }
});
