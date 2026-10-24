/**
 * The conventions the weekly release depends on, as checks on a pull request.
 * `check-pr.mts` fetches the PR and runs them.
 */
export interface PullRequest {
  labels: string[]
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

export const checkPullRequest = (pullRequest: PullRequest) => [
  ...checkLabels(pullRequest),
]
