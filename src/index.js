import React, { PureComponent, PropTypes } from 'react'
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

  injectSVG() {
    const {
      evalScripts,
      callback: each
    } = this.props

    if (this._img) {
      SVGInjector(this._img, {
        evalScripts,
        each
      })
    }
  }

  componentDidMount() {
    this.injectSVG()
  }

  componentDidUpdate() {
    this.injectSVG()
  }

  render() {
    const {
      className,
      path,
      style
    } = this.props

    return (
      <div>
        <img
          ref={img => this._img = img}
          className={className}
          data-src={path}
          style={style}
        />
      </div>
    )

  }

}
