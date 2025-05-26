import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/**', 'dist/**', './src/config/**', '**/*.test.ts', '**/*.spec.ts', '**/*.config.ts', '**/*.config.mjs', '**/*.formatter.ts', './src/server.ts'],
        }
    }
});
