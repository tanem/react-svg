import React from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <ReactSVG
    src="svg.svg"
    afterInjection={(error, svg) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(svg)
    }}
    beforeInjection={svg => {
      svg.classList.add('svg-class-name')
      svg.setAttribute('style', 'width: 200px')
    }}
    evalScripts="always"
    fallback={() => <span>Error!</span>}
    loading={() => <span>Loading</span>}
    renumerateIRIElements={false}
    wrapper="span"
    className="wrapper-class-name"
    onClick={() => {
      console.log('wrapper onClick')
    }}
  />,
  document.getElementById('root')
)
