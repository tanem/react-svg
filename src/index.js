import React, { Component, PropTypes } from 'react';
import SVGInjector from 'svg-injector';

export default class ReactSVG extends Component {

  static defaultProps = {
    evalScripts: 'never',
    callback: () => {}
  }

  static propTypes = {
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    fallbackPath: PropTypes.string,
    callback: PropTypes.func
  }

  render() {

    const {
      className,
      path,
      style,
      fallbackPath
    } = this.props;

    return (
      <img
        className={className}
        data-src={path}
        style={style}
        data-fallback={fallbackPath}
        ref={(img) => this._img = img}
      />
    );

  }

  componentDidMount() {
    this.updateSVG();
  }

  componentDidUpdate() {
    this.updateSVG();
  }

  updateSVG() {

    const {
      evalScripts,
      callback: each
    } = this.props;

    SVGInjector(this._img, {
      evalScripts,
      each
    });

  }

}
