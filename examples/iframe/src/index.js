import { createRoot } from 'react-dom/client'
import Frame from 'react-frame-component'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Frame>
    <ReactSVG src="svg.svg" />
  </Frame>,
)
