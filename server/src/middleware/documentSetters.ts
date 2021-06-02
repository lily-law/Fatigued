import { NextFunction, Request, Response } from 'express'
import { createComment, updateComment } from '../model/comment'
import { createPoll, updatePoll } from '../model/poll'
import { createUser, updateUser } from '../model/user'
import { createVote, updateVote } from '../model/vote'
import { pathToCollectionItem, pathToCollectionRoot } from './helpers/collectionNameByRoute'
import { matchedData } from 'express-validator'
import shallowRemoveFalseyFields from './helpers/shallowRemoveFalseyFields'

const postOperators = {
  comments: createComment,
  polls: createPoll,
  users: createUser,
  votes: createVote,
}

export async function setPostDocument(req: Request, res: Response, next: NextFunction) {
    const collectionName = pathToCollectionRoot(req, res)
    const bodyData = matchedData(req, { locations: ['body'], includeOptionals: true })
    const data: any = shallowRemoveFalseyFields(bodyData)
    const doc = await postOperators[collectionName](data)
    res.locals.data = doc
    next()
}

const updateOperators = {
  comment: updateComment,
  poll: updatePoll,
  user: updateUser,
  vote: updateVote,
}

export async function setPatchDocument(req: Request, res: Response, next: NextFunction) {
    const { id, collectionName } = pathToCollectionItem(req, res)
    const bodyData = matchedData(req, { locations: ['body'], includeOptionals: true })
    const data: any = shallowRemoveFalseyFields(bodyData)
    const doc = await updateOperators[collectionName]({ id, patch: data })
    res.locals.data = doc
    next()
}
