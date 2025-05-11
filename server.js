const http = require('http')
const dotenv = require('dotenv').config()

const app = require('./app')
const PORT = process.env.PORT || 5000
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`)
})
