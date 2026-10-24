import assert from 'node:assert/strict'
import { test } from 'node:test'

import { checkRanges } from './dependency-rules.mts'

test('passes pinned devDependencies and caret dependencies', () => {
  assert.deepEqual(
    checkRanges({
      dependencies: { '@tanem/svg-injector': '^12.2.3' },
      devDependencies: { react: '19.3.1', typescript: '5.9.3' },
    }),
    [],
  )
})

test('fails the caret devDependencies f55af6b1 added', () => {
  // Renovate's "Pin dependencies" pinned them again the same day.
  const problems = checkRanges({
    devDependencies: { globals: '^17.3.0', 'typescript-eslint': '^8.55.0' },
  })
  assert.equal(problems.length, 2)
  assert.match(problems[0], /devDependencies.globals is "\^17.3.0". Pin it/)
})

test('fails a pinned runtime dependency', () => {
  const [problem] = checkRanges({
    dependencies: { '@tanem/svg-injector': '12.2.3' },
  })
  assert.match(problem, /Use a caret range, such as "\^12.2.3"/)
})
