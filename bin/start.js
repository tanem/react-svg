import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

import makeWebpackConfig from './makeWebpackConfig'

new WebpackDevServer(webpack(makeWebpackConfig('example')), {
  contentBase: 'example/',
  filename: 'bundle.js',
  stats: {
    assets: true,
    chunks: false,
    colors: true,
    hash: false,
    timings: false,
    version: false
  }
}).listen(8080, 'localhost', () => {
  console.log('listening on localhost:8080')
})
