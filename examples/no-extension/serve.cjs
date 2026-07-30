const express = require('express')
const path = require('path')

const app = express()

const PORT = 8080

app.use(
  '/',
  express.static(path.join(__dirname, 'dist'), {
    setHeaders: (res, filePath) => {
      // The point of this example: with no extension to go on, the injector
      // trusts the server's content type, and express.static defaults to
      // application/octet-stream, which it rejects.
      if (path.extname(filePath) === '') {
        res.setHeader('Content-Type', 'image/svg+xml')
      }
    },
  }),
)

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`)
})
