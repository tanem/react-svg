// Specs that read the built files in `dist/`, so they need a current
// `npm run build`. `config.dist.js` runs them; `config.src.js` skips them so
// that `test:src`, the development loop, stays build-independent.
module.exports = [
  '<rootDir>/test/bundles.spec.ts',
  '<rootDir>/test/node.spec.ts',
]
