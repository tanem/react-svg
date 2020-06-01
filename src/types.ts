import { BeforeEach, Errback, EvalScripts } from '@tanem/svg-injector'
import * as React from 'react'

interface BaseProps {
  [key: string]: unknown
  afterInjection?: Errback
  beforeInjection?: BeforeEach
  evalScripts?: EvalScripts
  fallback?: React.ReactType
  loading?: React.ReactType
  renumerateIRIElements?: boolean
  src: string
  wrapper?: 'div' | 'span'
}

export type WrapperType = HTMLSpanElement | HTMLDivElement

export type Props = BaseProps &
  React.DetailedHTMLProps<React.HTMLAttributes<WrapperType>, WrapperType>

export interface State {
  hasError: boolean
  isLoading: boolean
}
