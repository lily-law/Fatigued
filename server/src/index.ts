require('dotenv').config()
import express from 'express'
import path from 'path'
import { json, urlencoded } from 'body-parser'
import dbConnection from './db/connection'
import cookieSession from 'cookie-session'
import passport from 'passport'
import authRouter from './route/auth'
import commentRouter from './route/comment'
import pollRouter from './route/poll'
import userRouter from './route/user'
import voteRouter from './route/vote'

const app = express()
const PORT = process.env.PORT || 8000

// Initialise connection (production) or in memory (development) database
dbConnection.init('fatigued')

app.set('port', PORT)
app.use(json())
app.use(urlencoded({ extended: false }))

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // Day
    keys: [process.env.SESSION_COOKIE_KEY || ''],
  }),
)

app.use(passport.initialize())
app.use(passport.session())

app.use('/auth', authRouter)
app.use('/comment', commentRouter)
app.use('/poll', pollRouter)
app.use('/user', userRouter)
app.use('/vote', voteRouter)

// Route client
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')))
  app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../../client/build/index.html'))
  })
} else {
  app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../../client/tmp/dev-server/index.html'))
  })
}

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
})
