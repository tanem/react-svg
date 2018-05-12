import React from 'react'
import shortid from 'shortid'
import sinon from 'sinon'
import { mount } from 'enzyme'
import ReactSVG from '../src'
import rendered from './fixtures/rendered'
import source from './fixtures/source'
import updated from './fixtures/updated'

// Notes:
//
// - SVGInjector uses setTimeout to process it's XHR queue, so we control
//   request processing manually via Jest and Sinon.
// - Even though we're always responding with `sourceSVG`, we use different
//   `path` values when mounting within each test so that SVGInjector doesn't
//   use it's internal cache. This keeps the tests isolated from one another.

jest.useFakeTimers()

describe('while running in a browser environment', () => {
  let container
  let xhr
  let requests
  let wrapper

  beforeEach(() => {
    container = document.body.appendChild(document.createElement('div'))
    xhr = sinon.useFakeXMLHttpRequest()
    requests = []
    xhr.onCreate = xhr => {
      requests.push(xhr)
    }
  })

  afterEach(() => {
    xhr.restore()
    document.body.removeChild(container)
  })

  it('should render correctly', () => {
    const svgName = shortid.generate()

    wrapper = mount(
      <ReactSVG
        className="wrapper-class-name"
        path={`http://localhost/${svgName}.svg`}
        svgClassName="svg-class-name"
        svgStyle={{ height: 200 }}
      />,
      { attachTo: container }
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(wrapper.html()).toBe(rendered(svgName))
  })

  it('should update correctly', () => {
    const svgName = shortid.generate()

    wrapper = mount(
      <ReactSVG
        className="wrapper-class-name"
        path={`http://localhost/${svgName}.svg`}
        svgClassName="svg-class-name"
        svgStyle={{ height: 200 }}
      />,
      { attachTo: container }
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    wrapper.setProps({
      className: 'updated-wrapper-class-name',
      svgClassName: 'updated-svg-class-name',
      svgStyle: { height: 100 }
    })

    expect(wrapper.html()).toBe(updated(svgName))
  })

  it('should unmount correctly', () => {
    wrapper = mount(
      <ReactSVG
        svgClassName="svg-class-name"
        path={`http://localhost/${shortid.generate()}.svg`}
        svgStyle={{ height: 200 }}
      />,
      { attachTo: container }
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    wrapper.unmount()

    expect(container.innerHTML).toBe('')
  })

  it('should ensure a parent node is always available', () => {
    // One way to test this scenario is to unmount the component, which removes
    // the wrapper node, then let SVGInjector do it's usual DOM manipulation by
    // running the timers.
    expect(() => {
      wrapper = mount(
        <ReactSVG
          svgClassName="svg-class-name"
          path={`http://localhost/${shortid.generate()}.svg`}
          svgStyle={{ height: 200 }}
        />,
        { attachTo: container }
      )

      wrapper.unmount()

      requests[0].respond(200, {}, source)
      jest.runAllTimers()
    }).not.toThrow()
  })

  it('should not throw if the container is not present when mounting', () => {
    expect(() => {
      wrapper = mount(
        <ReactSVG
          svgClassName="svg-class-name"
          path={`http://localhost/${shortid.generate()}.svg`}
          svgStyle={{ height: 200 }}
        />,
        { attachTo: container }
      )

      requests[0].respond(200, {}, source)
      jest.runAllTimers()
      wrapper.instance().container = null

      wrapper.mount()
    }).not.toThrow()
  })

  it('should not throw if the container is not present when unmounting', () => {
    expect(() => {
      wrapper = mount(
        <ReactSVG
          svgClassName="svg-class-name"
          path={`http://localhost/${shortid.generate()}.svg`}
          svgStyle={{ height: 200 }}
        />,
        { attachTo: container }
      )

      requests[0].respond(200, {}, source)
      jest.runAllTimers()
      wrapper.instance().container = null

      wrapper.unmount()
    }).not.toThrow()
  })
})
