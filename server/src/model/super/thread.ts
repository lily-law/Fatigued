import Comment from '../comment'
import applyMixins from '../mixin/applyMixin'
import CommentLogQueue from '../mixin/commentLogQueue'
import VoteMethods from '../mixin/voteMethods'
import UserEntry, { IUserEntryProps } from './userEntry'

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
      count: 0,
    },
  },
  down: {
    down: {
      count: 0,
    },
  },
}

class Thread extends UserEntry {
  constructor({
    _id,
    timeCreated,
    owner,
    path = [],
    content,
    votes = { options: defaultVoteOptions },
    comments,
  }: IThreadProps) {
    super({ _id, timeCreated, owner, path })
    this._content = {
      timeUpdated: this.timeCreated,
      ...content,
    }
    this._votes = {
      count: 0,
      timeUpdated: this.timeCreated,
      ...votes,
    }
    this._comments = {
      log: [],
      count: 0,
      timeUpdated: this.timeCreated,
      ...comments,
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

  set votes(data: IThread['votes']) {
    this._votes = {
      ...data,
      timeUpdated: new Date(),
    }
  }
  get votes() {
    return this._votes
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
}

// Add queued logging methods to prototype
interface Thread extends VoteMethods, CommentLogQueue {}
applyMixins(Thread, [VoteMethods, CommentLogQueue])
export default Thread
