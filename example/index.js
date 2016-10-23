import React from 'react';
import ReactDOM from 'react-dom';

import ReactSVG from '../lib';

ReactDOM.render(
  <ReactSVG
    path={'atomic.svg'}
    className={'example'}
    callback={(svg) => console.log(svg)}
  />,
  document.querySelector('.Root')
);
