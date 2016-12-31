import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import ReactSVG from '../src'
import sourceSVG from './fixtures/source-svg'
import renderedSVG from './fixtures/rendered-svg'

describe('ReactSVG', () => {
  let xhr
  let requests

  beforeEach(() => {
    xhr = sinon.useFakeXMLHttpRequest()
    requests = []
    xhr.onCreate = (xhr) => requests.push(xhr)
  })

  afterEach(() => {
    xhr.restore()
  })

  it('should render correctly', (done) => {
    mount(
      <ReactSVG
        callback={(svg) => {
          expect(svg.outerHTML).toBe(renderedSVG)
          done()
        }}
        className="test-class"
        path="http://localhost/atomic.svg"
        style={{ height: 200 }}
      />
    )

    requests[0].respond(200, {}, sourceSVG)
  })

})
