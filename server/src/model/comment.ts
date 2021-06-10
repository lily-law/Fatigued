import { ObjectId } from 'mongodb'
import CRUDMethods from '../db/crudMethods'
import Poll from './poll'
import Thread, { IThreadProps } from './super/thread'
import { readUser } from './user'

export interface ICommentProps extends IThreadProps {}

export type CommentableType = Poll | Comment

export default class Comment extends Thread {
  constructor(props: ICommentProps) {
    super(props)
    this.toResData = this.toResData.bind(this)
    this.toDBData = this.toDBData.bind(this)
  }
  toResData() {
    const { _id: id, owner, parent, content, votes, comments, timeCreated } = this
    return { id, owner, parent, content, votes, comments, timeCreated }
  }
  toDBData() {
    const { _id, owner, path, content, votes, comments, timeCreated } = this
    return { _id, owner, path, content, votes, comments, timeCreated }
  }
}

const crudMethods = new CRUDMethods<ICommentProps, Comment>({ collectionName: 'comment', Model: Comment })

export const { readOne: readComment, readMany: readComments } = crudMethods

export async function createComment(props: ICommentProps) {
  const modelDoc = await crudMethods.createOne(props)
  // update parent log
  const parentDoc = (await modelDoc.parent.getDocument()) as CommentableType
  parentDoc.addComment(modelDoc)
  // update owner log
  const userDoc = await readUser(modelDoc.owner.id)
  userDoc.addComment(modelDoc)
  return modelDoc
}
export async function updateComment({ id, patch }: { id: ObjectId; patch: ICommentProps }) {
  const newComment = await crudMethods.updateOne({ id, patch })
  // update parent log
  const parentDoc = (await newComment.parent.getDocument()) as CommentableType
  parentDoc.updateComment(newComment)
  // update owner log
  const userDoc = await readUser(newComment.owner.id)
  userDoc.updateComment(newComment)
  return newComment
}
export async function deleteComment(id: ObjectId) {
  const modelDoc = await crudMethods.deleteOne(id)
  // update parent log
  const parentDoc = (await modelDoc.parent.getDocument()) as CommentableType
  parentDoc.removeComment(modelDoc)
  // update owner log
  const userDoc = await readUser(modelDoc.owner.id)
  userDoc.removeComment(modelDoc)
  return modelDoc
}
