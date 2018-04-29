import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from '../../src'

ReactDOM.render(
  <ReactSVG
    path="atomic.svg"
    onInjected={svg => {
      console.log('onInjected', svg)
    }}
    svgClassName="svg-class-name"
    className="wrapper-class-name"
    onClick={() => {
      console.log('wrapper onClick')
    }}
  />,
  document.querySelector('.Root')
)
