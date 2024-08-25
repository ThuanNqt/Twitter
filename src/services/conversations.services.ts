import { ObjectId } from 'mongodb'
import databaseService from './database.services'

class ConversationService {
  async getConversation({
    sender_id,
    receiver_id,
    page,
    limit
  }: {
    sender_id: string
    receiver_id: string
    page: number
    limit: number
  }) {
    const filter = {
      $or: [
        {
          sender_id: new ObjectId(sender_id),
          receiver_id: new ObjectId(receiver_id)
        },
        {
          sender_id: new ObjectId(receiver_id),
          receiver_id: new ObjectId(sender_id)
        }
      ]
    }
    const conversations = await databaseService.conversations
      .find(filter)
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray()

    const totalMessage = await databaseService.conversations.countDocuments(filter)
    return {
      conversations,
      total: totalMessage
    }
  }
}

const conversationService = new ConversationService()
export default conversationService
