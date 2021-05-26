import { Db, MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

class DBConnection {
  constructor() {
    this.client = null
    this.db = null
  }
  client: null | MongoClient
  db: null | Db
  async init(dbName: string) {
    let mongoURI
    try {
      if (process.env.NODE_ENV === 'production') {
        if (process.env.MONGODB_URL) {
          mongoURI = process.env.MONGODB_URL
        }
        else {
          throw new Error('MONGODB_URL not set in .env file!')
        }
      } else {
        const mongoMemoryServer = new MongoMemoryServer()
        mongoURI = await mongoMemoryServer.getUri()
      }
      this.client = await MongoClient.connect(mongoURI)
      this.db = this.client.db(dbName)
      console.log(`MongoDB Connected...`)
    } catch (err) {
      console.error(err.message)
      // Exit process with failure
      process.exit(1)
    }
  }
}

export default new DBConnection()
