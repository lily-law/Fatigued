require('dotenv').config()
import express from 'express'
import path from 'path'
import { json, urlencoded } from 'body-parser'
import initDB from './db/init'

const app = express()
const PORT = process.env.PORT || 8000

// Initialise connection (production) or in memory (development) database
initDB()

app.set('port', PORT)
app.use(json())
app.use(urlencoded({ extended: false }))

// Route client
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '../client/build/index.html'))
  })
} else {
  app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '../client/public/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
