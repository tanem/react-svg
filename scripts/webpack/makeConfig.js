import path from 'path'
import webpack from 'webpack'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'

export default function makeWebpackConfig(buildType) {
  const baseConfig = {
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react'
      },
      'react-dom/server': {
        root: 'ReactDOMServer',
        commonjs: 'react-dom/server',
        commonjs2: 'react-dom/server',
        amd: 'react-dom/server'
      }
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    }
  }

  if (buildType === 'examples') {
    return Object.assign(baseConfig, {
      mode: 'none',
      entry: {
        basic: './examples/basic',
        'issue-49/fill': './examples/issue-49/fill',
        'issue-49/swap': './examples/issue-49/swap',
        'issue-68': './examples/issue-68'
      },
      externals: {},
      output: {
        filename: '[name]/bundle.js'
      }
    })
  }

  if (buildType === 'umd') {
    return Object.assign(baseConfig, {
      mode: 'none',
      entry: './src/index.js',
      output: {
        filename: 'ReactSVG.js',
        library: 'ReactSVG',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../../dist')
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('development')
          }
        })
      ]
    })
  }

  if (buildType === 'umd:min') {
    return Object.assign(baseConfig, {
      mode: 'none',
      entry: './src/index.js',
      output: {
        filename: 'ReactSVG.min.js',
        library: 'ReactSVG',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../../dist')
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: JSON.stringify('production')
          }
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true
        }),
        new UglifyJsPlugin()
      ]
    })
  }
}
