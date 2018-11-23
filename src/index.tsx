import SVGInjector from '@tanem/svg-injector'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import shallowDiffers from './shallow-differs'

export type OnInjected = (
  error: Error | null,
  svg: SVGSVGElement | undefined
) => void

interface Props {
  evalScripts?: 'always' | 'once' | 'never'
  fallback?: React.ReactType
  loading?: React.ReactType
  onInjected?: OnInjected
  renumerateIRIElements?: boolean
  src: string
  svgClassName?: string
  svgStyle?: React.CSSProperties
}

interface State {
  hasError: boolean
  isLoading: boolean
}

export default class ReactSVG extends React.Component<
  Props &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
  State
> {
  static defaultProps = {
    evalScripts: 'never',
    fallback: null,
    loading: null,
    onInjected: () => undefined,
    renumerateIRIElements: true,
    svgClassName: null,
    svgStyle: {}
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
    svgStyle: PropTypes.object
  }

  initialState = {
    hasError: false,
    isLoading: true
  }

  state = this.initialState

  container: HTMLDivElement | null | undefined

  svgWrapper: HTMLDivElement | null | undefined

  refCallback: React.Ref<HTMLDivElement> = container => {
    this.container = container
  }

  renderSVG() {
    if (this.container instanceof Node) {
      const {
        evalScripts,
        onInjected,
        renumerateIRIElements,
        src,
        svgClassName,
        svgStyle
      } = this.props

      const div = document.createElement('div')
      div.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <div>
          <div className={svgClassName} data-src={src} style={svgStyle} />
        </div>
      )

      this.svgWrapper = this.container.appendChild(
        div.firstChild as HTMLDivElement
      )

      const each: OnInjected = (error, svg) => {
        if (error) {
          this.removeSVG()
        }

        this.setState(
          () => ({
            hasError: !!error,
            isLoading: false
          }),
          () => {
            onInjected!(error, svg)
          }
        )
      }

      SVGInjector(this.svgWrapper.firstChild, {
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
    this.removeSVG()
  }

  render() {
    const {
      evalScripts,
      fallback: Fallback,
      loading: Loading,
      onInjected,
      renumerateIRIElements,
      src,
      svgClassName,
      svgStyle,
      ...rest
    } = this.props

    return (
      <div {...rest} ref={this.refCallback}>
        {this.state.isLoading && Loading && <Loading />}
        {this.state.hasError && Fallback && <Fallback />}
      </div>
    )
  }
}
