import { Request, Response } from 'express'

export function handleGetDocumentResponse(req: Request, res: Response) {
  if (res.locals.resData) {
    res.send(res.locals.resData)
  } else {
    res.status(404).end()
  }
}

export function handlePostDocumentResponse(req: Request, res: Response) {
  if (res.locals.resData) {
    res.send(res.locals.resData)
  } else {
    res.status(500).end()
  }
}

export function handlePatchDocumentResponse(req: Request, res: Response) {
  if (res.locals.resData) {
    res.send(res.locals.resData)
  } else {
    res.status(500).end()
  }
}

export function handleDeleteDocumentResponse(req: Request, res: Response) {
  if (res.locals.resData) {
    res.send(res.locals.resData)
  } else {
    res.status(500).end()
  }
}
