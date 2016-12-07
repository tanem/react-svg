import React, { PureComponent, PropTypes } from 'react';
import SVGInjector from 'svg-injector';

export default class ReactSVG extends PureComponent {

  static defaultProps = {
    evalScripts: 'never',
    callback: () => {}
  };

  static propTypes = {
    path: PropTypes.string.isRequired,
    className: PropTypes.string,
    evalScripts: PropTypes.oneOf(['always', 'once', 'never']),
    fallbackPath: PropTypes.string,
    callback: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.updateSVG = this.updateSVG.bind(this);
  }

  render() {

    const {
      className,
      path,
      fallbackPath
    } = this.props;

    return (
      <div>
        <img
          className={className}
          data-src={path}
          data-fallback={fallbackPath}
          ref={this.updateSVG}
        />
      </div>
    );

  }

  updateSVG(img) {
    if(!img){
      // Ref is being unmounted, should we clean anything up? Probably.
      return;
    }

    const {
      evalScripts,
      callback: each
    } = this.props;

    SVGInjector(img, {
      evalScripts,
      each
    });

  }

}
