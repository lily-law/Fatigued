import { NextFunction, Request, Response } from 'express'
import User from '../model/user'
import { getDocumentById } from './documentGetters'

export async function userOwnsDocument(req: Request, res: Response, next: NextFunction) {
  const document = await getDocumentById(req, res)
  const ownerId = document instanceof User ? document._id : document.owner.id
  const userHasAuth = ownerId && req.user?._id && ownerId === req.user._id
  if (!userHasAuth) {
    res.status(403).end()
    return
  }
  next()
}
