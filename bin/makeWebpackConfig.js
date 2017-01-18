import path from 'path'
import webpack from 'webpack'

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
      loaders: [
        {
          test: /\.js$/,
          loader: 'babel',
          exclude: /node_modules/
        }
      ]
    }
  }

  if (buildType === 'example') {
    return Object.assign(baseConfig, {
      entry: './example/index.js',
      externals: {},
      output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '../example')
      }
    })
  }

  if (buildType === 'umd') {
    return Object.assign(baseConfig, {
      entry: './src/index.js',
      output: {
        filename: 'ReactSVG.js',
        library: 'ReactSVG',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../dist')
      },
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        })
      ]
    })
  }

  if (buildType === 'umd:min') {
    return Object.assign(baseConfig, {
      entry: './src/index.js',
      output: {
        filename: 'ReactSVG.min.js',
        library: 'ReactSVG',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../dist')
      },
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new webpack.optimize.UglifyJsPlugin({
          compressor: {
            screw_ie8: true,
            warnings: false
          }
        })
      ]
    })
  }

}
