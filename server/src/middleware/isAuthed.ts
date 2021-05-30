import { NextFunction, Request, Response } from 'express'

export default function (req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    res.status(404).end()
    return
  }
  next()
}
