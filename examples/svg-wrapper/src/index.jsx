import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const svgContainer = document.getElementById('svg-root')
const svgRoot = createRoot(svgContainer)
svgRoot.render(<ReactSVG src="svg.svg" wrapper="svg" />)

const htmlContainer = document.getElementById('html-root')
const htmlRoot = createRoot(htmlContainer)
htmlRoot.render(<ReactSVG src="svg.svg" wrapper="svg" />)
