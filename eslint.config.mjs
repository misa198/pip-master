import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    env: {
      node: true,
      browser: true,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
