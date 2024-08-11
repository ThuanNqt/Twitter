import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import Follower from '~/models/schemas/Follower.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import User from '~/models/schemas/User.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.efgsz4l.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  // Connection
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Could not connect to MongoDB', error)
      await this.client.close()
    }
  }

  async indexUsers() {
    const indexExist = await this.users.indexExists(['email_1', 'email_1_password_1'])
    if (!indexExist) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
    }
  }

  async indexRefreshToken() {
    const indexExist = await this.users.indexExists(['token_1', 'exp_1'])
    if (!indexExist) {
      this.refreshTokens.createIndex({ token: 1 })
      this.refreshTokens.createIndex(
        { exp: 1 },
        {
          expireAfterSeconds: 0
        }
      )
    }
  }

  async indexVideoStatus() {
    const indexExist = await this.users.indexExists(['name_1'])
    if (!indexExist) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }

  async indexFollowers() {
    const indexExist = await this.users.indexExists(['user_id_1_followed_user_id_1'])
    if (!indexExist) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }

  // get collection users
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_USERS_COLLECTION as string)
  }

  // get collection refresh_token
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
  }

  // get collection refresh_token
  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_FOLLOWERS_COLLECTION as string)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_VIDEO_STATUS_COLLECTION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
