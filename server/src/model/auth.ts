import { ObjectId } from 'mongodb'
import CRUDMethods from '../db/crudMethods'
import BaseDoc from './super/baseDoc'
import connection from '../db/connection'

export interface IAuthProps {
  owner: { id: ObjectId }
  authoriser: {
    google: {
      id: string
    }
  }
}

export default class Auth extends BaseDoc {
  constructor({ owner, authoriser }: IAuthProps) {
    super({})
    this.owner = owner
    this.authoriser = authoriser
    this.timeUpdated = this.timeCreated
    this.toDBData = this.toDBData.bind(this)
  }
  owner
  authoriser
  timeUpdated

  toDBData() {
    const { _id, owner, authoriser, timeUpdated, timeCreated } = this
    return { _id, owner, authoriser, timeUpdated, timeCreated }
  }
}

export const {
  createOne: createAuth,
  readOne: readAuth,
  updateOne: updateAuth,
  deleteOne: deleteAuth,
} = new CRUDMethods<IAuthProps, Auth>({
  collectionName: 'auth',
  Model: Auth,
})

export async function findAuthByAuthoriserAndId({ authoriser, id }: { authoriser: string; id: string }) {
  const dbDoc = await connection.db.collection('auth').findOne({ [`authoriser.${authoriser}.id`]: id })
  const result: Auth | false = dbDoc && new Auth(dbDoc)
  return result
}
