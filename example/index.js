import React from 'react';
import ReactDOM from 'react-dom';

import ReactSVG from '../lib';

ReactDOM.render(
  <ReactSVG
    path={'atomic.svg'}
    className={'example'}
    style={{height: '200px', width: '200px'}}
    callback={(svg) => console.log(svg)}
  />,
  document.querySelector('.Root')
);
