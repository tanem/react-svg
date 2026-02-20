# Copilot Instructions for react-svg

These instructions are injected into every agent context window. Only add rules here that prevent mistakes an agent would otherwise make. Prefer discoverable information (code, config, directory structure) over documenting it here.

## General Rules

- Use NZ English everywhere (e.g. "colour", "behaviour", "initialise").
- Prefer single-line commit messages. Add a body explaining "why" for core behaviour or type changes. Follow `git log --oneline` style.
- Update related docs and markdown in the same commit as code changes.
- Use colons (not em-dashes) when introducing explanations in technical writing.

## Architecture

`ReactSVG` must remain a class component: lifecycle methods coordinate with `@tanem/svg-injector`, which operates outside React's reconciliation. Do not convert to a function component.

The two-wrapper structure (outer React-managed, inner managed by svg-injector) is load-bearing. Do not collapse them.

`shallowDiffers` triggers full re-injection on any prop change. `_isMounted` guards against async callbacks after unmount.

## Build & Test

```
npm run build        # clean + compile (tsc) + bundle (rollup)
npm run test:src     # fastest feedback loop during development
```

Testing rules:
- Each test needs a unique `faker.seed()` + `faker.string.uuid()` for SVG URLs (bypasses svg-injector's cache). Use a seed not used by another test.
- SVG injection is async: always `await waitFor(() => expect(...))` after render.
- Suppressed "not wrapped in act" warnings in `setupJest.ts` are intentional.
- Use `npm run test:src` for development. `npm run test:react` is slow (full React version matrix): pre-release only.

### React version matrix

We test boundary versions only: first/last minor of each supported major, plus behavioural-change minors. See `test/react/` for current versions.

Current boundaries: 16.0, 16.3, 16.14, 17.0, 18.0, 18.3, 19.0, 19.1.

When adding a new boundary:

1. Add `test/react/<version>/package.json` with correct `react`, `react-dom`, and `@testing-library/react` (12.x for React 16–17, 16.x for React 18–19).
2. Replace the previous "latest minor" for that major.
3. Verify with single-version run before full matrix:
   ```
   cd test/react/<version> && npm i --no-package-lock --quiet --no-progress
   REACT_VERSION=<version> npx jest --config ./config/jest/config.src.js --coverage false
   ```
4. Update the boundary list above.

## Dependencies

- `devDependencies`: pin exact versions (e.g. `"jest": "30.2.0"`).
- `dependencies`: use caret ranges (e.g. `"prop-types": "^15.8.1"`).

## Examples

Examples live in `examples/` and are designed to open on CodeSandbox. Their "platform" dependencies (vite, @vitejs/plugin-react, next, typescript, @types/react, @types/react-dom) must match the official CodeSandbox sandbox-templates at https://github.com/codesandbox/sandbox-templates/tree/main.

Reference templates:
- Vite-based examples → `react-vite` / `react-vite-ts`
- SSR example → `nextjs`

Renovate is disabled for `examples/**` (via `ignorePaths` in `renovate.json`). Updates are manual: check the reference template, update all examples in one commit, and verify at least one example still opens correctly on CodeSandbox.

Example-specific deps (e.g. `styled-components`, `glamor`, `react-frame-component`) are not governed by the templates: update these as needed but test on CodeSandbox before merging.

Do not bump vite, @vitejs/plugin-react, next, or typescript in examples beyond the versions in the reference templates.

## Conventions

- PropTypes and TypeScript types are maintained in parallel: update both when changing props.
- Import sorting enforced by `eslint-plugin-simple-import-sort` (externals first, then relative).
- `Props` in `src/types.ts` extends `HTMLAttributes` and `SVGAttributes`. Keep the type flat (avoids excessive depth with wrapper libraries).
