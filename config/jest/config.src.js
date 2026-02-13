const path = require('path')

const generateReactVersionMappings = (reactVersion) => {
  if (!reactVersion) {
    return {}
  }

  const testDir = path.join(process.cwd(), 'test', 'react', reactVersion)
  return {
    '^@testing-library/react$': require.resolve('@testing-library/react', {
      paths: [testDir],
    }),
    '^react$': require.resolve('react', { paths: [testDir] }),
    '^react-dom$': require.resolve('react-dom', { paths: [testDir] }),
  }
}

module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ['src/*.{ts,tsx}'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  moduleNameMapper: {
    ...generateReactVersionMappings(process.env.REACT_VERSION),
  },
  preset: 'ts-jest',
  prettierPath: require.resolve('prettier'),
  rootDir: process.cwd(),
  roots: ['<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/config/jest/setupJest.ts'],
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/test/*.spec.ts?(x)'],
  transform: { '^.+\\.(js|tsx?)$': 'ts-jest' },
  transformIgnorePatterns: ['/node_modules/(?!@faker-js)'],
}
