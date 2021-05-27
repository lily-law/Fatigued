import CRUDMethods from '../db/crudMethods'
import Thread, { IThreadProps } from './super/thread'

export interface ICommentProps extends IThreadProps {}

export default class Comment extends Thread {
  toResData() {
    const { _id: id, owner, parent, content, votes, comments, timeCreated } = this
    return { id, owner, parent, content, votes, comments, timeCreated }
  }
  toDBData() {
    const { _id, owner, path, content, votes, comments, timeCreated } = this
    return { _id, owner, path, content, votes, comments, timeCreated }
  }
}

export const {
  createComment, // TODO: on creating comment call addVote on parent + owner user
  readComment,
  readComments,
  updateComment, // TODO: on updating comment call addVote on parent + owner user
  deleteComment, // TODO: on deleting comment call addVote on parent + owner user
} = new CRUDMethods<ICommentProps>({ collectionName: 'comment', Model: Comment }).methods
