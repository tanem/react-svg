import React from 'react';
import ReactDOM from 'react-dom';

import ReactSVG from '../src/index.js';

ReactDOM.render(
  <ReactSVG
    path={'atomic.svg'}
    className={'example'}
    callback={(svg) => console.log(svg)}
  />,
  document.querySelector('.Root')
);
