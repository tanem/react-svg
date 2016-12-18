import chai from 'chai'
import React from 'react'
import {
  findRenderedDOMComponentWithTag,
  renderIntoDocument
} from 'react-addons-test-utils'

import ReactSVG from '../src'

chai.should()

describe('react-svg', () => {
  describe('while rendering', () => {
    it('should add the className to the rendered component', () => {
      const reactSVG = renderIntoDocument(
        <ReactSVG
          className={'not-vml'}
          path={'http://localhost:9876/base/test/fixtures/atomic.svg'}
        />
      )

      findRenderedDOMComponentWithTag(reactSVG, 'img').className
        .should.eql('not-vml')
    })

    it('should add the path to the rendered component', () => {
      const reactSVG = renderIntoDocument(
        <ReactSVG
          className={'not-vml'}
          path={'http://localhost:9876/base/test/fixtures/atomic.svg'}
        />
      )

      findRenderedDOMComponentWithTag(reactSVG, 'img').dataset.src
        .should.eql('http://localhost:9876/base/test/fixtures/atomic.svg')
    })
  })

  describe('after mounting', () => {
    it('should run the callback when the SVGInjector has finished', (done) => {
      renderIntoDocument(
        <ReactSVG
          className={'not-vml'}
          path={'http://localhost:9876/base/test/fixtures/atomic.svg'}
          callback={(svg) => {
            svg.classList.contains('not-vml').should.be.true
            done()
          }}
        />
      )
    })
  })
})
