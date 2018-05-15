const options = {
  presets: [
    ['@babel/env', { loose: true, modules: process.env.BABEL_OUTPUT || false }],
    '@babel/react'
  ],
  plugins: [
    ['@babel/proposal-class-properties', { loose: true }]
  ]
}

module.exports = options
