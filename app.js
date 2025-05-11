const express = require('express')
const app = express()
const cors = require('cors')
const connectToDb = require('./conection/conection')
const cookieParser = require('cookie-parser')
const userRoutes = require('./routes/user.route')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

connectToDb()

app.use(
  cors({
    origin: '*',
    credentials: true
  })
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/users', userRoutes)
module.exports = app
