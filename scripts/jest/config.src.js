module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/*.{ts,tsx}'],
  globals: {
    'ts-jest': { tsConfig: require.resolve('../../tsconfig.test.json') }
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  rootDir: process.cwd(),
  roots: ['<rootDir>/test'],
  setupFiles: ['raf/polyfill', require.resolve('./setupEnvironment')],
  testMatch: ['<rootDir>/test/*.spec.ts?(x)'],
  transform: { '^.+\\.(js|tsx?)$': 'ts-jest' }
}
