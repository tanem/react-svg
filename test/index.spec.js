import React from 'react'
import { mount } from 'enzyme'
import sinon from 'sinon'

import ReactSVG from '../src'
import {
  sourceSVG,
  renderedSVG,
  updatedSVG
} from './fixtures/svg'

// Notes:
//
// - SVGInjector uses setTimeout to process it's XHR queue, so we control
//   request processing manually via Jest and Sinon.
// - Even though we're always responding with `sourceSVG`, we use different
//   `path` values when mounting within each test so that SVGInjector doesn't
//   use it's internal cache. This keeps the test isolated from one another.

jest.useFakeTimers()

describe('ReactSVG', () => {
  let container
  let xhr
  let requests
  let wrapper

  beforeEach(() => {
    container = document.body.appendChild(document.createElement('div'))
    xhr = sinon.useFakeXMLHttpRequest()
    requests = []
    xhr.onCreate = (xhr) => {
      requests.push(xhr)
    }
  })

  afterEach(() => {
    xhr.restore()
    document.body.removeChild(container)
  })

  it('should render correctly', (done) => {
    wrapper = mount(
      <ReactSVG
        callback={(svg) => {
          expect(svg.outerHTML).toBe(renderedSVG)
          done()
        }}
        className="test-class"
        path="http://localhost/render-source.svg"
        style={{ height: 200 }}
      />,
      { attachTo: container }
    )

    requests[0].respond(200, {}, sourceSVG)
    jest.runAllTimers()
  })

  it('should update correctly', (done) => {
    let callCount = 0

    wrapper = mount(
      <ReactSVG
        callback={(svg) => {
          if (++callCount > 1) {
            expect(svg.outerHTML).toBe(updatedSVG)
            done()
          }
        }}
        className="test-class"
        path="http://localhost/update-source.svg"
        style={{ height: 200 }}
      />,
      { attachTo: container }
    )

    requests[0].respond(200, {}, sourceSVG)
    jest.runAllTimers()

    wrapper.setProps({
      className: 'update-class',
      style: { height: 100 }
    })
  })

  it('should unmount correctly', () => {
    wrapper = mount(
      <ReactSVG
        className="test-class"
        path="http://localhost/unmount-source.svg"
        style={{ height: 200 }}
      />,
      { attachTo: container }
    )

    requests[0].respond(200, {}, sourceSVG)
    jest.runAllTimers()

    wrapper.detach()

    expect(container.innerHTML).toBe('')
  })

})
