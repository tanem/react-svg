# Migrating

Details relating to major changes that the release notes don't carry: those are generated from PR titles alone, so anything a reader needs beyond a one-line title lives here.

## v19.0.0

Nothing in this package's own API changed. Every entry below comes from [`@tanem/svg-injector`](https://github.com/tanem/svg-injector) moving to v12 (see its [migration notes](https://github.com/tanem/svg-injector/blob/master/MIGRATION.md#v1200) for the packaging changes, which only affect you if you also depend on it directly).

**Changed**

- Test suites running under jsdom need a `TextDecoder` polyfill. jsdom does not expose it, so a base64 `src` such as `<ReactSVG src="data:image/svg+xml;base64,…" />` is not injected and `onError` receives `Error: Invalid base64 in data URL`. Add it to your Jest setup file:

  ```ts
  import { TextDecoder } from 'node:util'

  globalThis.TextDecoder ??= TextDecoder as typeof globalThis.TextDecoder
  ```

  jsdom also lacks `CSS.escape`, which svg-injector uses to look up a sprite symbol. If you render an `src` with a fragment identifier, `import 'css.escape'` in the same file.

- A `src` with `.svg` anywhere other than the end of the URL pathname now needs a valid `Content-Type`. The `Content-Type` check is skipped only when the pathname ends in `.svg`, where it used to be skipped when `.svg` appeared anywhere in the URL, so `src="/render?file=logo.svg"` served without a valid `Content-Type` now reports an error through `onError`. Serve `image/svg+xml` (or `text/plain`), or move the extension to the end of the pathname.

- A cached `src` is now injected in a later task rather than during the mount. When the same `src` is mounted a second time, the `loading` element is still in the DOM after the mount and is removed once the SVG is injected, where it used to be gone before the mount finished. A test that asserts on a cached `src` straight after rendering now needs to wait for the injection. In practice nothing paints differently.

## v18.0.0

**Added**

- An `exports` map. `react-svg` and `react-svg/package.json` are the only entry points, so paths into `dist` are no longer reachable. The top-level `main`, `module` and `types` fields are still set for webpack 4 and TypeScript `node10` resolution. Node ESM consumers now get the ES module build rather than falling back to CommonJS.
- `sideEffects: false`, so bundlers can drop the package entirely when nothing is imported from it.

**Changed**

- The minimum supported React version is now 16.8, up from 16.0. The peer dependency range is `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`.
- `ReactSVG` is a function component rather than a class component. `defaultProps` is gone; prop defaults are unchanged.
- `ReactSVG` can no longer be used in a type position. `Omit<ReactSVG, 'src'>` and similar now fail with `TS2749: 'ReactSVG' refers to a value, but is being used as a type here`. Use the exported `Props` type instead: `Omit<Props, 'src'>`.
- `ref` now resolves to the outermost wrapper DOM element - an `HTMLDivElement`, `HTMLSpanElement` or `SVGSVGElement`, depending on `wrapper` - instead of the `ReactSVG` class instance. Type the ref as the exported `WrapperType` if you need it.
- Re-injection now only happens when a prop that affects the injected SVG changes: `src`, `wrapper`, `title`, `desc`, `evalScripts`, `httpRequestWithCredentials`, `renumerateIRIElements` or `useRequestCache`. Previously any prop change re-fetched and re-injected, including `className`, `style`, event handlers and inline `beforeInjection` / `afterInjection` / `onError` functions. Those callbacks are still always invoked in their latest form. If you were relying on a change to one of those props to force a re-injection, change `src` instead.
- Build output filenames. The CommonJS build is `dist/react-svg.cjs` (was `dist/react-svg.cjs.js`) and the ES module build is `dist/react-svg.mjs` (was `dist/react-svg.esm.js`). Type declarations are `dist/react-svg.d.cts` and `dist/react-svg.d.mts` (was `dist/index.d.ts` plus one file per source module). Importing `react-svg` is unaffected.
- `@babel/runtime` is no longer a runtime dependency, leaving `@tanem/svg-injector` as the only one. Output still targets ES2019.
- `src` is now published alongside `dist` so the declaration maps resolve.

**Removed**

- The `State` type export, which described the class component's internal state.
- `propTypes` validation. On React 18 and earlier, invalid props no longer log a console warning in development. TypeScript types are the supported contract for props. `prop-types` and `@types/prop-types` are no longer dependencies.
- The separate development and production CommonJS builds. `dist/react-svg.cjs.development.js`, `dist/react-svg.cjs.production.js` and the `dist/index.js` shim that switched between them on `process.env.NODE_ENV` are replaced by a single unminified CommonJS build.
- UMD builds. `dist/react-svg.umd.development.js` and `dist/react-svg.umd.production.js` are no longer published, and the `ReactSVG` browser global is gone. If you load `react-svg` via a script tag, pin `react-svg@^17`, or switch to the ES module build with an import map or a bundler.

## v17.0.0

**Changed**

- [`@tanem/svg-injector`](https://github.com/tanem/svg-injector) updated to v11 (see [migration notes](https://github.com/tanem/svg-injector/blob/master/MIGRATION.md#v1100)). This drops explicit IE / legacy browser support. The library may still work in older browsers, but compatibility is no longer tested or guaranteed. If you need IE support, pin `@tanem/svg-injector@^10` and `react-svg@^16`.

## v16.0.0

**Added**

- `onError` prop.

**Changed**

- `afterInjection` is no longer an error-first callback.

## v15.0.0

**Removed**

- Dropped support for React 15.

## v14.0.0

**Changed**

- Restored extra wrapper element in rendered output.

## v13.0.0

**Changed**

- Fetch errors are no longer cached (see [tanem/svg-injector#692](https://github.com/tanem/svg-injector/issues/692)).

## v12.0.0

**Changed**

- Removed extra wrapper element in rendered output.

## v11.0.0

**Added**

- Named type definition exports.

**Changed**

- `ReactSVG` is now a named export.

## v10.0.0

**Added**

- `beforeInjection` prop.

**Changed**

- `onInjected` prop renamed to `afterInjection`.

**Removed**

- `svgClassName` prop has been removed. Instead, use `beforeInjection` to add the class name to the SVG DOM element.
- `svgStyle` prop has been removed. Instead, use `beforeInjection` to add the style attribute to the SVG DOM element.

## v8.0.0

**Changed**

- [`@tanem/svg-injector`](https://github.com/tanem/svg-injector) updated to its latest version. The dependency was significantly refactored. There were no breaking API changes to `react-svg`, but the major version was bumped to reduce the risk of unexpected breakage in consuming code.

## v7.0.0

**Added**

- `fallback` prop.

**Changed**

- `onInjected` is now an error-first callback.

## v6.0.0

**Changed**

- `path` prop renamed to `src`.

## v3.0.0

**Added**

- All additional non-documented props will now be spread onto the wrapper element.

**Changed**

- `callback` prop renamed to `onInjected`.
- `className` prop renamed to `svgClassName`.
- `style` prop renamed to `svgStyle`.

**Removed**

- `wrapperClassName` has been removed. Instead, pass `className` since it will be spread onto the wrapper element.
