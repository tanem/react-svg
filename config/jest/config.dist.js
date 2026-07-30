const srcConfig = require('./config.src')
const distTests = require('./dist-tests')

// The suites that read `dist/` directly rather than importing `../src`. The
// inherited `testPathIgnorePatterns` is the list of files this config runs, so
// it has to be reset back to Jest's default.
module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  testMatch: distTests,
  testPathIgnorePatterns: ['/node_modules/'],
})
