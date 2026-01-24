import { render, screen, waitFor } from '@testing-library/react'
import faker from 'faker'
import nock from 'nock'
import * as React from 'react'

import { ReactSVG } from '../src'
import a11ySource from './a11y-source.fixture'
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
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should update correctly', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container, rerender } = render(
      <ReactSVG
        className="wrapper-class-name"
        src={`http://localhost/${uuid}.svg`}
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    rerender(
      <ReactSVG
        className="updated-wrapper-class-name"
        src={`http://localhost/${uuid}.svg`}
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should unmount correctly', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container, unmount } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    unmount()

    expect(container.innerHTML).toBe('')
  })

  it('should renumerate IRI elements by default', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, iriSource, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should not renumerate IRI elements when renumerateIRIElements is false', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, iriSource, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        renumerateIRIElements={false}
        src={`http://localhost/${uuid}.svg`}
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should call onError when injection is unsuccessful', (done) => {
    expect.assertions(1)

    const uuid = faker.datatype.uuid()
    const src = `http://localhost/${uuid}.svg`

    nock('http://localhost').get(`/${uuid}.svg`).reply(404)

    render(
      <ReactSVG
        onError={(error) => {
          expect(error).toEqual(new Error(`Unable to load SVG file: ${src}`))
          done()
        }}
        src={src}
      />,
    )
  })

  it('should call afterInjection when injection is successful', (done) => {
    expect.assertions(1)

    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    render(
      <ReactSVG
        afterInjection={(svg) => {
          expect((svg as SVGSVGElement).outerHTML).toMatchSnapshot()
          done()
        }}
        src={`http://localhost/${uuid}.svg`}
      />,
    )
  })

  it('should call onError when injection is unsuccessful and the component is not mounted', async () => {
    const mock = jest.fn()
    const uuid = faker.datatype.uuid()
    const src = `http://localhost/${uuid}.svg`

    nock('http://localhost').get(`/${uuid}.svg`).reply(404)

    const { unmount } = render(<ReactSVG onError={mock} src={src} />)

    unmount()

    await waitFor(() => {
      expect(mock).toHaveBeenCalledWith(
        new Error(`Unable to load SVG file: ${src}`),
      )
    })
  })

  it('should render the specified fallback if injection is unsuccessful', async () => {
    const fallback = () => <span>fallback</span>

    const uuid = faker.datatype.uuid()

    nock('http://localhost').get(`/${uuid}.svg`).reply(404)

    const { container } = render(
      <ReactSVG fallback={fallback} src={`http://localhost/${uuid}.svg`} />,
    )

    await waitFor(() => screen.findByText('fallback'))

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should render the specified loader when injecting', async () => {
    const loading = () => <span>loading</span>

    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG loading={loading} src={`http://localhost/${uuid}.svg`} />,
    )

    // Checking before the query has been processed should give us the loader.
    expect(container.innerHTML).toMatchSnapshot()

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )
  })

  it('allows rendering of span wrappers', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} wrapper="span" />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should allow modification of the SVG via the beforeInjection callback', async () => {
    const uuid = faker.datatype.uuid()

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
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should render correctly when bypassing the request cache', async () => {
    const uuid = faker.datatype.uuid()
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
      </div>,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(4),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should render correctly with an extensionless svg', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(<ReactSVG src={`http://localhost/${uuid}`} />)

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('allows rendering of svg wrappers', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}`} wrapper="svg" />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('re-renders correctly into the same container', async () => {
    const uuid = faker.datatype.uuid()
    const src = `http://localhost/${uuid}`
    const div = document.createElement('div')

    nock('http://localhost')
      .get(`/${uuid}`)
      .times(2)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    render(<ReactSVG src={src} wrapper="svg" />, { container: div })
    await waitFor(() =>
      expect(div.querySelectorAll('.injected-svg')).toHaveLength(1),
    )
    expect(div.innerHTML).toMatchSnapshot()

    render(<ReactSVG src={src} wrapper="span" />, { container: div })
    await waitFor(() =>
      expect(div.querySelectorAll('.injected-svg')).toHaveLength(1),
    )
    expect(div.innerHTML).toMatchSnapshot()
  })

  it('should render the specified fallback if beforeInjection throws an error', async () => {
    const fallback = () => <span>fallback</span>

    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        beforeInjection={() => {
          throw new Error('sad trombone')
        }}
        fallback={fallback}
        src={`http://localhost/${uuid}.svg`}
      />,
    )

    await waitFor(() => screen.findByText('fallback'))

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should call onError if beforeInjection throws an error', (done) => {
    expect.assertions(1)

    const uuid = faker.datatype.uuid()
    const error = new Error('sad trombone')

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    render(
      <ReactSVG
        beforeInjection={() => {
          throw error
        }}
        onError={(e) => {
          expect(e).toEqual(error)
          done()
        }}
        src={`http://localhost/${uuid}.svg`}
      />,
    )
  })

  it('should render the specified fallback if afterInjection throws an error', async () => {
    const fallback = () => <span>fallback</span>

    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        afterInjection={() => {
          throw new Error('sad trombone')
        }}
        fallback={fallback}
        src={`http://localhost/${uuid}.svg`}
      />,
    )

    await waitFor(() => screen.findByText('fallback'))

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should call onError if afterInjection throws an error', (done) => {
    expect.assertions(1)

    const uuid = faker.datatype.uuid()
    const error = new Error('sad trombone')

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    render(
      <ReactSVG
        afterInjection={() => {
          throw error
        }}
        onError={(e) => {
          expect(e).toEqual(error)
          done()
        }}
        src={`http://localhost/${uuid}.svg`}
      />,
    )
  })

  it("should add desc and title elements if they don't already exist", async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        desc="Description"
        src={`http://localhost/${uuid}.svg`}
        title="Title"
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should replace desc and title elements if they already exist', async () => {
    const uuid = faker.datatype.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, a11ySource, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        desc="New description"
        src={`http://localhost/${uuid}.svg`}
        title="New title"
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    expect(container.innerHTML).toMatchSnapshot()
  })
})
