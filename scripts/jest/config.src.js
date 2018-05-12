module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/*.js'
  ],
  rootDir: process.cwd(),
  roots: ['<rootDir>/test'],
  setupFiles: ['raf/polyfill', require.resolve('./setupEnvironment')]
}
