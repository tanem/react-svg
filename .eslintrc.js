const path = require('path')

module.exports = {
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.js', 'node.spec.ts'],
      rules: {
        '@typescript-eslint/no-require-imports': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    project: path.join(__dirname, 'tsconfig.eslint.json'),
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'simple-import-sort'],
  root: true,
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react/jsx-sort-props': 'error',
    'react/jsx-uses-react': 'off',
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
}
