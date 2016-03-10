'use strict';

var React = require('react');
var SVGInjector = require('svg-injector');

var svgConfig = function(args){
  return {
    evalScripts: args.evalScripts || 'never',
    each: args.callback || null
  };
};

var SVGComponent = React.createClass({

  componentDidMount: function(){
    return SVGInjector([this._img], svgConfig(this.props));
  },

  render: function(){
    return React.createElement('img', {
      className: this.props.className,
      'data-src': this.props.path,
      'data-fallback': this.props.fallbackPath,
      ref: function(img){
        this._img = img;
      }.bind(this)
    });
  }

});

module.exports = SVGComponent;
