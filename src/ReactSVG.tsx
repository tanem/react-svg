import { SVGInjector } from '@tanem/svg-injector'
import * as React from 'react'

import ownerWindow from './owner-window'
import type { Props, WrapperType } from './types'

const svgNamespace = 'http://www.w3.org/2000/svg'
const xlinkNamespace = 'http://www.w3.org/1999/xlink'

// Random prefix avoids ID collisions when multiple copies of react-svg are
// bundled (e.g. microfrontends). The counter ensures each component instance
// within the same bundle gets a unique ID.
const idPrefix = `react-svg-${Math.random().toString(36).slice(2, 6)}`
let idCounter = 0

// forwardRef is still required: function components only accept a `ref` prop
// directly from React 19 onwards, and the supported floor is React 16.8.
//
// The type annotation keeps declaration emit from inlining the interfaces
// `Props` is built from, which aren't exported.
// eslint-disable-next-line @eslint-react/no-forward-ref
export const ReactSVG: React.ForwardRefExoticComponent<
  Props & React.RefAttributes<WrapperType>
> = React.forwardRef<WrapperType, Props>(
  (
    {
      afterInjection = () => undefined,
      beforeInjection = () => undefined,
      desc = '',
      evalScripts = 'never',
      fallback: Fallback,
      httpRequestWithCredentials = false,
      loading: Loading,
      onError = () => undefined,
      renumerateIRIElements = true,
      src,
      title = '',
      useRequestCache = true,
      wrapper = 'div',
      ...rest
    },
    forwardedRef,
  ) => {
    const [hasError, setHasError] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(true)

    const reactWrapperRef = React.useRef<WrapperType | null>(null)

    // The callbacks are read through a ref so that changing them - which inline
    // arrow props do on every render - doesn't tear down and re-run the
    // injection. Declared before the injection effect so it always holds the
    // current props by the time that effect runs.
    const callbacksRef = React.useRef({
      afterInjection,
      beforeInjection,
      onError,
    })
    React.useEffect(() => {
      callbacksRef.current = { afterInjection, beforeInjection, onError }
    })

    const refCallback = React.useCallback(
      (reactWrapper: WrapperType | null) => {
        reactWrapperRef.current = reactWrapper
        if (typeof forwardedRef === 'function') {
          forwardedRef(reactWrapper)
        } else if (forwardedRef) {
          forwardedRef.current = reactWrapper
        }
      },
      [forwardedRef],
    )

    // Only props that affect the injected SVG are listed as dependencies. Props
    // spread onto the React wrapper (className, style, event handlers, ...) are
    // applied by React itself and don't warrant a re-injection.
    React.useEffect(() => {
      const reactWrapper = reactWrapperRef.current

      /* istanbul ignore next */
      if (!(reactWrapper instanceof ownerWindow(reactWrapper).Node)) {
        return
      }

      // Guards against a teardown - unmount, or a dependency change that starts
      // a fresh injection - landing while the previous injection is still in
      // flight. The stale callbacks must not touch state, but errors are still
      // reported.
      let isActive = true
      let nonReactWrapper: WrapperType | null = null

      const removeSVG = () => {
        if (nonReactWrapper?.parentNode) {
          nonReactWrapper.parentNode.removeChild(nonReactWrapper)
          nonReactWrapper = null
        }
      }

      // A new injection is starting, so any result from the previous one is
      // stale. On mount both values already hold these defaults and React bails
      // out, so this only re-renders when a dependency actually changed.
      /* eslint-disable @eslint-react/set-state-in-effect */
      setHasError(false)
      setIsLoading(true)
      /* eslint-enable @eslint-react/set-state-in-effect */

      let nonReactTarget: WrapperType

      if (wrapper === 'svg') {
        nonReactWrapper = document.createElementNS(svgNamespace, wrapper)
        nonReactWrapper.setAttribute('xmlns', svgNamespace)
        nonReactWrapper.setAttribute('xmlns:xlink', xlinkNamespace)
        nonReactTarget = document.createElementNS(svgNamespace, wrapper)
      } else {
        nonReactWrapper = document.createElement(wrapper)
        nonReactTarget = document.createElement(wrapper)
      }

      nonReactWrapper.appendChild(nonReactTarget)
      nonReactTarget.dataset.src = src

      reactWrapper.appendChild(nonReactWrapper)

      const handleError = (error: unknown) => {
        removeSVG()
        if (isActive) {
          setHasError(true)
          setIsLoading(false)
        }
        callbacksRef.current.onError(error)
      }

      const afterEach = (error: Error | null, svg?: SVGSVGElement) => {
        if (error) {
          handleError(error)
          return
        }

        if (!isActive) {
          return
        }

        setIsLoading(false)

        try {
          callbacksRef.current.afterInjection(svg!)
        } catch (afterInjectionError) {
          handleError(afterInjectionError)
        }
      }

      // WAI best practice: SVGs need role="img" plus aria-labelledby/
      // aria-describedby pointing to <title>/<desc> element IDs for screen
      // readers to announce them. svg-injector copies the HTML title
      // *attribute* (tooltip) but doesn't create SVG-namespace child
      // elements or ARIA linkage, so we handle that here.
      const beforeEach = (svg: SVGSVGElement): void => {
        svg.setAttribute('role', 'img')

        const ariaLabelledBy: string[] = []
        const ariaDescribedBy: string[] = []

        if (title) {
          const originalTitle = svg.querySelector(':scope > title')
          if (originalTitle) {
            svg.removeChild(originalTitle)
          }
          const titleId = `${idPrefix}-title-${++idCounter}`
          // createElementNS is required: createElement would produce an
          // HTML-namespace node that screen readers ignore inside SVG.
          const newTitle = document.createElementNS(svgNamespace, 'title')
          newTitle.id = titleId
          newTitle.textContent = title
          svg.prepend(newTitle)
          ariaLabelledBy.push(titleId)
        }

        if (desc) {
          const originalDesc = svg.querySelector(':scope > desc')
          if (originalDesc) {
            svg.removeChild(originalDesc)
          }
          const descId = `${idPrefix}-desc-${++idCounter}`
          const newDesc = document.createElementNS(svgNamespace, 'desc')
          newDesc.id = descId
          newDesc.textContent = desc
          const existingTitle = svg.querySelector(':scope > title')
          if (existingTitle) {
            existingTitle.after(newDesc)
          } else {
            svg.prepend(newDesc)
          }
          ariaDescribedBy.push(descId)
        }

        if (ariaLabelledBy.length > 0) {
          svg.setAttribute('aria-labelledby', ariaLabelledBy.join(' '))
        }

        if (ariaDescribedBy.length > 0) {
          svg.setAttribute('aria-describedby', ariaDescribedBy.join(' '))
        }

        try {
          callbacksRef.current.beforeInjection(svg)
        } catch (error) {
          handleError(error)
        }
      }

      SVGInjector(nonReactTarget, {
        afterEach,
        beforeEach,
        cacheRequests: useRequestCache,
        evalScripts,
        httpRequestWithCredentials,
        renumerateIRIElements,
      })

      return () => {
        isActive = false
        removeSVG()
      }
    }, [
      desc,
      evalScripts,
      httpRequestWithCredentials,
      renumerateIRIElements,
      src,
      title,
      useRequestCache,
      wrapper,
    ])

    const Wrapper = wrapper

    return (
      <Wrapper
        {...rest}
        ref={refCallback}
        {...(wrapper === 'svg'
          ? {
              xmlns: svgNamespace,
              xmlnsXlink: xlinkNamespace,
            }
          : {})}
      >
        {isLoading && Loading && <Loading />}
        {hasError && Fallback && <Fallback />}
      </Wrapper>
    )
  },
)

ReactSVG.displayName = 'ReactSVG'
