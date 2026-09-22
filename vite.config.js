import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(process.cwd(), 'index.html'),
        about: resolve(process.cwd(), 'about/index.html'),
      },
    },
  },
});
