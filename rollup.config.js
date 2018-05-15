import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import ignore from 'rollup-plugin-ignore'
import nodeResolve from 'rollup-plugin-node-resolve'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import replace from 'rollup-plugin-replace'
import uglify from 'rollup-plugin-uglify'

const libConfig = {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      format: 'cjs'
    },
    {
      file: 'lib/index.es.js',
      format: 'es'
    }
  ],
  plugins: [
    peerDepsExternal(),
    commonjs({ exclude: 'src/**' }),
    nodeResolve(),
    babel()
  ]
}

const devConfig = {
  input: 'src/index.js',
  output: {
    file: 'dist/ReactSVG.js',
    format: 'umd',
    name: 'ReactSVG',
    globals: {
      'prop-types': 'PropTypes',
      'react-dom/server': 'ReactDOMServer',
      react: 'React'
    }
  },
  plugins: [
    peerDepsExternal(),
    commonjs({ exclude: 'src/**' }),
    nodeResolve(),
    babel(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ]
}

const prodConfig = {
  input: 'src/index.js',
  output: {
    file: 'dist/ReactSVG.min.js',
    format: 'umd',
    name: 'ReactSVG',
    globals: {
      'prop-types': 'PropTypes',
      'react-dom/server': 'ReactDOMServer',
      react: 'React'
    }
  },
  plugins: [
    peerDepsExternal(),
    ignore(['prop-types']),
    commonjs({ exclude: 'src/**' }),
    nodeResolve(),
    babel({ plugins: ['transform-react-remove-prop-types'] }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    uglify()
  ]
}

export default [libConfig, devConfig, prodConfig]
