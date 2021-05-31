import { NextFunction, Request, Response } from 'express'
import { deleteComment } from '../model/comment'
import { deletePoll } from '../model/poll'
import { deleteUser } from '../model/user'
import { deleteVote } from '../model/vote'
import { pathToCollectionItem } from './helpers/collectionNameByRoute'

const deleteOperators = {
  comment: deleteComment,
  poll: deletePoll,
  user: deleteUser,
  vote: deleteVote,
}

export async function removeDocument(req: Request, res: Response, next: NextFunction) {
  const { id, collectionName } = pathToCollectionItem(req, res)
  const doc = await deleteOperators[collectionName](id)
  res.locals.data = doc
  next()
}
