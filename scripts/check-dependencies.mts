/**
 * Checks package.json against `dependency-rules.mts`. Part of `npm test`, as
 * `npm run check:dependencies`.
 */
import { readFileSync } from 'node:fs'

import { checkRanges } from './dependency-rules.mts'

const problems = checkRanges(JSON.parse(readFileSync('package.json', 'utf8')))

for (const problem of problems) {
  console.error(`package.json: ${problem}`)
}

process.exitCode = problems.length > 0 ? 1 : 0
