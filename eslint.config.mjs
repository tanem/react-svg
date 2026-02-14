import eslint from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/build/',
      '**/compiled/',
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  react.configs.flat.recommended,
  {
    plugins: {
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      'react/jsx-sort-props': 'error',
      'react/react-in-jsx-scope': 'off',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'sort-keys': 'error',
    },

    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.js'],

    languageOptions: {
      globals: globals.node,
    },

    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  {
    files: ['examples/**/src/**/*.js'],

    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['**/node.spec.ts'],

    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  eslintConfigPrettier,
)
