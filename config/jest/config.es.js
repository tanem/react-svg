const srcConfig = require('./config.src')

module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  moduleNameMapper: {
    ...srcConfig.moduleNameMapper,
    '^../src$': `<rootDir>/dist/react-svg.esm.js`,
  },
  testMatch: ['<rootDir>/test/browser.spec.tsx'],
})
