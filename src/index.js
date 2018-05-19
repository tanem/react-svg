import PropTypes from 'prop-types'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

// See: https://github.com/webpack/react-starter/issues/37
const isBrowser = typeof window !== 'undefined'
const SVGInjector = isBrowser ? require('svg-injector-2') : undefined

export default class ReactSVG extends React.Component {
  static defaultProps = {
    evalScripts: 'never',
    onInjected: () => {},
    svgClassName: null,
    svgStyle: {}
  }

  static propTypes = {
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    onInjected: PropTypes.func,
    path: PropTypes.string.isRequired,
    svgClassName: PropTypes.string,
    svgStyle: PropTypes.object
  }

  refCallback = container => {
    this.container = container
  }

  renderSVG() {
    if (this.container instanceof Node) {
      const { onInjected, path, svgClassName, svgStyle } = this.props

      const div = document.createElement('div')
      div.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <div>
          <div className={svgClassName} data-src={path} style={svgStyle} />
        </div>
      )

      const wrapper = this.container.appendChild(div.firstChild)

      this.injector.inject(wrapper.firstChild, null, onInjected)
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
    this.injector = new SVGInjector({ evalScripts: this.props.evalScripts })
    this.renderSVG()
  }

  componentDidUpdate() {
    this.removeSVG()
    this.renderSVG()
  }

  componentWillUnmount() {
    this.injector = null
    this.removeSVG()
  }

  render() {
    const {
      evalScripts,
      onInjected,
      path,
      svgClassName,
      svgStyle,
      ...rest
    } = this.props

    return <div {...rest} ref={this.refCallback} />
  }
}
