import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

ReactDOM.render(
  <ReactSVG fallback={<img alt="doge" src="doge.png" />} src="notfound.svg" />,
  document.getElementById('root')
)
