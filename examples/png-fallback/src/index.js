import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

// Pretend the browser doesn't have SVG support so that SVGInjector will use
// the png fallback.
document.implementation.hasFeature = () => false

ReactDOM.render(
  <ReactSVG pngFallback="png.png" src="svg.svg" />,
  document.getElementById('root')
)
