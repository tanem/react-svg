import React, { PureComponent, PropTypes } from 'react'
import SVGInjector from 'svg-injector'

export default class ReactSVG extends PureComponent {

  static defaultProps = {
    callback: () => {},
    className: '',
    evalScripts: 'once'
  }

  static propTypes = {
    callback: PropTypes.func,
    className: PropTypes.string,
    evalScripts: PropTypes.oneOf([ 'always', 'once', 'never' ]),
    srcPath: PropTypes.string.isRequired
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
      srcPath
    } = this.props

    return (
      <img
        ref={img => this._img = img}
        className={className}
        data-src={srcPath}
      />
    )

  }

}
