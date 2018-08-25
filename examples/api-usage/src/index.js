import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

ReactDOM.render(
  <ReactSVG
    // Required props.
    src="svg.svg"
    // Optional props.
    evalScripts="always"
    onInjected={svg => {
      console.log('onInjected', svg)
    }}
    renumerateIRIElements={false}
    svgClassName="svg-class-name"
    svgStyle={{ width: 200 }}
    // Non-documented props.
    className="wrapper-class-name"
    onClick={() => {
      console.log('wrapper onClick')
    }}
  />,
  document.getElementById('root')
)
