# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![build status](https://img.shields.io/github/actions/workflow/status/tanem/react-svg/ci.yml?style=flat-square)](https://github.com/tanem/react-svg/actions?query=workflow%3ACI)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/react-svg?style=flat-square)](https://bundlephobia.com/result?p=react-svg)

> A React component that injects SVG into the DOM.

[When To Use This](#when-to-use-this) | [Basic Usage](#basic-usage) | [API](#api) | [Live Examples](#live-examples) | [Installation](#installation) | [Security](#security) | [FAQ](#faq) | [Contributing](#contributing) | [License](#license)

## When To Use This

This component uses [@tanem/svg-injector](https://github.com/tanem/svg-injector) to fetch an SVG from a given URL and inject its markup into the DOM ([why?](https://github.com/tanem/svg-injector#background)). Fetched SVGs are cached, so multiple uses of the same SVG only require a single request.

Injection costs a network request and two wrapper elements, and it earns that cost in one case: the SVG's URL isn't known until the app runs, and the markup has to be reachable by CSS. An `<img>` tag renders an SVG but its contents can't be styled, animated or scripted from the page.

- **SVGs live in your repo and are known at build time.** Reach for a build-time transform - [SVGR](https://react-svgr.com), [vite-plugin-svgr](https://github.com/pd4d10/vite-plugin-svgr), or your bundler's SVG loader. They compile each file to a React component, so there's no runtime fetch, and unused icons are tree-shaken out.
- **The URL is only known at runtime.** SVGs from a CMS or an API, user uploads, a CDN-hosted icon set, or a path assembled from data. That's what this component is for.
- **You only need to display the image.** Use `<img src="icon.svg">`. It's cheaper than either option above.

## Basic Usage

```jsx
import { ReactSVG } from 'react-svg'

const App = () => <ReactSVG src="svg.svg" />
```

## API

### Props

| Prop                                                        | Type                            | Default    |
| ----------------------------------------------------------- | ------------------------------- | ---------- |
| [`src`](#src)                                               | `string`                        | _required_ |
| [`afterInjection`](#afterinjection)                         | `(svg: SVGSVGElement) => void`  | noop       |
| [`beforeInjection`](#beforeinjection)                       | `(svg: SVGSVGElement) => void`  | noop       |
| [`desc`](#desc)                                             | `string`                        | `''`       |
| [`evalScripts`](#evalscripts)                               | `'always' \| 'once' \| 'never'` | `'never'`  |
| [`fallback`](#fallback)                                     | `React.ElementType`             | none       |
| [`httpRequestWithCredentials`](#httprequestwithcredentials) | `boolean`                       | `false`    |
| [`loading`](#loading)                                       | `React.ElementType`             | none       |
| [`loadingDelay`](#loadingdelay)                             | `number`                        | `0`        |
| [`onError`](#onerror)                                       | `(error: unknown) => void`      | noop       |
| [`renumerateIRIElements`](#renumerateirielements)           | `boolean`                       | `true`     |
| [`title`](#title)                                           | `string`                        | `''`       |
| [`useRequestCache`](#userequestcache)                       | `boolean`                       | `true`     |
| [`wrapper`](#wrapper)                                       | `'div' \| 'span' \| 'svg'`      | `'div'`    |

Errors thrown from `beforeInjection` and `afterInjection` are routed to `onError` and render the `fallback`, the same as an error raised by the injection itself.

#### `src`

The SVG URL. Supports fetchable URLs (relative or absolute), `data:image/svg+xml` URLs (URL-encoded or base64), and SVG sprite sheets via fragment identifiers (e.g. `sprite.svg#icon-star`). See the [data URL example](https://github.com/tanem/react-svg/tree/master/examples/data-url) and [sprite usage example](https://github.com/tanem/react-svg/tree/master/examples/sprite-usage).

#### `afterInjection`

Called after the SVG is injected. `svg` is the injected SVG DOM element.

#### `beforeInjection`

Called just before the SVG is injected. `svg` is the SVG DOM element which is about to be injected, so this is where to restyle, class or sanitise it - see [Security](#security).

#### `desc`

String used for the SVG `<desc>` element content. If a `<desc>` exists it is replaced, otherwise a new one is created. When set, a unique `id` is added to the `<desc>` element and `aria-describedby` is set on the SVG for assistive technology. An empty string is a noop.

#### `evalScripts`

Whether to run script blocks found in the SVG: `'always'`, `'once'` or `'never'`. Leave it at `'never'` for SVGs you don't control - see [Security](#security).

#### `fallback`

Rendered inside the wrapper if an error occurs. Can be a string, class component or function component. Nothing is rendered in its place when unset.

#### `httpRequestWithCredentials`

Whether cross-site Access-Control requests for the SVG are made using credentials.

#### `loading`

Rendered inside the wrapper until the SVG is injected. Can be a string, class component or function component. Nothing is rendered in its place when unset.

#### `loadingDelay`

Milliseconds to wait before rendering `loading`. At the default `0` it renders immediately. Set a value and an injection that finishes sooner - a warm request cache, a localhost or `file://` read, a warm CDN edge - never renders `loading` at all.

Use it when `loading` is a spinner, where a sub-second appearance is worse than none: the user can't tell what flashed. Leave it at `0` when `loading` is a skeleton sized to hold the SVG's space, because delaying that trades one layout shift for two.

200-300ms is the usual industry choice. The delay applies to `loading` only - `fallback` always renders as soon as the error arrives, since an error costs a round trip that no cache short-circuits.

#### `onError`

Called if an error occurs. `error` is an `unknown` value.

#### `renumerateIRIElements`

Whether SVG IRI addressable elements are renumerated. When enabled, IDs on IRI-addressable elements (`clipPath`, `linearGradient`, `mask`, `path`, etc.) are made unique, and all references to them (presentation attributes, `href`/`xlink:href`, inline `style` attributes, and `<style>` element text) are updated. All matching element types are renumerated, not only those inside `<defs>`. Set to `false` if you need to query injected elements by their original IDs.

#### `title`

String used for the SVG `<title>` element content. If a `<title>` exists it is replaced, otherwise a new one is created. When set, a unique `id` is added to the `<title>` element and `aria-labelledby` is set on the SVG for assistive technology. An empty string is a noop.

#### `useRequestCache`

Whether the SVG request cache is used. With it on, repeated uses of the same URL share a single request.

#### `wrapper`

The element type used for the wrappers: `'div'`, `'span'` or `'svg'`.

### Other props

Props not listed above are applied to the outermost wrapper element, so `className`, `style`, `id`, `data-*` attributes and DOM event handlers behave as they would on the underlying element.

### Ref forwarding

A `ref` is forwarded to the outermost wrapper element, so `ref.current` is an `HTMLDivElement`, `HTMLSpanElement` or `SVGSVGElement` depending on `wrapper`. The exported `WrapperType` type covers all three.

### Re-injection

Re-injection happens when `src`, `wrapper`, `title`, `desc`, `evalScripts`, `httpRequestWithCredentials`, `renumerateIRIElements` or `useRequestCache` changes. Other props don't affect the injected SVG, so changing them re-renders the wrapper without re-fetching. `afterInjection`, `beforeInjection` and `onError` are always called in their latest form, but changing them doesn't trigger a re-injection on its own, so they can be passed inline.

### Example

```jsx
<ReactSVG
  beforeInjection={(svg) => {
    svg.classList.add('svg-class-name')
    svg.setAttribute('style', 'width: 200px')
  }}
  className="wrapper-class-name"
  desc="Description"
  fallback={() => <span>Error!</span>}
  loading={() => <span>Loading</span>}
  onClick={() => {
    console.log('wrapper onClick')
  }}
  onError={(error) => {
    console.error(error)
  }}
  src="svg.svg"
  title="Title"
  wrapper="span"
/>
```

## Live Examples

Each name links to the example source, and the sandbox column opens it on CodeSandbox.

| Example                                                                                            | Sandbox                                                                                                 |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [Accessibility](https://github.com/tanem/react-svg/tree/master/examples/accessibility)             | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/accessibility)       |
| [API Usage](https://github.com/tanem/react-svg/tree/master/examples/api-usage)                     | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/api-usage)           |
| [Basic Usage](https://github.com/tanem/react-svg/tree/master/examples/basic-usage)                 | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/basic-usage)         |
| [Before Injection](https://github.com/tanem/react-svg/tree/master/examples/before-injection)       | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/before-injection)    |
| [CSS Animation](https://github.com/tanem/react-svg/tree/master/examples/css-animation)             | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/css-animation)       |
| [CSS-in-JS](https://github.com/tanem/react-svg/tree/master/examples/css-in-js)                     | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/css-in-js)           |
| [Data URL](https://github.com/tanem/react-svg/tree/master/examples/data-url)                       | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/data-url)            |
| [External Stylesheet](https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet) | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/external-stylesheet) |
| [Fallbacks](https://github.com/tanem/react-svg/tree/master/examples/fallbacks)                     | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/fallbacks)           |
| [Iframe](https://github.com/tanem/react-svg/tree/master/examples/iframe)                           | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/iframe)              |
| [Loading](https://github.com/tanem/react-svg/tree/master/examples/loading)                         | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/loading)             |
| [No Extension](https://github.com/tanem/react-svg/tree/master/examples/no-extension)               | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/no-extension)        |
| [Sprite Usage](https://github.com/tanem/react-svg/tree/master/examples/sprite-usage)               | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/sprite-usage)        |
| [SSR](https://github.com/tanem/react-svg/tree/master/examples/ssr)                                 | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/ssr)                 |
| [Styled Components](https://github.com/tanem/react-svg/tree/master/examples/styled-components)     | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/styled-components)   |
| [SVG Wrapper](https://github.com/tanem/react-svg/tree/master/examples/svg-wrapper)                 | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/svg-wrapper)         |
| [Typescript](https://github.com/tanem/react-svg/tree/master/examples/typescript)                   | [Open](https://codesandbox.io/p/devbox/github/tanem/react-svg/tree/master/examples/typescript)          |

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
<div>
  <!-- The wrapper, managed by React -->
  <div>
    <!-- The parent node, managed by @tanem/svg-injector -->
    <svg>...</svg>
    <!-- The swapped-in SVG, managed by @tanem/svg-injector -->
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

Data URIs yes, inline strings no. `data:image/svg+xml` URLs are parsed directly with `DOMParser` and make no network request - see [`src`](#src) and the [data URL example](https://github.com/tanem/react-svg/tree/master/examples/data-url).

Raw markup passed as `src` is **not** supported. If you already hold the SVG as a string - a generated chart, say - parse it with `DOMParser` and append the result yourself, or render it with `dangerouslySetInnerHTML`. Both skip the fetch, and the brief flash when `react-svg` re-injects on a `src` change. Either way you're inserting markup outside React's escaping, so [Security](#security) applies.

</details>

## Contributing

Issues and pull requests are welcome. `npm run test:src` is the development loop; `npm test` runs the full gate.

Repo conventions that aren't visible in the code - the PR labels that drive releases, the React version matrix policy, and how the `examples/` dependencies are pinned - live in [AGENTS.md](AGENTS.md). Coding agents read it from the repo root, so keep it in sync when a change invalidates something it states.

## License

MIT
