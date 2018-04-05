import webpack from 'webpack'
import makeWebpackConfig from './makeWebpackConfig'

const [, , buildType] = process.argv

webpack(makeWebpackConfig(buildType), (error, stats) => {
  if (error) {
    throw new Error(error)
  }

  // eslint-disable-next-line no-console
  console.log(
    stats.toString({
      assets: true,
      chunks: false,
      colors: true,
      hash: false,
      timings: false,
      version: false
    })
  )
})
