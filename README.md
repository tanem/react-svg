# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![build status](https://img.shields.io/github/actions/workflow/status/tanem/react-svg/ci.yml?style=flat-square)](https://github.com/tanem/react-svg/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/react-svg?style=flat-square)](https://bundlephobia.com/result?p=react-svg)

> A React component that injects SVG into the DOM.

[Background](#background) | [When To Use This](#when-to-use-this) | [Basic Usage](#basic-usage) | [Live Examples](#live-examples) | [API](#api) | [Installation](#installation) | [Security](#security) | [FAQ](#faq) | [Contributing](#contributing) | [License](#license)

## Background

This component uses [@tanem/svg-injector](https://github.com/tanem/svg-injector) to fetch an SVG from a given URL and inject its markup into the DOM ([why?](https://github.com/tanem/svg-injector#background)). Fetched SVGs are cached, so multiple uses of the same SVG only require a single request.

## When To Use This

Injection costs a network request and two wrapper elements, and it earns that cost in one case: the SVG's URL isn't known until the app runs, and the markup has to be reachable by CSS. An `<img>` tag renders an SVG but its contents can't be styled, animated or scripted from the page.

- **SVGs live in your repo and are known at build time.** Reach for a build-time transform - [SVGR](https://react-svgr.com), [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr), or your bundler's SVG loader. They compile each file to a React component, so there's no runtime fetch, and unused icons are tree-shaken out.
- **The URL is only known at runtime.** SVGs from a CMS or an API, user uploads, a CDN-hosted icon set, or a path assembled from data. That's what this component is for.
- **You only need to display the image.** Use `<img src="icon.svg">`. It's cheaper than either option above.

## Basic Usage

```jsx
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<ReactSVG src="svg.svg" />)
```

## Live Examples

- Accessibility: [Source](https://github.com/tanem/react-svg/tree/master/examples/accessibility) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/accessibility)
- API Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/api-usage) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/api-usage)
- Basic Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/basic-usage) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/basic-usage)
- Before Injection: [Source](https://github.com/tanem/react-svg/tree/master/examples/before-injection) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/before-injection)
- CSS Animation: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-animation) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/css-animation)
- CSS-in-JS: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-in-js) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/css-in-js)
- Data URL: [Source](https://github.com/tanem/react-svg/tree/master/examples/data-url) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/data-url)
- External Stylesheet: [Source](https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/external-stylesheet)
- Fallbacks: [Source](https://github.com/tanem/react-svg/tree/master/examples/fallbacks) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/fallbacks)
- Iframe: [Source](https://github.com/tanem/react-svg/tree/master/examples/iframe) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/iframe)
- Loading: [Source](https://github.com/tanem/react-svg/tree/master/examples/loading) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/loading)
- No Extension: [Source](https://github.com/tanem/react-svg/tree/master/examples/no-extension) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/no-extension)
- Sprite Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/sprite-usage) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/sprite-usage)
- SSR: [Source](https://github.com/tanem/react-svg/tree/master/examples/ssr) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/ssr)
- Styled Components: [Source](https://github.com/tanem/react-svg/tree/master/examples/styled-components) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/styled-components)
- SVG Wrapper: [Source](https://github.com/tanem/react-svg/tree/master/examples/svg-wrapper) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/svg-wrapper)
- Typescript: [Source](https://github.com/tanem/react-svg/tree/master/examples/typescript) | [Sandbox](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/typescript)

## API

**Props**

- `src` - The SVG URL. Supports fetchable URLs (relative or absolute), `data:image/svg+xml` URLs (URL-encoded or base64), and SVG sprite sheets via fragment identifiers (e.g. `sprite.svg#icon-star`). See the [data URL example](https://github.com/tanem/react-svg/tree/master/examples/data-url) and [sprite usage example](https://github.com/tanem/react-svg/tree/master/examples/sprite-usage).
- `afterInjection(svg)` - _Optional_ Function to call after the SVG is injected. `svg` is the injected SVG DOM element. If an error occurs during execution it will be routed to the `onError` callback, and if a `fallback` is specified it will be rendered. Defaults to `() => {}`.
- `beforeInjection(svg)` - _Optional_ Function to call just before the SVG is injected. `svg` is the SVG DOM element which is about to be injected. If an error occurs during execution it will be routed to the `onError` callback, and if a `fallback` is specified it will be rendered. Defaults to `() => {}`.
- `desc` - _Optional_ String used for SVG `<desc>` element content. If a `<desc>` exists it will be replaced, otherwise a new `<desc>` is created. When set, a unique `id` is added to the `<desc>` element and `aria-describedby` is set on the SVG for assistive technology. Defaults to `''`, which is a noop.
- `evalScripts` - _Optional_ Run any script blocks found in the SVG. One of `'always'`, `'once'`, or `'never'`. Defaults to `'never'`.
- `fallback` - _Optional_ Fallback to use if an error occurs during injection, or if errors are thrown from the `beforeInjection` or `afterInjection` functions. Can be a string, class component, or function component. Defaults to `null`.
- `httpRequestWithCredentials` - _Optional_ Boolean indicating if cross-site Access-Control requests for the SVG should be made using credentials. Defaults to `false`.
- `loading` - _Optional_ Component to use during loading. Can be a string, class component, or function component. Defaults to `null`.
- `onError(error)` - _Optional_ Function to call if an error occurs during injection, or if errors are thrown from the `beforeInjection` or `afterInjection` functions. `error` is an `unknown` object. Defaults to `() => {}`.
- `renumerateIRIElements` - _Optional_ Boolean indicating if SVG IRI addressable elements should be renumerated. Defaults to `true`. When enabled, IDs on IRI-addressable elements (`clipPath`, `linearGradient`, `mask`, `path`, etc.) are made unique, and all references to them (presentation attributes, `href`/`xlink:href`, inline `style` attributes, and `<style>` element text) are updated. Note: all matching element types are renumerated, not only those inside `<defs>`. Set to `false` if you need to query injected elements by their original IDs.
- `title` - _Optional_ String used for SVG `<title>` element content. If a `<title>` exists it will be replaced, otherwise a new `<title>` is created. When set, a unique `id` is added to the `<title>` element and `aria-labelledby` is set on the SVG for assistive technology. Defaults to `''`, which is a noop.
- `useRequestCache` - _Optional_ Use SVG request cache. Defaults to `true`.
- `wrapper` - _Optional_ Wrapper element types. One of `'div'`, `'span'` or `'svg'`. Defaults to `'div'`.

Other non-documented properties are applied to the outermost wrapper element.

A `ref` is forwarded to the outermost wrapper element, so `ref.current` is an `HTMLDivElement`, `HTMLSpanElement` or `SVGSVGElement` depending on `wrapper`. The exported `WrapperType` type covers all three.

Re-injection happens when `src`, `wrapper`, `title`, `desc`, `evalScripts`, `httpRequestWithCredentials`, `renumerateIRIElements` or `useRequestCache` changes. Other props don't affect the injected SVG, so changing them re-renders the wrapper without re-fetching. `afterInjection`, `beforeInjection` and `onError` are always called in their latest form, but changing them doesn't trigger a re-injection on its own, so they can be passed inline.

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

```
$ npm install react-svg
```

Requires React 16.8 or later, as a peer dependency.

## Security

Injected markup becomes part of your page, with the same privileges as anything else in it. That matters whenever `src` points at something you don't fully control - user uploads, a third-party host, a CMS anyone can write to. An SVG is an XML document that can carry scripts, event handlers and styles, not just shapes.

**Scripts are off by default.** `evalScripts` defaults to `'never'`, so `<script>` blocks inside a fetched SVG are not executed. Leave it that way for anything untrusted - `'always'` and `'once'` run whatever the file happens to contain.

**Scripts aren't the only vector.** Event-handler attributes such as `onload` and `onclick`, and `href="javascript:..."` on `<a>` elements, are inert to `evalScripts` but live once injected. For untrusted sources, sanitise the SVG element in `beforeInjection`, which runs after the fetch and before the element reaches the DOM:

```jsx
import DOMPurify from 'dompurify'
import { ReactSVG } from 'react-svg'

const Icon = ({ src }) => (
  <ReactSVG
    beforeInjection={(svg) => {
      DOMPurify.sanitize(svg, { IN_PLACE: true })
    }}
    src={src}
  />
)
```

Sanitising the URL matters too. A `javascript:` or `data:text/html` value in `src` should never reach this component; validate the URL's scheme and origin before passing it in.

**Injected content isn't isolated.** A `<style>` element inside an SVG applies to the whole page, so a fetched file can restyle your app through a generic class name like `.cls-1`, and the last SVG injected wins ([#2077](https://github.com/tanem/react-svg/issues/2077)). DOMPurify keeps `<style>` elements, so sanitising doesn't address this. Remove or rewrite them in `beforeInjection` if the SVGs aren't yours. Note that `renumerateIRIElements` (on by default) makes `id` attributes unique, but does nothing for class names.

## FAQ

<details>

<summary>
Why are there two wrapping elements?
</summary>

This module delegates its core behaviour to [@tanem/svg-injector](https://github.com/tanem/svg-injector), which requires a parent node when swapping in the SVG element. The swap occurs outside of React flow, so we don't want React updates to conflict with the DOM nodes `@tanem/svg-injector` is managing.

Example output, assuming a `div` wrapper:

```html
<div> <!-- The wrapper, managed by React -->
  <div> <!-- The parent node, managed by @tanem/svg-injector -->
    <svg>...</svg> <!-- The swapped-in SVG, managed by @tanem/svg-injector -->
  </div>
</div>
```

See:

- [Integrating with Other Libraries](https://legacy.reactjs.org/docs/integrating-with-other-libraries.html).

Related issues and PRs:

- [#24](https://github.com/tanem/react-svg/issues/24).
- [#30](https://github.com/tanem/react-svg/issues/30).
- [#36](https://github.com/tanem/react-svg/pull/36).
- [#48](https://github.com/tanem/react-svg/issues/48).

</details>

<details>

<summary>
Can I use data URIs or inline SVG strings?
</summary>

`data:image/svg+xml` URLs are supported (both URL-encoded and base64-encoded). The underlying library parses the SVG content directly from the data URL using `DOMParser`, without making a network request. This is useful when bundlers like Vite inline small SVGs as data URIs. See the [data URL example](https://github.com/tanem/react-svg/tree/master/examples/data-url) for details.

Inline SVG strings (raw markup passed directly as the `src` prop) are **not** supported. If you already have the SVG markup as a string (for example, a dynamically generated chart), consider parsing it with `DOMParser` and appending the result yourself, or rendering it with `dangerouslySetInnerHTML`. These approaches avoid the fetch step entirely and will also avoid the brief flash that occurs when `react-svg` re-injects on `src` change.

**Security note:** inserting SVG strings into the DOM bypasses React's built-in escaping and can expose your application to XSS if the content is not trusted. If the SVG originates from user input or a third party, sanitise it first with a library like [DOMPurify](https://github.com/cure53/DOMPurify) before inserting it into the page. The same applies to fetched SVGs - see [Security](#security).

</details>

## Contributing

Repo conventions that aren't visible in the code - the PR labels that drive releases, the React version matrix policy, and how the `examples/` dependencies are pinned - live in [AGENTS.md](AGENTS.md). Coding agents read it from the repo root, so keep it in sync when a change invalidates something it states.

## License

MIT
