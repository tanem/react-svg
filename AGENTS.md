# AGENTS.md

Rules for coding agents that the code and config don't already state. Keep it
that way: a constraint that can live in a comment next to the thing it
constrains belongs there, not here.

## Writing

- NZ English everywhere ("colour", "behaviour", "initialise").
- Single-line commit messages, `git log --oneline` style. Add a body only to
  explain why, and only for behaviour or type changes.
- No conventional-commit prefixes (`feat:`, `fix:`, `chore(deps):`) in commit
  subjects or PR titles. Write a plain capitalised sentence. Nothing reads the
  prefix: the version bump comes from the PR label, and renovate is set to
  `semanticCommits: "disabled"` to match.
- PR titles are copied verbatim into `CHANGELOG.md`, so write them as the
  changelog line you want readers to see.
- Hard-wrap commit message bodies at 72 columns; `git log` does not reflow
  them. Do not hard-wrap PR or issue descriptions: GitHub reflows markdown,
  and its web editor leaves wrapped source ragged once anyone edits it.

## Architecture

Injection happens in a single effect in `src/ReactSVG.tsx`. The two-wrapper
structure, outer managed by React and inner managed by `@tanem/svg-injector`,
is load-bearing: don't collapse it.

That file's comments cover the rest: why `forwardRef` is required, why the
effect's dependency list is deliberately narrow, why the callbacks are read
through a ref, and what the teardown guard protects. Read them before changing
the injection flow.

## Build & test

`npm run test:src` is the development loop. `npm test` is the full gate: its
`test:*` glob includes `test:react`, which installs and runs every version in
the React matrix, so expect it to take minutes. `npm run size`,
`npm run test:dist` and the `package:*` checks read `dist/`, so they need a
current `npm run build`.

Give each test its own `faker.seed()` and a `faker.string.uuid()` SVG URL, or
svg-injector's cache leaks state between tests. Injection is async: assert
through `await waitFor(...)`. The warm-cache loading test is the one deliberate
exception: it needs the cache to hit, so it uses a fixed URL no other test
touches.

Raising a `size-limit` budget in `package.json` is a decision, not a fix. Find
what grew first, and say why in the commit message.

The React matrix covers boundary versions only: the first and last minor of
each supported major, plus minors that changed behaviour. Currently 16.8,
16.14, 17.0, 18.0, 18.3, 19.0, 19.1. Adding a boundary means replacing the
previous last-minor for that major, not accumulating versions. Copy a sibling
`test/react/<version>/package.json`, and see `scripts/test-react.ts` for how a
single version is run.

## Releases

`npm run release` runs on a Monday cron against `master`. It takes the version
bump from the labels on PRs merged since the last tag, then regenerates
`CHANGELOG.md` and `AUTHORS` and bumps `version` in `package.json` and
`package-lock.json`.

- Exactly one label per PR. None, or more than one, throws and blocks the
  release for everything merged alongside it. `breaking` gives a major,
  `enhancement` a minor, `bug` / `documentation` / `internal` a patch. Tooling,
  CI and dependency work is `internal`.
- Never hand-edit `CHANGELOG.md`, `AUTHORS` or either `version` field.
- Breaking changes need a `MIGRATION.md` entry in the same PR: the generated
  changelog is only a list of PR titles.

## Dependencies

Pin `devDependencies` to exact versions. Keep `dependencies` on caret ranges.

## Examples

`examples/` are built to open on CodeSandbox, so their platform dependencies
(vite, @vitejs/plugin-react, next, typescript, @types/react, @types/react-dom)
track the official
[sandbox-templates](https://github.com/codesandbox/sandbox-templates/tree/main):
`react-vite` / `react-vite-ts` for the Vite examples, `nextjs` for the SSR one.
Don't bump those past the template, except for patch-level security fixes
inside the template's major.minor. Example-only dependencies
(`styled-components`, `glamor`, `react-frame-component`) aren't governed by it.

Renovate skips `examples/**`, so updates are manual: do every example in one
commit and check at least one still opens on CodeSandbox.

## Conventions

- `src/types.ts` is the only prop contract. There is no runtime `propTypes`.
- Keep `Props` flat. It extends `HTMLAttributes` and `SVGAttributes`, and
  nesting it trips excessive-depth errors in wrapper libraries.
