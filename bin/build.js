import webpack from 'webpack'

import makeWebpackConfig from './makeWebpackConfig'

const [ , , buildType ] = process.argv

webpack(makeWebpackConfig(buildType), (error, stats) => {

  if (error) {
    throw new Error(error)
  }

  console.log(stats.toString({
    assets: true,
    chunks: false,
    colors: true,
    hash: false,
    timings: false,
    version: false
  }))

})
