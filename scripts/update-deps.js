const glob = require('glob')
const shell = require('shelljs')

glob
  .sync('examples/*/package.json')
  .concat('package.json')
  .forEach(packageFile => {
    shell.exec(`ncu -a --packageFile ${packageFile}`)
  })

if (
  shell
    .exec('git ls-files --exclude-standard --modified --others')
    .split('\n')
    .some(f => f === 'package.json')
) {
  shell.exec('npm i')
}
