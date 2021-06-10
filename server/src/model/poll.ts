import { ObjectId } from 'mongodb'
import CRUDMethods from '../db/crudMethods'
import Thread, { IThreadProps } from './super/thread'
import { readUser } from './user'

export interface IPollProps extends IThreadProps {}

export default class Poll extends Thread {
  constructor(props: IPollProps) {
    super(props)
    this.toResData = this.toResData.bind(this)
    this.toDBData = this.toDBData.bind(this)
  }
  toResData() {
    const { _id: id, owner, content, votes, comments, timeCreated } = this
    return { id, owner, content, votes, comments, timeCreated }
  }
  toDBData() {
    const { _id, owner, content, votes, comments, timeCreated } = this
    return { _id, owner, content, votes, comments, timeCreated }
  }
}

const crudMethods = new CRUDMethods<IPollProps, Poll>({ collectionName: 'poll', Model: Poll })

export const { readOne: readPoll, readMany: readPolls } = crudMethods

export async function createPoll(props: IPollProps) {
  const modelDoc = await crudMethods.createOne(props)
  // update owner log
  const userDoc = await readUser(modelDoc.owner.id)
  userDoc.addPoll(modelDoc)
  return modelDoc
}
export async function updatePoll({ id, patch }: { id: ObjectId; patch: IPollProps }) {
  const newPoll = await crudMethods.updateOne({ id, patch })
  // update owner log
  const userDoc = await readUser(newPoll.owner.id)
  userDoc.updatePoll(newPoll)
  return newPoll
}
export async function deletePoll(id: ObjectId) {
  const modelDoc = await crudMethods.deleteOne(id)
  // update owner log
  const userDoc = await readUser(modelDoc.owner.id)
  userDoc.removePoll(modelDoc)
  return modelDoc
}
