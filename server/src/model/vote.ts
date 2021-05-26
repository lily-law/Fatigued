import { ObjectId } from 'mongodb'
import CRUDMethods from '../db/crudMethods'
import UserEntry, { IUserEntryProps } from './super/userEntry'

export interface IVoteProps extends IUserEntryProps {
  _id?: ObjectId
  options: {
    [title: string]: string // Key and Value for variable (range) inputs, otherwise Key === value
  }
  timeUpdated?: Date
  timeCreated?: Date
}

export default class Vote extends UserEntry {
  constructor({ _id, owner, path, options, timeUpdated, timeCreated }: IVoteProps) {
    super({ _id, timeCreated, owner, path })
    this._options = options
    this.timeUpdated = timeUpdated ? new Date(timeUpdated) : this.timeCreated
  }
  _options
  timeUpdated

  set options(data: IVoteProps['options']) {
    this._options = data
    this.timeUpdated = new Date()
  }
  get options() {
    return this._options
  }

  toResData() {
    const { _id: id, owner, parent, options, timeUpdated, timeCreated } = this
    return { id, owner, parent, options, timeUpdated, timeCreated }
  }
  toDBData() {
    const { _id, owner, path, options, timeUpdated, timeCreated } = this
    return { _id, owner, path, options, timeUpdated, timeCreated }
  }
}

export const {
  createVote, // TODO: on creating vote call addVote on parent + owner user
  readVote,
  readVotes,
  updateVote, // TODO: on updating vote call updateVote on parent + owner user
  deleteVote, // TODO: on deleting vote call updateVote on parent + owner user
} = new CRUDMethods<IVoteProps>({collectionName: 'vote', Model: Vote}).methods
