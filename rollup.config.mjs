import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import replace from '@rollup/plugin-replace'
import terser from '@rollup/plugin-terser'

import pkg from './package.json' with { type: 'json' }

const CJS_DEV = 'CJS_DEV'
const CJS_PROD = 'CJS_PROD'
const ES = 'ES'
const UMD_DEV = 'UMD_DEV'
const UMD_PROD = 'UMD_PROD'

const input = './compiled/index.js'

const getExternal = (bundleType) => {
  const peerDependencies = Object.keys(pkg.peerDependencies)
  const dependencies = Object.keys(pkg.dependencies)

  // Hat-tip: https://github.com/rollup/rollup-plugin-babel/issues/148#issuecomment-399696316.
  const makeExternalPredicate = (externals) => {
    if (externals.length === 0) {
      return () => false
    }
    const pattern = new RegExp(`^(${externals.join('|')})($|/)`)
    return (id) => pattern.test(id)
  }

  switch (bundleType) {
    case CJS_DEV:
    case CJS_PROD:
    case ES:
      return makeExternalPredicate([...peerDependencies, ...dependencies])
    case UMD_DEV:
      return makeExternalPredicate([...peerDependencies, 'prop-types'])
    default:
      return makeExternalPredicate(peerDependencies)
  }
}

const isProduction = (bundleType) =>
  bundleType === CJS_PROD || bundleType === UMD_PROD

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
    case UMD_PROD:
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
        keep_infinity: true,
        pure_getters: true,
      },
      ecma: 5,
      output: { comments: false },
      toplevel: false,
      warnings: true,
    }),
]

const getCjsConfig = (bundleType) => ({
  external: getExternal(bundleType),
  input,
  output: {
    file: `dist/react-svg.cjs.${
      isProduction(bundleType) ? 'production' : 'development'
    }.js`,
    format: 'cjs',
    sourcemap: true,
  },
  plugins: getPlugins(bundleType),
})

const getEsConfig = () => ({
  external: getExternal(ES),
  input,
  output: {
    file: pkg.module,
    format: 'es',
    sourcemap: true,
  },
  plugins: getPlugins(ES),
})

const getUmdConfig = (bundleType) => ({
  external: getExternal(bundleType),
  input,
  output: {
    file: `dist/react-svg.umd.${
      isProduction(bundleType) ? 'production' : 'development'
    }.js`,
    format: 'umd',
    globals: {
      ...(isProduction(bundleType) ? {} : { 'prop-types': 'PropTypes' }),
      react: 'React',
    },
    name: 'ReactSVG',
    sourcemap: true,
  },
  plugins: getPlugins(bundleType),
})

export default [
  getCjsConfig(CJS_DEV),
  getCjsConfig(CJS_PROD),
  getEsConfig(),
  getUmdConfig(UMD_DEV),
  getUmdConfig(UMD_PROD),
]
