function requireHTTPS (req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect('https://' + req.get('host') + req.url)
  }
  next()
}

const { AceBaseServer } = require('acebase-server')
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
if (process.env.NODE_ENV === 'production') {
  app.use(requireHTTPS)
}
app.use(express.static('./dist/cesaria'))

app.get('/*', (req, res) =>
  res.sendFile('index.html', { root: 'dist/cesaria/' })
)

const server = new AceBaseServer('camp_cesaria', { host: 'localhost', port: 5757, authentication: { enabled: false } })
server.ready(() => {
  console.log('DB Server running on port 5757')
  app.listen(port, () => {
    console.log('listening at port', port)
  })
})
