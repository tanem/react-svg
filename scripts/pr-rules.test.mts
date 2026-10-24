import assert from 'node:assert/strict'
import { test } from 'node:test'

import { checkPullRequest, type PullRequest } from './pr-rules.mts'

// Shaped on #3658, a PR the release took without complaint.
const pullRequest = (overrides: Partial<PullRequest>): PullRequest => ({
  commits: [
    {
      message: 'Update dependency @tanem/svg-injector to ^12.2.3',
      sha: '2f1fb0eca414e3491a05d4cc240fc54cd52f0ef9',
    },
  ],
  files: ['package-lock.json', 'package.json'],
  labels: ['bug'],
  title: 'Update dependency @tanem/svg-injector to ^12.2.3',
  ...overrides,
})

test('passes a PR the release took', () => {
  assert.deepEqual(checkPullRequest(pullRequest({})), [])
})

test('ignores safe to test', () => {
  assert.deepEqual(
    checkPullRequest(pullRequest({ labels: ['safe to test', 'bug'] })),
    [],
  )
})

test('fails #2891 as it was merged, with two release labels', () => {
  // Renovate added both on 2024-04-28. It merged on 2024-11-17, and internal
  // came off two days later.
  const [problem] = checkPullRequest(
    pullRequest({ labels: ['enhancement', 'internal'] }),
  )
  assert.match(problem, /More than one release label \(enhancement, internal\)/)
})

test('fails #3593 and #903, which carry no label', () => {
  for (const labels of [[], ['safe to test']]) {
    const [problem] = checkPullRequest(pullRequest({ labels }))
    assert.match(problem, /No release label/)
  }
})

test('fails a triage label standing in for a release label', () => {
  const [problem] = checkPullRequest(
    pullRequest({ labels: ['has workaround'] }),
  )
  assert.match(problem, /"has workaround" is not a release label/)
})

test('fails the conventional-commit titles of #3593 and #479', () => {
  for (const title of [
    'feat: add "use client" to published bundles',
    'feat: add className prop support',
  ]) {
    const [problem] = checkPullRequest(pullRequest({ title }))
    assert.match(problem, /has a conventional-commit prefix/)
  }
})

test('fails a title in lower case', () => {
  const [problem] = checkPullRequest(pullRequest({ title: 'update README' }))
  assert.match(problem, /starts in lower case/)
})

test('fails the conventional-commit subject of eb299a5d', () => {
  const [problem] = checkPullRequest(
    pullRequest({
      commits: [
        {
          message:
            'chore(deps): replace eslint-plugin-react with @eslint-react/eslint-plugin',
          sha: 'eb299a5d',
        },
      ],
    }),
  )
  assert.match(
    problem,
    /^Commit eb299a5d subject .* conventional-commit prefix/,
  )
})

test('fails a commit body wrapped past 72 columns, but not a long URL', () => {
  const commit = (line: string) => ({
    commits: [{ message: `Fix the thing\n\n${line}`, sha: 'abcdef12' }],
  })

  assert.deepEqual(
    checkPullRequest(
      pullRequest(commit(`See https://github.com/${'x'.repeat(80)} for more.`)),
    ),
    [],
  )
  assert.deepEqual(
    checkPullRequest(
      pullRequest(commit(`https://example.com/${'x'.repeat(80)}`)),
    ),
    [],
  )

  const [problem] = checkPullRequest(
    pullRequest(commit('word '.repeat(15).trim())),
  )
  assert.match(problem, /body lines over 72 columns/)
})

test('passes #3599, a breaking PR with its MIGRATION.md entry', () => {
  assert.deepEqual(
    checkPullRequest(
      pullRequest({
        files: ['MIGRATION.md', 'package-lock.json', 'package.json'],
        labels: ['breaking'],
        title: 'Update @tanem/svg-injector to v12',
      }),
    ),
    [],
  )
})

test('fails a breaking PR without a MIGRATION.md change', () => {
  const [problem] = checkPullRequest(pullRequest({ labels: ['breaking'] }))
  assert.match(problem, /without a MIGRATION.md change/)
})
