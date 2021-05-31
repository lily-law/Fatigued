import { NextFunction, Request, Response } from 'express'
import { readComment, readComments } from '../model/comment'
import { readPoll, readPolls } from '../model/poll'
import { readUser, readUsers } from '../model/user'
import { readVote, readVotes } from '../model/vote'
import { pathToCollectionItem, pathToCollectionRoot } from './helpers/collectionNameByRoute'

const readOperatorsById = {
  comment: readComment,
  poll: readPoll,
  user: readUser,
  vote: readVote,
}

const readOperatorsByQuery = {
  comments: readComments,
  polls: readPolls,
  users: readUsers,
  votes: readVotes,
}

export async function getDocumentById(req: Request, res: Response, next: NextFunction) {
  const { id, collectionName } = pathToCollectionItem(req, res)
  const doc = await readOperatorsById[collectionName](id)
  res.locals.data = doc
  next()
}

export async function getDocumentsByQuery(req: Request, res: Response, next: NextFunction) {
  const collectionName = pathToCollectionRoot(req, res)
  const docs = await (await readOperatorsByQuery[collectionName]({ ...req.query })).toArray()
  res.locals.data = docs
  next()
}
