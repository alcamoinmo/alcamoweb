import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  ...eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['node_modules', '.next', 'out', 'public'],
  },
];
