import SVGInjector from '@tanem/svg-injector'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import ReactDOMServer from 'react-dom/server'

interface Props {
  evalScripts?: 'always' | 'once' | 'never'
  onInjected?: (svg: SVGSVGElement) => void
  renumerateIRIElements?: boolean
  src: string
  svgClassName?: string
  svgStyle?: React.CSSProperties
}

export default class ReactSVG extends React.Component<
  Props &
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >
> {
  static defaultProps = {
    evalScripts: 'never',
    onInjected: () => undefined,
    renumerateIRIElements: true,
    svgClassName: null,
    svgStyle: {}
  }

  static propTypes = {
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    onInjected: PropTypes.func,
    renumerateIRIElements: PropTypes.bool,
    src: PropTypes.string.isRequired,
    svgClassName: PropTypes.string,
    svgStyle: PropTypes.object
  }

  container?: HTMLDivElement | null

  refCallback: React.Ref<HTMLDivElement> = container => {
    this.container = container
  }

  renderSVG() {
    if (this.container instanceof Node) {
      const {
        evalScripts,
        onInjected: each,
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

  componentDidUpdate() {
    this.removeSVG()
    this.renderSVG()
  }

  componentWillUnmount() {
    this.removeSVG()
  }

  render() {
    const {
      evalScripts,
      onInjected,
      renumerateIRIElements,
      src,
      svgClassName,
      svgStyle,
      ...rest
    } = this.props

    return <div {...rest} ref={this.refCallback} />
  }
}
