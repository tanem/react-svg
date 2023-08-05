import { SVGInjector } from '@tanem/svg-injector'
import * as PropTypes from 'prop-types'
import * as React from 'react'

import ownerWindow from './owner-window'
import shallowDiffers from './shallow-differs'
import { Props, State, WrapperType } from './types'

const svgNamespace = 'http://www.w3.org/2000/svg'
const xlinkNamespace = 'http://www.w3.org/1999/xlink'

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

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
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

      const beforeEach = (svg: SVGSVGElement): void => {
        svg.setAttribute('role', 'img')

        if (desc) {
          const originalDesc = svg.querySelector(':scope > desc')
          if (originalDesc) {
            svg.removeChild(originalDesc)
          }
          const newDesc = document.createElement('desc')
          newDesc.innerHTML = desc
          svg.prepend(newDesc)
        }

        if (title) {
          const originalTitle = svg.querySelector(':scope > title')
          if (originalTitle) {
            svg.removeChild(originalTitle)
          }
          const newTitle = document.createElement('title')
          newTitle.innerHTML = title
          svg.prepend(newTitle)
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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
