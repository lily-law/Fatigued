import express, { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import passport from 'passport'
import { Profile, Strategy as GoogleStrategy, VerifyCallback } from 'passport-google-oauth20'
import isAuthed from '../middleware/isAuthed'
import { createAuth, findAuthByAuthoriserAndId } from '../model/auth'
import { createUser, readUser } from '../model/user'

const router = express.Router()

passport.use(
  'google',
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      callbackURL: '/auth/google/callback',
    },
    authUser,
  ),
)

router.get(
  '/google',
  (req: Request, res: Response, next: NextFunction) => {
    req.user && req.logOut()
    next()
  },
  passport.authenticate('google', { scope: ['profile'] }),
)

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req: Request, res: Response) => {
    res.send(`<script>window.close()</script>`)
  },
)

router.get('/logout', function (req, res) {
  req.logOut()
  req.session = null
  res.status(200).end()
})

router.get('/', isAuthed, (req, res) => {
  res.status(200).send(req.user)
})

async function authUser(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {
  const auth = await findAuthByAuthoriserAndId({ authoriser: 'google', id: profile.id })
  let id
  try {
    if (!auth) {
      // make profile and auth for new user
      const avatar = profile?.photos?.[0]
      const user = await createUser({
        profile: {
          name: profile.displayName,
          avatar: { url: avatar?.value || '' },
        },
      })
      await createAuth({
        owner: { id: user._id },
        authoriser: {
          google: {
            id: profile.id,
          },
        },
      })
      id = user._id
    } else {
      id = auth.owner.id
    }
    return done(null, id)
  } catch (err) {
    return done(err, id)
  }
}

passport.serializeUser(function (_id, cb) {
  cb(null, _id)
})

passport.deserializeUser(async function (_id: ObjectId, cb) {
  const user = await readUser(_id)
  let err
  if (!user) {
    err = new Error('User document not found')
  }
  cb(err, user)
})

export default router
