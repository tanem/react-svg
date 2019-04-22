import { Errback, EvalScripts, SVGInjector } from '@tanem/svg-injector'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import shallowDiffers from './shallow-differs'

type WrapperType = HTMLSpanElement | HTMLDivElement

interface Props {
  evalScripts?: EvalScripts
  fallback?: React.ReactType
  loading?: React.ReactType
  onInjected?: Errback
  renumerateIRIElements?: boolean
  src: string
  svgClassName?: string
  svgStyle?: React.CSSProperties
  wrapper?: 'div' | 'span'
}

interface State {
  hasError: boolean
  isLoading: boolean
}

export default class ReactSVG extends React.Component<
  Props &
    React.DetailedHTMLProps<React.HTMLAttributes<WrapperType>, WrapperType>,
  State
> {
  static defaultProps = {
    evalScripts: 'never',
    fallback: null,
    loading: null,
    onInjected: () => undefined,
    renumerateIRIElements: true,
    svgClassName: null,
    svgStyle: {},
    wrapper: 'div'
  }

  static propTypes = {
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    fallback: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string
    ]),
    loading: PropTypes.oneOfType([
      PropTypes.func,
      PropTypes.object,
      PropTypes.string
    ]),
    onInjected: PropTypes.func,
    renumerateIRIElements: PropTypes.bool,
    src: PropTypes.string.isRequired,
    svgClassName: PropTypes.string,
    svgStyle: PropTypes.object,
    wrapper: PropTypes.oneOf(['div', 'span'])
  }

  initialState = {
    hasError: false,
    isLoading: true
  }

  state = this.initialState

  _isMounted = false

  container?: WrapperType | null

  svgWrapper?: WrapperType | null

  refCallback = (container: WrapperType | null) => {
    this.container = container
  }

  renderSVG() {
    if (this.container instanceof Node) {
      const {
        evalScripts,
        renumerateIRIElements,
        src,
        svgClassName,
        svgStyle
      } = this.props

      /* eslint-disable @typescript-eslint/no-non-null-assertion */
      const onInjected = this.props.onInjected!
      const Wrapper = this.props.wrapper!
      /* eslint-enable @typescript-eslint/no-non-null-assertion */

      const wrapper = document.createElement(Wrapper)
      wrapper.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <Wrapper>
          <Wrapper className={svgClassName} data-src={src} style={svgStyle} />
        </Wrapper>
      )

      this.svgWrapper = this.container.appendChild(
        wrapper.firstChild as WrapperType
      )

      const each: Errback = (error, svg) => {
        if (error) {
          this.removeSVG()
        }

        // TODO: It'd be better to cleanly unsubscribe from SVGInjector
        // callbacks instead of tracking a property like this.
        if (this._isMounted) {
          this.setState(
            () => ({
              hasError: !!error,
              isLoading: false
            }),
            () => {
              onInjected(error, svg)
            }
          )
        }
      }

      SVGInjector(this.svgWrapper.firstChild as WrapperType, {
        each,
        evalScripts,
        renumerateIRIElements
      })
    }
  }

  removeSVG() {
    if (this.container instanceof Node && this.svgWrapper instanceof Node) {
      this.container.removeChild(this.svgWrapper)
      this.svgWrapper = null
    }
  }

  componentDidMount() {
    this._isMounted = true
    this.renderSVG()
  }

  componentDidUpdate(prevProps: Props) {
    if (shallowDiffers(prevProps, this.props)) {
      this.setState(
        () => this.initialState,
        () => {
          this.removeSVG()
          this.renderSVG()
        }
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
      evalScripts,
      fallback: Fallback,
      loading: Loading,
      onInjected,
      renumerateIRIElements,
      src,
      svgClassName,
      svgStyle,
      wrapper,
      ...rest
    } = this.props
    /* eslint-enable @typescript-eslint/no-unused-vars */

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const Wrapper = wrapper!

    return (
      <Wrapper {...rest} ref={this.refCallback}>
        {this.state.isLoading && Loading && <Loading />}
        {this.state.hasError && Fallback && <Fallback />}
      </Wrapper>
    )
  }
}
