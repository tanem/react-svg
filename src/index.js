import React, { PureComponent, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import ReactDOMServer from 'react-dom/server'
import SVGInjector from 'svg-injector'

export default class ReactSVG extends PureComponent {

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

  renderSVG(props = this.props) {
    const {
      callback: each,
      className,
      evalScripts,
      path,
      style
    } = props

    this.container = ReactDOM.findDOMNode(this)

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

  componentDidMount() {
    this.renderSVG()
  }

  componentWillReceiveProps(nextProps) {
    this.removeSVG()
    this.renderSVG(nextProps)
  }

  componentWillUnmount() {
    this.removeSVG()
  }

  render() {
    return <div />
  }

}
