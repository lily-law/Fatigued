import { ObjectId } from 'mongodb'

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
}
