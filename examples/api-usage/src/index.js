import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

ReactDOM.render(
  <ReactSVG
    // Required props.
    src="svg.svg"
    // Optional props.
    evalScripts="always"
    fallback={() => <span>Error!</span>}
    loading={() => <span>Loading</span>}
    onInjected={(error, svg) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(svg)
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
