import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from '../../src'

ReactDOM.render(
  <ReactSVG
    path="atomic.svg"
    callback={svg => {
      // eslint-disable-next-line no-console
      console.log(svg)
    }}
    className="class-name"
    wrapperClassName="wrapper-class-name"
  />,
  document.querySelector('.Root')
)
