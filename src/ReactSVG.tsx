import { SVGInjector } from '@tanem/svg-injector'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import ownerWindow from './owner-window'
import shallowDiffers from './shallow-differs'
import type { Props, State, WrapperType } from './types'

const svgNamespace = 'http://www.w3.org/2000/svg'
const xlinkNamespace = 'http://www.w3.org/1999/xlink'

// Random prefix avoids ID collisions when multiple copies of react-svg are
// bundled (e.g. microfrontends). The counter ensures each component instance
// within the same bundle gets a unique ID.
const idPrefix = `react-svg-${Math.random().toString(36).slice(2, 6)}`
let idCounter = 0

export class ReactSVG extends React.Component<Props, State> {
  static defaultProps = {
    afterInjection: () => undefined,
    beforeInjection: () => undefined,
    desc: '',
    evalScripts: 'never',
    fallback: null,
    httpRequestWithCredentials: false,
    loading: null,
    onError: () => undefined,
    renumerateIRIElements: true,
    title: '',
    useRequestCache: true,
    wrapper: 'div',
  }

  static propTypes = {
    afterInjection: PropTypes.func,
    beforeInjection: PropTypes.func,
    desc: PropTypes.string,
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    fallback: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
    httpRequestWithCredentials: PropTypes.bool,
    loading: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string,
    ]),
    onError: PropTypes.func,
    renumerateIRIElements: PropTypes.bool,
    src: PropTypes.string.isRequired,
    title: PropTypes.string,
    useRequestCache: PropTypes.bool,
    wrapper: PropTypes.oneOf(['div', 'span', 'svg']),
  }

  initialState = {
    hasError: false,
    isLoading: true,
  }

  state = this.initialState

  _isMounted = false

  reactWrapper?: WrapperType | null

  nonReactWrapper?: WrapperType | null

  refCallback = (reactWrapper: WrapperType | null) => {
    this.reactWrapper = reactWrapper
  }

  renderSVG() {
    /* istanbul ignore else */
    if (this.reactWrapper instanceof ownerWindow(this.reactWrapper).Node) {
      const {
        desc,
        evalScripts,
        httpRequestWithCredentials,
        renumerateIRIElements,
        src,
        title,
        useRequestCache,
      } = this.props

      const onError = this.props.onError!
      const beforeInjection = this.props.beforeInjection!
      const afterInjection = this.props.afterInjection!
      const wrapper = this.props.wrapper!

      let nonReactWrapper
      let nonReactTarget

      if (wrapper === 'svg') {
        nonReactWrapper = document.createElementNS(svgNamespace, wrapper)
        nonReactWrapper.setAttribute('xmlns', svgNamespace)
        nonReactWrapper.setAttribute('xmlns:xlink', xlinkNamespace)
        nonReactTarget = document.createElementNS(svgNamespace, wrapper)
      } else {
        nonReactWrapper = document.createElement(wrapper)
        nonReactTarget = document.createElement(wrapper)
      }

      nonReactWrapper.appendChild(nonReactTarget)
      nonReactTarget.dataset.src = src

      this.nonReactWrapper = this.reactWrapper.appendChild(nonReactWrapper)

      const handleError = (error: unknown) => {
        this.removeSVG()
        if (!this._isMounted) {
          onError(error)
          return
        }
        this.setState(
          () => ({
            hasError: true,
            isLoading: false,
          }),
          () => {
            onError(error)
          },
        )
      }

      const afterEach = (error: Error | null, svg?: SVGSVGElement) => {
        if (error) {
          handleError(error)
          return
        }

        // TODO (Tane): It'd be better to cleanly unsubscribe from SVGInjector
        // callbacks instead of tracking a property like this.
        if (this._isMounted) {
          this.setState(
            () => ({
              isLoading: false,
            }),
            () => {
              try {
                afterInjection(svg!)
              } catch (afterInjectionError) {
                handleError(afterInjectionError)
              }
            },
          )
        }
      }

      // WAI best practice: SVGs need role="img" plus aria-labelledby/
      // aria-describedby pointing to <title>/<desc> element IDs for screen
      // readers to announce them. svg-injector copies the HTML title
      // *attribute* (tooltip) but doesn't create SVG-namespace child
      // elements or ARIA linkage, so we handle that here.
      const beforeEach = (svg: SVGSVGElement): void => {
        svg.setAttribute('role', 'img')

        const ariaLabelledBy: string[] = []
        const ariaDescribedBy: string[] = []

        if (title) {
          const originalTitle = svg.querySelector(':scope > title')
          if (originalTitle) {
            svg.removeChild(originalTitle)
          }
          const titleId = `${idPrefix}-title-${++idCounter}`
          // createElementNS is required: createElement would produce an
          // HTML-namespace node that screen readers ignore inside SVG.
          const newTitle = document.createElementNS(svgNamespace, 'title')
          newTitle.id = titleId
          newTitle.textContent = title
          svg.prepend(newTitle)
          ariaLabelledBy.push(titleId)
        }

        if (desc) {
          const originalDesc = svg.querySelector(':scope > desc')
          if (originalDesc) {
            svg.removeChild(originalDesc)
          }
          const descId = `${idPrefix}-desc-${++idCounter}`
          const newDesc = document.createElementNS(svgNamespace, 'desc')
          newDesc.id = descId
          newDesc.textContent = desc
          const existingTitle = svg.querySelector(':scope > title')
          if (existingTitle) {
            existingTitle.after(newDesc)
          } else {
            svg.prepend(newDesc)
          }
          ariaDescribedBy.push(descId)
        }

        if (ariaLabelledBy.length > 0) {
          svg.setAttribute('aria-labelledby', ariaLabelledBy.join(' '))
        }

        if (ariaDescribedBy.length > 0) {
          svg.setAttribute('aria-describedby', ariaDescribedBy.join(' '))
        }

        try {
          beforeInjection(svg)
        } catch (error) {
          handleError(error)
        }
      }

      SVGInjector(nonReactTarget, {
        afterEach,
        beforeEach,
        cacheRequests: useRequestCache,
        evalScripts,
        httpRequestWithCredentials,
        renumerateIRIElements,
      })
    }
  }

  removeSVG() {
    if (this.nonReactWrapper?.parentNode) {
      this.nonReactWrapper.parentNode.removeChild(this.nonReactWrapper)
      this.nonReactWrapper = null
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.renderSVG()
  }

  componentDidUpdate(prevProps: Props) {
    if (shallowDiffers({ ...prevProps }, this.props)) {
      this.setState(
        () => this.initialState,
        () => {
          this.removeSVG()
          this.renderSVG()
        },
      )
    }
  }

  componentWillUnmount() {
    this._isMounted = false
    this.removeSVG()
  }

  render() {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const {
      afterInjection,
      beforeInjection,
      desc,
      evalScripts,
      fallback: Fallback,
      httpRequestWithCredentials,
      loading: Loading,
      renumerateIRIElements,
      src,
      title,
      useRequestCache,
      wrapper,
      ...rest
    } = this.props
    /* eslint-enable @typescript-eslint/no-unused-vars */

    const Wrapper = wrapper!

    return (
      <Wrapper
        {...rest}
        ref={this.refCallback}
        {...(wrapper === 'svg'
          ? {
              xmlns: svgNamespace,
              xmlnsXlink: xlinkNamespace,
            }
          : {})}
      >
        {this.state.isLoading && Loading && <Loading />}
        {this.state.hasError && Fallback && <Fallback />}
      </Wrapper>
    )
  }
}
