/**
 * Checks a pull request against `pr-rules.mts`. The PR workflow runs it on
 * every event that can change the answer; run it locally the same way:
 *
 *   node scripts/check-pr.mts <number>
 */
import { execFileSync } from 'node:child_process'

import { checkPullRequest, type PullRequest } from './pr-rules.mts'

const gh = (...args: string[]) =>
  execFileSync('gh', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 })

const fetchPullRequest = (number: number): PullRequest => {
  const { labels } = JSON.parse(
    gh('pr', 'view', String(number), '--json', 'labels'),
  )

  return {
    labels: labels.map(({ name }: { name: string }) => name),
  }
}

const number = Number(process.argv[2])

if (!Number.isInteger(number)) {
  console.error('Usage: node scripts/check-pr.mts <number>')
  process.exit(2)
}

const problems = checkPullRequest(fetchPullRequest(number))

for (const problem of problems) {
  console.error(`PR #${number}: ${problem}`)
}

process.exitCode = problems.length > 0 ? 1 : 0
