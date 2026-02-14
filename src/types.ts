import type { BeforeEach, EvalScripts } from '@tanem/svg-injector'
import type * as React from 'react'

interface BaseProps {
  afterInjection?: (svg: SVGSVGElement) => void
  beforeInjection?: BeforeEach
  desc?: string
  evalScripts?: EvalScripts
  fallback?: React.ElementType
  httpRequestWithCredentials?: boolean
  loading?: React.ElementType
  onError?: (error: unknown) => void
  renumerateIRIElements?: boolean
  src: string
  title?: string
  useRequestCache?: boolean
  wrapper?: 'div' | 'span' | 'svg'
}

type HTMLWrapperType = HTMLSpanElement | HTMLDivElement
type SVGWrapperType = SVGSVGElement

export type WrapperType = HTMLWrapperType | SVGWrapperType

export type Props = BaseProps &
  Omit<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLWrapperType>,
      HTMLWrapperType
    >,
    'ref'
  > &
  Omit<React.SVGProps<SVGWrapperType>, 'ref'>

export interface State {
  hasError: boolean
  isLoading: boolean
}
