import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import Comment, { readComment, readComments } from '../model/comment'
import Poll, { readPoll, readPolls } from '../model/poll'
import User, { readUser, readUsers } from '../model/user'
import Vote, { readVote, readVotes } from '../model/vote'

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
  const id = new ObjectId(req.params.id)
  const collectionName = req.baseUrl.substr(1) as 'comment' | 'poll' | 'user' | 'vote'
  if (!readOperatorsById.hasOwnProperty(collectionName)) {
    throw new Error(`No such resource ${collectionName}! Set up an invalid route?`)
  }
  const doc = await readOperatorsById[collectionName](id)
  const resData = doc.toResData()
  res.locals.data = resData
  next()
  return resData
}

export async function getDocumentsByQuery(req: Request, res: Response, next: NextFunction) {
  const collectionName = (req.baseUrl.substr(1) + 's') as 'comments' | 'polls' | 'users' | 'votes'
  if (!readOperatorsByQuery.hasOwnProperty(collectionName)) {
    throw new Error(`No such resource ${collectionName}! Set up an invalid route?`)
  }
  const docs = await (await readOperatorsByQuery[collectionName]({ ...req.query })).toArray()
  const resData = docs.map((doc: Comment | Poll | User | Vote) => doc.toResData())
  res.locals.data = resData
  next()
  return resData
}
