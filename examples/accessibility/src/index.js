import React from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <ReactSVG
    src="svg.svg"
    role="img"
    aria-label="Description of the overall image"
    beforeInjection={(svg) => {
      const desc = document.createElement('desc')
      desc.innerHTML = 'A description'
      svg.prepend(desc)

      const title = document.createElement('title')
      title.innerHTML = 'A title'
      svg.prepend(title)
    }}
  />,
  document.getElementById('root')
)
