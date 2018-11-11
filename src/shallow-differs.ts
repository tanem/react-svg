// Hat-tip: https://github.com/developit/preact-compat/blob/master/src/index.js#L402.

interface O {
  [key: string]: any
}

const shallowDiffers = (a: O, b: O) => {
  for (const i in a) {
    if (!(i in b)) {
      return true
    }
  }

  for (const i in b) {
    if (a[i] !== b[i]) {
      return true
    }
  }

  return false
}

export default shallowDiffers
