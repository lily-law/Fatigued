import { Request, Response } from 'express'
import localDataToResData from './helpers/localDataToResData'

const resDataErrors = {
  GET: 404,
  POST: 500,
  PATCH: 500,
  PUT: 500,
  DELETE: 500,
}

export async function handleResponse(req: Request, res: Response) {
  await localDataToResData(res)
  if (res.locals.resData) {
    res.send(res.locals.resData)
  } else {
    if (!Object.keys(resDataErrors).includes(req.method)) {
      throw new Error(`Unknown req method ${req.method}`)
    }
    res.status(resDataErrors[req.method as keyof typeof resDataErrors]).end()
  }
}
