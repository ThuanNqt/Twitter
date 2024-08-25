import { Request, Response } from 'express'
import { CONVERSATION_MESSAGE } from '~/constants/messages'
import conversationService from '~/services/conversations.services'

export const getConversationsController = async (req: Request, res: Response) => {
  const { receiver_id } = req.params
  const sender_id = req.decoded_authorization?.user_id as string
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)

  const result = await conversationService.getConversation({
    sender_id,
    receiver_id,
    page,
    limit
  })

  return res.json({
    message: CONVERSATION_MESSAGE.GET_CONVERSATION_SUCCESSFULLY,
    result: {
      conversations: result.conversations,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
