import path from 'path';
import webpack from 'webpack';

const [,,buildType] = process.argv;

webpack(getConfig(buildType), (error, stats) => {

  if (error) {
    throw new Error(error);
  }

  console.log(stats.toString({
    assets: true,
    chunks: false,
    colors: true,
    hash: false,
    timings: false,
    version: false
  }));

});

function getConfig(buildType) {

  const baseConfig = {
    entry: './src/index.js',
    externals: {
      react: {
        root: 'React',
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'react'
      }
    },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }]
    }
  };

  if (buildType === 'lib') {
    return Object.assign(baseConfig, {
      output: {
        filename: 'index.js',
        path: path.join(__dirname, '../lib')
      }
    });
  }

  if (buildType === 'umd') {
    return Object.assign(baseConfig, {
      output: {
        filename: 'react-svg.js',
        library: 'react-svg',
        libraryTarget: 'umd',
        path: path.join(__dirname, '../dist')
      },
      plugins: [
        new webpack.optimize.OccurenceOrderPlugin()
      ]
    });
  }

  if (buildType === 'umd:min') {
    return Object.assign(baseConfig, {
      output: {
        filename: 'react-svg.min.js',
        library: 'react-svg',
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
    });
  }

}
