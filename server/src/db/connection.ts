import { Db, MongoClient } from 'mongodb'

class DBConnection {
  constructor() {
    this.client = null
    this._db = null
  }
  client: null | MongoClient
  _db: null | Db
  async init(dbName: string) {
    let mongoURI
    try {
      if (process.env.MONGODB_URL) {
        mongoURI = process.env.MONGODB_URL
      } else {
        throw new Error('MONGODB_URL not set in .env file!')
      }
      this.client = await MongoClient.connect(mongoURI)
      this._db = this.client.db(dbName)
      console.log(`MongoDB Connected...`)
    } catch (err) {
      console.error(err.message)
      // Exit process with failure
      process.exit(1)
    }
  }

  get db() {
    if (!this._db) {
      throw new Error('DBConnection not initialised!')
    }
    return this._db as Db
  }
}

export default new DBConnection()
