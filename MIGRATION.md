# Migrating

Details relating to major changes that aren't presently in `CHANGELOG.md`, due to limitations with how that file is being generated.

## v7.0.0

**Added**

- `fallback` option.

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

- `wrapperClassName` has been removed. Instead, just pass `className` since it will be spread onto the wrapper element.
