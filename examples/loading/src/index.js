import React from 'react'
import ReactDOM from 'react-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import { ReactSVG } from 'react-svg'

ReactDOM.render(
  <React.Fragment>
    <ReactSVG loading={() => <ClipLoader />} src="svg.svg" />
    <ReactSVG
      fallback={() => <img alt="doge" src="doge.png" />}
      loading={() => <ClipLoader />}
      src="notfound.svg"
    />
  </React.Fragment>,
  document.getElementById('root')
)
