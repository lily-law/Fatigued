import { MongoClient } from 'mongodb'
import { MongoMemoryServer } from 'mongodb-memory-server'

const initDB = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.MONGODB_URL) {
        await MongoClient.connect(process.env.MONGODB_URL)
      } else {
        throw new Error('MONGODB_URL not set in .env file!')
      }
    } else {
      new MongoMemoryServer()
    }
    console.log(`MongoDB Connected...`)
  } catch (err) {
    console.error(err.message)
    // Exit process with failure
    process.exit(1)
  }
}

export default initDB
