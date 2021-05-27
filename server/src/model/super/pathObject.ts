import { ObjectId } from 'mongodb'
import { readComment } from '../comment'
import { readPoll } from '../poll'
import { readUser } from '../user'
import { readVote } from '../vote'

export interface IPathObjectProps {
  collectionName: string
  documentId: ObjectId
}

export default class PathObject {
  constructor({ collectionName, documentId }: IPathObjectProps) {
    this.collectionName = collectionName
    this.documentId = documentId
  }
  collectionName
  documentId

  async getDocument() {
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
    }
  }
}
