import { Router } from 'express'
import { getConversationsController } from '~/controllers/conversations.controllers'
import { accessTokenValidator, verifiedUserValidator } from '~/middlewares/users.middlewares'
import { wrapAsync } from '~/utils/handlers'

const conversationsRouter = Router()

/**
 * Description: Get conversations
 * Method: GET
 * Path: /receivers/:receiver_id
 * Header: Bearer <access_token>
 */
conversationsRouter.get(
  '/receivers/:receiver_id',
  accessTokenValidator,
  verifiedUserValidator,
  wrapAsync(getConversationsController)
)

export default conversationsRouter
