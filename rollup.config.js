import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import filesize from 'rollup-plugin-filesize'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import sourcemaps from 'rollup-plugin-sourcemaps'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const CJS_DEV = 'CJS_DEV'
const CJS_PROD = 'CJS_PROD'
const ES = 'ES'
const UMD_DEV = 'UMD_DEV'
const UMD_PROD = 'UMD_PROD'

const input = './src/index.tsx'

const getExternal = bundleType => {
  const modules = ['react', 'react-dom/server']

  switch (bundleType) {
    case CJS_DEV:
    case CJS_PROD:
    case ES:
      return [...modules, '@tanem/svg-injector', 'prop-types']
    case UMD_DEV:
      return [...modules, 'prop-types']
    default:
      return modules
  }
}

const isProduction = bundleType =>
  bundleType === CJS_PROD || bundleType === UMD_PROD

const getBabelConfig = bundleType => {
  const options = {
    babelrc: false,
    exclude: 'node_modules/**',
    presets: [
      ['@babel/env', { loose: true, modules: false }],
      '@babel/react',
      '@babel/typescript'
    ],
    plugins: [['@babel/proposal-class-properties', { loose: true }]]
  }

  switch (bundleType) {
    case ES:
      return {
        ...options,
        plugins: [
          ...options.plugins,
          ['transform-react-remove-prop-types', { mode: 'wrap' }]
        ]
      }
    case UMD_PROD:
    case CJS_PROD:
      return {
        ...options,
        plugins: [
          ...options.plugins,
          ['transform-react-remove-prop-types', { removeImport: true }]
        ]
      }
    default:
      return options
  }
}

const getPlugins = bundleType => [
  nodeResolve(),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'node_modules/prop-types/index.js': [
        'bool',
        'func',
        'object',
        'oneOf',
        'string'
      ]
    }
  }),
  babel(getBabelConfig(bundleType)),
  replace({
    'process.env.NODE_ENV': JSON.stringify(
      isProduction(bundleType) ? 'production' : 'development'
    )
  }),
  sourcemaps(),
  ...(isProduction(bundleType) ? [filesize(), uglify()] : [])
]

const buildCjs = bundleType => ({
  input,
  external: getExternal(bundleType),
  output: {
    file: `cjs/react-svg.${
      isProduction(bundleType) ? 'production.min' : 'development'
    }.js`,
    format: 'cjs',
    sourcemap: true
  },
  plugins: getPlugins(bundleType)
})

const buildEs = () => ({
  input,
  external: getExternal(ES),
  output: {
    file: pkg.module,
    format: 'es',
    sourcemap: true
  },
  plugins: getPlugins(ES)
})

const buildUmd = bundleType => ({
  input,
  external: getExternal(bundleType),
  output: {
    file: `umd/react-svg.${
      isProduction(bundleType) ? 'production.min' : 'development'
    }.js`,
    format: 'umd',
    globals: {
      ...(isProduction(bundleType) ? {} : { 'prop-types': 'PropTypes' }),
      'react-dom/server': 'ReactDOMServer',
      react: 'React'
    },
    name: 'ReactSVG',
    sourcemap: true
  },
  plugins: getPlugins(bundleType)
})

export default [
  buildCjs(CJS_DEV),
  buildCjs(CJS_PROD),
  buildEs(),
  buildUmd(UMD_DEV),
  buildUmd(UMD_PROD)
]
