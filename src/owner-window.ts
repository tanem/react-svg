// Hat-tip: https://github.com/mui/material-ui/tree/master/packages/mui-utils/src.

const ownerWindow = (node?: Node | null) => {
  const doc = node?.ownerDocument || document
  return doc.defaultView || window
}

export default ownerWindow
