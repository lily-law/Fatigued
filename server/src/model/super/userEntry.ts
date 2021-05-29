import { ObjectId } from 'mongodb'
import BaseDoc, { IBaseDocProps } from './baseDoc'
import PathObject from './pathObject'

export interface IUserEntryProps extends IBaseDocProps {
  owner: { id: ObjectId }
  path?: Array<PathObject>
}

export default class UserEntry extends BaseDoc {
  constructor({ _id, timeCreated, owner, path = [] }: IUserEntryProps) {
    super({ _id, timeCreated })
    this.owner = owner
    this.path = path
  }
  owner
  path

  get parent() {
    return this.path[0]
  }
}
