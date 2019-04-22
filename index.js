'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./react-svg.cjs.production.js')
} else {
  module.exports = require('./react-svg.cjs.development.js')
}
