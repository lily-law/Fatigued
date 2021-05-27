import { ObjectId } from 'mongodb'
import CRUDMethods from '../db/crudMethods'
import BaseDoc from './super/baseDoc'
import connection from '../db/connection'
const { db } = connection

export interface IAuthProps {
  owner: { id: ObjectId }
  authoriser: {
    google: {
      id: string
      oauth: string
    }
  }
}

export default class Auth extends BaseDoc {
  constructor({ owner, authoriser }: IAuthProps) {
    super({})
    this.owner = owner
    this.authoriser = authoriser
    this.timeUpdated = this.timeCreated
  }
  owner
  authoriser
  timeUpdated

  toDBData() {
    const { _id, owner, authoriser, timeUpdated, timeCreated } = this
    return { _id, owner, authoriser, timeUpdated, timeCreated }
  }
}

export const { createAuth, readAuth, updateAuth, deleteAuth } = new CRUDMethods<IAuthProps>({
  collectionName: 'auth',
  Model: Auth,
}).methods

export async function findAuthByAuthoriserAndId({ authoriser, id }: { authoriser: string; id: string }) {
  const dbDoc = await db.collection('auth').findOne({ [`authoriser.${authoriser}.id`]: id })
}
