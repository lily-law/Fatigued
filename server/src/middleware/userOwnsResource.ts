import { NextFunction, Request, Response } from 'express'

export default function userOwnsResource(req: Request, res: Response, next: NextFunction) {
  const documents = Array.isArray(res.locals.data) ? res.locals.data : [res.locals.data]
  const userHasAuth = documents.every(({ owner }) => owner?.id === req.user._id)
  if (!userHasAuth) {
    res.status(403).end()
    return
  }
  next()
}
