import CRUDMethods from '../db/crudMethods'
import Thread, { IThreadProps } from './super/thread'

export interface IPollProps extends IThreadProps {}

export default class Poll extends Thread {
  toResData() {
    const { _id: id, owner, content, votes, comments, timeCreated } = this
    return { id, owner, content, votes, comments, timeCreated }
  }
  toDBData() {
    const { _id, owner, content, votes, comments, timeCreated } = this
    return { _id, owner, content, votes, comments, timeCreated }
  }
}

export const {
  createPoll, // TODO: on creating poll call addVote on owner user
  readPoll,
  readPolls,
  updatePoll, // TODO: on updating poll call addVote on owner user
  deletePoll, // TODO: on deleting poll call addVote on owner user
} = new CRUDMethods<IPollProps>({ collectionName: 'poll', Model: Poll }).methods
