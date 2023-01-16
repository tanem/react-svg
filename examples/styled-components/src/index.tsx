// Based on: https://github.com/tanem/react-svg/issues/1911.

import { FC } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'
import styled from 'styled-components'

interface SVGProps {
  $filled?: boolean
}

const SVG = styled(ReactSVG)<SVGProps>`
  & div svg g path {
    fill: ${(props) => (props.$filled ? 'currentColor' : 'none')};
  }
`

interface IconProps {
  src: string
  filled?: boolean
}

const Icon: FC<IconProps> = ({ src, filled, ...props }) => {
  return (
    <SVG
      $filled={filled}
      afterInjection={(error) => {
        if (error) {
          console.error('Error injecting svg icon', error)
        }
      }}
      beforeInjection={(svg) => {
        if (svg.getElementsByTagName('title').length > 0) {
          svg.removeChild(svg.getElementsByTagName('title')[0])
        }
      }}
      src={src}
      {...props}
    />
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<Icon src="svg.svg" />)
