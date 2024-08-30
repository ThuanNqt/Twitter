import { Collection, Db, MongoClient, ServerApiVersion } from 'mongodb'
import { envConfig } from '~/constants/config'
import Bookmark from '~/models/schemas/Bookmark.schema'
import Conversation from '~/models/schemas/Conversations.schema'
import Follower from '~/models/schemas/Follower.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Like from '~/models/schemas/Like.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import User from '~/models/schemas/User.schema'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@twitter.efgsz4l.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
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

  async indexTweets() {
    const exist = await this.tweets.indexExists(['content_text'])
    if (!exist) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }

  // get collection users
  get users(): Collection<User> {
    return this.db.collection(envConfig.dbUsersCollection)
  }

  // get collection refresh_token
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshTokensCollection)
  }

  // get collection refresh_token
  get followers(): Collection<Follower> {
    return this.db.collection(envConfig.dbFollowersCollection)
  }

  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(envConfig.dbVideoStatusCollection)
  }

  get tweets(): Collection<Tweet> {
    return this.db.collection(envConfig.dbTweetsCollection)
  }

  get hashtags(): Collection<Hashtag> {
    return this.db.collection(envConfig.dbHashtagsCollection)
  }

  get bookmarks(): Collection<Bookmark> {
    return this.db.collection(envConfig.dbBookmarksCollection)
  }

  get likes(): Collection<Like> {
    return this.db.collection(envConfig.dbLikesCollection)
  }

  get conversations(): Collection<Conversation> {
    return this.db.collection(envConfig.dbConversationsCollection)
  }
}

const databaseService = new DatabaseService()
export default databaseService
