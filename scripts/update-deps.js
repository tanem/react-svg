const glob = require('glob')
const shell = require('shelljs')

glob
  .sync('examples/*/package.json')
  .concat('package.json')
  .forEach(packageFile => {
    shell.exec(`ncu -a --packageFile ${packageFile}`)
  })

shell.exec('npm i')
