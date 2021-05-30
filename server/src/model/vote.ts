import { ObjectId } from 'mongodb'
import CRUDMethods from '../db/crudMethods'
import Comment from './comment'
import Poll from './poll'
import Thread from './super/thread'
import UserEntry, { IUserEntryProps } from './super/userEntry'
import { readUser } from './user'

export interface IVoteProps extends IUserEntryProps {
  _id?: ObjectId
  options: {
    [title: string]: string // Key and Value for variable (range) inputs, otherwise Key === value
  }
  timeUpdated?: Date
  timeCreated?: Date
}

export type VotableType = Poll | Thread | Comment

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

const crudMethods = new CRUDMethods<IVoteProps, Vote>({ collectionName: 'vote', Model: Vote })

export const { readOne: readVote, readMany: readVotes } = crudMethods

export async function createVote(props: IVoteProps) {
  const modelDoc = await crudMethods.createOne(props)
  // update parent log
  const parentDoc = (await modelDoc.parent.getDocument()) as VotableType
  parentDoc.addVote(modelDoc)
  // update owner log
  const userDoc = await readUser(modelDoc.owner.id)
  userDoc.addVote(modelDoc)
  return modelDoc
}
export async function updateVote({ id, patch }: { id: ObjectId; patch: IVoteProps }) {
  const oldVote = await crudMethods.readOne(id)
  const newVote = await crudMethods.updateOne({ id, patch })
  // update parent log
  const parentDoc = (await newVote.parent.getDocument()) as VotableType
  parentDoc.updateVote({ oldVote, newVote })
  // update owner log
  const userDoc = await readUser(newVote.owner.id)
  userDoc.updateVote(newVote)
  return newVote
}
export async function deleteVote(id: ObjectId) {
  const modelDoc = await crudMethods.deleteOne(id)
  // update parent log
  const parentDoc = (await modelDoc.parent.getDocument()) as VotableType
  parentDoc.removeVote(modelDoc)
  // update owner log
  const userDoc = await readUser(modelDoc.owner.id)
  userDoc.removeVote(modelDoc)
  return modelDoc
}
