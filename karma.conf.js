'use strict';

var path = require('path');

module.exports = function(config){
  config.set({
    browsers: ['Chrome'],
    singleRun: true,
    frameworks: ['mocha'],
    files: [
      'test/fixtures/atomic.svg',
      'test/index-spec.js'
    ],
    preprocessors: {
      'test/index-spec.js': ['webpack', 'sourcemap']
    },
    reporters: ['mocha'],
    webpack: {
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
