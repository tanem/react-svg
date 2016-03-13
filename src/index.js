import React, { Component } from 'react';
import SVGInjector from 'svg-injector';

const svgConfig = ({ evalScripts, callback }) => ({
  evalScripts: evalScripts || 'never',
  each: callback || null
});

export default class ReactSVG extends Component {
  render() {
    const {
      className,
      path,
      fallbackPath
    } = this.props;

    return (
      <img
        className={className}
        data-src={path}
        data-fallback={fallbackPath}
        ref={(img) => this._img = img}
      />
    );
  }

  componentDidMount() {
    return SVGInjector([this._img], svgConfig(this.props));
  }
}
