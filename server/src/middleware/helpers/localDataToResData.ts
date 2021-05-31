import { Response } from 'express'

export default async function localDataToResData(res: Response) {
  if (Array.isArray(res.locals.data)) {
    res.locals.resData = res.locals.data.map((doc) => doc.toResData())
  } else {
    res.locals.resData = res.locals.data.toResData()
  }
  return
}
