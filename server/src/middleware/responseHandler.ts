import { Request, Response } from 'express'

export function handleDocumentResponse(req: Request, res: Response) {
  if (res.locals.data) {
    res.send(res.locals.data)
  } else {
    res.status(404).end()
  }
}
