import babel from '@rollup/plugin-babel'

import pkg from './package.json' with { type: 'json' }

const input = './compiled/index.js'

// Rollup strips file-level directives while bundling, so `"use client"` has to
// be re-added to the output.
const banner = `'use client';`

// Hat-tip: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316.
const external = (() => {
  const externals = [
    ...Object.keys(pkg.peerDependencies),
    ...Object.keys(pkg.dependencies),
  ]
  const pattern = new RegExp(`^(${externals.join('|')})($|/)`)
  return (id) => pattern.test(id)
})()

// A factory rather than a shared array, so each config gets its own plugin
// instances and no build state is carried between them.
const getPlugins = () => [
  babel({
    babelHelpers: 'runtime',
    babelrc: false,
    exclude: 'node_modules/**',
    inputSourceMap: true,
    plugins: ['@babel/transform-runtime'],
    presets: [['@babel/env', { loose: true, modules: false }], '@babel/react'],
  }),
]

export default [
  {
    external,
    input,
    output: {
      banner,
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: getPlugins(),
  },
  {
    external,
    input,
    output: {
      banner,
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
    plugins: getPlugins(),
  },
]
