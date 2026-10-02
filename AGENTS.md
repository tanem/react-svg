# AGENTS.md

Rules for coding agents that the code and config don't already state. Keep it that way: a constraint that can live in a comment next to the thing it constrains belongs there, not here.

## Writing

- NZ English everywhere ("colour", "behaviour", "initialise").
- Commit subjects and PR titles are one plain capitalised sentence, `git log --oneline` style, with no conventional-commit prefix (`feat:`, `fix:`, `chore(deps):`). Nothing reads a prefix: the version bump comes from the PR label.
- Add a commit body whenever the change had a reason the diff does not show: what it fixes, what it rules out, what constraint forced the shape it has. Hard-wrap it at 72 columns.
- PR titles are copied verbatim into the generated release notes, so write them as the changelog line you want readers to see.
- Do not hard-wrap markdown files, PR descriptions or issue descriptions.

## Build & test

- `npm run test:src` is the development loop. `npm test` is the full gate and takes minutes: it installs and runs every React version under `test/react/`.
- `npm run size`, `test:cjs`, `test:es`, `test:dist` and the `package:*` checks read `dist/`, so they need a current `npm run build`.
- Raising a `size-limit` budget in `package.json` is a decision, not a fix. Find what grew first, and say why in the commit message.
- `test/manual/` is a hand-driven screen-reader harness, outside `npm test` and CI. When you change the ARIA wiring or the `loading` element's lifecycle, run it as `test/manual/README.md` describes, record the result in the PR, and update that README's recorded runs in the same commit.
- `test/react/` covers boundary versions only: the first and last minor of each supported major, plus minors that changed behaviour. For the current major the root `devDependencies` cover the newest minor, so the matrix holds only its first minor; add its last minor when the next major ships. Copy a sibling `package.json`, and see `scripts/test-react.ts` for how a single version is run.

## Releases

[`tanem/release-action`](https://github.com/tanem/release-action) releases `master` weekly. It takes the version bump from the labels on PRs merged since the last tag, then bumps `version`, tags, and publishes the GitHub Release and the npm package.

- Exactly one release label per PR: `breaking` gives a major, `enhancement` a minor, `bug` / `documentation` / `internal` a patch. None, or more than one, throws and blocks the release for everything merged alongside it. `safe to test` is ignored.
- Tooling, CI and `devDependencies` work is `internal`, except a `react` / `react-dom` major or minor, which is `enhancement`. A runtime `dependencies` bump reaches consumers, so it is `bug`, or `breaking` for a major unless review shows otherwise.
- Breaking changes need a `MIGRATION.md` entry in the same PR: the generated release notes are only a list of PR titles.
- Leave `CHANGELOG.md`, `AUTHORS` and the `version` fields in `package.json` and `package-lock.json` alone. The first two are frozen, the changelog is [GitHub Releases](https://github.com/tanem/react-svg/releases), and the action owns the version.

## Dependencies

Pin `devDependencies` to exact versions. Keep `dependencies` on caret ranges.

## Examples

`examples/` are built to open on CodeSandbox, so their platform dependencies (vite, @vitejs/plugin-react, next, typescript, @types/react, @types/react-dom) track the official [sandbox-templates](https://github.com/codesandbox/sandbox-templates/tree/main): `react-vite` / `react-vite-ts` for the Vite examples, `nextjs` for the SSR one. Bump them only as far as the template has, except for patch-level security fixes inside the template's major.minor. Example-only dependencies (`styled-components`, `glamor`, `react-frame-component`) aren't governed by it.

Renovate skips `examples/**`, so updates are manual: do every example in one commit and check at least one still opens on CodeSandbox.
