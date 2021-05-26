import Comment from '../comment'
import Vote from '../vote'
import UserEntry, { IUserEntryProps } from './userEntry'
import connection from '../../db/connection'
const { db } = connection

export interface IThreadProps extends IUserEntryProps {
  content: {
    text: string
    timeUpdated?: Date
  }
  votes?: {
    options: {
      [option: string]: {
        [value: string]: {
          count: number
        }
      }
    }
    count?: number
    timeUpdated?: Date
  }
  comments?: {
    log: Comment[]
    count: number
    timeUpdated: Date
  }
  timeCreated?: Date
}

export interface IThread extends UserEntry {
  content: {
    text: string
    timeUpdated: Date
  }
  votes: {
    options: {
      [option: string]: {
        [value: string]: {
          count: number
        }
      }
    }
    count: number
    timeUpdated: Date
  }
  comments: {
    log: Comment[]
    count: number
    timeUpdated: Date
  }
  timeCreated: Date
}

const defaultVoteOptions = {
  up: {
    up: {
      count: 0
    }
  },
  down: {
    down: {
      count: 0
    }
  }
}

export default class Thread extends UserEntry {
  constructor({ _id, timeCreated, owner, path = [], content, votes = { options: defaultVoteOptions }, comments }: IThreadProps) {
    super({ _id, timeCreated, owner, path })
    this._content = {
      timeUpdated: this.timeCreated,
      ...content,
    }
    this._votes = {
      count: 0,
      timeUpdated: this.timeCreated,
      ...votes
    }
    this._comments = {
      log: [],
      count: 0,
      timeUpdated: this.timeCreated,
      ...comments
    }
  }
  _content: IThread['content']
  _votes: IThread['votes']
  _comments: IThread['comments']

  set content(data: IThread['content']) {
    this._content = {
      ...data,
      timeUpdated: new Date(),
    }
  }
  get content() {
    return this._content
  }

  set votes(data: IThread["votes"]) {
    this._votes = {
      ...data,
      timeUpdated: new Date(),
    }
  }
  get votes() {
    return this._votes
  }
  addVote(vote: Vote) {
    for (let [option, value] of Object.entries(vote.options)) {
      if (!this._votes.options[option]?.[value]) {
        this._votes.options[option] = { [value]: { count: 0 } }
      }
      this._votes.options[option][value].count++
    }
    this._votes.count++
  }
  removeVote(vote: Vote) {
    for (let [option, value] of Object.entries(vote.options)) {
      if (!this._votes.options[option]?.[value]) {
        this._votes.options[option] = { [value]: { count: 0 } }
      }
      this._votes.options[option][value].count !== 0 && this._votes.options[option][value].count--
    }
    this._votes.count > 0 && this._votes.count--
  }
  updateVote({ oldVote, newVote }: { oldVote: Vote; newVote: Vote }) {
    this.removeVote(oldVote)
    this.addVote(newVote)
  }

  set comments(data: IThread['comments']) {
    this._comments = {
      ...data,
      timeUpdated: new Date(),
    }
  }
  get comments() {
    return this._comments
  }
  addComment(comment: Comment) {
    this.comments.log = [comment, ...this.comments.log.slice(0, 19)]
    this.comments.count++
  }
  async removeComment(comment: Comment) {
    const logLength = this.comments.log.length
    if (logLength > 0) {
      let newCommentsLog = this.comments.log.filter(({ _id }) => comment._id.toHexString() !== _id.toHexString())
      this.comments.count--
      if (newCommentsLog.length < logLength) { 
        // comment in log was found and removed so replace it
        const lastLogComment = newCommentsLog[newCommentsLog.length]
        const comment = await db.collection('comment').findOne({ 'content.timeUpdated': { $lt: lastLogComment.content.timeUpdated } })
        newCommentsLog = [...newCommentsLog, comment]
      }
      this.comments.log = newCommentsLog
    }
  }
  updateComment(comment: Comment) {
    let newCommentsLog = this.comments.log.filter(({ _id }) => comment._id.toHexString() !== _id.toHexString())
    this.comments.log = [comment, ...newCommentsLog.slice(0, 19)]
  }
}
