import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

const Fallback = () => <img alt="doge" src="doge.png" />

ReactDOM.render(
  <ReactSVG fallback={Fallback} src="notfound.svg" />,
  document.getElementById('root')
)
