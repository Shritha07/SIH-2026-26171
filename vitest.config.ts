import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'packages/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@privacy-agent/shared-types': path.resolve(__dirname, './packages/shared-types/src'),
      '@privacy-agent/action-protocol': path.resolve(__dirname, './packages/action-protocol/src'),
      '@privacy-agent/privacy-core': path.resolve(__dirname, './packages/privacy-core/src'),
    },
  },
});
