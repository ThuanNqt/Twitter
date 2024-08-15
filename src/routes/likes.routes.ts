import { Router } from 'express'
import { likeTweetController, unLikeTweetController } from '~/controllers/likes.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const likeRouter = Router()

/**
 * Description: Like Tweet
 * Path: /
 * Method: POST
 * Header: {Authorization: Bearer <access_token>}
 * Body: {tweet_id: string}
 */
likeRouter.post('/', accessTokenValidator, verifiedUserValidator, wrapAsync(likeTweetController))

/**
 * Description: UnLike Tweet
 * Path: /:tweet_id
 * Method: DELETE
 * Header: {Authorization: Bearer <access_token>}
 */
likeRouter.delete('/tweets/:tweet_id', accessTokenValidator, verifiedUserValidator, wrapAsync(unLikeTweetController))

export default likeRouter
