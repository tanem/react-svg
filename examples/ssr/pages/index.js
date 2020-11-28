import ClipLoader from 'react-spinners/ClipLoader'
import { ReactSVG } from 'react-svg'

export default function Home() {
  // eslint-disable-next-line react/react-in-jsx-scope
  return <ReactSVG loading={() => <ClipLoader />} src="svg.svg" />
}
