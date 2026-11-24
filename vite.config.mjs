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
  server: {
    port: 3000,
    host: true
  }
});
