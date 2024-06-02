import { MongoClient, ServerApiVersion } from 'mongodb'
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.efgsz4l.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
  }
  async connect() {
    try {
      // Send a ping to confirm a successful connection
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Could not connect to MongoDB', error)
      await this.client.close()
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
