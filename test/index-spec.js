var jsdom = require('jsdom'),
  chai = require('chai'),
  React = require('react'),
  TestUtils = require('react/addons').addons.TestUtils;

should = chai.should();

var jsdocument = jsdom.jsdom('<html><body></body></html>', jsdom.level(1, 'core'));

// Because of SVGInjector, we need to set the window and document before
// we require SVGInjector. This also forces us to set the navigator as React
// will use it if it detects a window being present.
document = jsdocument;
window = document.parentWindow;
navigator = window.navigator;

before(function() {
  document = jsdocument;
  window = document.parentWindow;
  navigator = window.navigator;
});

describe('SVGComponent', function() {

  beforeEach(function() {
    this.htmlContainer = document.createElement('div');
    this.SVGComponent = React.createFactory(require('../index.js'));
  });

  describe('while rendering', function() {

    beforeEach(function() {
      var component = this.SVGComponent({ className: 'not-vml', path: '/images/svg/atomic.svg' });
      this.instance = TestUtils.renderIntoDocument(component, this.htmlContainer);
    });

    it('should add the className to the rendered component', function() {
      this.instance.getDOMNode().className.should.eq('not-vml');
    });

    it('should add the path to the rendered component', function() {
      this.instance.getDOMNode().attributes['data-src']._nodeValue.should.eq('/images/svg/atomic.svg');
    });
  });

  describe('after mounting', function() {
    beforeEach(function() {
      var htmlContainer = document.createElement('div');
      var SVGComponent = React.createFactory(require('../index.js'));
    });

    it('should run the callback when the SVGInjector has finished', function(done) {

      var callback = function(svg) {
        svg.should.eq('This browser does not support SVG and no PNG fallback was defined.');
        done();
      };
      var component = this.SVGComponent({
        className: 'not-vml',
        path: '/images/svg/atomic.svg',
        callback: callback
      });
      instance = TestUtils.renderIntoDocument(component, this.htmlContainer);
    });

  });

});