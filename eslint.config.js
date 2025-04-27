// ESLint configuration for Node.js (Express) API project
import js from '@eslint/js';

/** @type {import('eslint').Linter.Config} */
export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    env: {
      node: true,
      es2022: true,
    },
    rules: {
      // Add or override rules here
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
