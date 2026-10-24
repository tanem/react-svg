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
  const { baseRefOid, headRefOid, labels, title } = JSON.parse(
    gh(
      'pr',
      'view',
      String(number),
      '--json',
      'baseRefOid,headRefOid,labels,title',
    ),
  )

  // Three dots: what the PR adds since it left its base, however far the base
  // has moved on since.
  const { commits } = JSON.parse(
    gh('api', `repos/{owner}/{repo}/compare/${baseRefOid}...${headRefOid}`),
  )

  return {
    commits: commits.map(
      ({ commit, sha }: { commit: { message: string }; sha: string }) => ({
        message: commit.message,
        sha,
      }),
    ),
    labels: labels.map(({ name }: { name: string }) => name),
    title,
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
