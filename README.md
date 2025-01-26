# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![build status](https://img.shields.io/github/actions/workflow/status/tanem/react-svg/ci.yml?style=flat-square)](https://github.com/tanem/react-svg/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/react-svg?style=flat-square)](https://bundlephobia.com/result?p=react-svg)

> A React component that injects SVG into the DOM.

[Background](#background) | [Basic Usage](#basic-usage) | [Live Examples](#live-examples) | [API](#api) | [Installation](#installation) | [FAQ](#faq) | [License](#license)

## Background

Let's say you have an SVG available at some URL, and you'd like to inject it into the DOM [for various reasons](https://github.com/tanem/svg-injector#background). This module does the heavy lifting for you by delegating the process to [@tanem/svg-injector](https://github.com/tanem/svg-injector), which makes an AJAX request for the SVG and then swaps in the SVG markup inline. The async loaded SVG is also cached, so multiple uses of an SVG only require a single server request.

## Basic Usage

```jsx
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<ReactSVG src="svg.svg" />)
```

## Live Examples

- Accessibility: [Source](https://github.com/tanem/react-svg/tree/master/examples/accessibility) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/accessibility)
- API Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/api-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/api-usage)
- Basic Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/basic-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/basic-usage)
- Before Injection: [Source](https://github.com/tanem/react-svg/tree/master/examples/before-injection) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/before-injection)
- CSS Animation: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-animation) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/css-animation)
- CSS-in-JS: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-in-js) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/css-in-js)
- External Stylesheet: [Source](https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/external-stylesheet)
- Fallbacks: [Source](https://github.com/tanem/react-svg/tree/master/examples/fallbacks) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/fallbacks)
- Iframe: [Source](https://github.com/tanem/react-svg/tree/master/examples/iframe) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/iframe)
- Loading: [Source](https://github.com/tanem/react-svg/tree/master/examples/loading) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/loading)
- No Extension: [Source](https://github.com/tanem/react-svg/tree/master/examples/no-extension) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/no-extension)
- SSR: [Source](https://github.com/tanem/react-svg/tree/master/examples/ssr) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/ssr)
- Styled Components: [Source](https://github.com/tanem/react-svg/tree/master/examples/styled-components) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/styled-components)
- SVG Wrapper: [Source](https://github.com/tanem/react-svg/tree/master/examples/svg-wrapper) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/svg-wrapper)
- Typescript: [Source](https://github.com/tanem/react-svg/tree/master/examples/typescript) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/typescript)
- UMD Build (Development): [Source](https://github.com/tanem/react-svg/tree/master/examples/umd-dev) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/umd-dev)
- UMD Build (Production): [Source](https://github.com/tanem/react-svg/tree/master/examples/umd-prod) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/umd-prod)

## API

**Props**

- `src` - The SVG URL.
- `afterInjection(svg)` - _Optional_ Function to call after the SVG is injected. `svg` is the injected SVG DOM element. If an error occurs during execution it will be routed to the `onError` callback, and if a `fallback` is specified it will be rendered. Defaults to `() => {}`.
- `beforeInjection(svg)` - _Optional_ Function to call just before the SVG is injected. `svg` is the SVG DOM element which is about to be injected. If an error occurs during execution it will be routed to the `onError` callback, and if a `fallback` is specified it will be rendered. Defaults to `() => {}`.
- `desc` - _Optional_ String used for SVG `<desc>` element content. If a `<desc>` exists it will be replaced, otherwise a new `<desc>` is created. Defaults to `''`, which is a noop.
- `evalScripts` - _Optional_ Run any script blocks found in the SVG. One of `'always'`, `'once'`, or `'never'`. Defaults to `'never'`.
- `fallback` - _Optional_ Fallback to use if an error occurs during injection, or if errors are thrown from the `beforeInjection` or `afterInjection` functions. Can be a string, class component, or function component. Defaults to `null`.
- `httpRequestWithCredentials` - _Optional_ Boolean indicating if cross-site Access-Control requests for the SVG should be made using credentials. Defaults to `false`.
- `loading` - _Optional_ Component to use during loading. Can be a string, class component, or function component. Defaults to `null`.
- `onError(error)` - _Optional_ Function to call if an error occurs during injection, or if errors are thrown from the `beforeInjection` or `afterInjection` functions. `error` is an `unknown` object. Defaults to `() => {}`.
- `renumerateIRIElements` - _Optional_ Boolean indicating if SVG IRI addressable elements should be renumerated. Defaults to `true`.
- `title` - _Optional_ String used for SVG `<title>` element content. If a `<title>` exists it will be replaced, otherwise a new `<title>` is created. Defaults to `''`, which is a noop.
- `useRequestCache` - _Optional_ Use SVG request cache. Defaults to `true`.
- `wrapper` - _Optional_ Wrapper element types. One of `'div'`, `'span'` or `'svg'`. Defaults to `'div'`.

Other non-documented properties are applied to the outermost wrapper element.

**Example**

```jsx
<ReactSVG
  afterInjection={(svg) => {
    console.log(svg)
  }}
  beforeInjection={(svg) => {
    svg.classList.add('svg-class-name')
    svg.setAttribute('style', 'width: 200px')
  }}
  className="wrapper-class-name"
  desc="Description"
  evalScripts="always"
  fallback={() => <span>Error!</span>}
  httpRequestWithCredentials={true}
  loading={() => <span>Loading</span>}
  onClick={() => {
    console.log('wrapper onClick')
  }}
  onError={(error) => {
    console.error(error)
  }}
  renumerateIRIElements={false}
  src="svg.svg"
  title="Title"
  useRequestCache={false}
  wrapper="span"
/>
```

## Installation

> ⚠️This library depends on [@tanem/svg-injector](https://github.com/tanem/svg-injector), which uses [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from). If you're targeting [browsers that don't support that method](https://kangax.github.io/compat-table/es6/#test-Array_static_methods), you'll need to ensure an appropriate polyfill is included manually. See [this issue comment](https://github.com/tanem/svg-injector/issues/97#issuecomment-483365473) for further detail.

```
$ npm install react-svg
```

UMD builds are also available for use with pre-React 19 via [unpkg](https://unpkg.com/):

- https://unpkg.com/react-svg/dist/react-svg.umd.development.js
- https://unpkg.com/react-svg/dist/react-svg.umd.production.js

For the non-minified development version, make sure you have already included:

- [`React`](https://unpkg.com/react@18/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom@18/umd/react-dom.development.js)
- [`PropTypes`](https://unpkg.com/prop-types/prop-types.js)

For the minified production version, make sure you have already included:

- [`React`](https://unpkg.com/react@18/umd/react.production.min.js)
- [`ReactDOM`](https://unpkg.com/react-dom@18/umd/react-dom.production.min.js)

## FAQ

<details>

<summary>
Why are there two wrapping elements?
</summary>

This module delegates it's core behaviour to [@tanem/svg-injector](https://github.com/tanem/svg-injector), which requires the presence of a parent node when swapping in the SVG element. The swapping in occurs outside of React flow, so we don't want React updates to conflict with the DOM nodes `@tanem/svg-injector` is managing.

Example output, assuming a `div` wrapper:

```html
<div> <!-- The wrapper, managed by React -->
  <div> <!-- The parent node, managed by @tanem/svg-injector -->
    <svg>...</svg> <!-- The swapped-in SVG, managed by @tanem/svg-injector -->
  </div>
</div>
```

See:

- [Integrating with Other Libraries](https://reactjs.org/docs/integrating-with-other-libraries.html).

Related issues and PRs:

- [#24](https://github.com/tanem/react-svg/issues/24).
- [#30](https://github.com/tanem/react-svg/issues/30).
- [#36](https://github.com/tanem/react-svg/pull/36).
- [#48](https://github.com/tanem/react-svg/issues/48).

</details>

## License

MIT
