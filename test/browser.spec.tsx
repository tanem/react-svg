import { mount, ReactWrapper } from 'enzyme'
import faker from 'faker'
import * as React from 'react'
import sinon, {
  SinonFakeXMLHttpRequest,
  SinonFakeXMLHttpRequestStatic,
} from 'sinon'

import { ReactSVG } from '../src'
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
  let wrapper: ReactWrapper<
    Record<string, unknown>,
    Record<string, unknown>,
    ReactSVG
  >

  beforeEach(() => {
    fakeXHR = sinon.useFakeXMLHttpRequest()
    requests = []
    fakeXHR.onCreate = (xhr) => {
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
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should update correctly', () => {
    wrapper = mount(
      <ReactSVG
        className="wrapper-class-name"
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    wrapper.setProps({
      className: 'updated-wrapper-class-name',
    })

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should unmount correctly', () => {
    wrapper = mount(
      <ReactSVG src={`http://localhost/${faker.random.uuid()}.svg`} />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    wrapper.unmount()

    expect(wrapper.exists()).toBe(false)
  })

  it('should ensure a parent node is always available', () => {
    expect(() => {
      wrapper = mount(
        <ReactSVG src={`http://localhost/${faker.random.uuid()}.svg`} />
      )

      wrapper.instance().removeSVG()

      requests[0].respond(200, {}, source)
      jest.runAllTimers()
    }).not.toThrow()
  })

  it('should not throw if the container is not present when mounting', () => {
    expect(() => {
      wrapper = mount(
        <ReactSVG src={`http://localhost/${faker.random.uuid()}.svg`} />
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
        <ReactSVG src={`http://localhost/${faker.random.uuid()}.svg`} />
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

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should not renumerate IRI elements when renumerateIRIElements is false', () => {
    wrapper = mount(
      <ReactSVG
        renumerateIRIElements={false}
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    requests[0].respond(200, {}, iriSource)
    jest.runAllTimers()

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should call afterInjection correctly when injection is unsuccessful', () => {
    expect.assertions(2)

    const src = `http://localhost/${faker.random.uuid()}.svg`

    wrapper = mount(
      <ReactSVG
        afterInjection={(error, svg) => {
          expect(error).toEqual(new Error(`Unable to load SVG file: ${src}`))
          expect(svg).toBeUndefined()
        }}
        src={src}
      />
    )

    requests[0].respond(404, {}, '')
    jest.runAllTimers()
  })

  it('should call afterInjection correctly when injection is successful', () => {
    expect.assertions(2)

    wrapper = mount(
      <ReactSVG
        afterInjection={(error, svg) => {
          expect(error).toBeNull()
          expect((svg as SVGElement).outerHTML).toMatchPrettyHtmlSnapshot()
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

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should render the specified loader when injecting', () => {
    const loading = () => <span>loading</span>

    wrapper = mount(
      <ReactSVG
        loading={loading}
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
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

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('allows rendering of svg wrappers', () => {
    wrapper = mount(
      <ReactSVG
        src={`http://localhost/${faker.random.uuid()}.svg`}
        wrapper="svg"
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
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

  it('should allow modification of the SVG via the beforeInjection callback', () => {
    wrapper = mount(
      <ReactSVG
        beforeInjection={(svg) => {
          svg.classList.add('svg-class-name')
          svg.setAttribute('style', 'width: 200px')
          // TODO: Style child element fills.
        }}
        src={`http://localhost/${faker.random.uuid()}.svg`}
      />
    )

    requests[0].respond(200, {}, source)
    jest.runAllTimers()

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should render correctly when bypassing the request cache', () => {
    const src = `http://localhost/${faker.random.uuid()}.svg`
    wrapper = mount(
      <div>
        <ReactSVG src={src} useRequestCache={false} />
        <ReactSVG src={src} />
        <ReactSVG src={src} />
        <ReactSVG src={src} useRequestCache={false} />
      </div>
    )

    requests[0].respond(200, {}, source)
    requests[1].respond(200, {}, source)
    requests[2].respond(200, {}, source)
    jest.runAllTimers()

    expect(requests).toHaveLength(3)
    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })

  it('should render correctly with an extensionless svg', () => {
    wrapper = mount(
      <ReactSVG
        className="wrapper-class-name"
        src={`http://localhost/${faker.random.uuid()}`}
      />
    )

    requests[0].respond(200, { 'Content-Type': 'image/svg+xml' }, source)
    jest.runAllTimers()

    expect(wrapper.html()).toMatchPrettyHtmlSnapshot()
  })
})
