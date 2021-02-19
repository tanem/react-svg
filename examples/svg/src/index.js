import React from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <ReactSVG src="svg.svg" wrapper="svg" />,
  document.getElementById('svg-root')
)
ReactDOM.render(
  <ReactSVG src="svg.svg" wrapper="svg" />,
  document.getElementById('html-root')
)
