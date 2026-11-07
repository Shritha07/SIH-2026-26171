import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                popup: path.resolve(__dirname, 'popup.html'),
                background: path.resolve(__dirname, 'src/background/service-worker.ts'),
                content: path.resolve(__dirname, 'src/content/content-script.ts'),
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    if (chunkInfo.name === 'background' || chunkInfo.name === 'content') {
                        return '[name].js';
                    }
                    return 'assets/[name]-[hash].js';
                },
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]',
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@privacy-agent/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
            '@privacy-agent/action-protocol': path.resolve(__dirname, '../../packages/action-protocol/src'),
            '@privacy-agent/privacy-core': path.resolve(__dirname, '../../packages/privacy-core/src'),
        },
    },
});
//# sourceMappingURL=vite.config.js.map