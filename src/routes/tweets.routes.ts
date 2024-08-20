import { isUserLoggedInValidator } from './../middlewares/users.middlewares'
import { Router } from 'express'
import { createTweetController, getTweetChildrenController, getTweetController } from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  tweetIdValidator
} from '~/middlewares/tweets.middlewares'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const tweetsRouter = Router()

/**
 * Description: Create tweet
 * Path: /
 * Method: Post
 * Body: TweetRequestBody
 */

tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifiedUserValidator,
  createTweetValidator,
  wrapAsync(createTweetController)
)

/**
 * Description: Get Tweet detail
 * Path: /:tweet_id
 * Method: Get
 * Header: {Authorization: Bearer <access_token>}
 */
tweetsRouter.get(
  '/:tweet_id',
  tweetIdValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  wrapAsync(audienceValidator),
  wrapAsync(getTweetController)
)

/**
 * Description: Get Tweet Children
 * Path: /:tweet_id/children
 * Method: Get
 * Header: {Authorization: Bearer <access_token>}
 * Query: {limit: number, page: number, tweet_type: TweetType}
 */
tweetsRouter.get(
  '/:tweet_id/children',
  tweetIdValidator,
  getTweetChildrenValidator,
  isUserLoggedInValidator(accessTokenValidator),
  isUserLoggedInValidator(verifiedUserValidator),
  wrapAsync(audienceValidator),
  wrapAsync(getTweetChildrenController)
)

export default tweetsRouter
