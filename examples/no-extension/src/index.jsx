import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<ReactSVG src="svg" />)
