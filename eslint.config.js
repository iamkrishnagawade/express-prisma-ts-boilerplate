import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // 1. Core ESLint recommended rules
  eslint.configs.recommended,
  
  // 2. TypeScript specific recommended rules
  ...tseslint.configs.recommended,
  
  // 3. Prettier override (turns off formatting rules that conflict with Prettier)
  eslintConfigPrettier,
  
  // 4. Custom overrides and project-specific settings
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-console': 'warn', // Warns if console.log is left behind (Winston should be used)
      '@typescript-eslint/no-explicit-any': 'warn', // Discourages the use of 'any'
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }], // Allows unused vars prefixed with _ (e.g., next)
      'prefer-const': 'error',
    },
  },
  
  // 5. Global ignore paths (replaces legacy .eslintignore)
  {
    ignores: ['dist/**', 'node_modules/**', 'generated/**', 'logs/**'],
  }
);