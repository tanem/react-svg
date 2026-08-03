import eslint from '@eslint/js'
import eslintReact from '@eslint-react/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: [
      '**/build/',
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
      // Git-excluded scratch area, outside every tsconfig and this project's
      // globals. Absent for anyone else.
      'roadmap/',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  eslintReact.configs['recommended-typescript'],
  {
    plugins: {
      perfectionist,
      'react-hooks': reactHooks,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      ...reactHooks.configs['recommended-latest'].rules,
      // eslint-plugin-react-hooks (above) is the source of truth for hooks
      // rules, since it's backed by the React team's compiler. Disable the
      // overlapping rules from @eslint-react/eslint-plugin's recommended
      // config to avoid duplicate reports.
      '@eslint-react/exhaustive-deps': 'off',
      '@eslint-react/rules-of-hooks': 'off',
      'perfectionist/sort-jsx-props': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': 'error',
      'sort-imports': 'off',
      'sort-keys': 'error',
    },
  },
  {
    files: ['**/*.js', '**/*.cjs'],

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
  {
    // The hand-run screen-reader harness. Neither file is part of the build or
    // the suite: one is a node server that reports on stdout, the other runs in
    // the browser. `sort-keys` is off because app.mjs's step table is in the
    // order the steps are run in, which is the order it has to be read in.
    files: ['test/manual/*.mjs'],

    rules: {
      'no-console': 'off',
      'sort-keys': 'off',
    },
  },
  {
    files: ['test/manual/app.mjs'],

    languageOptions: {
      globals: globals.browser,
    },
  },
  {
    files: ['test/manual/server.mjs'],

    languageOptions: {
      globals: globals.node,
    },
  },
  eslintConfigPrettier,
)
