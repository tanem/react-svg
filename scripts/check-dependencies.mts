/**
 * Checks package.json and the examples against `dependency-rules.mts`. Part
 * of `npm test`, as `npm run check:dependencies`.
 */
import { readdirSync, readFileSync } from 'node:fs'

import { checkExamples, checkRanges } from './dependency-rules.mts'

const readManifest = (path: string) => JSON.parse(readFileSync(path, 'utf8'))

const problems = [
  ...checkRanges(readManifest('package.json')).map(
    (problem) => `package.json: ${problem}`,
  ),
  ...checkExamples(
    readdirSync('examples', { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map(({ name }) => ({
        manifest: readManifest(`examples/${name}/package.json`),
        name,
      })),
  ).map((problem) => `examples: ${problem}`),
]

for (const problem of problems) {
  console.error(problem)
}

process.exitCode = problems.length > 0 ? 1 : 0
