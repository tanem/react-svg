'use client'

import ClipLoader from 'react-spinners/ClipLoader'
import { ReactSVG } from 'react-svg'

export default function Home() {
  return <ReactSVG loading={() => <ClipLoader />} src="svg.svg" />
}
