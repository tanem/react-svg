const srcConfig = require('./config.src')

// The ESM bundle is a `.mjs` file, which TypeScript always emits as ESM
// regardless of the `module` setting, so this config runs Jest in ESM mode
// rather than transpiling the suite down to CommonJS like the others.
module.exports = Object.assign({}, srcConfig, {
  collectCoverage: false,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    ...srcConfig.moduleNameMapper,
    '^../src$': `<rootDir>/dist/react-svg.mjs`,
  },
  testMatch: ['<rootDir>/test/browser.spec.tsx'],
  transform: {
    '^.+\\.([cm]?js|tsx?)$': [
      'ts-jest',
      { tsconfig: { module: 'esnext' }, useESM: true },
    ],
  },
})
