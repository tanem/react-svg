import { Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import ClipLoader from 'react-spinners/ClipLoader'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Fragment>
    <ReactSVG loading={() => <ClipLoader />} src="svg.svg" />
    <ReactSVG
      fallback={() => <img alt="doge" src="doge.png" />}
      loading={() => <ClipLoader />}
      src="notfound.svg"
    />
  </Fragment>,
)
