const srcConfig = require('./config.src')

module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  moduleNameMapper: {
    '^../src$': `<rootDir>/index.js`
  },
  testMatch: ['<rootDir>/test/*.spec.ts?(x)']
})
