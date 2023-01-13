// Hat-tip: https://github.com/mui/material-ui/tree/master/packages/mui-utils/src.

const ownerDocument = (node?: Node | null) => {
  return (node && node.ownerDocument) || document
}

const ownerWindow = (node?: Node | null) => {
  const doc = ownerDocument(node)
  return doc.defaultView || window
}

export default ownerWindow
