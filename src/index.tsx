import SVGInjector from '@tanem/svg-injector'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'
import shallowDiffers from './shallow-differs'

export type OnInjected = (error: Error | null, svg?: SVGSVGElement) => void

interface Props {
  evalScripts: 'always' | 'once' | 'never'
  fallback: React.ReactNode
  onInjected: OnInjected
  renumerateIRIElements: boolean
  src: string
  svgClassName: string
  svgStyle: React.CSSProperties
}

interface State {
  hasError: boolean
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
    onInjected: () => undefined,
    renumerateIRIElements: true,
    svgClassName: null,
    svgStyle: {}
  }

  static propTypes = {
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    fallback: PropTypes.element,
    onInjected: PropTypes.func,
    renumerateIRIElements: PropTypes.bool,
    src: PropTypes.string.isRequired,
    svgClassName: PropTypes.string,
    svgStyle: PropTypes.object
  }

  initialState = {
    hasError: false
  }

  state = this.initialState

  container?: HTMLDivElement | null

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

      const wrapper = this.container.appendChild(
        div.firstChild as HTMLDivElement
      )

      const each: OnInjected = (error, svg) => {
        if (error) {
          this.removeSVG()
        }

        this.setState(
          () => ({
            hasError: !!error
          }),
          () => {
            onInjected(error, svg)
          }
        )
      }

      SVGInjector(wrapper.firstChild, {
        each,
        evalScripts,
        renumerateIRIElements
      })
    }
  }

  removeSVG() {
    if (
      this.container instanceof Node &&
      this.container.firstChild instanceof Node
    ) {
      this.container.removeChild(this.container.firstChild)
    }
  }

  componentDidMount() {
    this.renderSVG()
  }

  componentDidUpdate(prevProps: Props) {
    if (shallowDiffers(prevProps, this.props)) {
      this.removeSVG()
      this.setState(() => this.initialState, () => this.renderSVG())
    }
  }

  componentWillUnmount() {
    this.removeSVG()
  }

  render() {
    const {
      evalScripts,
      fallback,
      onInjected,
      renumerateIRIElements,
      src,
      svgClassName,
      svgStyle,
      ...rest
    } = this.props

    return (
      <div {...rest} ref={this.refCallback}>
        {this.state.hasError && fallback}
      </div>
    )
  }
}
