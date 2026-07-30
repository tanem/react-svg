import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

import pkg from './package.json' with { type: 'json' }

const CJS_DEV = 'CJS_DEV'
const CJS_PROD = 'CJS_PROD'
const ES = 'ES'

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

const isProduction = (bundleType) => bundleType === CJS_PROD

const getBabelConfig = (bundleType) => {
  const options = {
    babelHelpers: 'runtime',
    babelrc: false,
    exclude: 'node_modules/**',
    inputSourceMap: true,
    plugins: ['@babel/transform-runtime'],
    presets: [['@babel/env', { loose: true, modules: false }], '@babel/react'],
  }

  switch (bundleType) {
    case ES:
      return {
        ...options,
        plugins: [
          ...options.plugins,
          ['transform-react-remove-prop-types', { mode: 'wrap' }],
        ],
      }
    case CJS_PROD:
      return {
        ...options,
        plugins: [
          ...options.plugins,
          ['transform-react-remove-prop-types', { removeImport: true }],
        ],
      }
    default:
      return options
  }
}

const getPlugins = (bundleType) => [
  nodeResolve(),
  commonjs({
    include: 'node_modules/**',
  }),
  babel(getBabelConfig(bundleType)),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(
      isProduction(bundleType) ? 'production' : 'development',
    ),
  }),
  isProduction(bundleType) &&
    terser({
      compress: {
        // Terser treats `'use client'` as a non-standard directive and drops
        // it by default, which would strip the banner from the minified
        // bundles.
        directives: false,
        keep_infinity: true,
        pure_getters: true,
      },
      ecma: 5,
      output: { comments: false },
      toplevel: false,
    }),
]

const getCjsConfig = (bundleType) => ({
  external,
  input,
  output: {
    banner,
    file: `dist/react-svg.cjs.${
      isProduction(bundleType) ? 'production' : 'development'
    }.js`,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: getPlugins(bundleType),
})

const getEsConfig = () => ({
  external,
  input,
  output: {
    banner,
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  },
  plugins: getPlugins(ES),
})

export default [getCjsConfig(CJS_DEV), getCjsConfig(CJS_PROD), getEsConfig()]
