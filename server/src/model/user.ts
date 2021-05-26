import CRUDMethods from "../db/crudMethods";
import BaseDoc, { IBaseDocProps } from "./super/baseDoc";

export interface IUserFields extends IBaseDocProps {
  profile?: {
    avatar: { url: string }
    name: string
    timeUpdated: Date
  }
  recentActivity?: {
    polls: []
    votes: []
    comments: []
    timeUpdated: Date
  }
}
export interface IUser extends BaseDoc {
  profile: {
    avatar: { url: string }
    name: string
    timeUpdated: Date
  }
  recentActivity: {
    polls: []
    votes: []
    comments: []
    timeUpdated: Date
  }
}

export default class User extends BaseDoc {
  constructor() {
    super({})
    this._profile = {
      avatar: { url: '' },
      name: '',
      timeUpdated: this.timeCreated,
    }
    this._recentActivity = {
      polls: [],
      votes: [],
      comments: [],
      timeUpdated: this.timeCreated,
    }
  }
  _profile: IUser['profile']
  _recentActivity: IUser['recentActivity']

  get profile() {
    return this._profile
  }
  set profile(data: IUser['profile']) {
    this._profile = {
      ...data,
      timeUpdated: new Date()
    }
  }

  get recentActivity() {
    return this._recentActivity
  }
  set recentActivity(data: IUser['recentActivity']) {
    this._recentActivity = {
      ...data,
      timeUpdated: new Date()
    }
  }

  toResData() {
    const { _id: id, profile, recentActivity, timeCreated } = this
    return { id, profile, recentActivity, timeCreated }
  }
  toDBData() {
    const { _id, profile, recentActivity, timeCreated } = this
    return { _id, profile, recentActivity, timeCreated }
  }
}

export const {
  createUser,
  readUser,
  readUsers,
  updateUser,
  deleteUser,
} = new CRUDMethods<IUserFields>({collectionName: 'user', Model: User}).methods