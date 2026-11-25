import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function copyStaticDirs() {
  return {
    name: 'copy-static-dirs',
    closeBundle() {
      const dirs = ['jpg', 'Certificates'];
      for (const dir of dirs) {
        const src = path.resolve(import.meta.dirname, dir);
        const dest = path.resolve(import.meta.dirname, 'dist', dir);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true });
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyStaticDirs()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/motion') || id.includes('node_modules/framer-motion')) {
            return 'vendor-motion';
          }
          if (id.includes('node_modules/react-icons') || id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    host: true
  }
});
