import React from 'react';
import ReactDOM from 'react-dom';

import ReactSVG from '../src';

ReactDOM.render(
  <ReactSVG
    path={'atomic.svg'}
    className={'example'}
    callback={(svg) => console.log(svg)}
  />,
  document.querySelector('.Root')
);
