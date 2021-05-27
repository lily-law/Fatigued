import { ObjectId } from 'mongodb'
import connection from '../db/connection'
import IGenericModel from '../model/super/genericModel'
const { db } = connection

export default class CRUDMethods<PropsType> {
  constructor({ collectionName, Model }: { collectionName: string; Model: IGenericModel }) {
    this.collectionName = collectionName
    this.Model = Model
    this.name = this.collectionName[0].toUpperCase() + this.collectionName.substr(1)
  }
  collectionName
  Model
  name

  get methods() {
    return {
      [`create${this.name}`]: this.createOne,
      [`read${this.name}`]: this.readOne,
      [`read${this.name}s`]: this.readMany,
      [`update${this.name}`]: this.updateOne,
      [`delete${this.name}`]: this.deleteOne,
    }
  }

  async createOne(props: PropsType) {
    const modelDoc = new this.Model(props)
    const dbDoc = await db.collection(this.collectionName).insertOne(modelDoc.toDBData())
    return new this.Model(dbDoc)
  }
  async readOne(id: ObjectId) {
    const dbDoc = await db.collection(this.collectionName).findOne(id)
    return new this.Model(dbDoc)
  }
  async readMany({
    ids,
    beforeDate,
    beforeDatePath,
    afterDate,
    afterDatePath,
    limit,
  }: {
    ids?: Array<ObjectId>
    beforeDate?: Date
    beforeDatePath?: Array<string>
    afterDate?: Date
    afterDatePath?: Array<string>
    limit?: number
  }) {
    let filter = {}
    if (ids) {
      filter = { ...filter, _id: { $in: [1, 2, 3, 4] } }
    }
    if (beforeDate) {
      if (!beforeDatePath) {
        throw Error('Must specify beforeDatePath when using beforeDate query filter!')
      }
      filter = { ...filter, [beforeDatePath.join('.')]: { $lt: beforeDate } }
    }
    if (afterDate) {
      if (!afterDatePath) {
        throw Error('Must specify afterDatePath when using afterDate query filter!')
      }
      const filterDatePathData = (filter as any)[afterDatePath.join('.')] || {}
      filter = { ...filter, [afterDatePath.join('.')]: { ...filterDatePathData, $gte: afterDate } }
    }
    const result = limit
      ? db.collection(this.collectionName).find(filter).limit(limit)
      : db.collection(this.collectionName).find(filter)
    return await result.map((dbDoc) => new this.Model(dbDoc))
  }
  async updateOne({ id, patch }: { id: ObjectId; patch: PropsType }) {
    const dbDoc = await db.collection(this.collectionName).findOne(id)
    const modelDoc = new this.Model(dbDoc)
    // Update any internal _ data first
    Object.entries(patch)
      .filter(([key]) => key[0] === '_')
      .forEach(([key, value]) => {
        modelDoc[key] = value
      })
    // Iterate each property so any setters can work
    Object.entries(patch)
      .filter(([key]) => key[0] !== '_')
      .forEach(([key, value]) => {
        modelDoc[key] = value
      })
    const updatedData = await db.collection(this.collectionName).updateOne(id, modelDoc.toDBData())
    return new this.Model(updatedData)
  }
  async deleteOne(id: ObjectId) {
    const dbDoc = await db.collection(this.collectionName).deleteOne(id)
    return new this.Model(dbDoc)
  }
}
