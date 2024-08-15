import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKE_MESSAGE } from '~/constants/messages'
import { LikeTweetReqBody } from '~/models/requests/Like.requests'
import { TokenPayload } from '~/models/requests/User.requests'
import likeService from '~/services/likes.services'

export const likeTweetController = async (req: Request<ParamsDictionary, any, LikeTweetReqBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.body

  const result = await likeService.likeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGE.LIKE_TWEET_SUCCESS,
    result
  })
}

export const unLikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { tweet_id } = req.params

  await likeService.unLikeTweet(user_id, tweet_id)
  return res.json({
    message: LIKE_MESSAGE.UN_LIKE_TWEET_SUCCESS
  })
}
