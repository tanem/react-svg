/**
 * The conventions a pull request has to meet, as checks. `check-pr.mts`
 * fetches the PR and runs them.
 */
export interface PullRequest {
  commits: { message: string; sha: string }[]
  files: string[]
  labels: string[]
  title: string
  /** The version fields of the files the PR touches, at its base and head. */
  versionFields: { base?: string; head?: string; name: string }[]
}

/**
 * tanem/release-action reads every label but this one, and throws on a merged
 * PR that has anything other than exactly one. That throw blocks the release
 * for everything merged alongside it, a week after the merge.
 */
const IGNORED_LABEL = 'safe to test'

/**
 * The action treats a label it doesn't know as a patch. This is stricter, so
 * that a triage label such as `has workaround` fails here instead of quietly
 * becoming the bump.
 */
const RELEASE_LABELS = [
  'breaking',
  'enhancement',
  'bug',
  'documentation',
  'internal',
]

const LABEL_FIX = `Add exactly one of: breaking (major), enhancement (minor), bug, documentation, internal (patch). AGENTS.md's Releases section says which fits.`

const checkLabels = ({ labels }: PullRequest) => {
  const counted = labels.filter((label) => label !== IGNORED_LABEL)

  if (counted.length === 0) {
    return [`No release label. ${LABEL_FIX}`]
  }

  if (counted.length > 1) {
    return [`More than one release label (${counted.join(', ')}). ${LABEL_FIX}`]
  }

  if (!RELEASE_LABELS.includes(counted[0])) {
    return [`"${counted[0]}" is not a release label. ${LABEL_FIX}`]
  }

  return []
}

/**
 * Nothing reads a prefix: the label sets the bump. The PR title is copied
 * verbatim into the release notes, and history is what the next contributor
 * copies, so both read as one plain capitalised sentence.
 */
const CONVENTIONAL_PREFIX =
  /^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(.*?\))?!?:/i

const checkSentence = (what: string, sentence: string) => {
  if (CONVENTIONAL_PREFIX.test(sentence)) {
    return [
      `${what} "${sentence}" has a conventional-commit prefix. Drop it and write one plain capitalised sentence.`,
    ]
  }

  if (/^[a-z]/.test(sentence)) {
    return [
      `${what} "${sentence}" starts in lower case. Write one plain capitalised sentence.`,
    ]
  }

  return []
}

/** A URL or other unbreakable token can't be wrapped, so it may run long. */
const isOverlong = (line: string) =>
  line.length > 72 && !line.includes('://') && /\s\S/.test(line.trim())

const checkCommits = ({ commits }: PullRequest) =>
  commits.flatMap(({ message, sha }) => {
    const [subject, ...body] = message.split('\n')
    const what = `Commit ${sha.slice(0, 8)}`

    return [
      ...checkSentence(`${what} subject`, subject),
      ...(body.some(isOverlong)
        ? [`${what} has body lines over 72 columns. Hard-wrap the body at 72.`]
        : []),
    ]
  })

/** The generated release notes are only a list of PR titles. */
const checkMigration = ({ files, labels }: PullRequest) =>
  labels.includes('breaking') && !files.includes('MIGRATION.md')
    ? [
        'Labelled breaking without a MIGRATION.md change. Add an entry saying what breaks and how to move, or relabel if nothing breaks.',
      ]
    : []

/**
 * tanem/release-action owns the versions and bumps them on master itself.
 * CHANGELOG.md and AUTHORS are frozen: GitHub Releases is the changelog now.
 */
const FROZEN_FILES = ['AUTHORS', 'CHANGELOG.md']

const checkReleaseOwned = ({ files, versionFields }: PullRequest) => [
  ...FROZEN_FILES.filter((file) => files.includes(file)).map(
    (file) =>
      `Changes ${file}, which is frozen. Revert it: GitHub Releases is the changelog.`,
  ),
  ...versionFields
    .filter(({ base, head }) => base !== head)
    .map(
      ({ base, head, name }) =>
        `Changes ${name} from ${base} to ${head}. Revert it: tanem/release-action sets the version from the PR label.`,
    ),
]

export const checkPullRequest = (pullRequest: PullRequest) => [
  ...checkLabels(pullRequest),
  ...checkSentence('Title', pullRequest.title),
  ...checkCommits(pullRequest),
  ...checkMigration(pullRequest),
  ...checkReleaseOwned(pullRequest),
]
