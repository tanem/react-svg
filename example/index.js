import React from 'react'
import ReactDOM from 'react-dom'

import ReactSVG from '../src'

ReactDOM.render(
  <ReactSVG
    srcPath="atomic.svg"
    callback={svg => console.log(svg)}
    className="example"
  />,
  document.querySelector('.Root')
)
