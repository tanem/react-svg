import WebpackDevServer from 'webpack-dev-server'
import webpack from 'webpack'

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  mode: 'none',
  entry: {
    basic: './examples/basic',
    'issue-49/fill': './examples/issue-49/fill',
    'issue-49/swap': './examples/issue-49/swap'
  },
  externals: {},
  output: {
    filename: '[name]/bundle.js'
  }
}

new WebpackDevServer(webpack(config), {
  contentBase: 'examples/',
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
  // eslint-disable-next-line no-console
  console.log('listening on localhost:8080')
})
