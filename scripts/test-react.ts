import path from 'path'
import shell from 'shelljs'

shell
  .ls('-d', path.join(process.cwd(), 'test', 'react', '*'))
  .forEach((reactDir) => {
    shell.exec('npm i --no-package-lock', {
      cwd: reactDir,
    })
    ;['cjs', 'cjsprod', 'es', 'src', 'umd', 'umdprod'].forEach((testType) => {
      const { code } = shell.exec(
        `REACT_VERSION=${path.basename(
          reactDir
        )} npx jest --config ./scripts/jest/config.${testType}.js --coverage false`,
        { fatal: true }
      )
      if (code !== 0) {
        shell.exit(code)
      }
    })
  })
