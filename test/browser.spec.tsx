import { mount, ReactWrapper } from 'enzyme'
import faker from 'faker'
import * as React from 'react'
import sinon, {
  SinonFakeXMLHttpRequest,
  SinonFakeXMLHttpRequestStatic
} from 'sinon'
import ReactSVG from '../src'
import { format } from './helpers'
import iriSource from './iri-source.fixture'
import source from './source.fixture'

// Notes:
//
// - SVGInjector uses setTimeout to process it's XHR queue, so we control
//   request processing manually via Jest and Sinon.
// - Even though we're always responding with `sourceSVG`, we use different
//   `src` values when mounting within each test so that SVGInjector doesn't
//   use it's internal cache. This keeps the tests isolated from one another.

faker.seed(123)
jest.useFakeTimers()

describe('while running in a browser environment', () => {
  let fakeXHR: SinonFakeXMLHttpRequestStatic
  let requests: SinonFakeXMLHttpRequest[]
  let wrapper: ReactWrapper<{}, {}, ReactSVG>

  beforeEach(() => {
    fakeXHR = sinon.useFakeXMLHttpRequest()
    requests = []
    fakeXHR.onCreate = xhr => {
      requests.push(xhr)
    }
  })

  afterEach(() => {
    fakeXHR.restore()
  })

  it('should render correctly', () => {
    wrapper = mount(
      <ReactSVG
        className="wrapper-class-name"
        src={`http://localhost/${faker.random.uuid()}.svg`}
        svgClassName="svg-class-name"
        svgStyle={{ height: 200 }}
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  it('should update correctly', () => {
    wrapper = mount(
      <ReactSVG
        className="wrapper-class-name"
        src={`http://localhost/${faker.random.uuid()}.svg`}
        svgClassName="svg-class-name"
        svgStyle={{ height: 200 }}
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    wrapper.setProps({
      className: 'updated-wrapper-class-name',
      svgClassName: 'updated-svg-class-name',
      svgStyle: { height: 100 }
    })

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  it('should unmount correctly', () => {
    wrapper = mount(
      <ReactSVG
        svgClassName="svg-class-name"
        src={`http://localhost/${faker.random.uuid()}.svg`}
        svgStyle={{ height: 200 }}
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    wrapper.unmount()

    expect(wrapper.exists()).toBe(false)
  })

  it('should ensure a parent node is always available', () => {
    expect(() => {
      wrapper = mount(
        <ReactSVG
          svgClassName="svg-class-name"
          src={`http://localhost/${faker.random.uuid()}.svg`}
          svgStyle={{ height: 200 }}
        />
      )

      wrapper.instance().removeSVG()

      requests[0].respond(200, {}, source)
      jest.runAllTimers()
    }).not.toThrow()
  })

  it('should not throw if the container is not present when mounting', () => {
    expect(() => {
      wrapper = mount(
        <ReactSVG
          svgClassName="svg-class-name"
          src={`http://localhost/${faker.random.uuid()}.svg`}
          svgStyle={{ height: 200 }}
        />
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
          src={`http://localhost/${faker.random.uuid()}.svg`}
          svgStyle={{ height: 200 }}
        />
      )

      requests[0].respond(200, {}, source)
      jest.runAllTimers()
      wrapper.instance().container = null

      wrapper.unmount()
    }).not.toThrow()
  })

  it('should renumerate IRI elements by default', () => {
    wrapper = mount(
      <ReactSVG src={`http://localhost/${faker.random.uuid()}.svg`} />
    )

    requests[0].respond(200, {}, iriSource)
    jest.runAllTimers()

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  it('should not renumerate IRI elements when renumerateIRIElements is false', () => {
    wrapper = mount(
      <ReactSVG
        src={`http://localhost/${faker.random.uuid()}.svg`}
        renumerateIRIElements={false}
      />
    )

    requests[0].respond(200, {}, iriSource)
    jest.runAllTimers()

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  it('should call onInjected correctly when injection is unsuccessful', () => {
    expect.assertions(2)

    const src = `http://localhost/${faker.random.uuid()}.svg`

    wrapper = mount(
      <ReactSVG
        onInjected={(error, svg) => {
          expect(error).toEqual(new Error(`Unable to load SVG file: ${src}`))
          expect(svg).toBeUndefined()
        }}
        src={src}
      />
    )

    requests[0].respond(404, {}, '')
    jest.runAllTimers()
  })

  it('should call onInjected correctly when injection is successful', () => {
    expect.assertions(2)

    wrapper = mount(
      <ReactSVG
        onInjected={(error, svg) => {
          expect(error).toBeNull()
          expect(format((svg as SVGSVGElement).outerHTML)).toMatchSnapshot()
        }}
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()
  })

  it('should render the specified fallback if injection is unsuccessful', () => {
    const fallback = () => <span>fallback</span>

    wrapper = mount(
      <ReactSVG
        fallback={fallback}
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    requests[0].respond(404, {}, '')
    jest.runAllTimers()

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  it('should render the specified loader when injecting', () => {
    const loading = () => <span>loading</span>

    wrapper = mount(
      <ReactSVG
        loading={loading}
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  it('allows rendering of span wrappers', () => {
    wrapper = mount(
      <ReactSVG
        src={`http://localhost/${faker.random.uuid()}.svg`}
        wrapper="span"
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(format(wrapper.html())).toMatchSnapshot()
  })

  // TODO: When we have the ability to cleanly unsubscribe from SVGInjector
  // callbacks, we can update this dicey test to instead ensure the callbacks
  // aren't called.
  it('does not call setState when the component is unmounted', () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined)

    wrapper = mount(
      <ReactSVG src={`http://localhost/${faker.random.uuid()}.svg`} />
    )

    wrapper.unmount()

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(warnSpy).not.toHaveBeenCalled()

    warnSpy.mockRestore()
  })
})
