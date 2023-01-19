import './style.css'

import { useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const C = () => {
  const [animate, setAnimate] = useState(false)

  return (
    <>
      <ReactSVG
        afterInjection={(svg) => {
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

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<C />)
