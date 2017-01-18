import React, { Component, PropTypes } from 'react'
import ReactDOMServer from 'react-dom/server'
import SVGInjector from 'svg-injector'

export default class ReactSVG extends Component {

  static defaultProps = {
    callback: () => {},
    className: '',
    evalScripts: 'once',
    style: {}
  }

  static propTypes = {
    callback: PropTypes.func,
    className: PropTypes.string,
    evalScripts: PropTypes.oneOf([ 'always', 'once', 'never' ]),
    path: PropTypes.string.isRequired,
    style: PropTypes.object
  }

  refCallback = (container) => {
    if (!container) {
      this.removeSVG()
      return
    }

    this.container = container
    this.renderSVG()
  }

  renderSVG(props = this.props) {
    const {
      callback: each,
      className,
      evalScripts,
      path,
      style
    } = props

    const div = document.createElement('div')
    div.innerHTML = ReactDOMServer.renderToStaticMarkup(
      <img
        className={className}
        data-src={path}
        style={style}
      />
    )

    const img = this.container.appendChild(div.firstChild)

    SVGInjector(img, {
      evalScripts,
      each
    })
  }

  removeSVG() {
    this.container.removeChild(this.container.firstChild)
  }

  componentWillReceiveProps(nextProps) {
    this.removeSVG()
    this.renderSVG(nextProps)
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return <div ref={this.refCallback} />
  }

}
