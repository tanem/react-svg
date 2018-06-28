import SVGInjector from '@tanem/svg-injector'
import PropTypes from 'prop-types'
import React from 'react'
import ReactDOMServer from 'react-dom/server'

export default class ReactSVG extends React.Component {
  static defaultProps = {
    evalScripts: 'never',
    onInjected: () => {},
    renumerateIRIElements: true,
    svgClassName: null,
    svgStyle: {}
  }

  static propTypes = {
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    onInjected: PropTypes.func,
    path: PropTypes.string.isRequired,
    renumerateIRIElements: PropTypes.bool,
    svgClassName: PropTypes.string,
    svgStyle: PropTypes.object
  }

  refCallback = container => {
    this.container = container
  }

  renderSVG() {
    if (this.container instanceof Node) {
      const {
        evalScripts,
        onInjected: each,
        path,
        renumerateIRIElements,
        svgClassName,
        svgStyle
      } = this.props

      const div = document.createElement('div')
      div.innerHTML = ReactDOMServer.renderToStaticMarkup(
        <div>
          <div className={svgClassName} data-src={path} style={svgStyle} />
        </div>
      )

      const wrapper = this.container.appendChild(div.firstChild)

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
      path,
      renumerateIRIElements,
      svgClassName,
      svgStyle,
      ...rest
    } = this.props

    return <div {...rest} ref={this.refCallback} />
  }
}
