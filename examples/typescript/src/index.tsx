import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<ReactSVG src="svg.svg" />)
