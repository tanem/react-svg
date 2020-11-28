import React from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <ReactSVG
    aria-label="Description of the overall image"
    beforeInjection={(svg) => {
      const desc = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'desc'
      )
      desc.innerHTML = 'A description'
      svg.prepend(desc)

      const title = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'title'
      )
      title.innerHTML = 'A title'
      svg.prepend(title)
    }}
    role="img"
    src="svg.svg"
  />,
  document.getElementById('root')
)
