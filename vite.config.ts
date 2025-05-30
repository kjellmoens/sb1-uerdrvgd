import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './',
  envPrefix: 'VITE_',
  plugins: [
    react(),
    nodePolyfills({
      // Whether to polyfill specific globals.
      globals: {
        process: true
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});