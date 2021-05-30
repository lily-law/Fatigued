import { NextFunction, Request, Response } from 'express'
import { createComment, updateComment } from '../model/comment'
import { createPoll, updatePoll } from '../model/poll'
import { createUser, updateUser } from '../model/user'
import { createVote, updateVote } from '../model/vote'
import { pathToCollectionItem, pathToCollectionRoot } from './helpers/collectionNameByRoute'

const postOperators = {
    comments: createComment,
    polls: createPoll,
    users: createUser,
    votes: createVote,
}

export async function setPostDocument(req: Request, res: Response, next: NextFunction) {
    const collectionName = pathToCollectionRoot(req, res)
    const doc = await postOperators[collectionName](req.body)
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
    const doc = await updateOperators[collectionName]({ id, patch: req.body })
    res.locals.data = doc
    next()
}