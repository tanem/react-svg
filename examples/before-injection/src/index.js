import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <ReactSVG
    beforeInjection={(svg) => {
      // Add a class name to the SVG element. Note: You'll need a classList
      // polyfill if you're using this in older browsers.
      svg.classList.add('svg-class-name')

      // Add inline style to the SVG element.
      svg.setAttribute('style', 'width: 200px')

      // Modify the first `g` element within the SVG.
      const [firstGElement] = [...svg.querySelectorAll('g')]
      firstGElement.setAttribute('fill', 'blue')
    }}
    src="svg.svg"
  />,
)
