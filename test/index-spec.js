'use strict';

var should = require('chai').should();
var React = require('react');
var TestUtils = require('react-addons-test-utils');

var ReactSVG = React.createFactory(require('..'));

describe('react-svg', function(){
  describe('while rendering', function(){
    it('should add the className to the rendered component', function(){
      var component = TestUtils.renderIntoDocument(
        ReactSVG({
          className: 'not-vml',
          path: 'http://localhost:9876/base/test/fixtures/atomic.svg'
        })
      );

      TestUtils.findRenderedDOMComponentWithTag(component, 'img').className
        .should.eql('not-vml');
    });

    it('should add the path to the rendered component', function() {
      var component = TestUtils.renderIntoDocument(
        ReactSVG({
          className: 'not-vml',
          path: 'http://localhost:9876/base/test/fixtures/atomic.svg'
        })
      );

      TestUtils.findRenderedDOMComponentWithTag(component, 'img').dataset.src
        .should.eql('http://localhost:9876/base/test/fixtures/atomic.svg');
    });
  });

  describe('after mounting', function(){
    it('should run the callback when the SVGInjector has finished', function(done){
      TestUtils.renderIntoDocument(
        ReactSVG({
          className: 'not-vml',
          path: 'http://localhost:9876/base/test/fixtures/atomic.svg',
          callback: function(svg){
            svg.classList.contains('not-vml').should.be.true;
            done();
          }
        })
      );
    });
  });
});
