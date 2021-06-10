import { ObjectId } from 'mongodb'
import { readComment } from '../comment'
import Poll, { readPoll } from '../poll'
import User, { readUser } from '../user'
import Vote, { readVote } from '../vote'

export type DocumentTypes = Vote | Poll | Comment | User

export interface IPathObjectProps {
  collectionName: 'vote' | 'poll' | 'comment' | 'user'
  documentId: ObjectId
}

export default class PathObject {
  constructor({ collectionName, documentId }: IPathObjectProps) {
    this.collectionName = collectionName
    this.documentId = documentId
    this.getDocument = this.getDocument.bind(this)
  }
  collectionName
  documentId

  async getDocument(): Promise<DocumentTypes> {
    switch (this.collectionName) {
      case 'vote': {
        return await readVote(this.documentId)
      }
      case 'poll': {
        return await readPoll(this.documentId)
      }
      case 'comment': {
        return await readComment(this.documentId)
      }
      case 'user': {
        return await readUser(this.documentId)
      }
      default: {
        throw new Error(`Can not find document ${this.collectionName} ${this.documentId}`)
      }
    }
  }
}
