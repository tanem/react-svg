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
