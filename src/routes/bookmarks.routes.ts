import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmarks.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const bookmarkRouter = Router()

/**
 * Description: Bookmark Tweet
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {tweet_id: string}
 */
bookmarkRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapAsync(bookmarkTweetController))

export default bookmarkRouter
