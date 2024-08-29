import { UserVerifyStatus } from '~/constants/enums'
import { TokenPayload } from '~/models/requests/User.requests'
import { verifyAccessTokenValidator } from './commons'
import { ErrorWithStatus } from '~/models/Errors'
import { USER_MESSAGES } from '~/constants/messages'
import { HTTP_STATUS } from '~/constants/httpStatus'
import Conversation from '~/models/schemas/Conversations.schema'
import { ObjectId } from 'mongodb'
import databaseService from '~/services/database.services'
import { Server as ServerHttp } from 'http'
import { Server } from 'socket.io'

const initSocket = (httpServer: ServerHttp) => {
  const io = new Server(httpServer, {
    cors: {
      origin: 'http://localhost:3000'
    }
  })

  const users: {
    [key: string]: {
      socket_id: string
    }
  } = {}

  io.use(async (socket, next) => {
    const { Authorization } = socket.handshake.auth
    const access_token = Authorization?.split(' ')[1]

    try {
      const decoded_authorization = await verifyAccessTokenValidator(access_token)
      const { verify } = decoded_authorization as TokenPayload
      if (verify !== UserVerifyStatus.Verified) {
        throw new ErrorWithStatus({
          message: USER_MESSAGES.USER_NOT_VERIFIED,
          status: HTTP_STATUS.FORBIDDEN
        })
      }
      // Truyền decoded_authorization vào socket để sử dụng ở các middlewares khác
      socket.handshake.auth.decoded_authorization = decoded_authorization
      socket.handshake.auth.access_token = access_token
      next()
    } catch (error) {
      next({
        message: 'Unauthorized',
        name: 'Unauthorized Error',
        data: error
      })
    }
  })

  io.on('connection', (socket) => {
    console.log(`user ${socket.id} connected!!!`)

    const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
    users[user_id] = {
      socket_id: socket.id
    }
    // console.log(users)

    socket.use(async (packet, next) => {
      const { access_token } = socket.handshake.auth
      try {
        await verifyAccessTokenValidator(access_token)
        next()
      } catch (error) {
        next(new Error('Unauthorized'))
      }
    })

    socket.on('error', (error) => {
      if (error.message === 'Unauthorized') {
        socket.disconnect()
      }
    })

    socket.on('send_message', async (data) => {
      const { receiver_id, sender_id, content } = data.payload
      const receiver_socket_id = users[receiver_id]?.socket_id

      const conversation = new Conversation({
        sender_id: new ObjectId(sender_id),
        receiver_id: new ObjectId(receiver_id),
        content: content
      })
      const result = await databaseService.conversations.insertOne(conversation)

      conversation._id = result.insertedId

      if (receiver_socket_id) {
        socket.to(receiver_socket_id).emit('receiver_message', {
          payload: conversation
        })
      }
    })

    socket.on('disconnect', () => {
      delete users[user_id]
      console.log(`user ${socket.id} disconnected!`)
    })
  })
}

export default initSocket
