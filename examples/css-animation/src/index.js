import React, { useState } from 'react'
import ReactDOM from 'react-dom'
import { ReactSVG } from 'react-svg'
import './style.css'

const C = () => {
  const [animate, setAnimate] = useState(false)

  return (
    <>
      <ReactSVG
        afterInjection={(_err, svg) => {
          if (animate) {
            svg.classList.add('is-clicked')
          }
        }}
        src="svg.svg"
      />
      <button
        onClick={() => {
          setAnimate(true)
        }}
      >
        Animate
      </button>
    </>
  )
}

ReactDOM.render(<C />, document.getElementById('root'))
