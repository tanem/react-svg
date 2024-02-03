// Temporary hack until this issue is resolved:
// https://github.com/shelljs/shelljs/issues/1148. Also see:
// https://github.com/isaacs/rimraf/issues/264#issuecomment-1499432564.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import os from 'os'
import path from 'path'
import shell from 'shelljs'

shell
  .ls('-d', path.join(process.cwd(), 'test', 'react', '*'))
  .forEach((reactDir) => {
    const srcPkgJson = path.join(reactDir, 'package.json')
    const tmpPkgJson = path.join(os.tmpdir(), 'package.json')
    shell.cp(srcPkgJson, tmpPkgJson)
    shell.rm('-rf', reactDir)
    shell.mkdir('-p', reactDir)
    shell.cp(tmpPkgJson, srcPkgJson)
  })
