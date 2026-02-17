import { faker } from '@faker-js/faker'
import { render, screen, waitFor } from '@testing-library/react'
import nock from 'nock'
import * as React from 'react'

import { ReactSVG } from '../src'
import a11ySource from './a11y-source.fixture'
import iriSource from './iri-source.fixture'
import source from './source.fixture'
import spriteSource from './sprite-source.fixture'

// NOTE: Even though we're always responding with `source`, we use different
// `src` values when mounting within each test so that SVGInjector doesn't use
// it's internal cache. This keeps the tests isolated from one another.

describe('while running in a browser environment', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('should render correctly', async () => {
    faker.seed(123)
    const uuid = faker.string.uuid()

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
    faker.seed(124)
    const uuid = faker.string.uuid()

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
    faker.seed(125)
    const uuid = faker.string.uuid()

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
    faker.seed(126)
    const uuid = faker.string.uuid()

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
    faker.seed(127)
    const uuid = faker.string.uuid()

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

    faker.seed(128)
    const uuid = faker.string.uuid()
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

    faker.seed(129)
    const uuid = faker.string.uuid()

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
    faker.seed(142)
    const uuid = faker.string.uuid()
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

    faker.seed(188)
    const uuid = faker.string.uuid()

    nock('http://localhost').get(`/${uuid}.svg`).reply(404)

    const { container } = render(
      <ReactSVG fallback={fallback} src={`http://localhost/${uuid}.svg`} />,
    )

    await waitFor(() => screen.findByText('fallback'))

    expect(container.innerHTML).toMatchSnapshot()
  })

  it('should render the specified loader when injecting', async () => {
    const loading = () => <span>loading</span>

    faker.seed(131)
    const uuid = faker.string.uuid()

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
    faker.seed(132)
    const uuid = faker.string.uuid()

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
    faker.seed(133)
    const uuid = faker.string.uuid()

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
    faker.seed(134)
    const uuid = faker.string.uuid()
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
    faker.seed(135)
    const uuid = faker.string.uuid()

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
    faker.seed(136)
    const uuid = faker.string.uuid()

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
    faker.seed(137)
    const uuid = faker.string.uuid()
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

    faker.seed(138)
    const uuid = faker.string.uuid()

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

    faker.seed(143)
    const uuid = faker.string.uuid()
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

    faker.seed(144)
    const uuid = faker.string.uuid()

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

    faker.seed(145)
    const uuid = faker.string.uuid()
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

  // A11y tests use structural assertions (aria-labelledby === titleEl.id)
  // rather than snapshots, because the generated IDs contain a random prefix
  // that changes per test run.
  it("should add desc and title elements if they don't already exist", async () => {
    faker.seed(140)
    const uuid = faker.string.uuid()

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

    const svg = container.querySelector('.injected-svg')!
    const titleEl = svg.querySelector(':scope > title')
    const descEl = svg.querySelector(':scope > desc')

    expect(titleEl).not.toBeNull()
    expect(titleEl!.textContent).toBe('Title')
    expect(descEl).not.toBeNull()
    expect(descEl!.textContent).toBe('Description')
    expect(svg.getAttribute('aria-labelledby')).toBe(titleEl!.id)
    expect(svg.getAttribute('aria-describedby')).toBe(descEl!.id)
  })

  it('should replace desc and title elements if they already exist', async () => {
    faker.seed(141)
    const uuid = faker.string.uuid()

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

    const svg = container.querySelector('.injected-svg')!
    const titleEl = svg.querySelector(':scope > title')
    const descEl = svg.querySelector(':scope > desc')

    expect(titleEl).not.toBeNull()
    expect(titleEl!.textContent).toBe('New title')
    expect(descEl).not.toBeNull()
    expect(descEl!.textContent).toBe('New description')
    expect(svg.getAttribute('aria-labelledby')).toBe(titleEl!.id)
    expect(svg.getAttribute('aria-describedby')).toBe(descEl!.id)

    // Child-level title/desc (e.g. on <path>) should be untouched.
    expect(svg.querySelectorAll('title')).toHaveLength(2)
    expect(svg.querySelectorAll('desc')).toHaveLength(2)
  })

  it('should add only a title element and aria-labelledby when only title is provided', async () => {
    faker.seed(147)
    const uuid = faker.string.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} title="Only a title" />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    const svg = container.querySelector('.injected-svg')!
    const titleEl = svg.querySelector(':scope > title')

    expect(titleEl).not.toBeNull()
    expect(titleEl!.textContent).toBe('Only a title')
    expect(svg.getAttribute('aria-labelledby')).toBe(titleEl!.id)
    expect(svg.getAttribute('aria-describedby')).toBeNull()
    expect(svg.querySelector(':scope > desc')).toBeNull()
  })

  it('should add only a desc element and aria-describedby when only desc is provided', async () => {
    faker.seed(148)
    const uuid = faker.string.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG
        desc="Only a description"
        src={`http://localhost/${uuid}.svg`}
      />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    const svg = container.querySelector('.injected-svg')!
    const descEl = svg.querySelector(':scope > desc')

    expect(descEl).not.toBeNull()
    expect(descEl!.textContent).toBe('Only a description')
    expect(svg.getAttribute('aria-describedby')).toBe(descEl!.id)
    expect(svg.getAttribute('aria-labelledby')).toBeNull()
    expect(svg.querySelector(':scope > title')).toBeNull()
  })

  it('should not add aria attributes when neither title nor desc is provided', async () => {
    faker.seed(149)
    const uuid = faker.string.uuid()

    nock('http://localhost')
      .get(`/${uuid}.svg`)
      .reply(200, source, { 'Content-Type': 'image/svg+xml' })

    const { container } = render(
      <ReactSVG src={`http://localhost/${uuid}.svg`} />,
    )

    await waitFor(() =>
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
    )

    const svg = container.querySelector('.injected-svg')!
    expect(svg.getAttribute('aria-labelledby')).toBeNull()
    expect(svg.getAttribute('aria-describedby')).toBeNull()
    expect(svg.querySelector(':scope > title')).toBeNull()
    expect(svg.querySelector(':scope > desc')).toBeNull()
  })

  // React.forwardRef was added in 16.3. Skip this test on earlier versions
  // where forwardRef doesn't exist.
  ;('forwardRef' in React ? it : it.skip)(
    'should accept a forwarded ref without type errors',
    async () => {
      faker.seed(146)
      const uuid = faker.string.uuid()

      nock('http://localhost')
        .get(`/${uuid}.svg`)
        .reply(200, source, { 'Content-Type': 'image/svg+xml' })

      // Repro for https://github.com/tanem/react-svg/issues/2753
      const WrappedSVG = React.forwardRef<ReactSVG, { src: string }>(
        function WrappedSVG(props, ref) {
          return <ReactSVG ref={ref} src={props.src} />
        },
      )

      const ref = React.createRef<ReactSVG>()
      const { container } = render(
        <WrappedSVG ref={ref} src={`http://localhost/${uuid}.svg`} />,
      )

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
      )

      expect(ref.current).toBeInstanceOf(ReactSVG)
    },
  )

  describe('data URL support', () => {
    const svgRaw =
      '<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 8 8"><path d="M5 1L3 3H1V7H3L5 9V1Z"/></svg>'

    const encodedDataUrl = 'data:image/svg+xml,' + encodeURIComponent(svgRaw)

    const base64DataUrl =
      'data:image/svg+xml;base64,' +
      Buffer.from(svgRaw, 'utf8').toString('base64')

    it('should inject from a URL-encoded data URL', async () => {
      faker.seed(160)

      const { container } = render(<ReactSVG src={encodedDataUrl} />)

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
      )

      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should inject from a base64-encoded data URL', async () => {
      faker.seed(161)

      const { container } = render(<ReactSVG src={base64DataUrl} />)

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
      )

      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should call afterInjection for a data URL', (done) => {
      expect.assertions(1)

      faker.seed(162)

      render(
        <ReactSVG
          afterInjection={(svg) => {
            expect(svg).toBeInstanceOf(SVGSVGElement)
            done()
          }}
          src={encodedDataUrl}
        />,
      )
    })

    it('should call onError for an invalid data URL', (done) => {
      expect.assertions(1)

      faker.seed(163)

      const badDataUrl =
        'data:image/svg+xml,' + encodeURIComponent('<not-svg/>')

      render(
        <ReactSVG
          onError={(error) => {
            expect(error).toBeTruthy()
            done()
          }}
          src={badDataUrl}
        />,
      )
    })

    it('should render the fallback for an invalid data URL', async () => {
      const fallback = () => <span>fallback</span>

      faker.seed(164)

      const badDataUrl =
        'data:image/svg+xml,' + encodeURIComponent('<not-svg/>')

      render(<ReactSVG fallback={fallback} src={badDataUrl} />)

      await waitFor(() => expect(screen.getByText('fallback')).toBeDefined())
    })

    it('should apply beforeInjection to a data URL SVG', async () => {
      faker.seed(165)

      const { container } = render(
        <ReactSVG
          beforeInjection={(svg) => {
            svg.setAttribute('data-modified', 'true')
          }}
          src={encodedDataUrl}
        />,
      )

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
      )

      const svg = container.querySelector('.injected-svg')!
      expect(svg.getAttribute('data-modified')).toBe('true')
    })

    it('should inject a data URL sprite with a fragment identifier', async () => {
      faker.seed(166)

      const spriteDataUrl =
        'data:image/svg+xml,' + encodeURIComponent(spriteSource) + '#icon-star'

      const { container } = render(<ReactSVG src={spriteDataUrl} />)

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
      )

      expect(container.innerHTML).toMatchSnapshot()
    })
  })

  describe('sprite support', () => {
    it('should extract a single symbol from a sprite', async () => {
      faker.seed(150)
      const uuid = faker.string.uuid()

      nock('http://localhost')
        .get(`/${uuid}.svg`)
        .reply(200, spriteSource, { 'Content-Type': 'image/svg+xml' })

      const { container } = render(
        <ReactSVG src={`http://localhost/${uuid}.svg#icon-star`} />,
      )

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(1),
      )

      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should extract different symbols from the same sprite', async () => {
      faker.seed(151)
      const uuid = faker.string.uuid()

      nock('http://localhost')
        .get(`/${uuid}.svg`)
        .times(2)
        .reply(200, spriteSource, { 'Content-Type': 'image/svg+xml' })

      const { container } = render(
        <div>
          <ReactSVG src={`http://localhost/${uuid}.svg#icon-star`} />
          <ReactSVG src={`http://localhost/${uuid}.svg#icon-heart`} />
        </div>,
      )

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(2),
      )

      expect(container.innerHTML).toMatchSnapshot()
    })

    it('should handle symbol not found in sprite', async () => {
      faker.seed(152)
      const uuid = faker.string.uuid()

      nock('http://localhost')
        .get(`/${uuid}.svg`)
        .reply(200, spriteSource, { 'Content-Type': 'image/svg+xml' })

      const handleError = jest.fn()

      const { container } = render(
        <ReactSVG
          onError={handleError}
          src={`http://localhost/${uuid}.svg#nonexistent`}
        />,
      )

      await waitFor(() => expect(handleError).toHaveBeenCalledTimes(1))

      expect(handleError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('nonexistent'),
        }),
      )

      // No SVG should be injected when the symbol is not found.
      expect(container.querySelectorAll('.injected-svg')).toHaveLength(0)
    })

    it('should inject the same symbol multiple times', async () => {
      faker.seed(153)
      const uuid = faker.string.uuid()

      nock('http://localhost')
        .get(`/${uuid}.svg`)
        .times(2)
        .reply(200, spriteSource, { 'Content-Type': 'image/svg+xml' })

      const { container } = render(
        <div>
          <ReactSVG src={`http://localhost/${uuid}.svg#icon-heart`} />
          <ReactSVG src={`http://localhost/${uuid}.svg#icon-heart`} />
        </div>,
      )

      await waitFor(() =>
        expect(container.querySelectorAll('.injected-svg')).toHaveLength(2),
      )

      expect(container.innerHTML).toMatchSnapshot()
    })
  })
})
