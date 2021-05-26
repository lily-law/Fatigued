import { ObjectId } from "mongodb"

export interface IBaseDocProps {
  _id?: ObjectId 
  timeCreated?: Date
}

export default class BaseDoc {
  constructor({ _id, timeCreated }: IBaseDocProps) {
    this._id = _id || new ObjectId()
    this.timeCreated = timeCreated || new Date()
  }
  _id
  timeCreated
}