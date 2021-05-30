import assert from 'assert/strict'
import { ObjectId } from 'mongodb'
import connection from '../db/connection'
import BaseDoc from '../model/super/baseDoc'
import { GenericModelType } from '../model/super/genericModel'
const { db } = connection

interface OutputMethods extends BaseDoc {
  toDBData(): { [field: string]: any }
}
export default class CRUDMethods<PropsType, Model extends OutputMethods> {
  constructor({ collectionName, Model }: { collectionName: string; Model: GenericModelType<PropsType, Model> }) {
    this.collectionName = collectionName
    this.Model = Model
  }
  collectionName
  Model

  async createOne(props: PropsType) {
    const modelDoc = new this.Model(props)
    const { insertedId } = await db.collection(this.collectionName).insertOne(modelDoc.toDBData())
    assert.strict(modelDoc._id, insertedId)
    return modelDoc
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
      filter = { ...filter, _id: { $in: ids } }
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
    return await result.map((dbDoc): Model => new this.Model(dbDoc))
  }
  async updateOne({ id, patch }: { id: ObjectId; patch: PropsType }) {
    const dbDoc = await db.collection(this.collectionName).findOne(id)
    const modelDoc = new this.Model(dbDoc)
    // Update any internal _ data first
    Object.entries(patch)
      .filter(([key]) => key[0] === '_')
      .forEach(([key, value]) => {
        /* @ts-ignore */
        modelDoc[key] = value
      })
    // Iterate each property so any setters can work
    Object.entries(patch)
      .filter(([key]) => key[0] !== '_')
      .forEach(([key, value]) => {
        /* @ts-ignore */
        modelDoc[key] = value
      })
    const { upsertedId } = await db.collection(this.collectionName).updateOne(id, modelDoc.toDBData())
    assert.strictEqual(upsertedId, modelDoc._id)
    return modelDoc
  }
  async deleteOne(id: ObjectId) {
    const dbDoc = await db.collection(this.collectionName).findOne(id)
    const modelDoc = new this.Model(dbDoc)
    const { deletedCount } = await db.collection(this.collectionName).deleteOne(id)
    return modelDoc
  }
}
