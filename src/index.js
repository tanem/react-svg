import React, { PureComponent, PropTypes } from 'react'
import SVGInjector from 'svg-injector'
import ReactDOM from 'react-dom'

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

    ReactDOM.unstable_renderSubtreeIntoContainer(
      this,
      <img
        ref={(img) => {
          this.img = img
        }}
        className={className}
        data-src={path}
        style={style}
      />,
      this.container,
      () => {
        SVGInjector(this.img, {
          evalScripts,
          each
        })
      }
    )
  }

  componentDidMount() {
    this.renderSVG()
  }

  componentWillReceiveProps(nextProps) {
    this.renderSVG(nextProps)
  }

  componentWillUnmount() {
    ReactDOM.unmountComponentAtNode(this.container)
  }

  render() {
    return React.createElement('div')
  }

}
