const srcConfig = require('./config.src')

module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  moduleNameMapper: {
    '^../src$': `<rootDir>/dist/react-svg.cjs.development.js`,
  },
  testMatch: ['<rootDir>/test/browser.spec.tsx'],
})
