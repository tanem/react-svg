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
        `REACT_VERSION=${reactVersion} npx jest --config ./scripts/jest/config.${testType}.js --coverage false`,
        { fatal: true }
      )
      shell.echo(`Finished testing React ${reactVersion}`)
      if (code !== 0) {
        shell.exit(code)
      }
    })
  })
