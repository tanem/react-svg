import { render, screen, waitFor } from '@testing-library/react'
import faker from 'faker'
import nock from 'nock'
import * as React from 'react'

import { ReactSVG } from '../src'
import iriSource from './iri-source.fixture'
import source from './source.fixture'

// NOTE: Even though we're always responding with `source`, we use different
// `src` values when mounting within each test so that SVGInjector doesn't use
// it's internal cache. This keeps the tests isolated from one another.

faker.seed(123)

describe('while running in a browser environment', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should render correctly', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should update correctly', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container, rerender } = render(
      <ReactSVG
        className="wrapper-class-name"
        src={`http://localhost/${uuid}.svg`}
      />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    rerender(
      <ReactSVG
        className="updated-wrapper-class-name"
        src={`http://localhost/${uuid}.svg`}
      />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should unmount correctly', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container, unmount } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    unmount()

    expect(container.innerHTML).toBe('')
  })

  it('should return an error if a parent node is not available when injecting', (done) => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { unmount } = render(
      <ReactSVG
        afterInjection={(error) => {
          expect(error).toBeInstanceOf(Error)
          done()
        }}
        src={`http://localhost/${uuid}.svg`}
      />
    )

    unmount()
  })

  it('should renumerate IRI elements by default', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, iriSource, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should not renumerate IRI elements when renumerateIRIElements is false', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, iriSource, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        renumerateIRIElements={false}
        src={`http://localhost/${uuid}.svg`}
      />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should call afterInjection correctly when injection is unsuccessful', (done) => {
    expect.assertions(2)

    const uuid = faker.random.uuid()
    const src = `http://localhost/${uuid}.svg`

    nock('http://localhost').get(`/${uuid}.svg`).reply(404)

    render(
      <ReactSVG
        afterInjection={(error, svg) => {
          expect(error).toEqual(new Error(`Unable to load SVG file: ${src}`))
          expect(svg).toBeUndefined()
          done()
        }}
        src={src}
      />
    )
  })

  it('should call afterInjection correctly when injection is successful', (done) => {
    expect.assertions(2)

    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    render(
      <ReactSVG
        afterInjection={(error, svg) => {
          expect(error).toBeNull()
          expect((svg as SVGElement).outerHTML).toMatchPrettyHtmlSnapshot()
          done()
        }}
        src={`http://localhost/${uuid}.svg`}
      />
    )
  })

  it('should render the specified fallback if injection is unsuccessful', async () => {
    const fallback = () => <span>fallback</span>

    const uuid = faker.random.uuid()

    nock('http://localhost').get(`/${uuid}.svg`).reply(404)

    const { container } = render(
      <ReactSVG fallback={fallback} src={`http://localhost/${uuid}.svg`} />
    )

    await waitFor(() => screen.findByText('fallback'))

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should render the specified loader when injecting', async () => {
    const loading = () => <span>loading</span>

    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG loading={loading} src={`http://localhost/${uuid}.svg`} />
    )

    // Checking before the query has been processed should give us the loader.
    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )
  })

  it('allows rendering of span wrappers', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} wrapper="span" />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should allow modification of the SVG via the beforeInjection callback', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        beforeInjection={(svg) => {
          svg.classList.add('svg-class-name')
          svg.setAttribute('style', 'width: 200px')
          // TODO: Style child element fills.
        }}
        src={`http://localhost/${uuid}.svg`}
      />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should render correctly when bypassing the request cache', async () => {
    const uuid = faker.random.uuid()
    const src = `http://localhost/${uuid}.svg`

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .times(3)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <div>
        <ReactSVG src={src} useRequestCache={false} />
        <ReactSVG src={src} />
        <ReactSVG src={src} />
        <ReactSVG src={src} useRequestCache={false} />
      </div>
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(4)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('should render correctly with an extensionless svg', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(<ReactSVG src={`http://localhost/${uuid}`} />)

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })

  it('allows rendering of svg wrappers', async () => {
    const uuid = faker.random.uuid()

    nock('http://localhost')
      .get(`/${uuid}`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}`} wrapper="svg" />
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1)
    )

    expect(container.innerHTML).toMatchPrettyHtmlSnapshot()
  })
})
