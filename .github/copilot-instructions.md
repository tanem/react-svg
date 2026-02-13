# Copilot Instructions for react-svg

## General Rules

- Use NZ English in all code comments, docs, markdown, and commit messages (e.g. "colour", "behaviour", "initialise").
- Prefer single-line commit messages. Follow the style in `git log --oneline`.
- After any change, update related docs, instructions, and markdown files in the same commit.
- Keep prose factual and concise. No marketing speak or hyperbole.

## Architecture

`ReactSVG` is a class component that manages a non-React DOM subtree. It must remain a class component — it uses lifecycle methods to coordinate with `@tanem/svg-injector`, which operates outside React's reconciliation.

The two-wrapper structure (outer React-managed, inner managed by svg-injector) is load-bearing. Do not collapse them into one element. See the FAQ in `README.md` for background.

`shallowDiffers` triggers full re-injection in `componentDidUpdate` — the SVG is removed and re-injected on any prop change. `_isMounted` guards against async callbacks firing after unmount.

## Build

```
npm run build        # clean + compile (tsc) + bundle (rollup)
npm run test:src     # fastest feedback loop during development
```

The `postbundle` hook deletes `compiled/` and copies the root `index.js` into `dist/`. This `index.js` switches CJS dev/prod based on `NODE_ENV`.

## Testing

Each test needs a unique `faker.seed()` + `faker.string.uuid()` for SVG URLs to bypass svg-injector's internal cache. Always use a seed not used by another test.

SVG injection is async — always `await waitFor(() => expect(...))` after render.

`config/jest/setupJest.ts` intentionally suppresses "not wrapped in act" warnings. This is expected because SVG injection occurs outside React's control flow.

`npm run test:react` runs the `src` test suite against all boundary React versions. It installs dependencies per version directory under `test/react/` and takes a long time. Use `npm run test:src` for development; `test:react` is for pre-release verification. Bundle format tests (`test:cjs`, `test:es`, `test:umd`, etc.) run against the dev React version only via `npm run test` — bundle format is orthogonal to React version compatibility.

To run a single React version suite during development:

```
cd test/react/19.0 && npm i --no-package-lock --quiet --no-progress
REACT_VERSION=19.0 npx jest --config ./config/jest/config.src.js --coverage false
```

### React version matrix strategy

We test **boundary versions only** — the first and last minor of each supported major, plus any minor where React introduced breaking or significant behavioural changes. This avoids a combinatorial explosion while still validating the `peerDependencies` claim.

Current boundary versions and rationale:

| Version | Rationale |
|---------|-----------|
| 16.0 | Earliest supported, baseline |
| 16.3 | New context API, lifecycle deprecation warnings introduced |
| 16.14 | Latest 16.x, confirms nothing regressed across the range |
| 17.0 | Event delegation changes |
| 18.0 | Concurrent mode, `createRoot` |
| 18.3 | Latest 18.x |
| 19.0 | Removed legacy APIs, ref changes |
| 19.1 | Latest 19.x |

`@testing-library/react` versions must match React compatibility:

| React | @testing-library/react |
|-------|------------------------|
| 16.x–17.x | 12.x |
| 18.x–19.x | 16.x |

### Adding support for a new React version

When a new React major is released or `peerDependencies` is widened:

1. Add a `test/react/<version>/package.json` with the correct `react`, `react-dom`, and `@testing-library/react` versions (see compatibility table above).
2. Decide whether it's a new boundary. If it's the first minor of a new major, it is always a boundary. If it's a later minor, only add it if it introduces changes relevant to class components, lifecycle methods, or DOM reconciliation.
3. Remove any previous "latest minor" boundary for that major and replace it with the new one (e.g. when 19.2 ships, replace 19.1).
4. Run the single-version suite to verify before running the full matrix.
5. Update the boundary table above.

## Conventions

- PropTypes and TypeScript types are maintained in parallel — update both when changing props.
- Import sorting is enforced by `eslint-plugin-simple-import-sort` (externals first, then relative).
- `src/types.ts` `Props` extends both `React.HTMLAttributes` and `React.SVGProps` for wrapper pass-through attributes.
