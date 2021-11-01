import React from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <ReactSVG
    afterInjection={(error, svg) => {
      if (error) {
        console.error(error)
        return
      }
      console.log(svg)
    }}
    beforeInjection={(svg) => {
      svg.classList.add('svg-class-name')
      svg.setAttribute('style', 'width: 200px')
    }}
    className="wrapper-class-name"
    evalScripts="always"
    fallback={() => <span>Error!</span>}
    httpRequestWithCredentials={true}
    loading={() => <span>Loading</span>}
    onClick={() => {
      console.log('wrapper onClick')
    }}
    renumerateIRIElements={false}
    src="svg.svg"
    useRequestCache={false}
    wrapper="span"
  />,
  document.getElementById('root')
)
