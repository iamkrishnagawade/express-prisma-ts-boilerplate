import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Allows using describe, test, expect without importing them
    environment: 'node', // Outlines the target runtime execution context
    include: ['src/**/*.test.ts'], // Looks for test files matching this pattern
    // setupFiles: ['./src/tests/setup.ts'], // Optional: For setting up test DB triggers
  },
});
