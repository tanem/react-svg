// Temporary hack until this issue is resolved:
// https://github.com/shelljs/shelljs/issues/1148. Also see:
// https://github.com/isaacs/rimraf/issues/264#issuecomment-1499432564.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import path from 'path'
import shell from 'shelljs'

shell
  .ls('-d', path.join(process.cwd(), 'test', 'react', '*'))
  .forEach((reactDir) => {
    const reactVersion = path.basename(reactDir)
    shell.echo(`Starting React ${reactVersion} tests`)
    shell.exec('npm i --no-package-lock --quiet --no-progress', {
      cwd: reactDir,
    })
    ;['cjs', 'cjsprod', 'es', 'src', 'umd', 'umdprod'].forEach((testType) => {
      const { code } = shell.exec(
        `REACT_VERSION=${reactVersion} npx jest --config ./config/jest/config.${testType}.js --coverage false`,
        { fatal: true },
      )
      if (code !== 0) {
        shell.echo(`Fail testing React ${reactVersion}`)
        shell.exit(code)
      }
    })
    shell.echo(`Success testing React ${reactVersion}`)
  })
