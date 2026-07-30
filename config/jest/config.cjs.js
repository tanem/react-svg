const srcConfig = require('./config.src')

module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  moduleNameMapper: {
    ...srcConfig.moduleNameMapper,
    '^../src$': `<rootDir>/dist/react-svg.cjs`,
  },
  testMatch: ['<rootDir>/test/browser.spec.tsx'],
})
