# Migrating

Details relating to major changes that aren't presently in `CHANGELOG.md`, due to limitations with how that file is being generated.

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

- [`@tanem/svg-injector`](https://github.com/tanem/svg-injector) updated to it's latest version. This dependency had undergone significant refactoring, so even though there were no breaking API changes made to `react-svg`, it was decided to bump the major version in order to reduce the chance of breaking changes slipping into consuming code.

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
