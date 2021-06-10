import CRUDMethods from '../db/crudMethods'
import Comment from './comment'
import applyMixins from './mixin/applyMixin'
import CommentLogQueue from './mixin/commentLogQueue'
import PollLogQueue from './mixin/pollLogQueue'
import VoteLogQueue from './mixin/voteLogQueue'
import Poll from './poll'
import BaseDoc, { IBaseDocProps } from './super/baseDoc'
import Vote from './vote'

export interface IUserFields extends IBaseDocProps {
  profile?: {
    avatar: { url: string }
    name: string
    timeUpdated?: Date
  }
  polls?: Array<Poll>
  votes?: Array<Vote>
  comments?: Array<Comment>
}
export interface IUser extends BaseDoc {
  profile: {
    avatar: { url: string }
    name: string
    timeUpdated: Date
  }
  polls: Array<Poll>
  votes: Array<Vote>
  comments: Array<Comment>
}

class User extends BaseDoc {
  constructor({ _id, profile, polls = [], votes = [], comments = [] }: IUserFields) {
    super({ _id })
    this._profile = {
      avatar: { url: '' },
      name: '',
      timeUpdated: this.timeCreated,
      ...profile,
    }
    this.polls = polls
    this.votes = votes
    this.comments = comments
    this.setProfile = this.setProfile.bind(this)
    this.toResData = this.toResData.bind(this)
    this.toDBData = this.toDBData.bind(this)
  }
  _profile: IUser['profile']
  polls
  votes
  comments

  get profile() {
    return this._profile
  }
  set profile(data: IUser['profile']) {
    this._profile = data
  }
  setProfile(data: IUserFields['profile']) {
    this.profile = {
      ...this._profile,
      ...data,
      timeUpdated: new Date(),
    }
  }

  toResData() {
    const { _id: id, profile, polls, votes, comments, timeCreated } = this
    return { id, profile, polls, votes, comments, timeCreated }
  }
  toDBData() {
    const { _id, profile, polls, votes, comments, timeCreated } = this
    return { _id, profile, polls, votes, comments, timeCreated }
  }
}

interface User extends VoteLogQueue, CommentLogQueue, PollLogQueue {}
applyMixins(User, [VoteLogQueue, CommentLogQueue, PollLogQueue])
export default User

export const {
  createOne: createUser,
  readOne: readUser,
  readMany: readUsers,
  updateOne: updateUser,
  deleteOne: deleteUser,
} = new CRUDMethods<IUserFields, User>({
  collectionName: 'user',
  Model: User,
})
