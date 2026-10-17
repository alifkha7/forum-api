import { defineConfig, configDefaults } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['dotenv/config'],
    testTimeout: 15000,
    coverage: {
      exclude: [
        ...configDefaults.coverage.exclude,
        'src/Commons/config.js',
      ],
    },
  },
});