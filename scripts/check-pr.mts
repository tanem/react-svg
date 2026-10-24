/**
 * Checks a pull request against `pr-rules.mts`. The PR workflow runs it on
 * every event that can change the answer; run it locally the same way:
 *
 *   node scripts/check-pr.mts <number>
 */
import { execFileSync } from 'node:child_process'

import { checkPullRequest, type PullRequest } from './pr-rules.mts'

// Each file's version fields, as [name, value] pairs.
const VERSIONED_FILES = [
  {
    path: 'package.json',
    versions: (json: { version?: string }) => [['version', json.version]],
  },
  {
    path: 'package-lock.json',
    versions: (json: {
      packages?: Record<string, { version?: string }>
      version?: string
    }) => [
      ['version', json.version],
      ['packages[""].version', json.packages?.['']?.version],
    ],
  },
]

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
  const { commits, files, merge_base_commit } = JSON.parse(
    gh('api', `repos/{owner}/{repo}/compare/${baseRefOid}...${headRefOid}`),
  )

  const readJson = (path: string, ref: string) =>
    JSON.parse(
      gh(
        'api',
        '-H',
        'Accept: application/vnd.github.raw+json',
        `repos/{owner}/{repo}/contents/${path}?ref=${ref}`,
      ),
    )

  const versionFields = VERSIONED_FILES.flatMap(({ path, versions }) => {
    if (
      !files.some(({ filename }: { filename: string }) => filename === path)
    ) {
      return []
    }

    const base = versions(readJson(path, merge_base_commit.sha))
    const head = versions(readJson(path, headRefOid))

    return base.map(([name, value], index) => ({
      base: value,
      head: head[index][1],
      name: `${path} ${name}`,
    }))
  })

  return {
    commits: commits.map(
      ({ commit, sha }: { commit: { message: string }; sha: string }) => ({
        message: commit.message,
        sha,
      }),
    ),
    // A rename counts against both names.
    files: files.flatMap(
      ({
        filename,
        previous_filename,
      }: {
        filename: string
        previous_filename?: string
      }) => (previous_filename ? [filename, previous_filename] : [filename]),
    ),
    labels: labels.map(({ name }: { name: string }) => name),
    title,
    versionFields,
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
