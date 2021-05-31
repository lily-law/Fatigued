import { NextFunction, Request, Response } from 'express'

export async function documentsToResData(req: Request, res: Response, next: NextFunction) {
  if (!res.locals.data) {
    throw new Error(`No documents here! ${{ req, res }}`)
  }
  if (Array.isArray(res.locals.data)) {
    res.locals.resData = res.locals.data.map((doc) => doc.toResData())
  } else {
    res.locals.resData = res.locals.data.toResData()
  }
  next()
}
