import assert from 'node:assert/strict'
import { test } from 'node:test'

import { checkPullRequest, type PullRequest } from './pr-rules.mts'

// Shaped on #3658, a PR the release took without complaint.
const pullRequest = (overrides: Partial<PullRequest>): PullRequest => ({
  labels: ['bug'],
  ...overrides,
})

test('passes a PR with one release label', () => {
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
