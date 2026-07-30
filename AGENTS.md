# AGENTS.md

Instructions for coding agents working in this repo. Everything here is loaded
into the context window at the start of a session, so only add rules that
prevent mistakes an agent would otherwise make. Prefer discoverable information
(code, config, directory structure) over restating it here.

## General Rules

- Use NZ English everywhere (e.g. "colour", "behaviour", "initialise").
- Prefer single-line commit messages. Add a body explaining "why" for core
  behaviour or type changes. Follow `git log --oneline` style.
- Update related docs and markdown in the same commit as code changes.
- Use colons (not em-dashes) when introducing explanations in technical
  writing.

## Architecture

`ReactSVG` is a function component wrapped in `forwardRef`, coordinating with
`@tanem/svg-injector` from a single `useEffect`. `forwardRef` is required, not
optional: function components only take `ref` as a plain prop from React 19
onwards, and the floor is 16.8.

The two-wrapper structure (outer React-managed, inner managed by svg-injector)
is load-bearing. Do not collapse them.

The injection effect's dependency list is deliberately narrow: only props that
change the injected SVG. Callbacks (`afterInjection`, `beforeInjection`,
`onError`) are read through `callbacksRef` so inline arrows don't re-inject on
every render. Adding a prop that affects injection means adding it to the
dependency list; adding one that only lands on the React wrapper does not.

The effect's `isActive` flag replaces the old `_isMounted` field. It guards
state updates from async injector callbacks belonging to a torn-down run,
whether from unmount or from a dependency change starting a fresh injection.
Errors are still routed to `onError` in that case. Cleanup must fully detach
the injected node, otherwise StrictMode's double-invoked effects leave two SVGs
behind.

## Build & Test

```
npm run build        # clean + bundle (tsdown) + package checks
npm run test:src     # fastest feedback loop during development
```

The package checks (`package:publint`, `package:attw`) run as a `postbuild`
hook because they inspect `dist/`. They cannot live in the `check:*` glob,
which runs before `build`.

`npm run size` gates the gzipped size of both bundles against the budgets in
the `size-limit` field of `package.json`. It runs after `build` in `npm test`,
so it needs `dist/` to be current. Raising a budget is a deliberate decision:
check what grew first, and say why in the commit message.

Testing rules:

- Each test needs a unique `faker.seed()` + `faker.string.uuid()` for SVG URLs
  (bypasses svg-injector's cache). Use a seed not used by another test.
- SVG injection is async: always `await waitFor(() => expect(...))` after
  render.
- Suppressed "not wrapped in act" warnings in `setupJest.ts` are intentional.
- `test:es` runs Jest in ESM mode, because the ESM bundle is a `.mjs` file that
  TypeScript will not transpile to CommonJS. Jest does not inject the `jest`
  object in that mode, so import it from `@jest/globals` rather than relying on
  the global.
- Use `npm run test:src` for development. `npm run test:react` is slow (full
  React version matrix): pre-release only.

### React version matrix

We test boundary versions only: first/last minor of each supported major, plus
behavioural-change minors. See `test/react/` for current versions.

Current boundaries: 16.8, 16.14, 17.0, 18.0, 18.3, 19.0, 19.1. The floor is
16.8 because the component uses hooks.

When adding a new boundary:

1. Add `test/react/<version>/package.json` with correct `react`, `react-dom`,
   and `@testing-library/react` (12.x for React 16-17, 16.x for React 18-19).
2. Replace the previous "latest minor" for that major.
3. Verify with a single-version run before the full matrix:
   ```
   (cd test/react/<version> && npm i --no-package-lock --quiet --no-progress)
   REACT_VERSION=<version> npx jest --config ./config/jest/config.src.js --coverage false
   ```
   Only the install runs in the version directory. Jest runs from the repo
   root, because its `rootDir` is `process.cwd()`: run it from
   `test/react/<version>` and it finds no config and no tests.
4. Update the boundary list above.

## Releases

`npm run release` runs from `.github/workflows/release.yml` on a Monday cron
against `master`. It derives the version bump from the labels on the PRs merged
since the last tag, then rewrites `CHANGELOG.md` and `AUTHORS`, bumps the
`version` field in `package.json` and `package-lock.json`, tags, and publishes.

- Every PR needs exactly one label. An unlabelled PR, or one carrying two,
  throws and blocks the release for everything merged with it. `breaking` makes
  the release a major and `enhancement` a minor; `bug`, `documentation` and
  `internal` make it a patch.
- Tooling, CI and dependency PRs take `internal`. Renovate applies that label
  itself (via `renovate.json`); label manual ones by hand.
- Never hand-edit `CHANGELOG.md`, `AUTHORS`, or either `version` field. They
  are generated, and edits are overwritten by the next release.
- Breaking changes need a `MIGRATION.md` entry in the same PR. The generated
  changelog is a list of PR titles, which is why that file exists.

## Dependencies

- `devDependencies`: pin exact versions (e.g. `"jest": "30.2.0"`).
- `dependencies`: use caret ranges (e.g. `"@tanem/svg-injector": "^11.3.1"`).

## Examples

Examples live in `examples/` and are designed to open on CodeSandbox. Their
"platform" dependencies (vite, @vitejs/plugin-react, next, typescript,
@types/react, @types/react-dom) must match the official CodeSandbox
sandbox-templates at
https://github.com/codesandbox/sandbox-templates/tree/main.

Reference templates:

- Vite-based examples: `react-vite` / `react-vite-ts`
- SSR example: `nextjs`

Renovate is disabled for `examples/**` (via `ignorePaths` in `renovate.json`).
Updates are manual: check the reference template, update all examples in one
commit, and verify at least one example still opens correctly on CodeSandbox.

Example-specific deps (e.g. `styled-components`, `glamor`,
`react-frame-component`) are not governed by the templates: update these as
needed but test on CodeSandbox before merging.

Do not bump vite, @vitejs/plugin-react, next, or typescript in examples beyond
the versions in the reference templates.

Exception: patch-level bumps within the template's major.minor are allowed to
clear security advisories, for example `next` 15.5.7 to 15.5.22. Do not cross a
minor or major boundary.

## Conventions

- TypeScript types in `src/types.ts` are the only prop contract: there is no
  runtime `propTypes` validation.
- Import sorting enforced by `eslint-plugin-simple-import-sort` (externals
  first, then relative).
- `Props` in `src/types.ts` extends `HTMLAttributes` and `SVGAttributes`. Keep
  the type flat (avoids excessive depth with wrapper libraries).
