// tslint:disable no-var-requires

const glob = require('glob')
const shell = require('shelljs')

glob
  .sync('examples/*/package.json')
  .concat('package.json')
  .forEach((packageFile: string) => {
    shell.exec(`ncu -a --packageFile ${packageFile}`)
  })

if (
  shell
    .exec('git ls-files --exclude-standard --modified --others')
    .stdout.split('\n')
    .some((f: string) => f === 'package.json')
) {
  shell.exec('npm i')
}
