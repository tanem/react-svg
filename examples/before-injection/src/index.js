import React from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <ReactSVG
    src="svg.svg"
    beforeInjection={svg => {
      // Add a class name to the SVG element. Note: You'll need a classList
      // polyfill if you're using this in older browsers.
      svg.classList.add('svg-class-name')

      // Add inline style to the SVG element.
      svg.setAttribute('style', 'width: 200px')

      // Modify the first `g` element within the SVG.
      const [firstGElement] = [...svg.querySelectorAll('g')]
      firstGElement.setAttribute('fill', 'blue')
    }}
  />,
  document.getElementById('root')
)
