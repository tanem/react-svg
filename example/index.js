import React from 'react';
import ReactDOM from 'react-dom';

import ReactSVG from '../lib';

var styles = {
  height: '100px',
  width: '100px'
}

ReactDOM.render(
  <ReactSVG
    path={'atomic.svg'}
    className={'example'}
    style={styles}
    callback={(svg) => console.log(svg)}
  />,
  document.querySelector('.Root')
);
