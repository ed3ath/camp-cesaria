const { AceBaseServer } = require('acebase-server')
const server = new AceBaseServer('camp_cesaria', { host: 'localhost', port: 5757, authentication: { enabled: false } })

server.ready(() => {
  console.log('DB Server running on port 5757')
})
