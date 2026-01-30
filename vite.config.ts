import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
            '@/components': resolve(__dirname, './src/components'),
            '@/hooks': resolve(__dirname, './src/hooks'),
            '@/store': resolve(__dirname, './src/store'),
            '@/services': resolve(__dirname, './src/services'),
            '@/utils': resolve(__dirname, './src/utils'),
            '@/types': resolve(__dirname, './src/types'),
            '@/constants': resolve(__dirname, './src/constants'),
            '@/styles': resolve(__dirname, './src/styles'),
            '@/pages': resolve(__dirname, './src/pages'),
        },
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `@use "@/styles/variables.scss" as *;`,
            },
        },
    },
    server: {
        port: 5173,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
        rollupOptions: {
            output: {
                manualChunks: {
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'state-vendor': ['zustand'],
                },
            },
        },
    },
});
