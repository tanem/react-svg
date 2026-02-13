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

`npm run test:react` runs all test suites against React 16.0 through 19.x. It installs dependencies per version directory under `test/react/` and takes a long time. Use `npm run test:src` for development; `test:react` is for pre-release verification.

## Conventions

- PropTypes and TypeScript types are maintained in parallel — update both when changing props.
- Import sorting is enforced by `eslint-plugin-simple-import-sort` (externals first, then relative).
- `src/types.ts` `Props` extends both `React.HTMLAttributes` and `React.SVGProps` for wrapper pass-through attributes.
