import { TweetRequestBody } from '~/models/requests/Tweet.requests'
import databaseService from './database.services'
import Tweet from '~/models/schemas/Tweet.schema'
import { ObjectId } from 'mongodb'

class TweetService {
  async createTweet(body: TweetRequestBody, user_id: string) {
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [], // temporary empty
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const newTweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return newTweet
  }
}

const tweetsService = new TweetService()
export default tweetsService
